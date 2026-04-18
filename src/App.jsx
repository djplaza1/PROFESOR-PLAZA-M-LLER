import { useMemo, useState } from "react";
import { BookOpen, Brain, Mic, Sparkles, Trophy, Volume2 } from "lucide-react";
import { flashcards, lessons } from "./data/seed";

const STORAGE_KEY = "muller-premium-progress";

function speakGerman(text) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "de-DE";
  utter.rate = 0.92;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function scoreSimilarity(a, b) {
  const clean = (v) =>
    v
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim();
  const aa = clean(a);
  const bb = clean(b);
  if (!aa || !bb) return 0;
  const aWords = aa.split(/\s+/);
  const bWords = bb.split(/\s+/);
  const hits = aWords.filter((w) => bWords.includes(w)).length;
  return Math.round((hits / Math.max(aWords.length, bWords.length)) * 100);
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { xp: 0, streak: 1, cardsDone: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { xp: 0, streak: 1, cardsDone: 0 };
  }
}

export default function App() {
  const [tab, setTab] = useState("historia");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [dictationInput, setDictationInput] = useState("");
  const [dictationScore, setDictationScore] = useState(null);
  const [progress, setProgress] = useState(loadProgress);

  const currentLesson = lessons[lessonIndex];
  const currentScene = currentLesson.scenes[sceneIndex];
  const currentCard = flashcards[cardIndex];

  const levelLabel = useMemo(() => {
    if (progress.xp >= 1200) return "B2+";
    if (progress.xp >= 700) return "B2";
    if (progress.xp >= 300) return "B1+";
    return "B1";
  }, [progress.xp]);

  const saveAndSetProgress = (updates) => {
    const merged = { ...progress, ...updates };
    setProgress(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  };

  const nextScene = () => {
    const lastScene = sceneIndex === currentLesson.scenes.length - 1;
    if (lastScene) {
      const nextLesson = (lessonIndex + 1) % lessons.length;
      setLessonIndex(nextLesson);
      setSceneIndex(0);
      saveAndSetProgress({ xp: progress.xp + 20 });
      return;
    }
    setSceneIndex((prev) => prev + 1);
    saveAndSetProgress({ xp: progress.xp + 8 });
  };

  const rateCard = (known) => {
    const next = (cardIndex + 1) % flashcards.length;
    setCardIndex(next);
    setShowCard(false);
    saveAndSetProgress({
      xp: progress.xp + (known ? 14 : 5),
      cardsDone: progress.cardsDone + 1
    });
  };

  const checkDictation = () => {
    const score = scoreSimilarity(dictationInput, currentScene.de);
    setDictationScore(score);
    saveAndSetProgress({ xp: progress.xp + Math.max(4, Math.floor(score / 8)) });
  };

  return (
    <div className="app-shell">
      <header className="topbar glass">
        <div className="brand">
          <Sparkles size={20} />
          <h1>Muller German Trainer</h1>
        </div>
        <div className="stats">
          <span>Nivel {levelLabel}</span>
          <span>XP {progress.xp}</span>
          <span>Racha {progress.streak} dias</span>
        </div>
      </header>

      <main className="content">
        <nav className="tabs glass">
          <button onClick={() => setTab("historia")} className={tab === "historia" ? "active" : ""}><BookOpen size={16} /> Historia</button>
          <button onClick={() => setTab("flashcards")} className={tab === "flashcards" ? "active" : ""}><Brain size={16} /> Flashcards</button>
          <button onClick={() => setTab("dictado")} className={tab === "dictado" ? "active" : ""}><Mic size={16} /> Dictado</button>
        </nav>

        {tab === "historia" && (
          <section className="panel glass">
            <p className="kicker">{currentLesson.level} · {currentLesson.title}</p>
            <h2>{currentScene.de}</h2>
            <p className="translation">{currentScene.es}</p>
            <div className="actions">
              <button onClick={() => speakGerman(currentScene.de)}><Volume2 size={16} /> Escuchar</button>
              <button onClick={nextScene}>Siguiente escena</button>
            </div>
          </section>
        )}

        {tab === "flashcards" && (
          <section className="panel glass">
            <p className="kicker">{currentCard.type}</p>
            <h2>{currentCard.de}</h2>
            <p className="translation">{showCard ? currentCard.es : "Pulsa mostrar para ver traduccion"}</p>
            <div className="actions">
              <button onClick={() => setShowCard((v) => !v)}>{showCard ? "Ocultar" : "Mostrar"}</button>
              <button onClick={() => rateCard(false)}>Me costo</button>
              <button onClick={() => rateCard(true)}>La sabia</button>
            </div>
          </section>
        )}

        {tab === "dictado" && (
          <section className="panel glass">
            <p className="kicker">Escucha y escribe</p>
            <h2>Frase de la leccion actual</h2>
            <div className="actions">
              <button onClick={() => speakGerman(currentScene.de)}><Volume2 size={16} /> Reproducir frase</button>
            </div>
            <textarea
              value={dictationInput}
              onChange={(e) => setDictationInput(e.target.value)}
              placeholder="Escribe aqui lo que escuchas en aleman..."
            />
            <div className="actions">
              <button onClick={checkDictation}>Corregir</button>
            </div>
            {dictationScore !== null && (
              <p className="score"><Trophy size={16} /> Puntuacion: {dictationScore}%</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
