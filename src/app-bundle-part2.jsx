              startCycle();
          };

          const stopReadingListen = () => {
              readingStopRequestedRef.current = true;
              readingAutoRestartRef.current = false;
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              const r = readingRecRef.current;
              if (!r) {
                  setReadingListening(false);
                  finalizeReadingSession();
                  return;
              }
              try { r.stop(); } catch (e) {
                  setReadingListening(false);
                  finalizeReadingSession();
              }
          };
          useEffect(() => {
              if (activeTab === 'lectura') return;
              readingSessionIdRef.current = Date.now();
              readingStopRequestedRef.current = true;
              readingAutoRestartRef.current = false;
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              try { if (readingRecRef.current) readingRecRef.current.stop(); } catch (e) {}
              setReadingListening(false);
          }, [activeTab]);
          useEffect(() => {
              // Evita que una grabación de una pestaña siga viva al cambiar a otra.
              try { if (recognitionRef.current) recognitionRef.current.stop(); } catch (e) {}
              try { if (rutaRecRef.current) rutaRecRef.current.stop(); } catch (e) {}
              try { if (readingRecRef.current) readingRecRef.current.stop(); } catch (e) {}
              readingSessionIdRef.current = Date.now();
              readingStopRequestedRef.current = true;
              readingAutoRestartRef.current = false;
              if (readingRestartTimerRef.current) {
                  window.clearTimeout(readingRestartTimerRef.current);
                  readingRestartTimerRef.current = null;
              }
              setIsListening(false);
              setRutaListening(false);
              setReadingListening(false);
          }, [activeTab]);
          useEffect(() => {
              return () => {
                  if (readingRestartTimerRef.current) {
                      window.clearTimeout(readingRestartTimerRef.current);
                      readingRestartTimerRef.current = null;
                  }
              };
          }, []);

          const getWeeklyChartBars = () => {
              const raw = [];
              for (let i = 6; i >= 0; i--) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const key = d.toISOString().slice(0, 10);
                  raw.push((userStats.activityByDay && userStats.activityByDay[key]) || 0);
              }
              const maxVal = Math.max(...raw, 1);
              const normalized = raw.map((h) => Math.max(5, Math.round((h / maxVal) * 100)));
              const hasReal = raw.some((x) => x > 0);
              if (!hasReal && userStats.activityLog && userStats.activityLog.length >= 7) {
                  return userStats.activityLog.slice(-7).map((v) => Math.max(5, Math.min(100, v)));
              }
              return normalized;
          };

          useEffect(() => {
              if (activeTab !== 'progreso') return;
              const refreshMuller = () => {
                  try {
                      if (typeof getAdvancedDashboard === 'function') setMullerProgresoSnapshot(getAdvancedDashboard());
                  } catch (e) { setMullerProgresoSnapshot(null); }
              };
              refreshMuller();
              window.addEventListener('advancedProgressUpdated', refreshMuller);
              return () => window.removeEventListener('advancedProgressUpdated', refreshMuller);
          }, [activeTab]);

          useEffect(() => {
              if (activeTab !== 'vocabulario') {
                  const allVocab = [];
                  guionData.forEach(scene => { if (scene.vocab) scene.vocab.forEach(v => { if (!allVocab.some(existing => existing.de === v.de)) allVocab.push(v); }); });
                  setCurrentVocabList(mullerSortVocabBySrs(allVocab, mullerGetVocabSrsMap())); setVocabReviewIndex(0); setShowVocabTranslation(false);
              }
          }, [guionData, activeTab]);

          useEffect(() => {
              let cancelled = false;
              fetch('./b1-b2-database.json', { cache: 'no-cache' })
                  .then((r) => { if (!r.ok) throw new Error('bx'); return r.json(); })
                  .then((data) => {
                      if (cancelled) return;
                      const n = normalizeBxPayload(data);
                      setBxRemoteDatabases(n);
                      try { sessionStorage.setItem('muller_b1b2_json_v1', JSON.stringify(data)); } catch (e) {}
                  })
                  .catch(() => {
                      if (cancelled) return;
                      setBxRemoteDatabases((prev) => prev || BX_DB_FALLBACK);
                  });
              return () => { cancelled = true; };
          }, []);

          useEffect(() => {
              const pack = bxEffectiveDatabases;
              const dbToUse = bxBankLevel === 'b1' ? pack.b1 : pack.b2;
              let newList;
              if (bxCategory === 'mix') {
                  newList = [];
                  Object.values(dbToUse).forEach((arr) => { newList = newList.concat(arr); });
                  newList.sort(() => Math.random() - 0.5);
              } else {
                  newList = dbToUse[bxCategory] || [];
              }
              setBxCurrentList(newList);
              const catTabChanged = !bxCatTabRef.current || bxCatTabRef.current.c !== bxCategory || bxCatTabRef.current.t !== activeTab;
              bxCatTabRef.current = { c: bxCategory, t: activeTab };
              if (catTabChanged) setBxIndex(0);
              else setBxIndex((i) => (newList.length === 0 ? 0 : Math.min(i, newList.length - 1)));
          }, [bxCategory, activeTab, bxEffectiveDatabases]);

          useEffect(() => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              const src = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!src) return;
              const others = Object.keys(BX_DB_EMPTY).filter((c) => c !== src);
              setBxMoveTargetCat((prev) => (others.includes(prev) ? prev : others[0] || 'vocabulario'));
          }, [bxIndex, bxCategory, bxCurrentList, bxUserOverlay, activeTab]);

          useEffect(() => {
            const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
            if (!synth) return undefined;
            const handleVoicesChanged = () => setVoicesLoaded(true);
            try {
                if (typeof synth.getVoices === 'function' && synth.getVoices().length > 0) setVoicesLoaded(true);
            } catch (e) {}
            if (typeof synth.addEventListener === 'function') {
                synth.addEventListener('voiceschanged', handleVoicesChanged);
                return () => {
                    try { synth.removeEventListener('voiceschanged', handleVoicesChanged); } catch (e) {}
                };
            }
            const previous = synth.onvoiceschanged;
            synth.onvoiceschanged = handleVoicesChanged;
            return () => {
                try {
                    if (synth.onvoiceschanged === handleVoicesChanged) synth.onvoiceschanged = previous || null;
                } catch (e) {}
            };
          }, []);

          const updateTempusVerbList = (text) => {
              if (!tempusMode || !text) { setTempusVerbList([]); return; }
              const words = text.split(/\s+/);
              const foundVerbs = [];
              const processed = new Set();
              words.forEach(word => {
                  const cleanWord = word.toLowerCase().replace(/[.,!?;:()]/g, '');
                  if (TEMPUS_DICT[cleanWord]) {
                      if (!processed.has(cleanWord)) { foundVerbs.push({ infinitive: cleanWord, forms: TEMPUS_DICT[cleanWord] }); processed.add(cleanWord); }
                  } else if (cleanWord.match(/^(?:[a-zäöüß]+)(?:en|eln|ern)$/i) && cleanWord.length > 3) {
                      const infinitive = cleanWord;
                      if (!processed.has(infinitive)) {
                          const base = infinitive.slice(0, -2);
                          const praet = base + 'te';
                          const perf = 'hat ' + infinitive;
                          foundVerbs.push({ infinitive, forms: `Prät: ${praet} | Perf: ${perf} (regular estimado)` });
                          processed.add(infinitive);
                      }
                  }
              });
              setTempusVerbList(foundVerbs);
          };

          function resolveTempusVerbInfo(rawWord) {
              const clean = String(rawWord || '').toLowerCase().replace(/[.,!?;:()"]/g, '').trim();
              if (!clean) return null;
              if (TEMPUS_DICT[clean]) {
                  const forms = TEMPUS_DICT[clean];
                  const isInf = /(?:en|eln|ern)$/.test(clean);
                  let infinitive = clean;
                  if (!isInf) {
                      const alt = Object.keys(TEMPUS_DICT).find((k) => TEMPUS_DICT[k] === forms && /(?:en|eln|ern)$/.test(k));
                      if (alt) infinitive = alt;
                  }
                  return { touched: clean, infinitive, forms };
              }
              if (/(?:en|eln|ern)$/.test(clean) && clean.length > 3) {
                  const base = clean.slice(0, -2);
                  return { touched: clean, infinitive: clean, forms: `Prät: ${base}te | Perf: hat ${clean} (regular estimado)` };
              }
              return null;
          }

          function inferTempusContextLabel(word) {
              const w = String(word || '').toLowerCase();
              if (!w) return '';
              if (w.startsWith('ge') && (w.endsWith('t') || w.endsWith('en'))) return 'Forma probable: Partizip II (Perfekt/Plusquamperfekt).';
              if (/(te|test|ten|tet)$/.test(w)) return 'Forma probable: Präteritum (regular).';
              if (/(st|t|en)$/.test(w)) return 'Forma probable: Präsens (según contexto/persona).';
              return 'Tiempo/persona: revisa contexto de la frase.';
          }

          useEffect(() => {
              const actualIdx = getActualSceneIndex();
              const currentScene = guionData[actualIdx];
              if (currentScene && tempusMode) updateTempusVerbList(currentScene.text);
              else setTempusVerbList([]);
          }, [sceneIndex, isReviewing, tempusMode, guionData]);
          useEffect(() => {
              if (!tempusMode) setTempusSelectedVerb(null);
          }, [tempusMode, sceneIndex, isReviewing]);

          const getVoice = (lang, gender, isOlder = false) => {
            const allVoices = window.speechSynthesis.getVoices();
            if (lang === 'de' && window.__mullerResolveVoice) {
                const pref = window.__mullerResolveVoice('muller_tts_de');
                if (pref) return pref;
            }
            if (lang === 'es' && window.__mullerResolveVoice) {
                const pref = window.__mullerResolveVoice('muller_tts_es');
                if (pref) return pref;
            }
            const langVoices = allVoices.filter(v => v.lang.startsWith(lang));
            if (langVoices.length === 0) return allVoices[0]; 
            const femaleVoices = langVoices.filter(v => /female|woman|Katja|Marlene|Vicki/i.test(v.name));
            const maleVoices = langVoices.filter(v => /male|man|Stefan|Conrad|Klaus/i.test(v.name));
            if (gender === 'female') return femaleVoices.length > 0 ? femaleVoices[0] : langVoices[0];
            if (gender === 'male') {
                if (isOlder && maleVoices.length > 1) return maleVoices[1];
                if (maleVoices.length > 0) return maleVoices[0];
                return langVoices[langVoices.length - 1]; 
            }
            return langVoices[0];
          };

          const speakRutaDe = (text) => {
              if (!text) return;
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(text);
              u.lang = 'de-DE';
              if (typeof window.__mullerApplyPreferredDeVoice === 'function') window.__mullerApplyPreferredDeVoice(u);
              else {
                  u.voice = rutaMentor === 'tom' ? getVoice('de', 'male') : getVoice('de', 'female');
              }
              if (rutaMentor === 'lena') { u.pitch = 1.12; u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92; }
              else if (rutaMentor === 'tom') { u.pitch = 0.88; u.rate = 0.9; }
              else { u.pitch = 1.32; u.rate = 0.96; }
              window.speechSynthesis.speak(u);
          };

          const stopAudio = () => { 
              window.speechSynthesis.cancel(); 
              if (timeoutRef.current) clearTimeout(timeoutRef.current); 
              setIsPlaying(false); 
              stopNoise(); // Detener ruido si está activo
          };

          // Funciones para ruido de fondo
          const startNoise = () => {
              if (!noiseEnabled) return;
              try {
                  const AudioContext = window.AudioContext || window.webkitAudioContext;
                  const ctx = new AudioContext();
                  noiseContextRef.current = ctx;
                  const bufferSize = 4096;
                  const noiseNode = ctx.createScriptProcessor(bufferSize, 1, 1);
                  noiseNode.onaudioprocess = (e) => {
                      const output = e.outputBuffer.getChannelData(0);
                      for (let i = 0; i < bufferSize; i++) {
                          output[i] = (Math.random() * 2 - 1) * 0.15; // Ruido blanco a bajo volumen
                      }
                  };
                  const gainNode = ctx.createGain();
                  gainNode.gain.value = 0.08; // Volumen muy bajo
                  noiseGainRef.current = gainNode;
                  noiseNode.connect(gainNode);
                  gainNode.connect(ctx.destination);
                  noiseSourceRef.current = noiseNode;
              } catch(e) { console.warn("No se pudo iniciar ruido de fondo:", e); }
          };

          const stopNoise = () => {
              if (noiseSourceRef.current) {
                  noiseSourceRef.current.disconnect();
                  noiseSourceRef.current = null;
              }
              if (noiseContextRef.current) {
                  noiseContextRef.current.close();
                  noiseContextRef.current = null;
              }
          };

          useEffect(() => {
              if (noiseEnabled && isPlaying) startNoise();
              else stopNoise();
              return () => stopNoise();
          }, [noiseEnabled, isPlaying]);

          const resetModes = () => { 
              setDiktatInput(""); setShowDiktatResult(false); 
              setSpokenText(""); setPronunciationScore(null); setGrammarPolizeiMsg(""); setPronunciationFeedback([]);
              setShowPuzzleResult(false); setPuzzleLastOk(null); setShowCurrentTranslation(false); 
              initPuzzle(guionData[getActualSceneIndex()]?.text || ""); 
          };
          
          const getActualSceneIndex = () => isReviewing ? userStats.failedDiktatScenes[reviewIndexPointer] : sceneIndex;

          const getNextPlaylistScript = () => {
              if (!savedScripts || savedScripts.length === 0) return null;
              if (isDefaultScript) return savedScripts[0];
              const i = savedScripts.findIndex((s) => String(s.id) === String(activeSavedScriptId));
              if (i < 0) return savedScripts[0];
              if (i + 1 < savedScripts.length) return savedScripts[i + 1];
              return null;
          };

          const proceedToNextStage = () => {
              if (isReviewing) {
                  if (reviewIndexPointer < userStats.failedDiktatScenes.length - 1) { setReviewIndexPointer(p => p + 1); setMode('dialogue'); resetModes(); } 
                  else { saveProgress({ failedDiktatScenes: [] }); setIsReviewing(false); stopAudio(); }
              } else {
                  if (sceneIndex < guionData.length - 1) { setSceneIndex(s => s + 1); setMode('dialogue'); resetModes(); } 
                  else {
                      if (historiaPlaylistAllScripts && !isReviewing) {
                          const nextScr = getNextPlaylistScript();
                          if (nextScr) {
                              loadSavedScript(nextScr);
                              return;
                          }
                      }
                      if (userStats.failedDiktatScenes.length > 0) {
                          alert("¡Historia terminada! Tienes fallos pendientes en Diktat. Iniciando Repaso.");
                          setIsReviewing(true); setReviewIndexPointer(0); setMode('dialogue'); resetModes();
                      } else {
                          stopAudio();
                          if (historiaPlaylistAllScripts && savedScripts.length > 0) {
                              alert('¡Has escuchado todos los guiones guardados en secuencia!');
                          } else {
                              alert("¡Has completado el guion!");
                          }
                      }
                  }
              }
          };

          const handleNext = () => { stopAudio(); proceedToNextStage(); };
          const handlePrev = () => { stopAudio(); if (!isReviewing && sceneIndex > 0) { setSceneIndex(s => s - 1); setMode('dialogue'); resetModes(); } };
          const togglePlay = () => { 
              if (userStats.hearts <= 0) { setShowDeathModal(true); return; }
              if (isPlaying) stopAudio(); else setIsPlaying(true); 
          };

          const initPuzzle = (text) => {
              if (!text) return;
              const words = text.split(/\s+/).map((w, i) => ({ id: i, text: w }));
              setPuzzleWords(words.sort(() => Math.random() - 0.5)); setPuzzleAnswer([]);
          };

          useEffect(() => { if (puzzleMode && activeTab === 'historia') initPuzzle(guionData[getActualSceneIndex()]?.text); }, [sceneIndex, isReviewing, puzzleMode, guionData, activeTab]);

          const handleSaveCustomVocab = () => {
              if (!vocabTitleInput.trim()) { alert("Por favor, dale un título a la lección."); return; }
              if (!vocabTextInput.trim()) { alert("Por favor, pega el vocabulario."); return; }
              const lines = vocabTextInput.split(/\r?\n/);
              let parsedWords = [];
              const cleanStr = (str) => {
                  let s = str.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, ''); 
                  s = s.replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, ''); 
                  return s.trim();
              };
              lines.forEach(line => {
                  let text = line.trim().replace(/–/g, '-').replace(/—/g, '-');
                  if (!text) return;
                  let isDiff = false;
                  if (text.startsWith('1')) { isDiff = true; text = text.replace(/^1[.\-):\]]*\s*/, '').trim(); }
                  text = text.replace(/^[-*•+>]\s*/, '').trim();
                  text = text.replace(/^\d+[.\-):\]]+\s*/, '').trim();
                  let de = ""; let es = "";
                  const match = text.match(/(\s+-\s+|\s+=\s+|\t|\s{2,}|={1,})/);
                  if (match) {
                      const sepIndex = text.indexOf(match[0]);
                      de = cleanStr(text.substring(0, sepIndex));
                      es = cleanStr(text.substring(sepIndex + match[0].length));
                  } else {
                      const hyphenMatch = text.match(/(^|\s)-(?!\w)|(?<!\w)-(\s|$)/);
                      if (hyphenMatch) {
                          const sepIndex = text.indexOf(hyphenMatch[0]);
                          de = cleanStr(text.substring(0, sepIndex));
                          es = cleanStr(text.substring(sepIndex + hyphenMatch[0].length));
                      } else {
                          let words = text.split(' ');
                          let splitPoint = 1;
                          if (words.length > 2 && /^(sich|der|die|das|ein|eine)$/i.test(words[0])) splitPoint = 2;
                          if (words.length > splitPoint && words[splitPoint].startsWith('(')) splitPoint++;
                          de = cleanStr(words.slice(0, splitPoint).join(' '));
                          es = cleanStr(words.slice(splitPoint).join(' '));
                          if (!es) es = "???";
                      }
                  }
                  de = de.replace(/^1[.\-):\]]*\s*/, '').trim();
                  es = es.replace(/^1[.\-):\]]*\s*/, '').trim();
                  if (de) parsedWords.push({ de, es, diff: isDiff ? 1 : 0 });
              });
              if (parsedWords.length > 0) {
                  const newLesson = { id: Date.now().toString() + Math.random().toString(36).substring(7), title: vocabTitleInput, words: parsedWords };
                  const updatedLessons = [...customVocabLessons, newLesson];
                  setCustomVocabLessons(updatedLessons);
                  localStorage.setItem('mullerCustomVocab', JSON.stringify(updatedLessons));
                  setVocabTitleInput(""); setVocabTextInput("");
                  alert(`¡Genial! Se ha guardado la lección "${vocabTitleInput}" con ${parsedWords.length} palabras.`);
              } else { alert("No pude detectar vocabulario válido. Pega texto para guardar."); }
          };

  const handleSaveScript = () => {
    if (!newScriptTitle.trim()) { alert("Dale un título al guion primero."); return; }
    try {
        const lines = scriptInput.split('\n');
        const newGuion = [];
        lines.forEach(line => {
            let cleanLine = line.trim();
            if (!cleanLine) return;

            // 1. Extraer Hablante (Nombre:)
            const speakerMatch = cleanLine.match(/^([^:]+):/);
            if (!speakerMatch) return;
            const speaker = speakerMatch[1].trim();
            let content = cleanLine.substring(speakerMatch[0].length).trim();

            // 2. Extraer Redemittel [R]
            let isRedemittel = false;
            if (content.includes('[R]')) {
                isRedemittel = true;
                content = content.replace('[R]', '').trim();
            }

            // 3. Extraer Vocabulario [...]
            let vocab = [];
            const vocabMatch = content.match(/\[(.*?)\]/);
            if (vocabMatch) {
                const vocabPairs = vocabMatch[1].split(',');
                vocabPairs.forEach(pair => {
                    const parts = pair.split('-');
                    if (parts.length >= 2) {
                        const cleanDe = parts[0].trim().replace(/[🔴🔵🟢•]/g, '');
                        vocab.push({ de: cleanDe, es: parts[1].trim(), diff: 1 });
                    }
                });
                content = content.replace(vocabMatch[0], '').trim();
            }

            // 4. Extraer Traducción (...)
            let translation = "Traducción no proporcionada";
            const transMatch = content.match(/\(([^)]+)\)/);
            if (transMatch) {
                translation = transMatch[1].trim();
                content = content.replace(transMatch[0], '').trim();
            }

            // 5. Alemán (limpio de círculos para el audio)
            const germanText = content.replace(/[🔴🔵🟢]/g, '').trim();

            if (germanText) {
                newGuion.push({ speaker, text: germanText, translation, isRedemittel, vocab });
            }
        });

        if (newGuion.length === 0) throw new Error("Formato no reconocido");

        const scriptObj = { id: Date.now().toString(), title: newScriptTitle, data: JSON.stringify(newGuion), timestamp: Date.now() };
        const newSaved = [...savedScripts, scriptObj].sort((a,b)=>a.title.localeCompare(b.title));
        setSavedScripts(newSaved);
        localStorage.setItem('mullerScripts', JSON.stringify(newSaved));
        try {
            if (typeof caches !== 'undefined') {
                const meta = { lastScriptTitle: newScriptTitle, lastSceneCount: newGuion.length, savedAt: new Date().toISOString() };
                caches.open('muller-offline-user-v1').then((cache) => cache.put(
                    new Request(new URL('./.muller-offline-meta.json', window.location.href).toString()),
                    new Response(JSON.stringify(meta), { headers: { 'Content-Type': 'application/json' } })
                )).catch(function () {});
            }
        } catch (e) {}
        setGuionData(newGuion); setActiveScriptTitle(newScriptTitle); setIsDefaultScript(false);
        setActiveSavedScriptId(String(scriptObj.id));
        setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false);
        setNewScriptTitle(""); setActiveTab('historia');
    } catch (e) { 
        alert("Error al procesar. Asegúrate de usar el formato: Nombre: Texto Alemán. (Traducción) [vocab-trad]"); 
    }
};

          const handleBxDistribToLevels = (target) => {
              const text = (bxImportText || '').trim() || (scriptInput || '').trim();
              if (!text) { alert('Pega texto en el cuadro de “Distribuir a B1/B2” o en el guion de arriba.'); return; }
              const flat = mullerBibliotecaFlatItems(text);
              if (flat.length === 0) { alert('No se detectaron frases. Usa formato Nombre: Alemán. (Traducción) o listas “alemán - español” por línea.'); return; }
              const z = () => ({ vocabulario: 0, verbos: 0, preposiciones: 0, conectores: 0, redemittel: 0 });
              let snap = null;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  const c1 = z();
                  const c2 = z();
                  let nuevos = 0;
                  flat.forEach(({ cat, item, seg }) => {
                      const lv = target === 'auto' ? mullerGuessBibliotecaItemLevel(item, seg) : target;
                      const trickBase = 'Biblioteca · ' + cat + (target === 'auto' ? ' · nivel estimado ' + lv.toUpperCase() : ' · heurística local (sin IA)');
                      const it = { ...item, trick: trickBase };
                      const ky = mullerBxItemKey(item);
                      const exists = (base[lv][cat] || []).some((x) => mullerBxItemKey(x) === ky);
                      if (exists) return;
                      base[lv][cat].push({
                          ...it,
                          _mullerUser: true,
                          _mullerUid: 'bx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11),
                          _mullerCategory: cat,
                          ...(activeSavedScriptId ? { _mullerSourceScriptId: String(activeSavedScriptId) } : {})
                      });
                      if (lv === 'b2') c2[cat]++; else c1[cat]++;
                      nuevos++;
                  });
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  snap = { c1, c2, nuevos, target, detectados: flat.length };
                  return base;
              });
              const sum = (c) => `vocab ${c.vocabulario}, vb. ${c.verbos}, prep. ${c.preposiciones}, conn. ${c.conectores}, R ${c.redemittel}`;
              if (snap) {
                  if (snap.target === 'auto') {
                      setBxImportSummary(`Nivel automático · B1: ${sum(snap.c1)} · B2: ${sum(snap.c2)} · nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  } else {
                      const c = snap.target === 'b2' ? snap.c2 : snap.c1;
                      setBxImportSummary(`Todo a ${snap.target.toUpperCase()}: ${sum(c)} · nuevos: ${snap.nuevos} (detectados: ${snap.detectados})`);
                  }
              }
          };

          const clearBxUserOverlay = () => {
              if (!window.confirm('Esto borra solo lo que añadiste con «Distribuir texto» (tu biblioteca local). Las tarjetas del archivo b1-b2-database.json del proyecto no se quitan: seguirán viéndose en B1/B2. ¿Borrar tus aportaciones?')) return;
              const empty = normalizeBxPayload({});
              setBxUserOverlay(empty);
              try {
                  localStorage.removeItem(MULLER_BX_USER_OVERLAY_KEY);
                  localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(empty));
              } catch (e) {}
              setBxImportSummary('');
              setBxIndex(0);
          };

          const clearBxUserLevelAllCategories = (levelKey) => {
              const lab = levelKey === 'b1' ? 'B1' : 'B2';
              if (!window.confirm(`¿Seguro? Se borrarán TODAS tus aportaciones en ${lab} (vocabulario, verbos, preposiciones, conectores y Redemittel). No se toca el archivo b1-b2-database.json.`)) return;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  Object.keys(BX_DB_EMPTY).forEach((cat) => { base[levelKey][cat] = []; });
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxIndex(0);
          };

          const clearBxUserOneCategory = (levelKey, catKey) => {
              const lab = levelKey === 'b1' ? 'B1' : 'B2';
              const name = { vocabulario: 'Vocabulario', verbos: 'Verbos', preposiciones: 'Preposiciones', conectores: 'Conectores', redemittel: 'Redemittel' }[catKey] || catKey;
              if (!window.confirm(`¿Seguro? Se borran solo tus aportaciones en «${name}» (${lab}). El resto de categorías y el JSON base no se tocan.`)) return;
              setBxUserOverlay((prev) => {
                  const base = normalizeBxPayload(prev);
                  base[levelKey][catKey] = [];
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
              setBxIndex(0);
          };

          const mullerTranslateGtxFull = async (text, sl, tl) => {
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
              const r = await fetch(url);
              if (!r.ok) throw new Error('gtx');
              const data = await r.json();
              let out = '';
              if (data && data[0]) data[0].forEach((p) => { if (p && p[0]) out += p[0]; });
              const detected = data && data[2] != null ? String(data[2]) : '';
              return { text: out.trim(), detected };
          };

          const mullerTranslateViaGtx = async (text, sl, tl) => {
              const { text: out } = await mullerTranslateGtxFull(text, sl, tl);
              return out;
          };

          const mullerTranslateViaMyMemory = async (text, pair) => {
              const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`);
              const j = await r.json();
              const st = j && j.responseStatus;
              if (!r.ok || (st != null && Number(st) !== 200 && st !== '200')) throw new Error('mm');
              return String((j.responseData && j.responseData.translatedText) || '').trim();
          };

        const mullerStoryClean = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s([,.;:!?])/g, '$1').trim();
        const mullerStorySimplifyGerman = (txt) => {
            return String(txt || '')
                .replace(/\bjedoch\b/gi, 'aber')
                .replace(/\bdennoch\b/gi, 'trotzdem')
                .replace(/\baufgrund\b/gi, 'wegen')
                .replace(/\bbeziehungsweise\b/gi, 'oder')
                .replace(/\baußerdem\b/gi, 'auch')
                .replace(/\binsbesondere\b/gi, 'vor allem')
                .replace(/\ballerdings\b/gi, 'aber')
                .replace(/\bdaher\b/gi, 'deshalb');
        };
        const mullerStoryStylizeGerman = (txt, level, tone) => {
            let out = mullerStoryClean(txt);
            if (!out) return '';
            if (tone === 'natural') out = out.replace(/\s,\s/g, ', ');
            if (tone === 'formal') {
                out = out
                    .replace(/\bich\b/g, 'Ich')
                    .replace(/\bwir\b/g, 'Wir')
                    .replace(/\bman\b/g, 'man');
            }
            if (level === 'A2') out = mullerStorySimplifyGerman(out);
            if (level === 'B1') out = mullerStorySimplifyGerman(out).replace(/\bwelche[rnms]?\b/gi, 'die');
            return out;
        };
        const mullerStorySplitScenes = (deText, esText) => {
            const deParts = String(deText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const esParts = String(esText || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
            const out = deParts.slice(0, 14).map((line, i) => ({
                speaker: i % 2 === 0 ? 'Lukas' : 'Elena',
                text: line,
                translation: esParts[i] || ''
            }));
            return out.length ? out : [{ speaker: 'Lukas', text: mullerStoryClean(deText), translation: mullerStoryClean(esText) }];
        };
        const mullerStoryGlossary = (deText) => {
            const words = String(deText || '')
                .toLowerCase()
                .replace(/[^a-zäöüß\s-]/gi, ' ')
                .split(/\s+/)
                .map((w) => w.trim())
                .filter((w) => w.length >= 6 && !/^\d+$/.test(w));
            const unique = Array.from(new Set(words)).slice(0, 10);
            return unique.map((w) => ({ de: w, es: '(revísalo en Lexikon)' }));
        };

          const mullerLexikonApplyPairsFromTranslate = (sourceText, translated, detectedLang, targetLang) => {
              const d = String(detectedLang || '').toLowerCase();
              const t = String(targetLang || '').toLowerCase();
              const outClean = String(translated || '').replace(/^\(sin resultado\)$/, '');
              const src = String(sourceText || '').trim();
              if (!outClean) return;
              if (t === 'de') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              } else if (t === 'es') {
                  if (d === 'de' || d.startsWith('de')) {
                      setLexikonPairDe(src);
                      setLexikonPairEs(outClean);
                  } else {
                      setLexikonPairEs(src);
                      setLexikonPairDe(outClean);
                  }
              }
          };

          const runLexikonDictionarySearch = async () => {
              const q = lexikonSearch.trim();
              if (!q) { alert('Escribe una palabra o inicio de palabra.'); return; }
              setLexikonDictLoading(true);
              setLexikonResults(null);
              try {
                  if (lexikonDictKind === 'tr-es-de' || lexikonDictKind === 'tr-de-es') {
                      const tl = lexikonDictKind === 'tr-es-de' ? 'de' : 'es';
                      let out = '';
                      let detected = '';
                      const r = await mullerTranslateGtxFull(q, 'auto', tl);
                      out = r.text;
                      detected = r.detected;
                      if (!out) {
                          try {
                              out = await mullerTranslateViaMyMemory(q, tl === 'de' ? 'es|de' : 'de|es');
                          } catch (eM) { /* ignore */ }
                      }
                      setLexikonResults({ dictTranslate: true, query: q, out: out || '', detected, tl, error: false });
                  } else {
                      const wiki = lexikonDictKind === 'wiki-es' ? 'es' : 'de';
                      const url = `https://${wiki}.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=14&namespace=0&format=json&origin=*`;
                      const r = await fetch(url);
                      if (!r.ok) throw new Error('wiki');
                      const data = await r.json();
                      setLexikonResults({ titles: data[1] || [], descriptions: data[2] || [], urls: data[3] || [], wiki });
                  }
              } catch (e) {
                  alert('No se pudo completar la búsqueda (red o bloqueo). Prueba otra vez.');
                  setLexikonResults({ error: true });
              } finally {
                  setLexikonDictLoading(false);
              }
          };

          const runLexikonTranslate = async () => {
              const text = lexikonTransText.trim();
              if (!text) { alert('Escribe un texto o frase.'); return; }
              setLexikonTransLoading(true);
              setLexikonTransOut('');
              const tl = lexikonTransTarget === 'es' ? 'es' : 'de';
              try {
                  const { text: outRaw, detected } = await mullerTranslateGtxFull(text, 'auto', tl);
                  let out = outRaw;
                  if (!out) {
                      try {
                          out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'es|de' : 'de|es');
                      } catch (eM) { /* ignore */ }
                  }
                  const finalOut = out || '(sin resultado)';
                  setLexikonTransOut(finalOut);
                  mullerLexikonApplyPairsFromTranslate(text, finalOut, detected, tl);
              } catch (e1) {
                  try {
                      let out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'es|de' : 'de|es');
                      if (!out) out = await mullerTranslateViaMyMemory(text, tl === 'de' ? 'de|es' : 'es|de');
                      const finalOut = out || '(sin resultado)';
                      setLexikonTransOut(finalOut);
                      mullerLexikonApplyPairsFromTranslate(text, finalOut, tl === 'de' ? 'es' : 'de', tl);
                  } catch (e2) {
                      setLexikonTransOut('Error de traducción. Comprueba la conexión.');
                  }
              } finally {
                  setLexikonTransLoading(false);
              }
          };

          const runHistoriasProOcr = async (file) => {
              if (!file) return;
              if (typeof Tesseract === 'undefined') {
                  setStoriesProErr('No se pudo cargar OCR (Tesseract).');
                  return;
              }
              setStoriesProErr('');
              setStoriesProBusy(true);
              try {
                  const worker = await Tesseract.createWorker(storiesProOcrLang === 'de' ? 'deu' : 'spa', 1);
                  const { data: { text } } = await worker.recognize(file);
                  await worker.terminate();
                  const cleaned = mullerStoryClean(text);
                  setStoriesProSourceText(cleaned);
                  setStoriesProInputMode(storiesProOcrLang === 'de' ? 'de' : 'es');
              } catch (err) {
                  setStoriesProErr(err && err.message ? err.message : 'Error leyendo OCR');
              } finally {
                  setStoriesProBusy(false);
              }
          };

          const runHistoriasProGenerate = async () => {
              const src = mullerStoryClean(storiesProSourceText);
              if (!src) {
                  setStoriesProErr('Escribe o carga un texto antes de generar.');
                  return;
              }
              setStoriesProBusy(true);
              setStoriesProErr('');
              try {
                  let deNatural = '';
                  let esBase = '';
                  if (storiesProInputMode === 'es') {
                      esBase = src;
                      deNatural = await mullerTranslateViaGtx(src, 'auto', 'de');
                  } else {
                      deNatural = src;
                      esBase = await mullerTranslateViaGtx(src, 'auto', 'es');
                  }
                  deNatural = mullerStoryStylizeGerman(deNatural, storiesProLevel, storiesProTone);
                  const deSimple = mullerStorySimplifyGerman(deNatural);
                  const scenes = mullerStorySplitScenes(deNatural, esBase);
                  const glossary = mullerStoryGlossary(deNatural);
                  setStoriesProResult({
                      deNatural,
                      deSimple,
                      esBase,
                      scenes,
                      glossary,
                      mode: storiesProInputMode === 'de' ? 'correccion' : 'conversion'
                  });
              } catch (err) {
                  setStoriesProErr(err && err.message ? err.message : 'No se pudo generar la historia.');
              } finally {
                  setStoriesProBusy(false);
              }
          };

          const sendHistoriasProToHistoria = () => {
              if (!storiesProResult || !Array.isArray(storiesProResult.scenes) || storiesProResult.scenes.length === 0) {
                  setStoriesProErr('Primero genera la historia.');
                  return;
              }
              const title = `Historias Pro · ${storiesProLevel} · ${new Date().toLocaleDateString()}`;
              setGuionData(storiesProResult.scenes);
              setSceneIndex(0);
              setMode('dialogue');
              setShowCurrentTranslation(false);
              setIsDefaultScript(false);
              setActiveScriptTitle(title);
              setActiveSavedScriptId(null);
              setActiveTab('historia');
              stopAudio();
          };

          const appendPairToCustomLesson = (de, es) => {
              const d = String(de || '').trim();
              const e = String(es || '').trim();
              if (!d || !e) { alert('Falta alemán o español.'); return; }
              let lessonId = lexikonSaveLessonId;
              if (lessonId === '__new__') {
                  const t = (lexikonNewLessonTitle || '').trim() || `Lexikon ${new Date().toLocaleDateString()}`;
                  const newLesson = { id: Date.now().toString() + Math.random().toString(36).slice(2, 9), title: t, words: [{ de: d, es: e, diff: 0 }] };
                  const updated = [...customVocabLessons, newLesson];
                  setCustomVocabLessons(updated);
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(updated)); } catch (err) {}
                  setLexikonSaveLessonId(newLesson.id);
                  setLexikonNewLessonTitle('');
                  alert(`Guardado en nueva lección: «${t}». Puedes practicarla en Vocab.`);
                  return;
              }
              if (!lessonId) { alert('Elige una lección o «Nueva lección…».'); return; }
              setCustomVocabLessons((prev) => {
                  let hit = false;
                  const next = prev.map((l) => {
                      if (l.id !== lessonId) return l;
                      hit = true;
                      if (l.words.some((w) => w.de === d && w.es === e)) return l;
                      return { ...l, words: [...l.words, { de: d, es: e, diff: 0 }] };
                  });
                  if (!hit) {
                      alert('No se encontró esa lección.');
                      return prev;
                  }
                  try { localStorage.setItem('mullerCustomVocab', JSON.stringify(next)); } catch (err) {}
                  return next;
              });
              alert('Palabra añadida a la lección.');
          };

          const handleBxUserCardDelete = () => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser || !item._mullerUid) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              let srcCat = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!srcCat) {
                  alert('No se encontró la categoría de esta tarjeta.');
                  return;
              }
              if (!window.confirm('¿Eliminar esta tarjeta solo de tu biblioteca local?')) return;
              setBxUserOverlay((prev) => {
                  const base = JSON.parse(JSON.stringify(normalizeBxPayload(prev)));
                  base[level][srcCat] = (base[level][srcCat] || []).filter((x) => x._mullerUid !== item._mullerUid);
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
          };

          const handleBxUserCardMove = () => {
              const item = bxCurrentList[bxIndex];
              if (!item || !item._mullerUser || !item._mullerUid) return;
              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
              let srcCat = bxCategory === 'mix' ? (item._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, item._mullerUid)) : bxCategory;
              if (!srcCat) {
                  alert('No se encontró la categoría de origen.');
                  return;
              }
              const toCat = bxMoveTargetCat;
              if (srcCat === toCat) {
                  alert('Elige otra categoría distinta.');
                  return;
              }
              setBxUserOverlay((prev) => {
                  const base = JSON.parse(JSON.stringify(normalizeBxPayload(prev)));
                  const fromArr = base[level][srcCat] || [];
                  const fi = fromArr.findIndex((x) => x._mullerUid === item._mullerUid);
                  if (fi === -1) return prev;
                  const moved = { ...fromArr[fi], _mullerCategory: toCat };
                  fromArr.splice(fi, 1);
                  if (!base[level][toCat]) base[level][toCat] = [];
                  base[level][toCat].push(moved);
                  try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(base)); } catch (e) {}
                  return base;
              });
          };

          const fillChromeAiFromScene = () => {
              try {
                  const idx = getActualSceneIndex();
                  const scene = guionData[idx];
                  if (!scene || !scene.text) { alert('No hay texto en la escena actual de Historia.'); return; }
                  const block = [scene.text, scene.translation ? '(' + scene.translation + ')' : ''].filter(Boolean).join('\n');
                  setChromeAiText(block);
                  setChromeAiLine('Texto cargado desde la escena ' + (idx + 1) + '.');
              } catch (e) { alert('No se pudo leer el guion.'); }
          };

          const runChromeLocalSummarize = async () => {
              const text = (chromeAiText || '').trim();
              if (text.length < 40) {
                  alert('Pega un texto más largo o usa “Cargar escena actual”.');
                  return;
              }
              if (!('Summarizer' in self)) {
                  setChromeAiLine('Tu navegador no expone la API Summarizer. Usa Google Chrome 138+ en escritorio con IA integrada (Gemini Nano). En Edge puede ir detrás de flags; revisa la documentación de Built-in AI.');
                  setChromeAiOut('');
                  return;
              }
              setChromeAiBusy(true);
              setChromeAiOut('');
              setChromeAiLine('Comprobando…');
              try {
                  const Summarizer = self.Summarizer;
                  const availability = await Summarizer.availability();
                  if (availability === 'unavailable') {
                      setChromeAiLine('Gemini Nano no disponible en este equipo (requisitos de hardware, espacio ~22 GB libres en el perfil de Chrome, o política).');
                      setChromeAiBusy(false);
                      return;
                  }
                  setChromeAiLine('Preparando modelo local (la primera vez puede descargarse)…');
                  const summarizer = await Summarizer.create({
                      type: 'key-points',
                      format: 'markdown',
                      length: 'short',
                      expectedInputLanguages: ['de', 'en'],
                      outputLanguage: 'es',
                      sharedContext: 'Estudiante de alemán TELC; resúmenes claros en español.',
                      monitor(m) {
                          m.addEventListener('downloadprogress', (e) => {
                              const p = typeof e.loaded === 'number' ? Math.round(e.loaded * 100) : 0;
                              setChromeAiLine('Descarga del modelo en tu PC… ' + p + '%');
                          });
                      }
                  });
                  setChromeAiLine('Generando resumen (proceso local)…');
                  const summary = await summarizer.summarize(text, { context: 'Texto o diálogo en alemán para estudio.' });
                  setChromeAiOut(typeof summary === 'string' ? summary : String(summary));
                  setChromeAiLine('Listo: sin enviar datos a los servidores de Müller.');
                  try { if (typeof summarizer.destroy === 'function') summarizer.destroy(); } catch (e2) {}
              } catch (err) {
                  setChromeAiLine('Error: ' + (err && err.message ? err.message : String(err)));
              } finally {
                  setChromeAiBusy(false);
              }
          };

          const loadSavedScript = (script) => {
              setGuionData(JSON.parse(script.data)); setActiveScriptTitle(script.title); setIsDefaultScript(false);
              setActiveSavedScriptId(script && script.id != null ? String(script.id) : null);
              setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false); setActiveTab('historia');
          };

          const loadDefaultGuion = () => {
              try {
                  setGuionData(JSON.parse(JSON.stringify(DEFAULT_GUION)));
              } catch (e) {
                  setGuionData(DEFAULT_GUION);
              }
              setActiveScriptTitle('Lektion 17: Kunst');
              setIsDefaultScript(true);
              setActiveSavedScriptId(null);
              setSceneIndex(0);
              setMode('dialogue');
              stopAudio();
              resetModes();
              setIsReviewing(false);
              setActiveTab('historia');
          };

          const deleteSavedScript = (e, script) => {
              e.preventDefault();
              e.stopPropagation();
              const sid = script && script.id != null ? String(script.id) : '';
              if (!sid) {
                  alert('Este guion no tiene id interno; recarga la página y prueba de nuevo.');
                  return;
              }
              if (!window.confirm('¿Eliminar este guion de la lista?')) return;
              const stripBx = window.confirm(
                  '¿Quitar también de B1/B2 las frases que añadiste con «Distribuir texto» mientras tenías cargado este guion en Historia?\n\n' +
                  '(Solo afecta a tarjetas nuevas vinculadas a este guion. Las que enviaste antes sin esta vinculación, o el contenido del archivo b1-b2-database.json, no se tocan.)'
              );
              setSavedScripts((prev) => {
                  const next = prev.filter((s) => String(s.id) !== sid);
                  try { localStorage.setItem('mullerScripts', JSON.stringify(next)); } catch (err) {}
                  return next;
              });
              if (stripBx) {
                  setBxUserOverlay((prev) => {
                      const stripped = mullerStripBxOverlayBySourceScriptId(prev, sid);
                      try { localStorage.setItem(MULLER_BX_USER_OVERLAY_KEY, JSON.stringify(stripped)); } catch (err) {}
                      return stripped;
                  });
                  setBxIndex(0);
                  setBxImportSummary('');
              }
              if (String(activeSavedScriptId) === sid) setActiveSavedScriptId(null);
          };

          const handleGenerateAIStory = () => {
              setIsGeneratingStory(true);
              setTimeout(() => {
                  let wordsArray = aiCustomWords.split(',').map(w => w.trim()).filter(w => w);
                  let mockLongStory = [
                      { speaker: 'Erzähler', text: 'Es war ein kalter Morgen in der großen Stadt.', translation: 'Era una fría mañana en la gran ciudad.' },
                      { speaker: 'Lukas', text: 'Ich muss heute so viel erledigen. Wo fange ich an?', translation: 'Tengo tanto que hacer hoy. ¿Por dónde empiezo?' },
                      { speaker: 'Anna', text: 'Vergiss nicht, dass wir später zusammen essen gehen.', translation: 'No olvides que luego vamos a comer juntos.' },
                      { speaker: 'Lukas', text: 'Natürlich nicht! Ich habe den Tisch schon reserviert.', translation: '¡Por supuesto que no! Ya he reservado la mesa.' },
                      { speaker: 'Anna', text: 'Das ist wunderbar. Ich freue mich wirklich darauf.', translation: 'Eso es maravilloso. De verdad me alegro de ello.' },
                      { speaker: 'Erzähler', text: 'Später am Abend trafen sie sich im neuen Restaurant.', translation: 'Más tarde en la noche se encontraron en el nuevo restaurante.' },
                      { speaker: 'Kellner', text: 'Guten Abend! Was darf ich Ihnen heute bringen?', translation: '¡Buenas tardes! ¿Qué les puedo traer hoy?' },
                      { speaker: 'Lukas', text: 'Wir hätten gerne die Speisekarte und ein Wasser, bitte.', translation: 'Nos gustaría la carta y un agua, por favor.' },
                      { speaker: 'Anna', text: 'Und ich hätte gerne ein Glas Rotwein.', translation: 'Y a mí me gustaría una copa de vino tinto.' },
                      { speaker: 'Kellner', text: 'Kommt sofort! Haben Sie schon gewählt?', translation: '¡Enseguida! ¿Ya han elegido?' }
                  ];
                  if (wordsArray.length > 0) {
                      wordsArray.forEach((word, index) => {
                          let i = (index + 1) * 2; 
                          if (i >= mockLongStory.length) i = mockLongStory.length - 1;
                          mockLongStory.splice(i, 0, {
                              speaker: 'Anna', text: `Übrigens, erinnerst du dich an ${word}? Das war eine interessante Erfahrung.`,
                              translation: `Por cierto, ¿te acuerdas de ${word}? Fue una experiencia interesante.`,
                              vocab: [{ de: word, es: 'Palabra Custom', diff: 1 }]
                          });
                      });
                  }
                  setGuionData(mockLongStory); setActiveScriptTitle(`AI Generated: ${aiLevel} - ${aiTheme}`);
                  setIsDefaultScript(false); setActiveSavedScriptId(null); setSceneIndex(0); setMode('dialogue'); stopAudio(); resetModes(); setIsReviewing(false);
                  setIsGeneratingStory(false); setActiveTab('historia'); setAiCustomWords(""); 
              }, 3000);
          };

          const sanitizeHistoriaSpeechText = (text) => {
              return String(text || '')
                  .replace(/\[R\]/gi, '')
                  .replace(/\bN[üu]tzlich\b\.?/gi, '')
                  .replace(/\b[ÚU]TIL\b\.?/gi, '')
                  .replace(/\s{2,}/g, ' ')
                  .trim();
          };

          const playSceneAudio = (text, speaker) => {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'de-DE';
              if (speaker === 'Lukas') { utterance.voice = getVoice('de', 'male'); utterance.pitch = 1.1; } 
              else if (speaker === 'Elena' || speaker === 'Anna') { utterance.voice = getVoice('de', 'female'); utterance.pitch = 1.2; } 
              else if (speaker.includes('Weber') || speaker === 'Professor' || speaker === 'Erzähler') { utterance.voice = getVoice('de', 'male', true); utterance.pitch = 0.8; } 
              else { utterance.voice = getVoice('de', 'male'); }
              utterance.rate = (speaker.includes('Weber') ? 0.9 : 1.0) * playbackRate;
              if (fluesternMode) { utterance.volume = 0.3; utterance.pitch = utterance.pitch * 0.8; } 
              else { utterance.volume = 1.0; }
              return utterance;
          };

          useEffect(() => {
            if (!isPlaying || !voicesLoaded || mode !== 'dialogue' || activeTab !== 'historia') return;
            window.speechSynthesis.cancel(); 
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const actualIdx = getActualSceneIndex();
            const currentScene = guionData[actualIdx];
            if ((currentScene.speaker === roleplayChar || roleplayChar === 'Todos') && mode === 'dialogue' && !podcastMode) {
                setMode('roleplay_wait'); setIsPlaying(false); return; 
            }
           // Limpiamos el texto de símbolos que el motor de voz lee por error (.;)
const audioCleanText = sanitizeHistoriaSpeechText(currentScene.text).replace(/[.;;]/g, '.'); 
const sentenceUtterance = playSceneAudio(audioCleanText, currentScene.speaker);
            let utterances = [sentenceUtterance];
            if (currentScene.vocab && currentScene.vocab.length > 0 && !podcastMode && !diktatMode && !puzzleMode && !declinaMode && !artikelSniperMode) {
                currentScene.vocab.forEach(v => {
                    const uDe = new SpeechSynthesisUtterance(v.de);
                    uDe.lang = 'de-DE'; uDe.voice = getVoice('de', 'female'); uDe.rate = 0.85;
                    utterances.push(uDe);
                    const uEs = new SpeechSynthesisUtterance(v.es);
                    uEs.lang = 'es-ES'; uEs.voice = getVoice('es', 'male'); uEs.rate = 0.9;
                    utterances.push(uEs);
                });
            }
            if (podcastMode) {
                const esUtter = new SpeechSynthesisUtterance(currentScene.translation || "Traducción no disponible");
                esUtter.lang = 'es-ES'; esUtter.voice = getVoice('es', 'male'); esUtter.rate = 1.0;
                utterances = [sentenceUtterance, esUtter];
            }
            utterances[utterances.length - 1].onend = () => {
                if (!isPlayingRef.current) return;
                if (diktatMode || puzzleMode || declinaMode || artikelSniperMode) { setIsPlaying(false); return; } 
                if (podcastMode) timeoutRef.current = setTimeout(() => proceedToNextStage(), 1500);
                else timeoutRef.current = setTimeout(() => proceedToNextStage(), 800);
            };
            utterances.forEach(u => window.speechSynthesis.speak(u));
            return () => { window.speechSynthesis.cancel(); if (timeoutRef.current) clearTimeout(timeoutRef.current); };
          }, [sceneIndex, mode, isPlaying, voicesLoaded, playbackRate, roleplayChar, diktatMode, puzzleMode, declinaMode, artikelSniperMode, isReviewing, fluesternMode, activeTab, podcastMode, ttsPrefsEpoch]);

          const trySaveGrammarStructure = () => {
              const text = guionData[getActualSceneIndex()].text;
              const translation = guionData[getActualSceneIndex()].translation || "";
              let found = false;
              let newGrammar = [...userStats.difficultGrammar];
              GRAMMAR_PATTERNS.forEach(p => {
                  if (text.match(p.regex)) {
                      if (!newGrammar.some(g => g.base === p.base)) { newGrammar.push({ base: p.base, exampleDe: text, exampleEs: translation }); found = true; }
                  }
              });
              if (found) { saveProgress({ difficultGrammar: newGrammar }); alert("¡Estructura automática detectada y guardada en tu mazo!"); } 
              else { setShowGrammarPrompt(true); }
          };

          const handleCustomGrammarSave = () => {
              if(!customGrammarInput.trim()) return;
              const text = guionData[getActualSceneIndex()].text;
              const translation = guionData[getActualSceneIndex()].translation || "";
              let newGrammar = [...userStats.difficultGrammar];
              newGrammar.push({ base: customGrammarInput, exampleDe: text, exampleEs: translation });
              saveProgress({ difficultGrammar: newGrammar });
              setShowGrammarPrompt(false); setCustomGrammarInput(""); alert("¡Estructura personalizada guardada con éxito!");
          };

          const generateTutorFeedback = (text) => {
              let feedback = [];
              const tLower = text.toLowerCase();
              if (tLower.match(/\b(weil|dass|obwohl|wenn|als|damit|ob|bevor|nachdem)\b/i)) feedback.push("🟣 **Nebensatz (Subordinada):** Has usado un conector subordinante. El verbo conjugado va a la última posición de la frase.");
              if (tLower.match(/\b(deshalb|deswegen|darum|trotzdem|dann|danach|außerdem)\b/i)) feedback.push("🟠 **Hauptsatz (Inversión):** Conector en Posición 1. Inmediatamente después tiene que ir el verbo (Pos 2), y luego el sujeto.");
              if (tLower.match(/\b(und|aber|oder|denn|sondern)\b/i)) feedback.push("🟢 **Conector ADUSO (Posición 0):** Une dos frases sin alterar el orden normal (Sujeto + Verbo).");
              if (tLower.match(/\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b.*\b(ge[a-zäöüß]+t|ge[a-zäöüß]+en|.+[ie]rt)\b/i)) feedback.push("🕰️ **Perfekt:** Auxiliar (haben/sein) en Posición 2 y Participio al final.");
              if (tLower.match(/\b(wurde|wurdest|wurden|wurdet|war|warst|waren|wart|hatte|hattest|hatten|hattet|gab|musste|konnte|wollte|sollte|durfte)\b/i) && !tLower.match(/\b(worden)\b/i)) feedback.push("📖 **Präteritum:** Pasado simple. Usado para verbos auxiliares, modales o narración.");
              if (tLower.match(/\b(wurde|worden)\b/i) || (tLower.match(/\b(werden|wird|werden|werdet)\b/i) && tLower.match(/\b(ge[a-zäöüß]+t|ge[a-zäöüß]+en)\b/i))) feedback.push("🏛️ **Passiv:** 'Werden' + Participio II. Lo importante es la acción, no el sujeto.");
              if (tLower.match(/\b(muss|musst|müssen|kann|kannst|können|darf|darfst|dürfen|soll|sollst|sollen|will|willst|wollen|möchte|möchtest|möchten)\b/i)) feedback.push("💪 **Modalverben:** Verbo modal en Pos 2, obliga al verbo principal en Infinitivo al final.");
              if (tLower.match(/\b(an|ein|auf|zu|mit|aus|vor|nach|ab|her|hin|los|teil)\s*[.,!?]*$/i)) feedback.push("✂️ **Trennbare Verben:** El prefijo del verbo se ha separado al final de la frase.");
              if (tLower.match(/\b(aus|bei|mit|nach|seit|von|zu|ab)\b/i)) feedback.push("🔵 **Dativo (Preposición):** Preposición que rige Dativo estricto.");
              if (tLower.match(/\b(durch|für|gegen|ohne|um)\b/i)) feedback.push("🔴 **Acusativo (Preposición):** Preposición que rige Acusativo estricto.");
              if (tLower.match(/\b(in|an|auf|neben|hinter|über|unter|vor|zwischen)\b/i)) feedback.push("🟡 **Wechselpräposition:** Rige Dativo (Wo?) o Acusativo (Wohin?).");
              GRAMMAR_PATTERNS.forEach(p => { if (text.match(p.regex)) feedback.push(`🌟 **Verbo con Preposición Fija:** ${p.tooltip}.`); });
              return feedback.join("\n\n") || "🟢 **Hauptsatz:** Estructura estándar perfecta.";
          };

          const showAITutor = () => {
              setTutorMessage(generateTutorFeedback(guionData[getActualSceneIndex()].text));
              setShowTutor(true);
          };

          const handleDiktatCheck = () => {
              if (!diktatInput.trim()) { alert("Por favor, escribe lo que has escuchado primero."); return; }
              setShowDiktatResult(true);
              const cleanText = (t) => t.toLowerCase().replace(/[.,!?]/g, '').trim();
              const originalText = cleanText(guionData[getActualSceneIndex()].text);
              const typedText = cleanText(diktatInput);
              if (originalText !== typedText) {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false);
                  setDiktatMotivationMsg(typeof window.__mullerRandomMotivation === 'function' ? window.__mullerRandomMotivation() : 'Sigue intentándolo.');
                  if (!isReviewing && !userStats.failedDiktatScenes.includes(sceneIndex)) {
                      saveProgress({ failedDiktatScenes: [...userStats.failedDiktatScenes, sceneIndex], diktatAttempts: userStats.diktatAttempts + 1, activityByDay: mergeActivityPoints(6) });
                  }
                  deductHeart();
              } else {
                  setDiktatMotivationMsg('');
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
                  saveProgress({ coins: userStats.coins + 5, diktatCorrect: userStats.diktatCorrect + 1, diktatAttempts: userStats.diktatAttempts + 1, activityByDay: mergeActivityPoints(25) });
              }
          };

          const handleVoiceStart = async (targetText = null, evalOpts = {}) => {
              if (userStats.hearts <= 0 && evalOpts.mode !== 'shadow') { setShowDeathModal(true); return; }
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) { alert("Tu navegador no soporta esta función. Usa Google Chrome."); return; }
              const ok = await mullerEnsureMicPermission({ autoPrompt: true, showToast: true });
              if (!ok) {
                  setGrammarPolizeiMsg('Sin permiso de micrófono. Puedes seguir con texto y audio.');
                  return;
              }
              if (recognitionRef.current) {
                  try { recognitionRef.current.stop(); } catch (e) {}
              }
              const recognition = new SpeechRecognition();
              recognition.lang = 'de-DE';
              const mobileStt = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || ''));
              /* continuous: una sola sesión por pulsación; en móvil interimResults=false reduce duplicados del motor */
              recognition.continuous = true;
              recognition.interimResults = !mobileStt;
              recognition.maxAlternatives = mobileStt ? 1 : 3;
              recognitionRef.current = recognition;
              spokenTextRef.current = "";
              speechFinalRef.current = "";
              const opts = { mode: evalOpts.mode || 'default' };
              const pickAlt = (res) => {
                  let alt = res[0];
                  for (let j = 1; j < res.length; j++) {
                      const cj = res[j].confidence;
                      const cb = alt.confidence;
                      if (typeof cj === 'number' && (typeof cb !== 'number' || cj >= cb)) alt = res[j];
                  }
                  return alt;
              };
              recognition.onstart = () => {
                  setIsListening(true);
                  setSpokenText("");
                  speechFinalRef.current = "";
                  spokenTextRef.current = "";
                  setPronunciationScore(null);
                  setGrammarPolizeiMsg("");
                  setPronunciationFeedback([]);
              };
              recognition.onresult = (event) => {
                  const finals = [];
                  let interim = "";
                  for (let i = event.resultIndex; i < event.results.length; i++) {
                      const res = event.results[i];
                      const alt = pickAlt(res);
                      const raw = (alt.transcript || "").trim();
                      if (!raw) continue;
                      if (res.isFinal) finals.push(raw);
                      else interim = raw;
                  }
                  if (finals.length) {
                      if (mobileStt) {
                          if (finals.length === 1) {
                              const f = finals[0];
                              const cur = speechFinalRef.current || "";
                              if (!cur) speechFinalRef.current = f;
                              else if (f.startsWith(cur.trim())) speechFinalRef.current = f;
                              else if (cur.startsWith(f) && f.length < cur.length) { /* mantener frase más larga */ }
                              else if (f.length >= cur.length && (f.indexOf(cur) >= 0 || cur.indexOf(f) >= 0)) speechFinalRef.current = f.length >= cur.length ? f : cur;
                              else speechFinalRef.current = mergeSpeechFinalChunk(cur, f);
                          } else {
                              const chunk = finals.join(" ").trim();
                              speechFinalRef.current = mergeSpeechFinalChunk(speechFinalRef.current, chunk);
                          }
                      } else {
                          for (const f of finals) {
                              speechFinalRef.current = mergeSpeechFinalChunk(speechFinalRef.current, f);
                          }
                      }
                  }
                  const display = (speechFinalRef.current + (interim ? (speechFinalRef.current ? " " : "") + interim : "")).trim();
                  const cleaned = collapseStutterRepeats(display);
                  spokenTextRef.current = cleaned;
                  setSpokenText(cleaned);
              };
              recognition.onerror = (event) => {
                  console.error("Error de micro:", event.error);
                  setIsListening(false);
                  if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                      alert("Permiso de micrófono denegado. Activa el mic en la barra del navegador.");
                  }
              };
              recognition.onend = () => {
                  setIsListening(false);
                  evaluatePronunciation(targetText, spokenTextRef.current || "", opts);
              };
              try { recognition.start(); } catch (e) {}
          };

          const handleVoiceStop = () => {
              const r = recognitionRef.current;
              if (!r) return;
              try { r.stop(); } catch (e) {}
          };

          const micMouseDownGuard = (fn) => () => {
              if (Date.now() < micIgnoreMouseUntilRef.current) return;
              fn();
          };
          const micTouchStartGuard = (fn) => () => {
              micIgnoreMouseUntilRef.current = Date.now() + 450;
              fn();
          };

          const evaluatePronunciation = (targetText, transcript, opts = {}) => {
              const mode = opts.mode || 'default';
              if (!transcript || transcript.trim() === "") {
                  if (mode === 'shadow') {
                      setGrammarPolizeiMsg("No se detectó voz. Comprueba el micrófono o habla más cerca.");
                      setPronunciationScore(null);
                      setPronunciationFeedback([]);
                      if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
                  }
                  return;
              }
              const textToCompare = sanitizeHistoriaSpeechText(targetText || guionData[getActualSceneIndex()].text);
              const cleanOrig = normalizeGermanSpeechText(textToCompare);
              const cleanSpoken = normalizeGermanSpeechText(collapseStutterRepeats(transcript));
              if (!cleanOrig) return;
              const distance = levenshteinDistance(cleanOrig, cleanSpoken);
              const maxLength = Math.max(cleanOrig.length, cleanSpoken.length, 1);
              let scorePhrase = Math.round(((maxLength - distance) / maxLength) * 100);
              const origWords = cleanOrig.split(/\s+/).filter(Boolean);
              const spokenWords = cleanSpoken.split(/\s+/).filter(Boolean);
              const feedbackArr = matchGermanWordsSequential(origWords, spokenWords);
              const correctN = feedbackArr.filter((f) => f.correct).length;
              const wordRatio = origWords.length ? correctN / origWords.length : 1;
              let scoreWords = Math.round(wordRatio * 100);
              let score = Math.round(scorePhrase * 0.45 + scoreWords * 0.55);
              let polizeiMsg = "";
              let penalty = false;
              if (mode !== 'shadow' && cleanOrig.includes("wegen des") && cleanSpoken.includes("wegen dem")) {
                  score -= 20;
                  polizeiMsg = "🚨 Grammatik-Polizei: Has external DATIVO en vez de GENITIVO. -1 ❤️";
                  penalty = true;
              }
              const finalScore = score > 100 ? 100 : score < 0 ? 0 : score;
              if (mode === 'shadow') setGrammarPolizeiMsg("");
              else setGrammarPolizeiMsg(polizeiMsg);
              setPronunciationScore(finalScore);
              setPronunciationFeedback(feedbackArr);
              if (mode === 'shadow') {
                  saveProgress({
                      pronunciationAttempts: (userStats.pronunciationAttempts || 0) + 1,
                      pronunciationTotalScore: (userStats.pronunciationTotalScore || 0) + finalScore,
                      ...(finalScore >= 85 ? { coins: userStats.coins + 2, activityByDay: mergeActivityPoints(8) } : {}),
                  });
                  if (window.__mullerNotifyExerciseOutcome) {
                      window.__mullerNotifyExerciseOutcome(finalScore >= 75);
                  }
                  return;
              }
              if (penalty || finalScore < 50) { window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(false); deductHeart(); }
              else {
                  window.__mullerNotifyExerciseOutcome && window.__mullerNotifyExerciseOutcome(true);
                  if (finalScore >= 90) saveProgress({ coins: userStats.coins + 5, activityByDay: mergeActivityPoints(12) });
              }
          };

          const playVocabAudio = () => {
              if(vocabDisplayList.length === 0) return;
              window.speechSynthesis.cancel();
              const currentVocab = vocabDisplayList[vocabReviewIndex];
              const cleanDeAudio = currentVocab.de.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-ZäöüßÄÖÜ]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
              const cleanEsAudio = currentVocab.es.replace(/^[0-9]+[.\-):\]]*\s*/g, '').replace(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{1,10}\s*[.:]\s*/g, '').replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]|\u{FE0F}/gu, '').trim();
              const utterDe = new SpeechSynthesisUtterance(cleanDeAudio);
              utterDe.lang = 'de-DE'; utterDe.voice = getVoice('de', 'female'); utterDe.rate = 0.85;
              utterDe.onend = () => {
                  setTimeout(() => { setShowVocabTranslation(true);
                     const utterEs = new SpeechSynthesisUtterance(cleanEsAudio);
                     utterEs.lang = 'es-ES'; utterEs.voice = getVoice('es', 'male'); utterEs.rate = 0.9;
                     window.speechSynthesis.speak(utterEs); }, 500); 
              };
              window.speechSynthesis.speak(utterDe);
          };

          const handleVocabDifficulty = (level) => {
            const currentWord = vocabDisplayList[vocabReviewIndex];
            if (!currentWord) return;
            let newDiff = [...userStats.difficultVocab];
            let newNorm = [...userStats.normalVocab];
            if (level === 'hard') { if (!newDiff.some(w => w.de === currentWord.de)) newDiff.push(currentWord); } 
            else if (level === 'normal') { if (!newNorm.some(w => w.de === currentWord.de)) newNorm.push(currentWord); }
            if (window.__mullerNotifyExerciseOutcome) {
                window.__mullerNotifyExerciseOutcome(level === 'easy' || level === 'normal');
            }
            mullerBumpVocabStreakRating();
            saveProgress({ difficultVocab: newDiff, normalVocab: newNorm, activityByDay: mergeActivityPoints(15) });
            try {
                const nextMap = mullerApplyVocabSrsRating(mullerGetVocabSrsMap(), currentWord, level);
                mullerSetVocabSrsMap(nextMap);
                setVocabSrsEpoch((e) => e + 1);
            } catch (e) {}
            if (vocabReviewIndex < vocabDisplayList.length - 1) { setVocabReviewIndex(prev => prev + 1); setShowVocabTranslation(false); } 
            else {
                window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
                setCelebrationModal({ title: '¡Lista completada!', subtitle: 'Has repasado todas las tarjetas de esta sesión.', xp: 15, coins: 10 });
                saveProgress({ xp: userStats.xp + 15, coins: userStats.coins + 10, activityByDay: mergeActivityPoints(35) });
                setActiveTab('guiones');
            }
          };

          const startPractice = (type) => {
              if (type === 'diff' && (!userStats.difficultVocab || userStats.difficultVocab.length === 0)) { alert("Tu mazo de Vocabulario Difícil está vacío."); return; }
              if (type === 'norm' && (!userStats.normalVocab || userStats.normalVocab.length === 0)) { alert("Tu mazo de Vocabulario Normal está vacío."); return; }
              if (type === 'grammar' && (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0)) { alert("Tu mazo de Gramática está vacío."); return; }
              setPracticeActive(type); setPracticeIndex(0); setPracticeShowTrans(false);
          };

          const playPracticeAudio = (text) => {
              window.speechSynthesis.cancel();
              const utterDe = new SpeechSynthesisUtterance(text);
              utterDe.lang = 'de-DE'; utterDe.voice = getVoice('de', 'male'); utterDe.rate = 0.9;
              window.speechSynthesis.speak(utterDe);
          };

          const nextPracticeWord = () => {
              if (practiceShowTrans && window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
              const list = practiceActive === 'diff' ? userStats.difficultVocab : (practiceActive === 'norm' ? userStats.normalVocab : userStats.difficultGrammar);
              if (practiceIndex < list.length - 1) { setPracticeIndex(practiceIndex + 1); setPracticeShowTrans(false); saveProgress({ activityByDay: mergeActivityPoints(6) }); } 
              else {
                  window.__mullerPlaySfx && window.__mullerPlaySfx('complete');
                  setCelebrationModal({ title: '¡Sesión de mazos!', subtitle: '+20 XP · +5 monedas', xp: 20, coins: 5 });
                  saveProgress({ xp: userStats.xp + 20, coins: userStats.coins + 5, activityByDay: mergeActivityPoints(30) });
                  setPracticeActive(null);
              }
          };

          const getArticleVisual = (word) => {
            if (!word) return null;
            if (word.startsWith('der ')) return <span className="text-blue-400 mr-2">🔵</span>;
            if (word.startsWith('die ')) return <span className="text-red-400 mr-2">🔴</span>;
            if (word.startsWith('das ')) return <span className="text-green-400 mr-2">🟢</span>;
            return null;
          };

          const renderHighlightedText = (text, vocabList) => {
            let htmlText = text;
            if (artikelSniperMode) { const artRegex = /\b(der|die|das|den|dem|des)\b/gi; htmlText = htmlText.replace(artRegex, `<span class="bg-red-800/40 text-red-200 border-b border-red-500/60 px-2 mx-0.5 rounded-sm font-bold shadow-sm">[ ??? ]</span>`); }
            if (declinaMode) { const declRegex = /\b(d|ein|kein|mein|dein|sein|ihr|unser|euer)(er|en|em|es|e|as|ie)\b/gi; htmlText = htmlText.replace(declRegex, `$1<span class="text-pink-300 font-mono bg-pink-800/30 border-b border-pink-500/60 px-1 mx-0.5 rounded shadow-sm">[ _ ]</span>`); }
            if (vocabList && vocabList.length > 0) {
                const sortedVocab = [...vocabList].sort((a, b) => b.de.length - a.de.length);
                sortedVocab.forEach(v => {
                   let searchWord = v.de.replace(/^(der|die|das|sich)\s/i, '').trim();
                   const safeWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                   const regex = new RegExp(`(?![^<]*>)(^|[^a-zäöüßA-ZÄÖÜẞ])(${safeWord})([^a-zäöüßA-ZÄÖÜẞ]|$)`, 'gi');
                   if (lueckentextMode) htmlText = htmlText.replace(regex, `$1<span class="bg-gray-800 text-transparent border-b border-yellow-500/70 rounded px-3 mx-1 select-none" title="${v.es}">[ ??? ]</span>$3`);
                   else htmlText = htmlText.replace(regex, `$1<span class="bg-amber-500/20 text-amber-100 border-b border-amber-400/60 px-1 mx-0.5 rounded-sm font-bold shadow-sm" title="Traducción: ${v.es}">$2</span>$3`);
                });
            }
            GRAMMAR_PATTERNS.forEach(p => { htmlText = htmlText.replace(p.regex, `<span class="bg-cyan-800/40 text-cyan-200 border-b border-cyan-400/60 px-1 mx-0.5 rounded-sm shadow-sm" title="${p.tooltip}">$1</span>`); });
            if (tempusMode) {
                Object.keys(TEMPUS_DICT).forEach(verb => {
                    const safeVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(?![^<]*>)\\b(${safeVerb})\\b`, 'gi');
                    htmlText = htmlText.replace(regex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
                });
                const genericInfRegex = /(?![^<]*>)\b([a-zäöüß]{4,}(?:en|eln|ern))\b/gi;
                htmlText = htmlText.replace(genericInfRegex, `<span class="tempus-clickable text-blue-100 font-bold underline decoration-blue-400/70 decoration-2 underline-offset-4 cursor-pointer px-0.5 rounded" data-tempus-verb="$1" title="Toca para ver infinitivo y tiempos">$1</span>`);
            }
            const connRegex = new RegExp(`(?![^<]*>)\\b(${CONN_LIST.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(connRegex, `<span class="text-purple-300 font-bold underline decoration-purple-500/70 decoration-2 underline-offset-4" title="Conector">$1</span>`);
            const datRegex = new RegExp(`(?![^<]*>)\\b(${PREP_DAT.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(datRegex, `<span class="text-blue-300 font-bold underline decoration-blue-500/70 decoration-2 underline-offset-4" title="Preposición Dativo (Estático)">$1</span>`);
            const akkRegex = new RegExp(`(?![^<]*>)\\b(${PREP_AKK.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(akkRegex, `<span class="text-red-300 font-bold underline decoration-red-500/70 decoration-2 underline-offset-4" title="Preposición Acusativo (Movimiento)">$1</span>`);
            const wechRegex = new RegExp(`(?![^<]*>)\\b(${PREP_WECHSEL.join('|')})\\b`, 'gi');
            htmlText = htmlText.replace(wechRegex, `<span class="text-yellow-500/90 font-bold underline decoration-yellow-600/70 decoration-2 underline-offset-4" title="Wechselpräposition (Mixta)">$1</span>`);
            return (
                <div
                    className="leading-loose inline"
                    onClick={(e) => {
                        if (!tempusMode) return;
                        const t = e && e.target && e.target.closest ? e.target.closest('[data-tempus-verb]') : null;
                        if (!t) return;
                        const picked = t.getAttribute('data-tempus-verb');
                        const info = resolveTempusVerbInfo(picked);
                        if (info) setTempusSelectedVerb(info);
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlText }}
                />
            );
          };

          const renderDiktatDiff = (original, typed) => {
              const cleanWord = (w) => w.toLowerCase().replace(/[.,!?]/g, '').trim();
              const origWords = original.split(/\s+/).filter(w=>w);
              const typedWords = typed.split(/\s+/).filter(w=>w);
              return (
                  <div className="flex flex-wrap gap-2 text-2xl md:text-3xl font-medium justify-center bg-gray-900 p-4 md:p-6 rounded-xl border border-gray-700 leading-loose w-full">
                      {origWords.map((word, i) => {
                          const tWord = typedWords[i] || "";
                          const isCorrect = cleanWord(word) === cleanWord(tWord);
                          if (isCorrect) return <span key={i} className="text-green-400">{word}</span>;
                          else return (
                              <div key={i} className="flex flex-col items-center mx-1">
                                  <span className="text-red-400 line-through decoration-red-500 text-base md:text-xl opacity-70">{tWord || "___"}</span>
                                  <span className="text-green-300 border-b border-green-500 font-bold bg-green-900/30 px-1 rounded text-sm md:text-base">{word}</span>
                              </div>
                          );
                      })}
                  </div>
              );
          };

          const exportToAnki = (type) => {
            let csvContent = "data:text/csv;charset=utf-8,";
            if (type === 'vocab_diff') {
                if (!userStats.difficultVocab || userStats.difficultVocab.length === 0) { alert("Vacío."); return; }
                userStats.difficultVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Dificil"\r\n`; });
            } else if (type === 'vocab_norm') {
                if (!userStats.normalVocab || userStats.normalVocab.length === 0) { alert("Vacío."); return; }
                userStats.normalVocab.forEach((v) => { csvContent += `"${v.de}","${v.es}<br><small>TELC B1</small>","Repaso"\r\n`; });
            } else {
                if (!userStats.difficultGrammar || userStats.difficultGrammar.length === 0) { alert("Vacío."); return; }
                userStats.difficultGrammar.forEach((g) => { csvContent += `"${g.base} (Verbo+Prep)","${g.exampleDe}<br><small>${g.exampleEs}</small>","Dificil"\r\n`; });
            }
            const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); 
            link.setAttribute("download", `Anki_${type}_B1.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
          };

          const exportScriptPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert("Permite las ventanas emergentes para generar el PDF."); return; }
            const escPdf = (s) => String(s ?? '')
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const genDate = new Date().toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
            const totalScenes = guionData.length;
            let htmlContent = `
                <html>
                <head>
                    <title>Guion: ${escPdf(activeScriptTitle)}</title>
                    <style>
                        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 28px; line-height: 1.55; max-width: 920px; margin: 0 auto; }
                        h1 { color: #b91c1c; text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 12px; font-size: 26px; }
                        .meta { text-align: center; color: #64748b; margin-bottom: 8px; font-size: 13px; }
                        .meta strong { color: #475569; }
                        h2 { color: #1e3a8a; border-bottom: 2px solid #93c5fd; padding-bottom: 5px; margin-top: 36px; font-size: 18px; }
                        .scene { margin-bottom: 28px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.06); page-break-inside: avoid; }
                        .scene-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
                        .scene-num { font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 0.06em; text-transform: uppercase; }
                        .speaker { font-weight: 900; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; }
                        .badge-redem { font-size: 11px; background: linear-gradient(90deg,#f97316,#eab308); color: white; padding: 3px 10px; border-radius: 999px; font-weight: 800; }
                        .block-de { margin-bottom: 14px; }
                        .label-row { font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
                        .label-es { color: #047857; }
                        .text-de { font-size: 19px; font-weight: 700; margin: 0; color: #0f172a; line-height: 1.45; }
                        .block-es { background: linear-gradient(90deg, #ecfdf5 0%, #f8fafc 100%); border-left: 4px solid #059669; padding: 12px 14px; border-radius: 0 8px 8px 0; margin-top: 4px; }
                        .text-es { font-size: 16px; color: #166534; margin: 0; line-height: 1.5; font-style: normal; font-weight: 500; }
                        .text-es-empty { color: #94a3b8; font-style: italic; font-weight: 400; }
                        .vocab-box { font-size: 12px; color: #92400e; background: #fffbeb; padding: 8px 12px; border-radius: 6px; margin-top: 12px; font-weight: 600; border: 1px solid #fcd34d; line-height: 1.4; }
                        .hl-vocab { background-color: #fef08a; border-bottom: 2px solid #eab308; padding: 0 4px; border-radius: 2px; }
                        .hl-conn { color: #7e22ce; text-decoration: underline; text-decoration-color: #a855f7; text-decoration-thickness: 2px; }
                        .hl-dat { color: #1d4ed8; text-decoration: underline; text-decoration-color: #3b82f6; text-decoration-thickness: 2px; }
                        .hl-akk { color: #b91c1c; text-decoration: underline; text-decoration-color: #ef4444; text-decoration-thickness: 2px; }
                        .hl-wech { color: #d97706; text-decoration: underline; text-decoration-color: #f59e0b; text-decoration-thickness: 2px; }
                        .hl-verbprep { background-color: #cffafe; border-bottom: 2px solid #06b6d4; padding: 0 4px; border-radius: 2px; color: #0891b2; }
                        .tempus-tag { font-size: 10px; color: #4338ca; font-family: ui-monospace, monospace; background: #e0e7ff; padding: 2px 6px; border-radius: 4px; border: 1px solid #a5b4fc; margin-left: 4px; font-weight: 500; }
                        .grammar-summary { background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 28px; page-break-inside: avoid; }
                        .legend { background: #f1f5f9; padding: 16px 18px; border-radius: 10px; margin-top: 32px; font-size: 12px; color: #475569; border: 1px solid #e2e8f0; page-break-inside: avoid; }
                        .legend h3 { margin: 0 0 10px 0; font-size: 14px; color: #0f172a; }
                        .legend ul { margin: 0; padding-left: 18px; }
                        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #64748b; }
                        @media print { body { padding: 16px; } .scene { box-shadow: none; } }
                    </style>
                </head>
                <body>
                    <h1>📜 ${escPdf(activeScriptTitle)}</h1>
                    <p class="meta"><strong>Müller</strong> · Entrenador alemán TELC · ${escPdf(genDate)} · ${totalScenes} escena${totalScenes === 1 ? '' : 's'}</p>
            `;
            let uniqueGrammarRules = new Set();
            guionData.forEach((scene, sceneIdx) => {
                let deText = scene.text;
                const feedback = generateTutorFeedback(deText);
                if (feedback && !feedback.includes("Estructura estándar perfecta")) {
                    feedback.split('\n\n').forEach(f => uniqueGrammarRules.add(f));
                }
                if (scene.vocab) {
                    const sortedVocab = [...scene.vocab].sort((a, b) => b.de.length - a.de.length);
                    sortedVocab.forEach(v => {
                        let searchWord = v.de.replace(/^(der|die|das|sich)\s/i, '').trim();
                        const safeWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(`(?![^<]*>)(^|[^a-zäöüßA-ZÄÖÜẞ])(${safeWord})([^a-zäöüßA-ZÄÖÜẞ]|$)`, 'gi');
                        deText = deText.replace(regex, `$1<span class="hl-vocab">$2</span>$3`);
                    });
                }
                GRAMMAR_PATTERNS.forEach(p => { deText = deText.replace(p.regex, `<span class="hl-verbprep">$1</span>`); });
                Object.keys(TEMPUS_DICT).forEach(verb => {
                    const safeVerb = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(?![^<]*>)\\b(${safeVerb})\\b`, 'gi');
                    deText = deText.replace(regex, `$1 <span class="tempus-tag">(${TEMPUS_DICT[verb]})</span>`);
                });
                const connRegex = new RegExp(`(?![^<]*>)\\b(${CONN_LIST.join('|')})\\b`, 'gi');
                deText = deText.replace(connRegex, `<span class="hl-conn">$1</span>`);
                const datRegex = new RegExp(`(?![^<]*>)\\b(${PREP_DAT.join('|')})\\b`, 'gi');
                deText = deText.replace(datRegex, `<span class="hl-dat">$1</span>`);
                const akkRegex = new RegExp(`(?![^<]*>)\\b(${PREP_AKK.join('|')})\\b`, 'gi');
                deText = deText.replace(akkRegex, `<span class="hl-akk">$1</span>`);
                const wechRegex = new RegExp(`(?![^<]*>)\\b(${PREP_WECHSEL.join('|')})\\b`, 'gi');
                deText = deText.replace(wechRegex, `<span class="hl-wech">$1</span>`);
                const tr = scene.translation && String(scene.translation).trim();
                const trBlock = tr
                    ? `<div class="block-es"><div class="label-row label-es">Español · traducción</div><p class="text-es">${escPdf(tr)}</p></div>`
                    : `<div class="block-es"><div class="label-row label-es">Español · traducción</div><p class="text-es text-es-empty">(Sin traducción en esta línea del guion — puedes añadirla en Biblioteca al editar.)</p></div>`;
                const vocabHtml = scene.vocab && scene.vocab.length > 0
                    ? `<div class="vocab-box">📖 Vocabulario: ${scene.vocab.map((v) => `${escPdf(v.de)} → ${escPdf(v.es)}`).join(' · ')}</div>`
                    : '';
                htmlContent += `
                    <div class="scene">
                        <div class="scene-head">
                            <span class="scene-num">Szene ${sceneIdx + 1} / ${totalScenes}</span>
                            <span class="speaker">${escPdf(scene.speaker)}</span>
                            ${scene.isRedemittel ? '<span class="badge-redem">Redemittel</span>' : ''}
                        </div>
                        <div class="block-de">
                            <div class="label-row">Deutsch</div>
                            <div class="text-de">${deText}</div>
                        </div>
                        ${trBlock}
                        ${vocabHtml}
                    </div>
                `;
            });
            if (uniqueGrammarRules.size > 0) {
                htmlContent += `<div class="grammar-summary"><h2>🧠 Análisis Gramatical del Guion</h2><ul>`;
                uniqueGrammarRules.forEach(rule => { let cleanRule = rule.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); htmlContent += `<li>${cleanRule}</li>`; });
                htmlContent += `</ul></div>`;
            }
            htmlContent += `
                <div class="legend">
                    <h3>Leyenda de marcas en el alemán</h3>
                    <ul>
                        <li><strong>Resaltado amarillo:</strong> ítems del vocabulario de la escena.</li>
                        <li><strong>Cyan (fondo):</strong> verbos con preposición detectados.</li>
                        <li><strong>Subrayados de color:</strong> conectores; preposiciones con Dativ / Akkusativ / Wechsel.</li>
                        <li><strong>Etiquetas moradas (Tempus):</strong> referencia de formas verbales (Prät/Perf).</li>
                    </ul>
                </div>
                <div class="footer">Müller · TELC · ¡Viel Erfolg beim Deutschlernen!</div>
                <script>window.onload = function() { window.print(); }<\/script></body></html>`;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
          };

          const exportProgressPDF = () => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) { alert("Por favor, permite las ventanas emergentes (pop-ups) en tu navegador para generar el PDF."); return; }
            const htmlContent = `
                <html><head><title>Mi Resumen de Alemán - Profesor Müller</title><style>body { font-family: 'Segoe UI', sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; } h1 { color: #2563eb; text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; } h2 { color: #0f172a; margin-top: 40px; } table { width: 100%; border-collapse: collapse; margin-top: 15px; } th, td { border: 1px solid #94a3b8; padding: 12px; } th { background-color: #f1f5f9; } .diff { color: #dc2626; font-weight: bold; } .norm { color: #2563eb; } .grammar-base { color: #0891b2; }</style></head><body>
                <h1>📚 Resumen de Estudio - B1/B2</h1>
                <div><h2>🔴 Vocabulario Difícil</h2>${userStats.difficultVocab?.length ? `<table><tr><th>Alemán</th><th>Español</th></tr>${userStats.difficultVocab.map(v => `<tr><td class="diff">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>Vacío.</p>'}</div>
                <div><h2>🔵 Vocabulario Normal</h2>${userStats.normalVocab?.length ? `<table><tr><th>Alemán</th><th>Español</th></tr>${userStats.normalVocab.map(v => `<tr><td class="norm">${v.de}</td><td>${v.es}</td></tr>`).join('')}</table>` : '<p>Vacío.</p>'}</div>
                <div><h2>🧠 Reglas Gramaticales</h2>${userStats.difficultGrammar?.length ? `<table><tr><th>Regla</th><th>Ejemplo</th><th>Traducción</th></tr>${userStats.difficultGrammar.map(g => `<tr><td class="grammar-base">${g.base}</td><td><i>"${g.exampleDe}"</i></td><td>${g.exampleEs}</td></tr>`).join('')}</table>` : '<p>Vacío.</p>'}</div>
                <script>window.onload = function() { window.print(); }<\/script></body></html>
            `;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
          };

          // COLORES DE FONDO SUAVIZADOS (Corrección) + temas UI
          const getBgColor = () => {
              if (uiTheme === 'light') {
                  if (activeTab === 'inicio') return 'bg-slate-100';
                  if (activeTab === 'ruta') return 'bg-fuchsia-50';
                  if (activeTab === 'progreso') return 'bg-indigo-100';
                  if (activeTab === 'guiones') return 'bg-slate-100';
                  if (activeTab === 'vocabulario') return 'bg-amber-50';
                  if (activeTab === 'entrenamiento') return 'bg-fuchsia-50';
                  if (activeTab === 'lexikon') return 'bg-slate-100';
                  if (activeTab === 'bxbank') return 'bg-slate-100';
                  if (activeTab === 'storybuilder') return 'bg-indigo-100';
                  if (activeTab === 'historiaspro') return 'bg-emerald-50';
                  if (activeTab === 'shadowing') return 'bg-teal-50';
                  if (activeTab === 'lectura') return 'bg-sky-50';
                  if (activeTab === 'escritura') return 'bg-stone-100';
                  if (activeTab === 'telc') return 'bg-slate-100';
                  if (activeTab === 'comunidad') return 'bg-violet-50';
                  return 'bg-slate-50';
              }
              if (uiTheme === 'hc') return 'bg-black';
              if (activeTab === 'ruta') return 'bg-fuchsia-950/90';
              if (activeTab === 'comunidad') return 'bg-violet-950';
              if (activeTab === 'telc') return 'bg-slate-950';
              if (activeTab === 'inicio') return 'bg-slate-950';
              if (activeTab === 'progreso') return 'bg-indigo-950';
              if (activeTab === 'guiones') return 'bg-slate-900';
              if (activeTab === 'vocabulario') return 'bg-amber-950/70'; // Suavizado
              if (activeTab === 'entrenamiento') return 'bg-fuchsia-950/85';
              if (activeTab === 'lexikon') return 'bg-slate-900';
              if (activeTab === 'bxbank') return 'bg-slate-900'; // Suavizado
              if (activeTab === 'storybuilder') return 'bg-indigo-950'; // Suavizado
              if (activeTab === 'historiaspro') return 'bg-emerald-950/80';
              if (activeTab === 'shadowing') return 'bg-teal-950/90';
              if (activeTab === 'lectura') return 'bg-sky-950/90';
              if (activeTab === 'escritura') return 'bg-stone-950';
              if (fluesternMode) return 'bg-zinc-900 filter contrast-125 sepia-50'; 
              if (isReviewing || practiceActive) return 'bg-gray-900'; // Suavizado
              const speaker = guionData[getActualSceneIndex()]?.speaker;
              if (speaker === 'Lukas') return 'bg-slate-900';
              if (speaker === 'Elena' || speaker === 'Anna') return 'bg-slate-800'; // Suavizado
              if (speaker?.includes('Weber') || speaker === 'Professor') return 'bg-emerald-950';
              return 'bg-gray-900'; 
          };
          const themeShellClass = uiTheme === 'light' ? 'muller-theme-light' : uiTheme === 'hc' ? 'muller-theme-hc' : '';

          const currentPracticeList = practiceActive === 'diff' ? userStats.difficultVocab : (practiceActive === 'norm' ? userStats.normalVocab : userStats.difficultGrammar);
          const currentPracticeItem = currentPracticeList ? currentPracticeList[practiceIndex] : null;

          /** Lienzo para lápiz óptico / dedo: pointer capture, sin scroll al trazar. Herramientas: lápiz, goma, marcador, subrayado + deshacer. */
          const TabletWritingCanvas = ({ padKey, grid, strokeW, compareTarget, onOcrCompared, snapshotData, snapshotPadKey, onSnapshotChange, backgroundImageData = '' }) => {
              const wrapRef = useRef(null);
              const canvasRef = useRef(null);
              const ctxRef = useRef(null);
              const drawingRef = useRef(false);
              const movedRef = useRef(false);
              const lastPtRef = useRef({ x: 0, y: 0 });
              const undoStackRef = useRef([]);
              const sizeRef = useRef({ w: 400, h: 400 });
              const strokeWRef = useRef(strokeW);
              strokeWRef.current = strokeW;
              const [writingTool, setWritingTool] = useState('pen');
              const [penColor, setPenColor] = useState('#f1f5f9');
              const [eraserW, setEraserW] = useState(18);
              const [hlPreset, setHlPreset] = useState('yellow');
              const [hlWidth, setHlWidth] = useState(24);
              const [ocrLoading, setOcrLoading] = useState(false);
              const [ocrText, setOcrText] = useState('');
              const [ocrHint, setOcrHint] = useState('');
              const [ocrErr, setOcrErr] = useState('');
              const [ocrComparePct, setOcrComparePct] = useState(null);
              const [canUndo, setCanUndo] = useState(false);
              const currentHlPathRef = useRef([]);
              const strokeBaseRef = useRef(null);

              const HL_MAP = useMemo(() => ({
                  yellow: 'rgba(250, 204, 21, 0.42)',
                  green: 'rgba(74, 222, 128, 0.42)',
                  pink: 'rgba(244, 114, 182, 0.42)',
                  orange: 'rgba(251, 146, 60, 0.42)',
                  blue: 'rgba(96, 165, 250, 0.45)',
                  cyan: 'rgba(34, 211, 238, 0.42)',
              }), []);

              const layoutCanvas = useCallback(() => {
                  const canvas = canvasRef.current;
                  const wrap = wrapRef.current;
                  if (!canvas || !wrap) return;
                  const w = wrap.clientWidth;
                  const h = Math.max(360, Math.min(680, Math.floor((typeof window !== 'undefined' ? window.innerHeight : 700) * 0.52)));
                  const dpr = window.devicePixelRatio || 1;
                  sizeRef.current = { w, h };
                  canvas.width = w * dpr;
                  canvas.height = h * dpr;
                  canvas.style.width = `${w}px`;
                  canvas.style.height = `${h}px`;
                  const ctx = canvas.getContext('2d');
                  ctx.setTransform(1, 0, 0, 1, 0, 0);
                  ctx.scale(dpr, dpr);
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctxRef.current = ctx;
                  undoStackRef.current = [];
                  setCanUndo(false);
              }, [padKey]);

              useEffect(() => { layoutCanvas(); }, [layoutCanvas]);
              useEffect(() => {
                  const canvas = canvasRef.current;
                  const ctx = ctxRef.current;
                  if (!canvas || !ctx) return;
                  let cancelled = false;
                  const drawSnapshot = () => {
                      if (!snapshotData || snapshotPadKey !== padKey) return;
                      const img = new Image();
                      img.onload = () => {
                          if (cancelled) return;
                          try { ctx.drawImage(img, 0, 0, sizeRef.current.w, sizeRef.current.h); } catch (err) {}
                      };
                      img.src = snapshotData;
                  };
                  ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
                  if (backgroundImageData) {
                      const bg = new Image();
                      bg.onload = () => {
                          if (cancelled) return;
                          try { ctx.drawImage(bg, 0, 0, sizeRef.current.w, sizeRef.current.h); } catch (err) {}
                          drawSnapshot();
                      };
                      bg.src = backgroundImageData;
                  } else {
                      drawSnapshot();
                  }
                  return () => { cancelled = true; };
              }, [snapshotData, snapshotPadKey, padKey, backgroundImageData]);

              const getPos = (e) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return { x: 0, y: 0 };
                  const rect = canvas.getBoundingClientRect();
                  let cx = e.clientX;
                  let cy = e.clientY;
                  if (e.touches && e.touches[0]) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
                  else if (e.changedTouches && e.changedTouches[0]) { cx = e.changedTouches[0].clientX; cy = e.changedTouches[0].clientY; }
                  return { x: cx - rect.left, y: cy - rect.top };
              };

              const applyStrokeStyle = (ctx, tool) => {
                  ctx.globalAlpha = 1;
                  ctx.globalCompositeOperation = 'source-over';
                  ctx.shadowBlur = 0;
                  if (tool === 'eraser') {
                      ctx.globalCompositeOperation = 'destination-out';
                      ctx.strokeStyle = 'rgba(0,0,0,1)';
                      ctx.fillStyle = 'rgba(0,0,0,1)';
                      ctx.lineWidth = eraserW;
                  } else if (tool === 'highlighter') {
                      ctx.strokeStyle = HL_MAP[hlPreset] || HL_MAP.yellow;
                      ctx.lineWidth = hlWidth;
                      ctx.globalAlpha = 1;
                  } else if (tool === 'underline') {
                      ctx.strokeStyle = '#38bdf8';
                      ctx.lineWidth = 3;
                  } else {
                      ctx.strokeStyle = penColor;
                      ctx.lineWidth = strokeWRef.current;
                  }
              };

              const drawSegment = (ctx, x0, y0, x1, y1, tool) => {
                  ctx.save();
                  applyStrokeStyle(ctx, tool);
                  ctx.beginPath();
                  if (tool === 'underline') {
                      const o = 12;
                      ctx.moveTo(x0, y0 + o);
                      ctx.lineTo(x1, y1 + o);
                  } else {
                      ctx.moveTo(x0, y0);
                      ctx.lineTo(x1, y1);
                  }
                  ctx.stroke();
                  ctx.restore();
              };

              const stampDot = (ctx, x, y, tool) => {
                  ctx.save();
                  applyStrokeStyle(ctx, tool);
                  ctx.beginPath();
                  if (tool === 'underline') {
                      ctx.fillStyle = '#38bdf8';
                      ctx.arc(x, y + 12, 1.4, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                  } else if (tool === 'eraser') {
                      ctx.arc(x, y, eraserW * 0.45, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                  } else if (tool === 'highlighter') {
                      ctx.fillStyle = HL_MAP[hlPreset] || HL_MAP.yellow;
                      ctx.arc(x, y, Math.max(6, hlWidth * 0.38), 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                      return;
                  } else {
                      ctx.fillStyle = penColor;
                      ctx.arc(x, y, Math.max(1.2, strokeWRef.current * 0.45), 0, Math.PI * 2);
                  }
                  ctx.fill();
                  ctx.restore();
              };

              const pushUndoBeforeStroke = () => {
                  const canvas = canvasRef.current;
                  const ctx = ctxRef.current;
                  if (!canvas || !ctx) return;
                  try {
                      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
                      undoStackRef.current.push(snap);
                      if (undoStackRef.current.length > 12) undoStackRef.current.shift();
                      setCanUndo(undoStackRef.current.length > 0);
                  } catch (err) {}
              };

              const undoLastStroke = () => {
                  const canvas = canvasRef.current;
                  const ctx = ctxRef.current;
                  if (!canvas || !ctx || undoStackRef.current.length === 0) return;
                  const snap = undoStackRef.current.pop();
                  try {
                      ctx.putImageData(snap, 0, 0);
                  } catch (err) {}
                  setCanUndo(undoStackRef.current.length > 0);
                  try {
                      if (typeof onSnapshotChange === 'function' && canvasRef.current) onSnapshotChange(canvasRef.current.toDataURL('image/png'));
                  } catch (err) {}
              };

              const startDraw = (e) => {
                  e.preventDefault();
                  const ctx = ctxRef.current;
                  if (!ctx) return;
                  try { if (e.pointerId != null) canvasRef.current.setPointerCapture(e.pointerId); } catch (err) {}
                  pushUndoBeforeStroke();
                  drawingRef.current = true;
                  movedRef.current = false;
                  const p = getPos(e);
                  lastPtRef.current = { x: p.x, y: p.y };
                  if (writingTool === 'highlighter') {
                      const canvas = canvasRef.current;
                      try { strokeBaseRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height); } catch(err) { strokeBaseRef.current = null; }
                      currentHlPathRef.current = [{ x: p.x, y: p.y }];
                  }
              };
              const moveDraw = (e) => {
                  e.preventDefault();
                  if (!drawingRef.current || !ctxRef.current) return;
                  const ctx = ctxRef.current;
                  const p = getPos(e);
                  const lx = lastPtRef.current.x;
                  const ly = lastPtRef.current.y;
                  if (Math.hypot(p.x - lx, p.y - ly) < 0.35) return;
                  movedRef.current = true;
                  if (writingTool === 'highlighter') {
                      currentHlPathRef.current.push({ x: p.x, y: p.y });
                      if (strokeBaseRef.current) { try { ctx.putImageData(strokeBaseRef.current, 0, 0); } catch(err) {} }
                      ctx.save();
                      applyStrokeStyle(ctx, 'highlighter');
                      ctx.beginPath();
                      const pts = currentHlPathRef.current;
                      ctx.moveTo(pts[0].x, pts[0].y);
                      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
                      ctx.stroke();
                      ctx.restore();
                  } else {
                      drawSegment(ctx, lx, ly, p.x, p.y, writingTool);
                  }
                  lastPtRef.current = { x: p.x, y: p.y };
              };
              const endDraw = (e) => {
                  e.preventDefault();
                  if (drawingRef.current && ctxRef.current && !movedRef.current) {
                      const p = lastPtRef.current;
                      stampDot(ctxRef.current, p.x, p.y, writingTool);
                  }
                  drawingRef.current = false;
                  movedRef.current = false;
                  currentHlPathRef.current = [];
                  strokeBaseRef.current = null;
                  try { if (e.pointerId != null) canvasRef.current.releasePointerCapture(e.pointerId); } catch (err) {}
                  try {
                      if (typeof onSnapshotChange === 'function' && canvasRef.current) onSnapshotChange(canvasRef.current.toDataURL('image/png'));
                  } catch (err) {}
              };

              const clearPad = () => {
                  const ctx = ctxRef.current;
                  const { w, h } = sizeRef.current;
                  if (!ctx) return;
                  ctx.clearRect(0, 0, w, h);
                  if (backgroundImageData) {
                      const bg = new Image();
                      bg.onload = () => {
                          try { ctx.drawImage(bg, 0, 0, w, h); } catch (err) {}
                      };
                      bg.src = backgroundImageData;
                  }
                  undoStackRef.current = [];
                  setCanUndo(false);
                  if (typeof onSnapshotChange === 'function') onSnapshotChange('');
              };
              const savePng = () => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const link = document.createElement('a');
                  link.download = `muller_escritura_${Date.now()}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
              };

              const canvasToBlackOnWhite = (source) => {
                  const w = source.width;
                  const h = source.height;
                  const tmp = document.createElement('canvas');
                  tmp.width = w;
                  tmp.height = h;
                  const sctx = source.getContext('2d');
                  const tctx = tmp.getContext('2d');
                  const img = sctx.getImageData(0, 0, w, h);
                  const d = img.data;
                  const out = tctx.createImageData(w, h);
                  const o = out.data;
                  for (let i = 0; i < d.length; i += 4) {
                      const a = d[i + 3];
                      const v = a > 40 ? 0 : 255;
                      o[i] = v;
                      o[i + 1] = v;
                      o[i + 2] = v;
                      o[i + 3] = 255;
                  }
                  tctx.putImageData(out, 0, 0);
                  return tmp;
              };

              const runHandwritingOcr = async () => {
                  if (typeof Tesseract === 'undefined') {
                      setOcrErr('No se pudo cargar Tesseract.js. Comprueba la conexión y recarga.');
                      return;
                  }
                  const source = canvasRef.current;
                  if (!source || source.width < 8) return;
                  setOcrErr('');
                  setOcrText('');
                  setOcrComparePct(null);
                  setOcrLoading(true);
                  setOcrHint('Preparando imagen…');
                  let worker;
                  try {
                      const bw = canvasToBlackOnWhite(source);
                      worker = await Tesseract.createWorker('deu', 1, {
                          logger: (m) => {
                              if (m.status === 'recognizing text' && m.progress != null) setOcrHint(`Leyendo… ${Math.round(100 * m.progress)}%`);
                              else if (m.status && String(m.status).includes('loading')) setOcrHint('Descargando modelo alemán (solo la 1ª vez, ~2–5 MB)…');
                              else if (m.status) setOcrHint(String(m.status));
                          },
                      });
                      const { data: { text } } = await worker.recognize(bw);
                      await worker.terminate();
                      worker = null;
                      const t = (text || '').replace(/\s+\n/g, '\n').trim();
                      setOcrText(t);
                      let computedPct = null;
                      if (compareTarget && t) {
                          const a = normalizeGermanSpeechText(compareTarget);
                          const b = normalizeGermanSpeechText(t);
                          if (a.length && b.length) {
                              const dist = levenshteinDistance(a, b);
                              const maxL = Math.max(a.length, b.length, 1);
                              computedPct = Math.min(100, Math.max(0, Math.round((100 * (maxL - dist)) / maxL)));
                              setOcrComparePct(computedPct);
                          } else setOcrComparePct(null);
                      } else setOcrComparePct(null);
                      if (!t) setOcrHint('No se detectó texto. Escribe más grande o con más contraste.');
                      else setOcrHint('');
                      if (typeof onOcrCompared === 'function' && (computedPct != null || t)) {
                          onOcrCompared({
                              pct: computedPct,
                              textSnippet: (t || '').slice(0, 120),
                              targetSnippet: typeof compareTarget === 'string' ? compareTarget.slice(0, 120) : '',
                              recognizedText: t || ''
                          });
                      }
                  } catch (err) {
                      if (worker) try { await worker.terminate(); } catch (e) {}
                      setOcrErr(err?.message || 'Error en OCR');
                      setOcrHint('');
                  } finally {
                      setOcrLoading(false);
                  }
              };

              const canvasCursor = writingTool === 'eraser' ? 'cell' : writingTool === 'highlighter' ? 'copy' : 'crosshair';

              return (
                  <div className="space-y-3">
                      <div className="rounded-xl border border-white/10 bg-black/25 p-2 md:p-3 space-y-2">
                          <p className="text-[10px] font-bold text-rose-300/90 uppercase tracking-wider text-center md:text-left">Herramientas</p>
                          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                              {[
                                  { id: 'pen', label: 'Lápiz', icon: 'pen-line', title: 'Trazo normal (usa el grosor de abajo)' },
                                  { id: 'eraser', label: 'Goma', icon: 'eraser', title: 'Borra solo lo que pasas por encima (elige ancho de goma)' },
                                  { id: 'highlighter', label: 'Marcador', icon: 'highlighter', title: 'Resalta como fluorescente (encima del texto)' },
                                  { id: 'underline', label: 'Subrayado', icon: 'minus', title: 'Línea fina bajo el trazo (subrayar palabras)' },
                              ].map((t) => (
                                  <button
                                      key={t.id}
                                      type="button"
                                      title={t.title}
                                      onClick={() => setWritingTool(t.id)}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] md:text-xs font-bold border transition ${writingTool === t.id ? 'bg-rose-700 border-rose-400/60 text-white shadow' : 'bg-slate-800/90 border-white/10 text-gray-400 hover:text-white'}`}
                                  >
                                      <Icon name={t.icon} className="w-3.5 h-3.5 shrink-0 opacity-90" />
                                      {t.label}
                                  </button>
                              ))}
                          </div>
                          {writingTool === 'pen' && (
                              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-slate-500">Tinta:</span>
                                  {[
                                      { c: '#f1f5f9', lab: 'Blanco' },
                                      { c: '#60a5fa', lab: 'Azul' },
                                      { c: '#f87171', lab: 'Rojo' },
                                      { c: '#c4b5fd', lab: 'Violeta' },
                                  ].map((x) => (
                                      <button key={x.c} type="button" title={x.lab} onClick={() => setPenColor(x.c)} className={`w-7 h-7 rounded-full border-2 shrink-0 ${penColor === x.c ? 'border-white ring-2 ring-rose-400/80' : 'border-white/20'}`} style={{ background: x.c }} />
                                  ))}
                              </div>
                          )}
                          {writingTool === 'eraser' && (
                              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-slate-500">Ancho goma:</span>
                                  {[10, 18, 28, 42].map((ew) => (
                                      <button key={ew} type="button" onClick={() => setEraserW(ew)} className={`px-2 py-1 rounded-md text-[10px] font-black border ${eraserW === ew ? 'bg-amber-700 border-amber-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} title={`Goma ${ew}px`}>
                                          {ew}px
                                      </button>
                                  ))}
                                  <span className="text-[9px] text-slate-600 ml-1">Fino = letra · ancho = palabra</span>
                              </div>
                          )}
                          {writingTool === 'highlighter' && (
                              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1 border-t border-white/5">
                                  <span className="text-[10px] text-slate-500">Color:</span>
                                  {[
                                      { id: 'yellow', bg: 'bg-yellow-400' },
                                      { id: 'green', bg: 'bg-green-400' },
                                      { id: 'pink', bg: 'bg-pink-400' },
                                      { id: 'orange', bg: 'bg-orange-400' },
                                      { id: 'blue', bg: 'bg-blue-400' },
                                      { id: 'cyan', bg: 'bg-cyan-400' },
                                  ].map((h) => (
                                      <button key={h.id} type="button" onClick={() => setHlPreset(h.id)} className={`w-8 h-5 rounded border-2 ${h.bg} ${hlPreset === h.id ? 'border-white ring-1 ring-rose-300' : 'border-white/20'}`} title={h.id} />
                                  ))}
                                  <span className="text-[10px] text-slate-500 ml-1">Ancho:</span>
                                  {[16, 24, 34].map((hw) => (
                                      <button key={hw} type="button" onClick={() => setHlWidth(hw)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${hlWidth === hw ? 'bg-lime-800 text-white' : 'bg-slate-800 text-gray-500'}`}>
                                          {hw}
                                      </button>
                                  ))}
                              </div>
                          )}
                          {writingTool === 'underline' && (
                              <p className="text-[9px] text-sky-400/90 text-center md:text-left pt-1 border-t border-white/5">Subrayado: traza encima de la línea; la raya azul sale un poco más abajo (como subrayar en papel).</p>
                          )}
                      </div>
                      <div ref={wrapRef} className={grid ? 'writing-pad-wrap' : 'rounded-xl border-2 border-slate-600 bg-[#0c1222] overflow-hidden'}>
                          <canvas
                              ref={canvasRef}
                              className="writing-lab-canvas"
                              style={{ cursor: canvasCursor, touchAction: 'none' }}
                              onPointerDown={startDraw}
                              onPointerMove={moveDraw}
                              onPointerUp={endDraw}
                              onPointerLeave={endDraw}
                              onPointerCancel={endDraw}
                          />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center items-center">
                          <button type="button" onClick={undoLastStroke} disabled={!canUndo} className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-35 disabled:pointer-events-none text-sm font-bold" title="Deshacer el último trazo">
                              <span className="inline-flex items-center gap-1.5"><Icon name="undo-2" className="w-4 h-4" /> Deshacer trazo</span>
                          </button>
                          <button type="button" onClick={clearPad} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-bold" title="Vacía todo el lienzo">Borrar lienzo</button>
                          <button type="button" onClick={savePng} className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-sm font-bold">Guardar PNG</button>
                          <button
                              type="button"
                              disabled={ocrLoading}
                              onClick={runHandwritingOcr}
                              className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-sm font-bold flex items-center gap-2"
                              title="OCR gratuito en tu dispositivo (Tesseract). La primera vez descarga el idioma alemán."
                          >
                              {ocrLoading ? <span className="animate-pulse">⏳ OCR…</span> : <><Icon name="scan-line" className="w-4 h-4" /> Reconocer texto</>}
                          </button>
                      </div>
                      <p className="text-[10px] text-center text-slate-500 px-1">
                          Motor: <strong className="text-slate-400">Tesseract.js</strong> (alemán, local). El manuscrito es aproximado; la letra muy ligada o muy pequeña empeora el resultado.
                      </p>
                      {ocrComparePct !== null && (
                          <p className="text-center text-sm font-bold text-emerald-300/95">Coincidencia con el texto modelo (OCR): {ocrComparePct}%</p>
                      )}
                      {ocrHint && <p className="text-xs text-indigo-300/90 text-center">{ocrHint}</p>}
                      {ocrErr && <p className="text-xs text-red-400 text-center bg-red-950/40 rounded-lg px-2 py-1">{ocrErr}</p>}
                      {(ocrText || ocrLoading) && (
                          <div className="rounded-xl border border-indigo-600/40 bg-black/40 p-3">
                              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Texto reconocido (editable)</label>
                              <textarea
                                  className="mt-2 w-full min-h-[100px] bg-slate-900/80 border border-white/10 rounded-lg p-2 text-sm text-white font-mono"
                                  value={ocrText}
                                  onChange={(e) => setOcrText(e.target.value)}
                                  placeholder={ocrLoading ? '…' : ''}
                                  readOnly={ocrLoading}
                              />
                          </div>
                      )}
                  </div>
              );
          };

          // Componente de escritura a mano (canvas)
          const HandwritingPad = ({ onClose }) => {
              const canvasRef = useRef(null);
              const [isDrawing, setIsDrawing] = useState(false);
              const [ctx, setCtx] = useState(null);
              useEffect(() => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                      const context = canvas.getContext('2d');
                      context.lineCap = 'round';
                      context.lineJoin = 'round';
                      context.strokeStyle = '#ffffff';
                      context.lineWidth = 4;
                      setCtx(context);
                      const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
                      resize();
                      window.addEventListener('resize', resize);
                      return () => window.removeEventListener('resize', resize);
                  }
              }, []);
              const startDrawing = (e) => { e.preventDefault(); setIsDrawing(true); const { offsetX, offsetY } = getCoordinates(e); ctx.beginPath(); ctx.moveTo(offsetX, offsetY); };
              const draw = (e) => { e.preventDefault(); if (!isDrawing) return; const { offsetX, offsetY } = getCoordinates(e); ctx.lineTo(offsetX, offsetY); ctx.stroke(); };
              const stopDrawing = () => { setIsDrawing(false); };
              const getCoordinates = (e) => {
                  const canvas = canvasRef.current;
                  const rect = canvas.getBoundingClientRect();
                  let clientX, clientY;
                  if (e.touches) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
                  else { clientX = e.clientX; clientY = e.clientY; }
                  return { offsetX: clientX - rect.left, offsetY: clientY - rect.top };
              };
              const clearCanvas = () => { ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); };
              const saveDrawing = () => {
                  const canvas = canvasRef.current;
                  const image = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.download = `handwriting_${Date.now()}.png`;
                  link.href = image;
                  link.click();
              };
              return (
                  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                      <div className="bg-gray-800 rounded-2xl p-4 max-w-2xl w-full">
                          <h3 className="text-xl font-bold mb-2">✍️ Escritura a mano</h3>
                          <canvas ref={canvasRef} className="handwriting-canvas" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
                          <div className="flex gap-3 mt-4">
                              <button onClick={clearCanvas} className="bg-gray-600 px-4 py-2 rounded-lg">Borrar</button>
                              <button onClick={saveDrawing} className="bg-green-600 px-4 py-2 rounded-lg">Guardar dibujo</button>
                              <button onClick={onClose} className="bg-red-600 px-4 py-2 rounded-lg">Cerrar</button>
                          </div>
                      </div>
                  </div>
              );
          };

          const writingScriptOptions = useMemo(() => {
              const out = [];
              if (Array.isArray(savedScripts)) {
                  savedScripts.forEach((s) => {
                      try {
                          const rows = JSON.parse(s.data || '[]');
                          const count = Array.isArray(rows) ? rows.filter((r) => r && typeof r.text === 'string' && r.text.trim()).length : 0;
                          out.push({ id: String(s.id), title: s.title || 'Sin título', count });
                      } catch (e) {
                          out.push({ id: String(s.id), title: s.title || 'Sin título', count: 0 });
                      }
                  });
              }
              return out;
          }, [savedScripts]);

          const writingDictationPool = useMemo(() => {
              const fromScenes = (scenes, originLabel) => {
                  if (!Array.isArray(scenes)) return [];
                  return scenes
                      .filter((s) => s && typeof s.text === 'string' && s.text.trim() && typeof s.translation === 'string' && s.translation.trim())
                      .map((s, idx) => ({
                          de: String(s.text).trim(),
                          es: String(s.translation).trim(),
                          origin: originLabel,
                          idx
                      }));
              };
              if (writingDictSource === 'builtin') {
                  return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'current_story') {
                  const rows = fromScenes(guionData, activeScriptTitle || 'Historia actual');
                  return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'all_saved') {
                  const rows = [];
                  (savedScripts || []).forEach((s) => {
                      try {
                          const scenes = JSON.parse(s.data || '[]');
                          rows.push(...fromScenes(scenes, s.title || 'Guion guardado'));
                      } catch (e) {}
                  });
                  return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
              }
              if (writingDictSource === 'one_saved') {
                  const sid = String(writingDictScriptId || '');
                  const picked = (savedScripts || []).find((s) => String(s.id) === sid);
                  if (!picked) return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  try {
                      const scenes = JSON.parse(picked.data || '[]');
                      const rows = fromScenes(scenes, picked.title || 'Guion guardado');
                      return rows.length ? rows : WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  } catch (e) {
                      return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
                  }
              }
              return WRITING_DICTATION_LINES.map((x, idx) => ({ ...x, origin: 'Base', idx }));
          }, [writingDictSource, writingDictScriptId, guionData, activeScriptTitle, savedScripts]);

          const writingCompareTarget = useMemo(() => {
              if (activeTab !== 'escritura') return null;
              if (writingMode === 'copy') return WRITING_COPY_DRILLS[writingCopyIdx % WRITING_COPY_DRILLS.length];
              if (writingMode === 'dictation') {
                  if (!writingDictationPool.length) return null;
                  return writingDictationPool[writingDictIdx % writingDictationPool.length].de;
              }
              if (writingMode === 'telc' && WRITING_TELC_TASKS.length) return WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].dePrompt;
              if (writingMode === 'letters') return LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].practice;
              if (writingMode === 'guion' && guionData.length) return guionData[Math.min(writingGuionWriteIdx, guionData.length - 1)]?.text || null;
              if (writingMode === 'vocab' && currentVocabList.length) return currentVocabList[writingVocabIdx % currentVocabList.length].de;
              return null;
          }, [activeTab, writingMode, writingCopyIdx, writingDictIdx, writingLetterIdx, writingGuionWriteIdx, writingVocabIdx, guionData, currentVocabList, writingDictationPool, writingTelcIdx]);
          const getSelfCheckItems = useCallback(() => {
              const items = [
                  { id: 'mic-api', label: 'Micrófono API', ok: !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') },
                  { id: 'tts-api', label: 'Voz TTS', ok: !!(window.speechSynthesis && typeof window.speechSynthesis.speak === 'function') },
                  { id: 'stories', label: 'Texto disponible', ok: String(readingTargetText || '').trim().length > 0 },
                  { id: 'lectura-mic', label: 'Lectura continua', ok: !readingListening || !!readingAutoRestartRef.current },
                  { id: 'telc-mode', label: 'TELC activo', ok: writingMode === 'telc' || WRITING_TELC_TASKS.length > 0 },
                  { id: 'telc-input', label: 'TELC teclado/lápiz', ok: writingMode !== 'telc' || ['pen', 'keyboard'].includes(writingTelcInputMode) }
              ];
              return items;
          }, [readingTargetText, readingListening, writingMode, writingTelcInputMode]);
          const runTelcWritingCoach = useCallback((rawText, task) => {
              const text = String(rawText || '').trim();
              if (!text) {
                  setWritingTelcCoach(null);
                  return;
              }
              const t = text;
              const low = normalizeGermanSpeechText(t);
              const words = low.split(/\s+/).filter(Boolean);
              const sentences = t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
              const connectors = ['weil', 'deshalb', 'außerdem', 'denn', 'damit', 'trotzdem', 'obwohl', 'zuerst', 'danach', 'zum schluss', 'daher', 'allerdings'];
              const formalMarkers = ['sehr geehrte', 'mit freundlichen grüßen', 'ich möchte', 'hiermit', 'vielen dank', 'bitte'];
              const informalMarkers = ['liebe', 'hallo', 'viele grüße', 'bis bald'];
              const hasFormal = formalMarkers.some((x) => low.includes(x));
              const hasInformal = informalMarkers.some((x) => low.includes(x));
              const connectorHits = connectors.filter((x) => low.includes(x)).length;
              const scoreTask = Math.max(0, Math.min(5, Math.round((words.length >= 65 ? 3 : words.length >= 40 ? 2 : 1) + (task && Array.isArray(task.checklist) ? Math.min(2, task.checklist.filter((c) => low.includes(normalizeGermanSpeechText(c).split(/\s+/)[0] || '')).length) : 0))));
              const scoreRegister = Math.max(0, Math.min(5, hasFormal ? 5 : hasInformal ? 3 : 2));
              const scoreCohesion = Math.max(0, Math.min(5, Math.round((sentences.length >= 4 ? 2 : 1) + Math.min(3, connectorHits))));
              const umlautHits = (t.match(/[äöüß]/gi) || []).length;
              const punctHits = (t.match(/[.,!?]/g) || []).length;
              const scoreGrammar = Math.max(0, Math.min(5, Math.round((punctHits >= 3 ? 2 : 1) + (umlautHits >= 2 ? 1 : 0) + (words.length >= 50 ? 2 : words.length >= 30 ? 1 : 0))));
              const total = scoreTask + scoreRegister + scoreCohesion + scoreGrammar;
              const max = 20;
              const pct = Math.round((total / max) * 100);
              const suggestion = [
                  scoreTask < 4 ? 'Añade más contenido concreto del encargo (datos, petición y cierre).' : null,
                  scoreRegister < 4 ? 'Refuerza registro formal TELC (Sehr geehrte..., Mit freundlichen Grüßen).' : null,
                  scoreCohesion < 4 ? 'Usa más conectores: weil, deshalb, außerdem, trotzdem.' : null,
                  scoreGrammar < 4 ? 'Revisa signos de puntuación, mayúsculas de sustantivos y umlauts.' : null
              ].filter(Boolean);
              setWritingTelcCoach({
                  total,
                  max,
                  pct,
                  scoreTask,
                  scoreRegister,
                  scoreCohesion,
                  scoreGrammar,
                  suggestionText: suggestion.length ? suggestion.join(' ') : 'Muy buen texto para TELC. Solo pule estilo y precisión.'
              });
          }, []);
          const runTelcCoachFromCurrentInput = useCallback(() => {
              if (!WRITING_TELC_TASKS.length) return;
              const task = WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length];
              const sourceText = writingTelcInputMode === 'keyboard' ? writingTelcTypedText : writingTelcLastOcrText;
              runTelcWritingCoach(sourceText, task);
          }, [writingTelcIdx, writingTelcInputMode, writingTelcTypedText, writingTelcLastOcrText, runTelcWritingCoach]);
          useEffect(() => {
              if (writingMode !== 'telc') return;
              setWritingTelcCoach(null);
          }, [writingMode, writingTelcIdx, writingTelcInputMode]);

          const persistDailyPatch = (patch) => {
              const k = 'muller_daily_v1_' + new Date().toISOString().slice(0, 10);
              setDailyChallenges((prev) => {
                  const next = { ...prev, ...patch };
                  try { localStorage.setItem(k, JSON.stringify(next)); } catch (e) {}
                  return next;
              });
          };
          const claimDailyStamp = (key) => {
              if (dailyChallenges[key]) return;
              persistDailyPatch({ [key]: true });
              saveProgress({ coins: userStats.coins + 5, activityByDay: mergeActivityPoints(12) });
          };

          const finishOnboarding = () => {
              try { localStorage.setItem(MULLER_ONBOARDING_KEY, '1'); } catch (e) {}
              setShowOnboarding(false);
              setOnboardingStep(1);
          };

          const sortedDeVoices = useMemo(() => {
              try {
                  return window.speechSynthesis.getVoices()
                      .filter((v) => v.lang && v.lang.toLowerCase().startsWith('de'))
                      .sort((a, b) => (window.__mullerRankVoiceNatural(b) || 0) - (window.__mullerRankVoiceNatural(a) || 0));
              } catch (e) { return []; }
          }, [voicesLoaded, showMullerHub, ttsPrefsEpoch]);
          const sortedEsVoices = useMemo(() => {
              try {
                  return window.speechSynthesis.getVoices()
                      .filter((v) => v.lang && v.lang.toLowerCase().startsWith('es'))
                      .sort((a, b) => (window.__mullerRankVoiceNatural(b) || 0) - (window.__mullerRankVoiceNatural(a) || 0));
              } catch (e) { return []; }
          }, [voicesLoaded, showMullerHub, ttsPrefsEpoch]);
          const healthSnapshot = useMemo(() => {
              const listeningBusy = !!(isListening || rutaListening || readingListening);
              let micOk = false;
              try {
                  micOk = !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
              } catch (e) { micOk = false; }
              let voiceCount = 0;
              try {
                  if (window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function') {
                      voiceCount = window.speechSynthesis.getVoices().length || 0;
                  }
              } catch (e) { voiceCount = 0; }
              const savedScriptsCount = Array.isArray(savedScripts) ? savedScripts.length : 0;
              const storyScenesCount = Array.isArray(guionData) ? guionData.length : 0;
              const micLabel = micOk
                  ? (listeningBusy ? 'Disponible (activo)' : 'Disponible')
                  : 'No soportado';
              const ok = micOk && voiceCount > 0 && (savedScriptsCount > 0 || storyScenesCount > 0);
              return {
                  ok,
                  micOk,
                  micLabel,
                  voiceCount,
                  savedScriptsCount,
                  storyScenesCount,
                  listeningBusy
              };
          }, [isListening, rutaListening, readingListening, savedScripts, guionData, voicesLoaded]);

          const oralLeftSec = (mode === 'interview' && oralDeadline)
              ? Math.max(0, Math.ceil((oralDeadline - Date.now()) / 1000))
              : null;
          void oralClock;
          const activeSectionMeta = useMemo(() => {
              const map = {
                  inicio: { icon: 'layout-dashboard', title: 'Inicio', desc: 'Panel rápido y continuidad', tone: 'border-indigo-500/35 bg-indigo-900/25 text-indigo-200' },
                  ruta: { icon: 'map', title: 'Ruta', desc: 'Camino A1-A2 guiado', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  historia: { icon: 'play', title: 'Historia', desc: 'Escucha, modos y simulación oral', tone: 'border-blue-500/35 bg-blue-900/25 text-blue-200' },
                  lectura: { icon: 'mic', title: 'Lectura', desc: 'Leer en voz alta y comparar', tone: 'border-sky-500/35 bg-sky-900/25 text-sky-200' },
                  shadowing: { icon: 'audio-lines', title: 'Shadowing', desc: 'Fluidez y pronunciación', tone: 'border-teal-500/35 bg-teal-900/25 text-teal-200' },
                  escritura: { icon: 'pen-line', title: 'Escritura', desc: 'Canvas, dictado y OCR', tone: 'border-rose-500/35 bg-rose-900/25 text-rose-200' },
                  vocabulario: { icon: 'book-open', title: 'Vocabulario', desc: 'SRS y recall activo', tone: 'border-amber-500/35 bg-amber-900/25 text-amber-200' },
                  entrenamiento: { icon: 'graduation-cap', title: 'Entrenamiento', desc: 'Artículos, prep. y simulacro', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  bxbank: { icon: bxBankLevel === 'b1' ? 'target' : 'layers', title: bxBankLevel === 'b1' ? 'Banco B1' : 'Banco B2', desc: 'Frases y estructuras por nivel', tone: bxBankLevel === 'b1' ? 'border-emerald-500/35 bg-emerald-900/25 text-emerald-200' : 'border-sky-500/35 bg-sky-900/25 text-sky-200' },
                  progreso: { icon: 'bar-chart', title: 'Progreso', desc: 'Métricas, export y objetivos', tone: 'border-yellow-500/35 bg-yellow-900/25 text-yellow-200' },
                  guiones: { icon: 'file-text', title: 'Biblioteca', desc: 'Guiones y distribución', tone: 'border-purple-500/35 bg-purple-900/25 text-purple-200' },
                  lexikon: { icon: 'library', title: 'Lexikon', desc: 'Diccionario y traducción', tone: 'border-cyan-500/35 bg-cyan-900/25 text-cyan-200' },
                  telc: { icon: 'clipboard-check', title: 'TELC', desc: 'Guía por niveles A1-C2', tone: 'border-orange-500/35 bg-orange-900/25 text-orange-200' },
                  storybuilder: { icon: 'sparkles', title: 'IA', desc: 'Generación y resumen de contenido', tone: 'border-fuchsia-500/35 bg-fuchsia-900/25 text-fuchsia-200' },
                  historiaspro: { icon: 'feather', title: 'Historias Pro', desc: 'ES/DE/OCR y estilización', tone: 'border-emerald-500/35 bg-emerald-900/25 text-emerald-200' },
                  comunidad: { icon: 'trophy', title: 'Comunidad', desc: 'Economía, directorio y liga', tone: 'border-violet-500/35 bg-violet-900/25 text-violet-200' },
              };
              return map[activeTab] || { icon: 'layout-dashboard', title: 'Inicio', desc: 'Panel rápido y continuidad', tone: 'border-indigo-500/35 bg-indigo-900/25 text-indigo-200' };
          }, [activeTab, bxBankLevel]);
          const activeModeBadge = useMemo(() => {
              if (activeTab === 'historia') {
                  if (mode === 'interview') return 'Modo oral B1';
                  if (podcastMode) return 'Modo podcast';
                  if (historiaAudioOnly) return 'Solo audio';
                  if (diktatMode) return 'Diktat';
                  if (puzzleMode) return 'Puzzle';
              }
              if (activeTab === 'vocabulario' && vocabSrsDueCount > 0) return `${vocabSrsDueCount} SRS pendientes`;
              if (activeTab === 'entrenamiento') return 'Simulacro y práctica avanzada';
              if (activeTab === 'bxbank') return bxBankLevel === 'b1' ? 'Banco B1 activo' : 'Banco B2 activo';
              return null;
          }, [activeTab, mode, podcastMode, historiaAudioOnly, diktatMode, puzzleMode, vocabSrsDueCount, bxBankLevel]);
          const activeSectionHint = useMemo(() => {
              const h = {
                  inicio: 'Sugerencia: abre Entrenamiento si quieres práctica tipo examen.',
                  ruta: 'Sugerencia: completa lección + huecos + voz para cerrar ciclo.',
                  historia: 'Sugerencia: escucha, repite y luego activa Diktat para consolidar.',
                  lectura: 'Sugerencia: lee completo, luego revisa solo las palabras en rojo.',
                  shadowing: 'Sugerencia: empieza con velocidad media y sube a normal.',
                  escritura: 'Sugerencia: usa modo dictado + OCR para detectar fallos.',
                  vocabulario: 'Sugerencia: marca Fácil solo si recuerdas sin mirar traducción.',
                  entrenamiento: 'Sugerencia: alterna categoría débil y simulacro corto.',
                  bxbank: 'Sugerencia: usa MIX y luego guarda tarjetas clave en escritura.',
                  progreso: 'Sugerencia: exporta backup antes de cambios grandes.',
                  guiones: 'Sugerencia: distribuye texto al Banco B1/B2 para ampliar mazos.',
                  lexikon: 'Sugerencia: guarda pares útiles y repásalos en vocabulario.',
                  telc: 'Sugerencia: elige nivel y combina con simulacro en Entrenamiento.',
                  storybuilder: 'Sugerencia: guarda siempre el guion generado en Biblioteca.',
                  historiaspro: 'Sugerencia: genera en A2/B1 y envía escenas a Historia.',
                  comunidad: 'Sugerencia: revisa economía y liga al final de cada sesión.',
              };
              return h[activeTab] || '';
          }, [activeTab]);

          return (
            <div className={`flex flex-col muller-main-fill h-[100svh] max-h-[100svh] w-full font-sans md:rounded-xl overflow-x-hidden md:overflow-hidden shadow-2xl relative transition-colors duration-500 muller-theme-bg ${reduceMotionUi ? 'muller-reduce-motion' : ''} ${themeShellClass} ${uiTheme === 'light' ? 'text-slate-900' : 'text-white'} ${getBgColor()}`}>

              {showSplash && (
                  <div className="fixed inset-0 z-[300] overflow-hidden" role="dialog" aria-modal="true" aria-label="Pantalla de inicio Profesor Plaza Müller">
                      <div className="absolute inset-0 flex flex-col">
                          <div className="flex-1" style={{ background: 'linear-gradient(180deg, #000000 0%, #000000 33%, #DD0000 33%, #DD0000 67%, #FFCE00 67%, #FFCE00 100%)' }} aria-hidden="true" />
                          <div className="h-[160px] md:h-[192px] bg-white border-y-2 border-black/20 shadow-[0_8px_25px_rgba(0,0,0,0.25)] flex items-stretch px-2 md:px-4">
                              <button
                                  type="button"
                                  onClick={() => setShowSplash(false)}
                                  className={`shrink-0 rounded-none p-0 bg-transparent border-0 h-full w-[160px] md:w-[192px] flex items-center justify-center ${splashLogoBlink ? 'animate-pulse ring-4 ring-amber-400/75' : ''}`}
                                  aria-label="Entrar a la aplicación pulsando el logo"
                                  title="Pulsa el logo para entrar"
                              >
                                  <img
                                      src="./icons/profesor-plaza-muller-logo.jpg"
                                      alt="Logo Profesor Plaza Müller"
                                      className="h-full w-full object-cover"
                                  />
                              </button>
                              <div className="ml-2 md:ml-3 flex-1 h-full flex items-center justify-center overflow-hidden">
                                  <p className="w-full text-center text-black font-black uppercase tracking-[0.04em] whitespace-nowrap text-[clamp(1.35rem,5.4vw,4.15rem)] leading-none">
                                      PROFESOR PLAZA MÜLLER
                                  </p>
                              </div>
                          </div>
                          <div className="flex-1" style={{ background: 'linear-gradient(180deg, #AA151B 0%, #AA151B 33%, #F1BF00 33%, #F1BF00 67%, #AA151B 67%, #AA151B 100%)' }} aria-hidden="true" />
                      </div>
                  </div>
              )}
              
              {/* SUPERIOR NAV BAR */}
              <div className="muller-top-nav fixed top-0 left-0 right-0 w-full bg-gradient-to-b from-zinc-900/95 via-black/90 to-black/95 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.35)] p-1.5 md:p-2.5 pt-[max(0.35rem,env(safe-area-inset-top,0px))] flex flex-col gap-1.5 justify-stretch items-stretch z-20">
                  <div className="flex flex-col gap-1.5 w-full min-w-0">
                      <div className="muller-nav-row gap-1.5 md:gap-2 bg-zinc-950/85 p-1 md:p-1.5 rounded-2xl ring-1 ring-white/[0.1] w-full min-w-0 touch-manipulation">
                      <button onClick={()=>{setActiveTab('inicio'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'inicio' ? 'bg-indigo-600 text-white shadow-[0_0_18px_rgba(79,70,229,0.5)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="layout-dashboard" className="w-4 h-4 md:w-5 md:h-5" /> Inicio</button>
                      <button onClick={()=>{setActiveTab('ruta'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'ruta' ? 'bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="map" className="w-4 h-4 md:w-5 md:h-5" /> Ruta</button>
                      <button onClick={()=>{setActiveTab('historia'); setMode('dialogue'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'historia' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="play" className="w-4 h-4 md:w-5 md:h-5" /> Historia</button>
                      <button onClick={()=>{setActiveTab('lectura'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'lectura' ? 'bg-sky-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="mic" className="w-4 h-4 md:w-5 md:h-5" /> Lectura</button>
                      <button onClick={()=>{setActiveTab('shadowing'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'shadowing' ? 'bg-teal-600 text-white shadow-[0_0_18px_rgba(13,148,136,0.5)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="audio-lines" className="w-4 h-4 md:w-5 md:h-5" /> Shadowing</button>
                      <button onClick={()=>{setActiveTab('escritura'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'escritura' ? 'bg-rose-700 text-white shadow-[0_0_18px_rgba(190,18,60,0.45)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="pen-line" className="w-4 h-4 md:w-5 md:h-5" /> Escritura</button>
                      <button onClick={()=>{setActiveTab('vocabulario'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'vocabulario' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="book-open" className="w-4 h-4 md:w-5 md:h-5" /> Vocab{vocabSrsDueCount > 0 ? <span className="ml-0.5 min-w-[1.1rem] px-1 rounded-full bg-white/20 text-[10px] font-black leading-none py-0.5" title="Tarjetas prioritarias SRS en la lista actual">{vocabSrsDueCount > 99 ? '99+' : vocabSrsDueCount}</span> : null}</button>
                      <button onClick={()=>{setActiveTab('entrenamiento'); stopAudio(); setPracticeActive(null);}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'entrenamiento' ? 'bg-fuchsia-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.6)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="graduation-cap" className="w-4 h-4 md:w-5 md:h-5" /> Entrena</button>
                      <button onClick={()=>{setActiveTab('bxbank'); setBxBankLevel('b1'); stopAudio(); setPracticeActive(null); setBxCategory('mix');}} className={`flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-black text-[13px] md:text-sm min-h-[3rem] transition border ${activeTab === 'bxbank' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.8)] ring-1 ring-white/25 border-white/20' : 'text-gray-300 hover:text-white whitespace-nowrap bg-white/[0.02] hover:bg-white/[0.08] border-white/0 hover:border-white/20'}`}><Icon nav name="target" className="w-4 h-4 md:w-5 md:h-5" /> Banco B1/B2</button>
                      </div>

                  <div className="flex w-full min-w-0 flex-col gap-1.5 border-t border-b border-white/[0.08] py-1.5 sm:flex-row sm:items-center sm:justify-between bg-black/20">
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                      <button type="button" onClick={() => window.__MULLER_OPEN_EXERCISE_HELP && window.__MULLER_OPEN_EXERCISE_HELP('nav_inicio')} className="text-[10px] font-black text-amber-200/90 hover:text-white underline underline-offset-2 px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10" title="Ayuda contextual rápida">
                          Ayuda
                      </button>
                      <span className="inline-flex flex-col items-center gap-0.5">
                          <button type="button" aria-label="Centro Müller: voces, plan del día y ayuda" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); }} className="bg-gradient-to-br from-sky-600 to-indigo-900 hover:from-sky-500 hover:to-indigo-800 text-white p-2 rounded-full shadow-lg ring-2 ring-white/15 transition" title="Voces del sistema, plan del día, retos y tour">
                              <Icon name="layout-dashboard" className="w-5 h-5" />
                          </button>
                      </span>
                  </div>

                  <div className={`flex min-w-0 flex-1 items-center gap-1.5 md:gap-3 justify-end sm:justify-end ${userMenuOpen ? 'overflow-visible' : 'overflow-x-auto'}`}>
                      <div className="flex items-center gap-2 md:gap-3 bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/20 whitespace-nowrap">
                          <div className="relative flex items-center mr-1 md:mr-2 border-r border-white/20 pr-2 md:pr-3" ref={userMenuWrapRef}>
                              <button
                                  type="button"
                                  id="muller-user-menu-trigger"
                                  aria-haspopup="menu"
                                  aria-expanded={userMenuOpen}
                                  aria-controls="muller-user-menu"
                                  onClick={() => setUserMenuOpen((o) => !o)}
                                  className="flex items-center gap-1.5 min-h-[2.25rem] rounded-lg pl-0.5 pr-1.5 py-0.5 -my-0.5 text-left touch-manipulation hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80"
                                  title="Menú de cuenta"
                              >
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-900 text-sm font-black text-white ring-1 ring-white/20">
                                      {(String(userStats.username || 'E').trim().charAt(0) || '?').toUpperCase()}
                                  </span>
                                  <span className="flex min-w-0 flex-col items-start leading-tight">
                                      <span className="flex max-w-[7.5rem] items-center gap-1 truncate text-[11px] font-bold uppercase tracking-wide text-amber-400 md:max-w-[9rem]">
                                          {userStats.isPremium ? <Icon name="crown" className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" /> : <Icon name="user-circle" className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" />}
                                          <span className="truncate">{userStats.username || 'Estudiante'}</span>
                                      </span>
                                      <span className="hidden text-[9px] font-semibold normal-case tracking-normal text-gray-500 sm:inline">Sync: {cloudSyncLabel}</span>
                                  </span>
                                  <Icon name="chevron-down" className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition md:h-4 md:w-4 ${userMenuOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {userMenuOpen && (
                                  <div
                                      id="muller-user-menu"
                                      role="menu"
                                      aria-labelledby="muller-user-menu-trigger"
                                      className="absolute right-0 top-[calc(100%+6px)] z-[130] min-w-[15rem] max-w-[min(18rem,calc(100vw-1.5rem))] rounded-xl border border-white/12 bg-zinc-950/98 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl ring-1 ring-white/5"
                                  >
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setProfileSettingsTab('perfil');
                                              setShowProfileSettingsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="user-circle" className="h-4 w-4 shrink-0 text-amber-400" /> Perfil / cuenta
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setProfileSettingsTab('ajustes');
                                              setShowProfileSettingsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="settings" className="h-4 w-4 shrink-0 text-sky-400" /> Ajustes premium
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setActiveTab('progreso');
                                              stopAudio();
                                              setPracticeActive(null);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="bar-chart" className="h-4 w-4 shrink-0 text-yellow-400" /> Progreso y exportar PDF/Anki
                                      </button>
                                      <div className="my-1 border-t border-white/10" role="separator" />
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              window.dispatchEvent(new Event('muller-export-full-backup'));
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="download" className="h-4 w-4 shrink-0 text-sky-400" /> Exportar backup (JSON)
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              const el = document.getElementById('muller-backup-file-input');
                                              if (el) el.click();
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="upload" className="h-4 w-4 shrink-0 text-indigo-400" /> Importar datos…
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setShowMullerHub(true);
                                              setMullerHubTab('tips');
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="lightbulb" className="h-4 w-4 shrink-0 text-amber-300" /> Consejos y tour
                                      </button>
                                      <button
                                          type="button"
                                          role="menuitem"
                                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
                                          onClick={() => {
                                              setShowShortcutsModal(true);
                                              setUserMenuOpen(false);
                                          }}
                                      >
                                          <Icon name="keyboard" className="h-4 w-4 shrink-0 text-gray-300" /> Atajos de teclado
                                      </button>
                                  </div>
                              )}
                          </div>
                          <span className="flex items-center gap-1 font-black text-red-500 text-xs md:text-sm"><Icon name="heart" className="w-3 h-3 md:w-4 md:h-4 fill-current" /> {userStats.hearts}</span>
                          <span className="flex items-center gap-1 font-black text-yellow-400 text-xs md:text-sm"><Icon name="coins" className="w-3 h-3 md:w-4 md:h-4 fill-current" /> {coinsUiLabel}</span>
                      </div>
                      {activeTab === 'historia' && (
                          <div className="flex relative">
                              <button type="button" onClick={() => setShowHistoriaMenu(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border whitespace-nowrap ${showHistoriaMenu ? 'bg-blue-700 border-blue-500 text-white' : 'bg-black/50 border-white/20 text-gray-200 hover:bg-white/10'}`}>
                                  <Icon name="sliders-horizontal" className="w-3.5 h-3.5" /> Opciones Historia
                              </button>
                              {showHistoriaMenu && (
                                  <>
                                      <div className="fixed inset-0 z-[199] bg-black/60" onClick={() => setShowHistoriaMenu(false)} />
                                      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-3 flex flex-col gap-1.5 w-[90vw] max-w-xs">
                                          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest px-1 pb-0.5">Opciones Historia</p>
                                          <button onClick={()=>{setPodcastMode(v=>!v); setBlindMode(false); setDiktatMode(false); setPuzzleMode(false); setHistoriaAudioOnly(false); setShowHistoriaMenu(false);}} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${podcastMode ? 'bg-indigo-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                              <Icon name="car" className="w-4 h-4 shrink-0" /> Podcast
                                          </button>
                                          <button type="button" disabled={savedScripts.length === 0} onClick={() => { setHistoriaPlaylistAllScripts(v=>!v); setShowHistoriaMenu(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${historiaPlaylistAllScripts ? 'bg-fuchsia-700 text-white' : 'text-gray-200 hover:bg-white/10'} ${savedScripts.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                              <Icon name="repeat" className="w-4 h-4 shrink-0" /> Todos los guiones
                                          </button>
                                          <button type="button" onClick={() => { setHistoriaAudioOnly(v=>!v); if (!historiaAudioOnly) setPodcastMode(false); setShowHistoriaMenu(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left ${historiaAudioOnly ? 'bg-violet-600 text-white' : 'text-gray-200 hover:bg-white/10'}`}>
                                              <Icon name="headphones" className="w-4 h-4 shrink-0" /> Solo audio
                                          </button>
                                          <div className="my-0.5 border-t border-white/10" />
                                          <button type="button" onClick={() => { setActiveTab('historia'); setMode('interview'); setOralQIdx(0); setOralDeadline(Date.now() + oralSecs * 1000); setOralClock(0); stopAudio(); setPodcastMode(false); setHistoriaAudioOnly(false); setShowHistoriaMenu(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-emerald-200 hover:bg-emerald-900/50 transition w-full text-left">
                                              <Icon name="mic" className="w-4 h-4 shrink-0" /> Oral B1
                                          </button>
                                          <button type="button" onClick={() => setShowHistoriaMenu(false)} className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white/50 hover:bg-white/10 transition w-full">
                                              Cerrar
                                          </button>
                                      </div>
                                  </>
                              )}
                          </div>
                      )}
                  </div>
                  </div>
              </div>
              </div>

              <div className="w-full border-b border-white/[0.08] bg-black/35 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 ${activeSectionMeta.tone}`}>
                          <Icon name={activeSectionMeta.icon} className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider text-cyan-300 truncate">Müller · sección activa</p>
                          <p className="text-sm font-bold text-white truncate">{activeSectionMeta.title} <span className="text-gray-400 font-semibold">· {activeSectionMeta.desc}</span></p>
                          {activeSectionHint ? <p className="text-[10px] text-gray-500 truncate">{activeSectionHint}</p> : null}
                      </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap md:justify-end">
                      {activeModeBadge ? <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-500/35 bg-amber-900/30 text-amber-200">{activeModeBadge}</span> : null}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-rose-500/35 bg-rose-950/40 text-rose-200">❤️ {userStats.hearts}</span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-500/35 bg-amber-950/40 text-amber-200">🪙 {coinsUiLabel}</span>
                      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('muller-open-profile-settings', { detail: { tab: 'ajustes' } }))} className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-sky-500/35 bg-sky-900/30 text-sky-200 hover:bg-sky-800/40 transition">Ajustes</button>
                  </div>
              </div>

              {toastItems.length > 0 && (
                  <div className="fixed top-24 right-3 z-[170] flex flex-col gap-2 max-w-[min(92vw,360px)]">
                      {toastItems.map((t) => (
                          <div key={t.id} className={`muller-glass-card rounded-xl px-3 py-2 text-xs font-bold ${t.kind === 'error' ? 'border-red-500/45 text-red-100 bg-red-900/35' : t.kind === 'success' ? 'border-emerald-500/45 text-emerald-100 bg-emerald-900/35' : 'text-sky-100'}`}>
                              {t.message}
                          </div>
                      ))}
                  </div>
              )}

              {/* MODAL LOGIN */}
              {showProfileSettingsModal && (
                  <div className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowProfileSettingsModal(false)} role="presentation">
                      <div className="bg-slate-900 border border-sky-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Perfil y ajustes">
                          <div className="flex items-center justify-between gap-2 p-4 border-b border-white/10 bg-black/35">
                              <h2 className="text-lg md:text-2xl font-black text-white flex items-center gap-2"><Icon name="settings" className="w-5 h-5 md:w-6 md:h-6 text-sky-300" /> Perfil y ajustes premium</h2>
                              <button type="button" onClick={() => setShowProfileSettingsModal(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20 text-gray-300 hover:bg-white/10">Cerrar</button>
                          </div>
                          <div className="p-3 border-b border-white/10 flex flex-wrap gap-2 bg-black/20">
                              {[
                                  { id: 'perfil', label: 'Perfil' },
                                  { id: 'ajustes', label: 'Ajustes' },
                                  { id: 'atajos', label: 'Atajos' },
                              ].map((t) => (
                                  <button key={t.id} type="button" onClick={() => setProfileSettingsTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${profileSettingsTab === t.id ? 'bg-sky-600 border-sky-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                              ))}
                          </div>
                          <div className="p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-8.5rem)]">
                              {profileSettingsTab === 'perfil' && (
                                  <div className="space-y-4">
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                          <div><p className="text-gray-500">Usuario</p><p className="font-black text-white truncate">{userStats.username || 'Estudiante'}</p></div>
                                          <div><p className="text-gray-500">Vidas</p><p className="font-black text-red-300">{userStats.hearts}</p></div>
                                          <div><p className="text-gray-500">Monedas</p><p className="font-black text-amber-300">{coinsUiLabel}</p></div>
                                          <div><p className="text-gray-500">Racha</p><p className="font-black text-orange-300">{userStats.streakDays || 0} días</p></div>
                                      </div>
                                      {unifiedAuth ? (
                                          <div className="space-y-3">
                                              <p className="text-sm text-emerald-300 font-bold">Sesión iniciada · {unifiedAuth.source === 'supabase' ? 'Supabase' : 'Local'}</p>
                                              <p className="text-xs text-gray-400">Email: {mullerMaskEmail(unifiedAuth.email)}</p>
                                              <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-2">
                                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Cambiar nombre visible</label>
                                                  <div className="flex flex-col sm:flex-row gap-2">
                                                      <input type="text" value={profileNameDraft} onChange={(e) => setProfileNameDraft(e.target.value)} className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500" placeholder="Ej: SuperKlaus" />
                                                      <button type="button" disabled={profileNameBusy} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-bold text-sm"
                                                          onClick={async () => {
                                                              const nextName = String(profileNameDraft || '').trim();
                                                              if (!nextName) { setProfileNameMsg('Escribe un nombre válido.'); return; }
                                                              setProfileNameBusy(true); setProfileNameMsg('');
                                                              try {
                                                                  if (unifiedAuth.source === 'supabase') {
                                                                      const client = mullerGetSupabaseClient();
                                                                      if (!client || !supabaseUser) throw new Error('Supabase no disponible');
                                                                      const { error: e1 } = await client.auth.updateUser({ data: { display_name: nextName } });
                                                                      if (e1) throw new Error(e1.message);
                                                                      const { error: e2 } = await client.from('profiles').upsert({ id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }, { onConflict: 'id' });
                                                                      if (e2) throw new Error(e2.message);
                                                                      setSupabaseProfile((p) => ({ ...(p || {}), id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }));
                                                                  } else {
                                                                      const map = mullerAccountsLoad(); const em = unifiedAuth.email;
                                                                      if (map[em]) { map[em].displayName = nextName; mullerAccountsSave(map); }
                                                                  }
                                                                  saveProgress({ username: nextName }); setAuthTick((x) => x + 1); setProfileNameMsg('Nombre actualizado.');
                                                              } catch (err) {
                                                                  setProfileNameMsg('No se pudo actualizar: ' + (err && err.message ? err.message : 'error'));
                                                              } finally { setProfileNameBusy(false); }
                                                          }}>{profileNameBusy ? 'Guardando…' : 'Guardar nombre'}</button>
                                                  </div>
                                                  {profileNameMsg ? <p className="text-xs text-gray-400">{profileNameMsg}</p> : null}
                                              </div>
                                              <button type="button" className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10"
                                                  onClick={async () => {
                                                      const client = mullerGetSupabaseClient();
                                                      if (unifiedAuth.source === 'supabase' && client) { try { await client.auth.signOut(); } catch (err) {} setSupabaseUser(null); setSupabaseProfile(null); }
                                                      mullerAuthLogout(); setAuthTick((x) => x + 1); setAuthPassword(''); setShowProfileSettingsModal(false);
                                                  }}>Cerrar sesión</button>
                                          </div>
                                      ) : (
                                          <div className="space-y-3">
                                              <div className="flex gap-2">
                                                  <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'login' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Entrar</button>
                                                  <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'register' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Registro gratis</button>
                                              </div>
                                              {authError ? <p className="text-sm text-red-400 font-semibold">{authError}</p> : null}
                                              <input type="email" autoComplete="email" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email" />
                                              <input type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Contraseña (mín. 6)" />
                                              {authMode === 'register' ? <input type="text" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authDisplayName} onChange={(e) => setAuthDisplayName(e.target.value)} placeholder="Nombre visible" /> : null}
                                              <button type="button" disabled={authBusy} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-black text-white"
                                                  onClick={async () => {
                                                      setAuthBusy(true); setAuthError('');
                                                      const errMap = { CRYPTO_UNAVAILABLE: 'Necesitas https o localhost para registrar con cifrado seguro.', EMAIL_INVALID: 'Introduce un email válido.', PASS_SHORT: 'La contraseña debe tener al menos 6 caracteres.', EMAIL_TAKEN: 'Ese email ya está registrado en este dispositivo.', BAD_CREDENTIALS: 'Email o contraseña incorrectos.' };
                                                      try {
                                                          const client = mullerGetSupabaseClient();
                                                          if (client) {
                                                              const em = authEmail.trim();
                                                              if (authMode === 'register') {
                                                                  const dn = (authDisplayName || userStats.username || 'Estudiante').trim();
                                                                  const { data, error } = await client.auth.signUp({ email: em, password: authPassword, options: { data: { display_name: dn } } });
                                                                  if (error) throw new Error(error.message);
                                                                  saveProgress({ username: dn });
                                                                  if (data.session && data.session.user) setSupabaseUser(data.session.user); else if (data.user) setSupabaseUser(data.user);
                                                              } else {
                                                                  const { data, error } = await client.auth.signInWithPassword({ email: em, password: authPassword });
                                                                  if (error) throw new Error(error.message);
                                                                  if (data.user) { setSupabaseUser(data.user); const meta = data.user.user_metadata && data.user.user_metadata.display_name; if (meta) saveProgress({ username: String(meta) }); }
                                                              }
                                                          } else if (authMode === 'register') { const acc = await mullerAuthRegister(authEmail, authPassword, authDisplayName || userStats.username); saveProgress({ username: acc.displayName }); }
                                                          else { const acc = await mullerAuthLogin(authEmail, authPassword); saveProgress({ username: acc.displayName }); }
                                                          setAuthPassword(''); setAuthTick((x) => x + 1); setShowProfileSettingsModal(false);
                                                      } catch (err) { setAuthError(errMap[err.message] || err.message || 'Error'); }
                                                      finally { setAuthBusy(false); }
                                                  }}>{authBusy ? '…' : authMode === 'register' ? 'Crear cuenta' : 'Entrar'}</button>
                                          </div>
                                      )}
                                  </div>
                              )}
                              {profileSettingsTab === 'ajustes' && (
                                  <div className="space-y-4">
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-sky-300 mb-2">Tema global</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[{ id: 'dark', label: 'Oscuro' }, { id: 'light', label: 'Claro' }, { id: 'hc', label: 'Alto contraste' }].map((t) => (
                                                  <button key={t.id} type="button" onClick={() => { setUiTheme(t.id); try { localStorage.setItem(MULLER_THEME_KEY, t.id); } catch (e) {} }} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${uiTheme === t.id ? 'bg-cyan-600 border-cyan-300 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>{t.label}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-300 mb-2">Audio y voz</p>
                                          <div className="flex flex-wrap gap-2 mb-3">
                                              <button type="button" onClick={() => { try { localStorage.setItem('muller_sfx_enabled', (typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled()) ? '0' : '1'); } catch (e) {} setSfxEpoch((x) => x + 1); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 bg-slate-800 text-gray-200">Sonidos: {sfxEpoch >= 0 && typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled() ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setNoiseEnabled(!noiseEnabled)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${noiseEnabled ? 'bg-amber-600 border-amber-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Ruido examen: {noiseEnabled ? 'ON' : 'OFF'}</button>
                                          </div>
                                          <p className="text-[11px] text-gray-500 mb-2">Velocidad TTS global</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[{ id: 'Lenta', rate: '0.82' }, { id: 'Normal', rate: '0.92' }, { id: 'Examen', rate: '1.00' }].map((p) => (
                                                  <button key={p.id} type="button" className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${(typeof window !== 'undefined' && (localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') === p.rate) ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} onClick={() => { try { localStorage.setItem(MULLER_TTS_RATE_KEY, p.rate); } catch (e) {} setTtsPrefsEpoch((x) => x + 1); }}>{p.id}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-2">Preferencias de uso</p>
                                          <div className="flex flex-wrap gap-2">
                                              <button type="button" onClick={() => setShowFloatingTools((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${showFloatingTools ? 'bg-cyan-700 border-cyan-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Herramientas rápidas (Ajustes): {showFloatingTools ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setReduceMotionUi((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${reduceMotionUi ? 'bg-emerald-700 border-emerald-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Reducir animaciones: {reduceMotionUi ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setPodcastMode((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${podcastMode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Podcast: {podcastMode ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => setHistoriaAudioOnly((v) => !v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${historiaAudioOnly ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-300'}`}>Solo audio: {historiaAudioOnly ? 'ON' : 'OFF'}</button>
                                              <button type="button" onClick={() => { try { localStorage.setItem(MULLER_ONBOARDING_KEY, '1'); } catch (e) {} setShowOnboarding(false); setOnboardingNever(true); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-white/15 bg-slate-800 text-gray-300">Desactivar onboarding</button>
                                              <button type="button" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); setShowProfileSettingsModal(false); }} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/30 bg-sky-900/30 text-sky-200">Más ajustes de voces…</button>
                                          </div>
                                      </div>
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                                          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">Respaldo y sincronización</p>
                                          <div className="flex flex-wrap gap-2">
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-full-backup'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/35 bg-sky-900/35 text-sky-200">Exportar backup total</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-open-backup-import'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-500/35 bg-indigo-900/35 text-indigo-200">Importar backup</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-srs-only'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/35 bg-emerald-900/35 text-emerald-200">Exportar solo SRS</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-export-decks-only'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-500/35 bg-amber-900/35 text-amber-200">Exportar solo mazos</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-show-sync-help'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-500/35 bg-teal-900/35 text-teal-200">Guía de sincronización</button>
                                              <button type="button" onClick={() => window.dispatchEvent(new Event('muller-request-mic'))} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-green-500/35 bg-green-900/35 text-green-200">Permiso de micrófono</button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                              {profileSettingsTab === 'atajos' && (
                                  <div className="space-y-2 text-sm text-gray-300">
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">?</kbd> Ayuda rápida</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">I</kbd> Inicio · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">R</kbd> Ruta · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">H</kbd> Historia</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">V</kbd> Vocab · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">P</kbd> Progreso · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">M</kbd> Centro Müller</p>
                                      <p><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">Esc</kbd> Cerrar modales</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {showLoginModal && (
                  <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <div className="bg-slate-900 border border-amber-500 p-6 md:p-8 rounded-2xl max-w-md w-full shadow-[0_0_40px_rgba(245,158,11,0.3)] text-center">
                          <Icon name="crown" className="w-12 h-12 md:w-16 md:h-16 text-amber-500 mx-auto mb-4" />
                          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Cuenta VIP</h1>
                          <input type="text" placeholder="Ej: SuperKlaus" className="w-full bg-black/50 border border-gray-600 p-3 md:p-4 rounded-xl text-white font-bold text-center mb-6 outline-none focus:border-amber-500 text-sm md:text-base" value={tempUsername} onChange={(e)=>setTempUsername(e.target.value)} />
                          <button onClick={handleRegister} className="w-full bg-amber-600 hover:bg-amber-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-lg md:text-xl shadow-xl transition">Empezar a Estudiar</button>
                      </div>
                  </div>
              )}

              {/* MODAL MUERTE */}
              {showDeathModal && (
                  <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <Icon name="heart" className="w-20 h-20 md:w-24 md:h-24 text-red-600 mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
                      <h1 className="text-3xl md:text-5xl font-black text-white mb-4 text-center">¡Te has quedado sin vidas!</h1>
                      <div className="flex gap-4">
                          <button onClick={buyHearts} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-base md:text-xl shadow-xl flex items-center gap-2"><Icon name="coins" className="w-5 h-5 md:w-6 md:h-6" /> Comprar 5 ❤️ (50 Coins)</button>
                      </div>
                  </div>
              )}

              {showOnboarding && onboardingStep >= 1 && onboardingStep <= 5 && (() => {
                  const obSteps = [
                      { t: 'Bienvenida', d: 'Müller funciona en el navegador: Historia (audio), Vocab con SRS, Escritura con OCR local, B1/B2 y Progreso. Todo gratis en este dispositivo.' },
                      { t: 'Pestañas', d: 'Arriba cambias de actividad. La pestaña Entrenamiento abre artículos, verbos y preposiciones con simulacro. El panel azul es el Centro Müller (voces, plan, ayuda).' },
                      { t: 'Temas y accesibilidad', d: 'En Centro Müller → Voces puedes elegir tema Oscuro / Claro / Alto contraste y presets de velocidad TTS (Lenta / Normal / Examen).' },
                      { t: 'Objetivos y racha', d: 'En Vocab configuras objetivo diario de tarjetas; la racha solo sube si hay actividad mínima real (umbrales fijos en el informe del Centro).' },
                      { t: 'Copia de seguridad', d: 'Ahora las acciones de exportar/importar están dentro de Perfil → Ajustes → Respaldo y sincronización. Ahí puedes hacer backup total o solo SRS / mazos, sin botones flotantes tapando la pantalla.' },
                  ];
                  const ob = obSteps[onboardingStep - 1];
                  return (
                  <div className="fixed inset-0 z-[128] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => finishOnboarding()} role="presentation">
                      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                          <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2">Onboarding · paso {onboardingStep}/5</p>
                          <h3 className="text-xl font-black text-white mb-2">{ob.t}</h3>
                          <p className="text-sm text-gray-400 mb-4 leading-relaxed">{ob.d}</p>
                          <label className="flex items-center gap-2 text-xs text-gray-500 mb-4 cursor-pointer">
                              <input type="checkbox" className="accent-sky-500" checked={onboardingNever} onChange={(e) => setOnboardingNever(e.target.checked)} />
                              No volver a mostrar (se guarda en este navegador)
                          </label>
                          <div className="flex justify-between gap-2">
                              <button type="button" className="text-xs text-gray-500" onClick={() => finishOnboarding()}>Saltar</button>
                              <button type="button" className="px-4 py-2 rounded-lg bg-sky-600 font-bold text-sm" onClick={() => (onboardingStep < 5 ? setOnboardingStep(onboardingStep + 1) : finishOnboarding())}>{onboardingStep < 5 ? 'Siguiente' : 'Empezar'}</button>
                          </div>
                      </div>
                  </div>
                  );
              })()}

              {showShortcutsModal && (
                  <div className="fixed inset-0 z-[129] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowShortcutsModal(false)} role="presentation">
                      <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-black text-white mb-3">Atajos de teclado</h3>
                          <ul className="text-sm text-gray-400 space-y-2">
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">?</kbd> — esta ayuda</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">I</kbd> — Inicio</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">R</kbd> — Ruta (A0→C1)</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">H</kbd> — Historia</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">V</kbd> — Vocabulario</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">P</kbd> — Progreso</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">M</kbd> — Centro Müller</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">O</kbd> — Comunidad (cuenta, directorio, liga)</li>
                              <li><kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-xs">Esc</kbd> — cerrar modales</li>
                          </ul>
                          <button type="button" className="mt-4 w-full py-2 rounded-xl bg-slate-700 font-bold text-sm" onClick={() => setShowShortcutsModal(false)}>Cerrar</button>
                      </div>
                  </div>
              )}

              {showVocabMixModal && (
                  <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col justify-center items-center p-4 md:p-8 animate-in zoom-in duration-300">
                      <div className="bg-slate-900 border border-purple-600/50 p-4 md:p-6 rounded-2xl max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <h2 className="text-lg md:text-xl font-black text-purple-200 flex items-center gap-2"><Icon name="shuffle" className="w-5 h-5 md:w-6 md:h-6" /> Mezclar lecciones</h2>
                              <ExerciseHelpBtn helpId="guiones_mix" compact />
                          </div>
                          <p className="text-xs text-gray-400 mb-4">Marca las lecciones que quieres incluir y pulsa Mezclar.</p>
                          <div className="flex flex-col gap-2 mb-4">
                              {customVocabLessons.map((lesson) => (
                                  <label key={lesson.id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500">
                                      <input type="checkbox" className="accent-purple-500 w-4 h-4" checked={!!mixLessonSelection[lesson.id]} onChange={(e) => setMixLessonSelection((prev) => ({ ...prev, [lesson.id]: e.target.checked }))} />
                                      <span className="text-sm text-white font-bold">{lesson.title}</span>
                                      <span className="text-[10px] text-gray-500 ml-auto">{lesson.words.length} pal.</span>
                                  </label>
                              ))}
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => setShowVocabMixModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl font-bold text-sm">Cancelar</button>
                              <button onClick={() => {
                                  const selected = customVocabLessons.filter((l) => mixLessonSelection[l.id]);
                                  if (selected.length === 0) { alert("Selecciona al menos una lección."); return; }
                                  let words = [];
                                  selected.forEach((lesson) => { words = words.concat(lesson.words); });
                                  words.sort(() => Math.random() - 0.5);
                                  const diffWords = words.filter((w) => w.diff === 1);
                                  const final = mullerSortVocabBySrs([...words, ...diffWords], mullerGetVocabSrsMap());
                                  setCurrentVocabList(final);
                                  setActiveScriptTitle("Mezcla personalizada");
                                  setVocabReviewIndex(0);
                                  setShowVocabTranslation(false);
                                  setShowVocabMixModal(false);
                                  setActiveTab('vocabulario');
                              }} className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded-xl font-bold text-sm">Mezclar e ir a Vocab</button>
                          </div>
                      </div>
                  </div>
              )}

              {showMullerHub && (
                  <div className="fixed inset-0 z-[85] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6" onClick={() => setShowMullerHub(false)} role="presentation">
                      <div role="dialog" aria-modal="true" aria-labelledby="muller-hub-title" className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                          <h2 id="muller-hub-title" className="sr-only">Centro Müller</h2>
                          <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-black/40 items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                  {[
                                      { id: 'voices', label: 'Voces' },
                                      { id: 'tips', label: 'Ayuda' },
                                      { id: 'chromeai', label: 'IA Chrome' },
                                  ].map((t) => (
                                      <button key={t.id} type="button" onClick={() => setMullerHubTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${mullerHubTab === t.id ? 'bg-sky-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                  ))}
                              </div>
                              <ExerciseHelpBtn helpId="hub_centro" compact className="!border-sky-500/30" />
                          </div>
                          <div className="p-4 md:p-5 overflow-y-auto text-sm">
                              {mullerHubTab === 'voices' && (
                                  <div className="space-y-4">
                                      <p className="text-xs text-gray-400">Las voces <strong className="text-white">neural / premium</strong> (si las trae tu navegador) suelen sonar más naturales. Todo es <strong className="text-white">gratis</strong>: usa el motor de voz del sistema (Chrome/Edge suelen traer más opciones).</p>
                                      <button
                                          type="button"
                                          className="text-[10px] font-bold text-sky-400 hover:text-white underline underline-offset-2"
                                          onClick={() => {
                                              window.speechSynthesis.getVoices();
                                              setTtsPrefsEpoch((x) => x + 1);
                                          }}
                                      >
                                          Recargar lista de voces
                                      </button>
                                      <div>
                                          <label className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Alemán (Historias, Shadowing, B1/B2…)</label>
                                          <select
                                              className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs"
                                              value={ttsDeUri}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setTtsDeUri(v);
                                                  if (v) localStorage.setItem('muller_tts_de', v);
                                                  else localStorage.removeItem('muller_tts_de');
                                                  setTtsPrefsEpoch((x) => x + 1);
                                                  window.speechSynthesis.cancel();
                                              }}
                                          >
                                              <option value="">Predeterminada (automática Müller)</option>
                                              {sortedDeVoices.map((v) => {
                                                  const uri = v.voiceURI || v.name;
                                                  return (
                                                  <option key={uri + v.name} value={uri}>{v.name} · {v.lang}{window.__mullerRankVoiceNatural(v) >= 20 ? ' ★' : ''}</option>
                                                  );
                                              })}
                                          </select>
                                          <button
                                              type="button"
                                              className="mt-2 text-xs font-bold text-sky-300 hover:text-white"
                                              onClick={() => {
                                                  const u = new SpeechSynthesisUtterance('Guten Tag, ich übe Deutsch mit Professor Müller.');
                                                  u.lang = 'de-DE';
                                                  window.__mullerApplyPreferredDeVoice(u);
                                                  u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92;
                                                  window.speechSynthesis.cancel();
                                                  window.speechSynthesis.speak(u);
                                              }}
                                          >
                                              ▶ Probar voz alemana
                                          </button>
                                      </div>
                                      <div>
                                          <label className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Español (traducciones en podcast / vocab)</label>
                                          <select
                                              className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs"
                                              value={ttsEsUri}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setTtsEsUri(v);
                                                  if (v) localStorage.setItem('muller_tts_es', v);
                                                  else localStorage.removeItem('muller_tts_es');
                                                  setTtsPrefsEpoch((x) => x + 1);
                                              }}
                                          >
                                              <option value="">Predeterminada (automática)</option>
                                              {sortedEsVoices.map((v) => {
                                                  const uri = v.voiceURI || v.name;
                                                  return (
                                                  <option key={uri + v.name} value={uri}>{v.name} · {v.lang}</option>
                                                  );
                                              })}
                                          </select>
                                          <button
                                              type="button"
                                              className="mt-2 text-xs font-bold text-amber-300 hover:text-white"
                                              onClick={() => {
                                                  const u = new SpeechSynthesisUtterance('Hola, repaso vocabulario y traducciones.');
                                                  u.lang = 'es-ES';
                                                  window.__mullerApplyPreferredEsVoice(u);
                                                  window.speechSynthesis.cancel();
                                                  window.speechSynthesis.speak(u);
                                              }}
                                          >
                                              ▶ Probar voz español
                                          </button>
                                      </div>
                                      <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                                          <p className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Velocidad TTS (preset)</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[
                                                  { id: 'slow', label: 'Lenta', rate: '0.78' },
                                                  { id: 'normal', label: 'Normal', rate: '0.92' },
                                                  { id: 'exam', label: 'Examen', rate: '1.0' },
                                              ].map((p) => (
                                                  <button key={p.id} type="button" className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${(typeof window !== 'undefined' && (localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') === p.rate) ? 'bg-violet-600 border-violet-400 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`} onClick={() => { try { localStorage.setItem(MULLER_TTS_RATE_KEY, p.rate); } catch (e) {} setTtsPrefsEpoch((x) => x + 1); }}>
                                                      {p.label} ({p.rate})
                                                  </button>
                                              ))}
                                          </div>
                                          <p className="text-[10px] text-gray-500">Historias, simulacro oral y pruebas de voz usan esta base (ajusta el slider de escena si hace falta).</p>
                                      </div>
                                      <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
                                          <p className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Tema visual</p>
                                          <div className="flex flex-wrap gap-2">
                                              {[
                                                  { id: 'dark', label: 'Oscuro' },
                                                  { id: 'light', label: 'Claro' },
                                                  { id: 'hc', label: 'Alto contraste' },
                                              ].map((t) => (
                                                  <button key={t.id} type="button" onClick={() => { setUiTheme(t.id); try { localStorage.setItem(MULLER_THEME_KEY, t.id); } catch (e) {} }} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${uiTheme === t.id ? 'bg-cyan-600 border-cyan-300 text-white' : 'bg-slate-800 border-white/10 text-gray-400'}`}>{t.label}</button>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              )}
                              {mullerHubTab === 'tips' && (
                                  <div className="space-y-3 text-xs text-gray-300">
                                      <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Atajos de teclado (fuera de campos de texto)</p>
                                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">?</kbd> o <kbd className="px-1 rounded bg-black/50 border border-white/20">Shift+/</kbd> — ayuda de atajos</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">I</kbd> — Inicio (panel principal)</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">H</kbd> — pestaña Historia</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">V</kbd> — Vocab</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">P</kbd> — Progreso</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">M</kbd> — Centro Müller</li>
                                          <li><kbd className="px-1 rounded bg-black/50 border border-white/20">Esc</kbd> — cierra paneles / ayuda</li>
                                      </ul>
                                      <p>Usa <strong className="text-white">Chrome o Edge</strong> para más voces y mejor reconocimiento de voz.</p>
                                      <p><strong className="text-white">GitHub Pages</strong> requiere HTTPS; el micrófono funciona al permitir permisos.</p>
                                      <p>Si la lista sale vacía, pulsa <strong className="text-white">Recargar lista de voces</strong> en la pestaña Voces o recarga la página.</p>
                                      <p><kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20 text-[10px]">Esc</kbd> cierra este panel.</p>
                                      <button type="button" onClick={() => { setTourStep(1); setShowMullerHub(false); }} className="w-full py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 font-bold text-xs">Repetir tour guiado (5 pasos)</button>
                                  </div>
                              )}
                              {mullerHubTab === 'chromeai' && (
                                  <div className="space-y-3 text-xs text-gray-300">
                                      <ExerciseHelpBtn helpId="hub_chrome_ai" compact className="!border-violet-500/40" />
                                      <p className="text-[11px] leading-relaxed text-gray-400">
                                          Esto usa la <strong className="text-white">IA integrada de Google Chrome</strong> (<strong className="text-violet-300">Gemini Nano</strong>): el modelo se <strong className="text-white">descarga en tu PC</strong> y luego puede funcionar <strong className="text-white">sin depender de nuestro servidor</strong>. No es la “galería” de Edge: Microsoft Edge puede tener APIs parecidas <strong className="text-gray-300">con flags</strong>.
                                      </p>
                                      <p className="text-[10px] text-gray-500">
                                          Requisitos típicos: Chrome de escritorio reciente, espacio libre en disco, modelo descargable desde Chrome. Documentación:{' '}
                                          <a className="text-sky-400 underline hover:text-white" href="https://developer.chrome.com/docs/ai/built-in" target="_blank" rel="noopener noreferrer">Built-in AI (Chrome)</a>
                                          {' · '}
                                          <a className="text-sky-400 underline hover:text-white" href="https://developer.chrome.com/docs/ai/summarizer-api" target="_blank" rel="noopener noreferrer">Summarizer API</a>
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                          <button type="button" onClick={fillChromeAiFromScene} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-[11px] border border-white/10">Cargar escena actual (Historia)</button>
                                          <button type="button" disabled={chromeAiBusy} onClick={runChromeLocalSummarize} className="px-3 py-2 rounded-xl bg-violet-700 hover:bg-violet-600 disabled:opacity-50 font-bold text-[11px] border border-violet-500/40">Resumir con Gemini Nano (local)</button>
                                      </div>
                                      <textarea
                                          className="w-full min-h-[100px] bg-black/50 border border-white/15 rounded-lg p-2 text-white font-mono text-[11px] outline-none focus:border-violet-500"
                                          placeholder="Pega aquí un texto en alemán (guion, artículo…) o usa “Cargar escena”."
                                          value={chromeAiText}
                                          onChange={(e) => setChromeAiText(e.target.value)}
                                      />
                                      {chromeAiLine ? <p className="text-[10px] text-amber-200/90">{chromeAiLine}</p> : null}
                                      {chromeAiOut ? (
                                          <div className="bg-black/40 border border-violet-800/40 rounded-xl p-3 text-[11px] text-gray-200 whitespace-pre-wrap max-h-48 overflow-y-auto">{chromeAiOut}</div>
                                      ) : null}
                                  </div>
                              )}
                          </div>
                          <div className="p-3 border-t border-white/10 flex justify-end">
                              <button type="button" onClick={() => setShowMullerHub(false)} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-bold text-sm">Cerrar</button>
                          </div>
                      </div>
                  </div>
              )}

              {tourStep >= 1 && tourStep <= 5 && (() => {
                  const steps = [
                      { t: 'Bienvenido al Entrenador Müller', d: 'Historia es el centro: escenas, audio y modos (Diktat, quiz…). Usa las pestañas arriba para cambiar de actividad.' },
                      { t: 'Voces naturales (gratis)', d: 'Pulsa el icono del panel azul: elige voz alemana y español del sistema. Prueba con el botón “Probar voz”.' },
                      { t: 'Vocab y Progreso', d: 'Fácil/Normal/Difícil programa repaso espaciado (SRS). En Progreso ves mazos y exportas a Anki.' },
                      { t: 'Entrenamiento avanzado', d: 'Entrenamiento concentra artículos, verbos y preposiciones con seguimiento de precisión.' },
                      { t: 'Shadowing, Escritura y B1/B2', d: 'Shadowing entrena pronunciación; Escritura incluye OCR; B1/B2 son frases modelo. ¡Viel Erfolg!' },
                  ];
                  const item = steps[tourStep - 1];
                  const i = tourStep - 1;
                  return (
                  <div className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4" onClick={() => setTourStep(0)}>
                      <div className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                          <h3 className="text-lg font-black text-white mb-2">{item.t}</h3>
                          <p className="text-sm text-gray-400 mb-4">{item.d}</p>
                          <div className="flex gap-2 justify-between items-center">
                              <button type="button" className="text-xs text-gray-500" onClick={() => setTourStep(0)}>Saltar</button>
                              <button type="button" className="px-4 py-2 rounded-lg bg-sky-600 font-bold text-sm" onClick={() => (i < 4 ? setTourStep(tourStep + 1) : setTourStep(0))}>{i < 4 ? 'Siguiente' : 'Listo'}</button>
                          </div>
                          <p className="text-[10px] text-gray-600 mt-3 text-center">{tourStep}/5</p>
                      </div>
                  </div>
                  );
              })()}

              {exerciseHelpId && MULLER_EXERCISE_HELP[exerciseHelpId] && (
                  <div className="fixed inset-0 z-[125] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setExerciseHelpId(null)} role="presentation">
                      <div role="dialog" aria-modal="true" aria-labelledby="exercise-help-title" className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
                          <h3 id="exercise-help-title" className="text-lg font-black text-white mb-2 pr-6">{MULLER_EXERCISE_HELP[exerciseHelpId].title}</h3>
                          <p className="text-sm text-gray-300 leading-relaxed mb-4">{MULLER_EXERCISE_HELP[exerciseHelpId].what}</p>
                          <p className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">Consejos</p>
                          <ul className="list-disc list-inside text-sm text-gray-400 space-y-2 mb-6">
                              {MULLER_EXERCISE_HELP[exerciseHelpId].tips.map((t, i) => (
                                  <li key={i}>{t}</li>
                              ))}
                          </ul>
                          <button type="button" className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm" onClick={() => setExerciseHelpId(null)}>Cerrar</button>
                          <p className="text-[10px] text-gray-600 mt-3 text-center"><kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20">Esc</kbd> también cierra</p>
                      </div>
                  </div>
              )}

              <nav className="muller-nav-row muller-mobile-bottom-nav muller-bottom-secondary-nav" aria-label="Herramientas, segunda fila fija, scroll horizontal">
                  {activeTab === 'bxbank' ? (
                      <div className="muller-bxbank-btns" aria-label="Cambio de banco B1 o B2">
                          <button type="button" onClick={() => { setBxBankLevel('b1'); setActiveTab('bxbank'); setBxCategory('mix'); stopAudio(); setPracticeActive(null); }} className={bxBankLevel === 'b1' ? 'is-active' : ''}><Icon name="target" className="w-3.5 h-3.5" />B1</button>
                          <button type="button" onClick={() => { setBxBankLevel('b2'); setActiveTab('bxbank'); setBxCategory('mix'); stopAudio(); setPracticeActive(null); }} className={bxBankLevel === 'b2' ? 'is-active' : ''}><Icon name="layers" className="w-3.5 h-3.5" />B2</button>
                      </div>
                  ) : null}
                  <button type="button" onClick={() => { setActiveTab('progreso'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'progreso' ? 'is-active' : ''}><Icon name="bar-chart" className="w-4 h-4" />Progreso</button>
                  <button type="button" onClick={() => { setActiveTab('guiones'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'guiones' ? 'is-active' : ''}><Icon name="file-text" className="w-4 h-4" />Biblioteca</button>
                  <button type="button" onClick={() => { setActiveTab('lexikon'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'lexikon' ? 'is-active' : ''}><Icon name="library" className="w-4 h-4" />Lexikon</button>
                  <button type="button" onClick={() => { setActiveTab('telc'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'telc' ? 'is-active' : ''}><Icon name="clipboard-check" className="w-4 h-4" />TELC</button>
                  <button type="button" onClick={() => { setActiveTab('storybuilder'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'storybuilder' ? 'is-active' : ''}><Icon name="sparkles" className="w-4 h-4" />IA</button>
                  <button type="button" onClick={() => { setActiveTab('historiaspro'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'historiaspro' ? 'is-active' : ''}><Icon name="feather" className="w-4 h-4" />Maestros Pro</button>
                  <button type="button" onClick={() => { setActiveTab('comunidad'); stopAudio(); setPracticeActive(null); }} className={activeTab === 'comunidad' ? 'is-active' : ''}><Icon name="trophy" className="w-4 h-4" />Comunidad</button>
              </nav>

              {/* CONTENIDO PRINCIPAL */}
              <div className={`muller-app-main flex-1 overflow-y-auto relative flex flex-col hide-scrollbar pt-[var(--muller-mobile-header-h)] pb-[calc(var(--muller-mobile-bottom-nav-h)+max(0.5rem,env(safe-area-inset-bottom,0px)))] ${activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !practiceActive ? 'muller-main-historia-pb' : ''} ${uiTheme === 'light' ? 'text-slate-900' : ''}`}>
                  
                  {activeTab === 'telc' && !practiceActive && (() => {
                      const telcPack = (window.MULLER_TELC_BY_LEVEL && window.MULLER_TELC_BY_LEVEL[telcLevel]) || (window.MULLER_TELC_BY_LEVEL && window.MULLER_TELC_BY_LEVEL.B1);
                      const tc = uiTheme === 'light' ? 'text-slate-800 border-orange-200 bg-white/90' : 'text-gray-200 border-orange-900/40 bg-black/35';
                      const tcMuted = uiTheme === 'light' ? 'text-slate-600' : 'text-gray-400';
                      const tcHeading = uiTheme === 'light' ? 'text-slate-900' : 'text-white';
                      const lvBtnOff = uiTheme === 'light' ? 'bg-slate-200/90 border-slate-300 text-slate-600 hover:bg-slate-300' : 'bg-black/30 border-white/10 text-gray-400 hover:text-white';
                      return (
                      <div className={`p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24 ${uiTheme === 'light' ? 'text-slate-900' : ''}`}>
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                              <h1 className={`text-2xl md:text-4xl font-black flex items-center gap-2 ${uiTheme === 'light' ? 'text-orange-800' : 'text-orange-300'}`}><Icon name="clipboard-check" className="w-8 h-8 md:w-10 md:h-10" /> TELC · Guía y examen</h1>
                              <ExerciseHelpBtn helpId="nav_telc" />
                          </div>
                          <p className={`text-sm mb-4 leading-relaxed ${tcMuted}`}>Orientación educativa por nivel (CEFR). No es un modelo oficial de examen: para convocatorias y modelos actuales usa <a href="https://www.telc.net" target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${uiTheme === 'light' ? 'text-orange-700' : 'text-orange-400'}`}>telc.net</a> y tu centro.</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lv) => (
                                  <button key={lv} type="button" onClick={() => setTelcLevel(lv)} className={`px-3 py-2 rounded-xl text-sm font-black border transition ${telcLevel === lv ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : lvBtnOff}`}>{lv}</button>
                              ))}
                          </div>
                          <div className={`rounded-2xl border p-4 md:p-6 mb-6 ${tc}`}>
                              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${uiTheme === 'light' ? 'text-orange-600' : 'text-orange-400/90'}`}>Nivel seleccionado</p>
                              <h2 className={`text-xl md:text-2xl font-black mb-2 ${tcHeading}`}>{telcPack.label}</h2>
                              <p className={`text-sm leading-relaxed ${tcMuted}`}>{telcPack.summary}</p>
                          </div>
                          <div className="space-y-5 text-sm mb-8">
                              {(telcPack.sections || []).map((sec, si) => (
                                  <section key={si} className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                      <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="book-open" className={`w-5 h-5 shrink-0 ${uiTheme === 'light' ? 'text-orange-600' : 'text-orange-400'}`} /> {sec.title}</h3>
                                      <ul className="list-disc list-inside space-y-1.5">
                                          {(sec.items || []).map((line, li) => (
                                              <li key={li} className={uiTheme === 'light' ? 'text-slate-700' : ''}>{line}</li>
                                          ))}
                                      </ul>
                                  </section>
                              ))}
                          </div>
                          <h2 className={`text-lg font-black mb-3 ${tcHeading}`}>Día del examen (todos los niveles)</h2>
                          <div className={`space-y-6 text-sm ${uiTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="briefcase" className="w-5 h-5" /> Qué llevar</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Documento de identidad válido (mismo que al registrarte).</li>
                                      <li>Confirmación / hoja de inscripción al examen (si el centro la envió).</li>
                                      <li>Lápiz negro o azul y goma (si el centro permite escritura a mano).</li>
                                      <li>Reloj analógico silencioso si te ayuda (sin smartwatch en sala).</li>
                                      <li>Llegada con margen: localiza baños y aula el día anterior si puedes.</li>
                                  </ul>
                              </section>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="clock" className="w-5 h-5" /> Tiempos orientativos</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Lectura: varias tareas seguidas — gestiona el reloj desde el primer minuto.</li>
                                      <li>Escritura: planifica unos minutos de borrador antes de escribir en limpio.</li>
                                      <li>Oral: suele haber preparación corta; usa notas solo si el formato lo permite.</li>
                                      <li>Escucha: en muchos centros una sola emisión — lee las preguntas antes del audio.</li>
                                  </ul>
                              </section>
                              <section className={`rounded-2xl border p-4 md:p-6 ${tc}`}>
                                  <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${tcHeading}`}><Icon name="lightbulb" className="w-5 h-5" /> Consejos</h3>
                                  <ul className="list-disc list-inside space-y-1.5">
                                      <li>Descansa bien; el cansancio penaliza sobre todo la escucha.</li>
                                      <li>Si no entiendes una instrucción, pide aclaración corta en alemán.</li>
                                      <li>En la redacción: coherencia y conectores antes que vocabulario raro.</li>
                                  </ul>
                              </section>
                          </div>
                          <div className={`rounded-xl border border-dashed border-orange-500/35 p-4 mb-6 text-xs ${uiTheme === 'light' ? 'bg-orange-50 text-slate-600' : 'bg-orange-950/20 text-gray-400'}`}>
                              Práctica tipo test: abre la pestaña <strong className={uiTheme === 'light' ? 'text-fuchsia-700' : 'text-fuchsia-300'}>Entrenamiento</strong> (artículos, verbos+prep., preposiciones) y el simulacro con cronómetro si está disponible en tu versión.
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2">
                              <button type="button" onClick={() => {
                                  const lines = [
                                      `Checklist TELC — Müller · nivel ${telcLevel}`,
                                      telcPack.label,
                                      telcPack.summary,
                                      '',
                                      'Qué llevar: DNI/documento, confirmación, lápices, llegada temprana.',
                                      'Tiempos: gestionar lectura; planificar escritura; oral con preparación; escucha única.',
                                      'Consejos: descanso, pedir aclaraciones, coherencia en la redacción.',
                                  ];
                                  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
                                  const a = document.createElement('a');
                                  a.href = URL.createObjectURL(blob);
                                  a.download = `telc_checklist_${telcLevel}_${new Date().toISOString().slice(0, 10)}.txt`;
                                  a.click();
                                  URL.revokeObjectURL(a.href);
                              }} className="px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-600 font-bold text-sm border border-orange-500/40">Exportar checklist (.txt)</button>
                              <button type="button" onClick={() => {
                                  const w = window.open('', '_blank');
                                  if (!w) return;
                                  w.document.write(`<html><head><title>TELC Müller ${telcLevel}</title></head><body style="font-family:sans-serif;padding:24px;max-width:640px;"><h1>TELC · ${telcLevel}</h1><p>${telcPack.summary}</p><p>Usa Ctrl+P para PDF.</p><h2>Checklist</h2><ul><li>Documento</li><li>Confirmación</li><li>Material de escritura</li></ul></body></html>`);
                                  w.document.close();
                                  w.print();
                              }} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10">Imprimir / PDF (navegador)</button>
                          </div>
                      </div>
                      );
                  })()}

                  {/* STORY BUILDER (sin cambios) */}
                  {activeTab === 'storybuilder' && (
                      <div className="p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 flex flex-col justify-start md:justify-center min-h-full">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-fuchsia-400"><Icon name="sparkles" className="w-6 h-6 md:w-10 md:h-10" /> AI Story Builder</h1>
                              <ExerciseHelpBtn helpId="storybuilder" />
                          </div>
                          <p className="text-fuchsia-200 mb-6 md:mb-8 text-base md:text-lg">Crea historias a medida generadas por IA utilizando el nivel y vocabulario exacto que quieres repasar.</p>
                          <p className="text-[11px] text-fuchsia-400/80 mb-4 max-w-xl leading-relaxed border border-fuchsia-800/40 rounded-xl p-3 bg-black/20">Nota: la IA integrada aquí es simulada en el navegador (sin coste). Si conectas un proveedor de IA externo, sería opcional y con <strong className="text-fuchsia-200">clave aportada por ti</strong> — no hay IA de pago centralizada en esta app.</p>
                          {!isGeneratingStory ? (
                              <div className="bg-fuchsia-900/40 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-fuchsia-500/50 shadow-2xl flex flex-col gap-4 md:gap-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                      <div>
                                          <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm">Nivel del Idioma:</label>
                                          <div className="flex gap-2 flex-wrap">
                                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                                                  <button key={lvl} onClick={()=>setAiLevel(lvl)} className={`px-2 md:px-4 py-1 md:py-2 rounded-xl font-black text-xs md:text-sm transition ${aiLevel === lvl ? 'bg-fuchsia-500 text-white shadow-lg scale-105' : 'bg-black/50 text-gray-400 hover:bg-fuchsia-900/50'}`}>{lvl}</button>
                                              ))}
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm">Temática:</label>
                                          <select className="w-full bg-black/50 border border-fuchsia-800 p-2 md:p-3 rounded-xl text-white outline-none focus:border-fuchsia-400 text-sm md:text-base" value={aiTheme} onChange={(e)=>setAiTheme(e.target.value)}>
                                              <option value="Alltag">Vida Cotidiana (Alltag)</option>
                                              <option value="Krimi">Policíaca (Krimi)</option>
                                              <option value="Beruf">Trabajo / Entrevista (Beruf)</option>
                                              <option value="Reise">Viaje y Vacaciones (Reise)</option>
                                              <option value="Abenteuer">Aventura (Abenteuer)</option>
                                              <option value="SciFi">Ciencia Ficción (SciFi)</option>
                                              <option value="Romantik">Romance (Romantik)</option>
                                              <option value="Horror">Terror (Horror)</option>
                                              <option value="Geschichte">Histórico (Geschichte)</option>
                                              <option value="Komödie">Comedia (Komödie)</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-fuchsia-300 font-bold mb-2 block uppercase tracking-widest text-xs md:text-sm flex items-center justify-between">
                                          <span>Palabras Clave (Opcional)</span>
                                          <span className="text-[10px] md:text-xs font-normal text-fuchsia-400/70 bg-fuchsia-950 px-2 py-0.5 rounded">Separadas por comas</span>
                                      </label>
                                      <textarea className="w-full h-20 md:h-24 bg-black/50 border border-fuchsia-800 p-3 md:p-4 rounded-xl text-white outline-none focus:border-fuchsia-400 resize-none font-mono text-xs md:text-sm" placeholder="Ej: der Apfel, wandern, gefährlich, sich erinnern an..." value={aiCustomWords} onChange={(e)=>setAiCustomWords(e.target.value)} />
                                  </div>
                                  <button onClick={handleGenerateAIStory} className="mt-2 w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-6 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl shadow-[0_0_30px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2 md:gap-3 transition transform hover:scale-105"><Icon name="brain" className="w-5 h-5 md:w-7 md:h-7" /> Generar Historia Mágica</button>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center h-48 md:h-64 gap-4 md:gap-6 animate-pulse">
                                  <Icon name="brain" className="w-12 h-12 md:w-20 md:h-20 text-fuchsia-500" />
                                  <h2 className="text-lg md:text-2xl font-bold text-fuchsia-300 text-center">La IA del Profesor Müller está escribiendo un guion...</h2>
                              </div>
                          )}
                      </div>
                  )}

                  {activeTab === 'historiaspro' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                              <div>
                                  <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-emerald-300"><Icon name="feather" className="w-7 h-7 md:w-10 md:h-10" /> Historias Pro</h1>
                                  <p className="text-sm text-emerald-100/80 mt-1">Escribe en español/alemán o sube manuscrito (OCR), y obtén versión natural por nivel, simplificada, glosario y escenas para `Historia`.</p>
                              </div>
                              <div className={`text-xs px-3 py-2 rounded-xl border ${cloudSyncState === 'synced' ? 'bg-emerald-900/40 border-emerald-500/35 text-emerald-200' : cloudSyncState === 'syncing' ? 'bg-sky-900/35 border-sky-500/35 text-sky-200' : cloudSyncState === 'error' ? 'bg-rose-900/40 border-rose-500/40 text-rose-200' : 'bg-black/30 border-white/10 text-gray-300'}`}>
                                  Sync: {cloudSyncLabel}{cloudSyncAt ? ` · ${new Date(cloudSyncAt).toLocaleTimeString()}` : ''}
                              </div>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                              <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:p-5 space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                      {[
                                          { id: 'es', label: 'Entrada español' },
                                          { id: 'de', label: 'Entrada alemán (corregir)' },
                                          { id: 'ocr', label: 'OCR manuscrito' },
                                      ].map((x) => (
                                          <button key={x.id} type="button" onClick={() => setStoriesProInputMode(x.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${storiesProInputMode === x.id ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-black/30 border-white/10 text-gray-300'}`}>{x.label}</button>
                                      ))}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <label className="text-xs text-gray-400">
                                          Nivel de salida
                                          <select className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2 py-2 text-white" value={storiesProLevel} onChange={(e) => setStoriesProLevel(e.target.value)}>
                                              {['A2', 'B1', 'B2', 'C1'].map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                                          </select>
                                      </label>
                                      <label className="text-xs text-gray-400">
                                          Estilo
                                          <select className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2 py-2 text-white" value={storiesProTone} onChange={(e) => setStoriesProTone(e.target.value)}>
                                              <option value="natural">Natural</option>
                                              <option value="formal">Formal</option>
                                          </select>
                                      </label>
                                  </div>
                                  {storiesProInputMode === 'ocr' && (
                                      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                          <div className="flex items-center gap-2 mb-2">
                                              <label className="text-xs text-gray-400">Idioma OCR:</label>
                                              <select className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white" value={storiesProOcrLang} onChange={(e) => setStoriesProOcrLang(e.target.value)}>
                                                  <option value="es">Español</option>
                                                  <option value="de">Alemán</option>
                                              </select>
                                          </div>
                                          <input type="file" accept="image/*" onChange={(e) => runHistoriasProOcr(e.target.files && e.target.files[0])} className="w-full text-xs text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-emerald-700 file:text-white" />
                                      </div>
                                  )}
                                  <textarea value={storiesProSourceText} onChange={(e) => setStoriesProSourceText(e.target.value)} className="w-full h-52 bg-black/45 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-emerald-500 resize-y" placeholder={storiesProInputMode === 'de' ? 'Escribe tu historia en alemán para corrección/estilización…' : 'Escribe tu historia en español…'} />
                                  {storiesProErr ? <p className="text-xs text-rose-300">{storiesProErr}</p> : null}
                                  <div className="flex flex-wrap gap-2">
                                      <button type="button" disabled={storiesProBusy} onClick={runHistoriasProGenerate} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 font-bold text-sm">{storiesProBusy ? 'Procesando…' : 'Generar Historias Pro'}</button>
                                      <button type="button" disabled={!storiesProResult} onClick={sendHistoriasProToHistoria} className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 font-bold text-sm">Enviar escenas a Historia</button>
                                  </div>
                              </section>

                              <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 md:p-5 space-y-3">
                                  {!storiesProResult ? (
                                      <p className="text-sm text-gray-400">Genera una historia para ver salida natural, versión simplificada, glosario y escenas prácticas.</p>
                                  ) : (
                                      <>
                                          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 mb-1">Alemán natural ({storiesProLevel})</p>
                                              <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{storiesProResult.deNatural}</p>
                                          </div>
                                          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-sky-300 mb-1">Versión simplificada</p>
                                              <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{storiesProResult.deSimple}</p>
                                          </div>
                                          <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-violet-300 mb-1">Glosario rápido</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {(storiesProResult.glossary || []).map((g, i) => <span key={i} className="text-xs rounded-md px-2 py-1 bg-black/35 border border-white/10 text-gray-200">{g.de}</span>)}
                                              </div>
                                          </div>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Escenas para Historia</p>
                                              <ul className="space-y-1.5 text-sm text-gray-300 max-h-40 overflow-y-auto">
                                                  {(storiesProResult.scenes || []).map((s, i) => <li key={i}><span className="font-bold text-emerald-300">{s.speaker}:</span> {s.text}</li>)}
                                              </ul>
                                          </div>
                                      </>
                                  )}
                              </section>
                          </div>
                      </div>
                  )}

                  {/* ENTRENAMIENTO DASHBOARD (sin cambios) */}
                  {practiceActive && currentPracticeItem && (
                      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in">
                         <button onClick={() => setPracticeActive(null)} className="absolute top-4 left-4 md:top-8 md:left-8 text-gray-400 hover:text-white flex items-center gap-2 font-bold text-sm md:text-base"><Icon name="chevron-left" className="w-4 h-4 md:w-5 md:h-5" /> Volver</button>
                         <div className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-8">
                             <h2 className="text-2xl md:text-3xl font-black text-amber-500 uppercase tracking-widest"><Icon name="brain" className="w-6 h-6 md:w-8 md:h-8 inline mr-2" /> Entrenamiento Rápido</h2>
                             <ExerciseHelpBtn helpId="practice_mazos" />
                         </div>
                         <div className="w-full max-w-2xl bg-black/40 p-6 md:p-12 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
                             <button onClick={() => playPracticeAudio(practiceActive === 'grammar' ? currentPracticeItem.base : currentPracticeItem.de)} className="bg-white/10 p-3 md:p-4 rounded-full mb-4 md:mb-6 hover:bg-white/20 transition"><Icon name="volume-2" className="w-6 h-6 md:w-8 md:h-8" /></button>
                             {practiceActive === 'grammar' ? (
                                 <h1 className="text-3xl md:text-5xl font-black text-cyan-400 text-center mb-6 md:mb-8">{currentPracticeItem.base}</h1>
                             ) : (
                                 <h1 className="text-4xl md:text-7xl font-black text-white text-center mb-6 md:mb-8 flex items-center justify-center flex-wrap">{getArticleVisual(currentPracticeItem.de)}{currentPracticeItem.de}</h1>
                             )}
                             {!practiceShowTrans ? (
                                 <button onClick={() => setPracticeShowTrans(true)} className="bg-blue-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-xl md:text-2xl shadow-xl hover:bg-blue-500 transition">Revelar</button>
                             ) : (
                                 <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-4">
                                     {practiceActive === 'grammar' ? (
                                         <div className="bg-black/60 p-4 md:p-6 rounded-xl md:rounded-2xl w-full mb-6 md:mb-8 text-center border border-cyan-800/50">
                                             <p className="text-lg md:text-2xl text-white mb-2 italic">"{currentPracticeItem.exampleDe}"</p>
                                             <p className="text-base md:text-xl text-cyan-200">({currentPracticeItem.exampleEs})</p>
                                         </div>
                                     ) : (
                                         <h2 className="text-2xl md:text-4xl font-bold text-gray-300 text-center mb-6 md:mb-8 bg-black/60 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl w-full">{currentPracticeItem.es}</h2>
                                     )}
                                     <button onClick={nextPracticeWord} className="bg-green-600 w-full py-3 md:py-4 rounded-xl font-bold text-xl md:text-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-green-500">Siguiente <Icon name="arrow-right" className="w-5 h-5 md:w-6 md:h-6" /></button>
                                 </div>
                             )}
                         </div>
                         <p className="mt-4 md:mt-6 text-gray-500 font-bold text-sm md:text-base">Tarjeta {practiceIndex + 1} de {currentPracticeList.length}</p>
                      </div>
                  )}

                  {activeTab === 'entrenamiento' && !practiceActive && (
                      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                              <div>
                                  <h1 className="text-2xl md:text-4xl font-black text-fuchsia-200 flex items-center gap-2 md:gap-3"><Icon name="graduation-cap" className="w-8 h-8 md:w-10 md:h-10" /> Entrenamiento avanzado</h1>
                                  <p className="text-xs md:text-sm text-fuchsia-100/80 mt-1">Centro principal de práctica: artículos, verbos con preposición, preposiciones y simulacro TELC.</p>
                              </div>
                              <ExerciseHelpBtn helpId="advanced_menu" />
                          </div>
                          <AdvancedPracticePanelFinal embedded />
                      </div>
                  )}

                  {/* B1 / B2 (sin cambios) */}
                  {activeTab === 'bxbank' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500 flex flex-col min-h-full">
                          <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-start md:items-center mb-6 md:mb-8 border-b border-sky-900/50 pb-4 md:pb-6 gap-4">
                              <div className="min-w-0 flex-1 md:max-w-[min(100%,28rem)]">
                                  <h1 className={`text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 ${bxBankLevel === 'b1' ? 'text-emerald-400' : 'text-sky-400'}`}>
                                      {bxBankLevel === 'b1' ? <Icon name="target" className="w-8 h-8 md:w-10 md:h-10" /> : <Icon name="layers" className="w-8 h-8 md:w-10 md:h-10" />} 
                                      {bxBankLevel === 'b1' ? 'Banco B1 · Fundamentos' : 'Banco B2 · Meisterklasse'}
                                  </h1>
                                  <p className="text-gray-300 text-xs md:text-sm mt-1">{bxBankLevel === 'b1' ? 'Domina las bases absolutas.' : 'Estructuras avanzadas de nativos.'}</p>
                                  <p className="text-[10px] text-gray-500 mt-1">Tarjetas desde <code className="text-amber-200/90">b1-b2-database.json</code> más lo que añadas desde <strong className="text-gray-400">Biblioteca → Distribuir texto → B1/B2</strong> (local).</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 justify-end">
                                  <div className="flex gap-1 md:gap-2 flex-wrap bg-black/40 p-1 md:p-2 rounded-xl border border-white/10">
                                      <button onClick={()=>setBxCategory('vocabulario')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'vocabulario' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Vocabulario</button>
                                      <button onClick={()=>setBxCategory('verbos')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'verbos' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Verbos</button>
                                      <button onClick={()=>setBxCategory('preposiciones')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'preposiciones' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Prep.</button>
                                      <button onClick={()=>setBxCategory('conectores')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'conectores' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Conectores</button>
                                      <button onClick={()=>setBxCategory('redemittel')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${bxCategory === 'redemittel' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>Redemittel</button>
                                      <button onClick={()=>setBxCategory('mix')} className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-[10px] md:text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center gap-1 shadow-lg border border-white/20 ${bxCategory === 'mix' ? 'ring-1 md:ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}><Icon name="shuffle" className="w-3 h-3 md:w-4 md:h-4" /> MIX</button>
                                  </div>
                                  <ExerciseHelpBtn helpId={bxExerciseHelpId} title={'Ayuda: categoría ' + bxCategory} />
                              </div>
                              <div className="w-full md:basis-full flex flex-wrap items-center gap-2 mt-1 md:mt-0 pt-3 border-t border-white/10 md:order-last">
                                  <span className="text-[10px] font-bold text-rose-300/95 uppercase tracking-wider w-full sm:w-auto">Mis aportaciones (Biblioteca)</span>
                                  {bxBankLevel === 'b1' ? (
                                      <button type="button" onClick={() => clearBxUserLevelAllCategories('b1')} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/40">Borrar todo B1</button>
                                  ) : (
                                      <button type="button" onClick={() => clearBxUserLevelAllCategories('b2')} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/40">Borrar todo B2</button>
                                  )}
                                  {bxCategory !== 'mix' ? (
                                      <button type="button" onClick={() => clearBxUserOneCategory(bxBankLevel === 'b1' ? 'b1' : 'b2', bxCategory)} className="text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-100 border border-amber-600/35">
                                          Borrar solo: {bxCategory === 'vocabulario' ? 'Vocabulario' : bxCategory === 'verbos' ? 'Verbos' : bxCategory === 'preposiciones' ? 'Prep.' : bxCategory === 'conectores' ? 'Conectores' : 'Redemittel'}
                                      </button>
                                  ) : (
                                      <span className="text-[9px] text-gray-500">Elige una categoría (no MIX) para borrar solo esa subpestaña.</span>
                                  )}
                              </div>
                          </div>
                          <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-3xl mx-auto">
                              {bxCurrentList.length > 0 ? (
                                  <>
                                      <div className={`absolute top-0 right-0 px-2 md:px-4 py-0.5 md:py-1 rounded-full font-bold border uppercase text-[10px] md:text-xs tracking-widest ${bxBankLevel === 'b1' ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30' : 'bg-sky-900/50 text-sky-300 border-sky-500/30'}`}>
                                          {bxCategory === 'mix' ? 'Modo Mix (Aleatorio)' : bxCategory}
                                      </div>
                                      <div className={`w-full bg-slate-900/90 p-4 md:p-10 rounded-2xl md:rounded-3xl border-2 shadow-2xl mt-6 md:mt-8 ${bxBankLevel === 'b1' ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-sky-500/50 shadow-[0_0_40px_rgba(14,165,233,0.3)]'}`}>
                                          <p className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-[10px] md:text-sm"><Icon name="languages" className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />{bxBankLevel === 'b1' ? 'Básico / Común:' : 'Nivel B1:'}</p>
                                          <p className="text-base md:text-2xl text-white/60 mb-4 md:mb-8 decoration-red-500/50 decoration-2">"{bxCurrentList[bxIndex]?.b1}"</p>
                                          <p className={`font-black mb-2 uppercase tracking-widest text-[10px] md:text-sm ${bxBankLevel === 'b1' ? 'text-emerald-400' : 'text-sky-400'}`}><Icon name="trophy" className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />{bxBankLevel === 'b1' ? 'Mejor / Nivel B1 Real:' : 'Nivel B2/C1:'}</p>
                                          <p className="text-xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-tight">"{bxCurrentList[bxIndex]?.b2}"</p>
                                          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 font-medium">({bxCurrentList[bxIndex]?.es})</p>
                                          <div className="bg-black/40 p-3 md:p-4 rounded-xl border border-white/10 flex gap-2 md:gap-3">
                                              <Icon name="brain" className="w-5 h-5 md:w-6 md:h-6 text-amber-400 flex-shrink-0 mt-0.5 md:mt-1" />
                                              <p className="text-xs md:text-sm text-gray-200 leading-relaxed"><strong className="text-amber-400 uppercase tracking-wide">La Lógica del Profesor:</strong> <br/> {bxCurrentList[bxIndex]?.trick}</p>
                                          </div>
                                          {bxCurrentList[bxIndex]?._mullerUser ? (
                                              <div className="mt-4 md:mt-5 flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 items-stretch sm:items-center border-t border-white/10 pt-4">
                                                  <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider">Tu biblioteca</span>
                                                  <button type="button" onClick={handleBxUserCardDelete} className="text-xs md:text-sm bg-red-900/70 hover:bg-red-800 text-red-100 px-3 py-2 rounded-xl font-bold border border-red-700/50">Eliminar tarjeta</button>
                                                  <div className="flex flex-wrap items-center gap-2">
                                                      <span className="text-[10px] text-gray-500">Mover a</span>
                                                      <select value={bxMoveTargetCat} onChange={(e) => setBxMoveTargetCat(e.target.value)} className="bg-black/60 border border-gray-600 text-white text-xs md:text-sm rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500">
                                                          {Object.keys(BX_DB_EMPTY).filter((c) => {
                                                              const it = bxCurrentList[bxIndex];
                                                              const level = bxBankLevel === 'b1' ? 'b1' : 'b2';
                                                              const src = bxCategory === 'mix' ? (it._mullerCategory || mullerFindUserBxCategory(bxUserOverlay, level, it._mullerUid)) : bxCategory;
                                                              return c !== src;
                                                          }).map((c) => (
                                                              <option key={c} value={c}>{c === 'vocabulario' ? 'Vocabulario' : c === 'verbos' ? 'Verbos' : c === 'preposiciones' ? 'Prep.' : c === 'conectores' ? 'Conectores' : 'Redemittel'}</option>
                                                          ))}
                                                      </select>
                                                      <button type="button" onClick={handleBxUserCardMove} className="text-xs md:text-sm bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 px-3 py-2 rounded-xl font-bold border border-emerald-600/50">Mover aquí</button>
                                                  </div>
                                              </div>
                                          ) : null}
                                      </div>
                                      <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 w-full max-w-sm justify-between">
                                          <button type="button" onClick={() => setBxIndex(i => i > 0 ? i - 1 : bxCurrentList.length - 1)} className="muller-icon-nav bg-gray-800 hover:bg-gray-700 text-white p-3 md:p-4 rounded-full transition border border-white/15"><Icon name="chevron-left" className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>
                                          <button onClick={() => { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(bxCurrentList[bxIndex].b2); u.lang = 'de-DE'; window.__mullerApplyPreferredDeVoice(u); window.speechSynthesis.speak(u); }} className={`text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold shadow-lg flex items-center gap-2 flex-1 justify-center text-sm md:text-base ${bxBankLevel === 'b1' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-sky-600 hover:bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]'}`}><Icon name="volume-2" className="w-5 h-5 md:w-6 md:h-6" /> Escuchar</button>
                                          <button type="button" onClick={() => setBxIndex(i => i < bxCurrentList.length - 1 ? i + 1 : 0)} className="muller-icon-nav bg-gray-800 hover:bg-gray-700 text-white p-3 md:p-4 rounded-full transition border border-white/15"><Icon name="chevron-right" className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>
                                      </div>
                                      <p className="text-gray-500 font-bold mt-4 text-xs md:text-sm">Tarjeta {bxIndex + 1} / {bxCurrentList.length}</p>
                                  </>
                              ) : (
                                  <div className="text-gray-500 font-bold text-base md:text-xl">Categoría sin datos (Selecciona otra).</div>
                              )}
                          </div>
                      </div>
                  )}

                  {activeTab === 'lexikon' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                              <h1 className="text-2xl md:text-4xl font-black text-cyan-300 flex items-center gap-2 md:gap-3">
                                  <Icon name="library" className="w-8 h-8 md:w-10 md:h-10" /> Lexikon
                              </h1>
                              <ExerciseHelpBtn helpId="nav_lexikon" />
                          </div>
                          <p className="text-gray-400 text-xs md:text-sm mb-6 border-b border-white/10 pb-4">Traducción de palabras o frases (detección automática del idioma de origen) y opción de solo Wiktionary. Los textos salen por internet; puedes guardar pares en las mismas lecciones que en <strong className="text-amber-200">Biblioteca → Vocab</strong>.</p>

                          <div className="rounded-2xl border border-cyan-700/40 bg-slate-900/80 p-4 md:p-6 mb-6 shadow-xl">
                              <h2 className="text-lg font-black text-cyan-200 mb-3 flex items-center gap-2"><Icon name="search" className="w-5 h-5" /> Palabra o frase</h2>
                              <p className="text-[11px] text-gray-500 mb-3">Elige primero si quieres <strong className="text-gray-300">traducción</strong> (recomendado para español → alemán) o solo enlaces a <strong className="text-gray-300">Wiktionary</strong> (definiciones en un idioma).</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                  <input type="text" value={lexikonSearch} onChange={(e) => setLexikonSearch(e.target.value)} placeholder="Palabra o frase…" className="flex-1 min-w-[160px] bg-black/50 border border-cyan-800/60 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-cyan-500" onKeyDown={(e) => { if (e.key === 'Enter') runLexikonDictionarySearch(); }} />
                                  <select value={lexikonDictKind} onChange={(e) => setLexikonDictKind(e.target.value)} className="bg-black/50 border border-cyan-800/60 rounded-xl px-3 py-2 text-white text-sm outline-none max-w-[min(100%,220px)]">
                                      <option value="tr-es-de">Traducción: ES → DE</option>
                                      <option value="tr-de-es">Traducción: DE → ES</option>
                                      <option value="wiki-de">Solo Wiktionary (alemán)</option>
                                      <option value="wiki-es">Solo Wiktionary (español)</option>
                                  </select>
                                  <button type="button" disabled={lexikonDictLoading} onClick={runLexikonDictionarySearch} className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 font-bold text-sm disabled:opacity-50">{lexikonDictLoading ? '…' : 'Buscar'}</button>
                              </div>
                              {lexikonResults && lexikonResults.dictTranslate && !lexikonResults.error ? (
                                  <div className="rounded-xl bg-cyan-950/40 border border-cyan-600/25 p-4 space-y-2">
                                      <p className="text-white text-base md:text-lg"><span className="text-gray-400 font-bold text-xs uppercase mr-2">Entrada</span><strong>{lexikonResults.query}</strong></p>
                                      <p className="text-cyan-100 text-lg md:text-2xl font-bold leading-snug">{lexikonResults.out || '—'}</p>
                                      {lexikonResults.detected ? (
                                          <p className="text-[10px] text-gray-500">Idioma detectado (aprox.): {lexikonResults.detected} → {lexikonResults.tl === 'de' ? 'alemán' : 'español'}</p>
                                      ) : null}
                                      <div className="flex flex-wrap gap-2 pt-1">
                                          {lexikonResults.tl === 'de' && lexikonResults.out ? (
                                              <a href={`https://de.wiktionary.org/wiki/${encodeURIComponent((lexikonResults.out.split(/[\s,.;]+/)[0] || '').replace(/^[\s"'«»]+|[\s"'»]+$/g, ''))}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline">Wiktionary DE (1.ª palabra del resultado)</a>
                                          ) : null}
                                          <button type="button" onClick={() => { setLexikonTransText(lexikonSearch); setLexikonTransTarget(lexikonDictKind === 'tr-es-de' ? 'de' : 'es'); setLexikonTransOut(''); }} className="text-[10px] font-bold text-amber-300 hover:text-white">Copiar a traductor abajo</button>
                                      </div>
                                  </div>
                              ) : lexikonResults && !lexikonResults.error && (lexikonResults.titles || []).length > 0 ? (
                                  <ul className="space-y-2 text-sm">
                                      {(lexikonResults.titles || []).map((t, i) => (
                                          <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-white/5 pb-2">
                                              <span className="text-white font-bold">{t}</span>
                                              <div className="flex gap-2 flex-wrap">
                                                  {lexikonResults.urls && lexikonResults.urls[i] ? (
                                                      <a href={lexikonResults.urls[i]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline">Abrir entrada</a>
                                                  ) : null}
                                                  <button type="button" onClick={() => { setLexikonTransText(t); setLexikonTransOut(''); }} className="text-[10px] font-bold text-amber-300 hover:text-white">→ Traductor</button>
                                              </div>
                                          </li>
                                      ))}
                                  </ul>
                              ) : lexikonResults && !lexikonResults.error && !lexikonResults.dictTranslate ? (
                                  <p className="text-gray-500 text-sm">Sin resultados. Prueba otra grafía.</p>
                              ) : null}
                          </div>

                          <div className="rounded-2xl border border-indigo-700/40 bg-slate-900/80 p-4 md:p-6 mb-6 shadow-xl">
                              <h2 className="text-lg font-black text-indigo-200 mb-3 flex items-center gap-2"><Icon name="languages" className="w-5 h-5" /> Traductor (DE ↔ ES)</h2>
                              <p className="text-[11px] text-gray-500 mb-2">Elige el idioma de <strong className="text-gray-300">salida</strong>; el origen se detecta solo (evita que una palabra española se traduzca mal por empate DE/ES).</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                  <button type="button" onClick={() => setLexikonTransTarget('de')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${lexikonTransTarget === 'de' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>→ Alemán</button>
                                  <button type="button" onClick={() => setLexikonTransTarget('es')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${lexikonTransTarget === 'es' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>→ Español</button>
                              </div>
                              <textarea value={lexikonTransText} onChange={(e) => setLexikonTransText(e.target.value)} placeholder="Frase o palabra (cualquier registro)…" className="w-full min-h-[100px] bg-black/50 border border-indigo-800/60 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500 mb-3" />
                              <button type="button" disabled={lexikonTransLoading} onClick={runLexikonTranslate} className="mb-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm disabled:opacity-50">{lexikonTransLoading ? 'Traduciendo…' : 'Traducir'}</button>
                              {lexikonTransOut ? (
                                  <div className="rounded-xl bg-indigo-950/50 border border-indigo-600/30 p-4 mb-4">
                                      <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Resultado</p>
                                      <p className="text-white text-lg md:text-xl leading-relaxed whitespace-pre-wrap">{lexikonTransOut}</p>
                                  </div>
                              ) : null}
                              <div className="border-t border-white/10 pt-4 space-y-3">
                                  <p className="text-[10px] font-bold text-amber-300 uppercase">Guardar par en lección (Vocab)</p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                      <select value={lexikonSaveLessonId} onChange={(e) => setLexikonSaveLessonId(e.target.value)} className="bg-black/60 border border-amber-800/60 text-white text-sm rounded-lg px-3 py-2 outline-none flex-1 min-w-[180px]">
                                          <option value="">— Elige lección —</option>
                                          <option value="__new__">+ Nueva lección…</option>
                                          {customVocabLessons.map((l) => (
                                              <option key={l.id} value={l.id}>{l.title} ({l.words?.length || 0} pal.)</option>
                                          ))}
                                      </select>
                                      {lexikonSaveLessonId === '__new__' ? (
                                          <input type="text" value={lexikonNewLessonTitle} onChange={(e) => setLexikonNewLessonTitle(e.target.value)} placeholder="Título nueva lección" className="bg-black/50 border border-amber-800/60 rounded-lg px-3 py-2 text-white text-sm flex-1 min-w-[140px]" />
                                      ) : null}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <label className="flex-1 min-w-[120px] text-[10px] text-gray-500 block">Alemán<input type="text" value={lexikonPairDe} onChange={(e) => setLexikonPairDe(e.target.value)} className="mt-0.5 w-full bg-black/50 border border-emerald-800/50 rounded-lg px-2 py-1.5 text-sm text-emerald-100" placeholder="der Bahnhof…" /></label>
                                      <label className="flex-1 min-w-[120px] text-[10px] text-gray-500 block">Español<input type="text" value={lexikonPairEs} onChange={(e) => setLexikonPairEs(e.target.value)} className="mt-0.5 w-full bg-black/50 border border-sky-800/50 rounded-lg px-2 py-1.5 text-sm text-sky-100" placeholder="la estación…" /></label>
                                  </div>
                                  <button type="button" onClick={() => appendPairToCustomLesson(lexikonPairDe, lexikonPairEs)} className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 font-bold text-sm border border-amber-500/40">Guardar par DE / ES en la lección</button>
                                  <p className="text-[10px] text-gray-500">Usa el orden detectado (arriba) o traduce antes de guardar. Puedes abrir la lección en Vocab → Practicar.</p>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* PROGRESO (con botones de sincronización añadidos en barra) */}
                  {activeTab === 'progreso' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                              <div className="rounded-2xl border border-sky-500/35 bg-gradient-to-br from-sky-950/70 to-slate-900/80 p-4 md:p-5 shadow-xl">
                                  <h2 className="text-xs font-black text-sky-300 uppercase tracking-wider mb-3 flex items-center gap-2"><Icon name="calendar" className="w-4 h-4" /> Plan de hoy</h2>
                                  <div className="grid gap-2">
                                      <button type="button" className="py-2 px-3 rounded-xl bg-blue-900/40 border border-blue-500/25 text-left text-xs hover:bg-blue-900/60 transition" onClick={() => { setActiveTab('historia'); setMode('dialogue'); stopAudio(); setPracticeActive(null); }}>1. Historia — escenas en voz alta o podcast</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-teal-900/40 border border-teal-500/25 text-left text-xs hover:bg-teal-900/60 transition" onClick={() => { setActiveTab('shadowing'); stopAudio(); setPracticeActive(null); }}>2. Shadowing — misma escena + pronunciación</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-amber-900/40 border border-amber-500/25 text-left text-xs hover:bg-amber-900/60 transition" onClick={() => { setActiveTab('vocabulario'); stopAudio(); setPracticeActive(null); }}>3. Vocab — tarjetas</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-purple-900/40 border border-purple-500/25 text-left text-xs hover:bg-purple-900/60 transition" onClick={() => { setActiveTab('entrenamiento'); stopAudio(); setPracticeActive(null); }}>4. Entrenamiento avanzado</button>
                                      <button type="button" className="py-2 px-3 rounded-xl bg-rose-900/40 border border-rose-500/25 text-left text-xs hover:bg-rose-900/60 transition" onClick={() => { setActiveTab('escritura'); setWritingMode('dictation'); stopAudio(); setPracticeActive(null); }}>5. Escritura — dictado + OCR</button>
                                  </div>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider pt-3 mb-2">Retos del día (+5 monedas, una vez al día)</p>
                                  <div className="flex flex-wrap gap-2">
                                      <button type="button" disabled={dailyChallenges.vocab} onClick={() => claimDailyStamp('vocab')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.vocab ? 'bg-gray-800 text-gray-500' : 'bg-amber-700 hover:bg-amber-600 text-white'}`}>{dailyChallenges.vocab ? '✓ Vocab' : 'He practicado vocab'}</button>
                                      <button type="button" disabled={dailyChallenges.shadow} onClick={() => claimDailyStamp('shadow')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.shadow ? 'bg-gray-800 text-gray-500' : 'bg-teal-700 hover:bg-teal-600 text-white'}`}>{dailyChallenges.shadow ? '✓ Shadow' : 'He hecho shadowing'}</button>
                                      <button type="button" disabled={dailyChallenges.write} onClick={() => claimDailyStamp('write')} className={`text-xs font-bold px-2 py-1.5 rounded-lg ${dailyChallenges.write ? 'bg-gray-800 text-gray-500' : 'bg-rose-700 hover:bg-rose-600 text-white'}`}>{dailyChallenges.write ? '✓ Escritura' : 'He escrito / OCR'}</button>
                                  </div>
                                  <button type="button" onClick={() => setTourStep(1)} className="w-full mt-3 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 font-bold text-xs border border-indigo-500/30">Iniciar tour guiado (5 pasos)</button>
                              </div>
                              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-yellow-950/20 p-4 md:p-5 shadow-xl">
                                  <h2 className="text-xs font-black text-amber-200 uppercase tracking-wider mb-3">Resumen rápido</h2>
                                  <div className="space-y-2 text-xs text-gray-300">
                                      <p><span className="text-white font-bold">Racha (honesta):</span> {userStats.streakDays} días</p>
                                      <p className="text-[10px] text-gray-500 leading-snug">Cuenta solo si hubo actividad mínima: ≥{MULLER_STREAK_MIN_VOCAB_RATINGS} tarjetas de vocab calificadas, o ≥{MULLER_STREAK_MIN_ACTIVITY_POINTS} puntos, o ≥{Math.round(MULLER_STREAK_MIN_ACTIVE_SEC / 60)} min con la app (timer).</p>
                                      <p><span className="text-white font-bold">Monedas:</span> {coinsUiLabel}</p>
                                      <p><span className="text-emerald-300 font-bold">SRS vocabulario:</span> {Object.keys(vocabSrsMap).length} tarjetas (este dispositivo)</p>
                                      <p><span className="text-white font-bold">Pronunciación:</span> {userStats.pronunciationAttempts || 0} intentos</p>
                                      <p><span className="text-white font-bold">Diktat:</span> {userStats.diktatCorrect || 0} / {userStats.diktatAttempts || 0}</p>
                                      <p className="text-[10px] text-gray-500 pt-1">Exporta PDF desde el botón de abajo.</p>
                                  </div>
                              </div>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                  <h1 className="text-2xl md:text-4xl font-black flex items-center gap-2 md:gap-3 text-yellow-500"><Icon name="award" className="w-8 h-8 md:w-10 md:h-10" /> Dashboard Profesional B1</h1>
                                  <ExerciseHelpBtn helpId="progreso_dashboard" />
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={exportProgressPDF} className="bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition border border-gray-600 text-xs md:text-sm"><Icon name="file-down" className="w-4 h-4 md:w-5 md:h-5" /> Imprimir Resumen</button>
                              </div>
                          </div>
                          <div className="bg-gray-800/80 p-4 md:p-6 rounded-2xl border border-gray-700 shadow-xl mb-6 md:mb-8">
                              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2"><Icon name="trending-up" className="w-5 h-5 md:w-6 md:h-6 text-green-400" /> Actividad Semanal</h2>
                              <p className="text-[10px] md:text-xs text-gray-500 mb-2">Basada en tus sesiones reales (vocab, diktat, práctica). Si un día está vacío, la barra es baja.</p>
                              <div className="flex items-end justify-between gap-1 md:gap-2 h-[120px] md:h-[200px] mt-4 pt-4 border-t border-gray-700 relative">
                                  {getWeeklyChartBars().map((val, i) => (
                                      <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                                          <div className="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-400 relative shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{height: `${Math.max(val, 5)}%`}}>
                                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-blue-200 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">{val}%</span>
                                          </div>
                                          <span className="text-[8px] md:text-[10px] text-gray-400 mt-1 md:mt-2 font-mono uppercase tracking-tighter whitespace-nowrap hidden md:block">{getLast7Days()[i]}</span>
                                      </div>
