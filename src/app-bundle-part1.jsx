        const { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } = React;

        class MullerErrorBoundary extends React.Component {
            constructor(props) {
                super(props);
                this.state = { hasError: false, message: '' };
            }
            static getDerivedStateFromError(error) {
                return { hasError: true, message: error && error.message ? String(error.message) : 'Error inesperado' };
            }
            componentDidCatch(error, errorInfo) {
                try { console.error('MullerErrorBoundary', error, errorInfo); } catch (e) {}
            }
            handleReload = () => {
                try { window.location.reload(); } catch (e) {}
            };
            render() {
                if (!this.state.hasError) return this.props.children;
                return (
                    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <div style={{ width: '100%', maxWidth: '540px', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '14px', background: 'rgba(15,23,42,0.85)', padding: '1rem 1.1rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Se recuperó un error de la interfaz</h2>
                            <p style={{ margin: '0.55rem 0 0.2rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                                La app evitó una pantalla negra completa. Puedes recargar para continuar.
                            </p>
                            <p style={{ margin: '0.35rem 0 0.9rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                                Detalle: {this.state.message || 'sin detalle'}
                            </p>
                            <button type="button" onClick={this.handleReload} style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.55rem 0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                                Recargar aplicación
                            </button>
                        </div>
                    </div>
                );
            }
        }

        /** Supabase (gratis): Dashboard → Project Settings → API → Project URL y anon public key */
        window.MULLER_SUPABASE_URL = window.MULLER_SUPABASE_URL || 'https://mrimappoycvfujzegxdt.supabase.co';
        window.MULLER_SUPABASE_ANON_KEY = window.MULLER_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yaW1hcHBveWN2ZnVqemVneGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MzI1MDMsImV4cCI6MjA5MjIwODUwM30.L_5Lk3S_TgiaSe8jAAhTcQTbUsQiTjxA9pWq0ZDayBY';
        window.MULLER_CREATOR_EMAIL = window.MULLER_CREATOR_EMAIL || 'djplaza1@gmail.com';
        window.MULLER_REWARDED_AD_URL = window.MULLER_REWARDED_AD_URL || '';
        window.MULLER_PREMIUM_CHECKOUT_URL = window.MULLER_PREMIUM_CHECKOUT_URL || '';

        // --- COMPONENTE AISLANTE DE ICONOS (Lucide + contenedor “premium” opcional) ---
        const Icon = ({ name, className, nav = false }) => {
            const inner = <span className="lucide-wrapper" dangerouslySetInnerHTML={{ __html: `<i data-lucide="${name}" class="${className || ''}"></i>` }} />;
            return nav ? <span className="nav-tab-icon">{inner}</span> : inner;
        };

        // --- BASES DE DATOS Y CONFIGURACIÓN INICIAL (sin cambios) ---
        const DEFAULT_GUION = [
            { speaker: 'Lukas', text: 'Hallo Elena! Heute ist ein großer Tag.', translation: '¡Hola Elena! Hoy es un gran día.', vocab: [{ de: 'der Tag', es: 'el día', diff: 0 }] },
            { speaker: 'Lukas', text: 'Ich bin nervös, weil wir Bilder ausstellen.', translation: 'Estoy nervioso porque exponemos cuadros.', vocab: [{ de: 'ausstellen', es: 'exponer', diff: 0 }] },
            { speaker: 'Elena', text: 'Keine Sorge. Du bist ein toller Künstler.', translation: 'No te preocupes. Eres un gran artista.', isRedemittel: true, vocab: [{ de: 'der Künstler', es: 'el artista', diff: 0 }] },
            { speaker: 'Elena', text: 'Du wirst heute viel Anerkennung bekommen.', translation: 'Hoy recibirás mucho reconocimiento.', vocab: [{ de: 'die Anerkennung', es: 'el reconocimiento', diff: 1 }, { de: 'bekommen', es: 'recibir', diff: 0 }] },
            { speaker: 'Lukas', text: 'Schau dir dieses Gemälde hier an.', translation: 'Mira este cuadro de aquí.', vocab: [{ de: 'das Gemälde', es: 'el cuadro', diff: 0 }] },
            { speaker: 'Lukas', text: 'Es ist im Sommer entstanden.', translation: 'Surgió (fue creado) en verano.', vocab: [{ de: 'entstehen', es: 'surgir / crearse', diff: 1 }] },
            { speaker: 'Lukas', text: 'Das ist super! Es gefällt mir sehr.', translation: '¡Eso es genial! Me gusta mucho.', isRedemittel: true, vocab: [{ de: 'super', es: 'genial', diff: 0 }] },
            { speaker: 'Elena', text: 'Man sieht den Einfluss der Natur.', translation: 'Se ve la influencia de la naturaleza.', vocab: [{ de: 'der Einfluss', es: 'la influencia', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Guten Tag. Wer ist der Maler?', translation: 'Buenas tardes. ¿Quién es el pintor?', vocab: [{ de: 'der Maler', es: 'el pintor', diff: 0 }] },
            { speaker: 'Lukas', text: 'Ich bin es. Ist das eine Skulptur?', translation: 'Soy yo. ¿Es eso una escultura?', vocab: [{ de: 'die Skulptur', es: 'la escultura', diff: 0 }] },
            { speaker: 'Herr Weber', text: 'Das Bild erinnert mich an meine Lebensgeschichte.', translation: 'El cuadro me recuerda a la historia de mi vida.', vocab: [{ de: 'die Lebensgeschichte', es: 'la historia de vida', diff: 0 }] },
            { speaker: 'Herr Weber', text: 'Ich bin 1945 geboren worden.', translation: 'Yo nací en 1945.', vocab: [{ de: 'geboren werden', es: 'nacer', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Damals gab es viel Zerstörung.', translation: 'En aquel entonces había mucha destrucción.', vocab: [{ de: 'die Zerstörung', es: 'la destrucción', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Meine Familie musste schnell fliehen.', translation: 'Mi familia tuvo que huir rápido.', vocab: [{ de: 'fliehen', es: 'huir', diff: 1 }] },
            { speaker: 'Elena', text: 'Sie mussten oft gegen Hunger kämpfen.', translation: 'Tuvieron que luchar a menudo contra el hambre.', vocab: [{ de: 'kämpfen gegen', es: 'luchar contra', diff: 1 }] },
            { speaker: 'Herr Weber', text: 'Ja. Ich setze mich für Menschenrechte ein.', translation: 'Sí. Yo me comprometo (intercedo) por los derechos humanos.', vocab: [{ de: 'sich einsetzen für', es: 'interceder por', diff: 1 }, { de: 'das Menschenrecht', es: 'el derecho humano', diff: 0 }] },
            { speaker: 'Herr Weber', text: 'Wir müssen jedes Vorurteil bekämpfen.', translation: 'Tenemos que combatir cada prejuicio.', vocab: [{ de: 'das Vorurteil', es: 'el prejuicio', diff: 1 }] },
            { speaker: 'Lukas', text: 'Da hast du völlig recht!', translation: '¡Ahí tienes toda la razón!', isRedemittel: true, vocab: [{ de: 'recht haben', es: 'tener razón', diff: 1 }] },
            { speaker: 'Lukas', text: 'Es gibt ein Gewitter. Da war ein Blitz!', translation: 'Hay una tormenta. ¡Allí hubo un rayo!', vocab: [{ de: 'das Gewitter', es: 'la tormenta eléctrica', diff: 0 }, { de: 'der Blitz', es: 'el rayo', diff: 1 }] },
            { speaker: 'Lukas', text: 'Elena! Es gab einen Diebstahl in der Galerie!', translation: '¡Elena! ¡Hubo un robo en la galería!', vocab: [{ de: 'der Diebstahl', es: 'el robo', diff: 1 }] },
            { speaker: 'Lukas', text: 'Die Polizei muss den Dieb verhaften.', translation: 'La policía debe detener al ladrón.', vocab: [{ de: 'verhaften', es: 'detener', diff: 1 }] }
        ];
        window.__DEFAULT_GUION__ = DEFAULT_GUION;

        const TEMPUS_DICT = {
            "ausstellen": "Prät: stellte aus | Perf: hat ausgestellt",
            "bekommen": "Prät: bekam | Perf: hat bekommen",
            "entstehen": "Prät: entstand | Perf: ist entstanden",
            "entstanden": "Prät: entstand | Perf: ist entstanden",
            "sehen": "Prät: sah | Perf: hat gesehen",
            "sieht": "Prät: sah | Perf: hat gesehen",
            "geboren": "Prät: wurde geboren | Perf: ist geboren worden",
            "fliehen": "Prät: floh | Perf: ist geflohen",
            "kämpfen": "Prät: kämpfte | Perf: hat gekämpft",
            "anerkennen": "Prät: erkannte an | Perf: hat anerkannt",
            "stehlen": "Prät: stahl | Perf: hat gestohlen",
            "gestohlen": "Prät: stahl | Perf: hat gestohlen",
            "verhaften": "Prät: verhaftete | Perf: hat verhaftet",
            "sterben": "Prät: starb | Perf: ist gestorben",
            "gestorben": "Prät: starb | Perf: ist gestorben",
            "einsetzen": "Prät: setzte ein | Perf: hat eingesetzt",
            "essen": "Prät: aß | Perf: hat gegessen",
            "trinken": "Prät: trank | Perf: hat getrunken",
            "fahren": "Prät: fuhr | Perf: ist gefahren",
            "gehen": "Prät: ging | Perf: ist gegangen",
            "kommen": "Prät: kam | Perf: ist gekommen",
            "sprechen": "Prät: sprach | Perf: hat gesprochen",
            "nehmen": "Prät: nahm | Perf: hat genommen",
            "geben": "Prät: gab | Perf: hat gegeben",
            "helfen": "Prät: half | Perf: hat geholfen",
            "laufen": "Prät: lief | Perf: ist gelaufen",
            "schlafen": "Prät: schlief | Perf: hat geschlafen",
            "treffen": "Prät: traf | Perf: hat getroffen",
            "finden": "Prät: fand | Perf: hat gefunden",
            "bleiben": "Prät: blieb | Perf: ist geblieben",
            "tragen": "Prät: trug | Perf: hat getragen",
            "waschen": "Prät: wusch | Perf: hat gewaschen",
            "verlieren": "Prät: verlor | Perf: hat verloren",
            "schreiben": "Prät: schrieb | Perf: hat geschrieben",
            "lesen": "Prät: las | Perf: hat gelesen",
            "wissen": "Prät: wusste | Perf: hat gewusst",
            "denken": "Prät: dachte | Perf: hat gedacht",
            "bringen": "Prät: brachte | Perf: hat gebracht",
            "kennen": "Prät: kannte | Perf: hat gekannt",
            "nennen": "Prät: nannte | Perf: hat genannt"
        };

                const BX_DB_EMPTY = { vocabulario: [], verbos: [], preposiciones: [], conectores: [], redemittel: [] };
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

        const GRAMMAR_PATTERNS = [
            { regex: /(interessier[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|sehr|wirklich)\s+)*für)/gi, tooltip: "sich interessieren für + Akk", base: "sich interessieren für" },
            { regex: /(gegen\s+(?:.*?\s+)?kämpfen|kämpfen\s+(?:.*?\s+)?gegen)/gi, tooltip: "kämpfen gegen + Akk", base: "kämpfen gegen" },
            { regex: /(setz[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|heute|jetzt)\s+)*(?:.*?\s+)?für(?:.*?\s+)?ein)/gi, tooltip: "sich einsetzen für + Akk", base: "sich einsetzen für" },
            { regex: /(erinner[en|t|e]+\s+(?:(?:mich|dich|sich|uns|euch|noch|sehr)\s+)*an)/gi, tooltip: "sich erinnern an + Akk", base: "sich erinnern an" },
            { regex: /(wart[en|e|et]+\s+(?:.*?\s+)?auf)/gi, tooltip: "warten auf + Akk", base: "warten auf" }
        ];

        const CONN_LIST = ["weil", "dass", "obwohl", "wenn", "als", "damit", "ob", "bevor", "nachdem", "deshalb", "deswegen", "darum", "trotzdem", "dann", "danach", "außerdem", "und", "aber", "oder", "denn", "sondern"];
        const PREP_DAT = ["aus", "bei", "mit", "nach", "seit", "von", "zu", "ab"];
        const PREP_AKK = ["durch", "für", "gegen", "ohne", "um"];
        const PREP_WECHSEL = ["in", "an", "auf", "neben", "hinter", "über", "unter", "vor", "zwischen"];

        const MULLER_BX_USER_OVERLAY_KEY = 'muller_bx_user_overlay_v1';

        const MULLER_ACCOUNTS_KEY = 'muller_accounts_v1';
        const MULLER_SESSION_KEY = 'muller_session_v1';

        const MULLER_BOT_PLAYERS = [
            { id: 'bot_elena', name: 'Elena Vogt', tag: 'München', lvl: 'B2' },
            { id: 'bot_jonas', name: 'Jonas Keller', tag: 'Hamburg', lvl: 'B1' },
            { id: 'bot_fatima', name: 'Fatima Al-Sayed', tag: 'Köln', lvl: 'B2' },
            { id: 'bot_lukas', name: 'Lukas Brandt', tag: 'Berlin', lvl: 'B1' },
            { id: 'bot_sophie', name: 'Sophie Nguyen', tag: 'Frankfurt', lvl: 'B2' },
            { id: 'bot_marco', name: 'Marco Rossi', tag: 'Stuttgart', lvl: 'B1' },
            { id: 'bot_nina', name: 'Nina Hoffmann', tag: 'Leipzig', lvl: 'B2' },
            { id: 'bot_ken', name: 'Ken Yamamoto', tag: 'Dresden', lvl: 'B1' },
            { id: 'bot_laura', name: 'Laura García', tag: 'Madrid', lvl: 'B2' },
            { id: 'bot_timo', name: 'Timo Schulz', tag: 'Bremen', lvl: 'B1' },
            { id: 'bot_aylin', name: 'Aylin Demir', tag: 'Düsseldorf', lvl: 'B2' },
            { id: 'bot_felix', name: 'Felix Werner', tag: 'Nürnberg', lvl: 'B1' },
            { id: 'bot_mira', name: 'Mira Popov', tag: 'Wien', lvl: 'B2' },
            { id: 'bot_oscar', name: 'Óscar Prieto', tag: 'Barcelona', lvl: 'B1' },
        ];

        function mullerHash32(str) {
            let h = 2166136261 >>> 0;
            const s = String(str);
            for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
            return h >>> 0;
        }

        function mullerIsoWeekMonday(d) {
            d = d || new Date();
            const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const day = x.getDay() || 7;
            if (day !== 1) x.setDate(x.getDate() - (day - 1));
            return x.toISOString().slice(0, 10);
        }

        function mullerMaskEmail(email) {
            const e = String(email || '');
            const at = e.indexOf('@');
            if (at < 1) return e || '—';
            return e.slice(0, 2) + '***' + e.slice(at);
        }

        function mullerAccountsLoad() {
            try {
                const raw = localStorage.getItem(MULLER_ACCOUNTS_KEY);
                if (!raw) return {};
                const o = JSON.parse(raw);
                return o && typeof o === 'object' ? o : {};
            } catch (err) { return {}; }
        }

        function mullerAccountsSave(map) {
            try { localStorage.setItem(MULLER_ACCOUNTS_KEY, JSON.stringify(map)); } catch (err) {}
        }

        function mullerRandomSaltBytes() {
            const a = new Uint8Array(16);
            crypto.getRandomValues(a);
            return a;
        }

        function mullerBytesToB64(u8) {
            let s = '';
            for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
            return btoa(s);
        }

        function mullerB64ToBytes(b64) {
            const bin = atob(b64);
            const u8 = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
            return u8;
        }

        async function mullerHashPassword(password, saltBytes) {
            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
            const bits = await crypto.subtle.deriveBits(
                { name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' },
                keyMaterial,
                256
            );
            return new Uint8Array(bits);
        }

        async function mullerAuthRegister(email, password, displayName) {
            if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('CRYPTO_UNAVAILABLE');
            const em = String(email || '').trim().toLowerCase();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) throw new Error('EMAIL_INVALID');
            if (!password || password.length < 6) throw new Error('PASS_SHORT');
            const acc = mullerAccountsLoad();
            if (acc[em]) throw new Error('EMAIL_TAKEN');
            const salt = mullerRandomSaltBytes();
            const hash = await mullerHashPassword(password, salt);
            const userId = 'u_' + Date.now().toString(36) + '_' + (mullerHash32(em) % 1000000000).toString(36);
            acc[em] = {
                userId,
                displayName: String(displayName || '').trim() || 'Estudiante',
                saltB64: mullerBytesToB64(salt),
                hashB64: mullerBytesToB64(hash),
                createdAt: new Date().toISOString()
            };
            mullerAccountsSave(acc);
            try { localStorage.setItem(MULLER_SESSION_KEY, JSON.stringify({ email: em })); } catch (err) {}
            return acc[em];
        }

        async function mullerAuthLogin(email, password) {
            if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('CRYPTO_UNAVAILABLE');
            const em = String(email || '').trim().toLowerCase();
            const acc = mullerAccountsLoad()[em];
            if (!acc || !acc.saltB64 || !acc.hashB64) throw new Error('BAD_CREDENTIALS');
            const salt = mullerB64ToBytes(acc.saltB64);
            const hash = await mullerHashPassword(password, salt);
            const target = mullerB64ToBytes(acc.hashB64);
            if (hash.length !== target.length) throw new Error('BAD_CREDENTIALS');
            for (let i = 0; i < hash.length; i++) if (hash[i] !== target[i]) throw new Error('BAD_CREDENTIALS');
            try { localStorage.setItem(MULLER_SESSION_KEY, JSON.stringify({ email: em })); } catch (err) {}
            return acc;
        }

        function mullerAuthLogout() {
            try { localStorage.removeItem(MULLER_SESSION_KEY); } catch (err) {}
        }

        function mullerAuthGetSession() {
            try {
                const raw = localStorage.getItem(MULLER_SESSION_KEY);
                if (!raw) return null;
                const o = JSON.parse(raw);
                const em = o && o.email ? String(o.email).toLowerCase() : '';
                if (!em) return null;
                const acc = mullerAccountsLoad()[em];
                if (!acc) return null;
                return { email: em, displayName: acc.displayName, userId: acc.userId, createdAt: acc.createdAt };
            } catch (err) { return null; }
        }

        function mullerLeagueComputeUserScore(stats) {
            if (!stats || typeof stats !== 'object') return 0;
            const xp = Number(stats.xp) || 0;
            const coins = Number(stats.coins) || 0;
            const streak = Number(stats.streakDays) || 0;
            const diktat = Number(stats.diktatCorrect) || 0;
            const pron = Number(stats.pronunciationAttempts) || 0;
            const raw = xp * 0.12 + coins * 0.35 + streak * 28 + diktat * 3 + pron * 2;
            return Math.max(0, Math.min(99999, Math.floor(raw)));
        }

        function mullerBotWeekScore(botId, weekKey) {
            const h = mullerHash32(String(botId) + '|' + String(weekKey));
            const h2 = mullerHash32(String(weekKey) + '|' + String(botId));
            const base = 900 + (h % 4200);
            const wave = (h2 % 1400) - 200;
            return Math.max(100, Math.min(99999, base + wave));
        }

        function mullerLeagueBuildRanking(userStats, username, session) {
            const week = mullerIsoWeekMonday();
            const userScore = mullerLeagueComputeUserScore(userStats);
            const rows = [
                {
                    id: 'local_player',
                    name: username || 'Estudiante',
                    isBot: false,
                    isSelf: true,
                    score: userScore,
                    sub: session ? mullerMaskEmail(session.email) : 'Invitado (sin email en este dispositivo)',
                    rank: 0
                },
                ...MULLER_BOT_PLAYERS.map((b) => ({
                    id: b.id,
                    name: b.name,
                    isBot: true,
                    isSelf: false,
                    score: mullerBotWeekScore(b.id, week),
                    sub: b.tag + ' · ' + b.lvl,
                    rank: 0
                }))
            ];
            rows.sort((a, b) => b.score - a.score);
            rows.forEach((r, i) => { r.rank = i + 1; });
            return { week, rows };
        }

        function mullerSupabaseConfigured() {
            const u = window.MULLER_SUPABASE_URL && String(window.MULLER_SUPABASE_URL).trim();
            const k = window.MULLER_SUPABASE_ANON_KEY && String(window.MULLER_SUPABASE_ANON_KEY).trim();
            return !!(u && k);
        }

        function mullerGetSupabaseClient() {
            if (!mullerSupabaseConfigured()) return null;
            if (window.__mullerSbClient) return window.__mullerSbClient;
            const g = typeof self !== 'undefined' ? self : window;
            const mod = g.supabase;
            const createClient = mod && typeof mod.createClient === 'function' ? mod.createClient : null;
            if (!createClient) return null;
            try {
                window.__mullerSbClient = createClient(
                    String(window.MULLER_SUPABASE_URL).trim(),
                    String(window.MULLER_SUPABASE_ANON_KEY).trim(),
                    {
                        auth: {
                            persistSession: true,
                            autoRefreshToken: true,
                            detectSessionInUrl: true,
                            storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
                        },
                    }
                );
            } catch (err) {
                return null;
            }
            return window.__mullerSbClient;
        }

        function mullerCloudSyncErrorLabel(error) {
            if (!error) return 'Error de nube';
            const code = String(error.code || '').trim();
            const msg = String(error.message || error.details || error.hint || '').toLowerCase();
            if (code === '42P01' || (msg.includes('relation') && msg.includes('does not exist')) || msg.includes('muller_user_state')) {
                return 'Falta tabla nube';
            }
            if (code === '42501' || msg.includes('permission denied') || msg.includes('row-level security') || msg.includes('rls')) {
                return 'Permisos nube';
            }
            if (msg.includes('jwt') || msg.includes('token') || msg.includes('expired')) {
                return 'Sesion nube expirada';
            }
            return 'Error al leer nube';
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

        /** Conectores típicos al inicio de frase (no incluimos und/oder/aber para reducir falsos positivos). */
        const MULLER_BX_CONN_START = ['weil', 'dass', 'obwohl', 'wenn', 'als', 'damit', 'ob', 'bevor', 'nachdem', 'deshalb', 'deswegen', 'darum', 'trotzdem', 'dann', 'danach', 'außerdem', 'denn', 'sondern', 'falls', 'sobald', 'solange', 'während', 'zuerst', 'anschließend', 'schließlich', 'zunächst', 'inzwischen', 'allerdings', 'jedoch', 'hingegen', 'folglich', 'trotz', 'außer', 'indem'];

        function mullerClassifyBibliotecaLine(german, meta) {
            if (!german || typeof german !== 'string') return 'vocabulario';
            const g = german.replace(/\s+/g, ' ').trim();
            const lower = g.toLowerCase();
            if (meta && meta.isRedemittel) return 'redemittel';

            const firstTok = lower.split(/[\s,.;:]+/).filter(Boolean)[0] || '';
            if (MULLER_BX_CONN_START.includes(firstTok)) return 'conectores';

            const connMulti = ['zuerst', 'danach', 'später', 'schließlich', 'zunächst', 'anschließend', 'inzwischen', 'deswegen', 'trotzdem', 'allerdings', 'hingegen', 'folglich', 'außerdem', 'jedoch', 'dafür', 'dagegen', 'dabei', 'sonst'];
            if (connMulti.some((c) => lower.startsWith(c + ' '))) return 'conectores';

            if (/^(können|könnte|könnten|dürfte|dürfen|entschuldigung|vielen dank|danke|herzlichen|guten tag|guten morgen|guten abend|bis bald|auf wiedersehen|wie bitte|kein problem|ich möchte|ich hätte gerne|ich würde gerne|lass uns|wir könnten|ich bin der meinung)/i.test(lower) && g.length < 140) return 'redemittel';

            if (/^(sich\s+[a-zäöüß]+\s+(an|auf|für|von|über|mit|zu)\b)/i.test(g)) return 'verbos';
            if (/\b(freuen|erinnern|halten|denken|sorgen|interessieren|vorbereiten|kümmern|verlassen|verzichten|bewerben|verabreden|entscheiden|einigen|bemühen|verstehen|bedanken)\s+(mich|dich|sich|uns|euch)?\s*(an|auf|für|von|über|mit|zu|in)\b/i.test(lower)) return 'verbos';

            const words = g.split(/\s+/).filter(Boolean);
            if (meta && meta.isPair && words.length <= 5) return 'vocabulario';

            if (words.length <= 3 && /^[a-zäöüß]+(en|eln|ern)$/i.test(words[0])) return 'verbos';

            if (/^(an|auf|in|mit|für|zu|von|über|unter|vor|nach|aus|bei|gegen|ohne|um|anstatt|trotz|während)\s+(dem|der|den|das|die|ein|eine|mich|dir|mir|sich|ihm|ihr|uns|euch)/i.test(g)) return 'preposiciones';

            if (/\b(an|auf|in|mit|für|zu|von|über|nach|vor|aus|bei)\s+(dem|der|den|das|die|ein|eine|mich|dich|sich)\b/i.test(lower)) {
                if (/^(ich|du|er|sie|es|wir|ihr|man|sie)\s+/i.test(g)) return 'preposiciones';
                if (words.length <= 8) return 'preposiciones';
            }

            if (/^(ich|du|er|sie|es|wir|ihr|man)\s+.+\b(an|auf|mit|für|zu|von|über|in|nach|vor|aus|bei)\s+(dem|der|den|das|die|ein|eine|mich|dich|sich)\b/i.test(g)) return 'preposiciones';

            return 'vocabulario';
        }

        function mullerExtractBibliotecaSegments(raw) {
            const out = [];
            if (!raw || typeof raw !== 'string') return out;
            const lines = raw.split(/\n/);
            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith('#')) continue;

                const speakerMatch = line.match(/^([^:]+):\s*(.+)$/);
                if (speakerMatch) {
                    let content = speakerMatch[2];
                    const isRedemittel = /\[R\]|\bNützlich\b/i.test(content);
                    content = content.replace(/\[R\]/g, '').replace(/\bNützlich\.?\s*/gi, '').trim();

                    let vocabInner = null;
                    const vocabMatch = content.match(/\[(.*?)\]/);
                    if (vocabMatch) {
                        vocabInner = vocabMatch[1];
                        content = content.replace(vocabMatch[0], '').trim();
                    }

                    let translation = '';
                    const transMatch = content.match(/\(([^)]+)\)/);
                    if (transMatch) {
                        translation = transMatch[1].trim();
                        content = content.replace(transMatch[0], '').trim();
                    }

                    const germanText = content.replace(/[🔴🔵🟢•]/g, '').replace(/\s+/g, ' ').trim();
                    if (germanText) out.push({ german: germanText, es: translation, isRedemittel });

                    if (vocabInner) {
                        vocabInner.split(',').forEach((piece) => {
                            const parts = piece.split('-');
                            if (parts.length >= 2) {
                                const de = parts[0].trim().replace(/[🔴🔵🟢•]/g, '');
                                const es = parts.slice(1).join('-').trim();
                                if (de) out.push({ german: de, es: es, isRedemittel: false, isPair: true });
                            }
                        });
                    }
                    continue;
                }

                const pairMatch = line.match(/^(.+?)\s*[-–—]\s*(.+)$/);
                if (pairMatch && !line.includes(':')) {
                    const de = pairMatch[1].replace(/^[•\-\d.)\]]+\s*/, '').trim();
                    const es = pairMatch[2].trim();
                    const looksDe = /[äöüßÄÖÜ]/.test(de) || /^(der|die|das|ein|eine|ich|du|sich|und|nicht)\b/i.test(de);
                    if (de && es && looksDe) {
                        out.push({ german: de, es: es, isRedemittel: false, isPair: true });
                        continue;
                    }
                }

                const plain = line.replace(/^[•\-\d.)\]]+\s*/, '').trim();
                if (plain.length >= 2) out.push({ german: plain, es: '', isRedemittel: false });
            }
            return out;
        }

        /** Lista plana de ítems para distribuir (sin duplicados). */
        function mullerBibliotecaFlatItems(text) {
            const segs = mullerExtractBibliotecaSegments(text);
            const out = [];
            const seen = new Set();
            for (const seg of segs) {
                const cat = mullerClassifyBibliotecaLine(seg.german, seg);
                const es = seg.es && seg.es.length ? seg.es : '(añade traducción en la tarjeta)';
                const item = {
                    b1: seg.german,
                    b2: seg.german,
                    es: es,
                    trick: 'Biblioteca · ' + cat + ' · heurística local (sin IA)'
                };
                const k = mullerBxItemKey(item) + '|' + cat;
                if (seen.has(k)) continue;
                seen.add(k);
                out.push({ cat, item, seg });
            }
            return out;
        }

        /** Heurística local B1 vs B2 por frase (no es IA; revisa en B1/B2 si falla). */
        function mullerGuessBibliotecaItemLevel(item, seg) {
            const g = (item.b1 || '').trim();
            if (!g) return 'b1';
            const lower = g.toLowerCase();
            const words = g.split(/\s+/).filter(Boolean);
            const w = words.length;

            if (seg && seg.isPair && w <= 5) return 'b1';

            if (/\b(Herausforderung|Bedeutung|Maßnahmen|entsprechend|voraussichtlich|gleichwohl|insofern|hinsichtlich|bezüglich|unabhängig davon|im Hinblick auf|von großer)\b/i.test(g)) return 'b2';
            if (/\b(sodass|sofern|sobald|solange|anstatt dass|ohne dass|wobei|wodurch|weshalb)\b/i.test(lower)) return 'b2';
            if (/\b(dessen|deren|wessen)\b/i.test(lower) && w > 4) return 'b2';
            if (g.length > 115) return 'b2';
            if (w >= 17) return 'b2';
            if (/\b(wurde|wurden|worden)\b/i.test(lower) && w > 6) return 'b2';

            if (w <= 10 && g.length <= 75) return 'b1';
            if (w <= 13) return 'b1';

            return 'b2';
        }

        function mullerBibliotecaTextToBxBuckets(text) {
            const buckets = { vocabulario: [], verbos: [], preposiciones: [], conectores: [], redemittel: [] };
            const flat = mullerBibliotecaFlatItems(text);
            for (const { cat, item } of flat) {
                buckets[cat].push(item);
            }
            return {
                buckets,
                counts: {
                    vocabulario: buckets.vocabulario.length,
                    verbos: buckets.verbos.length,
                    preposiciones: buckets.preposiciones.length,
                    conectores: buckets.conectores.length,
                    redemittel: buckets.redemittel.length,
                    total: flat.length
                }
            };
        }

        const WRITING_COPY_DRILLS = [
            "Der Termin findet am Dienstag statt.",
            "Ich würde gerne einen Termin vereinbaren.",
            "Können Sie mir bitte helfen?",
            "Das Wetter ist heute sehr schön.",
            "Ich interessiere mich für Kunst und Kultur.",
            "Trotz des Regens sind wir spazieren gegangen.",
            "Wegen des Staus kam ich zu spät.",
            "Sobald ich Zeit habe, rufe ich dich an.",
            "Entschuldigung, ich habe mich verspätet.",
            "Könnten Sie das bitte wiederholen?"
        ];
        const WRITING_PROMPTS_DE = [
            { de: "Beschreibe deinen typischen Arbeitstag.", es: "Describe tu día laboral típico." },
            { de: "Was machst du gern in deiner Freizeit?", es: "¿Qué te gusta hacer en tu tiempo libre?" },
            { de: "Erzähle von deiner letzten Reise.", es: "Habla de tu último viaje." },
            { de: "Warum lernst du Deutsch?", es: "¿Por qué estudias alemán?" },
            { de: "Was sind deine Pläne für die Zukunft?", es: "¿Cuáles son tus planes para el futuro?" },
            { de: "Beschreibe dein Zuhause.", es: "Describe tu hogar." },
            { de: "Was isst du gern? Was isst du nicht gern?", es: "¿Qué te gusta y qué no te gusta comer?" },
            { de: "Schreibe einen kurzen Brief an einen Freund.", es: "Escribe una carta corta a un amigo." }
        ];
        const WRITING_DICTATION_LINES = [
            { de: "Guten Tag, ich habe eine Frage.", es: "Buenos días, tengo una pregunta." },
            { de: "Der Schlüssel liegt auf dem Tisch.", es: "La llave está sobre la mesa." },
            { de: "Wir treffen uns um acht Uhr.", es: "Quedamos a las ocho." },
            { de: "Ich freue mich auf das Wochenende.", es: "Me alegro por el fin de semana." },
            { de: "Das Museum ist heute geschlossen.", es: "El museo está cerrado hoy." }
        ];
        const WRITING_TELC_TASKS = [
            {
                title: 'TELC B1 · E-Mail informal (invitar/cancelar)',
                level: 'B1',
                promptEs: 'Escribe un email a una amiga alemana. Debes: saludar, explicar por qué escribes, dar 2 detalles (fecha/lugar), pedir confirmación y despedirte.',
                scaffoldDe: [
                    'Betreff: Einladung am Samstag',
                    'Liebe Anna,',
                    'ich schreibe dir, weil ...',
                    'Am ... um ... treffen wir uns in/bei ...',
                    'Kannst du mir bitte bis ... antworten?',
                    'Liebe Grüße',
                    'Dein/Deine ...'
                ],
                checklist: ['Anrede + saludo', 'Motivo claro', '2 datos concretos', 'Petición/pregunta', 'Despedida']
            },
            {
                title: 'TELC B1 · Beschwerde (correo formal corto)',
                level: 'B1',
                promptEs: 'Reclamación simple por un problema con una compra online. Incluye: qué compraste, qué problema hay, qué solución quieres.',
                scaffoldDe: [
                    'Betreff: Reklamation meiner Bestellung',
                    'Sehr geehrte Damen und Herren,',
                    'am ... habe ich ... bestellt.',
                    'Leider habe ich folgendes Problem: ...',
                    'Ich bitte Sie um ... (Ersatz/Rückerstattung).',
                    'Mit freundlichen Grüßen'
                ],
                checklist: ['Registro formal (Sie)', 'Problema descrito', 'Solicitud explícita', 'Cierre formal']
            },
            {
                title: 'TELC B2 · E-Mail formal (petición argumentada)',
                level: 'B2',
                promptEs: 'Escribe a una institución para solicitar un cambio de fecha. Justifica, propone alternativa y muestra cortesía formal.',
                scaffoldDe: [
                    'Betreff: Bitte um Terminverschiebung',
                    'Sehr geehrte Damen und Herren,',
                    'hiermit möchte ich höflich um ... bitten.',
                    'Aus folgenden Gründen ist der ursprüngliche Termin schwierig: ...',
                    'Als Alternative schlage ich ... vor.',
                    'Für Ihr Verständnis bedanke ich mich im Voraus.',
                    'Mit freundlichen Grüßen'
                ],
                checklist: ['Objetivo claro', 'Justificación desarrollada', 'Alternativa concreta', 'Registro B2 formal']
            },
            {
                title: 'TELC B2 · Carta al periódico (opinión)',
                level: 'B2',
                promptEs: 'Carta de opinión sobre el uso del móvil en clase/trabajo. Estructura: introducción, postura, 2 argumentos, cierre.',
                scaffoldDe: [
                    'Betreff: Stellungnahme zum Thema ...',
                    'Sehr geehrte Redaktion,',
                    'mit Interesse habe ich Ihren Artikel über ... gelesen.',
                    'Meiner Meinung nach ...',
                    'Erstens ... / Zweitens ...',
                    'Zusammenfassend bin ich der Auffassung, dass ...',
                    'Mit freundlichen Grüßen'
                ],
                checklist: ['Introducción referida al tema', 'Opinión explícita', '2 argumentos conectados', 'Conclusión clara']
            }
        ];
        const LETTER_DRILLS = [
            { title: "Umlaute Ä Ö Ü und ß", sample: "Äpfel · Öl · Über · Straße", practice: "Äpfel Öl Über Straße" },
            { title: "Alltag", sample: "schön · müde · hören · groß", practice: "Schön müde hören groß" },
            { title: "Satzanfang", sample: "Großschreibung: Ich, Du, Der, Die", practice: "Ich lerne Deutsch jeden Tag." }
        ];

        const levenshteinDistance = (a, b) => {
            if (a.length === 0) return b.length;
            if (b.length === 0) return a.length;
            const matrix = [];
            for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
            for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                    }
                }
            }
            return matrix[b.length][a.length];
        };

        /** Quita repeticiones consecutivas de la misma palabra (STT móvil suele duplicar 5–20 veces). */
        const dedupeConsecutiveWords = (s) => {
            if (!s || typeof s !== 'string') return '';
            const parts = s.trim().split(/\s+/).filter(Boolean);
            const out = [];
            for (const w of parts) {
                const low = w.toLowerCase();
                if (out.length && out[out.length - 1].toLowerCase() === low) continue;
                out.push(w);
            }
            return out.join(' ');
        };

        /** Une un nuevo trozo final del STT sin duplicar: en Android muchos motores reenvían la frase COMPLETA en cada evento. */
        const mergeSpeechFinalChunk = (prev, chunk) => {
            if (!chunk || !String(chunk).trim()) return prev || '';
            const n = String(chunk).trim();
            if (!prev || !String(prev).trim()) return n;
            const p = String(prev).trim();
            if (n === p) return p;
            if (n.startsWith(p)) return n;
            if (p.startsWith(n)) return p;
            if (p.includes(n) && n.length < p.length) return p;
            if (n.includes(p) && p.length < n.length) return n;
            return `${p} ${n}`.trim();
        };

        /** Si el STT repite la frase entera 2+ veces (p. ej. "a b c a b c"), deja una sola copia. */
        const collapseFullPhraseRepeat = (s) => {
            if (!s || typeof s !== 'string') return '';
            const w = s.trim().split(/\s+/).filter(Boolean);
            if (w.length < 2) return s.trim();
            for (let period = 1; period <= Math.floor(w.length / 2); period++) {
                if (w.length % period !== 0) continue;
                const unit = w.slice(0, period);
                let ok = true;
                for (let rep = 1; rep < w.length / period; rep++) {
                    for (let i = 0; i < period; i++) {
                        if (w[rep * period + i].toLowerCase() !== unit[i].toLowerCase()) {
                            ok = false;
                            break;
                        }
                    }
                    if (!ok) break;
                }
                if (ok) return unit.join(' ');
            }
            return s.trim();
        };

        /** Limpieza extra: colapsa triples+ y pasa dedupe consecutivo. */
        const collapseStutterRepeats = (s) => {
            if (!s || typeof s !== 'string') return '';
            let t = s.trim();
            let prev = '';
            while (prev !== t) {
                prev = t;
                t = t.replace(/\b(\S+)(?:\s+\1)+\b/gi, '$1').trim();
            }
            t = dedupeConsecutiveWords(t);
            t = collapseFullPhraseRepeat(t);
            return dedupeConsecutiveWords(t);
        };

        /** Normaliza texto alemán para comparar lo que dicta el STT con el guion (umlauts, ß, puntuación). */
        const normalizeGermanSpeechText = (s) => {
            if (!s || typeof s !== 'string') return '';
            let t = s.toLowerCase().trim();
            t = t.replace(/\u00df/g, 'ss').replace(/ß/g, 'ss');
            t = t.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
            t = t.replace(/[’'`´]/g, "'");
            t = t.replace(/[^a-z0-9\s']/g, ' ');
            t = t.replace(/\s+/g, ' ').trim();
            return t;
        };
        const mullerPdfCleanText = (s) => String(s || '')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\s+\n/g, '\n')
            .replace(/\n\s+/g, '\n')
            .trim();
        const mullerPdfGuessUnitLesson = (s) => {
            const txt = String(s || '');
            const unitHit = txt.match(/\b(?:Lektion|Einheit|Unidad|Unit)\s*[:\-]?\s*([A-Z0-9ÄÖÜa-zäöüß]+)/i);
            const lessonHit = txt.match(/\b(?:Thema|Tema|Kapitel|Lecci[oó]n)\s*[:\-]?\s*([A-Z0-9ÄÖÜa-zäöüß]+)/i);
            return {
                unit: unitHit ? String(unitHit[1] || '').trim() : '',
                lesson: lessonHit ? String(lessonHit[1] || '').trim() : ''
            };
        };

        const MULLER_READING_FONT_STORAGE = 'muller_reading_font_px_v1';
        const MULLER_READING_FONT_MIN = 14;
        const MULLER_READING_FONT_MAX = 34;
        const MULLER_READING_FONT_STEP = 1;
        const MULLER_MIC_PERMISSION_PREF_KEY = 'muller_auto_request_mic_v1';
        const mullerClamp = (n, min, max) => Math.max(min, Math.min(max, n));
        const mullerNormalizeGermanWordToken = (raw) => String(raw || '')
            .toLowerCase()
            .replace(/^[^a-zäöüß]+|[^a-zäöüß]+$/gi, '')
            .trim();
        const mullerReadingTokenizeText = (text) => String(text || '')
            .split(/(\s+)/)
            .map((chunk) => {
                if (!chunk) return { text: '', word: '', clickable: false };
                if (/^\s+$/.test(chunk)) return { text: chunk, word: '', clickable: false };
                const clean = mullerNormalizeGermanWordToken(chunk);
                return { text: chunk, word: clean, clickable: !!clean };
            });
        const mullerRequestMicPermission = async ({ autoPrompt = true, showToast = false } = {}) => {
            if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
                if (showToast && window.__mullerToast) window.__mullerToast('Este navegador no permite pedir micrófono.', 'error');
                return false;
            }
            try {
                const p = navigator.permissions && navigator.permissions.query ? await navigator.permissions.query({ name: 'microphone' }) : null;
                if (p && p.state === 'granted') return true;
                if (p && p.state === 'denied') {
                    if (showToast && window.__mullerToast) window.__mullerToast('Micrófono bloqueado en el navegador. Habilítalo en ajustes del sitio.', 'error');
                    return false;
                }
                if (!autoPrompt) return false;
            } catch (e) {}
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (stream && stream.getTracks) stream.getTracks().forEach((t) => t.stop());
                return true;
            } catch (err) {
                if (showToast && window.__mullerToast) window.__mullerToast('No se concedió permiso de micrófono.', 'error');
                return false;
            }
        };
        const mullerEnsureMicPermission = async ({ autoPrompt = true, showToast = false } = {}) => mullerRequestMicPermission({ autoPrompt, showToast });
        window.mullerRequestMicPermission = mullerRequestMicPermission;
        window.mullerEnsureMicPermission = mullerEnsureMicPermission;

        const germanWordDistanceOk = (a, b) => {
            if (a === b) return true;
            const d = levenshteinDistance(a, b);
            const L = Math.max(a.length, b.length, 1);
            if (L <= 2) return d <= 0;
            if (L <= 5) return d <= 1;
            if (L <= 10) return d <= 2;
            return d <= Math.min(3, Math.floor(L * 0.25));
        };

        /** Empareja palabras del modelo con las reconocidas en orden (tolera palabras de más al inicio). */
        const matchGermanWordsSequential = (origWords, spokenWords) => {
            const feedback = [];
            let si = 0;
            for (const ow of origWords) {
                if (!ow) continue;
                let found = false;
                for (let j = si; j < spokenWords.length; j++) {
                    if (germanWordDistanceOk(ow, spokenWords[j])) {
                        found = true;
                        si = j + 1;
                        break;
                    }
                }
                feedback.push({ word: ow, correct: found });
            }
            return feedback;
        };

        /** Voces TTS del sistema (gratis): preferencias en localStorage. Audiolibro y utterances sueltos usan __mullerApplyPreferred*Voice */
        window.__mullerResolveVoice = function (storageKey) {
            try {
                const raw = localStorage.getItem(storageKey);
                if (!raw) return null;
                const all = window.speechSynthesis.getVoices();
                return all.find(function (x) { return x.voiceURI === raw || x.name === raw; }) || null;
            } catch (e) { return null; }
        };
        window.__mullerApplyPreferredDeVoice = function (utterance) {
            const v = window.__mullerResolveVoice('muller_tts_de');
            if (v) utterance.voice = v;
        };
        window.__mullerApplyPreferredEsVoice = function (utterance) {
            const v = window.__mullerResolveVoice('muller_tts_es');
            if (v) utterance.voice = v;
        };
        window.__mullerRankVoiceNatural = function (v) {
            const n = (v.name || '').toLowerCase();
            let s = 0;
            if (/neural|natural|premium|enhanced|wavenet|journey|generative/i.test(n)) s += 50;
            if (/google|microsoft|azure|apple|cloud/i.test(n)) s += 20;
            if (/de[-_]|german|deutsch/i.test(n)) s += 5;
            return s;
        };

        /** SRS vocabulario (SM-2 simplificado): mapa en localStorage `muller_vocab_srs_v1` */
        const MULLER_VOCAB_SRS_STORAGE = 'muller_vocab_srs_v1';
        function mullerVocabSrsKey(w) {
            const de = (w && w.de ? String(w.de) : '').trim().toLowerCase();
            const es = (w && w.es ? String(w.es) : '').trim().toLowerCase();
            return de + '\u0000' + es;
        }
        function mullerGetVocabSrsMap() {
            try {
                const raw = localStorage.getItem(MULLER_VOCAB_SRS_STORAGE);
                return raw ? JSON.parse(raw) : {};
            } catch (e) { return {}; }
        }
        function mullerSetVocabSrsMap(map) {
            try { localStorage.setItem(MULLER_VOCAB_SRS_STORAGE, JSON.stringify(map)); } catch (e) {}
        }
        function mullerApplyVocabSrsRating(map, word, level) {
            const key = mullerVocabSrsKey(word);
            const todayStr = new Date().toISOString().slice(0, 10);
            const prev = map[key] || null;
            const q = level === 'hard' ? 2 : level === 'normal' ? 3 : 4;
            let interval = prev && typeof prev.interval === 'number' ? prev.interval : 0;
            let repetitions = prev && typeof prev.repetitions === 'number' ? prev.repetitions : 0;
            let easeFactor = prev && typeof prev.easeFactor === 'number' ? prev.easeFactor : 2.5;
            if (q < 3) {
                repetitions = 0;
                interval = 1;
                easeFactor = Math.max(1.3, easeFactor - 0.2);
            } else {
                if (repetitions === 0) interval = 1;
                else if (repetitions === 1) interval = 6;
                else interval = Math.max(1, Math.round(interval * easeFactor));
                repetitions += 1;
                easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
                easeFactor = Math.max(1.3, easeFactor);
            }
            const dueDate = new Date(todayStr + 'T12:00:00');
            dueDate.setDate(dueDate.getDate() + interval);
            const due = dueDate.toISOString().slice(0, 10);
            const prevVC = prev && typeof prev.viewCount === 'number' ? prev.viewCount : 0;
            const ratedCount = (prev && typeof prev.ratedCount === 'number' ? prev.ratedCount : 0) + 1;
            return { ...map, [key]: { interval, repetitions, easeFactor, due, lastRated: todayStr, viewCount: Math.max(prevVC, 1), ratedCount, lastViewed: todayStr } };
        }
        function mullerIncrementSrsView(map, word) {
            const key = mullerVocabSrsKey(word);
            const prev = map[key] || {};
            const viewCount = (typeof prev.viewCount === 'number' ? prev.viewCount : 0) + 1;
            const todayStr = new Date().toISOString().slice(0, 10);
            return { ...map, [key]: { ...prev, viewCount, lastViewed: todayStr } };
        }

        /** Racha “honesta”: el día cuenta solo si hay actividad mínima (umbrales fijos en código). */
        const MULLER_STREAK_QUAL_KEY = 'muller_streak_qualifying_days_v1';
        const MULLER_STREAK_TODAY_KEY = 'muller_streak_today_stats_v1';
        const MULLER_STREAK_MIN_VOCAB_RATINGS = 8;
        const MULLER_STREAK_MIN_ACTIVITY_POINTS = 45;
        const MULLER_STREAK_MIN_ACTIVE_SEC = 420;
        const MULLER_ONBOARDING_KEY = 'muller_onboarding_done_v1';
        const MULLER_THEME_KEY = 'muller_ui_theme_v1';
        const MULLER_MAIN_GOAL_KEY = 'muller_main_daily_goal_v1';
        const MULLER_GOAL_CLAIM_KEY = 'muller_main_goal_claim_date_v1';
        const MULLER_OCR_HIST_KEY = 'muller_ocr_history_v1';
        const MULLER_PDF_STUDY_STORAGE_KEY = 'muller_pdf_study_v1';
        const MULLER_PDF_STUDY_LIBRARY_KEY = 'muller_pdf_study_library_v1';
        const MULLER_PDF_NOTES_STORAGE_KEY = 'muller_pdf_study_notes_v1';
        const MULLER_PDF_STORED_PAGES_MAX = 80;
        const MULLER_PDF_STORED_TEXT_MAX = 3200;
        const MULLER_PDF_OCR_RETRY_MAX = 1;
        const MULLER_PDF_EXTRACT_YIELD_EVERY = 2;
        const MULLER_TTS_RATE_KEY = 'muller_tts_rate_preset_v1';
        const MULLER_PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/legacy/build/pdf.worker.min.js';

        function mullerGetStreakTodayStats() {
            const today = new Date().toISOString().slice(0, 10);
            try {
                const raw = localStorage.getItem(MULLER_STREAK_TODAY_KEY);
                if (!raw) return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                const o = JSON.parse(raw);
                if (o.date !== today) return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                return o;
            } catch (e) {
                return { date: today, vocabRated: 0, points: 0, activeSec: 0 };
            }
        }
        function mullerSaveStreakTodayStats(o) {
            try { localStorage.setItem(MULLER_STREAK_TODAY_KEY, JSON.stringify(o)); } catch (e) {}
        }
        function mullerQualifyingMap() {
            try { return JSON.parse(localStorage.getItem(MULLER_STREAK_QUAL_KEY) || '{}'); } catch (e) { return {}; }
        }
        function mullerSetQualifyingMap(m) {
            try { localStorage.setItem(MULLER_STREAK_QUAL_KEY, JSON.stringify(m)); } catch (e) {}
        }
        function mullerUpdateQualifyingForStats(stats) {
            const today = new Date().toISOString().slice(0, 10);
            if (stats.date !== today) return;
            const ok = stats.vocabRated >= MULLER_STREAK_MIN_VOCAB_RATINGS
                || stats.points >= MULLER_STREAK_MIN_ACTIVITY_POINTS
                || stats.activeSec >= MULLER_STREAK_MIN_ACTIVE_SEC;
            const m = mullerQualifyingMap();
            if (ok) m[today] = true;
            else delete m[today];
            mullerSetQualifyingMap(m);
        }
        function mullerComputeHonestStreakDays() {
            const qual = mullerQualifyingMap();
            const today = new Date().toISOString().slice(0, 10);
            let streak = 0;
            const d = new Date();
            if (!qual[today]) d.setDate(d.getDate() - 1);
            for (let guard = 0; guard < 400; guard++) {
                const key = d.toISOString().slice(0, 10);
                if (qual[key]) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                } else break;
            }
            return streak;
        }
        function mullerBumpVocabStreakRating() {
            let st = mullerGetStreakTodayStats();
            const today = new Date().toISOString().slice(0, 10);
            if (st.date !== today) st = { date: today, vocabRated: 0, points: 0, activeSec: 0 };
            st.vocabRated += 1;
            mullerSaveStreakTodayStats(st);
            mullerUpdateQualifyingForStats(st);
        }
        function mullerGetMainDailyGoalCards() {
            try {
                const n = parseInt(localStorage.getItem(MULLER_MAIN_GOAL_KEY) || '15', 10);
                return Math.max(3, Math.min(120, n || 15));
            } catch (e) { return 15; }
        }
        function mullerPushOcrHistory(entry) {
            try {
                const raw = localStorage.getItem(MULLER_OCR_HIST_KEY);
                const arr = raw ? JSON.parse(raw) : [];
                arr.unshift({
                    ...entry,
                    at: new Date().toISOString(),
                    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
                });
                while (arr.length > 15) arr.pop();
                localStorage.setItem(MULLER_OCR_HIST_KEY, JSON.stringify(arr));
                return arr;
            } catch (e) {
                return [];
            }
        }

        /** Simulacro oral B1 — plantillas ampliadas (solo front). */
        const MULLER_ORAL_B1_QUESTIONS = [
            { de: 'Was halten Sie von Kunst in der modernen Gesellschaft?', es: '¿Qué opina del arte en la sociedad moderna?', model: 'Ich finde, dass Kunst wichtig ist, weil sie die Kultur bereichert.' },
            { de: 'Wie wichtig ist Ihnen Umweltschutz im Alltag?', es: '¿Qué importancia tiene para usted la protección del medio ambiente?', model: 'Für mich ist Umweltschutz sehr wichtig, deshalb trenne ich Müll.' },
            { de: 'Was denken Sie über soziale Medien?', es: '¿Qué piensa de las redes sociales?', model: 'Soziale Medien haben Vorteile, aber man sollte vorsichtig sein.' },
            { de: 'Beschreiben Sie Ihren typischen Arbeitstag.', es: 'Describa su jornada laboral típica.', model: 'Normalerweise stehe ich früh auf und fahre mit dem Bus zur Arbeit.' },
            { de: 'Wie verbringen Sie Ihre Freizeit?', es: '¿Cómo pasa su tiempo libre?', model: 'In meiner Freizeit treffe ich Freunde oder lese ich Bücher.' },
            { de: 'Warum lernen Sie Deutsch?', es: '¿Por qué estudia alemán?', model: 'Ich lerne Deutsch, weil ich im Ausland arbeiten möchte.' },
            { de: 'Was sind Ihre Pläne für die nächsten Jahre?', es: '¿Cuáles son sus planes para los próximos años?', model: 'Ich möchte eine Weiterbildung machen und später eine Familie gründen.' },
            { de: 'Wie sieht Ihr Traumurlaub aus?', es: '¿Cómo sería sus vacaciones ideales?', model: 'Am liebsten fahre ich ans Meer und entspanne am Strand.' },
            { de: 'Welche Rolle spielt die Familie in Ihrem Leben?', es: '¿Qué papel tiene la familia en su vida?', model: 'Meine Familie unterstützt mich, und wir treffen uns oft am Wochenende.' },
            { de: 'Was würden Sie an Ihrer Stadt ändern?', es: '¿Qué cambiaría en su ciudad?', model: 'Ich würde mehr Grünflächen schaffen und den Verkehr reduzieren.' },
            { de: 'Wie gehen Sie mit Stress um?', es: '¿Cómo gestiona el estrés?', model: 'Bei Stress gehe ich spazieren oder höre Musik.' },
            { de: 'Welche Erfahrungen haben Sie mit anderen Kulturen gemacht?', es: '¿Qué experiencias ha tenido con otras culturas?', model: 'Ich habe gelernt, offen und respektvoll zu kommunizieren.' },
            { de: 'Was bedeutet für Sie ein gutes Zusammenleben in der Gesellschaft?', es: '¿Qué significa para usted una buena convivencia?', model: 'Toleranz und gegenseitiger Respekt sind mir sehr wichtig.' },
            { de: 'Erzählen Sie von einem wichtigen Erlebnis in Ihrem Leben.', es: 'Cuente una experiencia importante en su vida.', model: 'Ein wichtiges Erlebnis war mein Studium im Ausland.' },
            { de: 'Wie informieren Sie sich über aktuelle Nachrichten?', es: '¿Cómo se informa de las noticias?', model: 'Ich lese online Zeitung und schaue abends die Nachrichten.' },
            { de: 'Was erwarten Sie von einem guten Chef bzw. einer guten Chefin?', es: '¿Qué espera de un buen jefe o jefa?', model: 'Ich erwarte klare Kommunikation und faire Behandlung.' },
            { de: 'Diskutieren Sie kurz: Bildung vs. Berufserfahrung.', es: 'Debate breve: formación vs. experiencia laboral.', model: 'Beides ist wichtig, aber Erfahrung hilft im Alltag oft schneller.' },
            { de: 'Wie stehen Sie zu Homeoffice?', es: '¿Qué opina del teletrabajo?', model: 'Homeoffice ist flexibel, aber man braucht Disziplin.' }
        ];
        function mullerSortVocabBySrs(words, map) {
            const todayStr = new Date().toISOString().slice(0, 10);
            const today = new Date(todayStr + 'T12:00:00');
            function urgency(w) {
                const rec = map[mullerVocabSrsKey(w)];
                if (!rec || !rec.due) return 0.3;
                const due = new Date(rec.due + 'T12:00:00');
                const diffDays = Math.floor((due - today) / 864e5);
                if (diffDays < 0) return diffDays;
                if (diffDays === 0) return 0;
                return 500 + diffDays;
            }
            return [...words].sort((a, b) => {
                const ua = urgency(a), ub = urgency(b);
                if (ua !== ub) return ua - ub;
                return (a.de || '').localeCompare(b.de || '');
            });
        }
        function mullerCountVocabSrsDue(words, map) {
            const todayStr = new Date().toISOString().slice(0, 10);
            let n = 0;
            words.forEach((w) => {
                const rec = map[mullerVocabSrsKey(w)];
                if (!rec || !rec.due) { n++; return; }
                if (rec.due <= todayStr) n++;
            });
            return n;
        }

        /** Textos de ayuda contextual (pestañas, modos, submodos). */
        const MULLER_EXERCISE_HELP = {
            nav_historia: { title: 'Historia', what: 'Es el núcleo del entrenador: escenas de diálogo con audio, vocabulario integrado y modos extra (dictado, huecos, roleplay…). Avanza con los controles inferiores.', tips: ['Empieza escuchando cada escena varias veces antes de leer la traducción.', 'Combina con Podcast o velocidad (slider) para acostumbrar el oído.', 'Usa los toggles de arriba solo uno a la vez para no mezclar objetivos.'] },
            nav_shadowing: { title: 'Shadowing', what: 'Repites en voz alta justo después del modelo de audio (misma escena que en Historia). Entrena ritmo, entonación y pronunciación sin inventar texto nuevo.', tips: ['Empieza más lento (control de velocidad) y sube cuando fluya.', 'No mires la traducción hasta haber shadoweado al menos una vez.', 'Si puedes, graba tu voz y compárala con el modelo.'] },
            nav_escritura: { title: 'Escritura', what: 'Lienzo para tableta: caligrafía, dictados, temas y OCR opcional. Pensado para escribir a mano como en el papel del examen.', tips: ['Activa líneas de cuaderno si te ayuda la alineación.', 'En dictado, escucha dos veces antes de mirar la solución.', 'En tableta, apoya la mano: el lienzo usa pointer capture para no perder trazos.'] },
            nav_vocab: { title: 'Vocabulario', what: 'Tarjetas de la lista activa (guion o lección propia): escuchas alemán, revelas español y calificas. El SRS programa el repaso.', tips: ['Di la palabra en voz alta antes de revelar.', 'Usa Fácil/Normal/Difícil con honestidad: el calendario depende de ello.', 'Mezcla lecciones en Biblioteca para sesiones largas.'] },
            nav_b1: { title: 'B1 Fundamentos', what: 'Banco de frases modelo (JSON) por categorías: vocabulario, verbos, preposiciones, conectores, Redemittel y modo mix.', tips: ['Alterna MIX con categorías débiles.', 'Escucha la frase varias veces antes de leer la traducción.', 'Anota en Escritura las que quieras fijar.'] },
            nav_b2: { title: 'B2 Meisterklasse', what: 'Misma estructura que B1 pero con estructuras más altas; útil para subir registro y conectores complejos.', tips: ['Lee en voz alta la versión “alta” para automatizar.', 'Compara con la línea básica si el JSON la trae.', 'Lleva un cuaderno de frases copiadas a mano.'] },
            nav_progreso: { title: 'Progreso', what: 'Resumen de racha, mazos difícil/normal, gramática, gráfico semanal y exportación PDF/Anki.', tips: ['Exporta PDF antes de examen para revisar en papel.', 'Los mazos se alimentan desde Vocab y gramática guardada en Historia.', 'SRS de vocabulario tiene su propio contador en la pantalla de ayuda.'] },
            nav_biblioteca: { title: 'Biblioteca', what: 'Guardas guiones pegados desde la IA y listas de vocabulario personalizadas; puedes enviar un texto pegado a B1 o B2 (vocabulario, verbos, etc.) con nivel automático por frase o forzando un nivel.', tips: ['Revisa el formato del prompt de IA antes de pegar.', '“Distribuir” estima B1/B2 por heurística local (no es IA); puedes forzar todo a B1 o B2.', 'Las tarjetas del archivo b1-b2-database.json no son “tuyas”: “Borrar aportaciones” solo quita lo añadido desde Distribuir.', 'Las lecciones de vocab se practican con el botón Practicar.'] },
            nav_lexikon: { title: 'Lexikon', what: 'Traducción de palabras o frases (detección automática de idioma hacia alemán o español que elijas); opción aparte para solo Wiktionary; guardar pares en las mismas lecciones que en Biblioteca → Vocab.', tips: ['En “Palabra → traducción” elige ES→DE si buscas cómo se dice en alemán una palabra en español.', 'En el traductor usa “→ Alemán” o “→ Español” para forzar el sentido (incluye palabras malsonantes: el servicio puede devolver equivalentes o censura según el motor).', 'Si el desplegable de lecciones está vacío, crea lecciones en Biblioteca → Vocab; al abrir Lexikon se vuelve a leer el almacenamiento local.'] },
            nav_telc: { title: 'TELC por nivel', what: 'Orientación por nivel CEFR: estructura típica de examen (lectura, escucha, escritura, oral), checklist del día y enlaces oficiales. No sustituye modelos de examen ni convocatoria.', tips: ['Elige tu nivel arriba (A1–C2).', 'Los tiempos reales los marca tu centro; confirma en tu hoja de inscripción.', 'Para modelos oficiales usa telc.de / el centro examinador.', 'Combina con la pestaña Entrenamiento para práctica tipo test.'] },
            nav_ia: { title: 'IA Story Builder', what: 'Genera un guion nuevo con nivel y tema; útil cuando quieres vocabulario fresco sin pegar texto manual.', tips: ['Indica bien el nivel (B1/B2) y el tema.', 'Tras generar, guarda y estudia en Historia.', 'Combina con vocab propio en el campo de palabras si existe.'] },
            nav_comunidad: { title: 'Comunidad', what: 'Opción A: cuenta solo en el navegador (PBKDF2 local). Opción B (gratis): Supabase — mismo registro pero con sesión en la nube, directorio de perfiles y tabla de liga semanal compartida; bots siguen siendo simulados en tu ranking.', tips: ['Pega URL y anon key de Supabase en index.html (Project Settings → API) y ejecuta supabase/schema.sql en el SQL Editor.', 'El plan gratuito de Supabase suele bastar para estudio; revisa límites en el dashboard.', 'Si no configuras Supabase, todo sigue funcionando en modo local.', 'Tecla O para abrir Comunidad.'] },
            historia_base: { title: 'Historia — vista general', what: 'Escuchas y lees escenas; el vocabulario resaltado enlaza con las tarjetas. Abajo tienes play, escenas y velocidad.', tips: ['Primero escucha, luego muestra traducción.', 'Sube o baja la velocidad según el nivel del día.', 'PDF del guion sirve para repaso offline.'] },
            historia_podcast: { title: 'Modo Podcast', what: 'Reproduce el guion actual escena a escena sin tener que pulsar “siguiente”. Con “Todos los guiones” (barra superior) pasa al siguiente guion guardado al terminar el actual — útil en coche para encadenar varios.', tips: ['Elige el guion en el menú “Guion en Historia” (arriba a la izquierda).', 'Podcast solo afecta al guion cargado; “Todos los guiones” encadena tus guiones de Biblioteca en orden.', 'Combina con Solo audio y velocidad para manos libres.'] },
            historia_interview: { title: 'Simulación oral (Teil 2)', what: 'Pregunta tipo examen; mantienes pulsado el micrófono para responder y recibes feedback por palabras.', tips: ['Responde en frases completas, no solo sí/no.', 'Mira el feedback de palabras para afinar pronunciación.', 'Relájate: es entrenamiento, no evaluación oficial.'] },
            historia_roleplay: { title: 'Roleplay / tu turno', what: 'La app silencia voces para que leas o digas tú la réplica; puedes escuchar modelo, grabar y ver puntuación.', tips: ['Haz primero play del modelo y luego imita.', 'Comprueba la traducción solo después de intentar.', 'Pasa de escena cuando estés satisfecho con tu toma.'] },
            historia_puzzle: { title: 'Satzbau (puzzle)', what: 'Reconstruye la frase arrastrando trozos en orden. Refuerza orden de palabras en alemán.', tips: ['Escucha la pista de audio antes de mirar la solución.', 'Piensa en el verbo en segunda posición en main clauses.', 'Comprueba solo cuando hayas colocado todas las piezas.'] },
            historia_diktat: { title: 'Diktat', what: 'Dictado: escribes lo que oyes y comparas con el modelo. Refuerza ortografía y oído.', tips: ['No mires el texto hasta corregir.', 'Repite el audio varias veces; el TELC permite escuchar.', 'Presta atención a umlauts y ß.'] },
            historia_huecos: { title: 'Huecos (Lückentext)', what: 'Palabras clave ocultas en el texto; piensa significado y forma antes de seguir.', tips: ['Lee la frase entera en silencio primero.', 'Fíjate en colocaciones del vocabulario marcado.', 'Si bloqueas, revela traducción y vuelve a intentar.'] },
            historia_artikel: { title: 'Artículos (Sniper)', what: 'Los artículos aparecen ocultos: debes decidir der/die/das o forma casuada al leer.', tips: ['Revisa género en las tarjetas de vocabulario de la escena.', 'Di en voz alta la palabra con artículo correcto antes de continuar.', 'Combina con entrenamiento avanzado de artículos para más volumen.'] },
            historia_declinar: { title: 'Declinación', what: 'Se ocultan terminaciones de artículos/adjetivos: piensa caso (Nom/Akk/Dat/Gen).', tips: ['Identifica primero qué sustantivo gobierna el verbo/preposición.', 'Repasa la tabla corta en cabeza antes de mostrar.', 'Enlaza con el modo de preposiciones en Entrenamiento.'] },
            historia_tempus: { title: 'Tempus', what: 'Panel extra con formas verbales del texto para repasar Präteritum/Perfekt y familia.', tips: ['Di en voz alta las tres formas que propone el panel.', 'Compara con la frase original en contexto.', 'Anota verbos irregulares en tu lista.'] },
            historia_blind: { title: 'Modo oído (blur)', what: 'El texto aparece borroso hasta que te acercas: fuerzas escucha primero.', tips: ['Escucha el audio completo una vez con ojos en blur.', 'Quita blur solo para palabras concretas.', 'Ideal para reducir dependencia de la lectura.'] },
            historia_dialogue: { title: 'Diálogo estándar', what: 'Ves la escena, reproduces audio y puedes mostrar traducción. Es el modo por defecto sin dictado ni puzzle.', tips: ['Alterna lectura en voz alta y solo escucha.', 'Pulsa Tutor IA si una estructura no te encaja.', 'Guarda gramática con el botón de guardar si quieres repasarla después.'] },
            historia_herramientas: { title: 'Barra de herramientas (Historia)', what: 'Flüstern: voz más baja; Ruido: ambiente; Diktat/Huecos/Artículos/Declinar/Tempus/Satzbau/Oído y selector de personajes mudos cambian cómo interactúas con la misma escena.', tips: ['Activa solo una herramienta “fuerte” a la vez (dictado, puzzle…).', 'Mutear personajes sirve para practicar solo tus líneas.', 'Satzbau y Diktat son los más lentos: reserva tiempo.'] },
            historia_quiz: { title: 'Quiz / examen rápido', what: 'Modo pregunta-respuesta cuando esté activo en tu flujo.', tips: ['Lee el enunciado dos veces.', 'Gestiona el tiempo como en examen.', 'Repasa errores en Historia normal después.'] },
            shadowing_main: { title: 'Shadowing — cómo practicar', what: 'Escuchas la frase del guion con voz preferida, luego la repites al unísono o justo después. El micrófono opcional da feedback por palabra.', tips: ['No traduzcas mentalmente palabra a palabra: imita sonido.', 'Si el texto es largo, divide en mitades.', 'Ajusta la velocidad shadow si la app lo permite.'] },
            escritura_free: { title: 'Escritura — libre', what: 'Hoja en blanco para apuntes, conjugaciones o lo que necesites.', tips: ['Goma con varios anchos borra sin vaciar el lienzo; Deshacer trazo quita el último gesto.', 'Marcador y subrayado ayudan a marcar errores o énfasis como en papel.', 'Guarda PNG o usa OCR cuando quieras revisar el texto.'] },
            escritura_copy: { title: 'Escritura — copia', what: 'Copias frases modelo para caligrafía y ortografía.', tips: ['Mira la frase completa, luego escribe de memoria en el lienzo.', 'Repite la misma línea varias veces.', 'Compara tu escritura con la fuente al final.'] },
            escritura_dictation: { title: 'Escritura — dictado', what: 'Escuchas un dictado por TTS y escribes; puedes ver la solución para autocorregir.', tips: ['Dos escuchas antes de revelar.', 'Anota en borrador mental la puntuación.', 'Pasa a otro dictado cuando domines el actual.'] },
            escritura_prompt: { title: 'Escritura — tema', what: 'Recibes un tema B1/B2 para escribir un mini texto a mano.', tips: ['Escribe un esquema de 3 ideas en el lienzo.', 'No pares en la primera frase: busca 5–8 líneas.', 'Lee en voz alta lo escrito para detectar errores.'] },
            escritura_letters: { title: 'Escritura — letras alemanas', what: 'Practicas Ä, Ö, Ü, ß y ligaduras típicas.', tips: ['Haz filas enteras de una letra antes de mezclar.', 'Pronuncia en voz alta mientras escribes.', 'Pasa al siguiente bloque cuando salgan uniformes.'] },
            escritura_guion: { title: 'Escritura — guion', what: 'Copias líneas del guion cargado en Historia/Biblioteca.', tips: ['Avanza escena a escena como en shadowing lento.', 'Tapar traducción hasta haber escrito.', 'Útil como dictado propio: léete la frase y escribe sin mirar.'] },
            escritura_vocab: { title: 'Escritura — vocabulario', what: 'Escribes a mano la palabra activa de tu lista de vocabulario.', tips: ['Di la palabra en voz alta antes de trazar.', 'Si la lista está vacía, abre Vocab o carga guion.', 'Combina con OCR si quieres comparar trazo con modelo.'] },
            vocab_active_recall: { title: 'Vocabulario — active recall', what: 'Escuchas alemán, intentas recordar español, revelas y calificas. El SRS ordena la lista automáticamente.', tips: ['No marques “fácil” si solo reconoces: hay que recordar.', 'Usa escritura a mano si necesitas refuerzo motor.', 'Mezcla lecciones para variedad.'] },
            bx_mix: { title: 'B1/B2 — modo MIX', what: 'Baraja frases de todas las categorías del JSON activo.', tips: ['Ideal cuando ya dominas categorías sueltas.', 'Marca mentalmente las que fallas y vuelve en modo categoría.', 'Escucha primero, lee después.'] },
            bx_vocabulario: { title: 'B1/B2 — vocabulario', what: 'Frases cortas con léxico clave por nivel.', tips: ['Lee en voz alta ambas columnas.', 'Copia 3 que te cuesten a Escritura.', 'Relaciona con Historia buscando palabras en guion.'] },
            bx_verbos: { title: 'B1/B2 — verbos', what: 'Patrones verbales y colocaciones frecuentes.', tips: ['En voz alta: infinitivo + ejemplo.', 'Crea una mini frase tuya con cada verbo.', 'Cruza con preposiciones si el verbo las pide.'] },
            bx_preposiciones: { title: 'B1/B2 — preposiciones', what: 'Uso de Kasus con preposiciones típicas.', tips: ['Memoriza verbo + preposición como bloque.', 'Haz dos frases: una Dativo otra Akkusativ si aplica.', 'Repasa en Entrenamiento para más ítems.'] },
            bx_conectores: { title: 'B1/B2 — conectores', what: 'Conectores lógicos para escritura oral y Redemittel.', tips: ['Clasifica: oposición, causa, consecuencia, tiempo.', 'Escribe un minipárrafo usando solo conectores nuevos.', 'Úsalos en Historia al improvisar respuestas.'] },
            bx_redemittel: { title: 'B1/B2 — Redemittel', what: 'Fórmulas listas para examen oral/escrito.', tips: ['Aprende de memoria 5 por semana.', 'Dílas en voz alta con buena entonación.', 'Inserta una por respuesta en simulación oral.'] },
            progreso_dashboard: { title: 'Progreso — panel', what: 'Ves racha, monedas, mazos y exportaciones; el bloque de Entrenamiento resume práctica avanzada si lo usas.', tips: ['Haz PDF antes de vacaciones para no perder la foto.', 'Revisa mazos difícil cada pocos días.', 'Combina con backup JSON flotante para copia total.'] },
            guiones_import: { title: 'Biblioteca — guiones', what: 'Pegas texto de la IA con título y lo guardas; al cargarlo se vuelve tu Historia activa.', tips: ['Comprueba títulos para encontrar lecciones rápido.', 'Borra versiones viejas para no confundirte.', 'El prompt sugerido está arriba: cópialo tal cual a ChatGPT/Gemini.'] },
            guiones_vocab_custom: { title: 'Biblioteca — vocabulario propio', what: 'Pegas listas “alemán — español” y guardas lecciones; luego Practicar o mezcla.', tips: ['Una línea por palabra facilita el parseo.', 'Mezcla varias lecciones para simular examen amplio.', 'Exporta a Anki desde Progreso si usas mazos allí.'] },
            guiones_bx_distrib: { title: 'Biblioteca → B1 / B2 (subpestañas)', what: 'Desde un texto pegado se extraen frases y se clasifican por tipo (vocabulario, verbos, etc.); cada frase se coloca en B1 o B2 según reglas locales o en un solo nivel si lo fuerzas.', tips: ['Si tenías un guion guardado cargado en Historia al pulsar Distribuir, esas tarjetas quedan vinculadas: al borrar ese guion puedes quitar también esas entradas en B1/B2.', 'El nivel automático es una estimación: revisa en B1/B2 y mueve o borra tarjetas con “Tu biblioteca”.', 'Frases antiguas sin vincular: usa “Borrar mis aportaciones” o borra tarjeta a tarjeta. El archivo b1-b2-database.json del proyecto no se borra desde aquí.'] },
            guiones_mix: { title: 'Mezclar lecciones de vocabulario', what: 'Seleccionas varias lecciones guardadas y generas una sesión única en la pestaña Vocab.', tips: ['Marca al menos dos lecciones si quieres variedad.', 'Las tarjetas difíciles se suelen repetir al final.', 'Úsalo antes de un examen para repaso amplio.'] },
            storybuilder: { title: 'IA Story Builder', what: 'Pides a la app/IA integrada un guion según nivel y tema; luego lo estudias como cualquier Historia.', tips: ['Sé concreto en el tema (trabajo, medio ambiente…).', 'Revisa que el vocabulario coincida con tus metas.', 'Guarda siempre en Biblioteca para no perderlo.'] },
            practice_mazos: { title: 'Entrenamiento rápido (mazos)', what: 'Repasas tarjetas guardadas como difícil, normal o gramática: audio, revelar traducción, siguiente.', tips: ['No mires revelar hasta haber intentado recordar.', 'Haz lotes cortos varias veces al día.', 'Cuando vacíe un mazo, vuelve a Historia para añadir nuevas frases.'] },
            advanced_menu: { title: 'Entrenamiento avanzado', what: 'Práctica guiada de artículos, verbos con preposición, preposiciones puras, conectores y simulacro tipo examen con cronómetro.', tips: ['Empieza por la categoría con peor porcentaje en el dashboard.', 'El modo examen entrena gestión de tiempo, no solo aciertos.', 'Cierra sesiones cortas para fijar mejor.', 'Artículos (JSON): usa "levels": ["A1","A2","B1"] para que la misma palabra salga en varios mazos; si repites la misma "de" con otro "level", la app une los niveles automáticamente.'] },
            advanced_exam: { title: 'Simulacro TELC (avanzado)', what: 'Cronómetro orientativo, pistas limitadas y mezcla de ítems según lo que elijas.', tips: ['Elige duración realista (20–30 min al principio).', 'Usa pistas solo cuando lleves bloqueado más de un minuto.', 'Al terminar, repasa solo los fallos en modo categoría.'] },
            nav_ruta: { title: 'Ruta A0 → C1', what: 'Camino guiado desde cero real: lecciones con frases, huecos, lectura en voz alta y recompensas. Pestaña Gramática resume reglas por nivel. Test de nivel sugiere por dónde empezar.', tips: ['Tecla R para abrir Ruta.', 'Elige mentor (voz) arriba: Frau Lena, Herr Tom o Lina.', 'Cada 3 lecciones completadas hay bonus extra de monedas.', 'El contenido se ampliará por niveles hasta C1.'] },
            ruta_gramatica: { title: 'Ruta — Gramática', what: 'Resumen por niveles (A1, A2, B1) con explicaciones claras. No sustituye un libro de texto: combínalo con Historia y ejercicios.', tips: ['Abre el bloque del nivel que estudies en el camino.', 'Copia un ejemplo a Escritura para fijarlo.', 'Si algo no cuadra, pregunta a tu tutor o al foro.'] },
            nav_inicio: { title: 'Inicio', what: 'Pantalla principal con accesos rápidos y pendientes de repaso (SRS). Desde aquí saltas a Historia, vocab, shadowing, etc.', tips: ['Tecla I para volver al Inicio.', 'El número en Vocab indica tarjetas prioritarias del SRS.', 'Tras la bienvenida (banderas), eliges qué practicar.'] },
            hub_centro: { title: 'Centro Müller', what: 'Voces del sistema, ayuda, IA Chrome local; el plan del día y el resumen rápido están en Progreso.', tips: ['Configura voces antes de sesiones largas.', 'Pestaña “IA Chrome”: resumen local con Gemini Nano si tu Chrome lo permite.', 'Esc para cerrar el panel.', 'Repite el tour si te pierdes.'] },
            hub_chrome_ai: { title: 'IA local (Chrome / Gemini Nano)', what: 'Usa la API Summarizer del navegador: el modelo se descarga en tu PC y el resumen se genera en local sin API key. Requiere Chrome de escritorio reciente y requisitos de hardware.', tips: ['Si no aparece la API, activa las funciones de IA en chrome://flags y reinicia.', 'Edge puede llevar APIs similares detrás de flags; Firefox/Safari no suelen soportarlo aún.', 'No sustituye un profesor: revisa los resúmenes.'] },
        };

        window.__MULLER_OPEN_EXERCISE_HELP = function (id) {
            try { window.dispatchEvent(new CustomEvent('mullerOpenExerciseHelp', { detail: { id: String(id) } })); } catch (e) {}
        };

        /** Sonidos UI (Web Audio, sin archivos). localStorage muller_sfx_enabled = '0' desactiva. */
        window.__mullerSfxEnabled = function () {
            try { return localStorage.getItem('muller_sfx_enabled') !== '0'; } catch (e) { return true; }
        };
        window.__mullerConsecutiveCorrect = 0;
        window.__mullerPlaySfx = function (kind, arg2) {
            if (!window.__mullerSfxEnabled()) return;
            try {
                var Ctx = window.AudioContext || window.webkitAudioContext;
                if (!Ctx) return;
                if (!window.__mullerAudioCtx) window.__mullerAudioCtx = new Ctx();
                var ctx = window.__mullerAudioCtx;
                if (ctx.state === 'suspended') ctx.resume();
                var t0 = ctx.currentTime;
                function tone(freq, start, len, vol, typ) {
                    var o = ctx.createOscillator();
                    var g = ctx.createGain();
                    o.type = typ || 'sine';
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(vol, t0 + start);
                    g.gain.exponentialRampToValueAtTime(0.001, t0 + start + len);
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start(t0 + start);
                    o.stop(t0 + start + len + 0.02);
                }
                if (kind === 'ok') {
                    tone(523, 0, 0.1, 0.11);
                    tone(784, 0.09, 0.14, 0.1);
                } else if (kind === 'bad') {
                    tone(160, 0, 0.12, 0.1, 'triangle');
                    tone(110, 0.08, 0.14, 0.08, 'triangle');
                } else if (kind === 'tick') {
                    tone(660, 0, 0.06, 0.07);
                } else if (kind === 'levelup') {
                    tone(392, 0, 0.08, 0.09);
                    tone(523, 0.07, 0.08, 0.09);
                    tone(659, 0.14, 0.11, 0.1);
                } else if (kind === 'complete') {
                    [523, 659, 784, 1046].forEach(function (f, i) {
                        tone(f, i * 0.08, 0.22, 0.095);
                    });
                } else if (kind === 'streak') {
                    var n = Math.max(5, Number(arg2) || 5);
                    var tier = Math.floor(n / 5);
                    var base = 392 * Math.pow(1.035, Math.min(tier, 40));
                    var count = 4 + Math.min(6, Math.floor(tier / 4));
                    for (var si = 0; si < count; si++) {
                        tone(base * Math.pow(1.259921, si), si * 0.055, 0.11, 0.09);
                    }
                    tone(Math.min(1400, base * Math.pow(1.259921, count)), count * 0.055 + 0.02, 0.2, 0.1);
                }
            } catch (e) {}
        };
        /** Acierto / fallo en ejercicios: ok/bad + racha global 5,10,15… (sin límite). opts.silent: no audio. */
        window.__mullerNotifyExerciseOutcome = function (correct, opts) {
            opts = opts || {};
            if (correct) {
                window.__mullerConsecutiveCorrect = (window.__mullerConsecutiveCorrect || 0) + 1;
                var streakN = window.__mullerConsecutiveCorrect;
                if (!opts.silent && window.__mullerSfxEnabled()) {
                    window.__mullerPlaySfx('ok');
                    if (streakN > 0 && streakN % 5 === 0) {
                        setTimeout(function () { window.__mullerPlaySfx('streak', streakN); }, 130);
                    }
                }
            } else {
                window.__mullerConsecutiveCorrect = 0;
                if (!opts.silent && window.__mullerSfxEnabled()) {
                    window.__mullerPlaySfx('bad');
                }
            }
        };
        window.__mullerToast = function (message, kind) {
            try {
                window.dispatchEvent(new CustomEvent('muller-toast', { detail: { message: String(message || ''), kind: String(kind || 'info') } }));
            } catch (e) {}
        };
        window.__mullerRandomMotivation = function () {
            var m = [
                'Cada error es una pista. ¡Sigue!',
                'Los expertos también fallaron al principio.',
                'Respira, escucha de nuevo y prueba otra vez.',
                'Tu cerebro está creando conexiones nuevas ahora mismo.',
                'Persistencia > perfección. Tú puedes.',
                'Un paso más cerca: corrige y sigue.',
            ];
            return m[Math.floor(Math.random() * m.length)];
        };

        window.mullerRutaDefaultProgress = function () {
            return { completed: {}, placementDone: false, suggestedLevelIdx: 0, playTimeMs: 0, lessonsCompleted: 0 };
        };
        window.mullerRutaLoad = function () {
            try {
                var raw = localStorage.getItem('muller_ruta_progress_v1');
                return raw ? Object.assign(window.mullerRutaDefaultProgress(), JSON.parse(raw)) : window.mullerRutaDefaultProgress();
            } catch (e) { return window.mullerRutaDefaultProgress(); }
        };
        window.mullerRutaSave = function (p) {
            try { localStorage.setItem('muller_ruta_progress_v1', JSON.stringify(p)); } catch (e) {}
        };
        window.mullerRutaIsLessonUnlocked = function (levels, levelIdx, lessonIdx, completed) {
            if (!levels[levelIdx] || !levels[levelIdx].lessons[lessonIdx]) return false;
            if (levelIdx === 0 && lessonIdx === 0) return true;
            if (lessonIdx === 0) {
                var prev = levels[levelIdx - 1];
                return prev.lessons.every(function (l) { return completed[l.id]; });
            }
            var prevId = levels[levelIdx].lessons[lessonIdx - 1].id;
            return !!completed[prevId];
        };

        window.MULLER_RUTA_LEVELS = [
            {
                id: 'a0-1',
                title: 'Nivel 0 · Base absoluta',
                badge: 'A0',
                lessons: [
                    {
                        id: 'a0-1-l1',
                        title: 'Sonidos + presentaciones mínimas',
                        topic: 'presentacion',
                        rewardCoins: 12,
                        rewardXp: 18,
                        grammarTip: 'En alemán, la frase base suele ir con verbo en 2ª posición: Ich bin Ana.',
                        phrases: [
                            { de: 'Ich bin Ana.', es: 'Soy Ana.' },
                            { de: 'Ich komme aus Sevilla.', es: 'Vengo de Sevilla.' },
                            { de: 'Ich lerne Deutsch.', es: 'Aprendo alemán.' }
                        ],
                        fill: { prompt: 'Completa: Ich ___ Ana.', answer: 'bin', hint: 'Verbo «sein», 1ª persona.' },
                        speak: { target: 'Ich bin Ana.' }
                    },
                    {
                        id: 'a0-1-l2',
                        title: 'Clase y objetos básicos',
                        topic: 'clase',
                        rewardCoins: 12,
                        rewardXp: 18,
                        grammarTip: 'Memoriza sustantivo + artículo como bloque: der Tisch, die Tür, das Buch.',
                        phrases: [
                            { de: 'Das ist ein Buch.', es: 'Eso es un libro.' },
                            { de: 'Die Tür ist offen.', es: 'La puerta está abierta.' },
                            { de: 'Der Tisch ist groß.', es: 'La mesa es grande.' }
                        ],
                        fill: { prompt: 'Completa: Das ist ___ Buch.', answer: 'ein', hint: 'Artículo indefinido neutro.' },
                        speak: { target: 'Das ist ein Buch.' }
                    }
                ]
            },
            {
                id: 'a1-1',
                title: 'Nivel 1 · Primeros pasos',
                badge: 'A1.1',
                lessons: [
                    {
                        id: 'a1-1-l1',
                        title: 'Saludos y presentación',
                        topic: 'presentacion',
                        rewardCoins: 15,
                        rewardXp: 20,
                        grammarTip: 'En frases declarativas el verbo conjugado va en 2.ª posición: sujeto – verbo – resto.',
                        phrases: [
                            { de: 'Guten Tag! Ich heiße Maria.', es: '¡Buenos días! Me llamo María.' },
                            { de: 'Wie geht es dir?', es: '¿Cómo estás?' },
                            { de: 'Ich komme aus Spanien.', es: 'Vengo de España.' },
                        ],
                        fill: { prompt: 'Completa: Ich ___ aus Spanien.', answer: 'komme', hint: 'Verbo «kommen» en 1.ª persona singular.' },
                        speak: { target: 'Ich komme aus Spanien.' },
                    },
                    {
                        id: 'a1-1-l2',
                        title: 'Artículos básicos',
                        topic: 'hogar',
                        rewardCoins: 15,
                        rewardXp: 22,
                        grammarTip: 'der (m), die (f), das (n). Muchos plurales llevan «die».',
                        phrases: [
                            { de: 'Das Buch ist neu.', es: 'El libro es nuevo.' },
                            { de: 'Die Frau liest.', es: 'La mujer lee.' },
                            { de: 'Der Mann wartet.', es: 'El hombre espera.' },
                        ],
                        fill: { prompt: '___ Buch liegt hier. (neutro)', answer: 'Das', hint: 'Artículo neutro.' },
                        speak: { target: 'Das Buch ist neu.' },
                    },
                ],
            },
            {
                id: 'a1-2',
                title: 'Nivel 2 · Rutina',
                badge: 'A1.2',
                lessons: [
                    {
                        id: 'a1-2-l1',
                        title: 'Hora y días',
                        topic: 'rutina',
                        rewardCoins: 18,
                        rewardXp: 24,
                        grammarTip: '«Um acht Uhr» = a las ocho. Los días llevan mayúscula: Montag, Dienstag…',
                        phrases: [
                            { de: 'Ich stehe um sieben Uhr auf.', es: 'Me levanto a las siete.' },
                            { de: 'Am Montag gehe ich zur Arbeit.', es: 'El lunes voy al trabajo.' },
                            { de: 'Das Wochenende ist kurz.', es: 'El fin de semana es corto.' },
                        ],
                        fill: { prompt: 'Ich stehe ___ sieben Uhr auf.', answer: 'um', hint: 'Preposición para «a las» con hora.' },
                        speak: { target: 'Am Montag gehe ich zur Arbeit.' },
                    },
                    {
                        id: 'a1-2-l2',
                        title: 'Comida simple',
                        topic: 'alimentos',
                        rewardCoins: 18,
                        rewardXp: 25,
                        grammarTip: '«Ich möchte» + Akkusativ del objeto: Ich möchte einen Kaffee.',
                        phrases: [
                            { de: 'Ich esse gern Brot.', es: 'Me gusta comer pan.' },
                            { de: 'Ich trinke Wasser.', es: 'Bebo agua.' },
                            { de: 'Was isst du gern?', es: '¿Qué te gusta comer?' },
                        ],
                        fill: { prompt: 'Ich möchte ___ Kaffee. (masculino acusativo)', answer: 'einen', hint: 'Artículo acusativo masculino.' },
                        speak: { target: 'Ich esse gern Brot.' },
                    },
                ],
            },
            {
                id: 'a2-1',
                title: 'Nivel 3 · Conectar frases',
                badge: 'A2.1',
                lessons: [
                    {
                        id: 'a2-1-l1',
                        title: '«Weil» y verbo al final',
                        topic: 'conectores',
                        rewardCoins: 22,
                        rewardXp: 30,
                        grammarTip: 'Tras «weil/dass/obwohl» el verbo conjugado va al final de la suboración.',
                        phrases: [
                            { de: 'Ich lerne Deutsch, weil ich reisen möchte.', es: 'Estudio alemán porque quiero viajar.' },
                            { de: 'Weil es regnet, bleibe ich zu Hause.', es: 'Como llueve, me quedo en casa.' },
                        ],
                        fill: { prompt: 'Ich bleibe zu Hause, weil ich krank ___.', answer: 'bin', hint: 'Verbo «sein» al final (1.ª persona).' },
                        speak: { target: 'Ich lerne Deutsch, weil ich reisen möchte.' },
                    },
                    {
                        id: 'a2-1-l2',
                        title: 'Perfekt básico',
                        topic: 'gramatica',
                        rewardCoins: 22,
                        rewardXp: 32,
                        grammarTip: 'Perfekt: habe/hat + participio al final (regulares: ge- + stem + -t).',
                        phrases: [
                            { de: 'Ich habe gestern gearbeitet.', es: 'Ayer he trabajado.' },
                            { de: 'Sie hat das schon gemacht.', es: 'Ella ya lo ha hecho.' },
                        ],
                        fill: { prompt: 'Ich habe gestern viel ___. (arbeiten)', answer: 'gearbeitet', hint: 'Participio de «arbeiten».' },
                        speak: { target: 'Ich habe gestern gearbeitet.' },
                    },
                ],
            },
        ];

        window.MULLER_GRAMMAR_REF = [
            {
                level: 'A1',
                title: 'Fundamentos',
                blocks: [
                    { t: 'Orden de la frase (V2)', b: 'En la frase principal afirmativa, el verbo flexionado ocupa la segunda posición: «Heute gehe ich ins Kino.»' },
                    { t: 'Artículos y género', b: 'Memoriza sustantivo + artículo (der/die/das). El plural suele ser «die». Compara: der Tisch, die Lampe, das Fenster.' },
                    { t: 'Presente regular', b: 'Sufijos típicos: -e, -st, -t, -en. Irregulares comunes: sein, haben, werden.' },
                ],
            },
            {
                level: 'A2',
                title: 'Oraciones compuestas',
                blocks: [
                    { t: 'Subordinadas con «dass/weil/obwohl»', b: 'El verbo conjugado va al final: «Ich weiß, dass du kommst.»' },
                    { t: 'Perfekt', b: 'Auxiliar haben/sein + participio II. Muchos verbos de movimiento usan «sein» (sein, bleiben, passieren… contexto).' },
                    { t: 'Preposiciones y Kasus', b: 'Aprende bloques: «mit» + Dat., «für» + Akk., preposiciones de lugar «Wo?/Wohin?» con Dat./Akk.' },
                ],
            },
            {
                level: 'B1',
                title: 'Matices',
                blocks: [
                    { t: 'Konjunktiv II (politez)', b: '«Ich hätte gern…», «Könnten Sie…?» para peticiones suaves.' },
                    { t: 'Pasiva y alternativas', b: '«Es wird gemacht» / «Man macht» — reconocer sujeto impersonal.' },
                    { t: 'Conectores', b: '«trotzdem», «deshalb», «außerdem» — practica posición del verbo en cada tipo.' },
                ],
            },
            {
                level: 'B2',
                title: 'Estructuras avanzadas',
                blocks: [
                    { t: 'Conectores complejos', b: 'Introduce «während», «sobald», «falls», «hingegen». Ajusta el orden verbal según subordinada/principal.' },
                    { t: 'Nominalización y registro', b: 'Convierte acciones en sustantivos cuando el registro lo pide: «die Entscheidung treffen».' },
                    { t: 'Pasiva y enfoque informativo', b: 'Alterna activa/pasiva según el foco de la frase: proceso vs agente.' },
                ],
            },
            {
                level: 'C1',
                title: 'Precisión y estilo',
                blocks: [
                    { t: 'Conectores de argumentación', b: 'Usa «demzufolge», «folglich», «infolgedessen», «nichtsdestotrotz» con control de registro.' },
                    { t: 'Subordinación compleja', b: 'Encadena ideas con subordinadas sin perder claridad ni control de verbos al final.' },
                    { t: 'Matiz léxico', b: 'Elige verbo y conector por intención comunicativa (formal, neutral, académico).' },
                ],
            },
        ];

 window.MULLER_PLACEMENT_QUESTIONS = [
  // A1 (7 preguntas)
  { level: 'A1', q: 'Ich ___ aus Spanien.', opts: ['bin', 'habe', 'werde'], ok: 0 },
  { level: 'A1', q: '___ Buch liegt auf dem Tisch.', opts: ['Der', 'Die', 'Das'], ok: 2 },
  { level: 'A1', q: 'Wie ___ du?', opts: ['heißen', 'heißt', 'heiße'], ok: 1 },
  { level: 'A1', q: 'Wir ___ müde.', opts: ['sind', 'seid', 'ist'], ok: 0 },
  { level: 'A1', q: '___ ist dein Name?', opts: ['Was', 'Wie', 'Wo'], ok: 1 },
  { level: 'A1', q: 'Ich ___ gern Pizza.', opts: ['esse', 'isst', 'esst'], ok: 0 },
  { level: 'A1', q: 'Er ___ einen Hund.', opts: ['habe', 'hast', 'hat'], ok: 2 },

  // A2 (8 preguntas)
  { level: 'A2', q: 'Letzte Woche ___ wir im Kino.', opts: ['waren', 'sind', 'haben'], ok: 0 },
  { level: 'A2', q: 'Ich freue mich ___ das Wochenende.', opts: ['auf', 'über', 'für'], ok: 0 },
  { level: 'A2', q: 'Er ___ jeden Tag um 7 Uhr ___.', opts: ['steht ... auf', 'aufsteht', 'stehst ... auf'], ok: 0 },
  { level: 'A2', q: 'Das ist der Mann, ___ ich kenne.', opts: ['der', 'den', 'dem'], ok: 1 },
  { level: 'A2', q: 'Ich habe mein Buch ___.', opts: ['vergessen', 'vergesse', 'vergisst'], ok: 0 },
  { level: 'A2', q: '___ du mir helfen?', opts: ['Kannst', 'Kann', 'Können'], ok: 0 },
  { level: 'A2', q: 'Wir sind ___ Berlin gefahren.', opts: ['in', 'nach', 'zu'], ok: 1 },
  { level: 'A2', q: 'Er ___ krank, deshalb bleibt er zu Hause.', opts: ['ist', 'hat', 'wird'], ok: 0 },

  // B1 (8 preguntas)
  { level: 'B1', q: 'Wenn ich mehr Zeit ___, würde ich reisen.', opts: ['hätte', 'habe', 'gehabt'], ok: 0 },
  { level: 'B1', q: 'Das ist der Mann, mit ___ ich gesprochen habe.', opts: ['dem', 'der', 'den'], ok: 0 },
  { level: 'B1', q: 'Ich ___ gestern meine Oma ___.', opts: ['habe ... besucht', 'bin ... besucht', 'habe ... besuchen'], ok: 0 },
  { level: 'B1', q: '___ es regnet, bleiben wir drinnen.', opts: ['Wenn', 'Weil', 'Dass'], ok: 1 },
  { level: 'B1', q: 'Er ___ schon seit drei Jahren in Berlin.', opts: ['lebt', 'wohnt', 'arbeitet'], ok: 0 },
  { level: 'B1', q: 'Ich wünsche mir, dass du ___.', opts: ['kommst', 'kommst', 'kommen'], ok: 0 },
  { level: 'B1', q: 'Das Haus ___ 1990 ___.', opts: ['wurde ... gebaut', 'wird ... gebaut', 'ist ... gebaut'], ok: 0 },
  { level: 'B1', q: '___ du mich ___, wäre ich früher gekommen.', opts: ['Hättest ... angerufen', 'Hast ... angerufen', 'Würdest ... anrufen'], ok: 0 },

  // B2 (7 preguntas)
  { level: 'B2', q: 'Es ist wichtig, dass der Antrag rechtzeitig ___.', opts: ['eingereicht wird', 'eingereicht wurde', 'einreicht'], ok: 0 },
  { level: 'B2', q: '___ der hohen Kosten wurde das Projekt gestoppt.', opts: ['Wegen', 'Trotz', 'Aufgrund'], ok: 0 },
  { level: 'B2', q: 'Hätte ich das gewusst, ___ ich anders gehandelt.', opts: ['hätte', 'wäre', 'würde'], ok: 0 },
  { level: 'B2', q: 'Die Diskussion, ___ wir gestern geführt haben, war sehr interessant.', opts: ['die', 'der', 'das'], ok: 0 },
  { level: 'B2', q: 'Er gilt ___ einer der besten Experten.', opts: ['als', 'für', 'wie'], ok: 0 },
  { level: 'B2', q: '___ ich mich rechtzeitig beworben habe, wurde ich nicht eingeladen.', opts: ['Obwohl', 'Weil', 'Da'], ok: 0 },
  { level: 'B2', q: 'Die Maßnahmen ___ nur langsam ___.', opts: ['werden ... umgesetzt', 'wurden ... umgesetzt', 'sind ... umgesetzt'], ok: 0 },
];

        /** Contenido orientativo TELC / marcos similares (no texto de examen oficial). */
        window.MULLER_TELC_BY_LEVEL = {
            A1: {
                label: 'A1 · Start Deutsch 1 / equivalente',
                summary: 'Nivel inicial: tareas cortas, vocabulario cotidiano y comprensión global.',
                sections: [
                    { title: 'Pruebas típicas (estructura general)', items: ['Lectura: textos muy breves (avisos, carteles, formularios sencillos).', 'Escucha: diálogos lentos en situaciones cotidianas (tiendas, horarios).', 'Escritura: rellenar formularios, mensajes cortos (correo, SMS).', 'Oral: presentarse, preguntar precios, pedir información fija (Redemittel).'] },
                    { title: 'Qué trabajar en Müller', items: ['Ruta A1 y Vocab con SRS.', 'Historia en modo dictado y huecos.', 'Shadowing con frases cortas.'] },
                ],
            },
            A2: {
                label: 'A2 · Fit in Deutsch A2 / Goethe-Zertifikat A2',
                summary: 'Comprende frases aisladas y textos sencillos sobre temas familiares.',
                sections: [
                    { title: 'Pruebas típicas', items: ['Lectura: correos breves, anuncios, textos informativos sencillos.', 'Escucha: entender la idea principal en medios claros.', 'Escritura: correo o carta corta (motivo, tiempo, petición).', 'Oral: describir rutina, planes; interacción en situaciones conocidas.'] },
                    { title: 'Enfoque TELC', items: ['Suele haber varias partes de lectura con tareas de verificación.', 'La expresión escrita pide cumplir el encargo (Auftrag) del enunciado.'] },
                ],
            },
            B1: {
                label: 'B1 · TELC Deutsch B1 / Zertifikat B1',
                summary: 'Nivel independiente: textos auténticos moderados y producción conectada.',
                sections: [
                    { title: 'Estructura habitual (4 competencias)', items: ['Lesen: varios textos (periodístico, opinión, práctico) con preguntas globales y detalle.', 'Hören: entrevistas, reportajes; una sola emisión en muchos centros — lee antes las preguntas.', 'Schreiben: dos tareas (p. ej. correo + texto argumentativo o foro); respeta extensión y registro.', 'Sprechen: interacción (información, opiniones); a veces preparación previa.'] },
                    { title: 'Estrategia', items: ['Marca tiempo por bloque al inicio.', 'En escritura: plan de 5 minutos + párrafos con conectores (jedoch, deshalb, außerdem).', 'En oral: no solo vocabulario: claridad y turnos.'] },
                ],
            },
            B2: {
                label: 'B2 · TELC Deutsch B2 / Zertifikat B2',
                summary: 'Textos más largos y matizados; producción argumentativa y registro elevado.',
                sections: [
                    { title: 'Pruebas típicas', items: ['Lectura: artículos, comentarios; inferencias y opiniones del autor.', 'Escucha: ritmo más natural; notas y detalles.', 'Escritura: carta formal / texto de opinión con estructura clara (Einleitung – Hauptteil – Schluss).', 'Oral: debate, ventajas/desventajas, matizar posiciones.'] },
                    { title: 'Errores frecuentes', items: ['Confundir registro (du/Sie, coloquial vs académico).', 'Subordinadas sin verbo al final.', 'Tiempo insuficiente en la última parte escrita.'] },
                ],
            },
            C1: {
                label: 'C1 · TELC Deutsch C1 / Kleines / Großes Deutsch',
                summary: 'Comprensión sutil; producción estructurada y variación léxica.',
                sections: [
                    { title: 'Enfoque', items: ['Lectura: textos complejos (ironía, matices, estructura implícita).', 'Escucha: conferencias, entrevistas densas.', 'Escritura: textos formales extensos (informe, ensayo breve) con cohesión fuerte.', 'Oral: argumentación fina, reformulación, concesión (zwar … aber).'] },
                    { title: 'Preparación', items: ['Lee prensa alemana (Zeit, Spiegel) con anotación de conectores.', 'Simula cronómetro en Escritura (panel Müller / TELC).'] },
                ],
            },
            C2: {
                label: 'C2 · TELC Deutsch C2 (casi nativo)',
                summary: 'Comprensión casi total; producción precisa y estilísticamente variada.',
                sections: [
                    { title: 'Pruebas típicas', items: ['Lectura: textos literarios o especializados; reformulación y síntesis.', 'Escucha: velocidad y ambiente natural.', 'Escritura: resúmenes, estilo y precisión léxica.', 'Oral: presentación estructurada y discusión abierta.'] },
                    { title: 'Nota', items: ['C2 no es “más vocabulario”: es precisión, registro y estilo.'] },
                ],
            },
        };

        // --- COMPONENTE PRINCIPAL ---
        function App() {
          const [activeTab, setActiveTab] = useState(() => { try { return localStorage.getItem('muller_active_tab_v1') || 'inicio'; } catch { return 'inicio'; } });
          const [showSplash, setShowSplash] = useState(false); 
          const [splashLogoBlink, setSplashLogoBlink] = useState(false);
          const [rutaSubTab, setRutaSubTab] = useState('camino');
          const [rutaProgress, setRutaProgress] = useState(() => (typeof window.mullerRutaLoad === 'function' ? window.mullerRutaLoad() : { completed: {}, placementDone: false, suggestedLevelIdx: 0, playTimeMs: 0, lessonsCompleted: 0 }));
          const [rutaRun, setRutaRun] = useState(null);
          const [rutaVerbDb, setRutaVerbDb] = useState({ meta: null, verbs: [] });
          const [rutaArticleDb, setRutaArticleDb] = useState([]);
          const [rutaTopicFilter, setRutaTopicFilter] = useState('all');
          // --- NUEVOS ESTADOS PARA TEST ADAPTATIVO (30 PREGUNTAS) ---
const [placementQuestions, setPlacementQuestions] = useState([]);
const [placementAnswers, setPlacementAnswers] = useState([]);
const [placementIndex, setPlacementIndex] = useState(0);
const [placementLevel, setPlacementLevel] = useState('A2');
const [placementScore, setPlacementScore] = useState({ correct: 0, total: 0 });
const [placementFinished, setPlacementFinished] = useState(false);
          const [rutaMentor, setRutaMentor] = useState('lena');
          const [rutaFillInput, setRutaFillInput] = useState('');
          const [rutaSpeakErr, setRutaSpeakErr] = useState('');
          const [celebrationModal, setCelebrationModal] = useState(null);
          const [telcLevel, setTelcLevel] = useState('B1');
          const [diktatMotivationMsg, setDiktatMotivationMsg] = useState('');
          const rutaTabTimerRef = useRef(null);
          const [rutaTranscript, setRutaTranscript] = useState('');
          const [rutaListening, setRutaListening] = useState(false);
          const [readingSource, setReadingSource] = useState('current_story');
          const [readingScriptId, setReadingScriptId] = useState('__current__');
          const [readingTextInput, setReadingTextInput] = useState('');
          const [readingFontPx, setReadingFontPx] = useState(() => {
              try {
                  const raw = Number(localStorage.getItem(MULLER_READING_FONT_STORAGE));
                  return Number.isFinite(raw) ? mullerClamp(raw, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX) : 19;
              } catch (e) {
                  return 19;
              }
          });
          const [readingWordInfo, setReadingWordInfo] = useState(null);
          const [readingFocusMode, setReadingFocusMode] = useState(false);
          const [readingSelectedSnippet, setReadingSelectedSnippet] = useState('');
          const [readingWordAudioBusy, setReadingWordAudioBusy] = useState(false);
          const [readingListening, setReadingListening] = useState(false);
          const [readingTranscript, setReadingTranscript] = useState('');
          const [readingScore, setReadingScore] = useState(null);
          const [readingFeedback, setReadingFeedback] = useState([]);
          const [diagnosticOpen, setDiagnosticOpen] = useState(false);
          const [showSelfCheckPanel, setShowSelfCheckPanel] = useState(false);
          const [sfxEpoch, setSfxEpoch] = useState(0);
          const rutaRecRef = useRef(null);
          const readingRecRef = useRef(null);
          const readingFinalRef = useRef('');
          const readingLiveTranscriptRef = useRef('');
          const readingStopRequestedRef = useRef(false);
          const readingAutoRestartRef = useRef(false);
          const readingRestartTimerRef = useRef(null);
          const readingSessionIdRef = useRef(0);
          const readingTextSurfaceRef = useRef(null);
          const [guionData, setGuionData] = useState(DEFAULT_GUION);
          const [activeScriptTitle, setActiveScriptTitle] = useState("Lektion 17: Kunst");
          const [isDefaultScript, setIsDefaultScript] = useState(true);
          const [sceneIndex, setSceneIndex] = useState(0);
          const [mode, setMode] = useState('dialogue'); 
          const [isPlaying, setIsPlaying] = useState(false);
          const [voicesLoaded, setVoicesLoaded] = useState(false);
          const [playbackRate, setPlaybackRate] = useState(1.0); 
          const [blindMode, setBlindMode] = useState(false); 
          const [lueckentextMode, setLueckentextMode] = useState(false);
          const [declinaMode, setDeclinaMode] = useState(false); 
          const [tempusMode, setTempusMode] = useState(false); 
          const [artikelSniperMode, setArtikelSniperMode] = useState(false); 
          const [fluesternMode, setFluesternMode] = useState(false);
          const [noiseEnabled, setNoiseEnabled] = useState(false); // NUEVO: Ruido de fondo
          const [roleplayChar, setRoleplayChar] = useState('none');
          const [podcastMode, setPodcastMode] = useState(false);
          const [showHistoriaMenu, setShowHistoriaMenu] = useState(false);
          /** Tras el último guion, carga el siguiente de Biblioteca (solo tiene efecto al terminar una escena en flujo normal / podcast). */
          const [historiaPlaylistAllScripts, setHistoriaPlaylistAllScripts] = useState(false);
          const [showCurrentTranslation, setShowCurrentTranslation] = useState(false); 
          const [tempusVerbList, setTempusVerbList] = useState([]);
          const [tempusSelectedVerb, setTempusSelectedVerb] = useState(null);
          const [diktatMode, setDiktatMode] = useState(false);
          const [diktatInput, setDiktatInput] = useState("");
          const [showDiktatResult, setShowDiktatResult] = useState(false);
          const [savedScripts, setSavedScripts] = useState([]);
          /** Si practicas un guion guardado en Biblioteca, su id; si no, null (ejemplo, IA o no guardado). Sirve para vincular «Distribuir → B1/B2». */
          const [activeSavedScriptId, setActiveSavedScriptId] = useState(null);
          const [customVocabLessons, setCustomVocabLessons] = useState([]);
          const [lexikonSearch, setLexikonSearch] = useState('');
          /** tr-es-de | tr-de-es | wiki-de | wiki-es */
          const [lexikonDictKind, setLexikonDictKind] = useState('tr-es-de');
          const [lexikonTransTarget, setLexikonTransTarget] = useState('de');
          const [lexikonResults, setLexikonResults] = useState(null);
          const [lexikonDictLoading, setLexikonDictLoading] = useState(false);
          const [lexikonTransText, setLexikonTransText] = useState('');
          const [lexikonTransOut, setLexikonTransOut] = useState('');
          const [lexikonTransLoading, setLexikonTransLoading] = useState(false);
          const [lexikonSaveLessonId, setLexikonSaveLessonId] = useState('');
          const [lexikonNewLessonTitle, setLexikonNewLessonTitle] = useState('');
          const [lexikonPairDe, setLexikonPairDe] = useState('');
          const [lexikonPairEs, setLexikonPairEs] = useState('');
          const [vocabTitleInput, setVocabTitleInput] = useState("");
          const [vocabTextInput, setVocabTextInput] = useState("");
          const [userStats, setUserStats] = useState({
              username: "Estudiante", isPremium: true,
              xp: 0, streakDays: 1, lastPlayedDate: new Date().toISOString().split('T')[0],
              coins: 150, hearts: 5, 
              diktatAttempts: 0, diktatCorrect: 0,
              pronunciationTotalScore: 0, pronunciationAttempts: 0,
              difficultVocab: [], normalVocab: [], 
              difficultGrammar: [], 
              failedDiktatScenes: [],
              activityLog: [40, 60, 45, 80, 55, 90, 75],
              activityByDay: {}
          });
          const [vocabReviewIndex, setVocabReviewIndex] = useState(0);
          const [showVocabTranslation, setShowVocabTranslation] = useState(false);
          const [currentVocabList, setCurrentVocabList] = useState([]); 
          const [bxCategory, setBxCategory] = useState('mix'); 
          const [bxBankLevel, setBxBankLevel] = useState('b1');
          const [bxIndex, setBxIndex] = useState(0);
          const [bxCurrentList, setBxCurrentList] = useState([]);
          const [bxRemoteDatabases, setBxRemoteDatabases] = useState(() => tryBxSession());
          const [bxUserOverlay, setBxUserOverlay] = useState(() => tryBxUserOverlay());
          const [bxImportText, setBxImportText] = useState('');
          const [bxImportSummary, setBxImportSummary] = useState('');
          const [bxMoveTargetCat, setBxMoveTargetCat] = useState('verbos');
          const [chromeAiText, setChromeAiText] = useState('');
          const [chromeAiOut, setChromeAiOut] = useState('');
          const [chromeAiBusy, setChromeAiBusy] = useState(false);
          const [chromeAiLine, setChromeAiLine] = useState('');
          const bxEffectiveDatabases = useMemo(() => mergeBxDatabases(bxRemoteDatabases || BX_DB_FALLBACK, bxUserOverlay), [bxRemoteDatabases, bxUserOverlay]);
          const [practiceActive, setPracticeActive] = useState(null);
          const [practiceIndex, setPracticeIndex] = useState(0);
          const [practiceShowTrans, setPracticeShowTrans] = useState(false);
          const [aiLevel, setAiLevel] = useState('B1');
          const [aiTheme, setAiTheme] = useState('Alltag');
          const [aiCustomWords, setAiCustomWords] = useState("");
          const [isGeneratingStory, setIsGeneratingStory] = useState(false);
          const [isReviewing, setIsReviewing] = useState(false);
          const [reviewIndexPointer, setReviewIndexPointer] = useState(0);
          const [puzzleMode, setPuzzleMode] = useState(false);
          const [puzzleWords, setPuzzleWords] = useState([]);
          const [puzzleAnswer, setPuzzleAnswer] = useState([]);
          const [showPuzzleResult, setShowPuzzleResult] = useState(false);
          const [puzzleLastOk, setPuzzleLastOk] = useState(null);
          const [isListening, setIsListening] = useState(false);
          const [spokenText, setSpokenText] = useState("");
          const [pronunciationScore, setPronunciationScore] = useState(null);
          const [grammarPolizeiMsg, setGrammarPolizeiMsg] = useState("");
          const [pronunciationFeedback, setPronunciationFeedback] = useState([]);
          const [newScriptTitle, setNewScriptTitle] = useState("");
          const [scriptInput, setScriptInput] = useState(`Lukas: Hallo Elena! (¡Hola Elena!) [der Tag - el día]\nElena: Ja, ich bin froh! (¡Sí, estoy contenta!) [froh - contento]`);
          const [showLoginModal, setShowLoginModal] = useState(false);
          const [tempUsername, setTempUsername] = useState("");
          const [showTutor, setShowTutor] = useState(false);
          const [tutorMessage, setTutorMessage] = useState("");
          const [showDeathModal, setShowDeathModal] = useState(false);
          const [showGrammarPrompt, setShowGrammarPrompt] = useState(false);
          const [customGrammarInput, setCustomGrammarInput] = useState("");
          const [showHandwriting, setShowHandwriting] = useState(false); // NUEVO: Canvas escritura
          const [showVocabMixModal, setShowVocabMixModal] = useState(false);
          const [mixLessonSelection, setMixLessonSelection] = useState({});
          const [mullerProgresoSnapshot, setMullerProgresoSnapshot] = useState(null);
          const [audiobookPlaying, setAudiobookPlaying] = useState(false);
          const [shadowRate, setShadowRate] = useState(0.88);
          const [shadowShowText, setShadowShowText] = useState(true);
          const [writingMode, setWritingMode] = useState('free');
          const [writingGrid, setWritingGrid] = useState(true);
          const [writingStroke, setWritingStroke] = useState(4);
          const [writingCopyIdx, setWritingCopyIdx] = useState(0);
          const [writingPromptIdx, setWritingPromptIdx] = useState(0);
          const [writingTelcIdx, setWritingTelcIdx] = useState(0);
          const [writingTelcInputMode, setWritingTelcInputMode] = useState('pen');
          const [writingTelcTypedText, setWritingTelcTypedText] = useState('');
          const [writingTelcLastOcrText, setWritingTelcLastOcrText] = useState('');
          const [writingTelcCoach, setWritingTelcCoach] = useState(null);
          const [writingDictIdx, setWritingDictIdx] = useState(0);
          const [writingLetterIdx, setWritingLetterIdx] = useState(0);
          const [writingGuionWriteIdx, setWritingGuionWriteIdx] = useState(0);
          const [writingDictReveal, setWritingDictReveal] = useState(false);
          const [writingDictSource, setWritingDictSource] = useState('builtin');
          const [writingDictScriptId, setWritingDictScriptId] = useState('__current__');
          const [writingCanvasKey, setWritingCanvasKey] = useState(0);
          const [writingCanvasSnapshot, setWritingCanvasSnapshot] = useState({ padKey: 0, data: '' });
          const [writingVocabIdx, setWritingVocabIdx] = useState(0);
          const [ocrHistoryList, setOcrHistoryList] = useState(() => {
              try { return JSON.parse(localStorage.getItem(MULLER_OCR_HIST_KEY) || '[]'); } catch (e) { return []; }
          });
          const [pdfStudyDoc, setPdfStudyDoc] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_STUDY_STORAGE_KEY);
                  return raw ? JSON.parse(raw) : null;
              } catch (e) {
                  return null;
              }
          });
          const [pdfStudyPageIdx, setPdfStudyPageIdx] = useState(0);
          const [pdfStudyExtracting, setPdfStudyExtracting] = useState(false);
          const [pdfStudyErr, setPdfStudyErr] = useState('');
          const [pdfStudyBusyMsg, setPdfStudyBusyMsg] = useState('');
          const [pdfStudyOcrBusy, setPdfStudyOcrBusy] = useState(false);
          const [pdfStudyLastApplied, setPdfStudyLastApplied] = useState('');
          const [pdfStudyFullscreen, setPdfStudyFullscreen] = useState(false);
          const [pdfStudyInkNonce, setPdfStudyInkNonce] = useState(0);
          const [pdfStudyNotesByPage, setPdfStudyNotesByPage] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_NOTES_STORAGE_KEY);
                  return raw ? JSON.parse(raw) : {};
              } catch (e) {
                  return {};
              }
          });
          const [pdfStudySavedDocs, setPdfStudySavedDocs] = useState(() => {
              try {
                  const raw = localStorage.getItem(MULLER_PDF_STUDY_LIBRARY_KEY);
                  return raw ? JSON.parse(raw) : [];
              } catch (e) {
                  return [];
              }
          });
          const [pdfStudyBlobUrl, setPdfStudyBlobUrl] = useState('');
          const [ttsPrefsEpoch, setTtsPrefsEpoch] = useState(0);
          const [ttsDeUri, setTtsDeUri] = useState(() => { try { return localStorage.getItem('muller_tts_de') || ''; } catch (e) { return ''; } });
          const [ttsEsUri, setTtsEsUri] = useState(() => { try { return localStorage.getItem('muller_tts_es') || ''; } catch (e) { return ''; } });
          const [showMullerHub, setShowMullerHub] = useState(false);
          const [mullerHubTab, setMullerHubTab] = useState('voices');

          useEffect(() => {
              const validTabs = new Set(['inicio', 'ruta', 'historia', 'lectura', 'shadowing', 'escritura', 'vocabulario', 'entrenamiento', 'bxbank', 'progreso', 'guiones', 'lexikon', 'telc', 'storybuilder', 'historiaspro', 'comunidad']);
              if (!validTabs.has(activeTab)) setActiveTab('inicio');
          }, [activeTab]);

          useEffect(() => {
              return () => {
                  if (!pdfStudyBlobUrl) return;
                  try { URL.revokeObjectURL(pdfStudyBlobUrl); } catch (e) {}
              };
          }, [pdfStudyBlobUrl]);

          useEffect(() => {
              const openSettings = (ev) => {
                  const tab = ev && ev.detail && ev.detail.tab ? String(ev.detail.tab) : 'ajustes';
                  setProfileSettingsTab(tab === 'perfil' || tab === 'atajos' ? tab : 'ajustes');
                  setShowProfileSettingsModal(true);
              };
              window.addEventListener('muller-open-profile-settings', openSettings);
              return () => window.removeEventListener('muller-open-profile-settings', openSettings);
          }, []);

          useEffect(() => {
              let cancelled = false;
              const GIST_VERB_DB = 'https://gist.githubusercontent.com/djplaza1/239d6ac0a999c5729b3cf133627771f7/raw/gistfile1.txt';
              const parseVerbDbPayload = (raw) => {
                  const txt = String(raw || '').trim();
                  if (!txt) return null;
                  const tryParse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };
                  let data = tryParse(txt);
                  if (!data && txt.startsWith('{') && txt.endsWith(']')) data = tryParse(txt + '\n}');
                  if (!data && txt.startsWith('"id"')) data = tryParse('[{' + txt + '}]');
                  if (!data) return null;
                  const verbs = Array.isArray(data) ? data : (Array.isArray(data.verbs) ? data.verbs : []);
                  if (!verbs.length) return null;
                  return { meta: data.meta || null, verbs };
              };
              const loadVerbDb = async () => {
                  const urls = [
                      `${GIST_VERB_DB}?nocache=${Date.now()}`,
                      './verbos-db.json'
                  ];
                  for (const u of urls) {
                      try {
                          const r = await fetch(u, { cache: 'no-cache' });
                          if (!r.ok) continue;
                          const raw = await r.text();
                          const parsed = parseVerbDbPayload(raw);
                          if (!parsed || !parsed.verbs.length) continue;
                          if (cancelled) return;
                          setRutaVerbDb(parsed);
                          return;
                      } catch (e) {}
                  }
              };
              loadVerbDb();
              return () => { cancelled = true; };
          }, []);
          useEffect(() => {
              let cancelled = false;
              const URL_ART = 'https://gist.githubusercontent.com/djplaza1/a53fde18c901a7f2d86977174b5b9a72/raw/articulos.json';
              fetch(`${URL_ART}?nocache=${Date.now()}`, { cache: 'no-cache' })
                  .then((r) => r.ok ? r.json() : null)
                  .then((data) => {
                      if (cancelled || !Array.isArray(data)) return;
                      setRutaArticleDb(data);
                  })
                  .catch(() => {});
              return () => { cancelled = true; };
          }, []);
          const rutaLevels = useMemo(() => {
              const base = Array.isArray(window.MULLER_RUTA_LEVELS) ? window.MULLER_RUTA_LEVELS : [];
              const curriculumByLevel = {
                  A0: [
                      { title: 'Alfabeto y sonidos base', topic: 'presentacion', grammarTip: 'Prioriza pronunciación de vocales largas/cortas y combinaciones ch, sch, ei, ie.', phrases: [{ de: 'Ich heiße Leo.', es: 'Me llamo Leo.' }, { de: 'Das ist Anna.', es: 'Esta es Anna.' }, { de: 'Wir lernen Deutsch.', es: 'Aprendemos alemán.' }], fill: { prompt: 'Completa: Ich ___ Leo.', answer: 'heiße', hint: 'Verbo «heißen», 1ª persona.' }, speak: { target: 'Ich heiße Leo.' } },
                      { title: 'Números y datos personales', topic: 'tramites', grammarTip: 'Practica deletrear nombre, edad, teléfono y país.', phrases: [{ de: 'Ich bin 24 Jahre alt.', es: 'Tengo 24 años.' }, { de: 'Meine Nummer ist null eins sieben.', es: 'Mi número es 017.' }, { de: 'Ich komme aus Spanien.', es: 'Vengo de España.' }], fill: { prompt: 'Completa: Ich bin 24 Jahre ___.', answer: 'alt', hint: 'Expresión fija para la edad.' }, speak: { target: 'Ich bin 24 Jahre alt.' } },
                      { title: 'Aula y objetos cotidianos', topic: 'clase', grammarTip: 'Memoriza sustantivo con artículo: der Stift, die Tasche, das Heft.', phrases: [{ de: 'Das ist ein Stift.', es: 'Eso es un bolígrafo.' }, { de: 'Die Tasche ist neu.', es: 'La mochila es nueva.' }, { de: 'Wo ist das Heft?', es: '¿Dónde está el cuaderno?' }], fill: { prompt: 'Completa: Das ist ___ Stift.', answer: 'ein', hint: 'Indefinido masculino.' }, speak: { target: 'Das ist ein Stift.' } },
                      { title: 'Familia inmediata', topic: 'familia', grammarTip: 'Usa posesivos básicos: mein/meine y dein/deine.', phrases: [{ de: 'Das ist meine Mutter.', es: 'Esta es mi madre.' }, { de: 'Mein Bruder ist hier.', es: 'Mi hermano está aquí.' }, { de: 'Hast du Geschwister?', es: '¿Tienes hermanos?' }], fill: { prompt: 'Completa: Das ist ___ Mutter.', answer: 'meine', hint: 'Sustantivo femenino.' }, speak: { target: 'Das ist meine Mutter.' } },
                      { title: 'Comidas y compras simples', topic: 'alimentos', grammarTip: 'Pide con «Ich möchte ...» + Akkusativ.', phrases: [{ de: 'Ich möchte Wasser.', es: 'Quiero agua.' }, { de: 'Wir kaufen Brot.', es: 'Compramos pan.' }, { de: 'Der Kaffee ist heiß.', es: 'El café está caliente.' }], fill: { prompt: 'Completa: Ich ___ Wasser.', answer: 'möchte', hint: 'Forma de cortesía común.' }, speak: { target: 'Ich möchte Wasser.' } },
                      { title: 'Rutina mínima diaria', topic: 'rutina', grammarTip: 'Separable verbs: «aufstehen» separa en presente.', phrases: [{ de: 'Ich stehe um sieben auf.', es: 'Me levanto a las siete.' }, { de: 'Ich arbeite am Montag.', es: 'Trabajo el lunes.' }, { de: 'Abends lerne ich.', es: 'Por la noche estudio.' }], fill: { prompt: 'Completa: Ich ___ um sieben auf.', answer: 'stehe', hint: 'Verbo separable «aufstehen».' }, speak: { target: 'Ich stehe um sieben auf.' } }
                  ],
                  A1: [
                      { title: 'Presentarse con detalle', topic: 'presentacion', grammarTip: 'Amplía presentación con profesión, ciudad y lenguas.', phrases: [{ de: 'Ich bin Ingenieurin und wohne in Madrid.', es: 'Soy ingeniera y vivo en Madrid.' }, { de: 'Ich spreche Spanisch und etwas Deutsch.', es: 'Hablo español y algo de alemán.' }, { de: 'Seit einem Jahr lerne ich Deutsch.', es: 'Desde hace un año estudio alemán.' }], fill: { prompt: 'Completa: Ich ___ in Madrid.', answer: 'wohne', hint: 'Verbo wohnen.' }, speak: { target: 'Ich spreche Spanisch und etwas Deutsch.' } },
                      { title: 'Casa y habitaciones', topic: 'vivienda', grammarTip: 'Preposiciones de lugar frecuentes: in, auf, unter.', phrases: [{ de: 'Die Küche ist klein.', es: 'La cocina es pequeña.' }, { de: 'Das Buch liegt auf dem Tisch.', es: 'El libro está sobre la mesa.' }, { de: 'Wir wohnen in einer Wohnung.', es: 'Vivimos en un piso.' }], fill: { prompt: 'Completa: Das Buch liegt ___ dem Tisch.', answer: 'auf', hint: 'Relación «encima de».' }, speak: { target: 'Das Buch liegt auf dem Tisch.' } },
                      { title: 'Trabajo y horarios', topic: 'trabajo', grammarTip: 'Preguntar y responder horarios con «von ... bis ...».', phrases: [{ de: 'Ich arbeite von neun bis fünf.', es: 'Trabajo de nueve a cinco.' }, { de: 'Wann beginnt dein Kurs?', es: '¿Cuándo empieza tu curso?' }, { de: 'Heute habe ich frei.', es: 'Hoy tengo libre.' }], fill: { prompt: 'Completa: Ich arbeite von neun ___ fünf.', answer: 'bis', hint: 'Expresión de intervalo.' }, speak: { target: 'Ich arbeite von neun bis fünf.' } },
                      { title: 'Restaurante y pedidos', topic: 'alimentos', grammarTip: 'Usa «ich hätte gern» para sonar natural y cortés.', phrases: [{ de: 'Ich hätte gern eine Suppe.', es: 'Quisiera una sopa.' }, { de: 'Wir zahlen zusammen.', es: 'Pagamos juntos.' }, { de: 'Die Rechnung, bitte.', es: 'La cuenta, por favor.' }], fill: { prompt: 'Completa: Ich hätte ___ eine Suppe.', answer: 'gern', hint: 'Partícula fija en la fórmula.' }, speak: { target: 'Die Rechnung, bitte.' } },
                      { title: 'Salud y farmacia', topic: 'salud', grammarTip: 'Estructura típica: «Ich habe + síntoma».', phrases: [{ de: 'Ich habe Kopfschmerzen.', es: 'Tengo dolor de cabeza.' }, { de: 'Ich brauche einen Termin.', es: 'Necesito una cita.' }, { de: 'Nehmen Sie diese Tabletten.', es: 'Tome estas pastillas.' }], fill: { prompt: 'Completa: Ich ___ Kopfschmerzen.', answer: 'habe', hint: 'Verbo haben.' }, speak: { target: 'Ich habe Kopfschmerzen.' } },
                      { title: 'Tiempo libre y planes', topic: 'tiempo_libre', grammarTip: 'Con «am Wochenende» y «mit Freunden» hablas de ocio.', phrases: [{ de: 'Am Wochenende spiele ich Fußball.', es: 'El fin de semana juego al fútbol.' }, { de: 'Heute Abend gehe ich ins Kino.', es: 'Esta tarde voy al cine.' }, { de: 'Morgen treffe ich Freunde.', es: 'Mañana quedo con amigos.' }], fill: { prompt: 'Completa: Heute Abend ___ ich ins Kino.', answer: 'gehe', hint: 'Verbo gehen, 1ª persona.' }, speak: { target: 'Heute Abend gehe ich ins Kino.' } }
                  ],
                  A2: [
                      { title: 'Narrar pasado con Perfekt', topic: 'gramatica', grammarTip: 'Combina auxiliares haben/sein y participio al final.', phrases: [{ de: 'Letztes Jahr habe ich in Berlin gearbeitet.', es: 'El año pasado trabajé en Berlín.' }, { de: 'Wir sind spät angekommen.', es: 'Llegamos tarde.' }, { de: 'Sie hat viel gelernt.', es: 'Ella ha estudiado mucho.' }], fill: { prompt: 'Completa: Wir sind spät ___.', answer: 'angekommen', hint: 'Participio de ankommen.' }, speak: { target: 'Wir sind spät angekommen.' } },
                      { title: 'Conectores de causa y contraste', topic: 'conectores', grammarTip: 'weil + verbo final; aber/deshalb en frase principal.', phrases: [{ de: 'Ich bleibe zu Hause, weil ich krank bin.', es: 'Me quedo en casa porque estoy enfermo.' }, { de: 'Es regnet, aber wir gehen raus.', es: 'Llueve, pero salimos.' }, { de: 'Ich bin müde, deshalb schlafe ich früh.', es: 'Estoy cansado, por eso duermo pronto.' }], fill: { prompt: 'Completa: Ich bleibe zu Hause, ___ ich krank bin.', answer: 'weil', hint: 'Conector causal con verbo al final.' }, speak: { target: 'Ich bin müde, deshalb schlafe ich früh.' } },
                      { title: 'Viajes y transporte', topic: 'viajes', grammarTip: 'Bloques útiles: Fahrkarte, umsteigen, Abfahrt, Ankunft.', phrases: [{ de: 'Wo kann ich eine Fahrkarte kaufen?', es: '¿Dónde puedo comprar un billete?' }, { de: 'Der Zug hat Verspätung.', es: 'El tren tiene retraso.' }, { de: 'Wir müssen in Köln umsteigen.', es: 'Tenemos que hacer transbordo en Colonia.' }], fill: { prompt: 'Completa: Der Zug hat ___.', answer: 'Verspätung', hint: 'Retraso.' }, speak: { target: 'Wir müssen in Köln umsteigen.' } },
                      { title: 'Trámites y oficina', topic: 'tramites', grammarTip: 'Practica frases formales cortas en ventanilla.', phrases: [{ de: 'Ich möchte dieses Formular abgeben.', es: 'Quiero entregar este formulario.' }, { de: 'Welche Unterlagen brauche ich?', es: '¿Qué documentos necesito?' }, { de: 'Können Sie mir helfen?', es: '¿Puede ayudarme?' }], fill: { prompt: 'Completa: Welche ___ brauche ich?', answer: 'Unterlagen', hint: 'Documentos.' }, speak: { target: 'Ich möchte dieses Formular abgeben.' } },
                      { title: 'Relaciones personales', topic: 'familia', grammarTip: 'Opinión básica: «Ich finde..., weil...»', phrases: [{ de: 'Ich finde meinen Job interessant.', es: 'Encuentro mi trabajo interesante.' }, { de: 'Mit meiner Schwester spreche ich oft.', es: 'Hablo mucho con mi hermana.' }, { de: 'Wir verstehen uns gut.', es: 'Nos llevamos bien.' }], fill: { prompt: 'Completa: Wir ___ uns gut.', answer: 'verstehen', hint: 'Verbo separable no, forma plural.' }, speak: { target: 'Wir verstehen uns gut.' } },
                      { title: 'A2 oral práctico', topic: 'trabajo', grammarTip: 'Entrena respuestas completas de 2-3 frases.', phrases: [{ de: 'In meiner Firma arbeite ich im Team.', es: 'En mi empresa trabajo en equipo.' }, { de: 'Meine Aufgaben sind klar.', es: 'Mis tareas están claras.' }, { de: 'Ich möchte mich verbessern.', es: 'Quiero mejorar.' }], fill: { prompt: 'Completa: Ich arbeite ___ Team.', answer: 'im', hint: 'in + dem = im.' }, speak: { target: 'In meiner Firma arbeite ich im Team.' } }
                  ],
                  B1: [
                      { title: 'Opinión y argumentación', topic: 'conectores', grammarTip: 'Conecta ideas con außerdem, jedoch, deshalb.', phrases: [{ de: 'Meiner Meinung nach ist Homeoffice sinnvoll.', es: 'En mi opinión, el teletrabajo tiene sentido.' }, { de: 'Einerseits spart man Zeit, andererseits fehlt Kontakt.', es: 'Por un lado ahorras tiempo, por otro falta contacto.' }, { de: 'Deshalb brauche ich einen Mix.', es: 'Por eso necesito un equilibrio.' }], fill: { prompt: 'Completa: Einerseits ..., ___ ...', answer: 'andererseits', hint: 'Conector correlativo.' }, speak: { target: 'Meiner Meinung nach ist Homeoffice sinnvoll.' } },
                      { title: 'B1 trabajo y CV', topic: 'trabajo', grammarTip: 'Pasado relevante y logros concretos en frases breves.', phrases: [{ de: 'Ich habe drei Jahre im Kundenservice gearbeitet.', es: 'Trabajé tres años en atención al cliente.' }, { de: 'Ich bin zuverlässig und flexibel.', es: 'Soy fiable y flexible.' }, { de: 'Ich möchte mich beruflich weiterentwickeln.', es: 'Quiero desarrollarme profesionalmente.' }], fill: { prompt: 'Completa: Ich habe drei Jahre im Kundenservice ___.', answer: 'gearbeitet', hint: 'Participio regular.' }, speak: { target: 'Ich möchte mich beruflich weiterentwickeln.' } },
                      { title: 'Relativsätze útiles', topic: 'gramatica', grammarTip: 'der/die/das + verbo al final para añadir información.', phrases: [{ de: 'Das ist der Kollege, der mir hilft.', es: 'Ese es el compañero que me ayuda.' }, { de: 'Die Stadt, in der ich wohne, ist ruhig.', es: 'La ciudad donde vivo es tranquila.' }, { de: 'Ich suche ein Buch, das leicht ist.', es: 'Busco un libro que sea fácil.' }], fill: { prompt: 'Completa: Das ist der Kollege, ___ mir hilft.', answer: 'der', hint: 'Relativo masculino nominativo.' }, speak: { target: 'Die Stadt, in der ich wohne, ist ruhig.' } },
                      { title: 'B1 viajes e incidencias', topic: 'viajes', grammarTip: 'Describe problemas, pide solución y confirma pasos.', phrases: [{ de: 'Mein Flug wurde annulliert.', es: 'Mi vuelo fue cancelado.' }, { de: 'Können Sie mir eine Alternative anbieten?', es: '¿Puede ofrecerme una alternativa?' }, { de: 'Ich brauche eine Bestätigung per E-Mail.', es: 'Necesito una confirmación por correo.' }], fill: { prompt: 'Completa: Mein Flug wurde ___.', answer: 'annulliert', hint: 'Participio de annullieren.' }, speak: { target: 'Können Sie mir eine Alternative anbieten?' } },
                      { title: 'Konjunktiv II cotidiano', topic: 'gramatica', grammarTip: 'Usa würde + infinitivo para hipótesis y deseos.', phrases: [{ de: 'Ich würde gern in Deutschland arbeiten.', es: 'Me gustaría trabajar en Alemania.' }, { de: 'Wenn ich Zeit hätte, würde ich mehr lesen.', es: 'Si tuviera tiempo, leería más.' }, { de: 'Könnten Sie das bitte wiederholen?', es: '¿Podría repetirlo, por favor?' }], fill: { prompt: 'Completa: Wenn ich Zeit hätte, ___ ich mehr lesen.', answer: 'würde', hint: 'Estructura condicional.' }, speak: { target: 'Wenn ich Zeit hätte, würde ich mehr lesen.' } }
                  ],
                  B2: [
                      { title: 'Debate estructurado B2', topic: 'conectores', grammarTip: 'Estructura: tesis, argumentos, contraargumento, cierre.', phrases: [{ de: 'Ich vertrete die Auffassung, dass ...', es: 'Defiendo la postura de que...' }, { de: 'Zudem sprechen mehrere Gründe dafür.', es: 'Además hay varias razones a favor.' }, { de: 'Dennoch müssen Risiken berücksichtigt werden.', es: 'No obstante, deben considerarse riesgos.' }], fill: { prompt: 'Completa: ___ müssen Risiken berücksichtigt werden.', answer: 'Dennoch', hint: 'Conector concesivo.' }, speak: { target: 'Ich vertrete die Auffassung, dass digitale Bildung wichtig ist.' } },
                      { title: 'Correo formal y registro', topic: 'tramites', grammarTip: 'Registro formal: Sehr geehrte..., ich möchte..., mit freundlichen Grüßen.', phrases: [{ de: 'Ich möchte mich über den Kurs informieren.', es: 'Quiero informarme sobre el curso.' }, { de: 'Für eine Rückmeldung wäre ich dankbar.', es: 'Agradecería una respuesta.' }, { de: 'Mit freundlichen Grüßen', es: 'Atentamente' }], fill: { prompt: 'Completa: Für eine Rückmeldung wäre ich ___.', answer: 'dankbar', hint: 'Adjetivo típico en carta formal.' }, speak: { target: 'Ich möchte mich über den Kurs informieren.' } },
                      { title: 'Nominalización B2', topic: 'gramatica', grammarTip: 'Convierte verbos en sustantivos para estilo académico.', phrases: [{ de: 'Die Entscheidung wurde gestern getroffen.', es: 'La decisión se tomó ayer.' }, { de: 'Die Verbesserung der Prozesse ist notwendig.', es: 'La mejora de procesos es necesaria.' }, { de: 'Nach der Analyse folgte die Umsetzung.', es: 'Tras el análisis siguió la implementación.' }], fill: { prompt: 'Completa: Die ___ der Prozesse ist notwendig.', answer: 'Verbesserung', hint: 'Sustantivo de verbessern.' }, speak: { target: 'Die Entscheidung wurde gestern getroffen.' } },
                      { title: 'Comprensión de noticias', topic: 'trabajo', grammarTip: 'Extrae idea principal, datos y postura del autor.', phrases: [{ de: 'Laut dem Bericht steigt die Inflation.', es: 'Según el informe, sube la inflación.' }, { de: 'Die Experten fordern schnelle Maßnahmen.', es: 'Los expertos piden medidas rápidas.' }, { de: 'Die Folgen betreffen vor allem Haushalte.', es: 'Las consecuencias afectan sobre todo a los hogares.' }], fill: { prompt: 'Completa: Laut dem Bericht ___ die Inflation.', answer: 'steigt', hint: 'Verbo de la oración principal.' }, speak: { target: 'Die Experten fordern schnelle Maßnahmen.' } }
                  ],
                  C1: [
                      { title: 'Matiz y precisión léxica', topic: 'gramatica', grammarTip: 'Selecciona verbo por intención: behaupten, erläutern, einräumen.', phrases: [{ de: 'Die Autorin räumt ein, dass die Daten begrenzt sind.', es: 'La autora reconoce que los datos son limitados.' }, { de: 'Der Bericht legt nahe, dass Reformen nötig sind.', es: 'El informe sugiere que las reformas son necesarias.' }, { de: 'Er erläutert die Ursachen differenziert.', es: 'Explica las causas de forma matizada.' }], fill: { prompt: 'Completa: Der Bericht ___ nahe, dass Reformen nötig sind.', answer: 'legt', hint: 'Expresión fija «nahelegen».' }, speak: { target: 'Die Autorin räumt ein, dass die Daten begrenzt sind.' } },
                      { title: 'Argumentación avanzada C1', topic: 'conectores', grammarTip: 'Conectores de alta precisión: demzufolge, insofern, wohingegen.', phrases: [{ de: 'Die Maßnahme ist teuer, demzufolge braucht sie klare Ziele.', es: 'La medida es costosa; por consiguiente, necesita metas claras.' }, { de: 'Insofern ist die Kritik nachvollziehbar.', es: 'En ese sentido, la crítica es comprensible.' }, { de: 'Wohingegen kurzfristige Lösungen selten nachhaltig sind.', es: 'Mientras que las soluciones a corto plazo rara vez son sostenibles.' }], fill: { prompt: 'Completa: Die Maßnahme ist teuer, ___ braucht sie klare Ziele.', answer: 'demzufolge', hint: 'Conector de consecuencia formal.' }, speak: { target: 'Insofern ist die Kritik nachvollziehbar.' } },
                      { title: 'Presentación profesional', topic: 'trabajo', grammarTip: 'Abrir, estructurar y cerrar exposición con naturalidad.', phrases: [{ de: 'Im Folgenden präsentiere ich drei zentrale Punkte.', es: 'A continuación presento tres puntos centrales.' }, { de: 'Abschließend lässt sich festhalten, dass ...', es: 'Para concluir, puede sostenerse que...' }, { de: 'Gern beantworte ich anschließend Ihre Fragen.', es: 'Con gusto respondo después sus preguntas.' }], fill: { prompt: 'Completa: ___ präsentiere ich drei zentrale Punkte.', answer: 'Im Folgenden', hint: 'Inicio formal de exposición.' }, speak: { target: 'Abschließend lässt sich festhalten, dass nachhaltige Strategien nötig sind.' } }
                  ]
              };
              const premiumTopicPlan = {
                  A0: ['presentacion', 'pronunciacion', 'numeros', 'clase', 'familia', 'alimentos', 'rutina', 'vivienda', 'viajes', 'salud', 'trabajo', 'tramites'],
                  A1: ['presentacion', 'familia', 'vivienda', 'alimentos', 'compras', 'trabajo', 'rutina', 'tiempo_libre', 'viajes', 'salud', 'tramites', 'conectores'],
                  A2: ['pasado', 'conectores', 'trabajo', 'familia', 'vivienda', 'viajes', 'salud', 'tramites', 'compras', 'tiempo_libre', 'telefonia', 'gramatica'],
                  B1: ['argumentacion', 'trabajo', 'cv', 'entrevista', 'viajes', 'incidencias', 'relativsatz', 'konjunktiv2', 'conectores', 'salud', 'tramites', 'presentacion'],
                  B2: ['debate', 'correo_formal', 'nominalizacion', 'noticias', 'trabajo', 'universidad', 'presentacion', 'conectores', 'pasiva', 'grafico', 'negociacion', 'medios'],
                  C1: ['precision', 'argumentacion', 'registro', 'academico', 'presentacion', 'negociacion', 'conectores', 'resumen', 'analisis', 'matiz', 'retorica', 'debate']
              };
              const topicLabel = {
                  presentacion: 'Presentación', pronunciacion: 'Pronunciación', numeros: 'Números', clase: 'Clase', familia: 'Familia', alimentos: 'Alimentos',
                  rutina: 'Rutina', vivienda: 'Vivienda', viajes: 'Viajes', salud: 'Salud', trabajo: 'Trabajo', tramites: 'Trámites', compras: 'Compras',
                  tiempo_libre: 'Tiempo libre', conectores: 'Conectores', pasado: 'Pasado', telefonia: 'Teléfono', gramatica: 'Gramática',
                  argumentacion: 'Argumentación', cv: 'CV', entrevista: 'Entrevista', incidencias: 'Incidencias', relativsatz: 'Relativos', konjunktiv2: 'Konjunktiv II',
                  debate: 'Debate', correo_formal: 'Correo formal', nominalizacion: 'Nominalización', noticias: 'Noticias', universidad: 'Universidad', pasiva: 'Pasiva',
                  grafico: 'Describir gráficos', negociacion: 'Negociación', medios: 'Medios', precision: 'Precisión léxica', registro: 'Registro', academico: 'Académico',
                  resumen: 'Resumen', analisis: 'Análisis', matiz: 'Matiz', retorica: 'Retórica'
              };
              const mkPremiumUnit = (levelKey, topic, idx) => {
                  const label = topicLabel[topic] || topic;
                  const topicForUi = ({ pronunciacion: 'presentacion', numeros: 'tramites', pasado: 'gramatica', telefonia: 'tramites', argumentacion: 'conectores', cv: 'trabajo', entrevista: 'trabajo', incidencias: 'viajes', relativsatz: 'gramatica', konjunktiv2: 'gramatica', debate: 'conectores', correo_formal: 'tramites', nominalizacion: 'gramatica', noticias: 'trabajo', universidad: 'trabajo', pasiva: 'gramatica', grafico: 'trabajo', negociacion: 'trabajo', medios: 'trabajo', precision: 'gramatica', registro: 'gramatica', academico: 'gramatica', resumen: 'gramatica', analisis: 'gramatica', matiz: 'gramatica', retorica: 'conectores' }[topic]) || topic;
                  const sentenceBank = {
                      A0: [{ de: 'Ich bin neu hier.', es: 'Soy nuevo aqui.' }, { de: 'Das ist meine Familie.', es: 'Esta es mi familia.' }, { de: 'Ich lerne jeden Tag.', es: 'Aprendo cada dia.' }],
                      A1: [{ de: 'Ich möchte im Restaurant bestellen.', es: 'Quiero pedir en el restaurante.' }, { de: 'Am Wochenende treffe ich Freunde.', es: 'El fin de semana quedo con amigos.' }, { de: 'Wir fahren morgen mit dem Zug.', es: 'Viajamos manana en tren.' }],
                      A2: [{ de: 'Letzte Woche habe ich viel gearbeitet.', es: 'La semana pasada trabaje mucho.' }, { de: 'Ich lerne Deutsch, weil ich umziehen möchte.', es: 'Aprendo aleman porque quiero mudarme.' }, { de: 'Können Sie mir bitte weiterhelfen?', es: 'Puede ayudarme, por favor?' }],
                      B1: [{ de: 'Meiner Meinung nach ist das sinnvoll.', es: 'En mi opinion eso tiene sentido.' }, { de: 'Wenn ich mehr Zeit hätte, würde ich reisen.', es: 'Si tuviera mas tiempo, viajaria.' }, { de: 'Das ist ein Punkt, den wir beachten müssen.', es: 'Es un punto que debemos considerar.' }],
                      B2: [{ de: 'Die Maßnahme sollte schrittweise umgesetzt werden.', es: 'La medida deberia aplicarse gradualmente.' }, { de: 'Darüber hinaus sind die Kosten zu berücksichtigen.', es: 'Ademas hay que considerar los costes.' }, { de: 'Ich beziehe mich auf die vorliegenden Daten.', es: 'Me refiero a los datos disponibles.' }],
                      C1: [{ de: 'Insofern erscheint die Kritik nachvollziehbar.', es: 'En ese sentido, la critica resulta comprensible.' }, { de: 'Der Autor differenziert zwischen Ursache und Wirkung.', es: 'El autor diferencia entre causa y efecto.' }, { de: 'Nichtsdestotrotz bleibt die Kernfrage offen.', es: 'No obstante, la cuestion central sigue abierta.' }]
                  };
                  const sample = sentenceBank[levelKey] || sentenceBank.A1;
                  const answerMap = { A0: 'bin', A1: 'möchte', A2: 'habe', B1: 'würde', B2: 'werden', C1: 'bleibt' };
                  return {
                      title: `${label} · práctica ${idx + 1}`,
                      topic: topicForUi,
                      grammarTip: `Nivel ${levelKey}: bloque de ${label.toLowerCase()} con enfoque comunicativo y corrección gramatical.`,
                      phrases: [sample[idx % sample.length], sample[(idx + 1) % sample.length], sample[(idx + 2) % sample.length]],
                      fill: { prompt: `Completa (${levelKey}): Ich ___ weiter Deutsch.`, answer: answerMap[levelKey] || 'lerne', hint: `Forma habitual de ${levelKey}.` },
                      speak: { target: sample[idx % sample.length].de }
                  };
              };
              Object.keys(premiumTopicPlan).forEach((levelKey) => {
                  const generated = (premiumTopicPlan[levelKey] || []).map((topic, idx) => mkPremiumUnit(levelKey, topic, idx));
                  const curr = Array.isArray(curriculumByLevel[levelKey]) ? curriculumByLevel[levelKey] : [];
                  curriculumByLevel[levelKey] = [...curr, ...generated];
              });
              const byLevel = { A0: [], A1: [], A2: [], B1: [], B2: [], C1: [] };
              (rutaVerbDb.verbs || []).forEach((v) => {
                  const lv = String(v && v.level ? v.level : '').toUpperCase();
                  if (byLevel[lv]) byLevel[lv].push(v);
              });
              const normalizeRutaLevelKey = (value) => {
                  const s = String(value || '').toUpperCase();
                  if (s.startsWith('A0')) return 'A0';
                  if (s.startsWith('A1')) return 'A1';
                  if (s.startsWith('A2')) return 'A2';
                  if (s.startsWith('B1')) return 'B1';
                  if (s.startsWith('B2')) return 'B2';
                  if (s.startsWith('C1')) return 'C1';
                  return s;
              };
              const mkCurriculumLesson = (levelKey, unit, idx) => ({
                  id: `curr-${levelKey.toLowerCase()}-${idx + 1}`,
                  title: `${levelKey} · ${unit.title}`,
                  topic: unit.topic || 'general',
                  rewardCoins: 14 + Math.min(20, idx * 2),
                  rewardXp: 20 + Math.min(26, idx * 2),
                  grammarTip: unit.grammarTip || `Práctica guiada ${levelKey}.`,
                  phrases: Array.isArray(unit.phrases) && unit.phrases.length ? unit.phrases.slice(0, 3) : [{ de: 'Ich lerne Deutsch.', es: 'Aprendo alemán.' }],
                  fill: unit.fill || { prompt: 'Completa: Ich ___ Deutsch.', answer: 'lerne', hint: 'Verbo en presente.' },
                  speak: unit.speak || { target: (unit.phrases && unit.phrases[0] && unit.phrases[0].de) || 'Ich lerne Deutsch.' }
              });
              const mkLesson = (levelKey, chunk, idx) => {
                  const topicCycle = ['familia', 'trabajo', 'alimentos', 'viajes', 'vivienda', 'salud', 'tiempo_libre', 'tramites'];
                  const topic = topicCycle[idx % topicCycle.length];
                  const title = `${levelKey} · Verbos ${idx + 1}`;
                  const phrases = chunk.slice(0, 3).map((v) => ({
                      de: (v && v.examples && v.examples[0] && v.examples[0].de) || `Ich ${v.lemma}.`,
                      es: (v && v.examples && v.examples[0] && v.examples[0].es) || (v.es || '—')
                  }));
                  const p = chunk[0] || {};
                  return {
                      id: `auto-${levelKey.toLowerCase()}-${idx + 1}`,
                      title,
                      topic,
                      rewardCoins: 16 + Math.min(16, idx),
                      rewardXp: 22 + Math.min(20, idx * 2),
                      grammarTip: `Nivel ${levelKey}: práctica de verbos frecuentes y sus formas.`,
                      phrases,
                      fill: {
                          prompt: `Completa: Ich ___ (${p.lemma || 'lernen'}).`,
                          answer: (p.forms && p.forms.praesens && p.forms.praesens.ich) || p.lemma || 'lerne',
                          hint: `Forma de 1ª persona (Präsens) de «${p.lemma || 'lernen'}».`
                      },
                      speak: { target: (phrases[0] && phrases[0].de) || 'Ich lerne Deutsch.' }
                  };
              };
              const mkLevel = (levelKey, title, badge, sourceVerbs) => {
                  const chunks = [];
                  const size = 8;
                  for (let i = 0; i < sourceVerbs.length; i += size) chunks.push(sourceVerbs.slice(i, i + size));
                  const lessons = chunks.map((c, i) => mkLesson(levelKey, c, i));
                  return { id: `auto-${levelKey.toLowerCase()}`, title, badge, lessons };
              };
              const getArticleByLevel = (levelKey) => (rutaArticleDb || []).filter((a) => {
                  const one = String(a && a.level ? a.level : '').toUpperCase();
                  const many = Array.isArray(a && a.levels) ? a.levels.map((x) => String(x).toUpperCase()) : [];
                  return one === levelKey || many.includes(levelKey);
              });
              const connectorByLevel = {
                  A1: ['und', 'aber', 'oder', 'denn'],
                  A2: ['weil', 'dass', 'wenn', 'deshalb', 'deswegen'],
                  B1: ['obwohl', 'damit', 'trotzdem', 'außerdem', 'danach'],
                  B2: ['während', 'sobald', 'falls', 'insofern', 'hingegen'],
                  C1: ['demzufolge', 'folglich', 'somit', 'nichtsdestotrotz', 'infolgedessen']
              };
              const mkArticleLesson = (levelKey, items, idx) => {
                  const topicCycle = ['familia', 'trabajo', 'alimentos', 'vivienda', 'viajes', 'salud'];
                  const topic = topicCycle[idx % topicCycle.length];
                  const sample = items[0] || {};
                  const de = String(sample.de || 'das Buch');
                  const article = de.split(/\s+/)[0] || 'das';
                  return {
                      id: `auto-art-${levelKey.toLowerCase()}-${idx + 1}`,
                      title: `${levelKey} · Artículos ${idx + 1}`,
                      topic,
                      rewardCoins: 15 + idx,
                      rewardXp: 20 + idx * 2,
                      grammarTip: `Nivel ${levelKey}: artículo + sustantivo y concordancia en frase.`,
                      phrases: items.slice(0, 3).map((x) => ({ de: `${x.de} ist wichtig.`, es: `${x.es || x.de} es importante.` })),
                      fill: { prompt: `Completa: ___ ${de.split(/\s+/).slice(1).join(' ')} ist hier.`, answer: article, hint: 'Piensa en el género del sustantivo.' },
                      speak: { target: `${de} ist wichtig.` }
                  };
              };
              const mkConnectorLesson = (levelKey, idx) => {
                  const c = connectorByLevel[levelKey] || [];
                  const con = c[idx % c.length] || 'weil';
                  return {
                      id: `auto-conn-${levelKey.toLowerCase()}-${idx + 1}`,
                      title: `${levelKey} · Conectores ${idx + 1}`,
                      topic: 'conectores',
                      rewardCoins: 18 + idx,
                      rewardXp: 24 + idx * 2,
                      grammarTip: `Conector ${con}: practica posición verbal según tipo de oración.`,
                      phrases: [
                          { de: `Ich lerne Deutsch, ${con} ich in Deutschland arbeiten möchte.`, es: `Aprendo alemán, ${con === 'weil' ? 'porque' : 'usando conector'} quiero trabajar en Alemania.` },
                          { de: `${con.charAt(0).toUpperCase() + con.slice(1)} es regnet, bleibe ich zu Hause.`, es: 'Si/como llueve, me quedo en casa.' }
                      ],
                      fill: { prompt: `Completa con conector (${levelKey}): Ich lerne Deutsch, ___ ich reisen will.`, answer: con, hint: 'Usa el conector trabajado en esta lección.' },
                      speak: { target: `Ich lerne Deutsch, ${con} ich reisen will.` }
                  };
              };
              const dynamic = [];
              const baseEnriched = (base || []).map((lv) => {
                  const key = normalizeRutaLevelKey((lv && lv.badge) || (lv && lv.title) || '');
                  const extra = (curriculumByLevel[key] || []).map((unit, idx) => mkCurriculumLesson(key, unit, idx));
                  const existingIds = new Set((lv.lessons || []).map((x) => x.id));
                  const mergedLessons = [...(lv.lessons || []), ...extra.filter((x) => !existingIds.has(x.id))];
                  return { ...lv, lessons: mergedLessons };
              });
              const mkMergedLevel = (levelKey, title, badge, sourceVerbs) => {
                  const lv = mkLevel(levelKey, title, badge, sourceVerbs);
                  const curriculumExtra = (curriculumByLevel[levelKey] || []).map((unit, idx) => mkCurriculumLesson(levelKey, unit, idx));
                  lv.lessons.push(...curriculumExtra);
                  const arts = getArticleByLevel(levelKey);
                  for (let i = 0; i < arts.length; i += 10) lv.lessons.push(mkArticleLesson(levelKey, arts.slice(i, i + 10), Math.floor(i / 10)));
                  const cc = connectorByLevel[levelKey] || [];
                  for (let i = 0; i < Math.max(1, Math.ceil(cc.length / 2)); i++) lv.lessons.push(mkConnectorLesson(levelKey, i));
                  return lv;
              };
              if (byLevel.A2.length || getArticleByLevel('A2').length) dynamic.push(mkMergedLevel('A2', 'Nivel A2 · Consolidación', 'A2', byLevel.A2));
              if (byLevel.B1.length || getArticleByLevel('B1').length) dynamic.push(mkMergedLevel('B1', 'Nivel B1 · Intermedio', 'B1', byLevel.B1));
              if (byLevel.B2.length || getArticleByLevel('B2').length) dynamic.push(mkMergedLevel('B2', 'Nivel B2 · Avanzado', 'B2', byLevel.B2));
              if (byLevel.C1.length || getArticleByLevel('C1').length) dynamic.push(mkMergedLevel('C1', 'Nivel C1 · Dominio', 'C1', byLevel.C1));
              const existingKeys = new Set([...baseEnriched, ...dynamic].map((lv) => normalizeRutaLevelKey((lv && lv.badge) || (lv && lv.title) || '')));
              const fallbackTitles = {
                  A0: { id: 'a0-ext', title: 'Nivel 0 · Fundamentos', badge: 'A0' },
                  A1: { id: 'a1-ext', title: 'Nivel A1 · Comunicación básica', badge: 'A1' },
                  A2: { id: 'a2-ext', title: 'Nivel A2 · Consolidación', badge: 'A2' },
                  B1: { id: 'b1-ext', title: 'Nivel B1 · Intermedio', badge: 'B1' },
                  B2: { id: 'b2-ext', title: 'Nivel B2 · Avanzado', badge: 'B2' },
                  C1: { id: 'c1-ext', title: 'Nivel C1 · Dominio', badge: 'C1' }
              };
              Object.keys(curriculumByLevel).forEach((k) => {
                  if (existingKeys.has(k)) return;
                  const meta = fallbackTitles[k];
                  const lessons = (curriculumByLevel[k] || []).map((unit, idx) => mkCurriculumLesson(k, unit, idx));
                  dynamic.push({ id: meta.id, title: meta.title, badge: meta.badge, lessons });
              });
              return [...baseEnriched, ...dynamic];
          }, [rutaVerbDb, rutaArticleDb]);
          useEffect(() => {
              const onToast = (ev) => {
                  const d = (ev && ev.detail) || {};
                  const msg = String(d.message || '').trim();
                  if (!msg) return;
                  const t = { id: Date.now() + Math.random(), message: msg, kind: String(d.kind || 'info') };
                  setToastItems((prev) => [...prev.slice(-3), t]);
                  setTimeout(() => setToastItems((prev) => prev.filter((x) => x.id !== t.id)), 2600);
              };
              window.addEventListener('muller-toast', onToast);
              return () => window.removeEventListener('muller-toast', onToast);
          }, []);
          useEffect(() => {
              try { localStorage.setItem('muller_show_floating_tools', showFloatingTools ? '1' : '0'); } catch (e) {}
              try { window.dispatchEvent(new CustomEvent('muller-floating-tools-updated', { detail: { enabled: !!showFloatingTools } })); } catch (e) {}
          }, [showFloatingTools]);
          useEffect(() => {
              try { localStorage.setItem('muller_reduce_motion', reduceMotionUi ? '1' : '0'); } catch (e) {}
              try {
                  if (reduceMotionUi) document.documentElement.classList.add('muller-reduce-motion');
                  else document.documentElement.classList.remove('muller-reduce-motion');
              } catch (e) {}
          }, [reduceMotionUi]);
          const [uiTheme, setUiTheme] = useState(() => { try { return localStorage.getItem(MULLER_THEME_KEY) || 'dark'; } catch (e) { return 'dark'; } });
          const [showOnboarding, setShowOnboarding] = useState(() => { try { return !localStorage.getItem(MULLER_ONBOARDING_KEY); } catch (e) { return true; } });
          const [onboardingStep, setOnboardingStep] = useState(1);
          const [onboardingNever, setOnboardingNever] = useState(false);
          const [historiaAudioOnly, setHistoriaAudioOnly] = useState(false);
          const [vocabDueFilterOnly, setVocabDueFilterOnly] = useState(false);
          const [showShortcutsModal, setShowShortcutsModal] = useState(false);
          const [userMenuOpen, setUserMenuOpen] = useState(false);
          const userMenuWrapRef = useRef(null);
          const [communitySubTab, setCommunitySubTab] = useState('economia');
          const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false);
          const [profileSettingsTab, setProfileSettingsTab] = useState('perfil');
          const [showFloatingTools, setShowFloatingTools] = useState(() => { try { return localStorage.getItem('muller_show_floating_tools') !== '0'; } catch (e) { return true; } });
          const [reduceMotionUi, setReduceMotionUi] = useState(() => { try { return localStorage.getItem('muller_reduce_motion') === '1'; } catch (e) { return false; } });
          const [authTick, setAuthTick] = useState(0);
          const [authEmail, setAuthEmail] = useState('');
          const [authPassword, setAuthPassword] = useState('');
          const [authDisplayName, setAuthDisplayName] = useState('');
          const [authBusy, setAuthBusy] = useState(false);
          const [authError, setAuthError] = useState('');
          const [authMode, setAuthMode] = useState('login');
          const [supabaseUser, setSupabaseUser] = useState(null);
          const [supabaseProfile, setSupabaseProfile] = useState(null);
          const cloudApplyingRef = useRef(false);
          const cloudLoadedRef = useRef(false);
          const cloudPushTimerRef = useRef(null);
          const [remoteLeagueRows, setRemoteLeagueRows] = useState(null);
          const [remoteProfiles, setRemoteProfiles] = useState(null);
          const [profileNameDraft, setProfileNameDraft] = useState('');
          const [profileNameBusy, setProfileNameBusy] = useState(false);
          const [profileNameMsg, setProfileNameMsg] = useState('');
          const [toastItems, setToastItems] = useState([]);
          const [walletCoins, setWalletCoins] = useState(null);
          const [walletLoading, setWalletLoading] = useState(false);
          const [walletIsCreator, setWalletIsCreator] = useState(false);
          const [economyMsg, setEconomyMsg] = useState('');
          const [adOpenedAt, setAdOpenedAt] = useState(0);
          const [rewardStatus, setRewardStatus] = useState(null);
          const [premiumStatus, setPremiumStatus] = useState(null);
          const [cloudSyncState, setCloudSyncState] = useState('local');
          const [cloudSyncLabel, setCloudSyncLabel] = useState('Local');
          const [cloudSyncAt, setCloudSyncAt] = useState(null);
          const [storiesProInputMode, setStoriesProInputMode] = useState('es');
          const [storiesProOcrLang, setStoriesProOcrLang] = useState('es');
          const [storiesProSourceText, setStoriesProSourceText] = useState('');
          const [storiesProLevel, setStoriesProLevel] = useState('B1');
          const [storiesProTone, setStoriesProTone] = useState('natural');
          const [storiesProBusy, setStoriesProBusy] = useState(false);
          const [storiesProErr, setStoriesProErr] = useState('');
          const [storiesProResult, setStoriesProResult] = useState(null);
          const unifiedAuth = useMemo(() => {
              void authTick;
              if (mullerSupabaseConfigured() && supabaseUser) {
                  const dn = supabaseProfile && supabaseProfile.display_name
                      ? supabaseProfile.display_name
                      : (supabaseUser.user_metadata && supabaseUser.user_metadata.display_name) || 'Estudiante';
                  return {
                      source: 'supabase',
                      email: supabaseUser.email,
                      displayName: dn,
                      userId: supabaseUser.id,
                  };
              }
              const loc = mullerAuthGetSession();
              if (loc) return { source: 'local', ...loc };
              return null;
          }, [authTick, supabaseUser, supabaseProfile]);
          const isCreatorAccount = useMemo(() => {
              if (walletIsCreator) return true;
              if (!unifiedAuth || !unifiedAuth.email) return false;
              const creatorEmail = String(window.MULLER_CREATOR_EMAIL || '').trim().toLowerCase();
              return !!(creatorEmail && String(unifiedAuth.email || '').toLowerCase() === creatorEmail);
          }, [walletIsCreator, unifiedAuth]);
          const coinsUiLabel = isCreatorAccount ? '∞' : userStats.coins;
          const economyReasonText = (reason) => {
              const r = String(reason || '');
              if (r === 'already_claimed_today') return 'Ya has reclamado el bonus diario hoy.';
              if (r === 'daily_limit_reached') return 'Límite diario de anuncios alcanzado (6/6).';
              if (r === 'cooldown_15m') return 'Debes esperar 15 minutos entre anuncios.';
              if (r === 'invalid_reward_type') return 'Tipo de recompensa inválido.';
              if (r === 'creator_unlimited') return 'Cuenta creador: saldo ilimitado.';
              if (r === 'ok') return 'Operación completada.';
              return r || 'No disponible.';
          };
          const leagueBoard = useMemo(() => {
              const week = mullerIsoWeekMonday();
              const bots = MULLER_BOT_PLAYERS.map((b) => ({
                  id: b.id,
                  name: b.name,
                  isBot: true,
                  isSelf: false,
                  score: mullerBotWeekScore(b.id, week),
                  sub: `${b.tag} · ${b.lvl}`,
                  rank: 0,
              }));
              const meScore = mullerLeagueComputeUserScore(userStats);
              const meName = userStats.username || 'Estudiante';
              const ua = unifiedAuth;
              let humans = [];
              if (remoteLeagueRows && Array.isArray(remoteLeagueRows) && remoteLeagueRows.length > 0) {
                  humans = remoteLeagueRows.map((r) => ({
                      id: String(r.user_id),
                      name: r.display_name || 'Estudiante',
                      isBot: false,
                      isSelf: !!(ua && ua.userId && r.user_id === ua.userId),
                      score: Number(r.score) || 0,
                      sub: 'Liga global (Supabase)',
                      rank: 0,
                  }));
                  if (ua && ua.source === 'supabase' && !humans.some((h) => h.isSelf)) {
                      humans.push({
                          id: ua.userId,
                          name: meName,
                          isBot: false,
                          isSelf: true,
                          score: meScore,
                          sub: 'Tu puntuación (se sube al jugar)',
                          rank: 0,
                      });
                  }
              } else {
                  humans = [{
                      id: 'local_player',
                      name: meName,
                      isBot: false,
                      isSelf: true,
                      score: meScore,
                      sub: ua ? mullerMaskEmail(ua.email) : 'Invitado (sin cuenta)',
                      rank: 0,
                  }];
              }
                   const rows = [...humans, ...bots].sort((a, b) => b.score - a.score);
              rows.forEach((r, i) => { r.rank = i + 1; });
              return { week, rows };
          }, [userStats, unifiedAuth, remoteLeagueRows]);
          const directoryLocals = useMemo(() => {
              void authTick;
              const m = mullerAccountsLoad();
              return Object.keys(m).map((email) => ({ email, displayName: m[email].displayName, userId: m[email].userId, createdAt: m[email].createdAt }));
          }, [authTick]);
          const [mainDailyGoal, setMainDailyGoal] = useState(() => mullerGetMainDailyGoalCards());
          const [oralQIdx, setOralQIdx] = useState(0);
          const [oralSecs, setOralSecs] = useState(90);
          const [oralDeadline, setOralDeadline] = useState(null);
          const [oralClock, setOralClock] = useState(0);
          const [pwaDeferredPrompt, setPwaDeferredPrompt] = useState(null);
          const [tourStep, setTourStep] = useState(0);
          const [dailyChallenges, setDailyChallenges] = useState(() => {
              try {
                  const k = 'muller_daily_v1_' + new Date().toISOString().slice(0, 10);
                  const j = localStorage.getItem(k);
                  return j ? JSON.parse(j) : { vocab: false, shadow: false, write: false };
              } catch (e) { return { vocab: false, shadow: false, write: false }; }
          });
          const [vocabSrsEpoch, setVocabSrsEpoch] = useState(0);
          const vocabSrsMap = useMemo(() => mullerGetVocabSrsMap(), [vocabSrsEpoch]);
          const vocabSrsDueCount = useMemo(() => {
              if (!currentVocabList.length) return 0;
              return mullerCountVocabSrsDue(currentVocabList, vocabSrsMap);
          }, [currentVocabList, vocabSrsMap]);
          const vocabDisplayList = useMemo(() => {
              if (!vocabDueFilterOnly) return currentVocabList;
              const todayStr = new Date().toISOString().slice(0, 10);
              return currentVocabList.filter((w) => {
                  const rec = vocabSrsMap[mullerVocabSrsKey(w)];
                  if (!rec || !rec.due) return true;
                  return rec.due <= todayStr;
              });
          }, [currentVocabList, vocabDueFilterOnly, vocabSrsMap]);

          const [exerciseHelpId, setExerciseHelpId] = useState(null);
          const historiaExerciseHelpId = useMemo(() => {
              if (podcastMode) return 'historia_podcast';
              if (mode === 'interview') return 'historia_interview';
              if (mode === 'roleplay_wait') return 'historia_roleplay';
              if (mode === 'dialogue' && puzzleMode) return 'historia_puzzle';
              if (mode === 'dialogue' && diktatMode) return 'historia_diktat';
              if (mode === 'dialogue' && lueckentextMode) return 'historia_huecos';
              if (mode === 'dialogue' && artikelSniperMode) return 'historia_artikel';
              if (mode === 'dialogue' && declinaMode) return 'historia_declinar';
              if (mode === 'dialogue' && tempusMode) return 'historia_tempus';
              if (mode === 'dialogue' && blindMode) return 'historia_blind';
              if (mode === 'dialogue') return 'historia_dialogue';
              return 'historia_base';
          }, [mode, podcastMode, puzzleMode, diktatMode, lueckentextMode, artikelSniperMode, declinaMode, tempusMode, blindMode]);
          const escrituraExerciseHelpId = useMemo(() => 'escritura_' + writingMode, [writingMode]);
          const bxExerciseHelpId = useMemo(() => 'bx_' + bxCategory, [bxCategory]);

          useEffect(() => {
              const h = (e) => {
                  const id = e && e.detail && e.detail.id;
                  if (id && MULLER_EXERCISE_HELP[id]) setExerciseHelpId(id);
              };
              window.addEventListener('mullerOpenExerciseHelp', h);
              return () => window.removeEventListener('mullerOpenExerciseHelp', h);
          }, []);

          useEffect(() => {
              if (!exerciseHelpId) return;
              const k = (ev) => { if (ev.key === 'Escape') setExerciseHelpId(null); };
              window.addEventListener('keydown', k);
              return () => window.removeEventListener('keydown', k);
          }, [exerciseHelpId]);

          const ExerciseHelpBtn = ({ helpId, className = '', compact = false, title: titleOverride, ...rest }) => {
              const entry = MULLER_EXERCISE_HELP[helpId];
              if (!entry) return null;
              const t = titleOverride || ('Ayuda: ' + entry.title);
              return (
                  <button type="button" onClick={() => setExerciseHelpId(helpId)} className={`inline-flex items-center justify-center gap-1 rounded-lg border border-white/15 bg-black/30 hover:bg-black/50 px-1.5 py-1 text-[10px] md:text-xs font-bold text-sky-200/95 shrink-0 ${className}`} title={t} aria-label={t} {...rest}>
                      <Icon name="help-circle" className={compact ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5 md:w-4 md:h-4'} />
                      {!compact && <span className="hidden sm:inline">Ayuda</span>}
                  </button>
              );
          };

          const bxCatTabRef = useRef(null);
          const isPlayingRef = useRef(false);
          const timeoutRef = useRef(null);
          const recognitionRef = useRef(null);
          const spokenTextRef = useRef("");
          const speechFinalRef = useRef("");
          const micIgnoreMouseUntilRef = useRef(0);
          const noiseContextRef = useRef(null);
          const noiseSourceRef = useRef(null);
          const noiseGainRef = useRef(null);
          const submitKeyLockRef = useRef({});
          const pdfStudyBufferRef = useRef(null);
          const pdfStudyDocHandleRef = useRef(null);

          /* Tras cada commit React los <i data-lucide> se restauran; hay que volver a pintar SVG en todo el documento */
          useLayoutEffect(() => {
              const t = requestAnimationFrame(() => {
                  try {
                      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
                  } catch (e) {}
              });
              return () => cancelAnimationFrame(t);
          });

          useEffect(() => {
              if (!showMullerHub) return;
              try {
                  setTtsDeUri(localStorage.getItem('muller_tts_de') || '');
                  setTtsEsUri(localStorage.getItem('muller_tts_es') || '');
              } catch (e) {}
              try {
                  if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
                      window.speechSynthesis.getVoices();
                  }
              } catch (e) {}
          }, [showMullerHub]);

          useEffect(() => {
              if (!showMullerHub) return;
              const onKey = (e) => { if (e.key === 'Escape') setShowMullerHub(false); };
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, [showMullerHub]);

          useEffect(() => {
              const onAb = (e) => setAudiobookPlaying(!!e.detail?.playing);
              window.addEventListener('mullerAudiobookState', onAb);
              return () => window.removeEventListener('mullerAudiobookState', onAb);
          }, []);

          // Cargar datos guardados
          useEffect(() => {
              const savedData = localStorage.getItem('mullerStats');
              if (savedData) setUserStats(JSON.parse(savedData));
              else setShowLoginModal(true);
              const scripts = localStorage.getItem('mullerScripts');
              if (scripts) {
                  try {
                      let arr = JSON.parse(scripts);
                      if (Array.isArray(arr)) {
                          let changed = false;
                          arr = arr.map((s, i) => {
                              if (s && s.id != null && s.id !== '') return s;
                              changed = true;
                              return { ...s, id: 'muller_script_' + Date.now() + '_' + i + '_' + Math.random().toString(36).slice(2, 9) };
                          });
                          if (changed) localStorage.setItem('mullerScripts', JSON.stringify(arr));
                          setSavedScripts(arr);
                      }
                  } catch (e) { setSavedScripts([]); }
              }
              const savedCustomVocab = localStorage.getItem('mullerCustomVocab');
              if(savedCustomVocab) setCustomVocabLessons(JSON.parse(savedCustomVocab));
              setUserStats((prev) => ({ ...prev, streakDays: mullerComputeHonestStreakDays() }));
          }, []);

          const buildCloudSnapshot = useCallback(() => {
              return {
                  userStats,
                  savedScripts,
                  customVocabLessons,
                  prefs: {
                      showFloatingTools,
                      reduceMotionUi,
                      uiTheme,
                  },
                  storiesProDraft: {
                      inputMode: storiesProInputMode,
                      sourceText: storiesProSourceText,
                      level: storiesProLevel,
                      tone: storiesProTone,
                  }
              };
          }, [userStats, savedScripts, customVocabLessons, showFloatingTools, reduceMotionUi, uiTheme, storiesProInputMode, storiesProSourceText, storiesProLevel, storiesProTone]);

          const applyCloudSnapshot = useCallback((payload) => {
              if (!payload || typeof payload !== 'object') return;
              cloudApplyingRef.current = true;
              try {
                  if (payload.userStats && typeof payload.userStats === 'object') {
                      setUserStats(payload.userStats);
                      try { localStorage.setItem('mullerStats', JSON.stringify(payload.userStats)); } catch (e) {}
                  }
                  if (Array.isArray(payload.savedScripts)) {
                      setSavedScripts(payload.savedScripts);
                      try { localStorage.setItem('mullerScripts', JSON.stringify(payload.savedScripts)); } catch (e) {}
                  }
                  if (Array.isArray(payload.customVocabLessons)) {
                      setCustomVocabLessons(payload.customVocabLessons);
                      try { localStorage.setItem('mullerCustomVocab', JSON.stringify(payload.customVocabLessons)); } catch (e) {}
                  }
                  if (payload.prefs && typeof payload.prefs === 'object') {
                      if (typeof payload.prefs.showFloatingTools === 'boolean') setShowFloatingTools(payload.prefs.showFloatingTools);
                      if (typeof payload.prefs.reduceMotionUi === 'boolean') setReduceMotionUi(payload.prefs.reduceMotionUi);
                      if (typeof payload.prefs.uiTheme === 'string') setUiTheme(payload.prefs.uiTheme);
                  }
                  if (payload.storiesProDraft && typeof payload.storiesProDraft === 'object') {
                      if (typeof payload.storiesProDraft.inputMode === 'string') setStoriesProInputMode(payload.storiesProDraft.inputMode);
                      if (typeof payload.storiesProDraft.sourceText === 'string') setStoriesProSourceText(payload.storiesProDraft.sourceText);
                      if (typeof payload.storiesProDraft.level === 'string') setStoriesProLevel(payload.storiesProDraft.level);
                      if (typeof payload.storiesProDraft.tone === 'string') setStoriesProTone(payload.storiesProDraft.tone);
                  }
              } finally {
                  window.setTimeout(() => { cloudApplyingRef.current = false; }, 50);
              }
          }, []);

          useEffect(() => {
              if (activeTab !== 'lexikon') return;
              try {
                  const raw = localStorage.getItem('mullerCustomVocab');
                  if (raw) {
                      const parsed = JSON.parse(raw);
                      if (Array.isArray(parsed)) setCustomVocabLessons(parsed);
                  }
              } catch (e) {}
          }, [activeTab]);

          useEffect(() => {
              if (activeTab !== 'lexikon') return;
              if (customVocabLessons.length > 0 && !lexikonSaveLessonId) {
                  setLexikonSaveLessonId(customVocabLessons[0].id);
              }
          }, [activeTab, customVocabLessons, lexikonSaveLessonId]);

          useEffect(() => {
              const id = setInterval(() => {
                  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
                  let st = mullerGetStreakTodayStats();
                  const today = new Date().toISOString().slice(0, 10);
                  if (st.date !== today) st = { date: today, vocabRated: 0, points: 0, activeSec: 0 };
                  st.activeSec = (st.activeSec || 0) + 60;
                  mullerSaveStreakTodayStats(st);
                  mullerUpdateQualifyingForStats(st);
                  setUserStats((prev) => ({ ...prev, streakDays: mullerComputeHonestStreakDays() }));
              }, 60000);
              return () => clearInterval(id);
          }, []);

          useEffect(() => { try { localStorage.setItem('muller_active_tab_v1', activeTab); } catch {} }, [activeTab]);

          useEffect(() => {
              if (!showSplash) {
                  setSplashLogoBlink(false);
                  return undefined;
              }
              const t = window.setTimeout(() => setSplashLogoBlink(true), 3000);
              return () => window.clearTimeout(t);
          }, [showSplash]);

          useEffect(() => {
              const onKey = (e) => {
                  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
                  if (e.key === '?' || (e.shiftKey && e.key === '/')) {
                      e.preventDefault();
                      setShowShortcutsModal(true);
                  }
                  if (e.key === 'i' || e.key === 'I') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('inicio'); stopAudio(); setPracticeActive(null); }
                  }
                  if (e.key === 'r' || e.key === 'R') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('ruta'); stopAudio(); setPracticeActive(null); }
                  }
                  if (e.key === 'h' || e.key === 'H') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('historia'); setMode('dialogue'); }
                  }
                  if (e.key === 'v' || e.key === 'V') {
                      if (!e.ctrlKey && !e.metaKey) setActiveTab('vocabulario');
                  }
                  if (e.key === 'p' || e.key === 'P') {
                      if (!e.ctrlKey && !e.metaKey) setActiveTab('progreso');
                  }
                  if (e.key === 'm' || e.key === 'M') {
                      if (!e.ctrlKey && !e.metaKey) { setShowMullerHub(true); setMullerHubTab('voices'); }
                  }
                  if (e.key === 'o' || e.key === 'O') {
                      if (!e.ctrlKey && !e.metaKey) { setActiveTab('comunidad'); stopAudio(); setPracticeActive(null); }
                  }
                  if (e.key === 'Escape') { setShowShortcutsModal(false); setUserMenuOpen(false); }
              };
              window.addEventListener('keydown', onKey);
              return () => window.removeEventListener('keydown', onKey);
          }, []);

          useEffect(() => {
              if (activeTab !== 'ruta') return undefined;
              rutaTabTimerRef.current = Date.now();
              return () => {
                  const start = rutaTabTimerRef.current;
                  if (!start) return;
                  const ms = Date.now() - start;
                  setRutaProgress((prev) => {
                      const next = { ...prev, playTimeMs: (prev.playTimeMs || 0) + ms };
                      if (typeof window.mullerRutaSave === 'function') window.mullerRutaSave(next);
                      return next;
                  });
              };
          }, [activeTab]);

          useEffect(() => {
              if (!userMenuOpen) return undefined;
              const close = (e) => {
                  if (userMenuWrapRef.current && !userMenuWrapRef.current.contains(e.target)) setUserMenuOpen(false);
              };
              document.addEventListener('mousedown', close);
              document.addEventListener('touchstart', close, { passive: true });
              return () => {
                  document.removeEventListener('mousedown', close);
                  document.removeEventListener('touchstart', close);
              };
          }, [userMenuOpen]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client) return undefined;
              client.auth.getSession().then(({ data: { session } }) => {
                  setSupabaseUser(session && session.user ? session.user : null);
              });
              const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
                  setSupabaseUser(session && session.user ? session.user : null);
                  setAuthTick((x) => x + 1);
              });
              return () => { try { subscription.unsubscribe(); } catch (err) {} };
          }, []);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || !supabaseUser || !supabaseUser.id) {
                  setSupabaseProfile(null);
                  return undefined;
              }
              let cancelled = false;
              client.from('profiles').select('*').eq('id', supabaseUser.id).maybeSingle().then(({ data, error }) => {
                  if (cancelled || error) return;
                  if (data) setSupabaseProfile(data);
              });
              return () => { cancelled = true; };
          }, [supabaseUser]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || !supabaseUser || !supabaseUser.id) {
                  setWalletCoins(null);
                  setWalletIsCreator(false);
                  return undefined;
              }
              let cancelled = false;
              setWalletLoading(true);
              client.rpc('muller_get_wallet').then(({ data, error }) => {
                  if (cancelled) return;
                  setWalletLoading(false);
                  if (error || !Array.isArray(data) || !data[0]) return;
                  const row = data[0];
                  setWalletCoins(Number(row.coins || 0));
                  setWalletIsCreator(!!row.is_creator);
              });
              return () => { cancelled = true; };
          }, [supabaseUser, authTick]);

          useEffect(() => {
              if (!unifiedAuth || unifiedAuth.source !== 'supabase') return;
              if (walletCoins == null) return;
              if (isCreatorAccount) return;
              setUserStats((prev) => {
                  if ((Number(prev.coins) || 0) === walletCoins) return prev;
                  const next = { ...prev, coins: walletCoins };
                  try { localStorage.setItem('mullerStats', JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, [walletCoins, unifiedAuth, isCreatorAccount]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || !supabaseUser || !supabaseUser.id) return undefined;
              const week = mullerIsoWeekMonday();
              const score = mullerLeagueComputeUserScore(userStats);
              const t = window.setTimeout(() => {
                  client.rpc('muller_submit_league_score', {
                      p_week_key: week,
                      p_score: score,
                      p_display_name: userStats.username || 'Estudiante',
                  }).then(() => {});
              }, 2800);
              return () => window.clearTimeout(t);
          }, [userStats, supabaseUser]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || activeTab !== 'comunidad' || communitySubTab !== 'ligas') return undefined;
              const week = mullerIsoWeekMonday();
              let cancelled = false;
              client.from('league_scores').select('user_id, week_key, score, display_name, updated_at').eq('week_key', week).order('score', { ascending: false }).limit(80).then(({ data, error }) => {
                  if (cancelled || error) return;
                  setRemoteLeagueRows(data || []);
              });
              return () => { cancelled = true; };
          }, [activeTab, communitySubTab, authTick, supabaseUser]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || activeTab !== 'comunidad' || communitySubTab !== 'directorio') return undefined;
              let cancelled = false;
              client.from('profiles').select('id, display_name, updated_at').order('updated_at', { ascending: false }).limit(120).then(({ data, error }) => {
                  if (cancelled || error) return;
                  setRemoteProfiles(data || []);
              });
              return () => { cancelled = true; };
          }, [activeTab, communitySubTab, authTick]);

          useEffect(() => {
              const client = mullerGetSupabaseClient();
              if (!client || activeTab !== 'comunidad' || communitySubTab !== 'economia' || !supabaseUser) {
                  setRewardStatus(null);
                  setPremiumStatus(null);
                  return undefined;
              }
              let cancelled = false;
              client.rpc('muller_reward_status').then(({ data, error }) => {
                  if (cancelled || error || !Array.isArray(data) || !data[0]) return;
                  setRewardStatus(data[0]);
              });
              client.rpc('muller_get_premium_status').then(({ data, error }) => {
                  if (cancelled || error || !Array.isArray(data) || !data[0]) return;
                  setPremiumStatus(data[0]);
              });
              return () => { cancelled = true; };
          }, [activeTab, communitySubTab, authTick, supabaseUser]);

          useEffect(() => {
              if (!unifiedAuth) {
                  setProfileNameDraft('');
                  setProfileNameMsg('');
                  return;
              }
              setProfileNameDraft(unifiedAuth.displayName || '');
              setProfileNameMsg('');
          }, [unifiedAuth]);

          useEffect(() => {
              if (!mullerSupabaseConfigured()) {
                  setCloudSyncState('local');
                  setCloudSyncLabel('Local');
                  return;
              }
              if (!supabaseUser || !supabaseUser.id) {
                  setCloudSyncState('local');
                  setCloudSyncLabel('Local (sin sesión)');
                  return;
              }
              setCloudSyncState('syncing');
              setCloudSyncLabel('Supabase conectando…');
              const client = mullerGetSupabaseClient();
              if (!client) {
                  setCloudSyncState('error');
                  setCloudSyncLabel('Error Supabase');
                  return;
              }
              let cancelled = false;
              client.from('muller_user_state')
                  .select('payload, updated_at')
                  .eq('user_id', supabaseUser.id)
                  .maybeSingle()
                  .then(({ data, error }) => {
                      if (cancelled) return;
                      if (error) {
                          setCloudSyncState('error');
                          setCloudSyncLabel(mullerCloudSyncErrorLabel(error));
                          if (window.__mullerToast) {
                              const detail = String(error.message || error.code || 'fallo desconocido').slice(0, 140);
                              window.__mullerToast(`Sync nube: ${detail}`, 'error');
                          }
                          return;
                      }
                      if (data && data.payload) {
                          applyCloudSnapshot(data.payload);
                          setCloudSyncAt(data.updated_at || new Date().toISOString());
                      }
                      cloudLoadedRef.current = true;
                      setCloudSyncState('synced');
                      setCloudSyncLabel('Supabase activo');
                  })
                  .catch(() => {
                      if (cancelled) return;
                      setCloudSyncState('error');
                      setCloudSyncLabel('Error de red');
                  });
              return () => { cancelled = true; };
          }, [supabaseUser, applyCloudSnapshot]);

          useEffect(() => {
              if (!mullerSupabaseConfigured() || !supabaseUser || !supabaseUser.id) return undefined;
              if (!cloudLoadedRef.current || cloudApplyingRef.current) return undefined;
              const client = mullerGetSupabaseClient();
              if (!client) return undefined;
              if (cloudPushTimerRef.current) window.clearTimeout(cloudPushTimerRef.current);
              setCloudSyncState('syncing');
              setCloudSyncLabel('Sincronizando…');
              cloudPushTimerRef.current = window.setTimeout(async () => {
                  try {
                      const payload = buildCloudSnapshot();
                      const nowIso = new Date().toISOString();
                      const { error } = await client.from('muller_user_state').upsert({
                          user_id: supabaseUser.id,
                          payload,
                          updated_at: nowIso
                      }, { onConflict: 'user_id' });
                      if (error) throw error;
                      setCloudSyncState('synced');
                      setCloudSyncLabel('Supabase activo');
                      setCloudSyncAt(nowIso);
                  } catch (err) {
                      setCloudSyncState('error');
                      setCloudSyncLabel('Sync con errores');
                  }
              }, 1200);
              return () => {
                  if (cloudPushTimerRef.current) window.clearTimeout(cloudPushTimerRef.current);
              };
          }, [supabaseUser, buildCloudSnapshot, userStats, savedScripts, customVocabLessons, showFloatingTools, reduceMotionUi, uiTheme, storiesProInputMode, storiesProSourceText, storiesProLevel, storiesProTone]);

          useEffect(() => {
              const onBip = (e) => {
                  e.preventDefault();
                  setPwaDeferredPrompt(e);
              };
              window.addEventListener('beforeinstallprompt', onBip);
              return () => window.removeEventListener('beforeinstallprompt', onBip);
          }, []);

          useEffect(() => {
              if (mode !== 'interview' || !oralDeadline) return;
              const id = setInterval(() => setOralClock((c) => c + 1), 1000);
              return () => clearInterval(id);
          }, [mode, oralDeadline, oralQIdx]);

          const vocabViewKey = vocabDisplayList[vocabReviewIndex] ? mullerVocabSrsKey(vocabDisplayList[vocabReviewIndex]) : '';
          useEffect(() => {
              if (activeTab !== 'vocabulario' || !vocabViewKey) return;
              const w = vocabDisplayList[vocabReviewIndex];
              if (!w) return;
              try {
                  const map = mullerIncrementSrsView(mullerGetVocabSrsMap(), w);
                  mullerSetVocabSrsMap(map);
                  setVocabSrsEpoch((x) => x + 1);
              } catch (err) {}
          }, [vocabReviewIndex, activeTab, vocabViewKey]);

          useEffect(() => {
              if (vocabReviewIndex >= vocabDisplayList.length) setVocabReviewIndex(0);
          }, [vocabDisplayList.length, vocabReviewIndex]);

          useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

          useEffect(() => {
              window.__MULLER_ACTIVE_GUION__ = guionData;
          }, [guionData]);

          useEffect(() => {
              if (activeTab !== 'shadowing') return;
              setSpokenText("");
              setPronunciationScore(null);
              setPronunciationFeedback([]);
              setGrammarPolizeiMsg("");
          }, [sceneIndex, activeTab]);

          const saveProgress = (newStatsUpdates) => {
              const today = new Date().toISOString().split('T')[0];
              let st = mullerGetStreakTodayStats();
              if (st.date !== today) st = { date: today, vocabRated: 0, points: 0, activeSec: 0 };
              const mergedStats = { ...userStats, ...newStatsUpdates, lastPlayedDate: today };
              if (isCreatorAccount) mergedStats.coins = 999999999;
              if (unifiedAuth && unifiedAuth.source === 'supabase' && !isCreatorAccount && walletCoins != null) {
                  mergedStats.coins = walletCoins;
              }
              const dayMap = mergedStats.activityByDay || {};
              st.points = Math.max(st.points || 0, dayMap[today] || 0);
              mullerSaveStreakTodayStats(st);
              mullerUpdateQualifyingForStats(st);
              mergedStats.streakDays = mullerComputeHonestStreakDays();
              const goalCards = mullerGetMainDailyGoalCards();
              if (st.vocabRated >= goalCards) {
                  try {
                      if (localStorage.getItem(MULLER_GOAL_CLAIM_KEY) !== today) {
                          localStorage.setItem(MULLER_GOAL_CLAIM_KEY, today);
                          mergedStats.coins = (mergedStats.coins || 0) + 10;
                      }
                  } catch (e) {}
              }
              setUserStats(mergedStats);
              localStorage.setItem('mullerStats', JSON.stringify(mergedStats));
          };

          const handleRegister = () => {
              if(tempUsername.trim() === "") return;
              saveProgress({ username: tempUsername, isPremium: true });
              setShowLoginModal(false);
          };

          const deductHeart = () => {
              if (userStats.hearts <= 1) { saveProgress({ hearts: 0 }); stopAudio(); setShowDeathModal(true); } 
              else { saveProgress({ hearts: userStats.hearts - 1 }); }
          };

          const buyHearts = () => {
              if (isCreatorAccount) { saveProgress({ hearts: 5 }); setShowDeathModal(false); return; }
              if (unifiedAuth && unifiedAuth.source === 'supabase') {
                  const client = mullerGetSupabaseClient();
                  if (!client) { alert("Supabase no disponible."); return; }
                  client.rpc('muller_spend_coins', { p_amount: 50, p_reason: 'buy_hearts' }).then(({ data, error }) => {
                      if (error || !Array.isArray(data) || !data[0] || !data[0].ok) {
                          alert("No tienes suficientes Monedas (Coins).");
                          return;
                      }
                      const newBalance = Number(data[0].balance || 0);
                      setWalletCoins(newBalance);
                      saveProgress({ hearts: 5, coins: newBalance });
                      setShowDeathModal(false);
                  });
                  return;
              }
              if (userStats.coins >= 50) { saveProgress({ coins: userStats.coins - 50, hearts: 5 }); setShowDeathModal(false); }
              else { alert("No tienes suficientes Monedas (Coins). Completa ejercicios para ganar más."); }
          };

          const getLast7Days = () => {
              const days = [];
              const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
              for(let i=6; i>=0; i--) {
                  const d = new Date(); d.setDate(d.getDate() - i);
                  days.push(`${dayNames[d.getDay()]} ${d.getDate()}`);
              }
              return days;
          };

          const mergeActivityPoints = (extra) => {
              const today = new Date().toISOString().slice(0, 10);
              const dayMap = { ...(userStats.activityByDay || {}) };
              dayMap[today] = (dayMap[today] || 0) + extra;
              return dayMap;
          };

          const completeRutaLesson = (levelIdx, lessonIdx) => {
              const levels = rutaLevels || [];
              const lesson = levels[levelIdx] && levels[levelIdx].lessons[lessonIdx];
              if (!lesson) return;
              if (rutaProgress.completed && rutaProgress.completed[lesson.id]) {
                  saveProgress({ xp: userStats.xp + 5, activityByDay: mergeActivityPoints(12) });
                  window.__mullerPlaySfx && window.__mullerPlaySfx('ok');
                  setCelebrationModal({ title: 'Repaso listo', subtitle: lesson.title, xp: 5, coins: 0, recap: true });
                  setRutaRun(null);
                  setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr('');
                  return;
              }
              const nextCount = (rutaProgress.lessonsCompleted || 0) + 1;
              let bonus = 0;
              if (nextCount % 3 === 0) bonus = 35;
              const nextProg = {
                  ...rutaProgress,
                  completed: { ...(rutaProgress.completed || {}), [lesson.id]: true },
                  lessonsCompleted: nextCount,
              };
              if (typeof window.mullerRutaSave === 'function') window.mullerRutaSave(nextProg);
              setRutaProgress(nextProg);
              saveProgress({
                  xp: userStats.xp + lesson.rewardXp,
                  coins: userStats.coins + lesson.rewardCoins + bonus,
                  activityByDay: mergeActivityPoints(45),
              });
              window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
              setCelebrationModal({
                  title: '¡Lo lograste!',
                  subtitle: lesson.title,
                  xp: lesson.rewardXp,
                  coins: lesson.rewardCoins + bonus,
                  milestone: bonus > 0,
              });
              setRutaRun(null);
              setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr('');
          };

      // ========== NUEVO TEST ADAPTATIVO (30 PREGUNTAS) ==========
const startPlacementTest = () => {
  const initialQuestions = selectQuestionsForLevel('A2', 5);
  setPlacementQuestions(initialQuestions);
  setPlacementAnswers(new Array(initialQuestions.length).fill(null));
  setPlacementIndex(0);
  setPlacementLevel('A2');
  setPlacementScore({ correct: 0, total: 0 });
  setPlacementFinished(false);
};

const selectQuestionsForLevel = (level, count) => {
  const allQuestions = window.MULLER_PLACEMENT_QUESTIONS || [];
  const levelQuestions = allQuestions.filter(q => q.level === level);
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, levelQuestions.length));
};

const handlePlacementAnswer = (selectedOpt) => {
  const currentQ = placementQuestions[placementIndex];
  if (!currentQ) return;
  
  const isCorrect = (selectedOpt === currentQ.ok);
  
  // Actualizar respuestas
  const newAnswers = [...placementAnswers];
  newAnswers[placementIndex] = selectedOpt;
  setPlacementAnswers(newAnswers);
  
  // Actualizar puntuación del nivel actual
  const newScore = {
    correct: placementScore.correct + (isCorrect ? 1 : 0),
    total: placementScore.total + 1
  };
  setPlacementScore(newScore);
  
  // Reproducir sonido de acierto/fallo
  if (window.__mullerNotifyExerciseOutcome) {
    window.__mullerNotifyExerciseOutcome(isCorrect);
  }
  
  // Lógica adaptativa
  const performanceRatio = newScore.correct / newScore.total;
  let nextLevel = placementLevel;
  let shouldFinish = false;
  
  if (newScore.total >= 5) {
    if (performanceRatio >= 0.7) {
      // Buen rendimiento: subir de nivel
      if (placementLevel === 'A1') nextLevel = 'A2';
      else if (placementLevel === 'A2') nextLevel = 'B1';
      else if (placementLevel === 'B1') nextLevel = 'B2';
      else if (placementLevel === 'B2') shouldFinish = true;
    } else if (performanceRatio <= 0.3) {
      // Mal rendimiento: bajar de nivel
      if (placementLevel === 'B2') nextLevel = 'B1';
      else if (placementLevel === 'B1') nextLevel = 'A2';
      else if (placementLevel === 'A2') nextLevel = 'A1';
      else if (placementLevel === 'A1') shouldFinish = true;
    } else {
      // Rendimiento intermedio: continuar mismo nivel
      if (newScore.total >= 8) shouldFinish = true;
    }
  }
  
  // Si no hay más preguntas del nivel, finalizar
  if (placementIndex >= placementQuestions.length - 1) {
    shouldFinish = true;
  }
  
  if (shouldFinish) {
    const recommendedLevel = calculateRecommendedLevel();
    finishPlacementWithLevel(recommendedLevel);
    return;
  }
  
  if (nextLevel !== placementLevel) {
    // Cambiar de nivel
    const newQuestions = selectQuestionsForLevel(nextLevel, 5);
    setPlacementQuestions(newQuestions);
    setPlacementAnswers(new Array(newQuestions.length).fill(null));
    setPlacementIndex(0);
    setPlacementLevel(nextLevel);
    setPlacementScore({ correct: 0, total: 0 });
  } else {
    // Siguiente pregunta mismo nivel
    setPlacementIndex(placementIndex + 1);
  }
};

const calculateRecommendedLevel = () => {
  const ratio = placementScore.total > 0 ? placementScore.correct / placementScore.total : 0;
  if (placementLevel === 'A1' && ratio >= 0.6) return 'A2';
  if (placementLevel === 'A2' && ratio >= 0.6) return 'B1';
  if (placementLevel === 'B1' && ratio >= 0.6) return 'B2';
  return placementLevel;
};

const finishPlacementWithLevel = (finalLevel) => {
  const levelIndexMap = { 'A1': 0, 'A2': 1, 'B1': 2, 'B2': 3 };
  const suggestedIdx = levelIndexMap[finalLevel] || 0;
  
  const next = { ...rutaProgress, placementDone: true, suggestedLevelIdx: suggestedIdx };
  if (typeof window.mullerRutaSave === 'function') window.mullerRutaSave(next);
  setRutaProgress(next);
  setRutaSubTab('camino');
  
  if (window.__mullerPlaySfx) window.__mullerPlaySfx('levelup');
  
  setCelebrationModal({
    title: 'Test de nivel completado',
    subtitle: `Nivel recomendado: ${finalLevel}`,
    xp: 0,
    coins: 20,
    milestone: false,
    placement: true
  });
  
  saveProgress({
    coins: userStats.coins + 20,
    activityByDay: mergeActivityPoints(25)
  });
  
  // Resetear test
  setPlacementQuestions([]);
  setPlacementAnswers([]);
  setPlacementIndex(0);
  setPlacementFinished(false);
};

// ========== FIN NUEVO TEST ADAPTATIVO ==========

          const checkRutaFillAnswer = (lesson) => {
              if (!lesson || !lesson.fill) return false;
              const got = (rutaFillInput || '').trim().toLowerCase().replace(/\s+/g, ' ');
              const exp = String(lesson.fill.answer || '').trim().toLowerCase();
              if (got === exp) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true); setRutaSpeakErr(''); return true; }
              window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
              setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Sigue practicando.');
              return false;
          };

          const checkRutaSpeakAnswer = (target) => {
              const a = normalizeGermanSpeechText(rutaTranscript || '');
              const b = normalizeGermanSpeechText(target || '');
              if (!a || !b) { setRutaSpeakErr('Graba de nuevo con el micrófono.'); return false; }
              const dist = levenshteinDistance(a, b);
              const tol = Math.max(2, Math.floor(b.length / 5));
              if (a === b || dist <= tol) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true); setRutaSpeakErr(''); return true; }
              window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
              setRutaSpeakErr(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Casi — prueba otra vez.');
              return false;
          };

          const runSingleSubmitAction = useCallback((actionKey, actionFn) => {
              const now = Date.now();
              const lastTs = submitKeyLockRef.current[actionKey] || 0;
              if (now - lastTs < 350) return;
              submitKeyLockRef.current[actionKey] = now;
              actionFn();
          }, []);

          const handleExerciseEnterSubmit = useCallback((e, actionKey, actionFn, opts = {}) => {
              const { requireCtrlOrMeta = false } = opts;
              if (e.key !== 'Enter') return;
              if (e.repeat) {
                  e.preventDefault();
                  return;
              }
              if (requireCtrlOrMeta) {
                  if (!(e.ctrlKey || e.metaKey)) return;
              } else if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
                  return;
              }
              e.preventDefault();
              runSingleSubmitAction(actionKey, actionFn);
          }, [runSingleSubmitAction]);

          const loadPdfStudyFile = useCallback(async (file) => {
              if (!file) return;
              if (!window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') {
                  setPdfStudyErr('PDF no disponible en este navegador.');
                  return;
              }
              try {
                  const nextUrl = URL.createObjectURL(file);
                  setPdfStudyBlobUrl((prev) => {
                      if (prev) {
                          try { URL.revokeObjectURL(prev); } catch (e) {}
                      }
                      return nextUrl;
                  });
              } catch (e) {
                  setPdfStudyBlobUrl('');
              }
              setPdfStudyExtracting(true);
              setPdfStudyErr('');
              setPdfStudyBusyMsg('Leyendo PDF…');
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
              try {
                  window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
                  const buffer = await file.arrayBuffer();
                  pdfStudyBufferRef.current = buffer;
                  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
                  pdfStudyDocHandleRef.current = pdf;
                  const totalPages = Math.max(1, Number(pdf.numPages) || 1);
                  const pages = [];
                  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                      setPdfStudyBusyMsg(`Extrayendo página ${pageNum}/${totalPages}…`);
                      let text = '';
                      try {
                          const pg = await pdf.getPage(pageNum);
                          const tc = await pg.getTextContent();
                          const raw = (tc.items || []).map((it) => String((it && it.str) || '')).join(' ');
                          text = mullerPdfCleanText(raw);
                      } catch (err) {}
                      const firstSlice = text.slice(0, 400);
                      const meta = mullerPdfGuessUnitLesson(firstSlice);
                      pages.push({
                          page: pageNum,
                          unit: meta.unit,
                          lesson: meta.lesson,
                          text: text.slice(0, MULLER_PDF_STORED_TEXT_MAX),
                          ocrPending: !text
                      });
                      if ((pageNum % MULLER_PDF_EXTRACT_YIELD_EVERY) === 0) {
                          await new Promise((resolve) => setTimeout(resolve, 0));
                      }
                  }
                  const compactPages = pages.slice(0, MULLER_PDF_STORED_PAGES_MAX);
                  const payload = {
                      id: `pdf-${Date.now()}`,
                      name: file.name || 'Libro PDF',
                      size: file.size || 0,
                      totalPages,
                      pages: compactPages,
                      importedAt: new Date().toISOString()
                  };
                  setPdfStudyDoc(payload);
                  setPdfStudyPageIdx(0);
                  try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(payload)); } catch (e) {}
                  const extractedCount = compactPages.filter((p) => p.text).length;
                  setPdfStudyBusyMsg(`PDF listo: ${extractedCount}/${compactPages.length} páginas con texto.`);
              } catch (err) {
                  setPdfStudyErr(err && err.message ? err.message : 'No se pudo leer el PDF.');
              } finally {
                  setPdfStudyExtracting(false);
              }
          }, []);

          const runPdfPageOcr = useCallback(async (pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const pages = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages : [];
              const page = pages[idx];
              if (!page) return;
              if (page.text && page.text.length >= 40) {
                  setPdfStudyBusyMsg('Esta página ya tiene texto; OCR no es necesario.');
                  return;
              }
              if (typeof Tesseract === 'undefined') {
                  setPdfStudyErr('No se pudo cargar OCR (Tesseract).');
                  return;
              }
              if (!window.pdfjsLib || typeof window.pdfjsLib.getDocument !== 'function') {
                  setPdfStudyErr('OCR PDF no disponible en este navegador.');
                  return;
              }
              if (!pdfStudyBufferRef.current && !pdfStudyDocHandleRef.current) {
                  setPdfStudyErr('Para OCR real de página, vuelve a subir el PDF en esta sesión.');
                  setPdfStudyBusyMsg('OCR no disponible: falta el PDF en memoria.');
                  return;
              }
              setPdfStudyOcrBusy(true);
              let worker = null;
              let attemptNo = 0;
              const attemptCap = 1 + Math.max(0, Number(MULLER_PDF_OCR_RETRY_MAX) || 0);
              try {
                  setPdfStudyErr('');
                  const safePage = Math.max(1, Number(page.page || pageNumber) || 1);
                  while (attemptNo < attemptCap) {
                      try {
                          setPdfStudyBusyMsg(`Preparando OCR página ${safePage}${attemptNo > 0 ? ` (reintento ${attemptNo}/${attemptCap - 1})` : ''}…`);
                          window.pdfjsLib.GlobalWorkerOptions.workerSrc = MULLER_PDFJS_WORKER_URL;
                          let pdf = pdfStudyDocHandleRef.current;
                          if (!pdf) {
                              pdf = await window.pdfjsLib.getDocument({ data: pdfStudyBufferRef.current }).promise;
                              pdfStudyDocHandleRef.current = pdf;
                          }
                          const pg = await pdf.getPage(safePage);
                          let ocrText = '';
                          const scales = [1.6, 2.1];
                          for (let attempt = 0; attempt < scales.length; attempt++) {
                              const scale = scales[attempt];
                              const viewport = pg.getViewport({ scale });
                              const canvas = document.createElement('canvas');
                              canvas.width = Math.max(1, Math.floor(viewport.width));
                              canvas.height = Math.max(1, Math.floor(viewport.height));
                              const ctx = canvas.getContext('2d');
                              if (!ctx) throw new Error('No se pudo crear el contexto de imagen para OCR.');
                              await pg.render({ canvasContext: ctx, viewport }).promise;
                              setPdfStudyBusyMsg(`OCR página ${safePage}: intento ${attempt + 1}/${scales.length}${attemptNo > 0 ? ` · retry ${attemptNo}` : ''}…`);
                              worker = await Tesseract.createWorker('deu', 1, {
                                  logger: (m) => {
                                      if (m && m.status === 'recognizing text' && typeof m.progress === 'number') {
                                          setPdfStudyBusyMsg(`OCR página ${safePage}: ${Math.round(100 * m.progress)}%`);
                                      }
                                  }
                              });
                              const result = await worker.recognize(canvas);
                              await worker.terminate();
                              worker = null;
                              const raw = result && result.data ? result.data.text : '';
                              ocrText = mullerPdfCleanText(raw);
                              if (ocrText.length >= 24 || attempt === scales.length - 1) break;
                          }
                          if (!ocrText) {
                              setPdfStudyErr('OCR sin texto. Prueba una página más nítida o con más contraste.');
                              setPdfStudyBusyMsg(`OCR página ${safePage}: sin texto detectado.`);
                              return;
                          }
                          const meta = mullerPdfGuessUnitLesson(ocrText.slice(0, 400));
                          const nextPages = pages.map((p, pIdx) => {
                              if (pIdx !== idx) return p;
                              return {
                                  ...p,
                                  unit: p.unit || meta.unit,
                                  lesson: p.lesson || meta.lesson,
                                  text: ocrText.slice(0, MULLER_PDF_STORED_TEXT_MAX),
                                  ocrPending: false,
                                  ocrUpdatedAt: new Date().toISOString()
                              };
                          });
                          const nextDoc = { ...pdfStudyDoc, pages: nextPages, updatedAt: new Date().toISOString() };
                          setPdfStudyDoc(nextDoc);
                          try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(nextDoc)); } catch (e) {}
                          setPdfStudyBusyMsg(`OCR completado en página ${safePage}.`);
                          return;
                      } catch (attemptErr) {
                          if (worker) {
                              try { await worker.terminate(); } catch (e) {}
                              worker = null;
                          }
                          attemptNo += 1;
                          if (attemptNo >= attemptCap) throw attemptErr;
                          setPdfStudyBusyMsg(`OCR página ${safePage}: error temporal, reintentando…`);
                          await new Promise((resolve) => setTimeout(resolve, 220));
                      }
                  }
              } catch (err) {
                  setPdfStudyErr(err && err.message ? err.message : 'Error al ejecutar OCR de página.');
              } finally {
                  if (worker) {
                      try { await worker.terminate(); } catch (e) {}
                  }
                  setPdfStudyOcrBusy(false);
              }
          }, [pdfStudyDoc]);

          const applyPdfStudyTextToReading = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
              const txt = page && page.text ? String(page.text).trim() : '';
              if (!txt) {
                  setPdfStudyErr('Página sin texto extraído todavía.');
                  return;
              }
              setReadingSource('paste');
              setReadingTextInput(txt);
              setPdfStudyBusyMsg(`Página ${page.page} enviada a Lectura.`);
              setPdfStudyLastApplied(`✓ Página ${page.page} cargada en Lectura`);
          }, [pdfStudyDoc]);

          const applyPdfStudyTextToWriting = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const page = pdfStudyDoc.pages && pdfStudyDoc.pages[idx];
              const txt = page && page.text ? String(page.text).trim() : '';
              if (!txt) {
                  setPdfStudyErr('Página sin texto extraído todavía.');
                  return;
              }
              setActiveTab('escritura');
              setWritingMode('telc');
              setWritingTelcInputMode('keyboard');
              setWritingTelcTypedText(txt);
              setPdfStudyBusyMsg(`Página ${page.page} enviada a Escritura TELC.`);
              setPdfStudyLastApplied(`✓ Página ${page.page} cargada en Escritura TELC`);
          }, [pdfStudyDoc]);

          const updatePdfStudyPageMeta = useCallback((pageNumber, patch = {}) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              const pages = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages : [];
              const page = pages[idx];
              if (!page) return;
              const nextPages = pages.map((p, pIdx) => {
                  if (pIdx !== idx) return p;
                  return {
                      ...p,
                      unit: patch && typeof patch.unit === 'string' ? patch.unit.trim() : p.unit,
                      lesson: patch && typeof patch.lesson === 'string' ? patch.lesson.trim() : p.lesson
                  };
              });
              const nextDoc = { ...pdfStudyDoc, pages: nextPages, updatedAt: new Date().toISOString() };
              setPdfStudyDoc(nextDoc);
              try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(nextDoc)); } catch (e) {}
          }, [pdfStudyDoc]);

          const activePdfPageData = useMemo(() => {
              if (!pdfStudyDoc || !Array.isArray(pdfStudyDoc.pages) || !pdfStudyDoc.pages.length) return {};
              const idx = Math.max(0, Math.min(pdfStudyDoc.pages.length - 1, pdfStudyPageIdx));
              return pdfStudyDoc.pages[idx] || {};
          }, [pdfStudyDoc, pdfStudyPageIdx]);
          const activePdfPageNotes = useMemo(() => {
              const page = activePdfPageData && activePdfPageData.page ? Number(activePdfPageData.page) : 0;
              if (!page || !pdfStudyNotesByPage || typeof pdfStudyNotesByPage !== 'object') return { drawing: '', typed: '' };
              const entry = pdfStudyNotesByPage[String(page)] || {};
              return {
                  drawing: typeof entry.drawing === 'string' ? entry.drawing : '',
                  typed: typeof entry.typed === 'string' ? entry.typed : ''
              };
          }, [activePdfPageData, pdfStudyNotesByPage]);
          const pdfStudyCanvasPadKey = useMemo(() => {
              const basePage = Math.max(1, Number(activePdfPageData && activePdfPageData.page ? activePdfPageData.page : 1));
              const nonce = Math.max(0, Number(pdfStudyInkNonce) || 0);
              return (basePage * 1000) + nonce;
          }, [activePdfPageData, pdfStudyInkNonce]);

          const updatePdfPageNotes = useCallback((pageNumber, patch = {}) => {
              const safePage = Math.max(1, Number(pageNumber) || 1);
              setPdfStudyNotesByPage((prev) => {
                  const base = prev && typeof prev === 'object' ? prev : {};
                  const key = String(safePage);
                  const current = base[key] && typeof base[key] === 'object' ? base[key] : {};
                  const next = {
                      ...base,
                      [key]: {
                          ...current,
                          drawing: patch && typeof patch.drawing === 'string' ? patch.drawing : (typeof current.drawing === 'string' ? current.drawing : ''),
                          typed: patch && typeof patch.typed === 'string' ? patch.typed : (typeof current.typed === 'string' ? current.typed : ''),
                          updatedAt: new Date().toISOString()
                      }
                  };
                  try { localStorage.setItem(MULLER_PDF_NOTES_STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          }, []);
          const clearPdfStudyDoc = useCallback(() => {
              setPdfStudyFullscreen(false);
              setPdfStudyDoc(null);
              setPdfStudyPageIdx(0);
              setPdfStudyErr('');
              setPdfStudyBusyMsg('PDF eliminado del panel.');
              setPdfStudyLastApplied('');
              setPdfStudyNotesByPage({});
              try { localStorage.removeItem(MULLER_PDF_STUDY_STORAGE_KEY); } catch (e) {}
              try { localStorage.removeItem(MULLER_PDF_NOTES_STORAGE_KEY); } catch (e) {}
              try {
                  setPdfStudyBlobUrl((prev) => {
                      if (prev) {
                          try { URL.revokeObjectURL(prev); } catch (e) {}
                      }
                      return '';
                  });
              } catch (e) {}
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
          }, []);

          const saveCurrentPdfStudyDoc = useCallback(() => {
              if (!pdfStudyDoc) return;
              const pagesCount = Array.isArray(pdfStudyDoc.pages) ? pdfStudyDoc.pages.length : 0;
              const entry = {
                  id: pdfStudyDoc.id || `pdf-${Date.now()}`,
                  name: pdfStudyDoc.name || 'Libro PDF',
                  importedAt: pdfStudyDoc.importedAt || new Date().toISOString(),
                  totalPages: pdfStudyDoc.totalPages || pagesCount,
                  updatedAt: new Date().toISOString(),
                  doc: pdfStudyDoc
              };
              setPdfStudySavedDocs((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  const withoutSame = arr.filter((x) => String(x.id || '') !== String(entry.id));
                  const next = [entry, ...withoutSame].slice(0, 20);
                  try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
              setPdfStudyBusyMsg(`PDF guardado en biblioteca: ${entry.name}.`);
          }, [pdfStudyDoc]);

          const loadPdfStudyFromLibrary = useCallback((libraryId) => {
              const arr = Array.isArray(pdfStudySavedDocs) ? pdfStudySavedDocs : [];
              const hit = arr.find((x) => String(x.id || '') === String(libraryId));
              if (!hit || !hit.doc) return;
              setPdfStudyDoc(hit.doc);
              setPdfStudyPageIdx(0);
              setPdfStudyErr('');
              setPdfStudyLastApplied('');
              setPdfStudyBusyMsg(`PDF cargado desde biblioteca: ${hit.name || 'Libro PDF'}.`);
              pdfStudyBufferRef.current = null;
              pdfStudyDocHandleRef.current = null;
              try { localStorage.setItem(MULLER_PDF_STUDY_STORAGE_KEY, JSON.stringify(hit.doc)); } catch (e) {}
          }, [pdfStudySavedDocs]);

          const removePdfStudyFromLibrary = useCallback((libraryId) => {
              const id = String(libraryId || '');
              if (!id) return;
              setPdfStudySavedDocs((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  const next = arr.filter((x) => String((x && x.id) || '') !== id);
                  try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
              setPdfStudyBusyMsg('PDF eliminado de la biblioteca.');
          }, []);

          const clearPdfStudyLibrary = useCallback(() => {
              setPdfStudySavedDocs([]);
              try { localStorage.setItem(MULLER_PDF_STUDY_LIBRARY_KEY, JSON.stringify([])); } catch (e) {}
              setPdfStudyBusyMsg('Biblioteca PDF vaciada.');
          }, []);

          const openPdfStudyFullscreen = useCallback((pageNumber) => {
              if (!pdfStudyDoc) return;
              const idx = Math.max(0, (Number(pageNumber) || 1) - 1);
              setPdfStudyPageIdx(idx);
              setPdfStudyInkNonce(0);
              setPdfStudyFullscreen(true);
          }, [pdfStudyDoc]);
          const closePdfStudyFullscreen = useCallback(() => {
              setPdfStudyFullscreen(false);
          }, []);
          const startRutaListen = async () => {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert('Para leer en voz alta usa Chrome o Edge en escritorio.'); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) { setRutaSpeakErr('No hay permiso de micrófono. Puedes continuar sin grabar.'); return; }
              try { if (rutaRecRef.current) rutaRecRef.current.stop(); } catch (e) {}
              const rec = new SpeechRecognition();
              rec.lang = 'de-DE';
              rec.interimResults = false;
              rec.maxAlternatives = 1;
              rec.onresult = (e) => {
                  const t = (e.results[0] && e.results[0][0] && e.results[0][0].transcript) ? e.results[0][0].transcript : '';
                  setRutaTranscript(collapseStutterRepeats(t));
                  setRutaListening(false);
              };
              rec.onerror = () => { setRutaListening(false); };
              rec.onend = () => { setRutaListening(false); };
              rutaRecRef.current = rec;
              setRutaListening(true);
              setRutaTranscript('');
              setRutaSpeakErr('');
              rec.start();
          };

          const readingScriptOptions = useMemo(() => {
              return (savedScripts || []).map((s) => ({ id: String(s.id), title: s.title || 'Sin título' }));
          }, [savedScripts]);

          const readingTargetText = useMemo(() => {
              if (readingSource === 'paste') return String(readingTextInput || '').trim();
              if (readingSource === 'current_story') {
                  return (guionData || []).map((s) => String(s && s.text ? s.text : '').trim()).filter(Boolean).join(' ');
              }
              if (readingSource === 'one_saved') {
                  const picked = (savedScripts || []).find((s) => String(s.id) === String(readingScriptId));
                  if (!picked) return '';
                  try {
                      const rows = JSON.parse(picked.data || '[]');
                      return (rows || []).map((s) => String(s && s.text ? s.text : '').trim()).filter(Boolean).join(' ');
                  } catch (e) { return ''; }
              }
              return '';
          }, [readingSource, readingTextInput, guionData, savedScripts, readingScriptId]);

          const readingProgress = useMemo(() => {
              const targetWords = normalizeGermanSpeechText(readingTargetText || '').split(/\s+/).filter(Boolean);
              const spokenWords = normalizeGermanSpeechText(readingTranscript || '').split(/\s+/).filter(Boolean);
              if (!targetWords.length) return { matched: 0, total: 0, pct: 0 };
              let i = 0;
              while (i < targetWords.length && i < spokenWords.length && targetWords[i] === spokenWords[i]) i++;
              const pct = Math.round((i / targetWords.length) * 100);
              return { matched: i, total: targetWords.length, pct };
          }, [readingTargetText, readingTranscript]);

          const readingWordTokens = useMemo(() => mullerReadingTokenizeText(readingTargetText), [readingTargetText]);
          const readingVerbLookup = useMemo(() => {
              const map = new Map();
              (rutaVerbDb && Array.isArray(rutaVerbDb.verbs) ? rutaVerbDb.verbs : []).forEach((verb) => {
                  if (!verb) return;
                  const lemmaKey = mullerNormalizeGermanWordToken(verb.lemma || verb.id || '');
                  if (lemmaKey && !map.has(lemmaKey)) map.set(lemmaKey, verb);
                  const forms = verb.forms || {};
                  Object.keys(forms).forEach((tenseKey) => {
                      const tense = forms[tenseKey];
                      if (!tense || typeof tense !== 'object') return;
                      Object.values(tense).forEach((v) => {
                          const w = mullerNormalizeGermanWordToken(v);
                          if (w && !map.has(w)) map.set(w, verb);
                      });
                  });
                  const p2 = mullerNormalizeGermanWordToken(verb.partizip2 || '');
                  if (p2 && !map.has(p2)) map.set(p2, verb);
              });
              return map;
          }, [rutaVerbDb]);
          const readingSelectedWord = readingWordInfo ? String(readingWordInfo.word || '') : '';
          const readingVerbInfo = useMemo(() => {
              const key = mullerNormalizeGermanWordToken(readingSelectedWord);
              if (!key) return null;
              const hit = readingVerbLookup.get(key) || null;
              if (hit) {
                  const forms = (hit && hit.forms) || {};
                  const pr = forms.praeteritum && (forms.praeteritum.ich || forms.praeteritum.er_sie_es || forms.praeteritum.wir || forms.praeteritum.sie_Sie || forms.praeteritum.du);
                  const pf = forms.perfekt && (forms.perfekt.ich || forms.perfekt.er_sie_es || forms.perfekt.wir || forms.perfekt.sie_Sie || forms.perfekt.du);
                  return {
                      infinitive: hit.lemma || hit.id || key,
                      translation: hit.es || '',
                      praeteritum: pr || '',
                      perfekt: pf || '',
                      level: hit.level || '',
                      source: 'db'
                  };
              }
              const fallback = resolveTempusVerbInfo(key);
              if (!fallback) return null;
              return {
                  infinitive: fallback.infinitive || key,
                  translation: '',
                  praeteritum: '',
                  perfekt: '',
                  formsHint: fallback.forms || '',
                  source: 'fallback'
              };
          }, [readingSelectedWord, readingVerbLookup]);
          const runReadingWordLookup = useCallback(async (rawWord) => {
              const cleanWord = mullerNormalizeGermanWordToken(rawWord);
              if (!cleanWord) return;
              setReadingWordInfo({ word: cleanWord, loading: true, translation: '', error: '', ts: Date.now() });
              try {
                  const r = await mullerTranslateGtxFull(cleanWord, 'de', 'es');
                  const out = String((r && r.text) || '').trim();
                  if (out) {
                      setReadingWordInfo((prev) => {
                          if (!prev || prev.word !== cleanWord) return prev;
                          return { ...prev, loading: false, translation: out, error: '' };
                      });
                      return;
                  }
              } catch (e) {}
              try {
                  const mm = await mullerTranslateViaMyMemory(cleanWord, 'de|es');
                  setReadingWordInfo((prev) => {
                      if (!prev || prev.word !== cleanWord) return prev;
                      return { ...prev, loading: false, translation: String(mm || '').trim(), error: '' };
                  });
              } catch (e2) {
                  setReadingWordInfo((prev) => {
                      if (!prev || prev.word !== cleanWord) return prev;
                      return { ...prev, loading: false, translation: '', error: 'No se pudo traducir ahora mismo.' };
                  });
              }
          }, []);
          const readingSentences = useMemo(() => {
              const chunks = String(readingTargetText || '').match(/[^.!?…\n]+[.!?…]?/g) || [];
              return chunks.map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
          }, [readingTargetText]);
          const readingCaptureCurrentSelection = useCallback(() => {
              try {
                  if (typeof window === 'undefined' || typeof window.getSelection !== 'function') return;
                  const host = readingTextSurfaceRef.current;
                  if (!host) return;
                  const sel = window.getSelection();
                  if (!sel || sel.rangeCount === 0) return;
                  const anchorNode = sel.anchorNode;
                  const focusNode = sel.focusNode;
                  if ((anchorNode && !host.contains(anchorNode)) || (focusNode && !host.contains(focusNode))) return;
                  const raw = String(sel.toString() || '');
                  const text = raw.replace(/\s+/g, ' ').trim();
                  if (!text || text.length < 2) return;
                  setReadingSelectedSnippet(text);
              } catch (e) {}
          }, []);
          const readingSpeakText = useCallback((rawText, opts = {}) => {
              const text = String(rawText || '').replace(/\s+/g, ' ').trim();
              if (!text) return false;
              const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
              if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
                  if (window.__mullerToast) window.__mullerToast('Tu navegador no soporta reproducción de voz.', 'error');
                  return false;
              }
              const defaultRate = Number(opts.rate);
              const fallbackRate = Number.isFinite(defaultRate) ? defaultRate : 0.92;
              let finalRate = fallbackRate;
              try {
                  const storedRate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || String(fallbackRate));
                  if (Number.isFinite(storedRate) && storedRate >= 0.5 && storedRate <= 1.5) finalRate = storedRate;
              } catch (e) {}
              try {
                  setReadingWordAudioBusy(true);
                  synth.cancel();
                  const utter = new SpeechSynthesisUtterance(text);
                  utter.lang = 'de-DE';
                  utter.rate = finalRate;
                  if (typeof window.__mullerApplyPreferredDeVoice === 'function') window.__mullerApplyPreferredDeVoice(utter);
                  utter.onend = () => setReadingWordAudioBusy(false);
                  utter.onerror = () => setReadingWordAudioBusy(false);
                  synth.speak(utter);
                  return true;
              } catch (e) {
                  setReadingWordAudioBusy(false);
                  if (window.__mullerToast) window.__mullerToast('No se pudo reproducir el audio ahora.', 'error');
                  return false;
              }
          }, []);
          const speakReadingWord = useCallback((rawWord) => {
              const cleanWord = mullerNormalizeGermanWordToken(rawWord);
              if (!cleanWord) return;
              readingSpeakText(cleanWord, { rate: 0.9 });
          }, [readingSpeakText]);
          const speakReadingSentenceWithWord = useCallback((rawWord) => {
              const pickedSnippet = String(readingSelectedSnippet || '').replace(/\s+/g, ' ').trim();
              if (pickedSnippet) {
                  readingSpeakText(pickedSnippet, { rate: 0.92 });
                  return;
              }
              const cleanWord = mullerNormalizeGermanWordToken(rawWord);
              if (!cleanWord) {
                  if (window.__mullerToast) window.__mullerToast('Selecciona una palabra o una frase.', 'info');
                  return;
              }
              const sentence = readingSentences.find((s) => {
                  const tokens = mullerReadingTokenizeText(s);
                  return tokens.some((t) => t.word === cleanWord);
              });
              if (sentence) {
                  readingSpeakText(sentence, { rate: 0.92 });
                  return;
              }
              readingSpeakText(cleanWord, { rate: 0.92 });
          }, [readingSelectedSnippet, readingSentences, readingSpeakText]);
          useEffect(() => {
              try { localStorage.setItem(MULLER_READING_FONT_STORAGE, String(readingFontPx)); } catch (e) {}
          }, [readingFontPx]);
          useEffect(() => {
              setReadingSelectedSnippet('');
          }, [readingTargetText]);
          useEffect(() => {
              if (activeTab !== 'lectura') return undefined;
              const onSelection = () => readingCaptureCurrentSelection();
              document.addEventListener('selectionchange', onSelection);
              return () => document.removeEventListener('selectionchange', onSelection);
          }, [activeTab, readingCaptureCurrentSelection]);

          const readingTipForWord = (w) => {
              const x = String(w || '').toLowerCase();
              if (/[äöü]/.test(x)) return 'Atención a umlauts: ä (tipo e abierta), ö (o redondeada), ü (i con labios redondos).';
              if (x.includes('sch')) return 'sch suena como "sh".';
              if (x.includes('ch')) return 'ch no suena como "ch" español; en alemán suele ser más suave/gutural.';
              if (x.includes('ei')) return 'ei suena parecido a "ai".';
              if (x.includes('ie')) return 'ie suena como i larga.';
              if (x.includes('eu') || x.includes('äu')) return 'eu/äu suena parecido a "oi".';
              if (x.includes('z')) return 'z suena como "ts".';
              if (x.includes('v')) return 'En alemán muchas veces v suena como "f".';
              return 'Repite lento por sílabas, luego a velocidad normal.';
          };

          const runReadingCompare = (targetText, transcript) => {
              const a = normalizeGermanSpeechText(targetText || '');
              const b = normalizeGermanSpeechText(transcript || '');
              if (!a || !b) { setReadingScore(null); setReadingFeedback([]); return; }
              const aw = a.split(/\s+/).filter(Boolean);
              const bw = b.split(/\s+/).filter(Boolean);
              const feedback = matchGermanWordsSequential(aw, bw);
              const ok = feedback.filter((f) => f.correct).length;
              const pct = aw.length ? Math.round((ok / aw.length) * 100) : 0;
              const enriched = feedback.filter((f) => !f.correct).slice(0, 18).map((f) => ({ ...f, tip: readingTipForWord(f.word) }));
              setReadingScore(pct);
              setReadingFeedback(enriched);
          };
          const finalizeReadingSession = useCallback(() => {
              const finalText = collapseStutterRepeats((readingFinalRef.current || readingLiveTranscriptRef.current || '').trim());
              setReadingTranscript(finalText);
              runReadingCompare(readingTargetText, finalText);
          }, [readingTargetText]);

          const startReadingListen = async () => {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert('Para lectura en voz alta usa Chrome o Edge.'); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) return;
              try { if (readingRecRef.current) readingRecRef.current.stop(); } catch (e) {}
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              readingStopRequestedRef.current = false;
              readingAutoRestartRef.current = true;
              const sessionId = Date.now();
              readingSessionIdRef.current = sessionId;
              readingFinalRef.current = '';
              readingLiveTranscriptRef.current = '';
              setReadingTranscript('');
              setReadingScore(null);
              setReadingFeedback([]);

              const startCycle = () => {
                  if (readingSessionIdRef.current !== sessionId) return;
                  if (readingStopRequestedRef.current || !readingAutoRestartRef.current) return;
                  const rec = new SpeechRecognition();
                  rec.lang = 'de-DE';
                  rec.continuous = true;
                  rec.interimResults = true;
                  rec.maxAlternatives = 1;
                  rec.onresult = (event) => {
                      if (readingSessionIdRef.current !== sessionId) return;
                      let interim = '';
                      for (let i = event.resultIndex; i < event.results.length; i++) {
                          const r = event.results[i];
                          const t = (r[0] && r[0].transcript) ? String(r[0].transcript).trim() : '';
                          if (!t) continue;
                          if (r.isFinal) readingFinalRef.current = mergeSpeechFinalChunk(readingFinalRef.current, t);
                          else interim = t;
                      }
                      const merged = collapseStutterRepeats((readingFinalRef.current + (interim ? (' ' + interim) : '')).trim());
                      readingLiveTranscriptRef.current = merged;
                      setReadingTranscript(merged);
                  };
                  rec.onerror = (evt) => {
                      if (readingSessionIdRef.current !== sessionId) return;
                      const errType = evt && evt.error ? String(evt.error) : '';
                      if (errType === 'not-allowed' || errType === 'service-not-allowed') {
                          readingStopRequestedRef.current = true;
                          readingAutoRestartRef.current = false;
                          setReadingListening(false);
                          if (window.__mullerToast) window.__mullerToast('Permiso de micrófono no disponible.', 'error');
                      }
                  };
                  rec.onend = () => {
                      if (readingSessionIdRef.current !== sessionId) return;
                      if (readingRecRef.current === rec) readingRecRef.current = null;
                      if (readingStopRequestedRef.current || !readingAutoRestartRef.current) {
                          setReadingListening(false);
                          finalizeReadingSession();
                          return;
                      }
                      readingRestartTimerRef.current = window.setTimeout(() => {
                          startCycle();
                      }, 120);
                  };
                  readingRecRef.current = rec;
                  setReadingListening(true);
                  try {
                      rec.start();
                  } catch (e) {
                      readingRestartTimerRef.current = window.setTimeout(() => {
                          startCycle();
                      }, 260);
                  }
              };
