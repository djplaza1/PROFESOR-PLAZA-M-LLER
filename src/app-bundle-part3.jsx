                                  ))}
                              </div>
                          </div>
                          {mullerProgresoSnapshot && (
                              <div className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 p-4 md:p-6 rounded-2xl border border-purple-700/50 shadow-xl mb-6 md:mb-8">
                                  <h2 className="text-base md:text-lg font-bold text-purple-200 mb-3 flex items-center gap-2"><Icon name="graduation-cap" className="w-5 h-5 md:w-6 md:h-6" /> Entrenamiento Müller (avanzado)</h2>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Intentos</span><span className="font-black text-white text-lg">{mullerProgresoSnapshot.totalAttempts}</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Precisión</span><span className="font-black text-emerald-300 text-lg">{mullerProgresoSnapshot.accuracy}%</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Hoy</span><span className="font-black text-cyan-300 text-lg">{mullerProgresoSnapshot.todayAttempts}/{mullerProgresoSnapshot.dailyGoal}</span></div>
                                      <div className="bg-black/30 rounded-lg p-2 text-center border border-white/10"><span className="text-gray-400 block">Racha</span><span className="font-black text-orange-300 text-lg">{mullerProgresoSnapshot.streakDays} d</span></div>
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-3">Abre la pestaña Entrenamiento para practicar artículos, verbos y preposiciones.</p>
                              </div>
                          )}
                          <p className="text-xs text-emerald-200/90 mb-4 flex flex-wrap items-center gap-2"><Icon name="timer" className="w-4 h-4" /> Repaso espaciado (SRS): <strong>{Object.keys(vocabSrsMap).length}</strong> palabras con fecha de repaso · se ordenan solas al abrir una lección. Solo en este navegador.</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-red-900/50 flex flex-col relative group">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-red-500"><Icon name="target" className="w-5 h-5 md:w-6 md:h-6" /> Vocab. Difícil</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.difficultVocab || userStats.difficultVocab.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vacío.</p> : 
                                       userStats.difficultVocab.map((v, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-red-900/30 text-xs md:text-sm flex justify-between"><span className="text-red-400 font-bold text-xs md:text-sm">{v.de}</span><span className="text-gray-400 text-right w-1/2 truncate text-xs md:text-sm">{v.es}</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('diff')} className="flex-1 bg-red-600 hover:bg-red-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('vocab_diff')} className="bg-red-900 hover:bg-red-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-blue-900/50 flex flex-col">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-blue-400"><Icon name="book-open" className="w-5 h-5 md:w-6 md:h-6" /> Vocab. Normal</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.normalVocab || userStats.normalVocab.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vacío.</p> : 
                                       userStats.normalVocab.map((v, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-blue-900/30 text-xs md:text-sm flex justify-between"><span className="text-blue-300 font-bold text-xs md:text-sm">{v.de}</span><span className="text-gray-400 text-right w-1/2 truncate text-xs md:text-sm">{v.es}</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('norm')} className="flex-1 bg-blue-600 hover:bg-blue-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('vocab_norm')} className="bg-blue-900 hover:bg-blue-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                              <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-cyan-900/50 flex flex-col">
                                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2 text-cyan-400"><Icon name="brain" className="w-5 h-5 md:w-6 md:h-6" /> Gramática</h2>
                                  <ul className="space-y-1 md:space-y-2 flex-1 overflow-y-auto pr-2 mb-3 md:mb-4 max-h-32 md:max-h-40">
                                      {!userStats.difficultGrammar || userStats.difficultGrammar.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">Vacío.</p> : 
                                       userStats.difficultGrammar.map((g, i) => <li key={i} className="bg-black/40 p-1 md:p-2 rounded border border-cyan-900/30 text-xs flex flex-col"><span className="text-cyan-400 font-bold text-xs md:text-sm mb-0.5 md:mb-1">{g.base}</span><span className="text-gray-400 truncate text-[10px] md:text-xs">"{g.exampleDe}"</span></li>)
                                      }
                                  </ul>
                                  <div className="flex gap-2">
                                      <button onClick={() => startPractice('grammar')} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm shadow-lg transition">Practicar Ahora</button>
                                      <button onClick={() => exportToAnki('grammar')} className="bg-cyan-900 hover:bg-cyan-800 p-1.5 md:p-2 rounded-lg transition" title="Exportar Anki"><Icon name="download" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* BIBLIOTECA (con checkboxes para mezcla) */}
                  {activeTab === 'guiones' && !practiceActive && (
                      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 md:gap-8 min-h-full animate-in fade-in">
                          <div className="flex-[2] bg-gray-800/50 p-4 md:p-6 rounded-2xl border border-gray-700 flex flex-col max-h-full overflow-y-auto hide-scrollbar">
                              <div className="bg-purple-900/30 border border-purple-500/50 p-4 md:p-5 rounded-xl mb-4 md:mb-6">
                                  <h3 className="text-purple-300 font-bold flex items-center gap-2 mb-2 text-sm md:text-base"><Icon name="sparkles" className="w-4 h-4 md:w-5 md:h-5" /> Instrucciones para la IA (ChatGPT/Gemini)</h3>
                                  <p className="text-xs md:text-sm text-gray-300 mb-3">Copia este prompt en tu IA favorita para que te genere diálogos perfectos y compatibles con el Entrenador Müller.</p>
                                  <div className="bg-black/60 p-2 md:p-3 rounded-lg flex items-start gap-2 border border-purple-800/50 relative group">
       <p className="text-[10px] md:text-xs font-mono text-purple-200 select-all pr-6 md:pr-8">
    "Eres un profesor de alemán experto en TELC B1. Genera un diálogo EXTENSO (sin límite de líneas) sobre [TEMA]. IMPORTANTE: marca los Redemittel clave solo con [R] al final de la línea alemana. No uses la palabra Nützlich ni símbolos raros.<br/><br/>Formato: Nombre: Frase en alemán. (Traducción) [palabra - traducción] [R]"
</p>
<button 
    className="absolute top-1 right-1 text-gray-400 hover:text-white bg-gray-800 p-1 rounded-md opacity-0 group-hover:opacity-100 transition" 
    onClick={() => navigator.clipboard.writeText(`Eres un profesor de alemán experto en TELC B1. Genera un diálogo EXTENSO (sin límite de líneas) sobre [TEMA]. IMPORTANTE: marca los Redemittel clave solo con [R] al final de la línea alemana. No uses la palabra Nützlich ni símbolos raros.\n\nFormato: Nombre: Frase en alemán. (Traducción) [palabra - traducción] [R]`)}
>
    <Icon name="copy" className="w-3 h-3 md:w-4 md:h-4" />
</button>
                                  </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
                              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-purple-400"><Icon name="edit-3" className="w-5 h-5 md:w-6 md:h-6" /> Añadir Guion Copiado</h2>
                              <ExerciseHelpBtn helpId="guiones_import" compact />
                          </div>
                              <input type="text" placeholder="Ej: Lektion 17: Die Reise..." className="w-full bg-black/50 border border-gray-600 p-2 md:p-3 rounded-lg text-white mb-3 md:mb-4 outline-none focus:border-purple-500 text-sm md:text-base" value={newScriptTitle} onChange={(e) => setNewScriptTitle(e.target.value)} />
                              <textarea className="w-full flex-1 min-h-[120px] md:min-h-[150px] bg-black/50 border border-gray-600 p-3 md:p-4 rounded-lg text-white font-mono text-xs md:text-sm mb-3 md:mb-4 outline-none focus:border-purple-500 resize-none" placeholder="Pega aquí el resultado de la IA..." value={scriptInput} onChange={(e) => setScriptInput(e.target.value)} />
                              <button onClick={handleSaveScript} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 md:py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg text-sm md:text-base"><Icon name="save" className="w-4 h-4 md:w-5 md:h-5" /> Guardar y Estudiar</button>

                              <div className="mt-6 md:mt-8 border-t border-gray-600/80 pt-5 md:pt-6">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                      <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-emerald-300"><Icon name="layout-grid" className="w-5 h-5 md:w-6 md:h-6" /> Distribuir texto → B1 / B2</h2>
                                      <ExerciseHelpBtn helpId="guiones_bx_distrib" compact />
                                  </div>
                                  <p className="text-[11px] md:text-xs text-gray-400 mb-3 leading-relaxed">Pega un guion (<code className="text-gray-300">Nombre:</code> …), listas <code className="text-gray-300">alemán - español</code> o líneas sueltas. La app clasifica cada trozo en <strong className="text-gray-200">vocabulario, verbos, preposiciones, conectores o Redemittel</strong> y, con <strong className="text-gray-200">nivel automático</strong>, estima si va a B1 o B2 (heurística local, no IA). Si el cuadro está vacío, se usa el texto del guion de arriba. Tus aportaciones se guardan en el navegador y se <strong className="text-gray-200">mezclan</strong> con las tarjetas del archivo <code className="text-gray-300">b1-b2-database.json</code> (esas no se borran con el botón rojo).</p>
                                  <p className="text-[10px] md:text-xs text-indigo-300/90 mb-3 leading-relaxed bg-indigo-950/25 border border-indigo-500/20 rounded-lg px-3 py-2">Si en <strong className="text-white">Historia</strong> tenías cargado un guion <strong className="text-white">guardado en esta lista</strong>, al pulsar Distribuir las frases quedan <strong className="text-white">vinculadas a ese guion</strong>. Al borrar el guion con la papelera, te preguntamos si quieres quitar también esas tarjetas en B1/B2. Lo que enviaste con el ejemplo por defecto o sin guion cargado no se vincula (úsalo «Borrar mis aportaciones» para vaciar todo lo tuyo).</p>
                                  <textarea className="w-full min-h-[100px] md:min-h-[120px] bg-black/50 border border-emerald-800/60 p-3 rounded-lg text-white font-mono text-xs md:text-sm mb-3 outline-none focus:border-emerald-500 resize-none" placeholder="Pega aquí o déjalo vacío para usar el cuadro del guion de arriba…" value={bxImportText} onChange={(e) => setBxImportText(e.target.value)} />
                                  <div className="flex flex-wrap gap-2 mb-3">
                                      <button type="button" onClick={() => handleBxDistribToLevels('auto')} className="flex-1 min-w-[200px] bg-gradient-to-r from-emerald-700 to-sky-700 hover:opacity-95 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm shadow-lg">→ Nivel automático (B1 o B2 por frase)</button>
                                      <button type="button" onClick={() => handleBxDistribToLevels('b1')} className="flex-1 min-w-[120px] bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm">→ Todo a B1</button>
                                      <button type="button" onClick={() => handleBxDistribToLevels('b2')} className="flex-1 min-w-[120px] bg-sky-800 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm">→ Todo a B2</button>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                      <button type="button" onClick={clearBxUserOverlay} className="text-xs md:text-sm text-red-400 hover:text-red-300 underline">Borrar mis aportaciones B1/B2</button>
                                      {bxImportSummary ? <p className="text-[10px] md:text-xs text-emerald-200/90 flex-1 text-right">{bxImportSummary}</p> : null}
                                  </div>
                              </div>
                          </div>
                          <div className="w-full md:w-1/3 flex flex-col gap-4 max-h-[600px] md:max-h-full">
                              <div className="bg-gray-900 p-4 md:p-5 rounded-2xl border border-gray-800 flex flex-col shrink-0 h-1/3 min-h-[180px] md:min-h-[200px]">
                                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2 text-gray-200"><Icon name="file-text" className="w-5 h-5 md:w-6 md:h-6" /> Tus Guiones</h2>
                                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 hide-scrollbar">
                                      {savedScripts.length === 0 ? <p className="text-gray-500 text-xs md:text-sm">No hay guiones guardados.</p> : null}
                                      {savedScripts.map(script => (
                                          <div key={script.id} className="bg-black/40 p-3 md:p-4 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition flex justify-between items-center group">
                                              <div onClick={() => loadSavedScript(script)} className="flex-1">
                                                  <p className="font-bold text-white group-hover:text-purple-400 truncate text-sm md:text-base">{script.title}</p>
                                                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">Click para cargar</p>
                                              </div>
                                              <button type="button" title="Eliminar guion" onClick={(e) => deleteSavedScript(e, script)} className="text-gray-500 hover:text-red-500 p-1 md:p-2 shrink-0 rounded-lg hover:bg-red-950/40"><Icon name="trash-2" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <div className="bg-amber-900/20 p-4 md:p-5 rounded-2xl border border-amber-800/50 flex flex-col flex-1 min-h-0">
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                      <h2 className="text-lg md:text-xl font-bold text-amber-400 flex items-center gap-2"><Icon name="library" className="w-5 h-5 md:w-6 md:h-6" /> Añadir Vocabulario</h2>
                                      <ExerciseHelpBtn helpId="guiones_vocab_custom" compact />
                                  </div>
                                  <div className="bg-black/40 p-2 md:p-3 rounded-xl border border-amber-900/50 mb-3 md:mb-4 flex flex-col gap-2 shrink-0">
                                      <div className="flex gap-2 items-center">
                                          <input type="text" placeholder="Título (Ej: Lektion 12)" className="w-2/3 bg-black/50 border border-amber-800 p-1.5 md:p-2 rounded-lg text-white text-xs md:text-sm outline-none focus:border-amber-500" value={vocabTitleInput} onChange={(e) => setVocabTitleInput(e.target.value)} />
                                          <button onClick={handleSaveCustomVocab} className="w-1/3 bg-amber-600 hover:bg-amber-500 text-white py-1.5 md:py-2 rounded-lg font-bold text-xs transition shadow-lg flex justify-center items-center gap-1"><Icon name="save" className="w-3 h-3 md:w-4 md:h-4" /> Guardar</button>
                                      </div>
                                      <p className="text-[10px] text-amber-700/90 mb-1">Paquetes de ejemplo en el repo: <code className="text-amber-200">vocab-packs/reise-mini.json</code> — abre el archivo, copia las líneas <code className="text-amber-200">de/es</code> o pega una lista: <code className="text-amber-200">der Bahnhof - la estación</code> por línea.</p>
                                  <textarea className="w-full h-12 md:h-14 bg-black/50 border border-amber-800 p-2 rounded-lg text-white font-mono text-[10px] md:text-xs outline-none focus:border-amber-500 resize-none" placeholder="Pega aquí tu lista...&#10;der Apfel - la manzana" value={vocabTextInput} onChange={(e) => setVocabTextInput(e.target.value)} />
                                  </div>
                                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 hide-scrollbar">
                                      {customVocabLessons.length === 0 ? <p className="text-gray-500 text-xs italic">Tus lecciones guardadas aparecerán aquí.</p> : null}
                                      {customVocabLessons.map(lesson => (
                                          <div key={lesson.id} className="bg-black/40 p-2 md:p-3 rounded-lg border border-amber-900/50 hover:border-amber-500 transition flex flex-col gap-2 md:gap-3 group">
                                              <div className="flex-1">
                                                  <p className="font-bold text-amber-100 text-xs md:text-sm truncate">{lesson.title}</p>
                                                  <p className="text-[10px] text-amber-600 mt-0.5">{lesson.words.length} palabras</p>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                  <button onClick={(e) => { e.stopPropagation(); let practiceList = [...lesson.words]; practiceList.sort(() => Math.random() - 0.5); let diffWords = lesson.words.filter(w => w.diff === 1); if(diffWords.length > 0) { let extraShuffled = [...diffWords].sort(() => Math.random() - 0.5); practiceList = [...practiceList, ...extraShuffled]; } setCurrentVocabList(mullerSortVocabBySrs(practiceList, mullerGetVocabSrsMap())); setActiveScriptTitle(lesson.title); setVocabReviewIndex(0); setShowVocabTranslation(false); setActiveTab('vocabulario'); }} className="bg-amber-600 hover:bg-amber-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold shadow-lg flex-1 flex justify-center items-center gap-1 md:gap-2 transition"><Icon name="play" className="w-3 h-3 md:w-4 md:h-4" /> Practicar</button>
                                                  <button onClick={(e) => { e.stopPropagation(); const newLessons = customVocabLessons.filter(l => l.id !== lesson.id); setCustomVocabLessons(newLessons); localStorage.setItem('mullerCustomVocab', JSON.stringify(newLessons)); }} className="text-gray-500 hover:text-red-500 bg-gray-900 p-1 rounded-lg border border-gray-700 transition"><Icon name="trash-2" className="w-3 h-3 md:w-4 md:h-4" /></button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  <button onClick={() => {
                                      if (customVocabLessons.length === 0) { alert("No hay lecciones guardadas."); return; }
                                      const init = {};
                                      customVocabLessons.forEach((l) => { init[l.id] = true; });
                                      setMixLessonSelection(init);
                                      setShowVocabMixModal(true);
                                  }} className="mt-3 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                                      <Icon name="shuffle" className="w-4 h-4" /> Practicar mezcla seleccionada
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* VOCABULARIO (con botón de escritura a mano) */}
                  {activeTab === 'vocabulario' && !practiceActive && (
                      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in relative">
                          <div className="absolute top-3 right-3 md:top-6 md:right-8 z-10 flex flex-col items-end gap-2"><ExerciseHelpBtn helpId="vocab_active_recall" />
                              <label className="flex items-center gap-2 text-[10px] font-bold text-amber-900/80 bg-white/20 px-2 py-1 rounded-lg border border-amber-900/20 cursor-pointer"><input type="checkbox" className="accent-amber-600" checked={vocabDueFilterOnly} onChange={(e) => { setVocabDueFilterOnly(e.target.checked); setVocabReviewIndex(0); }} /> Solo vencidas / nuevas hoy</label>
                          </div>
                          <h1 className="absolute top-4 md:top-8 text-lg md:text-2xl font-black text-amber-900/40 uppercase tracking-widest hidden md:block">Active Recall - {activeScriptTitle}</h1>
                          {vocabSrsDueCount > 0 ? (
                              <p className="absolute top-12 md:top-[4.25rem] left-1/2 -translate-x-1/2 max-w-lg text-center text-[10px] md:text-xs text-amber-900/70 font-bold px-3 hidden md:block">SRS: {vocabSrsDueCount} tarjetas prioritarias en esta lista (nuevas o tocadas hoy)</p>
                          ) : null}
                          <div className="w-full max-w-md mb-4 mt-10 md:mt-6 px-3">
                              <p className="text-[10px] font-bold text-amber-900/60 uppercase mb-1">Objetivo diario (tarjetas calificadas)</p>
                              <div className="flex items-center gap-2">
                                  <input type="range" min="3" max="60" step="1" value={mainDailyGoal} onChange={(e) => { const n = parseInt(e.target.value, 10); setMainDailyGoal(n); try { localStorage.setItem(MULLER_MAIN_GOAL_KEY, String(n)); } catch (err) {} }} className="flex-1 accent-amber-600" />
                                  <span className="text-xs font-mono font-bold text-amber-950 w-8">{mainDailyGoal}</span>
                              </div>
                              <div className="h-2 rounded-full bg-black/20 mt-2 overflow-hidden border border-amber-900/20">
                                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${Math.min(100, (mullerGetStreakTodayStats().vocabRated / Math.max(1, mainDailyGoal)) * 100)}%` }} />
                              </div>
                              <p className="text-[9px] text-amber-900/50 mt-1">Hoy: {mullerGetStreakTodayStats().vocabRated || 0}/{mainDailyGoal} · al completar el objetivo +10 monedas (una vez al día)</p>
                          </div>
                          {vocabDisplayList.length === 0 ? (
                              <div className="text-center text-amber-900/60 font-bold text-base md:text-2xl">{vocabDueFilterOnly ? 'No hay tarjetas vencidas en esta lista.' : 'Este guion no tiene vocabulario configurado.'}</div>
                          ) : (
                              <div className="max-w-2xl w-full flex flex-col items-center gap-6 md:gap-10">
                                  <button onClick={playVocabAudio} className="bg-white/20 hover:bg-white/30 text-amber-950 p-3 md:p-4 rounded-full transition shadow-lg mb-2 md:mb-4"><Icon name="volume-2" className="w-8 h-8 md:w-10 md:h-10" /></button>
                                  <h1 className="text-4xl md:text-8xl font-black text-slate-900 text-center drop-shadow-md flex items-center justify-center flex-wrap gap-1">{getArticleVisual(vocabDisplayList[vocabReviewIndex].de)}{vocabDisplayList[vocabReviewIndex].de}</h1>
                                  {!showVocabTranslation ? (
                                      <div className="flex gap-4">
                                          <button onClick={() => setShowVocabTranslation(true)} className="mt-6 md:mt-8 bg-slate-900 hover:bg-slate-800 text-white px-8 md:px-10 py-3 md:py-5 rounded-2xl font-bold text-2xl md:text-3xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition transform hover:scale-105 border-b-4 border-slate-700">Revelar 👀</button>
                                          <button onClick={() => setShowHandwriting(true)} className="mt-6 md:mt-8 bg-indigo-600 hover:bg-indigo-500 text-white px-6 md:px-8 py-3 md:py-5 rounded-2xl font-bold text-xl md:text-2xl shadow-lg transition transform hover:scale-105 border-b-4 border-indigo-800 flex items-center gap-2"><Icon name="edit" className="w-6 h-6" /> Escribir a mano</button>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center gap-6 md:gap-8 w-full animate-in slide-in-from-bottom-8">
                                          <h2 className="text-2xl md:text-5xl font-bold text-slate-800 text-center bg-white/60 px-4 md:px-10 py-3 md:py-6 rounded-2xl md:rounded-3xl shadow-inner border border-white/40 w-full">{vocabDisplayList[vocabReviewIndex].es}</h2>
                                          <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
                                              <button onClick={() => handleVocabDifficulty('easy')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg transition">Fácil (Descartar)</button>
                                              <button onClick={() => handleVocabDifficulty('normal')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg transition">Normal</button>
                                              <button onClick={() => handleVocabDifficulty('hard')} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg border-2 border-red-400 transition">Difícil</button>
                                          </div>
                                          <p className="text-[10px] md:text-xs text-slate-800/80 text-center max-w-md leading-snug">Cada opción actualiza el calendario SRS (intervalos tipo Anki/SM-2): más espacio si fue fácil, repaso antes si fue difícil.</p>
                                      </div>
                                  )}
                                  <p className="text-amber-900/60 font-bold mt-4 md:mt-8 bg-white/20 px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-amber-900/20 text-xs md:text-sm">Palabra {vocabReviewIndex + 1} de {vocabDisplayList.length}</p>
                                  {(() => {
                                      const w = vocabDisplayList[vocabReviewIndex];
                                      if (!w) return null;
                                      const s = vocabSrsMap[mullerVocabSrsKey(w)];
                                      const vc = s && typeof s.viewCount === 'number' ? s.viewCount : 0;
                                      const rc = s && typeof s.ratedCount === 'number' ? s.ratedCount : 0;
                                      return (
                                          <div className="text-[10px] text-amber-900/70 -mt-2 text-center max-w-lg space-y-0.5">
                                              {s && s.due ? <p>Próximo repaso: <strong className="text-amber-950">{s.due}</strong> · intervalo {s.interval} d · EF {typeof s.easeFactor === 'number' ? s.easeFactor.toFixed(2) : '—'}</p> : <p className="text-amber-900/50">Sin calificar aún en SRS</p>}
                                              <p>Vistas: <strong>{vc}</strong> · Calificaciones: <strong>{rc}</strong></p>
                                          </div>
                                      );
                                  })()}
                              </div>
                          )}
                          {showHandwriting && <HandwritingPad onClose={() => setShowHandwriting(false)} />}
                      </div>
                  )}

                  {activeTab === 'shadowing' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black text-teal-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="audio-lines" className="w-8 h-8 md:w-10 md:h-10" /> Shadowing
                              </h1>
                              <ExerciseHelpBtn helpId="shadowing_main" />
                          </div>
                          <p className="text-teal-50/90 text-sm md:text-base mb-6 leading-relaxed">
                              Escucha el modelo en alemán (voz del sistema), luego repite en voz alta siguiendo el ritmo y la entonación. Es la técnica de <strong className="text-white">shadowing</strong> para ganar fluidez y pronunciación tipo TELC.
                          </p>
                          {guionData.length === 0 ? (
                              <p className="text-gray-400 text-center py-12">No hay guion cargado. Abre <strong>Biblioteca</strong> y carga un guion.</p>
                          ) : (
                              <>
                                  {(() => {
                                      const si = Math.min(Math.max(0, sceneIndex), guionData.length - 1);
                                      const scene = guionData[si];
                                      const playModel = () => {
                                          if (!scene?.text) return;
                                          window.speechSynthesis.cancel();
                                          const u = new SpeechSynthesisUtterance(sanitizeHistoriaSpeechText(scene.text));
                                          u.lang = 'de-DE';
                                          u.rate = Math.min(1.15, Math.max(0.65, shadowRate));
                                          window.__mullerApplyPreferredDeVoice(u);
                                          window.speechSynthesis.speak(u);
                                      };
                                      return (
                                          <>
                                              <div className="bg-black/45 border border-teal-500/35 rounded-2xl p-4 md:p-6 mb-4 shadow-inner">
                                                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2">Escena {si + 1} / {guionData.length} · {scene?.speaker || '—'}</p>
                                                  {shadowShowText ? (
                                                      <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">{scene?.text}</p>
                                                  ) : (
                                                      <p className="text-gray-500 italic text-lg">Texto oculto — escucha el modelo y repite de memoria (shadowing ciego).</p>
                                                  )}
                                                  {shadowShowText && scene?.translation && (
                                                      <p className="text-gray-400 mt-3 text-sm italic border-t border-white/10 pt-3">({scene.translation})</p>
                                                  )}
                                              </div>
                                              <div className="flex flex-wrap gap-2 mb-4 items-center">
                                                  <span className="text-xs text-gray-400 w-full sm:w-auto">Velocidad del modelo:</span>
                                                  {[0.75, 0.88, 1].map((r) => (
                                                      <button key={r} type="button" onClick={() => setShadowRate(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${shadowRate === r ? 'bg-teal-600 text-white ring-1 ring-white/25' : 'bg-gray-800/90 text-gray-300 hover:bg-gray-700'}`}>{r === 0.75 ? 'Lenta' : r === 0.88 ? 'Media' : 'Normal'}</button>
                                                  ))}
                                                  <button type="button" onClick={() => setShadowShowText(!shadowShowText)} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-800 text-amber-100 border border-amber-700/40 hover:bg-gray-700">{shadowShowText ? 'Ocultar texto' : 'Mostrar texto'}</button>
                                              </div>
                                              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                  <button type="button" onClick={playModel} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg transition">
                                                      <Icon name="volume-2" className="w-5 h-5" /> Escuchar modelo
                                                  </button>
                                                  <button type="button" onClick={playModel} className="flex-1 bg-teal-900/85 hover:bg-teal-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-teal-500/30 transition">
                                                      <Icon name="repeat" className="w-5 h-5" /> Repetir audio
                                                  </button>
                                              </div>
                                              <p className="text-center text-gray-500 text-xs mb-4">Después de escuchar: habla al mismo tiempo o justo después; prioriza fluidez, no perfección.</p>
                                              <div className="rounded-2xl border border-teal-500/30 bg-black/35 p-4 md:p-5 mb-5">
                                                  <p className="text-xs font-bold text-teal-300 mb-1 flex items-center gap-2"><Icon name="mic" className="w-4 h-4" /> Comprobar pronunciación</p>
                                                  <p className="text-[10px] text-gray-500 mb-3">El navegador transcribe tu alemán y lo compara con el texto del guion (sin juzgar acento puro). Mantén pulsado el micrófono mientras lees la frase; suelta para ver el resultado. <span className="text-teal-400/90">En Shadowing no pierdes vidas.</span></p>
                                                  <div className="flex flex-col items-center gap-3">
                                                      <button type="button" aria-label="Mantén pulsado y lee en voz alta para comprobar pronunciación" onMouseDown={micMouseDownGuard(() => scene?.text && handleVoiceStart(scene.text, { mode: 'shadow' }))} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => scene?.text && handleVoiceStart(scene.text, { mode: 'shadow' }))} onTouchEnd={handleVoiceStop} className={`rounded-full p-5 md:p-6 text-white transition shadow-xl select-none touch-manipulation ${isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-400/35 shadow-[0_0_32px_rgba(239,68,68,0.55)] border-2 border-white/35' : 'muller-mic-hold-btn ring-4 ring-teal-300/35 shadow-[0_0_28px_rgba(20,184,166,0.45)]'}`} title="Mantén pulsado y lee en voz alta">
                                                          <Icon name="mic" className="w-10 h-10 md:w-12 md:h-12 text-white relative z-[1]" />
                                                      </button>
                                                      <span className="text-[10px] text-gray-500">Mantén pulsado · suelta para evaluar</span>
                                                      {grammarPolizeiMsg && (
                                                          <p className="text-amber-200/90 text-xs text-center bg-amber-950/40 border border-amber-700/30 rounded-lg px-3 py-2 w-full">{grammarPolizeiMsg}</p>
                                                      )}
                                                      {spokenText && (
                                                          <div className="w-full text-center mt-1">
                                                              <p className="text-yellow-200/95 font-mono text-sm md:text-base mb-2 break-words">"{spokenText}"</p>
                                                              {pronunciationFeedback.length > 0 && (
                                                                  <div className="flex flex-wrap gap-1 justify-center my-2 bg-black/40 p-2 rounded-xl border border-white/10">
                                                                      {pronunciationFeedback.map((item, idx) => (
                                                                          <span key={idx} className={`text-xs font-bold px-2 py-0.5 rounded ${item.correct ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-600/30' : 'bg-red-900/50 text-red-300 border border-red-600/30'}`}>{item.word}</span>
                                                                      ))}
                                                                  </div>
                                                              )}
                                                              {pronunciationScore !== null && (
                                                                  <div className="flex items-center justify-center gap-2 mt-2">
                                                                      <div className="flex-1 max-w-xs bg-gray-800 rounded-full h-2.5 overflow-hidden">
                                                                          <div className={`h-full rounded-full transition-all duration-700 ${pronunciationScore >= 85 ? 'bg-emerald-500' : pronunciationScore >= 55 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${pronunciationScore}%` }} />
                                                                      </div>
                                                                      <span className="font-black text-white text-sm md:text-lg tabular-nums">{pronunciationScore}%</span>
                                                                  </div>
                                                              )}
                                                              <p className="text-[10px] text-gray-500 mt-2">&gt;85%: verde · 55–84%: mejorable · &lt;55%: repite tras escuchar el modelo</p>
                                                          </div>
                                                      )}
                                                  </div>
                                              </div>
                                              <div className="flex gap-3 justify-center flex-wrap">
                                                  <button type="button" disabled={si <= 0} onClick={() => setSceneIndex((s) => Math.max(0, s - 1))} className="muller-icon-nav inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10"><Icon name="chevron-left" className="w-5 h-5 text-white" /> Anterior</button>
                                                  <button type="button" disabled={si >= guionData.length - 1} onClick={() => setSceneIndex((s) => Math.min(guionData.length - 1, s + 1))} className="muller-icon-nav inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10">Siguiente <Icon name="chevron-right" className="w-5 h-5 text-white" /></button>
                                              </div>
                                          </>
                                      );
                                  })()}
                              </>
                          )}
                      </div>
                  )}

                  {activeTab === 'lectura' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <h1 className="text-2xl md:text-4xl font-black text-sky-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="mic" className="w-8 h-8 md:w-10 md:h-10" /> Lectura en voz alta
                              </h1>
                          </div>
                          <p className="text-sky-50/90 text-sm md:text-base mb-4 leading-relaxed">
                              Lee un texto completo y compara tu producción con el original. Puedes usar la historia actual, un guion guardado o pegar un texto manualmente.
                              Toca cualquier palabra para ver traducción al español y, si es verbo, pasado y Perfekt.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                              <label className="text-xs font-bold text-sky-200/90 uppercase tracking-wider">
                                  Fuente
                                  <select value={readingSource} onChange={(e) => setReadingSource(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white normal-case">
                                      <option value="current_story">Historia actual</option>
                                      <option value="one_saved">Guion guardado</option>
                                      <option value="paste">Texto pegado</option>
                                  </select>
                              </label>
                              {readingSource === 'one_saved' && (
                                  <label className="text-xs font-bold text-sky-200/90 uppercase tracking-wider md:col-span-2">
                                      Guion
                                      <select value={readingScriptId} onChange={(e) => setReadingScriptId(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white normal-case">
                                          <option value="__current__" disabled>Selecciona un guion…</option>
                                          {readingScriptOptions.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                                      </select>
                                  </label>
                              )}
                          </div>
                          {readingSource === 'paste' && (
                              <textarea value={readingTextInput} onChange={(e) => setReadingTextInput(e.target.value)} placeholder="Pega aquí tu texto en alemán…" className="w-full h-40 bg-black/35 border border-sky-500/30 rounded-xl p-3 text-sm md:text-base text-white mb-3" />
                          )}

                          <div className="rounded-xl bg-black/35 border border-sky-500/25 p-3 mb-4">
                              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                  <p className="text-[11px] text-sky-200/80">Texto objetivo</p>
                                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-sky-500/35 bg-sky-950/40 px-2 py-1">
                                      <button
                                          type="button"
                                          onClick={() => setReadingFocusMode((v) => !v)}
                                          className={`px-2 py-0.5 text-[10px] font-bold rounded border ${readingFocusMode ? 'border-emerald-300/70 text-emerald-100 bg-emerald-900/45' : 'border-sky-400/40 text-sky-100 hover:bg-sky-900/60'}`}
                                      >
                                          {readingFocusMode ? 'Modo lectura: ON' : 'Modo lectura'}
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx((v) => mullerClamp(v - MULLER_READING_FONT_STEP, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX))}
                                          className="px-2 py-0.5 text-xs font-black rounded bg-sky-900/70 hover:bg-sky-800 text-sky-100"
                                          aria-label="Reducir tamaño de texto"
                                      >
                                          A-
                                      </button>
                                      <span className="text-[10px] font-bold text-sky-200 tabular-nums">{readingFontPx}px</span>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx((v) => mullerClamp(v + MULLER_READING_FONT_STEP, MULLER_READING_FONT_MIN, MULLER_READING_FONT_MAX))}
                                          className="px-2 py-0.5 text-xs font-black rounded bg-sky-900/70 hover:bg-sky-800 text-sky-100"
                                          aria-label="Aumentar tamaño de texto"
                                      >
                                          A+
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingFontPx(19)}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-sky-400/50 text-sky-100 hover:bg-sky-900/60"
                                      >
                                          Reset
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => readingSelectedWord && speakReadingWord(readingSelectedWord)}
                                          disabled={!readingSelectedWord || readingWordAudioBusy}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-cyan-400/55 text-cyan-100 hover:bg-cyan-900/50 disabled:opacity-40"
                                      >
                                          🔊 Palabra
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => speakReadingSentenceWithWord(readingSelectedWord)}
                                          disabled={(!readingSelectedWord && !readingSelectedSnippet) || readingWordAudioBusy}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-teal-400/55 text-teal-100 hover:bg-teal-900/50 disabled:opacity-40"
                                      >
                                          🔊 {readingSelectedSnippet ? 'Frase sel.' : 'Frase'}
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setReadingSelectedSnippet('')}
                                          disabled={!readingSelectedSnippet}
                                          className="px-2 py-0.5 text-[10px] font-bold rounded border border-slate-400/45 text-slate-200 hover:bg-slate-800/70 disabled:opacity-35"
                                      >
                                          Limpiar frase
                                      </button>
                                  </div>
                              </div>
                          <p className="text-[11px] text-sky-200/80 mb-2">
                              Puedes seleccionar una frase con el dedo o ratón y usar 🔊 Frase para reproducir solo esa parte.
                          </p>
                          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/25 p-3 mb-3 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-[11px] font-black text-cyan-200 uppercase tracking-wider">PDF estudio (premium · MVP)</p>
                                  <span className="text-[10px] text-cyan-100/75">Texto por página + OCR fallback</span>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-400/35 bg-black/35 text-xs font-bold text-cyan-100 cursor-pointer">
                                      <input
                                          type="file"
                                          accept="application/pdf"
                                          className="hidden"
                                          onChange={(e) => {
                                              const f = e.target.files && e.target.files[0];
                                              if (f) loadPdfStudyFile(f);
                                              e.target.value = '';
                                          }}
                                      />
                                      {pdfStudyExtracting ? '⏳ Procesando PDF…' : '📄 Subir PDF'}
                                  </label>
                                  {pdfStudySavedDocs.length > 0 && (
                                      <>
                                          <select
                                              value="__none__"
                                              onChange={(e) => {
                                                  const id = e.target.value;
                                                  if (id && id !== '__none__') loadPdfStudyFromLibrary(id);
                                                  e.target.value = '__none__';
                                              }}
                                              className="bg-black/45 border border-cyan-500/35 rounded-lg px-2 py-2 text-xs text-white"
                                          >
                                              <option value="__none__">Biblioteca PDF…</option>
                                              {pdfStudySavedDocs.map((d) => (
                                                  <option key={d.id} value={d.id}>
                                                      {d.name} · {d.totalPages || 0}p
                                                  </option>
                                              ))}
                                          </select>
                                          <button
                                              type="button"
                                              onClick={() => {
                                                  if (!pdfStudyDoc || !pdfStudyDoc.id) return;
                                                  removePdfStudyFromLibrary(pdfStudyDoc.id);
                                              }}
                                              disabled={!pdfStudyDoc || !pdfStudyDoc.id}
                                              className="px-3 py-2 rounded-lg border border-orange-500/35 bg-orange-900/40 hover:bg-orange-800/50 disabled:opacity-45 text-xs font-bold text-orange-100"
                                          >
                                              Borrar guardado
                                          </button>
                                          <button
                                              type="button"
                                              onClick={clearPdfStudyLibrary}
                                              className="px-3 py-2 rounded-lg border border-amber-600/35 bg-amber-950/45 hover:bg-amber-900/55 text-xs font-bold text-amber-100"
                                          >
                                              Vaciar biblioteca
                                          </button>
                                      </>
                                  )}
                                  {pdfStudyDoc && (
                                      <>
                                          <select
                                              value={Math.max(1, (activePdfPageData.page || 1))}
                                              onChange={(e) => setPdfStudyPageIdx(Math.max(0, Number(e.target.value) - 1))}
                                              className="bg-black/45 border border-cyan-500/35 rounded-lg px-2 py-2 text-xs text-white"
                                          >
                                              {(pdfStudyDoc.pages || []).map((p) => (
                                                  <option key={p.page} value={p.page}>
                                                      Página {p.page}{p.unit ? ` · U:${p.unit}` : ''}{p.lesson ? ` · L:${p.lesson}` : ''}{p.ocrPending ? ' · OCR pendiente' : ''}
                                                  </option>
                                              ))}
                                          </select>
                                          <button
                                              type="button"
                                              onClick={() => runPdfPageOcr(activePdfPageData.page || 1)}
                                              disabled={pdfStudyOcrBusy || pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-amber-500/35 bg-amber-900/40 hover:bg-amber-800/50 disabled:opacity-45 text-xs font-bold text-amber-100"
                                          >
                                              {pdfStudyOcrBusy ? 'OCR…' : 'OCR página'}
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => applyPdfStudyTextToReading(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-emerald-500/35 bg-emerald-900/40 hover:bg-emerald-800/50 disabled:opacity-45 text-xs font-bold text-emerald-100"
                                          >
                                              Usar en Lectura
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => applyPdfStudyTextToWriting(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-rose-500/35 bg-rose-900/40 hover:bg-rose-800/50 disabled:opacity-45 text-xs font-bold text-rose-100"
                                          >
                                              Usar en Escritura
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => openPdfStudyFullscreen(activePdfPageData.page || 1)}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-indigo-500/35 bg-indigo-900/45 hover:bg-indigo-800/55 disabled:opacity-45 text-xs font-bold text-indigo-100"
                                          >
                                              Abrir PDF completo
                                          </button>
                                          <button
                                              type="button"
                                              onClick={saveCurrentPdfStudyDoc}
                                              disabled={pdfStudyExtracting}
                                              className="px-3 py-2 rounded-lg border border-sky-500/35 bg-sky-900/45 hover:bg-sky-800/55 disabled:opacity-45 text-xs font-bold text-sky-100"
                                          >
                                              Guardar PDF
                                          </button>
                                          <button
                                              type="button"
                                              onClick={clearPdfStudyDoc}
                                              disabled={pdfStudyExtracting || pdfStudyOcrBusy}
                                              className="px-3 py-2 rounded-lg border border-red-500/35 bg-red-900/45 hover:bg-red-800/55 disabled:opacity-45 text-xs font-bold text-red-100"
                                          >
                                              Quitar PDF
                                          </button>
                                      </>
                                  )}
                              </div>
                              {pdfStudyErr ? <p className="text-[11px] text-red-300">{pdfStudyErr}</p> : null}
                              {pdfStudyBusyMsg ? <p className="text-[11px] text-cyan-100/80">{pdfStudyBusyMsg}</p> : null}
                              {pdfStudyDoc && (
                                  <div className="text-[10px] text-cyan-100/80 space-y-1">
                                      <p><strong className="text-cyan-200">Libro:</strong> {pdfStudyDoc.name} · {pdfStudyDoc.totalPages} páginas</p>
                                      <p><strong className="text-cyan-200">Unidad:</strong> {activePdfPageData.unit || '—'} · <strong className="text-cyan-200">Lección:</strong> {activePdfPageData.lesson || '—'} · <strong className="text-cyan-200">Página:</strong> {activePdfPageData.page || '—'}</p>
                                      {pdfStudyLastApplied ? <p className="text-emerald-300/90">{pdfStudyLastApplied}</p> : null}
                                  </div>
                              )}
                              {pdfStudyDoc && activePdfPageData.page ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <label className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">
                                          Unidad (manual)
                                          <input
                                              value={activePdfPageData.unit || ''}
                                              onChange={(e) => updatePdfStudyPageMeta(activePdfPageData.page || 1, { unit: e.target.value })}
                                              placeholder="Ej: 3"
                                              className="mt-1 w-full bg-black/45 border border-cyan-500/30 rounded-lg px-2 py-1.5 text-xs text-white normal-case"
                                          />
                                      </label>
                                      <label className="text-[10px] font-bold text-cyan-200/90 uppercase tracking-wider">
                                          Lección (manual)
                                          <input
                                              value={activePdfPageData.lesson || ''}
                                              onChange={(e) => updatePdfStudyPageMeta(activePdfPageData.page || 1, { lesson: e.target.value })}
                                              placeholder="Ej: A"
                                              className="mt-1 w-full bg-black/45 border border-cyan-500/30 rounded-lg px-2 py-1.5 text-xs text-white normal-case"
                                          />
                                      </label>
                                  </div>
                              ) : null}
                              {pdfStudyDoc && (
                                  <textarea
                                      value={activePdfPageData.text || ''}
                                      readOnly
                                      className="w-full h-28 bg-black/35 border border-cyan-500/25 rounded-xl p-3 text-xs md:text-sm text-cyan-50"
                                      placeholder="Sin texto extraído en esta página todavía."
                                  />
                              )}
                          </div>
                              
                          {readingFocusMode && (
                                  <p className="text-[11px] text-emerald-200/90 mb-2">
                                      Modo lectura activo: se ocultan resultados de evaluación para concentrarte en comprensión + diccionario.
                                  </p>
                              )}
                              {readingTargetText ? (
                                  <div
                                      ref={readingTextSurfaceRef}
                                      className="text-white leading-relaxed whitespace-pre-wrap"
                                      onMouseUp={readingCaptureCurrentSelection}
                                      onTouchEnd={readingCaptureCurrentSelection}
                                      onKeyUp={readingCaptureCurrentSelection}
                                      style={{ fontSize: `${readingFontPx}px`, lineHeight: 1.65, userSelect: 'text', WebkitUserSelect: 'text' }}
                                  >
                                      {readingWordTokens.map((token, idx) => {
                                          if (!token.clickable) return <span key={`s-${idx}`}>{token.text}</span>;
                                          const isActive = token.word === readingSelectedWord;
                                          return (
                                              <span
                                                  key={`w-${idx}`}
                                                  role="button"
                                                  tabIndex={0}
                                                  className={`reading-word-token ${isActive ? 'is-active' : ''}`}
                                                  onClick={() => runReadingWordLookup(token.word)}
                                                  onKeyDown={(e) => {
                                                      if (e.key === 'Enter' || e.key === ' ') {
                                                          e.preventDefault();
                                                          runReadingWordLookup(token.word);
                                                      }
                                                  }}
                                                  title="Tocar para ver traducción y tiempos"
                                              >
                                                  {token.text}
                                              </span>
                                          );
                                      })}
                                  </div>
                              ) : (
                                  <p className="text-sm md:text-base text-white leading-relaxed whitespace-pre-wrap">No hay texto disponible para comparar.</p>
                              )}
                              {readingSelectedSnippet && (
                                  <div className="mt-2 rounded-lg border border-teal-500/30 bg-teal-950/25 px-2.5 py-2">
                                      <p className="text-[11px] text-teal-100">
                                          Frase seleccionada: <span className="text-white">{readingSelectedSnippet.length > 160 ? `${readingSelectedSnippet.slice(0, 160)}…` : readingSelectedSnippet}</span>
                                      </p>
                                  </div>
                              )}
                          </div>

                          {readingWordInfo && (
                              <div className="rounded-xl bg-cyan-950/35 border border-cyan-500/30 p-3 mb-4 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                      <p className="text-cyan-200 font-black text-sm">Palabra: <span className="text-white">{readingWordInfo.word}</span></p>
                                      {readingWordInfo.loading && <span className="text-[10px] font-bold text-cyan-300 animate-pulse">Buscando…</span>}
                                  </div>
                                  {readingWordInfo.translation && (
                                      <p className="text-sm text-cyan-100">
                                          <span className="font-bold text-cyan-300">Traducción:</span> {readingWordInfo.translation}
                                      </p>
                                  )}
                                  {!readingWordInfo.loading && !readingWordInfo.translation && (
                                      <p className="text-xs text-cyan-200/80">No se obtuvo traducción automática para esta palabra.</p>
                                  )}
                                  {readingWordInfo.error && <p className="text-xs text-red-300">{readingWordInfo.error}</p>}
                                  {readingVerbInfo && (
                                      <div className="rounded-lg bg-black/25 border border-white/10 p-2.5">
                                          <p className="text-xs text-emerald-300 font-black mb-1">
                                              Verbo detectado{readingVerbInfo.level ? ` · ${readingVerbInfo.level}` : ''}
                                          </p>
                                          <p className="text-xs text-emerald-100">Infinitivo: <strong>{readingVerbInfo.infinitive}</strong></p>
                                          {(readingVerbInfo.translation && !readingWordInfo.translation) && (
                                              <p className="text-xs text-emerald-100">ES: {readingVerbInfo.translation}</p>
                                          )}
                                          {readingVerbInfo.praeteritum && <p className="text-xs text-emerald-100">Pasado (Präteritum): {readingVerbInfo.praeteritum}</p>}
                                          {readingVerbInfo.perfekt && <p className="text-xs text-emerald-100">Perfekt: {readingVerbInfo.perfekt}</p>}
                                          {!readingVerbInfo.praeteritum && !readingVerbInfo.perfekt && readingVerbInfo.formsHint && (
                                              <p className="text-xs text-emerald-100">{readingVerbInfo.formsHint}</p>
                                          )}
                                      </div>
                                  )}
                              </div>
                          )}

                          <div className="flex flex-wrap gap-3 items-center mb-3">
                              <button type="button" onClick={startReadingListen} disabled={readingListening || !readingTargetText} className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 font-black text-sm">🎤 Empezar lectura</button>
                              <button type="button" onClick={stopReadingListen} disabled={!readingListening} className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-40 font-black text-sm">⏹ Parar y evaluar</button>
                              <span className={`text-xs font-bold ${readingListening ? 'text-emerald-300 animate-pulse' : 'text-gray-500'}`}>{readingListening ? 'Escuchando…' : 'Micrófono en espera'}</span>
                          </div>
                          {!readingFocusMode && readingListening && readingProgress.total > 0 && (
                              <p className="text-[11px] text-sky-200/75 -mt-1 mb-3">Progreso lectura: {readingProgress.matched}/{readingProgress.total} palabras ({readingProgress.pct}%).</p>
                          )}
                          {!readingFocusMode && readingTranscript && (
                              <div className="rounded-xl bg-amber-950/35 border border-amber-600/30 p-3 mb-3">
                                  <p className="text-[11px] text-amber-200/80 mb-1">Tu lectura detectada</p>
                                  <p className="text-sm text-amber-100">{readingTranscript}</p>
                              </div>
                          )}
                          {!readingFocusMode && readingScore !== null && (
                              <div className="rounded-xl bg-sky-950/35 border border-sky-500/30 p-3 mb-3">
                                  <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2.5 rounded-full bg-black/40 overflow-hidden">
                                          <div className={`h-full ${readingScore >= 85 ? 'bg-emerald-500' : readingScore >= 60 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${readingScore}%` }} />
                                      </div>
                                      <span className="text-white font-black text-sm">{readingScore}%</span>
                                  </div>
                              </div>
                          )}
                          {!readingFocusMode && readingFeedback.length > 0 && (
                              <div className="rounded-xl bg-black/35 border border-red-500/30 p-3 space-y-2">
                                  <p className="text-red-200 font-bold text-sm">Palabras a mejorar</p>
                                  {readingFeedback.map((f, i) => (
                                      <div key={i} className="text-xs md:text-sm border border-white/10 rounded-lg p-2 bg-white/5">
                                          <p className="text-red-200 font-bold">{f.word}</p>
                                          <p className="text-gray-300 mt-0.5">{f.tip}</p>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  )}

                  {activeTab === 'escritura' && !practiceActive && (
                      <div className="flex-1 flex flex-col p-3 md:p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500 overflow-y-auto pb-24">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h1 className="text-2xl md:text-4xl font-black text-rose-100 flex items-center gap-2 md:gap-3">
                                  <Icon name="pen-line" className="w-8 h-8 md:w-10 md:h-10" /> Escritura
                              </h1>
                              <ExerciseHelpBtn helpId={escrituraExerciseHelpId} />
                          </div>
                          <p className="text-stone-300/95 text-xs md:text-sm mb-4 leading-relaxed border-b border-white/10 pb-3">
                              Zona solo para escribir a mano — pensada para <strong className="text-white">tableta con lápiz</strong> (p. ej. Lenovo Tab). El lienzo usa <strong className="text-white">pointer capture</strong> para que el trazo no se pierda al apoyar la mano. Encima del lienzo tienes <strong className="text-white">goma con varios anchos</strong>, marcador fluorescente, subrayado y <strong className="text-white">deshacer el último trazo</strong> sin borrar todo. Activa las <strong className="text-white">líneas</strong> como cuaderno.
                          </p>
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                              {[
                                  { id: 'free', label: 'Libre', sub: 'notas / borrador' },
                                  { id: 'copy', label: 'Copia', sub: 'caligrafía' },
                                  { id: 'dictation', label: 'Dictado', sub: 'oír y escribir' },
                                  { id: 'prompt', label: 'Tema', sub: 'redacción' },
                                  { id: 'telc', label: 'TELC', sub: 'carta/email examen' },
                                  { id: 'letters', label: 'Letras DE', sub: 'ÄÖÜß' },
                                  { id: 'guion', label: 'Guion', sub: 'misma historia' },
                                  { id: 'vocab', label: 'Palabra', sub: 'del vocab' }
                              ].map((m) => (
                                  <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => { setWritingMode(m.id); setWritingDictReveal(false); setWritingCanvasKey((k) => k + 1); }}
                                      className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl text-left border transition ${writingMode === m.id ? 'bg-rose-800/90 border-rose-400/50 text-white shadow-lg' : 'bg-black/40 border-white/10 text-gray-400 hover:border-rose-500/40 hover:text-white'}`}
                                  >
                                      <span className="block text-[10px] md:text-xs font-black">{m.label}</span>
                                      <span className="block text-[9px] text-gray-500 md:text-[10px]">{m.sub}</span>
                                  </button>
                              ))}
                          </div>

                          {ocrHistoryList.length > 0 && (
                              <div className="mb-4 rounded-xl border border-indigo-500/35 bg-indigo-950/20 p-3">
                                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2">Historial OCR (últimas {ocrHistoryList.length})</p>
                                  <ul className="space-y-1.5 text-[10px] text-gray-400 max-h-36 overflow-y-auto pr-1">
                                      {ocrHistoryList.map((h) => (
                                          <li key={h.id || h.at} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-1.5">
                                              <span className="text-gray-500 shrink-0">{h.at ? new Date(h.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                              <span className="text-emerald-300 font-mono font-bold">{h.pct != null ? `${h.pct}%` : 'sin %'}</span>
                                              <span className="w-full text-gray-500 truncate italic">{(h.textSnippet || '').slice(0, 70)}{(h.textSnippet || '').length > 70 ? '…' : ''}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          )}

                          {writingMode === 'free' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4">
                                  <p className="text-rose-200/90 text-sm font-bold mb-1">Página en blanco</p>
                                  <p className="text-[11px] text-gray-500">Escribe lo que quieras: resúmenes, listas, conjugaciones… Usa <strong className="text-gray-300">Borrar</strong> o <strong className="text-gray-300">Guardar PNG</strong> debajo del lienzo.</p>
                              </div>
                          )}

                          {writingMode === 'copy' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Copia la frase (caligrafía alemana)</p>
                                  <p className="text-lg md:text-2xl text-white font-medium leading-snug">{WRITING_COPY_DRILLS[writingCopyIdx % WRITING_COPY_DRILLS.length]}</p>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                      <button type="button" onClick={() => { setWritingCopyIdx((i) => (i + 1) % WRITING_COPY_DRILLS.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40">Otra frase →</button>
                                  </div>
                              </div>
                          )}

                          {writingMode === 'dictation' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-3">
                                  <p className="text-rose-200/90 text-sm font-bold">Dictado alemán</p>
                                  <p className="text-[11px] text-gray-500">
                                      Escucha (varias veces si hace falta). Escribe en el lienzo lo que oyes. Luego comprueba el texto.
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                          Fuente del dictado
                                          <select
                                              value={writingDictSource}
                                              onChange={(e) => {
                                                  const v = e.target.value;
                                                  setWritingDictSource(v);
                                                  setWritingDictIdx(0);
                                                  setWritingDictReveal(false);
                                              }}
                                              className="mt-1 w-full bg-black/45 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white font-semibold"
                                          >
                                              <option value="builtin">Base integrada</option>
                                              <option value="current_story">Historia actual</option>
                                              <option value="all_saved">Mezcla de guiones guardados</option>
                                              <option value="one_saved">Un guion concreto</option>
                                          </select>
                                      </label>
                                      {writingDictSource === 'one_saved' && (
                                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                              Guion guardado
                                              <select
                                                  value={writingDictScriptId}
                                                  onChange={(e) => {
                                                      setWritingDictScriptId(e.target.value);
                                                      setWritingDictIdx(0);
                                                      setWritingDictReveal(false);
                                                  }}
                                                  className="mt-1 w-full bg-black/45 border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white font-semibold"
                                              >
                                                  <option value="__current__" disabled>Selecciona un guion…</option>
                                                  {writingScriptOptions.map((s) => (
                                                      <option key={s.id} value={s.id}>{s.title} ({s.count})</option>
                                                  ))}
                                              </select>
                                          </label>
                                      )}
                                  </div>
                                  <p className="text-[10px] text-rose-200/75">
                                      Ítem {Math.min(writingDictIdx + 1, Math.max(1, writingDictationPool.length))} de {Math.max(1, writingDictationPool.length)}
                                      {writingDictationPool[writingDictIdx % Math.max(1, writingDictationPool.length)]?.origin ? ` · ${writingDictationPool[writingDictIdx % Math.max(1, writingDictationPool.length)].origin}` : ''}
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center">
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (!writingDictationPool.length) return;
                                              const line = writingDictationPool[writingDictIdx % writingDictationPool.length];
                                              window.speechSynthesis.cancel();
                                              const u = new SpeechSynthesisUtterance(line.de);
                                              u.lang = 'de-DE';
                                              u.rate = 0.88;
                                              window.__mullerApplyPreferredDeVoice(u);
                                              window.speechSynthesis.speak(u);
                                          }}
                                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 font-bold text-sm"
                                      >
                                          <Icon name="volume-2" className="w-4 h-4" /> Escuchar dictado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (!writingDictationPool.length) return;
                                              setWritingDictIdx((i) => (i + 1) % writingDictationPool.length);
                                              setWritingDictReveal(false);
                                              setWritingCanvasKey((k) => k + 1);
                                          }}
                                          className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10"
                                      >
                                          Otro dictado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => setWritingDictReveal((r) => !r)}
                                          className="text-xs font-bold px-3 py-2 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-600/40"
                                      >
                                          {writingDictReveal ? 'Ocultar solución' : 'Mostrar solución'}
                                      </button>
                                  </div>
                                  {writingDictReveal && writingDictationPool.length > 0 && (
                                      <div className="border border-emerald-700/40 rounded-lg p-4 md:p-5 bg-emerald-950/40">
                                          <p className="text-white font-semibold text-lg md:text-2xl leading-snug">
                                              {writingDictationPool[writingDictIdx % writingDictationPool.length].de}
                                          </p>
                                          <p className="text-emerald-200/90 text-sm md:text-base mt-2 italic leading-relaxed">
                                              {writingDictationPool[writingDictIdx % writingDictationPool.length].es || 'Sin traducción disponible en esta línea.'}
                                          </p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {writingMode === 'prompt' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Tema para redacción corta</p>
                                  <p className="text-base md:text-lg text-white font-semibold">{WRITING_PROMPTS_DE[writingPromptIdx % WRITING_PROMPTS_DE.length].de}</p>
                                  <p className="text-xs text-gray-500 italic">{WRITING_PROMPTS_DE[writingPromptIdx % WRITING_PROMPTS_DE.length].es}</p>
                                  <button type="button" onClick={() => { setWritingPromptIdx((i) => (i + 1) % WRITING_PROMPTS_DE.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40 mt-2">Otro tema</button>
                              </div>
                          )}

                          {writingMode === 'telc' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-orange-500/30 p-3 md:p-4 space-y-3">
                                  <p className="text-orange-200/95 text-sm font-black flex items-center gap-2">
                                      <Icon name="mail" className="w-4 h-4" /> TELC Schreiben a mano (carta / email)
                                  </p>
                                  <p className="text-[11px] text-gray-500">
                                      Redacta a mano como en examen real con bolígrafo óptico. Cubre todos los puntos del enunciado.
                                  </p>
                                  <div className="rounded-lg border border-orange-500/35 bg-orange-950/25 p-2.5 space-y-2">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-200">Método de escritura TELC</p>
                                      <div className="flex flex-wrap gap-2">
                                          <button
                                              type="button"
                                              onClick={() => setWritingTelcInputMode('pen')}
                                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${writingTelcInputMode === 'pen' ? 'bg-orange-600 text-white border-orange-300/60' : 'bg-black/40 text-gray-300 border-white/10 hover:text-white'}`}
                                          >
                                              ✍ Lápiz óptico
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() => setWritingTelcInputMode('keyboard')}
                                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${writingTelcInputMode === 'keyboard' ? 'bg-orange-600 text-white border-orange-300/60' : 'bg-black/40 text-gray-300 border-white/10 hover:text-white'}`}
                                          >
                                              ⌨ Teclado
                                          </button>
                                      </div>
                                      {writingTelcInputMode === 'keyboard' && (
                                          <textarea
                                              value={writingTelcTypedText}
                                              onChange={(e) => setWritingTelcTypedText(e.target.value)}
                                              placeholder="Escribe aquí tu carta/email TELC con teclado…"
                                              className="w-full min-h-[140px] bg-black/45 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-orange-400"
                                          />
                                      )}
                                      {writingTelcInputMode === 'pen' && (
                                          <p className="text-[11px] text-orange-100/90">
                                              Usa el lienzo de abajo y luego pulsa <strong>Evaluar texto TELC</strong> (leerá el OCR).
                                          </p>
                                      )}
                                  </div>
                                  <p className="text-[10px] text-rose-200/75">
                                      Tarea {Math.min(writingTelcIdx + 1, Math.max(1, WRITING_TELC_TASKS.length))} de {Math.max(1, WRITING_TELC_TASKS.length)} · {WRITING_TELC_TASKS[writingTelcIdx % Math.max(1, WRITING_TELC_TASKS.length)]?.level || 'TELC'}
                                  </p>
                                  <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2">
                                      <p className="text-[11px] font-black uppercase tracking-wider text-rose-300">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].title}</p>
                                      <p className="text-sm md:text-base text-white leading-relaxed">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].promptDe}</p>
                                      <p className="text-[11px] text-gray-400 italic">{WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].promptEs}</p>
                                      <div className="rounded-lg border border-emerald-700/35 bg-emerald-950/30 p-2">
                                          <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Checklist del encargo</p>
                                          <ul className="text-[11px] text-emerald-100/90 space-y-1">
                                              {WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].checklist.map((item, i) => (
                                                  <li key={i}>• {item}</li>
                                              ))}
                                          </ul>
                                      </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (!WRITING_TELC_TASKS.length) return;
                                              setWritingTelcIdx((i) => (i + 1) % WRITING_TELC_TASKS.length);
                                              setWritingCanvasKey((k) => k + 1);
                                          }}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-800 hover:bg-violet-700 border border-violet-500/40"
                                      >
                                          Siguiente tarea TELC
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => speakRutaDe(WRITING_TELC_TASKS[writingTelcIdx % WRITING_TELC_TASKS.length].dePrompt)}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 inline-flex items-center gap-1.5"
                                      >
                                          <Icon name="volume-2" className="w-3.5 h-3.5" /> Escuchar enunciado
                                      </button>
                                      <button
                                          type="button"
                                          onClick={runTelcCoachFromCurrentInput}
                                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 border border-emerald-400/40 inline-flex items-center gap-1.5"
                                      >
                                          <Icon name="clipboard-check" className="w-3.5 h-3.5" /> Evaluar texto TELC
                                      </button>
                                  </div>
                                  {writingTelcCoach && (
                                      <div className="rounded-xl border border-emerald-500/35 bg-emerald-950/25 p-3 space-y-2">
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                              <p className="text-sm font-black text-emerald-200">TELC Writing Coach</p>
                                              <span className="text-xs font-black text-white bg-black/35 border border-white/10 rounded-full px-2 py-0.5">{writingTelcCoach.total}/{writingTelcCoach.max} · {writingTelcCoach.pct}%</span>
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Aufgabe</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreTask}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Register</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreRegister}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Kohärenz</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreCohesion}/5</strong></p>
                                              <p className="rounded-lg bg-black/30 border border-white/10 px-2 py-1"><span className="text-gray-400">Grammatik</span><br /><strong className="text-emerald-200">{writingTelcCoach.scoreGrammar}/5</strong></p>
                                          </div>
                                          <p className="text-[11px] text-emerald-100/95">{writingTelcCoach.suggestionText}</p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {writingMode === 'letters' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">{LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].title}</p>
                                  <p className="text-xs text-amber-200/80">{LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].sample}</p>
                                  <p className="text-lg md:text-xl text-white tracking-wide font-medium">Práctica: {LETTER_DRILLS[writingLetterIdx % LETTER_DRILLS.length].practice}</p>
                                  <button type="button" onClick={() => { setWritingLetterIdx((i) => (i + 1) % LETTER_DRILLS.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600/40">Siguiente bloque</button>
                              </div>
                          )}

                          {writingMode === 'guion' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  {guionData.length === 0 ? (
                                      <p className="text-gray-500 text-sm">No hay guion. Carga uno en <strong className="text-white">Biblioteca</strong>.</p>
                                  ) : (
                                      <>
                                          <p className="text-rose-200/90 text-sm font-bold">Copia una línea del guion activo</p>
                                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Escena {writingGuionWriteIdx + 1} / {guionData.length} · {guionData[writingGuionWriteIdx]?.speaker || '—'}</p>
                                          <p className="text-lg md:text-xl text-white leading-relaxed">{guionData[writingGuionWriteIdx]?.text}</p>
                                          {guionData[writingGuionWriteIdx]?.translation && <p className="text-xs text-gray-500 italic border-t border-white/10 pt-2">({guionData[writingGuionWriteIdx].translation})</p>}
                                          <div className="flex flex-wrap gap-2 pt-2">
                                              <button type="button" disabled={writingGuionWriteIdx <= 0} onClick={() => { setWritingGuionWriteIdx((i) => Math.max(0, i - 1)); setWritingCanvasKey((k) => k + 1); }} className="muller-icon-nav inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-white/10 disabled:opacity-30"><Icon name="chevron-left" className="w-3.5 h-3.5 text-white shrink-0" /> Anterior</button>
                                              <button type="button" disabled={writingGuionWriteIdx >= guionData.length - 1} onClick={() => { setWritingGuionWriteIdx((i) => Math.min(guionData.length - 1, i + 1)); setWritingCanvasKey((k) => k + 1); }} className="muller-icon-nav inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-white/10 disabled:opacity-30">Siguiente <Icon name="chevron-right" className="w-3.5 h-3.5 text-white shrink-0" /></button>
                                          </div>
                                      </>
                                  )}
                              </div>
                          )}

                          {writingMode === 'vocab' && (
                              <div className="mb-4 rounded-xl bg-black/35 border border-rose-500/25 p-3 md:p-4 space-y-2">
                                  <p className="text-rose-200/90 text-sm font-bold">Repite la palabra / frase del vocabulario</p>
                                  {currentVocabList.length === 0 ? (
                                      <p className="text-gray-500 text-sm">Sin lista de vocabulario aún. Abre <strong className="text-white">Vocab</strong> o carga un guion con vocabulario en <strong className="text-white">Historia</strong>.</p>
                                  ) : (
                                      <>
                                          <p className="text-xl md:text-2xl text-amber-100 font-black">{currentVocabList[writingVocabIdx % currentVocabList.length].de}</p>
                                          <p className="text-sm text-gray-500">{currentVocabList[writingVocabIdx % currentVocabList.length].es}</p>
                                          <button type="button" onClick={() => { setWritingVocabIdx((i) => (i + 1) % currentVocabList.length); setWritingCanvasKey((k) => k + 1); }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-900/50 hover:bg-amber-800/70 border border-amber-600/40">Otra palabra</button>
                                      </>
                                  )}
                              </div>
                          )}

                          <div className="flex flex-wrap gap-2 md:gap-3 items-center mb-3 text-[11px] md:text-xs">
                              <label className="flex items-center gap-2 cursor-pointer bg-black/30 px-2 py-1 rounded-lg border border-white/10">
                                  <input type="checkbox" className="accent-rose-500" checked={writingGrid} onChange={(e) => setWritingGrid(e.target.checked)} />
                                  Líneas (cuaderno)
                              </label>
                              <span className="text-gray-500">Grosor lápiz:</span>
                              {[2, 4, 7].map((w) => (
                                  <button key={w} type="button" onClick={() => setWritingStroke(w)} className={`px-2 py-1 rounded-lg font-bold ${writingStroke === w ? 'bg-rose-700 text-white' : 'bg-slate-800 text-gray-400'}`}>{w}px</button>
                              ))}
                          </div>

                          <TabletWritingCanvas
                              padKey={writingCanvasKey}
                              grid={writingGrid}
                              strokeW={writingStroke}
                              compareTarget={writingCompareTarget}
                              snapshotData={writingCanvasSnapshot.data}
                              snapshotPadKey={writingCanvasSnapshot.padKey}
                              onSnapshotChange={(dataUrl) => setWritingCanvasSnapshot({ padKey: writingCanvasKey, data: dataUrl || '' })}
                              onOcrCompared={(payload) => {
                                  const arr = mullerPushOcrHistory(payload);
                                  setOcrHistoryList(arr);
                                  if (writingMode === 'telc') {
                                      setWritingTelcLastOcrText(String(payload && payload.recognizedText ? payload.recognizedText : '').trim());
                                  }
                              }}
                          />
                      </div>
                  )}

                  {celebrationModal && (
                      <div className="fixed inset-0 z-[280] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true">
                          <div className="relative max-w-md w-full rounded-[2rem] border border-white/20 bg-gradient-to-br from-fuchsia-900/95 via-violet-950/95 to-indigo-950/95 p-8 shadow-[0_0_80px_rgba(236,72,153,0.35)] text-center overflow-hidden animate-in zoom-in-95 duration-300">
                              <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(251,113,133,0.5), transparent 50%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.45), transparent 45%)' }} aria-hidden="true" />
                              <div className="relative z-10">
                                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg ring-4 ring-amber-300/40">
                                      <Icon name="trophy" className="w-10 h-10 text-white" />
                                  </div>
                                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{celebrationModal.title}</h2>
                                  <p className="text-fuchsia-100/90 text-sm md:text-base mb-6">{celebrationModal.subtitle}</p>
                                  <div className="flex flex-wrap justify-center gap-3 text-sm font-bold">
                                      {celebrationModal.xp > 0 ? <span className="rounded-full bg-white/15 px-4 py-2">+{celebrationModal.xp} XP</span> : null}
                                      {celebrationModal.coins > 0 ? <span className="rounded-full bg-amber-500/30 px-4 py-2 text-amber-100">+{celebrationModal.coins} monedas</span> : null}
                                      {celebrationModal.milestone ? <span className="rounded-full bg-emerald-500/30 px-4 py-2 text-emerald-100">Bonus · 3 lecciones</span> : null}
                                      {celebrationModal.placement ? <span className="rounded-full bg-sky-500/30 px-4 py-2 text-sky-100">Test completado</span> : null}
                                      {celebrationModal.recap ? <span className="rounded-full bg-violet-500/25 px-4 py-2 text-violet-100">Repaso</span> : null}
                                  </div>
                                  <button type="button" className="mt-8 w-full rounded-xl bg-white text-violet-950 font-black py-3 hover:bg-fuchsia-100 transition" onClick={() => setCelebrationModal(null)}>¡Genial!</button>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'ruta' && !practiceActive && (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                              <div>
                              <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2"><Icon name="map" className="w-9 h-9 md:w-12 md:h-12 text-fuchsia-400" /> Ruta A0 → C1</h1>
                                  <p className="text-gray-400 text-sm md:text-base max-w-2xl">Camino desde cero: frases, huecos, voz y recompensas. Tecla <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-xs">R</kbd>.</p>
                              </div>
                              <ExerciseHelpBtn helpId="nav_ruta" />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mb-4 rounded-2xl border border-white/10 bg-black/35 p-4">
                              <span className="text-xs font-bold uppercase text-gray-500">Mentor (voz)</span>
                              {[
                                  { id: 'lena', label: 'Frau Lena', sub: 'voz clara' },
                                  { id: 'tom', label: 'Herr Tom', sub: 'grave' },
                                  { id: 'lina', label: 'Lina', sub: 'aguda' },
                              ].map((m) => (
                                  <button key={m.id} type="button" onClick={() => { setRutaMentor(m.id); window.__mullerPlaySfx && window.__mullerPlaySfx('tick'); }} className={`rounded-xl px-3 py-2 text-left text-xs font-bold border transition ${rutaMentor === m.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-slate-900/80 border-white/10 text-gray-400 hover:text-white'}`}>
                                      <span className="block">{m.label}</span>
                                      <span className="text-[10px] font-normal opacity-80">{m.sub}</span>
                                  </button>
                              ))}
                              <button type="button" onClick={() => { try { localStorage.setItem('muller_sfx_enabled', (typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled()) ? '0' : '1'); } catch (e) {} setSfxEpoch((x) => x + 1); }} className="ml-auto text-xs font-bold rounded-xl border border-white/15 px-3 py-2 text-gray-300 hover:bg-white/10" title="Acierto, fallo y fanfarria cada 5 aciertos seguidos (5, 10, 15…)">
                                  Sonidos: {sfxEpoch >= 0 && typeof window.__mullerSfxEnabled === 'function' && window.__mullerSfxEnabled() ? 'ON' : 'OFF'}
                              </button>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-4">Tiempo en Ruta (aprox.): {Math.round((rutaProgress.playTimeMs || 0) / 60000)} min · Lecciones completadas: {rutaProgress.lessonsCompleted || 0}</p>
                          <div className="mb-4 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-r from-slate-900/80 via-fuchsia-950/45 to-slate-900/80 p-3 md:p-4 flex flex-wrap items-center gap-3">
                              <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 overflow-hidden bg-gradient-to-br from-amber-200 via-rose-200 to-violet-200 ${rutaListening || isListening ? 'animate-pulse' : ''}`}>
                                  <div className="absolute inset-x-0 bottom-0 h-4 bg-rose-300/70" />
                                  <div className="absolute left-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className="absolute right-3 top-5 w-2 h-2 rounded-full bg-slate-700" />
                                  <div className={`absolute left-1/2 -translate-x-1/2 bottom-2 rounded-full bg-slate-700 ${rutaListening || isListening ? 'w-4 h-2' : 'w-3 h-1'}`} />
                              </div>
                              <div className="min-w-[220px]">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-fuchsia-300">Tutor Ruta</p>
                                  <p className="text-sm font-bold text-white">Entrenador guiado desde cero (A0 → C1)</p>
                                  <p className="text-[11px] text-gray-400">Banco de verbos detectado: <strong className="text-fuchsia-300">{(rutaVerbDb.verbs || []).length}</strong> entradas.</p>
                              </div>
                          </div>
                          {!rutaRun ? (
                              <>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                      {[
                                          { id: 'camino', label: 'Camino' },
                                          { id: 'gramatica', label: 'Gramática' },
                                          { id: 'test', label: 'Test nivel' },
                                      ].map((t) => (
                                          <button key={t.id} type="button" onClick={() => setRutaSubTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${rutaSubTab === t.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                      ))}
                                  </div>
                                  {rutaSubTab === 'camino' && (
                                      <div className="space-y-6">
                                          <div className="rounded-2xl border border-fuchsia-500/25 bg-slate-900/45 p-3 md:p-4">
                                              <p className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-300 mb-2">Sección temática</p>
                                              <div className="flex flex-wrap gap-2">
                                                  {[
                                                      { id: 'all', label: 'Todo' },
                                                      { id: 'presentacion', label: 'Presentación' },
                                                      { id: 'familia', label: 'Familia' },
                                                      { id: 'trabajo', label: 'Trabajo' },
                                                      { id: 'alimentos', label: 'Alimentos' },
                                                      { id: 'vivienda', label: 'Vivienda' },
                                                      { id: 'viajes', label: 'Viajes' },
                                                      { id: 'salud', label: 'Salud' },
                                                      { id: 'tiempo_libre', label: 'Tiempo libre' },
                                                      { id: 'conectores', label: 'Conectores' },
                                                      { id: 'gramatica', label: 'Gramática' }
                                                  ].map((t) => (
                                                      <button key={t.id} type="button" onClick={() => setRutaTopicFilter(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${rutaTopicFilter === t.id ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}>{t.label}</button>
                                                  ))}
                                              </div>
                                          </div>
                                          {(rutaLevels || []).map((lv, levelIdx) => (
                                              <div key={lv.id} className="rounded-2xl border border-fuchsia-500/25 bg-slate-900/50 p-4 md:p-5">
                                                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                                                      <h3 className="text-lg font-black text-white">{lv.title}</h3>
                                                      <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">{lv.badge}</span>
                                                  </div>
                                                  <div className="flex flex-col gap-2">
                                                      {lv.lessons
                                                          .map((lesson, origIdx) => ({ lesson, origIdx }))
                                                          .filter(({ lesson }) => rutaTopicFilter === 'all' || (lesson.topic || '') === rutaTopicFilter)
                                                          .map(({ lesson, origIdx }) => {
                                                          const unlocked = typeof window.mullerRutaIsLessonUnlocked === 'function' && window.mullerRutaIsLessonUnlocked(rutaLevels || [], levelIdx, origIdx, rutaProgress.completed || {});
                                                          const done = !!(rutaProgress.completed && rutaProgress.completed[lesson.id]);
                                                          return (
                                                              <button key={lesson.id} type="button" disabled={!unlocked} onClick={() => { if (!unlocked) return; setRutaRun({ levelIdx, lessonIdx: origIdx, step: 0 }); setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr(''); }} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition ${!unlocked ? 'opacity-40 cursor-not-allowed border-white/5' : done ? 'border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40' : 'border-white/15 bg-black/30 hover:bg-fuchsia-950/40'}`}>
                                                                  <span className="font-bold text-white">{lesson.title}</span>
                                                                  <span className="text-[10px] uppercase tracking-wider text-cyan-300/90">{String(lesson.topic || 'general').replace('_', ' ')}</span>
                                                                  <span className="text-xs font-bold text-amber-300">+{lesson.rewardCoins} · {lesson.rewardXp} XP</span>
                                                                  {done ? <span className="text-xs text-emerald-400">Hecho</span> : unlocked ? <span className="text-xs text-fuchsia-300">Empezar</span> : <span className="text-xs text-gray-500">Bloqueado</span>}
                                                              </button>
                                                          );
                                                      })}
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                                  {rutaSubTab === 'gramatica' && (
                                      <div className="space-y-4">
                                          <div className="flex justify-end"><ExerciseHelpBtn helpId="ruta_gramatica" /></div>
                                          {(window.MULLER_GRAMMAR_REF || []).map((sec) => (
                                              <div key={sec.level} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-5">
                                                  <h3 className="text-fuchsia-300 font-black text-lg mb-1">{sec.level} — {sec.title}</h3>
                                                  <div className="space-y-3 mt-3">
                                                      {sec.blocks.map((b, bi) => (
                                                          <div key={bi} className="rounded-xl border border-white/5 bg-black/25 p-3">
                                                              <p className="text-white font-bold text-sm">{b.t}</p>
                                                              <p className="text-gray-400 text-sm mt-1 leading-relaxed">{b.b}</p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          ))}
                                          <p className="text-xs text-gray-500">Ampliaremos con más temas y ejemplos conforme añadas contenido al camino.</p>
                                      </div>
                                  )}
  {rutaSubTab === 'test' && (
  <div className="rounded-2xl border border-sky-500/30 bg-sky-950/30 p-5 md:p-6 space-y-4">
    {!placementQuestions.length ? (
      <>
        <p className="text-white font-bold text-lg">Test de nivel adaptativo</p>
        <p className="text-gray-300 text-sm">
          Responde unas preguntas para evaluar tu nivel de alemán. El test se adapta a tus respuestas.
        </p>
        <p className="text-xs text-gray-500">
          El test completo consta de aproximadamente 30 preguntas repartidas en niveles A1, A2, B1 y B2.
        </p>
        <button
          type="button"
          onClick={startPlacementTest}
          className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 font-black py-3 text-white shadow-lg mt-4"
        >
          Comenzar test
        </button>
      </>
    ) : (
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-sky-300">Nivel actual: {placementLevel}</span>
          <span className="text-xs text-gray-400">
            Pregunta {placementIndex + 1} de {placementQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all"
            style={{ width: `${((placementIndex + 1) / placementQuestions.length) * 100}%` }}
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-white font-semibold text-lg mb-4">
            {placementQuestions[placementIndex]?.q}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {placementQuestions[placementIndex]?.opts.map((opt, oi) => (
              <button
                key={oi}
                type="button"
                onClick={() => handlePlacementAnswer(oi)}
                className="text-left px-4 py-3 rounded-lg bg-slate-800 hover:bg-sky-900 text-white border border-white/10 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Responde con sinceridad. El test se adapta para encontrar tu nivel real.
        </p>
      </>
    )}
  </div>
)}
                              </>
                          ) : (() => {
                              const L = rutaLevels || [];
                              const lv = L[rutaRun.levelIdx];
                              const lesson = lv && lv.lessons[rutaRun.lessonIdx];
                              if (!lesson) return null;
                              const st = rutaRun.step || 0;
                              return (
                                  <div className="rounded-2xl border border-fuchsia-500/30 bg-black/40 p-5 md:p-8">
                                      <button type="button" onClick={() => { setRutaRun(null); setRutaFillInput(''); setRutaTranscript(''); setRutaSpeakErr(''); }} className="text-sm font-bold text-fuchsia-300 mb-4 hover:text-white">← Volver al camino</button>
                                      <h2 className="text-2xl font-black text-white mb-1">{lesson.title}</h2>
                                      <p className="text-xs text-fuchsia-400/90 mb-6">{lv.badge} · {lv.title}</p>
                                      {st === 0 && (
                                          <>
                                              <p className="text-sm text-violet-200/90 mb-4 rounded-xl bg-violet-950/50 border border-violet-500/25 p-4 leading-relaxed">{lesson.grammarTip}</p>
                                              {lesson.phrases.map((p, i) => (
                                                  <div key={i} className="mb-4 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                                                      <p className="text-lg font-bold text-white">{p.de}</p>
                                                      <p className="text-sm text-gray-400">{p.es}</p>
                                                      <button type="button" onClick={() => speakRutaDe(p.de)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-fuchsia-300 hover:text-white"><Icon name="volume-2" className="w-4 h-4" /> Escuchar</button>
                                                  </div>
                                              ))}
                                              <button type="button" onClick={() => { setRutaRun({ ...rutaRun, step: 1 }); setRutaFillInput(''); setRutaSpeakErr(''); window.__mullerPlaySfx && window.__mullerPlaySfx('tick'); }} className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-black py-3 text-white shadow-lg">Siguiente: huecos</button>
                                          </>
                                      )}
                                      {st === 1 && lesson.fill && (
                                          <>
                                              <p className="text-white font-bold mb-3">{lesson.fill.prompt}</p>
                                              {lesson.fill.hint ? <p className="text-xs text-gray-500 mb-2">Pista: {lesson.fill.hint}</p> : null}
                                              <input value={rutaFillInput} onChange={(e) => setRutaFillInput(e.target.value)} onKeyDown={(e) => handleExerciseEnterSubmit(e, 'ruta-fill-submit', () => { if (checkRutaFillAnswer(lesson)) { setRutaRun({ ...rutaRun, step: 2 }); setRutaTranscript(''); setRutaSpeakErr(''); } })} className="w-full rounded-xl bg-black/50 border border-fuchsia-500/40 px-4 py-3 text-white text-lg mb-3 outline-none focus:border-fuchsia-400" placeholder="Tu respuesta" autoComplete="off" />
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                              <button type="button" onClick={() => runSingleSubmitAction('ruta-fill-submit', () => { if (checkRutaFillAnswer(lesson)) { setRutaRun({ ...rutaRun, step: 2 }); setRutaTranscript(''); setRutaSpeakErr(''); } })} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 font-black py-3 text-white">Comprobar y continuar</button>
                                          </>
                                      )}
                                      {st === 2 && lesson.speak && (
                                          <>
                                              <p className="text-gray-300 mb-2">Lee en voz alta en alemán:</p>
                                              <p className="text-xl font-bold text-white mb-4 leading-snug">{lesson.speak.target}</p>
                                              <div className="flex flex-wrap gap-2 mb-4">
                                                  <button type="button" onClick={() => speakRutaDe(lesson.speak.target)} className="rounded-xl bg-slate-800 border border-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">Escuchar modelo</button>
                                                  <button type="button" disabled={rutaListening} onClick={startRutaListen} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50">{rutaListening ? 'Escuchando…' : 'Grabar'}</button>
                                              </div>
                                              {rutaTranscript ? <p className="text-sm text-emerald-200/90 mb-2">Detectado: {rutaTranscript}</p> : null}
                                              {rutaSpeakErr ? <p className="text-amber-200 text-sm mb-2">{rutaSpeakErr}</p> : null}
                                              <button
                                                  type="button"
                                                  onClick={() => runSingleSubmitAction('ruta-speak-validate', () => {
                                                      if (checkRutaSpeakAnswer(lesson.speak.target)) completeRutaLesson(rutaRun.levelIdx, rutaRun.lessonIdx);
                                                  })}
                                                  className="w-full rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-black py-3 text-white shadow-lg"
                                              >
                                                  Validar y completar lección
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={() => runSingleSubmitAction('ruta-speak-skip', () => {
                                                      setRutaSpeakErr('');
                                                      completeRutaLesson(rutaRun.levelIdx, rutaRun.lessonIdx);
                                                  })}
                                                  className="w-full mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold py-2.5 text-gray-200 border border-white/15"
                                              >
                                                  Continuar sin grabar voz
                                              </button>
                                              <p className="text-[11px] text-gray-500 mt-2">Si hoy no puedes usar micrófono, puedes avanzar igualmente y practicar voz después.</p>
                                          </>
                                      )}
                                  </div>
                              );
                          })()}
                      </div>
                  )}

                  {activeTab === 'inicio' && !practiceActive && (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 md:mb-8">
                              <h1 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 mb-2"><Icon name="layout-dashboard" className="w-10 h-10 md:w-14 md:h-14 text-indigo-400" /> Inicio</h1>
                              <p className="text-gray-400 text-sm md:text-base max-w-2xl">Elige qué practicar. Tecla <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-xs">I</kbd> para volver aquí.</p>
                          </div>
                          <div className="mb-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/35 p-4">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                  <p className="text-cyan-200 font-black text-sm flex items-center gap-2"><Icon name="stethoscope" className="w-4 h-4" /> Diagnóstico rápido</p>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${healthSnapshot.ok ? 'bg-emerald-800/60 text-emerald-200 border border-emerald-500/40' : 'bg-amber-900/60 text-amber-200 border border-amber-500/40'}`}>{healthSnapshot.ok ? 'Estado: OK' : 'Revisar'}</span>
                              </div>
                              <div className="mb-2 flex items-center gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setShowSelfCheckPanel((v) => !v)}
                                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-cyan-400/45 bg-cyan-900/30 text-cyan-100 hover:bg-cyan-800/40"
                                  >
                                      {showSelfCheckPanel ? 'Ocultar autochequeo' : 'Autochequeo guiado'}
                                  </button>
                                  <span className="text-[10px] text-cyan-200/80">Comprueba rápido que todo lo crítico está OK.</span>
                              </div>
                              {showSelfCheckPanel && (
                                  <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                                      {getSelfCheckItems().map((it) => (
                                          <div key={it.id} className={`rounded-lg border px-2.5 py-1.5 ${it.ok ? 'border-emerald-500/35 bg-emerald-950/25 text-emerald-200' : 'border-amber-500/35 bg-amber-950/30 text-amber-100'}`}>
                                              <span className="font-bold">{it.ok ? '✓' : '⚠'} {it.label}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Micrófono</p>
                                      <p className={`font-bold ${healthSnapshot.micOk ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.micLabel}</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Voces TTS</p>
                                      <p className={`font-bold ${healthSnapshot.voiceCount > 0 ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.voiceCount > 0 ? `${healthSnapshot.voiceCount} disponibles` : 'Sin voces cargadas'}</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Guiones</p>
                                      <p className={`font-bold ${(healthSnapshot.savedScriptsCount > 0 || healthSnapshot.storyScenesCount > 0) ? 'text-emerald-300' : 'text-amber-300'}`}>{healthSnapshot.savedScriptsCount} guardados · {healthSnapshot.storyScenesCount} escenas</p>
                                  </div>
                                  <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
                                      <p className="text-gray-400">Estado sesión</p>
                                      <p className={`font-bold ${healthSnapshot.listeningBusy ? 'text-fuchsia-300' : 'text-emerald-300'}`}>{healthSnapshot.listeningBusy ? 'Mic activo' : 'En reposo'}</p>
                                  </div>
                              </div>
                          </div>
                          {vocabSrsDueCount > 0 ? (
                              <button type="button" onClick={() => { setActiveTab('vocabulario'); setVocabDueFilterOnly(true); stopAudio(); setPracticeActive(null); }} className="w-full mb-4 text-left rounded-2xl border border-amber-500/40 bg-amber-950/50 p-4 hover:bg-amber-900/55 transition shadow-[0_0_24px_rgba(245,158,11,0.12)]">
                                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2"><Icon name="bell-ring" className="w-4 h-4" /> Pendientes de repaso (SRS)</p>
                                  <p className="text-white font-black text-2xl mt-1">{vocabSrsDueCount} tarjetas</p>
                                  <p className="text-[11px] text-gray-400 mt-1">Ir a Vocab con filtro de vencidas / prioridad</p>
                              </button>
                          ) : null}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              {[
                                  { id: 'ruta', label: 'Ruta A0→C1', sub: 'Desde cero, gramática, test', icon: 'map', go: () => { setActiveTab('ruta'); } },
                                  { id: 'historia', label: 'Historia', sub: 'Guion, audio, modos', icon: 'play', go: () => { setActiveTab('historia'); setMode('dialogue'); } },
                                  { id: 'vocab', label: 'Vocabulario', sub: 'SRS y tarjetas', icon: 'book-open', go: () => setActiveTab('vocabulario') },
                                  { id: 'shadow', label: 'Shadowing', sub: 'Pronunciación', icon: 'audio-lines', go: () => setActiveTab('shadowing') },
                                  { id: 'escritura', label: 'Escritura', sub: 'OCR y dictado', icon: 'pen-line', go: () => setActiveTab('escritura') },
                                  { id: 'b1', label: 'Banco B1', sub: 'Frases modelo', icon: 'target', go: () => { setActiveTab('bxbank'); setBxBankLevel('b1'); setBxCategory('mix'); } },
                                  { id: 'b2', label: 'Banco B2', sub: 'Registro alto', icon: 'layers', go: () => { setActiveTab('bxbank'); setBxBankLevel('b2'); setBxCategory('mix'); } },
                                  { id: 'progreso', label: 'Progreso', sub: 'Plan del día y estadísticas', icon: 'bar-chart', go: () => setActiveTab('progreso') },
                                  { id: 'bib', label: 'Biblioteca', sub: 'Guiones y listas', icon: 'file-text', go: () => setActiveTab('guiones') },
                                  { id: 'lex', label: 'Lexikon', sub: 'Diccionario y traductor', icon: 'library', go: () => setActiveTab('lexikon') },
                                  { id: 'hpro', label: 'Historias Pro', sub: 'ES/DE/OCR + estilo', icon: 'feather', go: () => setActiveTab('historiaspro') },
                                  { id: 'com', label: 'Comunidad', sub: 'Cuenta, directorio, liga', icon: 'trophy', go: () => setActiveTab('comunidad') },
                              ].map((c) => (
                                  <button key={c.id} type="button" onClick={() => { stopAudio(); setPracticeActive(null); c.go(); }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/85 hover:bg-slate-800/95 p-4 text-left transition shadow-lg ring-1 ring-white/[0.04]">
                                      <span className="rounded-xl bg-black/45 p-2.5 border border-white/10 shrink-0"><Icon name={c.icon} className="w-6 h-6 text-indigo-300" /></span>
                                      <span className="min-w-0">
                                          <span className="block font-black text-white text-lg leading-tight">{c.label}</span>
                                          <span className="text-xs text-gray-500">{c.sub}</span>
                                      </span>
                                  </button>
                              ))}
                          </div>
                          <div className="mt-8 flex flex-wrap gap-3">
                              <button type="button" onClick={() => { setShowMullerHub(true); setMullerHubTab('voices'); }} className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 font-bold text-sm border border-sky-500/40 shadow-lg">Centro Müller (voces · temas · IA Chrome)</button>
                              <button type="button" onClick={() => setTourStep(1)} className="px-4 py-2.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 font-bold text-sm border border-indigo-500/40 shadow-lg">Tour guiado (5 pasos)</button>
                          </div>
                      </div>
                  )}

                  {activeTab === 'comunidad' && !practiceActive && (
                      <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
                          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                              <div>
                                  <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 mb-2"><Icon name="trophy" className="w-9 h-9 md:w-12 md:h-12 text-violet-400" /> Comunidad</h1>
                                  <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                                      {mullerSupabaseConfigured()
                                          ? 'Modo Supabase activo: directorio y liga global (plan gratuito). Si no hay URL/key, todo sigue en local.'
                                          : 'Cuenta local o Supabase (gratis): configura URL y clave anon en index.html y el SQL del proyecto. Liga semanal con bots simulados.'}
                                  </p>
                              </div>
                              <ExerciseHelpBtn helpId="nav_comunidad" />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                              {[
                                  { id: 'economia', label: 'Economía' },
                                  { id: 'directorio', label: 'Directorio' },
                                  { id: 'ligas', label: 'Liga / ranking' },
                              ].map((t) => (
                                  <button
                                      key={t.id}
                                      type="button"
                                      onClick={() => setCommunitySubTab(t.id)}
                                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${communitySubTab === t.id ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_16px_rgba(124,58,237,0.35)]' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'}`}
                                  >
                                      {t.label}
                                  </button>
                              ))}
                          </div>
                          <p className="text-[11px] text-gray-500 mb-4">Cuenta y ajustes se gestionan ahora desde el menú de usuario (arriba derecha) o el botón flotante de ajustes.</p>

                          {communitySubTab === 'cuenta' && (
                              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:p-6 shadow-xl">
                                  {unifiedAuth ? (
                                      <div className="space-y-4">
                                          <p className="text-white font-bold text-lg flex items-center gap-2"><Icon name="check-circle" className="w-5 h-5 text-emerald-400" /> Sesión iniciada</p>
                                          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-400">{unifiedAuth.source === 'supabase' ? 'Cuenta Supabase (nube · gratis)' : 'Cuenta solo en este navegador'}</p>
                                          {isCreatorAccount ? <p className="text-[11px] font-black uppercase tracking-wider text-amber-400">Modo Creador: monedas ilimitadas</p> : null}
                                          <p className="text-sm text-gray-400"><span className="text-gray-300 font-semibold">Nombre:</span> {unifiedAuth.displayName}</p>
                                          <p className="text-sm text-gray-400"><span className="text-gray-300 font-semibold">Email:</span> {mullerMaskEmail(unifiedAuth.email)}</p>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3 space-y-2">
                                              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Cambiar nombre visible</label>
                                              <div className="flex flex-col sm:flex-row gap-2">
                                                  <input
                                                      type="text"
                                                      value={profileNameDraft}
                                                      onChange={(e) => setProfileNameDraft(e.target.value)}
                                                      className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-violet-500"
                                                      placeholder="Ej: SuperKlaus"
                                                  />
                                                  <button
                                                      type="button"
                                                      disabled={profileNameBusy}
                                                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-bold text-sm"
                                                      onClick={async () => {
                                                          const nextName = String(profileNameDraft || '').trim();
                                                          if (!nextName) { setProfileNameMsg('Escribe un nombre válido.'); return; }
                                                          setProfileNameBusy(true);
                                                          setProfileNameMsg('');
                                                          try {
                                                              if (unifiedAuth.source === 'supabase') {
                                                                  const client = mullerGetSupabaseClient();
                                                                  if (!client || !supabaseUser) throw new Error('Supabase no disponible');
                                                                  const { error: e1 } = await client.auth.updateUser({ data: { display_name: nextName } });
                                                                  if (e1) throw new Error(e1.message);
                                                                  const { error: e2 } = await client.from('profiles').upsert({
                                                                      id: supabaseUser.id,
                                                                      display_name: nextName,
                                                                      updated_at: new Date().toISOString(),
                                                                  }, { onConflict: 'id' });
                                                                  if (e2) throw new Error(e2.message);
                                                                  setSupabaseProfile((p) => ({ ...(p || {}), id: supabaseUser.id, display_name: nextName, updated_at: new Date().toISOString() }));
                                                              } else {
                                                                  const map = mullerAccountsLoad();
                                                                  const em = unifiedAuth.email;
                                                                  if (map[em]) {
                                                                      map[em].displayName = nextName;
                                                                      mullerAccountsSave(map);
                                                                  }
                                                              }
                                                              saveProgress({ username: nextName });
                                                              setAuthTick((x) => x + 1);
                                                              setProfileNameMsg('Nombre actualizado.');
                                                          } catch (err) {
                                                              setProfileNameMsg('No se pudo actualizar: ' + (err && err.message ? err.message : 'error'));
                                                          } finally {
                                                              setProfileNameBusy(false);
                                                          }
                                                      }}
                                                  >
                                                      {profileNameBusy ? 'Guardando…' : 'Guardar nombre'}
                                                  </button>
                                              </div>
                                              {profileNameMsg ? <p className="text-xs text-gray-400">{profileNameMsg}</p> : null}
                                          </div>
                                          <button
                                              type="button"
                                              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm border border-white/10"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (unifiedAuth.source === 'supabase' && client) {
                                                      try { await client.auth.signOut(); } catch (err) {}
                                                      setSupabaseUser(null);
                                                      setSupabaseProfile(null);
                                                  }
                                                  mullerAuthLogout();
                                                  setAuthTick((x) => x + 1);
                                                  setAuthPassword('');
                                              }}
                                          >
                                              Cerrar sesión
                                          </button>
                                      </div>
                                  ) : (
                                      <div className="space-y-4">
                                          <div className="flex gap-2">
                                              <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'login' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Entrar</button>
                                              <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${authMode === 'register' ? 'bg-violet-600 text-white' : 'bg-black/40 text-gray-500'}`}>Registro gratis</button>
                                          </div>
                                          {authError ? <p className="text-sm text-red-400 font-semibold">{authError}</p> : null}
                                          <label className="block text-xs font-bold text-gray-500 uppercase">Email</label>
                                          <input type="email" autoComplete="email" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                                          <label className="block text-xs font-bold text-gray-500 uppercase">Contraseña (mín. 6)</label>
                                          <input type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                                          {authMode === 'register' ? (
                                              <>
                                                  <label className="block text-xs font-bold text-gray-500 uppercase">Nombre visible</label>
                                                  <input type="text" className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-violet-500" value={authDisplayName} onChange={(e) => setAuthDisplayName(e.target.value)} placeholder="Ej: SuperKlaus" />
                                              </>
                                          ) : null}
                                          <button
                                              type="button"
                                              disabled={authBusy}
                                              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-black text-white"
                                              onClick={async () => {
                                                  setAuthBusy(true);
                                                  setAuthError('');
                                                  const errMap = {
                                                      CRYPTO_UNAVAILABLE: 'Necesitas https o localhost para registrar con cifrado seguro.',
                                                      EMAIL_INVALID: 'Introduce un email válido.',
                                                      PASS_SHORT: 'La contraseña debe tener al menos 6 caracteres.',
                                                      EMAIL_TAKEN: 'Ese email ya está registrado en este dispositivo.',
                                                      BAD_CREDENTIALS: 'Email o contraseña incorrectos.',
                                                  };
                                                  try {
                                                      const client = mullerGetSupabaseClient();
                                                      if (client) {
                                                          const em = authEmail.trim();
                                                          if (authMode === 'register') {
                                                              const dn = (authDisplayName || userStats.username || 'Estudiante').trim();
                                                              const { data, error } = await client.auth.signUp({
                                                                  email: em,
                                                                  password: authPassword,
                                                                  options: { data: { display_name: dn } },
                                                              });
                                                              if (error) throw new Error(error.message);
                                                              saveProgress({ username: dn });
                                                              if (data.session && data.session.user) {
                                                                  setSupabaseUser(data.session.user);
                                                                  try {
                                                                      await client.from('profiles').upsert({
                                                                          id: data.session.user.id,
                                                                          display_name: dn,
                                                                          updated_at: new Date().toISOString(),
                                                                      }, { onConflict: 'id' });
                                                                  } catch (pe) {}
                                                              } else if (data.user) {
                                                                  setSupabaseUser(data.user);
                                                              }
                                                              if (!data.session) {
                                                                  alert('Si Supabase pide confirmar el email, revisa tu bandeja. En Authentication → Providers → Email puedes desactivar “Confirm email” para pruebas. El perfil se crea al confirmar.');
                                                              }
                                                          } else {
                                                              const { data, error } = await client.auth.signInWithPassword({ email: em, password: authPassword });
                                                              if (error) throw new Error(error.message);
                                                              if (data.user) {
                                                                  setSupabaseUser(data.user);
                                                                  const meta = data.user.user_metadata && data.user.user_metadata.display_name;
                                                                  if (meta) saveProgress({ username: String(meta) });
                                                              }
                                                          }
                                                      } else if (authMode === 'register') {
                                                          const acc = await mullerAuthRegister(authEmail, authPassword, authDisplayName || userStats.username);
                                                          saveProgress({ username: acc.displayName });
                                                      } else {
                                                          const acc = await mullerAuthLogin(authEmail, authPassword);
                                                          saveProgress({ username: acc.displayName });
                                                      }
                                                      setAuthPassword('');
                                                      setAuthTick((x) => x + 1);
                                                  } catch (err) {
                                                      setAuthError(errMap[err.message] || err.message || 'Error');
                                                  } finally {
                                                      setAuthBusy(false);
                                                  }
                                              }}
                                          >
                                              {authBusy ? '…' : authMode === 'register' ? 'Crear cuenta' : 'Entrar'}
                                          </button>
                                          <p className="text-[11px] text-gray-500 leading-relaxed">
                                              {mullerGetSupabaseClient()
                                                  ? 'Con Supabase la contraseña va por Auth seguro de Supabase (gratis). Sin URL/key en index.html se usa cuenta local con PBKDF2 en el dispositivo.'
                                                  : 'Sin Supabase configurado: la contraseña se procesa con PBKDF2 solo en tu dispositivo; no hay servidor.'}
                                          </p>
                                      </div>
                                  )}
                              </div>
                          )}

                          {communitySubTab === 'economia' && (
                              <div className="space-y-6">
                                  <div className="rounded-2xl border border-amber-500/25 bg-slate-900/80 p-5">
                                      <h2 className="text-lg font-black text-white mb-2 flex items-center gap-2"><Icon name="coins" className="w-5 h-5 text-amber-400" /> Economía de monedas</h2>
                                      <p className="text-xs text-gray-500 mb-3">
                                          {mullerGetSupabaseClient()
                                              ? 'Modo seguro: bonus/gastos pasan por RPC en Supabase con límites diarios y cooldown. Evita monedas infinitas por trucos del cliente.'
                                              : 'Sin Supabase: modo local de pruebas. Para anti-trampas real usa Supabase activo.'}
                                      </p>
                                      <p className="text-sm text-gray-300">
                                          <span className="font-bold text-white">Saldo actual:</span> {isCreatorAccount ? '∞ (Creador)' : (walletCoins != null ? walletCoins : userStats.coins)}
                                      </p>
                                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Bonus diario:</span> <span className="font-bold text-white">{rewardStatus ? (rewardStatus.daily_bonus_claimed ? 'Reclamado' : 'Disponible') : '—'}</span>
                                          </div>
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Anuncios hoy:</span> <span className="font-bold text-white">{rewardStatus ? rewardStatus.ad_claims_today : '—'}</span>
                                          </div>
                                          <div className="rounded-lg border border-white/10 bg-black/25 px-2 py-1.5">
                                              <span className="text-gray-500">Restantes:</span> <span className="font-bold text-white">{rewardStatus ? rewardStatus.ad_remaining_today : '—'}</span>
                                          </div>
                                      </div>
                                      {rewardStatus && Number(rewardStatus.ad_cooldown_seconds || 0) > 0 ? (
                                          <p className="text-[11px] text-indigo-300 mt-2">Cooldown anuncio: {Math.ceil(Number(rewardStatus.ad_cooldown_seconds || 0) / 60)} min</p>
                                      ) : null}
                                      {walletLoading ? <p className="text-xs text-gray-500 mt-1">Sincronizando wallet…</p> : null}
                                      {economyMsg ? <p className="text-xs text-gray-400 mt-2">{economyMsg}</p> : null}
                                  </div>

                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                                      <h3 className="text-base font-black text-white mb-3">Formas de conseguir monedas</h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-emerald-500/35 bg-emerald-900/25 hover:bg-emerald-900/40 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client) { setEconomyMsg('Activa Supabase para bonus seguro.'); return; }
                                                  const { data, error } = await client.rpc('muller_claim_reward', { p_reward_type: 'daily_bonus' });
                                                  if (error || !Array.isArray(data) || !data[0]) { setEconomyMsg('Error reclamando bonus diario.'); return; }
                                                  const row = data[0];
                                                  setWalletCoins(Number(row.balance || 0));
                                                  if (Number(row.granted || 0) > 0) setEconomyMsg('Bonus diario reclamado: +' + row.granted + ' monedas.');
                                                  else setEconomyMsg(economyReasonText(row.reason));
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-emerald-300">Bonus diario (+40)</p>
                                              <p className="text-xs text-gray-400 mt-1">1 vez al día por usuario.</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-sky-500/35 bg-sky-900/20 hover:bg-sky-900/35 p-3"
                                              onClick={() => {
                                                  const u = String(window.MULLER_REWARDED_AD_URL || '').trim();
                                                  if (!u) { setEconomyMsg('Configura window.MULLER_REWARDED_AD_URL con tu enlace de anuncio/landing monetizada.'); return; }
                                                  window.open(u, '_blank', 'noopener,noreferrer');
                                                  setAdOpenedAt(Date.now());
                                                  setEconomyMsg('Anuncio abierto. Luego pulsa "Cobrar anuncio".');
                                              }}
                                          >
                                              <p className="text-sm font-black text-sky-300">Ver anuncio recompensado</p>
                                              <p className="text-xs text-gray-400 mt-1">Abre tu enlace monetizado en nueva pestaña.</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-indigo-500/35 bg-indigo-900/20 hover:bg-indigo-900/35 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client) { setEconomyMsg('Activa Supabase para cobro seguro de anuncios.'); return; }
                                                  if (!adOpenedAt || (Date.now() - adOpenedAt > 2 * 60 * 60 * 1000)) {
                                                      setEconomyMsg('Primero abre un anuncio recompensado y cobra dentro de 2 horas.');
                                                      return;
                                                  }
                                                  const { data, error } = await client.rpc('muller_claim_reward', { p_reward_type: 'ad_reward' });
                                                  if (error || !Array.isArray(data) || !data[0]) { setEconomyMsg('Error cobrando anuncio.'); return; }
                                                  const row = data[0];
                                                  setWalletCoins(Number(row.balance || 0));
                                                  if (Number(row.granted || 0) > 0) setEconomyMsg('Cobrado anuncio: +' + row.granted + ' monedas.');
                                                  else setEconomyMsg(economyReasonText(row.reason));
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-indigo-300">Cobrar anuncio (+18)</p>
                                              <p className="text-xs text-gray-400 mt-1">Máx 6/día y cooldown de 15 min (backend).</p>
                                          </button>
                                          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                                              <p className="text-sm font-black text-white">Gana jugando</p>
                                              <p className="text-xs text-gray-400 mt-1">Racha diaria, sesiones completas y práctica oral ya suman. Próximo paso: migrar TODAS las recompensas a RPC para blindaje total.</p>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="rounded-2xl border border-fuchsia-500/30 bg-slate-900/80 p-5">
                                      <h3 className="text-base font-black text-white mb-2 flex items-center gap-2"><Icon name="gem" className="w-5 h-5 text-fuchsia-400" /> Premium mensual</h3>
                                      <p className="text-xs text-gray-500 mb-3">Monetización simple: botón de pago externo + estado premium en Supabase. Para activación automática real necesitarás webhook (paso siguiente).</p>
                                      <p className="text-sm text-gray-300 mb-3">
                                          Estado: <span className="font-bold text-white">
                                              {premiumStatus ? (premiumStatus.is_active ? 'Activo' : 'Inactivo') : '—'}
                                          </span>
                                          {premiumStatus && premiumStatus.expires_at ? <span className="text-xs text-gray-500 ml-2">hasta {String(premiumStatus.expires_at).slice(0, 10)}</span> : null}
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-fuchsia-500/35 bg-fuchsia-900/20 hover:bg-fuchsia-900/35 p-3"
                                              onClick={() => {
                                                  const u = String(window.MULLER_PREMIUM_CHECKOUT_URL || '').trim();
                                                  if (!u) { setEconomyMsg('Configura window.MULLER_PREMIUM_CHECKOUT_URL con tu checkout mensual.'); return; }
                                                  window.open(u, '_blank', 'noopener,noreferrer');
                                                  setEconomyMsg('Checkout premium abierto.');
                                              }}
                                          >
                                              <p className="text-sm font-black text-fuchsia-300">Suscribirme mensual</p>
                                              <p className="text-xs text-gray-400 mt-1">Abre tu página de cobro (Stripe/PayPal/etc).</p>
                                          </button>
                                          <button
                                              type="button"
                                              className="text-left rounded-xl border border-violet-500/35 bg-violet-900/20 hover:bg-violet-900/35 p-3"
                                              onClick={async () => {
                                                  const client = mullerGetSupabaseClient();
                                                  if (!client || !supabaseUser) { setEconomyMsg('Necesitas sesión Supabase.'); return; }
                                                  const until = new Date(Date.now() + 30 * 86400000).toISOString();
                                                  const { error } = await client.from('muller_premium_subscriptions').upsert({
                                                      user_id: supabaseUser.id,
                                                      plan: 'monthly',
                                                      status: 'active',
                                                      started_at: new Date().toISOString(),
                                                      expires_at: until,
                                                      updated_at: new Date().toISOString(),
                                                  }, { onConflict: 'user_id' });
                                                  if (error) { setEconomyMsg('No se pudo activar premium: ' + error.message); return; }
                                                  setEconomyMsg('Premium activado 30 días (modo manual de pruebas).');
                                                  setAuthTick((x) => x + 1);
                                              }}
                                          >
                                              <p className="text-sm font-black text-violet-300">Ya pagué (activar 30d)</p>
                                              <p className="text-xs text-gray-400 mt-1">Botón temporal para test hasta conectar webhook.</p>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {communitySubTab === 'directorio' && (
                              <div className="space-y-6">
                                  {mullerSupabaseConfigured() ? (
                                      <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/80 p-5 overflow-x-auto">
                                          <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="globe" className="w-5 h-5 text-emerald-400" /> Directorio global (Supabase)</h2>
                                          {remoteProfiles === null ? (
                                              <div className="space-y-2 py-2">
                                                  <div className="muller-skeleton h-4 w-40 rounded" />
                                                  <div className="muller-skeleton h-4 w-full rounded" />
                                                  <div className="muller-skeleton h-4 w-5/6 rounded" />
                                              </div>
                                          ) : remoteProfiles.length === 0 ? (
                                              <p className="text-sm text-gray-500">Aún no hay filas en <code className="text-emerald-400/90">profiles</code>. Ejecuta el SQL del proyecto y registra un usuario.</p>
                                          ) : (
                                              <table className="w-full text-sm text-left">
                                                  <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2">Actualizado</th></tr></thead>
                                                  <tbody>
                                                      {remoteProfiles.map((row) => (
                                                          <tr key={row.id} className="border-b border-white/5 text-gray-300">
                                                              <td className="py-2 pr-2 font-bold text-white">{row.display_name || '—'}</td>
                                                              <td className="py-2 text-xs text-gray-500">{row.updated_at ? String(row.updated_at).slice(0, 10) : '—'}</td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          )}
                                      </div>
                                  ) : null}
                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 overflow-x-auto">
                                      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="users" className="w-5 h-5 text-violet-400" /> Cuentas en este navegador (sin Supabase)</h2>
                                      {directoryLocals.length === 0 ? (
                                          <p className="text-sm text-gray-500">Aún no hay registros. Crea una cuenta en la pestaña «Cuenta».</p>
                                      ) : (
                                          <table className="w-full text-sm text-left">
                                              <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2 pr-2">Email</th><th className="py-2">Alta</th></tr></thead>
                                              <tbody>
                                                  {directoryLocals.map((row) => (
                                                      <tr key={row.email} className="border-b border-white/5 text-gray-300">
                                                          <td className="py-2 pr-2 font-bold text-white">{row.displayName}</td>
                                                          <td className="py-2 pr-2">{mullerMaskEmail(row.email)}</td>
                                                          <td className="py-2 text-xs text-gray-500">{row.createdAt ? String(row.createdAt).slice(0, 10) : '—'}</td>
                                                      </tr>
                                                  ))}
                                              </tbody>
                                          </table>
                                      )}
                                  </div>
                                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 overflow-x-auto">
                                      <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2"><Icon name="bot" className="w-5 h-5 text-fuchsia-400" /> Bots de práctica (liga)</h2>
                                      <p className="text-xs text-gray-500 mb-3">Competidores simulados con puntuación semanal. No son usuarios reales.</p>
                                      <table className="w-full text-sm text-left">
                                          <thead><tr className="text-gray-500 border-b border-white/10"><th className="py-2 pr-2">Nombre</th><th className="py-2 pr-2">Ciudad / nivel</th><th className="py-2">Rol</th></tr></thead>
                                          <tbody>
                                              {MULLER_BOT_PLAYERS.map((b) => (
                                                  <tr key={b.id} className="border-b border-white/5 text-gray-300">
                                                      <td className="py-2 pr-2 font-bold text-fuchsia-200">{b.name}</td>
                                                      <td className="py-2 pr-2">{b.tag} · {b.lvl}</td>
                                                      <td className="py-2"><span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30">Bot</span></td>
                                                  </tr>
                                              ))}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                          )}

                          {communitySubTab === 'ligas' && (
                              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:p-6 overflow-x-auto shadow-xl">
                                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                      <h2 className="text-lg font-black text-white flex items-center gap-2"><Icon name="medal" className="w-6 h-6 text-amber-400" /> Liga semanal Müller</h2>
                                      <span className="text-xs font-mono text-gray-500">Semana (lun): {leagueBoard.week}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-4">
                                      {mullerSupabaseConfigured()
                                          ? 'Puntuación global: se sube a Supabase (tabla league_scores) mientras practicas. Los bots son simulados y se mezclan en la tabla.'
                                          : 'Tu puntuación usa XP, monedas, racha, dictados y práctica oral. Los bots tienen puntuación simulada por semana (cambia cada lunes).'}
                                  </p>
                                  <table className="w-full text-sm">
                                      <thead>
                                          <tr className="text-gray-500 border-b border-white/10 text-left">
                                              <th className="py-2 pr-2 w-10">#</th>
                                              <th className="py-2 pr-2">Participante</th>
                                              <th className="py-2 pr-2 hidden sm:table-cell">Detalle</th>
                                              <th className="py-2 text-right">Pts</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {leagueBoard.rows.map((r) => (
                                              <tr key={r.id} className={`border-b border-white/5 ${r.isSelf ? 'bg-violet-900/25' : ''}`}>
                                                  <td className="py-2.5 pr-2 font-black text-gray-500">{r.rank}</td>
                                                  <td className="py-2.5 pr-2">
                                                      <span className="font-bold text-white">{r.name}</span>
                                                      {r.isBot ? <span className="ml-2 text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-fuchsia-900/40 text-fuchsia-300">Bot</span> : null}
                                                      {r.isSelf ? <span className="ml-2 text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-violet-800/60 text-violet-200">Tú</span> : null}
                                                  </td>
                                                  <td className="py-2.5 pr-2 text-gray-500 text-xs hidden sm:table-cell">{r.sub}</td>
                                                  <td className="py-2.5 text-right font-black text-amber-300 tabular-nums">{r.score}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          )}
                      </div>
                  )}

                  {/* HISTORIA (Main Engine) con botón Ruido */}
                  {activeTab === 'historia' && !practiceActive && (
                     <div className="flex-1 flex flex-col relative w-full min-h-full justify-center items-center p-3 md:p-8">
                        <div className="absolute top-2 left-2 z-[12] flex flex-col gap-2 items-start max-w-[min(100%,min(420px,96vw))]">
                            <div className="flex flex-wrap gap-1 items-center">
                                <ExerciseHelpBtn helpId={historiaExerciseHelpId} />
                                <ExerciseHelpBtn helpId="historia_herramientas" compact className="!text-amber-200/95 !border-amber-500/25" title="Barra de herramientas (Diktat, huecos, artículos…)" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-2 py-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Guion</span>
                                <select
                                    className="bg-zinc-900/90 text-white text-[11px] md:text-xs font-bold rounded-lg px-2 py-1.5 border border-white/15 outline-none max-w-[220px] md:max-w-[280px]"
                                    value={isDefaultScript ? '__default__' : (activeSavedScriptId ? String(activeSavedScriptId) : '__other__')}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (v === '__default__') loadDefaultGuion();
                                        else if (v === '__other__') return;
                                        else {
                                            const s = savedScripts.find((x) => String(x.id) === v);
                                            if (s) loadSavedScript(s);
                                        }
                                    }}
                                >
                                    <option value="__default__">Ejemplo integrado (Lektion 17)</option>
                                    {savedScripts.map((s) => (
                                        <option key={String(s.id)} value={String(s.id)}>{s.title || 'Sin título'}</option>
                                    ))}
                                    {!isDefaultScript && !activeSavedScriptId ? (
                                        <option value="__other__">{activeScriptTitle} (actual, no guardado)</option>
                                    ) : null}
                                </select>
                            </div>
                        </div>
                        {mode !== 'quiz' && mode !== 'interview' && !podcastMode && (
                            <div className="absolute top-2 right-2 flex flex-wrap items-center gap-1 md:gap-2 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md z-10 max-w-[95%] justify-end">
                                <button onClick={() => setFluesternMode(!fluesternMode)} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${fluesternMode ? 'bg-zinc-600 text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-gray-300 hover:bg-white/10'}`} title="Modo Flüstern"><Icon name="ear" className="w-3 h-3 md:w-4 md:h-4" /> Flüstern</button>
                                <button onClick={() => setNoiseEnabled(!noiseEnabled)} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${noiseEnabled ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-gray-300 hover:bg-white/10'}`} title="Ruido de fondo (examen)"><Icon name="volume-2" className="w-3 h-3 md:w-4 md:h-4" /> Ruido</button>
                                <button onClick={() => {setDiktatMode(!diktatMode); setBlindMode(false); setLueckentextMode(false); setPuzzleMode(false); setDeclinaMode(false); setArtikelSniperMode(false); resetModes(); stopAudio();}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${diktatMode ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="edit" className="w-3 h-3 md:w-4 md:h-4" /> Diktat</button>
                                <button onClick={() => {setLueckentextMode(!lueckentextMode); setDiktatMode(false); setPuzzleMode(false); setArtikelSniperMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${lueckentextMode ? 'bg-amber-500 text-black' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="edit-3" className="w-3 h-3 md:w-4 md:h-4" /> Huecos</button>
                                <button onClick={() => {setArtikelSniperMode(!artikelSniperMode); setDiktatMode(false); setLueckentextMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${artikelSniperMode ? 'bg-red-800 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="target" className="w-3 h-3 md:w-4 md:h-4" /> Artículos</button>
                                <button onClick={() => {setDeclinaMode(!declinaMode); setDiktatMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${declinaMode ? 'bg-pink-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="wand-2" className="w-3 h-3 md:w-4 md:h-4" /> Declinar</button>
                                <button onClick={() => {setTempusMode(!tempusMode);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${tempusMode ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="clock" className="w-3 h-3 md:w-4 md:h-4" /> Tempus</button>
                                <button onClick={() => {setPuzzleMode(!puzzleMode); setDiktatMode(false); setBlindMode(false); setDeclinaMode(false); setArtikelSniperMode(false); resetModes(); stopAudio();}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${puzzleMode ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-white/10'}`}><Icon name="puzzle" className="w-3 h-3 md:w-4 md:h-4" /> Satzbau</button>
                                <button onClick={() => {setBlindMode(!blindMode); setDiktatMode(false); setPuzzleMode(false);}} className={`flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-bold transition ${blindMode ? 'bg-blue-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>{blindMode ? <Icon name="eye-off" className="w-3 h-3 md:w-4 md:h-4" /> : <Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" />} Oído</button>
                                <div className="flex items-center gap-0.5 md:gap-1 pl-1 md:pl-2 border-l border-white/20">
                                    <Icon name="mic-off" className={`w-3 h-3 md:w-4 md:h-4 ${roleplayChar !== 'none' ? 'text-red-400' : 'text-gray-400'}`} />
                                    <select className="bg-transparent text-[10px] md:text-xs text-white font-bold outline-none cursor-pointer" value={roleplayChar} onChange={(e) => setRoleplayChar(e.target.value)}>
                                        <option value="none" className="text-black">No mutear</option>
                                        <option value="Todos" className="text-black font-bold">Mutear TODOS</option>
                                        <option value="Lukas" className="text-black">Lukas</option>
                                        <option value="Elena" className="text-black">Elena</option>
                                        <option value="Herr Weber" className="text-black">Weber</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {podcastMode && (
                            <div className="absolute top-2 right-2 bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 px-2 md:px-4 py-1 md:py-2 rounded-full font-bold flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2 animate-pulse z-10 text-[10px] md:text-sm max-w-[min(96%,280px)] sm:max-w-none text-left">
                                <span className="flex items-center gap-1 md:gap-2"><Icon name="car" className="w-3 h-3 md:w-5 md:h-5 shrink-0" /> Modo Podcast</span>
                                {historiaPlaylistAllScripts && savedScripts.length > 0 ? <span className="text-indigo-100/90 font-semibold normal-case">+ Todos los guiones (siguiente al terminar)</span> : null}
                            </div>
                        )}

                        {mode === 'interview' ? (
                            (() => {
                                const q = MULLER_ORAL_B1_QUESTIONS[oralQIdx % MULLER_ORAL_B1_QUESTIONS.length];
                                const modelDe = q.model || '';
                                return (
                            <div className="max-w-4xl w-full flex flex-col items-center justify-center animate-in zoom-in duration-500 p-4">
                                <div className="bg-emerald-900 text-emerald-200 border border-emerald-500 px-3 md:px-6 py-1 md:py-2 rounded-full font-bold flex items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm"><Icon name="message-square" className="w-4 h-4 md:w-5 md:h-5" /> Mündliche Prüfung Teil 2 · {oralQIdx + 1}/{MULLER_ORAL_B1_QUESTIONS.length}</div>
                                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Tiempo por respuesta</span>
                                    {[60, 90, 120].map((s) => (
                                        <button key={s} type="button" onClick={() => { setOralSecs(s); setOralDeadline(Date.now() + s * 1000); setOralClock(0); }} className={`px-2 py-1 rounded-lg text-xs font-bold border ${oralSecs === s ? 'bg-emerald-700 border-emerald-400 text-white' : 'bg-black/40 border-white/15 text-gray-400'}`}>{s}s</button>
                                    ))}
                                </div>
                                <div className={`w-full max-w-xl mb-4 rounded-2xl border px-4 py-3 text-center font-bold text-2xl md:text-4xl tabular-nums ${oralLeftSec !== null && oralLeftSec <= 15 ? 'border-amber-500 bg-amber-950/40 text-amber-200' : 'border-emerald-600/50 bg-black/30 text-emerald-200'}`}>
                                    {oralLeftSec !== null ? `${Math.floor(oralLeftSec / 60)}:${String(oralLeftSec % 60).padStart(2, '0')}` : '—'}
                                </div>
                                <h2 className="text-base md:text-2xl text-gray-300 font-bold mb-2 uppercase tracking-widest text-center">Prüfer/in fragt:</h2>
                                <h1 className="text-lg md:text-3xl font-medium text-white text-center mb-2 px-2 leading-snug border-l-4 border-emerald-500 pl-3 bg-emerald-950/30 py-3 rounded-r-xl">"{q.de}"</h1>
                                <p className="text-sm text-gray-500 italic mb-6 text-center max-w-2xl">({q.es})</p>
                                <div className="flex flex-col items-center gap-3 md:gap-4 w-full bg-black/40 p-4 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
                                    <button type="button" onClick={() => { const u = new SpeechSynthesisUtterance(q.de); u.lang = 'de-DE'; window.__mullerApplyPreferredDeVoice(u); u.rate = parseFloat(localStorage.getItem(MULLER_TTS_RATE_KEY) || '0.92') || 0.92; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }} className="w-full max-w-md py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm border border-white/10 flex items-center justify-center gap-2"><Icon name="volume-2" className="w-5 h-5" /> Escuchar pregunta</button>
                                    <button type="button" onMouseDown={micMouseDownGuard(() => handleVoiceStart(modelDe))} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => handleVoiceStart(modelDe))} onTouchEnd={handleVoiceStop} className={`rounded-full p-8 md:p-12 text-white transition transform hover:scale-105 shadow-xl select-none touch-manipulation ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'}`}><Icon name="mic" className="w-14 h-14 md:w-20 md:h-20" /></button>
                                    <p className="text-gray-400 font-bold mt-1 text-center text-xs md:text-sm">Mantén pulsado para responder (se compara con una frase modelo B1)</p>
                                    {spokenText && (
                                        <div className="text-center w-full mt-4 md:mt-6">
                                            <p className="text-yellow-300 font-medium text-base md:text-2xl mb-3 md:mb-4">"{spokenText}"</p>
                                            {pronunciationFeedback.length > 0 && (
                                                <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-3 md:my-4 bg-black/50 p-2 md:p-4 rounded-xl border border-white/10">
                                                    {pronunciationFeedback.map((item, idx) => (
                                                        <span key={idx} className={`text-xs md:text-lg font-bold px-1 md:px-2 py-0.5 md:py-1 rounded ${item.correct ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30 line-through decoration-red-500'}`}>{item.word}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                                <button type="button" onClick={() => { setOralQIdx((i) => (i + 1) % MULLER_ORAL_B1_QUESTIONS.length); setSpokenText(''); setOralDeadline(Date.now() + oralSecs * 1000); setOralClock(0); }} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm">Siguiente pregunta</button>
                                                <button type="button" onClick={() => { setMode('dialogue'); setOralDeadline(null); setSpokenText(''); saveProgress({ activityByDay: mergeActivityPoints(20) }); }} className="bg-white text-black px-4 py-2 rounded-xl font-black text-sm hover:bg-gray-200">Salir del simulacro</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                                );
                            })()
                        ) : mode === 'roleplay_wait' ? (
                            <div className="max-w-4xl w-full flex flex-col items-center justify-center gap-4 md:gap-6 animate-in zoom-in duration-300 p-4">
                                <div className="bg-red-600 text-white px-3 md:px-6 py-1 md:py-2 rounded-full font-bold flex items-center gap-2 text-xs md:text-sm"><Icon name="mic-off" className="w-4 h-4 md:w-5 md:h-5" /> {roleplayChar === 'Todos' ? "Modo Lectura" : "Tu turno (Roleplay)"}</div>
                                <h1 className="text-xl md:text-5xl font-medium text-white text-center leading-snug break-words w-full max-w-full px-1">
                                    {renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}
                                    {guionData[getActualSceneIndex()].isRedemittel && <span className="inline-flex items-center justify-center ml-2 md:ml-3 mb-1 md:mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 rounded shadow-lg animate-pulse whitespace-nowrap"><Icon name="flame" className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" /> ÚTIL</span>}
                                </h1>
                                {!showCurrentTranslation ? (
                                    <button onClick={() => setShowCurrentTranslation(true)} className="text-gray-500 hover:text-white transition text-xs md:text-sm font-bold flex items-center gap-1 mt-2 border border-gray-700 rounded-full px-2 md:px-3 py-0.5 md:py-1"><Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" /> Ver Traducción</button>
                                ) : (
                                    <div className="bg-white/10 text-gray-300 italic px-3 md:px-6 py-1 md:py-2 rounded-lg border border-white/20 mt-2 text-base md:text-xl animate-in slide-in-from-top-2 text-center">"{guionData[getActualSceneIndex()].translation}"</div>
                                )}
                                <div className="flex flex-col items-center gap-3 md:gap-4 w-full mt-3 md:mt-4 bg-black/40 p-4 md:p-6 rounded-xl border border-white/10">
                                    <div className="flex gap-4 md:gap-8 justify-center items-center">
                                        <button onClick={() => { window.speechSynthesis.cancel(); window.speechSynthesis.speak(playSceneAudio(sanitizeHistoriaSpeechText(guionData[getActualSceneIndex()].text), guionData[getActualSceneIndex()].speaker)); }} className="flex flex-col items-center text-gray-400 hover:text-white transition">
                                            <div className="bg-gray-800 p-2 md:p-4 rounded-full mb-1 md:mb-2"><Icon name="volume-2" className="w-5 h-5 md:w-8 md:h-8" /></div><span className="text-[10px] md:text-sm font-bold">1. Escuchar</span>
                                        </button>
                                        <button type="button" onMouseDown={micMouseDownGuard(() => handleVoiceStart())} onMouseUp={handleVoiceStop} onMouseLeave={handleVoiceStop} onTouchStart={micTouchStartGuard(() => handleVoiceStart())} onTouchEnd={handleVoiceStop} className={`flex flex-col items-center transition transform select-none touch-manipulation ${isListening ? 'text-red-400 scale-110' : 'text-blue-400 hover:text-blue-300'}`}>
                                            <div className={`p-2 md:p-4 rounded-full mb-1 md:mb-2 shadow-xl ${isListening ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-blue-600 text-white'}`}><Icon name="mic" className="w-5 h-5 md:w-8 md:h-8" /></div><span className="text-[10px] md:text-sm font-bold">2. Mantener</span>
                                        </button>
                                    </div>
                                    {spokenText && (
                                        <div className="text-center w-full mt-4 md:mt-6">
                                            <p className="text-yellow-300 font-mono text-base md:text-xl mb-2">"{spokenText}"</p>
                                            {pronunciationFeedback.length > 0 && (
                                                <div className="flex flex-wrap gap-1 md:gap-2 justify-center my-3 md:my-4 bg-black/50 p-2 md:p-4 rounded-xl border border-white/10">
                                                    {pronunciationFeedback.map((item, idx) => (
                                                        <span key={idx} className={`text-xs md:text-lg font-bold px-1 md:px-2 py-0.5 md:py-1 rounded ${item.correct ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-red-900/50 text-red-400 border border-red-500/30 line-through decoration-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>{item.word}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {grammarPolizeiMsg && <p className="text-red-400 font-bold mb-3 md:mb-4 bg-red-900/30 p-1 md:p-2 rounded text-xs md:text-sm">{grammarPolizeiMsg}</p>}
                                            {pronunciationScore !== null && (
                                                <div className="flex items-center justify-center gap-2 md:gap-3">
                                                    <div className="w-full bg-gray-800 rounded-full h-2 md:h-4 max-w-md"><div className={`h-2 md:h-4 rounded-full transition-all duration-1000 ${pronunciationScore >= 90 ? 'bg-green-500' : pronunciationScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${pronunciationScore}%`}}></div></div>
                                                    <span className="font-bold text-sm md:text-xl">{pronunciationScore}%</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleNext} className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-xl font-black text-base md:text-lg hover:bg-gray-200 transition shadow-xl mt-2 w-full md:w-auto">Continuar ➔</button>
                            </div>
                        ) : mode === 'dialogue' && puzzleMode ? (
                            <div className="max-w-4xl w-full flex flex-col gap-4 md:gap-6 animate-in fade-in relative mt-6 md:mt-8 items-center p-4">
                                <span className="uppercase tracking-widest text-xs md:text-sm font-bold text-white/70 bg-indigo-900/50 border border-indigo-500/50 px-3 md:px-5 py-1 md:py-2 rounded-full flex items-center gap-2"><Icon name="puzzle" className="w-3 h-3 md:w-4 md:h-4" /> Satzbau Puzzle: {guionData[getActualSceneIndex()].speaker}</span>
                                {!showPuzzleResult ? (
                                    <div className="flex flex-col items-center gap-4 md:gap-8 w-full mt-2 md:mt-4">
                                        <div className="min-h-[80px] md:min-h-[100px] w-full bg-black/40 border-2 border-dashed border-indigo-500/50 rounded-xl p-2 md:p-4 flex flex-wrap gap-1 md:gap-2 items-center justify-center">
                                            {puzzleAnswer.map(pw => <button key={pw.id} onClick={() => { setPuzzleAnswer(puzzleAnswer.filter(w => w.id !== pw.id)); setPuzzleWords([...puzzleWords, pw]); }} className="bg-indigo-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-bold text-sm md:text-xl">{pw.text}</button>)}
                                        </div>
                                        <div className="flex flex-wrap gap-2 md:gap-3 justify-center w-full bg-black/20 p-3 md:p-6 rounded-xl">
                                            {puzzleWords.map(pw => <button key={pw.id} onClick={() => { setPuzzleWords(puzzleWords.filter(w => w.id !== pw.id)); setPuzzleAnswer([...puzzleAnswer, pw]); }} className="bg-gray-800 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-bold text-sm md:text-xl">{pw.text}</button>)}
                                        </div>
                                        <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-center">
                                            <button onClick={() => { setIsPlaying(true); togglePlay(); setIsPlaying(true); }} className="bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm"><Icon name="volume-2" className="w-3 h-3 md:w-5 md:h-5" /> Pista</button>
                                            <button onClick={() => runSingleSubmitAction('puzzle-check', () => {
                                                const raw = (guionData[getActualSceneIndex()]?.text || '').trim();
                                                const norm = (s) => String(s || '').toLowerCase().replace(/[.,!?;:…]/g, ' ').replace(/\s+/g, ' ').trim();
                                                const target = norm(raw.split(/\s+/).filter(Boolean).join(' '));
                                                const built = norm(puzzleAnswer.map((w) => w.text).join(' '));
                                                const ok = !!target && built === target;
                                                if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(ok);
                                                setPuzzleLastOk(ok);
                                                setShowPuzzleResult(true);
                                            })} disabled={puzzleWords.length > 0} className={`px-4 md:px-8 py-2 md:py-3 rounded-lg font-bold flex items-center gap-1 md:gap-2 text-xs md:text-sm ${puzzleWords.length === 0 ? 'bg-green-600' : 'bg-gray-800'}`}><Icon name="check-circle" className="w-3 h-3 md:w-5 md:h-5" /> Comprobar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full text-center flex flex-col items-center gap-4 md:gap-6">
                                        {puzzleLastOk ? (
                                            <h1 className="text-xl md:text-4xl font-medium text-white bg-green-900/40 p-4 md:p-6 rounded-xl border border-green-500/30 w-full max-w-full break-words leading-snug">{renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}</h1>
                                        ) : (
                                            <div className="w-full max-w-full space-y-3">
                                                <p className="text-red-200 font-black text-lg md:text-2xl bg-red-950/50 border border-red-500/40 rounded-xl px-4 py-3">Orden incorrecto — compara con la solución:</p>
                                                <h1 className="text-xl md:text-4xl font-medium text-white bg-amber-950/40 p-4 md:p-6 rounded-xl border border-amber-600/30 w-full max-w-full break-words leading-snug">{renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}</h1>
                                            </div>
                                        )}
                                        <button onClick={handleNext} className="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold mt-2 md:mt-4 flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base">Siguiente ➔</button>
                                    </div>
                                )}
                            </div>
                        ) : mode === 'dialogue' && diktatMode ? (
                            <div className="max-w-4xl w-full flex flex-col gap-4 md:gap-6 animate-in fade-in relative mt-6 md:mt-8 items-center p-4">
                                {isReviewing && <div className="absolute -top-8 md:-top-12 text-red-500 font-black animate-pulse text-xs md:text-xl">⚠️ REPASO OBLIGATORIO (SRS)</div>}
                                <span className="uppercase tracking-widest text-xs md:text-sm font-bold bg-black/30 px-3 md:px-5 py-1 md:py-2 rounded-full border border-white/10">{guionData[getActualSceneIndex()].speaker} spricht...</span>
                                {!showDiktatResult ? (
                                    <>
                                        <p className="text-base md:text-xl text-blue-200 font-bold mb-1 md:mb-2">✍️ Escribe lo que oyes:</p>
                                        <textarea className="w-full h-24 md:h-32 bg-black/50 border-2 border-blue-500/50 rounded-xl p-3 md:p-4 text-base md:text-2xl text-white outline-none" value={diktatInput} onChange={(e) => setDiktatInput(e.target.value)} onKeyDown={(e) => handleExerciseEnterSubmit(e, 'diktat-check', handleDiktatCheck, { requireCtrlOrMeta: true })} autoFocus />
                                        <div className="flex gap-3 md:gap-4 w-full md:w-auto justify-center">
                                            <button onClick={() => { setIsPlaying(true); togglePlay(); setIsPlaying(true); }} className="bg-gray-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 flex-1 md:flex-none justify-center text-xs md:text-sm"><Icon name="volume-2" className="w-3 h-3 md:w-5 md:h-5" /> Audio</button>
                                            <button onClick={() => runSingleSubmitAction('diktat-check', handleDiktatCheck)} className="bg-green-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold flex items-center gap-2 flex-1 md:flex-none justify-center text-xs md:text-sm"><Icon name="check-circle" className="w-3 h-3 md:w-5 md:h-5" /> Corregir</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full text-center flex flex-col items-center gap-4 md:gap-6">
                                        {renderDiktatDiff(guionData[getActualSceneIndex()].text, diktatInput)}
                                        {diktatMotivationMsg ? (
                                            <p className="text-amber-100/95 text-sm md:text-base font-semibold max-w-lg rounded-2xl border border-amber-500/35 bg-amber-950/50 px-4 py-3 shadow-lg">{diktatMotivationMsg}</p>
                                        ) : null}
                                        <button onClick={handleNext} className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold mt-2 md:mt-4 flex items-center gap-2 w-full md:w-auto justify-center text-sm md:text-base">Siguiente ➔</button>
                                    </div>
                                )}
                            </div>
                        ) : mode === 'dialogue' && historiaAudioOnly && !podcastMode && !puzzleMode && !diktatMode && !isReviewing ? (
                            <div className="max-w-3xl w-full flex flex-col items-center justify-center flex-1 py-8 md:py-16 px-4 gap-8 md:gap-10 animate-in fade-in">
                                <p className="text-violet-300 font-black text-xs uppercase tracking-[0.2em]">Solo audio · manos libres</p>
                                <p className="text-3xl md:text-5xl font-black text-center text-white leading-tight">{guionData[getActualSceneIndex()]?.speaker || '—'}</p>
                                <p className="text-gray-500 text-sm font-mono">Szene {sceneIndex + 1} / {guionData.length} · {activeScriptTitle}</p>
                                <div className="flex items-center justify-center gap-6 md:gap-10 w-full">
                                    <button type="button" onClick={handlePrev} className="muller-icon-nav p-5 md:p-6 rounded-full bg-gray-800 border border-white/10 hover:bg-gray-700 transition text-white" disabled={podcastMode}><Icon name="chevron-left" className="w-8 h-8 md:w-10 md:h-10 text-white" /></button>
                                    <button type="button" onClick={togglePlay} className={`p-8 md:p-12 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.45)] transition text-white ${isPlaying ? 'bg-red-600' : 'bg-blue-600'}`}><Icon name={isPlaying ? 'square' : 'play'} className="w-12 h-12 md:w-16 md:h-16 fill-current text-white" /></button>
                                    <button type="button" onClick={handleNext} className="muller-icon-nav p-5 md:p-6 rounded-full bg-gray-800 border border-white/10 hover:bg-gray-700 transition text-white" disabled={podcastMode}><Icon name="chevron-right" className="w-8 h-8 md:w-10 md:h-10 text-white" /></button>
                                </div>
                                <div className="flex items-center justify-center gap-2 md:gap-3 bg-black/50 px-4 py-2 rounded-xl border border-white/10 w-full max-w-sm">
                                    <Icon name="sliders" className="w-4 h-4 text-gray-400" />
                                    <input type="range" min="0.50" max="1.50" step="0.01" value={playbackRate} onChange={(e) => setPlaybackRate(parseFloat(e.target.value))} className="flex-1 accent-blue-500" />
                                    <span className="text-white font-mono text-sm w-12 text-right">x{playbackRate.toFixed(2)}</span>
                                </div>
                                <button type="button" onClick={() => setHistoriaAudioOnly(false)} className="text-sm font-bold text-sky-300 hover:text-white underline underline-offset-4">Mostrar guion completo</button>
                            </div>
                        ) : mode === 'dialogue' && (
                            <div className="max-w-4xl w-full flex flex-col gap-3 md:gap-6 animate-in fade-in relative mt-4 md:mt-8 p-3 md:p-0">
                                {isReviewing && <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 text-red-500 font-black animate-pulse text-xs md:text-xl w-full text-center">⚠️ REPASO OBLIGATORIO (SRS)</div>}
                                <span className="uppercase tracking-widest text-[10px] md:text-sm font-bold bg-black/30 px-2 md:px-4 py-0.5 md:py-1.5 rounded-full self-start border border-white/10">{guionData[getActualSceneIndex()].speaker}</span>
                                
                                <h1 className={`text-2xl md:text-5xl font-medium text-white shadow-sm transition-all duration-300 leading-snug break-words w-full max-w-full ${blindMode ? 'blur-md hover:blur-none cursor-pointer' : ''}`}>
                                    {renderHighlightedText(guionData[getActualSceneIndex()].text, guionData[getActualSceneIndex()].vocab)}
                                    {guionData[getActualSceneIndex()].isRedemittel && <span className="inline-flex items-center justify-center ml-2 md:ml-3 mb-1 md:mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 rounded shadow-lg animate-pulse whitespace-nowrap"><Icon name="flame" className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" /> ÚTIL</span>}
                                </h1>

                                {tempusMode && tempusVerbList.length > 0 && (
                                    <div className="tempus-panel mt-3 md:mt-4 p-2 md:p-3 bg-blue-950/60 border border-blue-500/40 rounded-xl w-full">
                                        <p className="text-blue-300 font-bold text-xs md:text-sm mb-1 md:mb-2 flex items-center gap-2"><Icon name="clock" className="w-3 h-3 md:w-4 md:h-4" /> Tempus - Formas verbales:</p>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {tempusVerbList.map((verb, idx) => (
                                                <div key={idx} className="bg-black/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-blue-400/50">
                                                    <span className="font-bold text-blue-200 text-xs md:text-sm">{verb.infinitive}</span>
                                                    <span className="text-blue-300 text-[10px] md:text-xs ml-1 md:ml-2">→ {verb.forms}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {tempusSelectedVerb && (
                                            <div className="mt-3 rounded-lg border border-sky-500/35 bg-sky-950/35 p-3">
                                                <p className="text-[10px] md:text-xs text-sky-300 uppercase tracking-wider font-black">Verbo tocado: {tempusSelectedVerb.touched}</p>
                                                <p className="text-white font-bold text-sm md:text-base mt-1">Infinitivo: {tempusSelectedVerb.infinitive}</p>
                                                <p className="text-sky-100/90 text-xs md:text-sm mt-1 leading-relaxed">{tempusSelectedVerb.forms}</p>
                                                <p className="text-sky-300/90 text-[10px] md:text-xs mt-1">{inferTempusContextLabel(tempusSelectedVerb.touched)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="flex gap-2 md:gap-4 items-center">
                                    <span className="text-[8px] md:text-xs font-mono text-gray-500 flex flex-wrap gap-1 md:gap-2">
                                        <span className="text-purple-300 underline decoration-purple-500/70">Conector</span>
                                        <span className="text-blue-300 underline decoration-blue-500/70">Dativo</span>
                                        <span className="text-red-300 underline decoration-red-500/70">Acusativo</span>
                                        <span className="text-yellow-500/90 underline decoration-yellow-600/70">Mixta</span>
                                    </span>
                                </div>

                                {!showCurrentTranslation ? (
                                    <button onClick={() => setShowCurrentTranslation(true)} className="text-gray-500 hover:text-white transition text-[10px] md:text-sm font-bold flex items-center gap-1 w-max border border-gray-700 rounded-full px-2 md:px-3 py-0.5 md:py-1 mt-1 md:mt-2"><Icon name="eye" className="w-3 h-3 md:w-4 md:h-4" /> Ver Traducción</button>
                                ) : (
                                    <div className="bg-white/10 text-gray-300 italic px-3 md:px-6 py-1 md:py-2 rounded-lg border border-white/20 w-max max-w-full text-base md:text-xl animate-in slide-in-from-top-2">"{guionData[getActualSceneIndex()].translation}"</div>
                                )}

                                {(declinaMode || artikelSniperMode) && !isPlaying && (
                                    <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 text-pink-400 font-bold animate-pulse text-xs md:text-lg w-full text-center">Piensa la respuesta y pulsa Play o ➔ para continuar.</div>
                                )}
                                
                                {!isPlaying && !podcastMode && (
                                    <div className="absolute right-0 top-0 md:-right-16 md:top-1/2 md:-translate-y-1/2 flex flex-col gap-2 md:gap-4">
                                        <button onClick={showAITutor} className="bg-blue-600 text-white p-1.5 md:p-3 rounded-full border border-blue-400 shadow-lg flex items-center justify-center group" title="Tutor IA">
                                            <Icon name="help-circle" className="w-4 h-4 md:w-6 md:h-6" />
                                        </button>
                                        <button onClick={trySaveGrammarStructure} className="bg-cyan-600 text-white p-1.5 md:p-3 rounded-full border border-cyan-400 shadow-lg flex items-center justify-center group" title="Guardar Gramática">
                                            <Icon name="save" className="w-4 h-4 md:w-6 md:h-6" />
                                        </button>
                                    </div>
                                )}

                                {showTutor && (
                                    <div className="absolute inset-0 z-50 bg-black/95 p-4 md:p-8 flex flex-col justify-center items-center rounded-2xl">
                                        <div className="bg-slate-900 border-2 border-blue-500 p-4 md:p-8 rounded-2xl max-w-2xl w-full shadow-[0_0_30px_rgba(59,130,246,0.5)] overflow-y-auto max-h-[80vh]">
                                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                                <h2 className="text-xl md:text-3xl font-black text-blue-400 flex items-center gap-2 md:gap-3"><Icon name="brain" className="w-6 h-6 md:w-8 md:h-8" /> Tutor IA</h2>
                                                <button onClick={() => setShowTutor(false)} className="text-gray-400 hover:text-white"><Icon name="x" className="w-6 h-6 md:w-8 md:h-8" /></button>
                                            </div>
                                            <div className="text-base md:text-xl text-white space-y-3 md:space-y-6 leading-relaxed whitespace-pre-wrap font-medium">
                                                {tutorMessage}
                                            </div>
                                            <button onClick={() => setShowTutor(false)} className="mt-6 md:mt-8 w-full bg-blue-600 hover:bg-blue-500 py-2 md:py-4 rounded-xl font-bold text-base md:text-xl">Entstanden (Entendido)</button>
                                        </div>
                                    </div>
                                )}

                                {showGrammarPrompt && (
                                    <div className="absolute inset-0 z-50 bg-black/90 p-4 flex flex-col justify-center items-center rounded-2xl animate-in zoom-in">
                                        <div className="bg-cyan-950 border-2 border-cyan-500 p-4 md:p-8 rounded-2xl max-w-lg w-full shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                            <h2 className="text-lg md:text-2xl font-black text-cyan-400 flex items-center gap-2 md:gap-3 mb-3 md:mb-4"><Icon name="save" className="w-5 h-5 md:w-6 md:h-6" /> Guardar Manual</h2>
                                            <p className="text-cyan-100 mb-4 md:mb-6 text-xs md:text-sm">No he detectado ninguna regla automática en esta frase. ¿Qué gramática quieres guardar en tus Flashcards?</p>
                                            <p className="text-gray-400 italic mb-2 text-[10px] md:text-xs">Frase actual: "{guionData[getActualSceneIndex()].text}"</p>
                                            <input type="text" placeholder="Ej: Nebensatz con weil" className="w-full bg-black/50 border border-cyan-800 p-2 md:p-3 rounded-lg text-white outline-none focus:border-cyan-400 mb-4 md:mb-6 text-xs md:text-sm" value={customGrammarInput} onChange={(e)=>setCustomGrammarInput(e.target.value)} autoFocus />
                                            <div className="flex gap-3 md:gap-4">
                                                <button onClick={()=>setShowGrammarPrompt(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 md:py-3 rounded-xl font-bold text-xs md:text-base">Cancelar</button>
                                                <button onClick={handleCustomGrammarSave} className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-2 md:py-3 rounded-xl font-bold shadow-lg text-xs md:text-base">Guardar ➔</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                  )}
              </div>

              {/* REPRODUCTOR CONTROLES INFERIORES */}
              {activeTab === 'historia' && mode !== 'quiz' && mode !== 'interview' && !practiceActive && (
                  <div className="muller-historia-player-bar bg-gray-950 p-3 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 border-t border-gray-800 z-20">
                      <div className="flex flex-col text-xs md:text-sm text-gray-400 w-full sm:w-auto text-center sm:text-left">
                        <span className="font-bold text-white text-sm md:text-base truncate sm:max-w-[200px]">{activeScriptTitle}</span>
                        <span>Szene {isReviewing ? reviewIndexPointer + 1 : sceneIndex + 1} von {isReviewing ? userStats.failedDiktatScenes.length : guionData.length} {isReviewing && "(Repaso)"}</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 md:gap-6 w-full sm:w-auto">
                        <button onClick={handlePrev} className={`muller-icon-nav p-2 md:p-3 bg-gray-900 rounded-full transition text-white border border-gray-700 shadow-md ${isReviewing || podcastMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`} disabled={podcastMode}><Icon name="chevron-left" className="w-4 h-4 md:w-6 md:h-6 text-white" /></button>
                        <button onClick={togglePlay} className={`p-3 md:p-6 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isPlaying ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {isPlaying ? <Icon name="square" className="w-5 h-5 md:w-8 md:h-8 fill-current" /> : <Icon name="play" className="w-5 h-5 md:w-8 md:h-8 ml-0.5 md:ml-1 fill-current" />}
                        </button>
                        <button type="button" onClick={() => { try { if (window.__mullerAudiobook && typeof window.__mullerAudiobook.toggle === 'function') window.__mullerAudiobook.toggle(); } catch (e) {} }} className={`p-2 md:p-3 rounded-full transition text-white border border-gray-700 shadow-md ${audiobookPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-700 hover:bg-amber-600'}`} title={audiobookPlaying ? 'Detener audiolibro' : 'Audiolibro: reproduce todo el guión'}>
                            <Icon name={audiobookPlaying ? 'square' : 'headphones'} className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </button>
                        <button onClick={handleNext} className={`muller-icon-nav p-2 md:p-3 bg-gray-900 rounded-full transition text-white border border-gray-700 shadow-md ${podcastMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`} disabled={podcastMode}><Icon name="chevron-right" className="w-4 h-4 md:w-6 md:h-6 text-white" /></button>
                      </div>
                      <button type="button" onClick={exportScriptPDF} className="flex bg-red-700 hover:bg-red-600 border border-red-500 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-white font-bold items-center gap-2 shadow-lg transition text-xs md:text-sm shrink-0" title="PDF con alemán, traducción al español, vocabulario y análisis"><Icon name="file-down" className="w-3 h-3 md:w-4 md:h-4" /> PDF Guion</button>
                      <div className="flex items-center justify-center gap-2 md:gap-3 bg-black/50 px-2 md:px-4 py-1 md:py-2 rounded-xl border border-gray-800 w-full sm:w-auto">
                          <Icon name="sliders" className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                          <input type="range" min="0.50" max="1.50" step="0.01" value={playbackRate} onChange={(e) => setPlaybackRate(parseFloat(e.target.value))} className="w-20 md:w-32 accent-blue-500 cursor-pointer"/>
                          <span className="text-white font-mono font-bold text-xs md:text-sm w-10 md:w-12 text-right">x{playbackRate.toFixed(2)}</span>
                      </div>
                  </div>
              )}

              {pwaDeferredPrompt && (
                  <div className="muller-pwa-banner">
                      <span className="text-sm text-gray-100 pr-2 leading-snug"><strong className="text-white">Instalar Müller</strong> — se abre pantalla completa como app. En Chrome/Edge: &quot;Añadir a pantalla de inicio&quot;. En Safari (iPhone/iPad): compartir → &quot;Añadir a pantalla de inicio&quot;.</span>
                      <div className="flex items-center gap-2 ml-auto">
                          <button type="button" className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 font-bold text-sm text-white" onClick={async () => {
                              try {
                                  await pwaDeferredPrompt.prompt();
                              } catch (e) {}
                              setPwaDeferredPrompt(null);
                          }}>Instalar</button>
                          <button type="button" className="text-xs text-gray-400 hover:text-white underline" onClick={() => setPwaDeferredPrompt(null)}>Ahora no</button>
                      </div>
                  </div>
              )}
              {pdfStudyFullscreen && pdfStudyDoc ? (
                  <div className="fixed inset-0 z-[120] bg-black/95 flex flex-col">
                      <div className="flex items-center justify-between gap-3 px-3 md:px-5 py-3 border-b border-white/10 bg-slate-950/95">
                          <div className="min-w-0">
                              <p className="text-xs md:text-sm font-black text-cyan-100 truncate">PDF Coach · {pdfStudyDoc.name || 'Libro PDF'}</p>
                              <p className="text-[10px] md:text-xs text-cyan-300/80">Página {activePdfPageData.page || 1}/{pdfStudyDoc.totalPages || (pdfStudyDoc.pages || []).length || 1}</p>
                          </div>
                          <div className="flex items-center gap-2">
                              <button
                                  type="button"
                                  onClick={() => setPdfStudyInkNonce((k) => k + 1)}
                                  className="px-2.5 py-1.5 rounded-lg border border-amber-500/45 bg-amber-900/45 hover:bg-amber-800/60 text-[11px] font-bold text-amber-100"
                              >
                                  Nuevo lienzo
                              </button>
                              <button
                                  type="button"
                                  onClick={closePdfStudyFullscreen}
                                  className="px-3 py-1.5 rounded-lg border border-rose-500/45 bg-rose-900/50 hover:bg-rose-800/60 text-[11px] font-black text-white"
                              >
                                  Cerrar ✕
                              </button>
                          </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 md:p-5 grid grid-cols-1 xl:grid-cols-2 gap-4 bg-gradient-to-b from-slate-950 to-slate-900">
                          <section className="rounded-2xl border border-cyan-500/25 bg-black/35 p-3 md:p-4 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setPdfStudyPageIdx((i) => Math.max(0, i - 1))}
                                      disabled={pdfStudyPageIdx <= 0}
                                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-slate-900/70 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white"
                                  >
                                      ← Página
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setPdfStudyPageIdx((i) => Math.min(Math.max(0, (pdfStudyDoc.pages || []).length - 1), i + 1))}
                                      disabled={pdfStudyPageIdx >= Math.max(0, (pdfStudyDoc.pages || []).length - 1)}
                                      className="px-3 py-1.5 rounded-lg border border-white/15 bg-slate-900/70 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white"
                                  >
                                      Página →
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => runPdfPageOcr(activePdfPageData.page || 1)}
                                      disabled={pdfStudyOcrBusy}
                                      className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-900/45 hover:bg-amber-800/55 disabled:opacity-45 text-xs font-bold text-amber-100"
                                  >
                                      {pdfStudyOcrBusy ? 'OCR…' : 'OCR página'}
                                  </button>
                              </div>
                              {pdfStudyBlobUrl ? (
                                  <div className="rounded-xl border border-white/10 overflow-hidden bg-black/45">
                                      <iframe
                                          title="PDF estudio fullscreen"
                                          src={`${pdfStudyBlobUrl}#page=${activePdfPageData.page || 1}&view=FitH`}
                                          className="w-full h-[52vh] md:h-[64vh] border-0"
                                      />
                                  </div>
                              ) : (
                                  <div className="rounded-xl border border-amber-600/35 bg-amber-950/35 p-3">
                                      <p className="text-xs text-amber-100">Vista PDF no disponible en esta sesión. Vuelve a subir el PDF para ver el documento completo aquí.</p>
                                  </div>
                              )}
                              <textarea
                                  value={activePdfPageData.text || ''}
                                  readOnly
                                  className="w-full h-32 bg-black/45 border border-cyan-500/25 rounded-xl p-3 text-xs text-cyan-50"
                                  placeholder="Texto detectado de esta página."
                              />
                          </section>
                          <section className="rounded-2xl border border-rose-500/25 bg-black/35 p-3 md:p-4 space-y-3">
                              <p className="text-xs font-black text-rose-200 uppercase tracking-wider">Notas de estudio por página (stylus + teclado)</p>
                              <TabletWritingCanvas
                                  padKey={pdfStudyCanvasPadKey}
                                  grid={true}
                                  strokeW={4}
                                  compareTarget={activePdfPageData.text || ''}
                                  snapshotData={activePdfPageNotes.drawing}
                                  snapshotPadKey={pdfStudyCanvasPadKey}
                                  onSnapshotChange={(dataUrl) => updatePdfPageNotes(activePdfPageData.page || 1, { drawing: dataUrl || '' })}
                                  onOcrCompared={() => {}}
                              />
                              <label className="block text-[11px] font-bold text-rose-200 uppercase tracking-wider">
                                  Notas rápidas (teclado)
                                  <textarea
                                      value={activePdfPageNotes.typed || ''}
                                      onChange={(e) => updatePdfPageNotes(activePdfPageData.page || 1, { typed: e.target.value })}
                                      placeholder="Ejemplos, dudas, vocabulario clave, errores típicos…"
                                      className="mt-1 w-full min-h-[120px] bg-black/45 border border-rose-500/30 rounded-xl p-3 text-xs text-white normal-case"
                                  />
                              </label>
                          </section>
                      </div>
                  </div>
              ) : null}
            </div>
          );
        }

        // ========== COMPONENTES FLOTANTES (Sincronización y Permiso Micrófono) ==========
        function FloatingButtons() {
            const [lastBackupIso, setLastBackupIso] = React.useState(() => localStorage.getItem('muller_last_backup_iso'));

            const requestMicPermission = async () => {
                try {
                    const ok = await window.mullerRequestMicPermission && window.mullerRequestMicPermission({ autoPrompt: true, showToast: true });
                    if (!ok) return;
                    window.__mullerToast && window.__mullerToast('Micrófono concedido. Ya puedes usar reconocimiento de voz.', 'success');
                } catch (err) {
                    window.__mullerToast && window.__mullerToast('No se pudo obtener permiso del micrófono.', 'error');
                }
            };

            const exportData = React.useCallback(() => {
                const allLocalData = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (!key) continue;
                    allLocalData[key] = localStorage.getItem(key);
                }
                const backupTimestamp = new Date().toISOString();
                localStorage.setItem('muller_last_backup_iso', backupTimestamp);
                setLastBackupIso(backupTimestamp);
                const dataToExport = {
                    allLocalStorage: allLocalData,
                    version: '4.0',
                    exportDate: backupTimestamp
                };
                const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `muller_progreso_${new Date().toISOString().slice(0,19)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                window.__mullerToast && window.__mullerToast('Backup total exportado. Guárdalo para sincronizar.', 'success');
            }, []);

            React.useEffect(() => {
                const onFull = () => exportData();
                window.addEventListener('muller-export-full-backup', onFull);
                return () => window.removeEventListener('muller-export-full-backup', onFull);
            }, [exportData]);

            const importData = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.type === 'muller_partial_v1' && data.part === 'srs') {
                            localStorage.setItem('muller_vocab_srs_v1', JSON.stringify(data.muller_vocab_srs_v1 || {}));
                            window.__mullerToast && window.__mullerToast('SRS importado. Recargando…', 'success');
                            window.location.reload();
                            return;
                        }
                        if (data.type === 'muller_partial_v1' && data.part === 'decks') {
                            const cur = JSON.parse(localStorage.getItem('mullerStats') || '{}');
                            const merged = { ...cur, difficultVocab: data.difficultVocab || cur.difficultVocab, normalVocab: data.normalVocab || cur.normalVocab, difficultGrammar: data.difficultGrammar || cur.difficultGrammar };
                            localStorage.setItem('mullerStats', JSON.stringify(merged));
                            window.__mullerToast && window.__mullerToast('Mazos importados. Recargando…', 'success');
                            window.location.reload();
                            return;
                        }
                        if (data.allLocalStorage && typeof data.allLocalStorage === 'object') {
                            localStorage.clear();
                            Object.entries(data.allLocalStorage).forEach(([key, value]) => {
                                localStorage.setItem(key, value);
                            });
                            setLastBackupIso(localStorage.getItem('muller_last_backup_iso'));
                        } else if (data.allMullerData && typeof data.allMullerData === 'object') {
                            Object.entries(data.allMullerData).forEach(([key, value]) => {
                                localStorage.setItem(key, value);
                            });
                            setLastBackupIso(localStorage.getItem('muller_last_backup_iso'));
                        } else {
                            if (data.userStats) localStorage.setItem('mullerStats', JSON.stringify(data.userStats));
                            if (data.savedScripts) localStorage.setItem('mullerScripts', JSON.stringify(data.savedScripts));
                            if (data.customVocabLessons) localStorage.setItem('mullerCustomVocab', JSON.stringify(data.customVocabLessons));
                        }
                        window.__mullerToast && window.__mullerToast('Datos importados correctamente. Recargando…', 'success');
                        window.location.reload();
                    } catch(err) { window.__mullerToast && window.__mullerToast('Archivo inválido.', 'error'); }
                };
                reader.readAsText(file);
            };

            const exportSrsOnly = () => {
                try {
                    const raw = localStorage.getItem('muller_vocab_srs_v1');
                    const map = raw ? JSON.parse(raw) : {};
                    const payload = { type: 'muller_partial_v1', part: 'srs', muller_vocab_srs_v1: map, exportDate: new Date().toISOString() };
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `muller_srs_only_${new Date().toISOString().slice(0, 19)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    window.__mullerToast && window.__mullerToast('Exportado solo SRS.', 'success');
                } catch (err) { window.__mullerToast && window.__mullerToast('No se pudo exportar SRS.', 'error'); }
            };

            const exportDecksOnly = () => {
                try {
                    const stats = JSON.parse(localStorage.getItem('mullerStats') || '{}');
                    const payload = {
                        type: 'muller_partial_v1',
                        part: 'decks',
                        exportDate: new Date().toISOString(),
                        difficultVocab: stats.difficultVocab || [],
                        normalVocab: stats.normalVocab || [],
                        difficultGrammar: stats.difficultGrammar || []
                    };
                    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `muller_mazos_${new Date().toISOString().slice(0, 19)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    window.__mullerToast && window.__mullerToast('Exportados mazos (difícil/normal/gramática).', 'success');
                } catch (err) { window.__mullerToast && window.__mullerToast('No se pudo exportar mazos.', 'error'); }
            };

            const showSyncHelp = () => {
                alert(
                    "🔄 Sincronización TOTAL gratis:\n\n" +
                    "1) En tu dispositivo actual pulsa Exportar.\n" +
                    "2) Sube el archivo .json a Google Drive.\n" +
                    "3) En otro dispositivo descarga ese .json.\n" +
                    "4) Pulsa Importar en la app.\n" +
                    "5) Recarga la página.\n\n" +
                    "Esto copia TODO el estado guardado de la aplicación."
                );
            };

            React.useEffect(() => {
                const onImport = () => {
                    const el = document.getElementById('muller-backup-file-input');
                    if (el) el.click();
                };
                const onSrs = () => exportSrsOnly();
                const onDecks = () => exportDecksOnly();
                const onHelp = () => showSyncHelp();
                const onMic = () => requestMicPermission();
                window.addEventListener('muller-open-backup-import', onImport);
                window.addEventListener('muller-export-srs-only', onSrs);
                window.addEventListener('muller-export-decks-only', onDecks);
                window.addEventListener('muller-show-sync-help', onHelp);
                window.addEventListener('muller-request-mic', onMic);
                return () => {
                    window.removeEventListener('muller-open-backup-import', onImport);
                    window.removeEventListener('muller-export-srs-only', onSrs);
                    window.removeEventListener('muller-export-decks-only', onDecks);
                    window.removeEventListener('muller-show-sync-help', onHelp);
                    window.removeEventListener('muller-request-mic', onMic);
                };
            }, [exportDecksOnly, exportSrsOnly]);

            React.useEffect(() => {
                let enable = false;
                try { enable = localStorage.getItem(MULLER_MIC_PERMISSION_PREF_KEY) !== '0'; } catch (e) {}
                if (!enable) return undefined;
                const t = window.setTimeout(() => { requestMicPermission(); }, 600);
                return () => window.clearTimeout(t);
            }, []);

            return (
                <>
                    <input id="muller-backup-file-input" type="file" accept=".json" onChange={importData} className="hidden" />
                </>
            );
        }

      const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <MullerErrorBoundary>
                <>
                    <App />
                    <FloatingButtons />
                    <AdvancedPracticePanelFinal />
                </>
            </MullerErrorBoundary>
        );
// ========== MÓDULO COMPLETO Y DEFINITIVO (4 PESTAÑAS + AUDIOLIBRO REAL) ==========
// No modifica nada del código original, solo añade funcionalidad.

// -------------------- DATOS DE RESPALDO --------------------
const DEFAULT_PLURALS = [
    { singular: "der Tisch", plural: "die Tische", regla: "+e" },
    { singular: "die Lampe", plural: "die Lampen", regla: "+n" },
    { singular: "das Buch", plural: "die Bücher", regla: "¨+er" }
];
const DEFAULT_VERBPREP = [
    { verbo: "warten", preposicion: "auf", ejemplo: "Ich warte auf den Bus." },
    { verbo: "sich interessieren", preposicion: "für", ejemplo: "Ich interessiere mich für Kunst." },
    { verbo: "denken", preposicion: "an", ejemplo: "Ich denke an dich." }
];
const DEFAULT_PREPOSITIONS = [
    { preposicion: "aus", caso: "Dativ", ejemplo: "Ich komme aus Spanien." },
    { preposicion: "für", caso: "Akkusativ", ejemplo: "Das Geschenk ist für dich." },
    { preposicion: "in", caso: "Wechsel", ejemplo: "Ich bin in der Stadt (Dativ) / Ich gehe in die Stadt (Akkusativ)." }
];

// -------------------- EXTRACTORES (guardan en localStorage) --------------------
function extractPluralsFromGuion(guionData, scriptTitle) {
    if (!guionData || !Array.isArray(guionData)) return;
    let existing = JSON.parse(localStorage.getItem('muller_extracted_plurals') || '[]');
    guionData.forEach(scene => {
        const text = scene.text;
        const matches = text.match(/\bdie\s+([A-ZÄÖÜ][a-zäöüß]+(?:e|er|en|n|s)?)\b/g) || [];
        matches.forEach(m => {
            const plural = m.replace('die ', '');
            let singular = plural.replace(/[äöü]/g, c => ({'ä':'a','ö':'o','ü':'u'}[c]));
            singular = singular.replace(/(e|er|n|en|s)$/, '');
            if (singular && !existing.find(p => p.plural === plural)) {
                existing.push({ singular, plural, example: text, scriptTitle, regla: 'extraído' });
            }
        });
    });
    localStorage.setItem('muller_extracted_plurals', JSON.stringify(existing));
}

function extractVerbPrepsFromGuion(guionData, scriptTitle) {
    let existing = JSON.parse(localStorage.getItem('muller_extracted_verbprep') || '[]');
    const patterns = DEFAULT_VERBPREP.map(v => ({ verbo: v.verbo, prep: v.preposicion }));
    guionData.forEach(scene => {
        const text = scene.text;
        patterns.forEach(p => {
            if (text.includes(p.verbo) && text.includes(p.prep)) {
                if (!existing.find(v => v.verbo === p.verbo)) {
                    existing.push({ ...p, ejemplo: text, scriptTitle });
                }
            }
        });
    });
    localStorage.setItem('muller_extracted_verbprep', JSON.stringify(existing));
}

function extractPrepositionsFromGuion(guionData, scriptTitle) {
    let existing = JSON.parse(localStorage.getItem('muller_extracted_prepositions') || '[]');
    guionData.forEach(scene => {
        const text = scene.text;
        DEFAULT_PREPOSITIONS.forEach(p => {
            if (text.includes(p.preposicion)) {
                if (!existing.find(pr => pr.preposicion === p.preposicion)) {
                    existing.push({ ...p, example: text, scriptTitle });
                }
            }
        });
    });
    localStorage.setItem('muller_extracted_prepositions', JSON.stringify(existing));
}

function extractArticlesFromGuionFinal(guionData, scriptTitle) {
    if (!guionData || !Array.isArray(guionData)) return;
    const corrections = JSON.parse(localStorage.getItem('muller_article_corrections') || '{}');
    let existing = JSON.parse(localStorage.getItem('muller_extracted_articles') || '[]');
    const regex = /\b(Der|Die|Das|Ein|Eine)\s+([A-ZÄÖÜ][a-zäöüß]+)\s+(ist|sind|hat|haben|kann|muss|will|möchte|kommt|geht|steht|liegt|sitzt|arbeitet|spricht|denkt|findet|glaubt|weiß|sieht|hört|fährt|läuft|bringt|nimmt|gibt|hilft|trifft|schläft|wäscht|trägt|verliert|schreibt|liest|kennt|nennt)\b/gi;
    guionData.forEach(scene => {
        const text = scene.text || '';
        let match;
        while ((match = regex.exec(text)) !== null) {
            const articleRaw = match[1].toLowerCase();
            const noun = match[2];
            let finalArticle = corrections[noun];
            if (!finalArticle) {
                const found = existing.find(item => item.word === noun);
                if (found) finalArticle = found.article;
            }
            if (!finalArticle) {
                if (noun.toLowerCase().endsWith('ung') || noun.toLowerCase().endsWith('heit') || noun.toLowerCase().endsWith('keit')) finalArticle = 'die';
                else if (noun.toLowerCase().endsWith('chen') || noun.toLowerCase().endsWith('lein')) finalArticle = 'das';
                else if (noun.toLowerCase().endsWith('er') || noun.toLowerCase().endsWith('ling')) finalArticle = 'der';
                else finalArticle = articleRaw === 'ein' ? 'der' : articleRaw === 'eine' ? 'die' : articleRaw;
            }
            if (finalArticle && noun.length > 1 && !existing.find(item => item.word === noun)) {
                existing.push({
                    word: noun, article: finalArticle,
                    examples: [text], translation: scene.translation || '',
                    scriptTitle, dateAdded: new Date().toISOString(),
                    inferred: !corrections[noun]
                });
            }
        }
    });
    localStorage.setItem('muller_extracted_articles', JSON.stringify(existing));
}



// ============================================================================
// 📁 SISTEMA DE ENTRENAMIENTO AVANZADO - LOGICA MÜLLER (SRS + MEMORIA)
// ============================================================================

const ADVANCED_PROGRESS_KEY = 'muller_advanced_progress';
const DAILY_ACTIVITY_KEY = 'muller_daily_activity';
const DAILY_GOAL_DEFAULT = 30;

function getAdvancedProgress() {
    try {
        return JSON.parse(localStorage.getItem(ADVANCED_PROGRESS_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

function saveAdvancedProgress(progress) {
    localStorage.setItem(ADVANCED_PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event('advancedProgressUpdated'));
    runAchievementsCheck();
}

function getTodayISODate() {
    return new Date().toISOString().slice(0, 10);
}

function getDailyActivity() {
    try {
        const parsed = JSON.parse(localStorage.getItem(DAILY_ACTIVITY_KEY) || '{}');
        return {
            dailyGoal: parsed.dailyGoal || DAILY_GOAL_DEFAULT,
            days: parsed.days || {}
        };
    } catch (e) {
        return { dailyGoal: DAILY_GOAL_DEFAULT, days: {} };
    }
}

function saveDailyActivity(activity) {
    localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(activity));
    window.dispatchEvent(new Event('advancedProgressUpdated'));
    runAchievementsCheck();
}

const ACHIEVEMENTS_KEY = 'muller_achievements';

const ACHIEVEMENT_DEFS = [
    { id: 'telc_first', icon: '📌', title: 'Erste Schritte', desc: '10 intentos en entrenamiento avanzado', test: (d) => d.totalAttempts >= 10 },
    { id: 'telc_steady', icon: '💪', title: 'Konstant', desc: '50 intentos acumulados', test: (d) => d.totalAttempts >= 50 },
    { id: 'telc_marathon', icon: '🏃', title: 'Ausdauer', desc: '200 intentos acumulados', test: (d) => d.totalAttempts >= 200 },
    { id: 'telc_daily', icon: '✅', title: 'Tagesziel', desc: 'Completaste el objetivo diario', test: (d) => d.todayAttempts >= d.dailyGoal && d.dailyGoal > 0 },
    { id: 'telc_streak3', icon: '🔥', title: 'Serie 3', desc: 'Racha de 3 días seguidos', test: (d) => d.streakDays >= 3 },
    { id: 'telc_streak7', icon: '🔥', title: 'Serie 7', desc: 'Racha de 7 días seguidos', test: (d) => d.streakDays >= 7 },
    { id: 'telc_streak30', icon: '🏆', title: 'Serie 30', desc: 'Racha de 30 días seguidos', test: (d) => d.streakDays >= 30 },
    { id: 'telc_precision', icon: '🎯', title: 'Präzision', desc: '≥85% precisión con ≥40 intentos', test: (d) => d.totalAttempts >= 40 && d.accuracy >= 85 },
    { id: 'telc_three_pillars', icon: '⚡', title: 'Drei Säulen', desc: 'Has practicado Artículos, Verbos+Prep y Preposiciones', test: (d) => d.art.total > 0 && d.verb.total > 0 && d.prep.total > 0 },
    { id: 'telc_weak_zero', icon: '🛡️', title: 'Schwächen im Griff', desc: '0 tarjetas débiles con ≥80 intentos', test: (d) => d.totalAttempts >= 80 && d.weak === 0 }
];

function getAchievementsUnlocked() {
    try {
        return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

function runAchievementsCheck() {
    const dash = getAdvancedDashboard();
    const unlocked = { ...getAchievementsUnlocked() };
    let changed = false;
    ACHIEVEMENT_DEFS.forEach((def) => {
        if (!unlocked[def.id] && def.test(dash)) {
            unlocked[def.id] = new Date().toISOString();
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
        window.dispatchEvent(new Event('achievementsUpdated'));
    }
}

function setDailyGoalCount(n) {
    const activity = getDailyActivity();
    activity.dailyGoal = Math.max(5, Math.min(200, Math.round(Number(n))));
    saveDailyActivity(activity);
}

function registerDailyAttempt() {
    const activity = getDailyActivity();
    const today = getTodayISODate();
    const todayStats = activity.days[today] || { attempts: 0 };
    activity.days[today] = { attempts: todayStats.attempts + 1 };
    saveDailyActivity(activity);
}

function calculateStreak(daysMap) {
    let streak = 0;
    const cursor = new Date();
    while (true) {
        const dateKey = cursor.toISOString().slice(0, 10);
        const count = daysMap[dateKey]?.attempts || 0;
        if (count <= 0) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

function getCardTip(type, item) {
    if (type === 'articulos') {
        const fullWord = (item.de || '').toLowerCase();
        const noun = fullWord.split(' ').slice(1).join(' ');
        if (noun.endsWith('ung') || noun.endsWith('heit') || noun.endsWith('keit') || noun.endsWith('schaft')) {
            return "Truco: muchas palabras en -ung/-heit/-keit/-schaft son DIE.";
        }
        if (noun.endsWith('chen') || noun.endsWith('lein')) {
            return "Truco: diminutivos en -chen/-lein casi siempre son DAS.";
        }
        if (noun.endsWith('er') || noun.endsWith('ling') || noun.endsWith('ismus')) {
            return "Truco: muchos sustantivos en -er/-ling/-ismus son DER.";
        }
        return "Truco: aprende cada palabra junto a su artículo (DER/DIE/DAS) como un bloque. En TELC, el género marca concordancia en la frase entera.";
    }
    const prep = (item.answer || '').toLowerCase();
    const tips = {
        'für': "'Für' rige Akkusativ (objetivo/duración). Muy frecuente en redacción y cloze TELC.",
        'mit': "'Mit' + Dativ: compañía/medio. Error típico: confundir con Akkusativ.",
        'auf': "En verbos fijos, 'auf' suele Akk. (objetivo/respuesta). Memoriza la colocación completa.",
        'bei': "'Bei' + Dativ: lugar abstracto/situación (bei der Arbeit).",
        'nach': "'Nach' + Dativ: dirección con nombres de ciudad/país; tiempo después de un hecho.",
        'von': "'Von' + Dativ: origen/partitivo; en TELC aparece mucho en textos informativos."
    };
    const base = item.trick || item.tipp || tips[prep] || "Fija verbo + preposición + caso como una unidad; en el examen no hay tiempo para deducirlo.";
    return base + " (TELC: prioriza colocaciones frecuentes en B1/B2.)";
}

/** Si no pasas maxItems, se usan todas las tarjetas (sin tope 120). El examen mixto pasa un límite explícito (p. ej. 55). */
function buildAdaptiveQueue(items, progress, getId, maxItems) {
    const weighted = items.map((item) => {
        const id = getId(item);
        const stats = progress[id] || {};
        const attempts = stats.attempts || 0;
        const errors = stats.errors || 0;
        const difficult = stats.difficult || 0;
        const easy = stats.easy || 0;
        const consecutiveErrors = stats.consecutiveErrors || 0;
        const lastSeenAt = stats.lastSeenAt ? new Date(stats.lastSeenAt).getTime() : 0;
        const hoursSinceSeen = lastSeenAt ? Math.max(0, (Date.now() - lastSeenAt) / (1000 * 60 * 60)) : 72;
        const recencyBoost = Math.min(3, hoursSinceSeen / 24);
        const score = attempts === 0
            ? 5
            : 2 + (errors * 2.2) + (difficult * 1.4) + (consecutiveErrors * 1.8) + recencyBoost - (easy * 0.7);
        return { item, score: Math.max(0.5, score + Math.random()) };
    });
    weighted.sort((a, b) => b.score - a.score);
    const cap = maxItems != null ? Math.min(maxItems, weighted.length) : weighted.length;
    return weighted.slice(0, cap).map(entry => entry.item);
}

function getProgressCounts(progress, prefix) {
    const entries = Object.entries(progress).filter(([key]) => key.startsWith(prefix + '::'));
    return entries.reduce((acc, [, stats]) => {
        acc.total += 1;
        acc.attempts += stats.attempts || 0;
        acc.errors += stats.errors || 0;
        acc.easy += stats.easy || 0;
        acc.normal += stats.normal || 0;
        acc.difficult += stats.difficult || 0;
        if ((stats.errors || 0) > (stats.correct || 0)) acc.weak += 1;
        return acc;
    }, { total: 0, attempts: 0, errors: 0, easy: 0, normal: 0, difficult: 0, weak: 0 });
}

function filterQueueByMode(items, progress, getId, mode) {
    if (mode === 'smart') return items;
    return items.filter((item) => {
        const stats = progress[getId(item)] || {};
        const errors = stats.errors || 0;
        const correct = stats.correct || 0;
        const difficult = stats.difficult || 0;
        const attempts = stats.attempts || 0;
        if (mode === 'failed') return errors > 0;
        if (mode === 'difficult') return difficult > 0 || errors > 0;
        if (mode === 'weak') return attempts >= 3 && (errors / Math.max(1, errors + correct)) >= 0.4;
        if (mode === 'new') return attempts === 0;
        return true;
    });
}

/** Une entradas con el mismo `de` y combina niveles. Acepta `level` (legacy) o `levels` (array). */
function normalizeArticulosDataset(raw) {
    if (!Array.isArray(raw)) return [];
    const byDe = new Map();
    for (const item of raw) {
        const de = (item.de || '').trim();
        if (!de) continue;
        const fromArr = Array.isArray(item.levels) ? item.levels.map((x) => String(x).trim()).filter(Boolean) : [];
        const fromSingle = item.level != null && String(item.level).trim() !== '' ? [String(item.level).trim()] : [];
        const combined = [...new Set([...fromArr, ...fromSingle])];
        const prev = byDe.get(de);
        if (!prev) {
            byDe.set(de, { ...item, de, levels: combined });
        } else {
            const mergedLv = [...new Set([...(prev.levels || []), ...combined])];
            byDe.set(de, { ...prev, ...item, de, levels: mergedLv });
        }
    }
    return Array.from(byDe.values()).map((it) => {
        if (!it.levels || it.levels.length === 0) {
            return { ...it, levels: ['A1'] };
        }
        return it;
    });
}

/** ¿La tarjeta cuenta para el mazo A1/A2/B1… o MIXTO? */
function articleItemMatchesLevel(item, selectedMode) {
    if (selectedMode === 'MIXTO') return true;
    const lv = Array.isArray(item.levels) && item.levels.length ? item.levels : (item.level ? [item.level] : []);
    return lv.includes(selectedMode);
}

function getAdvancedDashboard() {
    const progress = getAdvancedProgress();
    const daily = getDailyActivity();
    const today = getTodayISODate();
    const todayAttempts = daily.days[today]?.attempts || 0;
    const dailyGoal = daily.dailyGoal || DAILY_GOAL_DEFAULT;
    const art = getProgressCounts(progress, 'articulos');
    const verb = getProgressCounts(progress, 'verbos');
    const prep = getProgressCounts(progress, 'preposiciones');
    const totalAttempts = art.attempts + verb.attempts + prep.attempts;
    const totalErrors = art.errors + verb.errors + prep.errors;
    const accuracy = totalAttempts > 0 ? Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100) : 0;
    return {
        art, verb, prep, totalAttempts, totalErrors, accuracy,
        weak: art.weak + verb.weak + prep.weak,
        todayAttempts,
        dailyGoal,
        dailyProgress: Math.min(100, Math.round((todayAttempts / Math.max(1, dailyGoal)) * 100)),
        streakDays: calculateStreak(daily.days)
    };
}

function useTelcExamClock(examCtx) {
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
        if (!examCtx) return undefined;
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [examCtx]);
}

function TelcExamHud({ examCtx, onUseTranslationHint, answered, translationVisible }) {
    useTelcExamClock(examCtx);
    if (!examCtx) return null;
    const now = Date.now();
    const totalMs = Math.max(1, examCtx.durationMin * 60 * 1000);
    const left = Math.max(0, examCtx.deadline - now);
    const pct = Math.min(100, (left / totalMs) * 100);
    const softOver = left <= 0;
    const urgent = !softOver && left < 5 * 60 * 1000;
    const hintsLeft = Math.max(0, examCtx.hintsTotal - examCtx.hintsUsed);
    const mm = Math.floor(left / 60000);
    const ss = Math.floor((left % 60000) / 1000);
    const canHint = hintsLeft > 0 && !answered && !translationVisible;
    return (
        <div className={`mb-4 rounded-xl border p-3 text-left transition-all ${urgent ? 'border-amber-500/70 bg-amber-950/25 shadow-[0_0_20px_rgba(245,158,11,0.12)]' : softOver ? 'border-rose-600/55 bg-rose-950/35' : 'border-slate-600/45 bg-black/35'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <p className={`text-[11px] font-bold uppercase tracking-widest ${softOver ? 'text-rose-300' : urgent ? 'text-amber-300' : 'text-slate-400'}`}>
                    {softOver ? 'Tiempo guía agotado — puedes seguir' : urgent ? 'Últimos minutos (ritmo TELC)' : 'Modo examen TELC'}
                </p>
                <span className="font-mono text-sm text-white tabular-nums">{softOver ? '0:00' : `${mm}:${ss < 10 ? '0' : ''}${ss}`}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${softOver ? 'bg-rose-500/90' : urgent ? 'bg-amber-500' : 'bg-cyan-500/90'}`} style={{ width: `${softOver ? 100 : pct}%` }} />
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-between">
                <p className="text-xs text-slate-400">Pistas para traducción: <span className="text-cyan-300 font-bold">{hintsLeft}</span> / {examCtx.hintsTotal}</p>
                <button type="button" onClick={() => canHint && onUseTranslationHint && onUseTranslationHint()} disabled={!canHint}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${!canHint ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed' : 'border-cyan-600/60 text-cyan-200 hover:bg-cyan-900/40'}`}>
                    −1 pista: mostrar traducción
                </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-snug">El cronómetro es orientativo (estilo TELC): no corta la sesión. Usa las pistas con moderación, como en un examen real.</p>
        </div>
    );
}

function ArticlePracticeFinal({ onBack, examCtx, setExamCtx, examAutoLevel }) {
    const [mode, setMode] = React.useState(null);
    const [queue, setQueue] = React.useState([]);
    const [feedback, setFeedback] = React.useState(null);
    const [loading, setLoading] = React.useState(() => !!(examCtx && examAutoLevel));
    const [progressMap, setProgressMap] = React.useState(() => getAdvancedProgress());
    const [queueFilter, setQueueFilter] = React.useState('smart');
    const [showTranslation, setShowTranslation] = React.useState(false);
    const examLoadRef = React.useRef(false);

    // 🧠 Persistencia de palabras dominadas (Cerebro de Oro)
    const [masteredArticles, setMasteredArticles] = React.useState(() => {
        const saved = localStorage.getItem('muller_mastered_articles');
        return saved ? JSON.parse(saved) : [];
    });

    const loadData = (selectedMode) => {
        setMode(selectedMode);
        setLoading(true);
        
        const processData = (rawData) => {
            const data = Array.isArray(rawData) ? normalizeArticulosDataset(rawData) : rawData;
            let filtered = data;
            if (selectedMode !== 'MIXTO' && selectedMode !== 'historia') {
                filtered = data.filter((item) => articleItemMatchesLevel(item, selectedMode));
            }
            // Müller-Filter: Eliminamos lo que ya te sabes para siempre
            const finalQueue = filtered.filter(item => !masteredArticles.includes(item.de));
            
            if (finalQueue.length === 0) {
                alert(`¡Increíble! Ya dominas todo el mazo ${selectedMode}. 🏆`);
                if (examCtx) onBack();
                else setMode(null);
            } else {
                const getId = (item) => `articulos::${item.de}`;
                const adaptive = buildAdaptiveQueue(finalQueue, progressMap, getId);
                const filtered = filterQueueByMode(adaptive, progressMap, getId, queueFilter);
                setQueue(filtered.length > 0 ? filtered : adaptive);
            }
            setLoading(false);
        };

        if (selectedMode === 'historia') {
            const allVocab = window.__DEFAULT_GUION__?.flatMap(s => s.vocab || []) || [];
            const nouns = allVocab.filter(v => /^(der|die|das)\s/i.test(v.de));
            const uniqueNouns = [...new Map(nouns.map(item => [item.de, item])).values()];
            processData(uniqueNouns);
        } else {
            const GIST_URL = "https://gist.githubusercontent.com/djplaza1/a53fde18c901a7f2d86977174b5b9a72/raw/articulos.json?nocache=" + new Date().getTime();
            fetch(GIST_URL).then(res => res.json()).then(processData).catch(() => {
                alert("Error de conexión con la base de datos Müller.");
                if (examCtx) onBack();
                else {
                    setMode(null);
                    setLoading(false);
                }
            });
        }
    };

    React.useEffect(() => {
        if (examCtx && examAutoLevel && !examLoadRef.current) {
            examLoadRef.current = true;
            loadData(examAutoLevel);
        }
    }, [examCtx, examAutoLevel]);

    React.useEffect(() => {
        const id = queue[0]?.de;
        if (id) setShowTranslation(false);
    }, [queue[0]?.de]);

    const handleTranslationHint = () => {
        if (!examCtx || !setExamCtx) return;
        const left = examCtx.hintsTotal - examCtx.hintsUsed;
        if (left <= 0) return;
        setExamCtx((prev) => (prev ? { ...prev, hintsUsed: (prev.hintsUsed || 0) + 1 } : prev));
        setShowTranslation(true);
    };

    // 🌟 Acción: "Ya me la sé" (Descartar para siempre)
    const handleMastered = () => {
        const currentWord = queue[0].de;
        const newMastered = [...masteredArticles, currentWord];
        setMasteredArticles(newMastered);
        localStorage.setItem('muller_mastered_articles', JSON.stringify(newMastered));
        setQueue(prev => prev.slice(1));
        setFeedback(null);
    };

    // 🔄 Acción: Siguiente / Reintento
    const handleNextWord = () => {
        if (feedback.type === 'success') {
            setQueue(prev => prev.slice(1)); // Si acertó, se va de la sesión
        } else {
            // PELIGRO: Si falló, al final de la cola (Spaced Retrieval)
            setQueue(prev => [...prev.slice(1), prev[0]]);
        }
        setFeedback(null);
    };

    const registerTrainingResult = (difficulty) => {
        if (!feedback || queue.length === 0) return;
        registerDailyAttempt();
        const current = feedback.currentCard || queue[0];
        const id = `articulos::${current.de}`;
        const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
        const next = {
            ...prev,
            attempts: prev.attempts + 1,
            correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
            errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
            easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
            normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
            difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
            consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
            lastSeenAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const merged = { ...progressMap, [id]: next };
        setProgressMap(merged);
        saveAdvancedProgress(merged);
        handleNextWord();
    };

    const check = (guess) => {
        if (queue.length === 0) return;
        const current = queue[0];
        const correct = current.de.split(' ')[0].toLowerCase();

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(current.de);
        utterance.lang = 'de-DE';
        window.__mullerApplyPreferredDeVoice(utterance);
        window.speechSynthesis.speak(utterance);

        if (guess === correct) {
            setFeedback({ type: 'success', text: `¡Richtig! 🟢 ${current.de}`, tip: getCardTip('articulos', current), currentCard: current });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
        } else {
            setFeedback({ type: 'error', text: `⚠️ FALSCH! Era: ${current.de}`, tip: getCardTip('articulos', current), currentCard: current });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
        }
    };

    if (!mode) {
        if (examCtx && examAutoLevel) {
            return <div className="p-10"><div className="muller-skeleton h-5 w-56 rounded mb-4 mx-auto" /><div className="muller-skeleton h-4 w-72 rounded mx-auto" /></div>;
        }
        return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full max-w-4xl mx-auto animate-in fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 bg-gray-800 p-2 rounded text-white hover:bg-gray-700">⬅ Volver</button>
            <h2 className="text-3xl font-bold mb-2 text-blue-300">Artículos Müller</h2>
            <p className="text-gray-400 mb-8 font-bold">⭐ {masteredArticles.length} palabras en tu "Memoria de Oro"</p>
            <div className="bg-black/30 border border-blue-800/50 rounded-xl p-3 mb-5 w-full text-sm text-gray-200">
                {(() => {
                    const c = getProgressCounts(progressMap, 'articulos');
                    return <p>📊 Intentos: <b>{c.attempts}</b> · Fallos: <b>{c.errors}</b> · Fácil: <b>{c.easy}</b> · Normal: <b>{c.normal}</b> · Difícil: <b>{c.difficult}</b> · Problemáticas: <b>{c.weak}</b></p>;
                })()}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full mb-6">
                <button onClick={() => setQueueFilter('smart')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'smart' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Mezcla inteligente</button>
                <button onClick={() => setQueueFilter('failed')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'failed' ? 'bg-red-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo falladas</button>
                <button onClick={() => setQueueFilter('difficult')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'difficult' ? 'bg-rose-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo difíciles</button>
                <button onClick={() => setQueueFilter('weak')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'weak' ? 'bg-fuchsia-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo débiles</button>
                <button onClick={() => setQueueFilter('new')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'new' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-gray-300'}`}>Solo nuevas</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <button onClick={() => loadData('historia')} className="col-span-2 md:col-span-3 bg-purple-900 border-2 border-purple-500 p-6 rounded-xl font-bold text-xl hover:bg-purple-800 transition">📖 Historia Actual</button>
                {['A1', 'A2', 'B1', 'B2', 'C1', 'MIXTO'].map(lvl => (
                    <button key={lvl} onClick={() => loadData(lvl)} className="bg-slate-800 border-b-4 border-blue-500 p-6 rounded-xl font-bold text-lg hover:bg-slate-700 transition">{lvl}</button>
                ))}
            </div>
        </div>
        );
    }

    if (loading) return <div className="p-10"><div className="muller-skeleton h-6 w-64 rounded mb-4" /><div className="muller-skeleton h-36 w-full max-w-xl rounded-2xl" /></div>;
    if (queue.length === 0) return <div className="p-20 text-center"><h2 className="text-2xl text-green-400">¡Mazo completado! 🏆</h2><button onClick={() => setMode(null)} className="mt-4 bg-gray-800 p-2 rounded text-white">Elegir otro</button></div>;

    const wordWithoutArticle = queue[0].de.split(' ').slice(1).join(' ');
    const examHideEs = !!(examCtx && !showTranslation && !feedback);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full relative">
            {examCtx && <button type="button" onClick={onBack} className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-800/90 p-2 rounded-lg text-gray-300 text-sm hover:bg-slate-700 z-10">⬅ Salir del examen</button>}
            <div className={`bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border ${examCtx ? 'border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]' : 'border-slate-700'}`}>
                {examCtx && (
                    <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                )}
                <h3 className="text-5xl font-black text-white mb-2">{wordWithoutArticle}</h3>
                {examHideEs ? (
                    <p className="text-slate-500 mb-8 text-sm italic border border-dashed border-slate-600 rounded-lg py-6 px-3">Traducción oculta — usa una pista arriba si la necesitas (como en examen).</p>
                ) : (
                    <p className="text-gray-400 mb-8 text-xl italic">{queue[0].es}</p>
                )}
                
                {!feedback ? (
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => check('der')} className="bg-blue-600 py-6 rounded-xl font-bold text-xl transition">🔵 DER</button>
                        <button onClick={() => check('die')} className="bg-red-600 py-6 rounded-xl font-bold text-xl transition">🔴 DIE</button>
                        <button onClick={() => check('das')} className="bg-green-600 py-6 rounded-xl font-bold text-xl transition">🟢 DAS</button>
                    </div>
                ) : (
                    <div className="animate-in zoom-in">
                        <div className={`p-6 rounded-xl font-black text-2xl mb-6 ${feedback.type === 'error' ? 'bg-red-900 border-2 border-red-500 text-red-100' : 'bg-green-900 border-2 border-green-500 text-green-100'}`}>
                            {feedback.text}
                        </div>
                        <p className="text-gray-400 mb-4 text-lg italic border border-slate-600/50 rounded-lg py-2 px-3 bg-black/20">ES: {(feedback.currentCard || queue[0]).es}</p>
                        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/30 text-left mb-5">
                            <p className="text-cyan-300 font-bold text-sm uppercase mb-1">💡 Truco para recordarlo</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                                <button onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                                <button onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 hover:bg-rose-600 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                            </div>
                            {!examCtx && (
                                <button onClick={handleMastered} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold border-b-4 border-emerald-800 transition">🌟 ¡Ya me la sé para siempre!</button>
                            )}
                            <button onClick={handleNextWord} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition">
                                {feedback.type === 'error' ? 'Reintentar luego ➔' : 'Siguiente ➔'}
                            </button>
                        </div>
                    </div>
                )}
                <p className="text-gray-500 text-xs mt-6">Restantes en esta sesión: {queue.length}</p>
            </div>
        </div>
    );
}

function CloudPracticeFinal({ onBack, type, examCtx, setExamCtx }) {
    const [queue, setQueue] = React.useState([]);
    const [feedback, setFeedback] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [progressMap, setProgressMap] = React.useState(() => getAdvancedProgress());
    const [queueFilter, setQueueFilter] = React.useState('smart');
    const [showTranslation, setShowTranslation] = React.useState(false);
    const effectiveFilter = examCtx ? 'smart' : queueFilter;

    React.useEffect(() => {
        const id = queue[0]?.de + (queue[0]?.answer || '');
        if (id) setShowTranslation(false);
    }, [queue[0]?.de, queue[0]?.answer]);

    const handleTranslationHint = () => {
        if (!examCtx || !setExamCtx) return;
        const left = examCtx.hintsTotal - examCtx.hintsUsed;
        if (left <= 0) return;
        setExamCtx((prev) => (prev ? { ...prev, hintsUsed: (prev.hintsUsed || 0) + 1 } : prev));
        setShowTranslation(true);
    };

    React.useEffect(() => {
        const URL_VERBOS = "https://gist.githubusercontent.com/djplaza1/142845d2f0fb5a0b2b86e28fbf308809/raw/verbos_con_preposiciones.json";
        const URL_PREPOSICIONES = "https://gist.githubusercontent.com/djplaza1/4f44a8b19a8aa2d451e183859e3f764f/raw/preposiciones.json";
        const GIST_URL = type === 'verbos' ? URL_VERBOS : URL_PREPOSICIONES;
        
        setLoading(true);
        fetch(GIST_URL + "?nocache=" + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                const queueType = type === 'verbos' ? 'verbos' : 'preposiciones';
                const getId = (item) => `${queueType}::${item.de}::${item.answer}`;
                const adaptive = buildAdaptiveQueue(data, progressMap, getId);
                const filtered = filterQueueByMode(adaptive, progressMap, getId, effectiveFilter);
                setQueue(filtered.length > 0 ? filtered : adaptive);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [type, effectiveFilter]);

    const check = (guess) => {
        if (queue.length === 0) return;
        const currentItem = queue[0];
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.de.replace('___', currentItem.answer));
        utterance.lang = 'de-DE';
        window.__mullerApplyPreferredDeVoice(utterance);
        window.speechSynthesis.speak(utterance);

        if (guess === currentItem.answer) {
            setFeedback({ type: 'success', text: `¡Richtig! Es '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(type, currentItem) });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
        } else {
            setFeedback({ type: 'error', text: `⚠️ FALSCH: Era '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(type, currentItem) });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
        }
    };

    const registerTrainingResult = (difficulty) => {
        if (!feedback || queue.length === 0) return;
        registerDailyAttempt();
        const current = feedback.currentCard || queue[0];
        const queueType = type === 'verbos' ? 'verbos' : 'preposiciones';
        const id = `${queueType}::${current.de}::${current.answer}`;
        const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
        const next = {
            ...prev,
            attempts: prev.attempts + 1,
            correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
            errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
            easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
            normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
            difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
            consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
            lastSeenAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const merged = { ...progressMap, [id]: next };
        setProgressMap(merged);
        saveAdvancedProgress(merged);
        handleContinue();
    };

    const handleContinue = () => {
        if (feedback.type === 'success') {
            setQueue(prev => prev.slice(1));
        } else {
            setQueue(prev => [...prev.slice(1), prev[0]]); // Los errores vuelven al final
        }
        setFeedback(null);
    };

    if (loading) return <div className="p-10"><div className="muller-skeleton h-5 w-64 rounded mb-4 mx-auto" /><div className="muller-skeleton h-36 w-full max-w-2xl rounded-2xl mx-auto" /></div>;
    if (queue.length === 0) return <div className="text-center p-20"><h2 className="text-3xl font-bold text-green-400">¡Mazo Completado! 🏆</h2><button onClick={onBack} className="mt-4 bg-gray-800 p-2 rounded text-white">Volver</button></div>;

    const current = queue[0];
    const options = type === 'verbos' 
        ? ['für', 'auf', 'an', 'von', 'über', 'mit', 'um', 'zu', 'vor', 'nach', 'in', 'bei', 'aus', 'durch', 'ohne', 'gegen']
        : ['an', 'auf', 'in', 'aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'durch', 'für', 'um', 'vor', 'über', 'unter', 'neben', 'zwischen', 'hinter', 'gegen', 'ohne'];
    const examHideEs = !!(examCtx && !showTranslation && !feedback);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full relative">
            <button type="button" onClick={onBack} className="absolute top-4 left-4 bg-gray-800 p-2 rounded text-gray-300 z-10">{examCtx ? '⬅ Salir del examen' : '⬅ Volver'}</button>
            <div className={`bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-4xl w-full border ${examCtx ? 'border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]' : 'border-slate-700'}`}>
                {examCtx && (
                    <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                )}
                <div className="bg-black/30 border border-purple-800/40 rounded-xl p-3 mb-4 text-xs text-gray-200 text-left">
                    {(() => {
                        const scope = type === 'verbos' ? 'verbos' : 'preposiciones';
                        const c = getProgressCounts(progressMap, scope);
                        return <p>📊 Intentos: <b>{c.attempts}</b> · Fallos: <b>{c.errors}</b> · Fácil: <b>{c.easy}</b> · Normal: <b>{c.normal}</b> · Difícil: <b>{c.difficult}</b> · Problemáticas: <b>{c.weak}</b></p>;
                    })()}
                </div>
                {!examCtx && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        <button type="button" onClick={() => setQueueFilter('smart')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'smart' ? 'bg-blue-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Mezcla inteligente</button>
                        <button type="button" onClick={() => setQueueFilter('failed')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'failed' ? 'bg-red-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo falladas</button>
                        <button type="button" onClick={() => setQueueFilter('difficult')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'difficult' ? 'bg-rose-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo difíciles</button>
                        <button type="button" onClick={() => setQueueFilter('weak')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'weak' ? 'bg-fuchsia-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo débiles</button>
                        <button type="button" onClick={() => setQueueFilter('new')} className={`p-2 rounded-lg text-xs font-bold ${queueFilter === 'new' ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-gray-200'}`}>Solo nuevas</button>
                    </div>
                )}
                {examCtx && <p className="text-[11px] text-slate-500 mb-3 text-left">Examen: mezcla inteligente fija (sin filtros).</p>}
                <p className="text-blue-400 font-bold mb-2 uppercase tracking-widest">{current.prepCase || '🟡 Wechsel'}</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{current.de.replace('___', '_____')}</h3>
                {examHideEs ? (
                    <p className="text-slate-500 mb-8 text-sm italic border border-dashed border-slate-600 rounded-lg py-6 px-3">Traducción oculta — usa una pista arriba si la necesitas.</p>
                ) : (
                    <p className="text-gray-400 mb-8 text-xl italic">{current.es}</p>
                )}
                
                {!feedback ? (
                    <div className="flex flex-wrap justify-center gap-2 max-h-[250px] overflow-y-auto p-2">
                        {options.map(p => (
                            <button key={p} type="button" onClick={() => check(p)} className="bg-gray-700 hover:bg-amber-600 py-2 px-3 rounded-lg font-bold text-sm text-white transition min-w-[70px]">
                                {p}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="animate-in zoom-in">
                        <div className={`p-4 rounded-xl font-bold text-xl mb-4 ${feedback.type === 'error' ? 'bg-red-900 border-red-500 border' : 'bg-green-900 border-green-500 border'}`}>
                            {feedback.text}
                        </div>
                        <p className="text-gray-400 mb-4 text-lg italic border border-slate-600/50 rounded-lg py-2 px-3 bg-black/20">ES: {(feedback.currentCard || current).es}</p>
                        <div className="bg-black/40 p-4 rounded-xl border border-amber-500/30 text-left mb-6">
                            <p className="text-amber-400 font-bold text-sm uppercase mb-1">💡 Müller-Tipp:</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <button type="button" onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                            <button type="button" onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                            <button type="button" onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 hover:bg-rose-600 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                        </div>
                        <button type="button" onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-xl transition">CONTINUAR ➔</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function TelcMixedExamFinal({ onBack, examCtx, setExamCtx }) {
    const [queue, setQueue] = React.useState([]);
    const [feedback, setFeedback] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [progressMap, setProgressMap] = React.useState(() => getAdvancedProgress());
    const [showTranslation, setShowTranslation] = React.useState(false);

    React.useEffect(() => {
        if (queue[0]) setShowTranslation(false);
    }, [queue[0]?.kind, queue[0]?.item?.de]);

    const handleTranslationHint = () => {
        if (!examCtx || !setExamCtx) return;
        const left = examCtx.hintsTotal - examCtx.hintsUsed;
        if (left <= 0) return;
        setExamCtx((prev) => (prev ? { ...prev, hintsUsed: (prev.hintsUsed || 0) + 1 } : prev));
        setShowTranslation(true);
    };

    React.useEffect(() => {
        const GIST_ART = 'https://gist.githubusercontent.com/djplaza1/a53fde18c901a7f2d86977174b5b9a72/raw/articulos.json';
        const URL_VERBOS = 'https://gist.githubusercontent.com/djplaza1/142845d2f0fb5a0b2b86e28fbf308809/raw/verbos_con_preposiciones.json';
        const URL_PREP = 'https://gist.githubusercontent.com/djplaza1/4f44a8b19a8aa2d451e183859e3f764f/raw/preposiciones.json';
        const nocache = '?nocache=' + Date.now();
        setLoading(true);
        Promise.all([
            fetch(GIST_ART + nocache).then((r) => r.json()),
            fetch(URL_VERBOS + nocache).then((r) => r.json()),
            fetch(URL_PREP + nocache).then((r) => r.json())
        ]).then(([artData, verbData, prepData]) => {
            const artNorm = normalizeArticulosDataset(artData);
            const artFiltered = artNorm.filter((item) => articleItemMatchesLevel(item, 'B1') || articleItemMatchesLevel(item, 'B2'));
            const getIdArt = (item) => `articulos::${item.de}`;
            const getIdV = (item) => `verbos::${item.de}::${item.answer}`;
            const getIdP = (item) => `preposiciones::${item.de}::${item.answer}`;
            const aQ = buildAdaptiveQueue(artFiltered, progressMap, getIdArt, 55);
            const vQ = buildAdaptiveQueue(verbData, progressMap, getIdV, 55);
            const pQ = buildAdaptiveQueue(prepData, progressMap, getIdP, 55);
            const fa = filterQueueByMode(aQ, progressMap, getIdArt, 'smart');
            const fv = filterQueueByMode(vQ, progressMap, getIdV, 'smart');
            const fp = filterQueueByMode(pQ, progressMap, getIdP, 'smart');
            const aa = fa.length > 0 ? fa : aQ;
            const vv = fv.length > 0 ? fv : vQ;
            const pp = fp.length > 0 ? fp : pQ;
            const mixed = [];
            let ia = 0;
            let iv = 0;
            let ip = 0;
            while (mixed.length < 45 && (ia < aa.length || iv < vv.length || ip < pp.length)) {
                if (ia < aa.length) mixed.push({ kind: 'articulos', item: aa[ia++] });
                if (mixed.length >= 45) break;
                if (iv < vv.length) mixed.push({ kind: 'verbos', item: vv[iv++] });
                if (mixed.length >= 45) break;
                if (ip < pp.length) mixed.push({ kind: 'preposiciones', item: pp[ip++] });
            }
            for (let x = mixed.length - 1; x > 0; x--) {
                const y = Math.floor(Math.random() * (x + 1));
                const t = mixed[x];
                mixed[x] = mixed[y];
                mixed[y] = t;
            }
            setQueue(mixed);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setQueue([]);
        });
    }, []);

    const handleContinue = () => {
        if (!feedback) return;
        if (feedback.type === 'success') {
            setQueue((prev) => prev.slice(1));
        } else {
            setQueue((prev) => [...prev.slice(1), prev[0]]);
        }
        setFeedback(null);
    };

    const registerTrainingResult = (difficulty) => {
        if (!feedback || queue.length === 0) return;
        registerDailyAttempt();
        const card = queue[0];
        const current = feedback.currentCard || card.item;
        if (card.kind === 'articulos') {
            const id = `articulos::${current.de}`;
            const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
            const next = {
                ...prev,
                attempts: prev.attempts + 1,
                correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
                errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
                easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
                normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
                difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
                consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
                lastSeenAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const merged = { ...progressMap, [id]: next };
            setProgressMap(merged);
            saveAdvancedProgress(merged);
        } else {
            const queueType = card.kind === 'verbos' ? 'verbos' : 'preposiciones';
            const id = `${queueType}::${current.de}::${current.answer}`;
            const prev = progressMap[id] || { attempts: 0, correct: 0, errors: 0, easy: 0, normal: 0, difficult: 0 };
            const next = {
                ...prev,
                attempts: prev.attempts + 1,
                correct: prev.correct + (feedback.type === 'success' ? 1 : 0),
                errors: prev.errors + (feedback.type === 'error' ? 1 : 0),
                easy: prev.easy + (difficulty === 'easy' ? 1 : 0),
                normal: prev.normal + (difficulty === 'normal' ? 1 : 0),
                difficult: prev.difficult + (difficulty === 'difficult' ? 1 : 0),
                consecutiveErrors: feedback.type === 'error' ? (prev.consecutiveErrors || 0) + 1 : 0,
                lastSeenAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const merged = { ...progressMap, [id]: next };
            setProgressMap(merged);
            saveAdvancedProgress(merged);
        }
        handleContinue();
    };

    const check = (guess) => {
        if (queue.length === 0 || !queue[0]) return;
        const card = queue[0];
        if (card.kind === 'articulos') {
            const current = card.item;
            const correct = current.de.split(' ')[0].toLowerCase();
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(current.de);
            utterance.lang = 'de-DE';
            window.__mullerApplyPreferredDeVoice(utterance);
            window.speechSynthesis.speak(utterance);
            if (guess === correct) {
                setFeedback({ type: 'success', text: `¡Richtig! 🟢 ${current.de}`, tip: getCardTip('articulos', current), currentCard: current, kind: 'articulos' });
                if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
            } else {
                setFeedback({ type: 'error', text: `⚠️ FALSCH! Era: ${current.de}`, tip: getCardTip('articulos', current), currentCard: current, kind: 'articulos' });
                if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
            }
            return;
        }
        const currentItem = card.item;
        const cloudType = card.kind === 'verbos' ? 'verbos' : 'preposiciones';
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentItem.de.replace('___', currentItem.answer));
        utterance.lang = 'de-DE';
        window.__mullerApplyPreferredDeVoice(utterance);
        window.speechSynthesis.speak(utterance);
        if (guess === currentItem.answer) {
            setFeedback({ type: 'success', text: `¡Richtig! Es '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(cloudType, currentItem), kind: card.kind });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(true);
        } else {
            setFeedback({ type: 'error', text: `⚠️ FALSCH: Era '${currentItem.answer}'`, currentCard: currentItem, tip: getCardTip(cloudType, currentItem), kind: card.kind });
            if (window.__mullerNotifyExerciseOutcome) window.__mullerNotifyExerciseOutcome(false);
        }
    };

    if (loading) return <div className="p-10"><div className="muller-skeleton h-5 w-64 rounded mb-4 mx-auto" /><div className="muller-skeleton h-36 w-full max-w-2xl rounded-2xl mx-auto" /></div>;
    if (queue.length === 0) return (
        <div className="text-center p-20">
            <h2 className="text-2xl font-bold text-amber-200 mb-4">No hay tarjetas para mezclar (revisa la conexión).</h2>
            <button type="button" onClick={onBack} className="bg-gray-800 p-2 rounded text-white">Volver</button>
        </div>
    );

    const card = queue[0];
    const current = card.item;
    const examHideEs = !!(examCtx && !showTranslation && !feedback);
    const optionsVerb = ['für', 'auf', 'an', 'von', 'über', 'mit', 'um', 'zu', 'vor', 'nach', 'in', 'bei', 'aus', 'durch', 'ohne', 'gegen'];
    const optionsPrep = ['an', 'auf', 'in', 'aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'durch', 'für', 'um', 'vor', 'über', 'unter', 'neben', 'zwischen', 'hinter', 'gegen', 'ohne'];
    const options = card.kind === 'verbos' ? optionsVerb : optionsPrep;

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full w-full relative">
            <button type="button" onClick={onBack} className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-800/90 p-2 rounded-lg text-gray-300 text-sm z-10">⬅ Salir del examen</button>
            <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-4xl w-full border border-amber-600/35 shadow-[0_0_40px_rgba(245,158,11,0.06)]">
                <TelcExamHud examCtx={examCtx} onUseTranslationHint={handleTranslationHint} answered={!!feedback} translationVisible={showTranslation} />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-left">Mezcla B1/B2 · {card.kind}</p>
                {card.kind === 'articulos' ? (
                    <>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{current.de.split(' ').slice(1).join(' ')}</h3>
                        {examHideEs ? (
                            <p className="text-slate-500 mb-6 text-sm italic border border-dashed border-slate-600 rounded-lg py-4 px-3">Traducción oculta — usa una pista arriba si la necesitas.</p>
                        ) : (
                            <p className="text-gray-400 mb-6 text-xl italic">{current.es}</p>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-sm">{current.prepCase || '🟡 Wechsel'}</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{current.de.replace('___', '_____')}</h3>
                        {examHideEs ? (
                            <p className="text-slate-500 mb-6 text-sm italic border border-dashed border-slate-600 rounded-lg py-4 px-3">Traducción oculta — usa una pista arriba si la necesitas.</p>
                        ) : (
                            <p className="text-gray-400 mb-6 text-xl italic">{current.es}</p>
                        )}
                    </>
                )}
                {!feedback ? (
                    card.kind === 'articulos' ? (
                        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                            <button type="button" onClick={() => check('der')} className="bg-blue-600 py-5 rounded-xl font-bold text-lg">DER</button>
                            <button type="button" onClick={() => check('die')} className="bg-red-600 py-5 rounded-xl font-bold text-lg">DIE</button>
                            <button type="button" onClick={() => check('das')} className="bg-green-600 py-5 rounded-xl font-bold text-lg">DAS</button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2 max-h-[220px] overflow-y-auto p-2">
                            {options.map((p) => (
                                <button key={p} type="button" onClick={() => check(p)} className="bg-gray-700 hover:bg-amber-600 py-2 px-3 rounded-lg font-bold text-sm text-white min-w-[68px]">{p}</button>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="animate-in zoom-in text-left">
                        <div className={`p-4 rounded-xl font-bold text-lg mb-3 text-center ${feedback.type === 'error' ? 'bg-red-900 border border-red-500' : 'bg-green-900 border border-green-500'}`}>{feedback.text}</div>
                        <p className="text-gray-400 mb-3 text-base italic border border-slate-600/50 rounded-lg py-2 px-3 bg-black/20">ES: {feedback.currentCard.es}</p>
                        <div className="bg-black/40 p-3 rounded-xl border border-amber-500/30 mb-4">
                            <p className="text-amber-400 font-bold text-xs uppercase mb-1">💡 Tipp</p>
                            <p className="text-gray-200 text-sm italic">{feedback.tip}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <button type="button" onClick={() => registerTrainingResult('easy')} className="bg-emerald-700 text-white py-2 rounded-lg font-bold text-sm">Fácil</button>
                            <button type="button" onClick={() => registerTrainingResult('normal')} className="bg-yellow-700 text-white py-2 rounded-lg font-bold text-sm">Normal</button>
                            <button type="button" onClick={() => registerTrainingResult('difficult')} className="bg-rose-700 text-white py-2 rounded-lg font-bold text-sm">Difícil</button>
                        </div>
                        <button type="button" onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-black">Continuar ➔</button>
                    </div>
                )}
                <p className="text-gray-500 text-xs mt-4">Restantes: {queue.length}</p>
            </div>
        </div>
    );
}

function AdvancedPracticePanelFinal({ embedded = false, onRequestClose = null }) {
    const [show, setShow] = React.useState(false);
    const [activeMode, setActiveMode] = React.useState('menu');
    const [dashboard, setDashboard] = React.useState(() => getAdvancedDashboard());
    const [achUnlocked, setAchUnlocked] = React.useState(() => getAchievementsUnlocked());
    const [examCtx, setExamCtx] = React.useState(null);
    const [examSetup, setExamSetup] = React.useState({ durationMin: 20, hintsTotal: 8, track: 'articulos', articleLevel: 'B1' });

    React.useEffect(() => {
        if (embedded) return;
        const open = () => {
            runAchievementsCheck();
            setShow(true);
            setActiveMode('menu');
            setExamCtx(null);
            setDashboard(getAdvancedDashboard());
            setAchUnlocked(getAchievementsUnlocked());
        };
        const close = () => {
            setShow(false);
            setExamCtx(null);
            setActiveMode('menu');
        };
        const refresh = () => {
            setDashboard(getAdvancedDashboard());
            setAchUnlocked(getAchievementsUnlocked());
        };
        window.addEventListener('toggleAdvancedModal', open);
        window.addEventListener('closeAdvancedModal', close);
        window.addEventListener('advancedProgressUpdated', refresh);
        window.addEventListener('achievementsUpdated', refresh);
        return () => {
            window.removeEventListener('toggleAdvancedModal', open);
            window.removeEventListener('closeAdvancedModal', close);
            window.removeEventListener('advancedProgressUpdated', refresh);
            window.removeEventListener('achievementsUpdated', refresh);
        };
    }, [embedded]);

    React.useEffect(() => {
        const visible = embedded || show;
        if (visible && window.lucide) window.lucide.createIcons();
    }, [embedded, show, activeMode]);

    const handleClosePanel = () => {
        if (!embedded) setShow(false);
        setExamCtx(null);
        setActiveMode('menu');
        if (embedded && typeof onRequestClose === 'function') onRequestClose();
    };

    const visible = embedded || show;
    if (!visible) return null;

    return (
        <div className={embedded ? "w-full text-white" : "fixed inset-0 bg-gray-950/95 backdrop-blur-md z-[100] flex flex-col p-4 md:p-10 text-white overflow-y-auto"}>
            <div className="flex justify-between items-center mb-10 border-b border-purple-900/50 pb-4 gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-purple-600 p-2 rounded-lg"><i data-lucide="graduation-cap" className="w-6 h-6"></i></span>
                    <h2 className="text-2xl md:text-3xl font-bold text-purple-100">Área de Entrenamiento Müller</h2>
                    <button type="button" onClick={() => window.__MULLER_OPEN_EXERCISE_HELP && window.__MULLER_OPEN_EXERCISE_HELP(activeMode === 'exam_setup' ? 'advanced_exam' : 'advanced_menu')} className="text-xs font-bold text-purple-200 border border-purple-500/40 rounded-lg px-2 py-1.5 hover:bg-purple-900/50 transition">Ayuda</button>
                </div>
                {!embedded && <button type="button" onClick={handleClosePanel} className="bg-red-600/20 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition">X Cerrar</button>}
            </div>

            {activeMode === 'exam_setup' && (
                <div className="max-w-lg mx-auto w-full space-y-5 mb-6">
                    <button type="button" onClick={() => setActiveMode('menu')} className="text-sm text-gray-400 hover:text-white">← Volver al menú</button>
                    <div className="bg-slate-900/85 border border-amber-600/45 rounded-2xl p-6 shadow-xl shadow-amber-900/10">
                        <h3 className="text-xl font-bold text-amber-100 mb-1 flex items-center gap-2"><i data-lucide="timer" className="w-5 h-5"></i> Modo examen TELC</h3>
                        <p className="text-sm text-gray-400 mb-5 leading-relaxed">Cronómetro orientativo (no detiene la sesión), traducción al español oculta hasta que uses una pista. Pensado para la presión del examen sin castigos duros.</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Duración guía</p>
                        <div className="flex flex-wrap gap-2 mb-5">
                            {[15, 20, 30, 45].map((m) => (
                                <button key={m} type="button" onClick={() => setExamSetup((s) => ({ ...s, durationMin: m }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${examSetup.durationMin === m ? 'bg-amber-700/50 border-amber-500 text-amber-100' : 'bg-slate-800 border-slate-600 text-gray-300 hover:border-amber-700/50'}`}>{m} min</button>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pistas de traducción (toda la sesión)</p>
                        <div className="flex flex-wrap gap-2 mb-5">
                            {[5, 8, 12].map((h) => (
                                <button key={h} type="button" onClick={() => setExamSetup((s) => ({ ...s, hintsTotal: h }))}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${examSetup.hintsTotal === h ? 'bg-cyan-800/50 border-cyan-500 text-cyan-100' : 'bg-slate-800 border-slate-600 text-gray-300'}`}>{h} pistas</button>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Contenido</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {[
                                { id: 'articulos', label: 'Artículos' },
                                { id: 'verbos', label: 'Verbos + prep.' },
                                { id: 'preposiciones', label: 'Preposiciones' },
                                { id: 'mix', label: 'Mezcla B1/B2 (45 tarjetas)' }
                            ].map((t) => (
                                <button key={t.id} type="button" onClick={() => setExamSetup((s) => ({ ...s, track: t.id }))}
                                    className={`p-3 rounded-xl text-left text-sm font-bold border transition ${examSetup.track === t.id ? 'bg-amber-950/50 border-amber-500/70 text-amber-100' : 'bg-slate-800/80 border-slate-600 text-gray-300'}`}>{t.label}</button>
                            ))}
                        </div>
                        {examSetup.track === 'articulos' && (
                            <div className="mb-5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nivel artículos</p>
                                <div className="flex flex-wrap gap-2">
                                    {['B1', 'B2', 'MIXTO', 'historia'].map((lvl) => (
                                        <button key={lvl} type="button" onClick={() => setExamSetup((s) => ({ ...s, articleLevel: lvl }))}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${examSetup.articleLevel === lvl ? 'bg-blue-800/60 border-blue-400' : 'bg-slate-800 border-slate-600 text-gray-400'}`}>{lvl}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button type="button" onClick={() => {
                            const deadline = Date.now() + examSetup.durationMin * 60 * 1000;
                            setExamCtx({
                                durationMin: examSetup.durationMin,
                                deadline,
                                hintsTotal: examSetup.hintsTotal,
                                hintsUsed: 0,
                                track: examSetup.track
                            });
                            if (examSetup.track === 'articulos') setActiveMode('exam_articulos');
                            else if (examSetup.track === 'verbos') setActiveMode('exam_verbos');
                            else if (examSetup.track === 'preposiciones') setActiveMode('exam_preposiciones');
                            else setActiveMode('exam_mix');
                        }} className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 border border-amber-500/30 shadow-lg transition">
                            Iniciar sesión tipo examen
                        </button>
                    </div>
                </div>
            )}

            {activeMode === 'menu' && (
                <div className="max-w-5xl mx-auto w-full">
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
                        <div className="bg-slate-900/80 border border-blue-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Intentos</p><p className="text-xl font-black text-white">{dashboard.totalAttempts}</p></div>
                        <div className="bg-slate-900/80 border border-red-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Fallos</p><p className="text-xl font-black text-red-300">{dashboard.totalErrors}</p></div>
                        <div className="bg-slate-900/80 border border-emerald-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Precisión</p><p className="text-xl font-black text-emerald-300">{dashboard.accuracy}%</p></div>
                        <div className="bg-slate-900/80 border border-fuchsia-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Débiles</p><p className="text-xl font-black text-fuchsia-300">{dashboard.weak}</p></div>
                        <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Art/Verb/Prep</p><p className="text-sm font-black text-amber-300">{dashboard.art.total}/{dashboard.verb.total}/{dashboard.prep.total}</p></div>
                        <div className="bg-slate-900/80 border border-cyan-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Objetivo Hoy</p><p className="text-xl font-black text-cyan-300">{dashboard.todayAttempts}/{dashboard.dailyGoal}</p><p className="text-[10px] text-cyan-200">{dashboard.dailyProgress}%</p></div>
                        <div className="bg-slate-900/80 border border-orange-900/40 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Racha</p><p className="text-xl font-black text-orange-300">🔥 {dashboard.streakDays}</p><p className="text-[10px] text-orange-200">días</p></div>
                    </div>
                    <div className="bg-slate-900/60 border border-purple-800/40 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">Objetivo diario (tarjetas calificadas)</p>
                            <div className="flex items-center gap-3">
                                <input type="range" min="5" max="100" step="5" value={dashboard.dailyGoal}
                                    onChange={(e) => { setDailyGoalCount(parseInt(e.target.value, 10)); setDashboard(getAdvancedDashboard()); }}
                                    className="flex-1 accent-cyan-500" />
                                <span className="text-cyan-300 font-mono font-bold w-12 text-right">{dashboard.dailyGoal}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 md:max-w-xs">Ajusta el ritmo: en TELC cuenta más la constancia diaria que un solo día intenso.</p>
                    </div>
                    <button type="button" onClick={() => setActiveMode('exam_setup')} className="w-full mb-6 text-left bg-gradient-to-br from-amber-950/55 to-slate-900/85 border border-amber-600/45 hover:border-amber-500/80 rounded-2xl p-5 transition shadow-lg shadow-amber-900/15 group">
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Simulación</p>
                        <h3 className="text-lg font-bold text-amber-100 mb-1 group-hover:text-white transition">Modo examen TELC</h3>
                        <p className="text-sm text-gray-400 leading-snug">Cronómetro suave, traducción oculta con pistas limitadas y ritmo de presión sin bloquear la sesión.</p>
                    </button>
                    <div className="mb-6">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Insignias TELC / Müller</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {ACHIEVEMENT_DEFS.map((def) => {
                                const unlockedAt = achUnlocked[def.id];
                                return (
                                    <div key={def.id} title={def.desc}
                                        className={`rounded-lg p-2 text-center border text-[11px] leading-tight ${unlockedAt ? 'bg-amber-950/40 border-amber-600/50 text-amber-100' : 'bg-slate-900/60 border-slate-700 text-gray-600'}`}>
                                        <div className="text-lg mb-0.5">{def.icon}</div>
                                        <div className="font-bold">{def.title}</div>
                                        {unlockedAt && <div className="text-[9px] text-amber-300/80 mt-1">Desbloqueada</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onClick={() => setActiveMode('articulos')} className="bg-slate-900 border border-blue-800/50 p-8 rounded-2xl hover:bg-blue-900/30 transition shadow-lg group flex flex-col items-center text-center">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition">📘</div>
                        <h3 className="text-2xl font-bold text-blue-400 mb-2">Artículos (Der/Die/Das)</h3>
                        <p className="text-sm text-gray-400">Extraído en Nominativo estricto. Usa teclado (1, 2, 3).</p>
                    </button>

                    <button onClick={() => setActiveMode('verbos_prep')} className="bg-slate-900 border border-green-800/50 p-8 rounded-2xl hover:bg-green-900/30 transition shadow-lg group flex flex-col items-center text-center">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition">📗</div>
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Verbos + Prep (Nube)</h3>
                        <p className="text-sm text-gray-400">Conectado a tu GitHub. Sistema de repetición de fallos.</p>
                    </button>

                <button onClick={() => setActiveMode('preposiciones')} className="bg-slate-900 border border-amber-800/50 p-8 rounded-2xl hover:bg-amber-900/30 transition shadow-lg group flex flex-col items-center text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">📙</div>
            <h3 className="text-2xl font-bold text-amber-400 mb-2">Preposiciones</h3>
            <p className="text-sm text-gray-400">Base de datos en tiempo real (GitHub). Casos y ejemplos B1/B2.</p>
        </button>
    </div>
    </div>
)}

            {activeMode === 'articulos' && <ArticlePracticeFinal onBack={() => setActiveMode('menu')} />}
            {activeMode === 'verbos_prep' && <CloudPracticeFinal onBack={() => setActiveMode('menu')} type="verbos" />}
            {activeMode === 'preposiciones' && <CloudPracticeFinal onBack={() => setActiveMode('menu')} type="preposiciones" />}
            {activeMode === 'exam_articulos' && examCtx && (
                <ArticlePracticeFinal examCtx={examCtx} setExamCtx={setExamCtx} examAutoLevel={examSetup.articleLevel} onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
            {activeMode === 'exam_verbos' && examCtx && (
                <CloudPracticeFinal examCtx={examCtx} setExamCtx={setExamCtx} type="verbos" onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
            {activeMode === 'exam_preposiciones' && examCtx && (
                <CloudPracticeFinal examCtx={examCtx} setExamCtx={setExamCtx} type="preposiciones" onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
            {activeMode === 'exam_mix' && examCtx && (
                <TelcMixedExamFinal examCtx={examCtx} setExamCtx={setExamCtx} onBack={() => { setExamCtx(null); setActiveMode('menu'); }} />
            )}
        </div>
    );
}

// ============================================================================

// -------------------- MODO AUDIOLIBRO (guion TTS encadenado) — control desde React --------------------
(function() {
    let isPlaying = false;
    let currentIdx = 0;
    let guionCache = null;
    let timeoutId = null;
    function sanitizeAudiobookText(text) {
        return String(text || '')
            .replace(/\[R\]/gi, '')
            .replace(/\bN[üu]tzlich\b\.?/gi, '')
            .replace(/\b[ÚU]TIL\b\.?/gi, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    function dispatchPlaying(playing) {
        window.dispatchEvent(new CustomEvent('mullerAudiobookState', { detail: { playing } }));
    }

    function getCurrentGuion() {
        const live = window.__MULLER_ACTIVE_GUION__;
        if (Array.isArray(live) && live.length > 0) return live;
        const scripts = JSON.parse(localStorage.getItem('mullerScripts') || '[]');
        if (scripts.length > 0) {
            const last = scripts[scripts.length - 1];
            try { return JSON.parse(last.data); } catch (e) {}
        }
        return window.__DEFAULT_GUION__ || [];
    }

    function stopAudioBook() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        window.speechSynthesis.cancel();
        isPlaying = false;
        dispatchPlaying(false);
    }

    function playScene(index) {
        if (!guionCache || index >= guionCache.length) {
            stopAudioBook();
            if (window.__mullerToast) window.__mullerToast('Audiolibro finalizado.', 'info');
            return;
        }
        const scene = guionCache[index];
        const utterance = new SpeechSynthesisUtterance(sanitizeAudiobookText(scene.text));
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        window.__mullerApplyPreferredDeVoice(utterance);
        utterance.onend = () => {
            timeoutId = setTimeout(() => {
                playScene(index + 1);
            }, 800);
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        currentIdx = index;
    }

    function startAudioBook() {
        guionCache = getCurrentGuion();
        if (!guionCache || guionCache.length === 0) {
            if (window.__mullerToast) window.__mullerToast('No hay ningún guion cargado.', 'error');
            return;
        }
        stopAudioBook();
        isPlaying = true;
        dispatchPlaying(true);
        playScene(0);
    }

    function toggleAudioBook() {
        if (isPlaying) stopAudioBook();
        else startAudioBook();
    }

    window.__mullerAudiobook = {
        toggle: toggleAudioBook,
        start: startAudioBook,
        stop: stopAudioBook,
        get playing() { return isPlaying; },
        get currentIndex() { return currentIdx; }
    };
})();
