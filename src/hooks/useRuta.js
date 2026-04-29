import { useState } from 'react';

export function useRutaState() {
  const [rutaSubTab, setRutaSubTab] = useState('camino');
  const [rutaProgress, setRutaProgress] = useState(() => (typeof window.mullerRutaLoad === 'function' ? window.mullerRutaLoad() : { completed: {}, placementDone: false, suggestedLevelIdx: 0, playTimeMs: 0, lessonsCompleted: 0 }));
  const [rutaRun, setRutaRun] = useState(null);
  const [rutaVerbDb, setRutaVerbDb] = useState({ meta: null, verbs: [] });
  const [rutaArticleDb, setRutaArticleDb] = useState([]);
  const [rutaTopicFilter, setRutaTopicFilter] = useState('all');
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

  return {
    rutaSubTab, setRutaSubTab,
    rutaProgress, setRutaProgress,
    rutaRun, setRutaRun,
    rutaVerbDb, setRutaVerbDb,
    rutaArticleDb, setRutaArticleDb,
    rutaTopicFilter, setRutaTopicFilter,
    placementQuestions, setPlacementQuestions,
    placementAnswers, setPlacementAnswers,
    placementIndex, setPlacementIndex,
    placementLevel, setPlacementLevel,
    placementScore, setPlacementScore,
    placementFinished, setPlacementFinished,
    rutaMentor, setRutaMentor,
    rutaFillInput, setRutaFillInput,
    rutaSpeakErr, setRutaSpeakErr,
    celebrationModal, setCelebrationModal
  };
}
