var BX_DB_EMPTY = { vocabulario: [], verbos: [], preposiciones: [], conectores: [], redemittel: [] };
function normalizeBxPayload(data) {
            if (!data || typeof data !== 'object') return { b1: { ...BX_DB_EMPTY }, b2: { ...BX_DB_EMPTY } };
            const b1 = data.b1 || data.B1;
            const b2 = data.b2 || data.B2;
            return {
                b1: b1 ? { ...BX_DB_EMPTY, ...b1 } : { ...BX_DB_EMPTY },
                b2: b2 ? { ...BX_DB_EMPTY, ...b2 } : { ...BX_DB_EMPTY }
            };
        }

const BX_DB_FALLBACK = normalizeBxPayload({
    b1: {
        vocabulario: [{ b1: "Daten werden geladen …", b2: "b1-b2-database.json fehlt oder Netzwerkfehler.", es: "", trick: "Coloca b1-b2-database.json junto a index.html en el servidor." }]
    },
    b2: {
        vocabulario: [{ b1: "Daten werden geladen …", b2: "Mismo JSON: claves b1 y b2.", es: "", trick: "Amplía arrays en el JSON sin tocar index.html." }]
    }
});

function tryBxSession() {
    try {
        const raw = sessionStorage.getItem('muller_b1b2_json_v1');
        if (!raw) return null;
        return normalizeBxPayload(JSON.parse(raw));
    } catch (e) {
        return null;
    }
}

function tryBxUserOverlay() {
    try {
        const raw = localStorage.getItem(MULLER_BX_USER_OVERLAY_KEY);
        if (!raw) return normalizeBxPayload({});
        return normalizeBxPayload(JSON.parse(raw));
    } catch (e) {
        return normalizeBxPayload({});
    }
}

function mergeBxLevel(base, extra) {
    const out = {};
    Object.keys(BX_DB_EMPTY).forEach((k) => {
        out[k] = [...(base[k] || []), ...(extra[k] || [])];
    });
    return out;
}

function mergeBxDatabases(remoteNorm, overlayNorm) {
    const r = normalizeBxPayload(remoteNorm || {});
    const o = normalizeBxPayload(overlayNorm || {});
    return {
        b1: mergeBxLevel(r.b1, o.b1),
        b2: mergeBxLevel(r.b2, o.b2)
    };
}

function mullerFindUserBxCategory(overlayNorm, level, uid) {
    if (!uid || !overlayNorm || !overlayNorm[level]) return null;
    const lv = overlayNorm[level];
    for (const cat of Object.keys(BX_DB_EMPTY)) {
        const arr = lv[cat];
        if (!Array.isArray(arr)) continue;
        if (arr.some((x) => x && x._mullerUid === uid)) return cat;
    }
    return null;
}

function mullerBxItemKey(item) {
    return (item.b1 || '') + '\u0000' + (item.b2 || '') + '\u0000' + (item.es || '');
}

function mullerLoadExternalScript(src, key) {
    if (!src || !key) return Promise.reject(new Error('Script URL inválida.'));
    try {
        if (!window.__mullerScriptPromises) window.__mullerScriptPromises = {};
        if (window.__mullerScriptPromises[key]) return window.__mullerScriptPromises[key];
        window.__mullerScriptPromises[key] = new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[data-muller-key="${key}"]`);
            if (existing) {
                existing.addEventListener('load', () => resolve(true), { once: true });
                existing.addEventListener('error', () => reject(new Error('No se pudo cargar ' + key)), { once: true });
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.dataset.mullerKey = key;
            s.onload = () => resolve(true);
            s.onerror = () => reject(new Error('No se pudo cargar ' + key));
            document.head.appendChild(s);
        });
        return window.__mullerScriptPromises[key];
    } catch (err) {
        return Promise.reject(err);
    }
}

async function mullerEnsurePdfJsLoaded() {
    if (window.pdfjsLib && typeof window.pdfjsLib.getDocument === 'function') return true;
    await mullerLoadExternalScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/legacy/build/pdf.min.js', 'pdfjs');
    return !!(window.pdfjsLib && typeof window.pdfjsLib.getDocument === 'function');
}

async function mullerEnsureTesseractLoaded() {
    if (typeof window.Tesseract !== 'undefined') return true;
    await mullerLoadExternalScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js', 'tesseract');
    return typeof window.Tesseract !== 'undefined';
}

/** Quita tarjetas de usuario cuyo Distribuir se hizo con un guion guardado concreto (id en Biblioteca). */
function mullerStripBxOverlayBySourceScriptId(overlayNorm, scriptId) {
    const sid = scriptId != null ? String(scriptId) : '';
    if (!sid) return normalizeBxPayload(overlayNorm || {});
    const o = JSON.parse(JSON.stringify(normalizeBxPayload(overlayNorm || {})));
    ['b1', 'b2'].forEach((lv) => {
        Object.keys(BX_DB_EMPTY).forEach((cat) => {
            o[lv][cat] = (o[lv][cat] || []).filter((x) => String(x && x._mullerSourceScriptId || '') !== sid);
        });
    });
    return o;
}