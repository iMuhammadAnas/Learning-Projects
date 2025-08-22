import { useEffect, useMemo, useRef, useState } from "react";
import "./quiz.css";

type RawOTDQuestion = {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: string;
};

type ResultItem = {
  id: string;
  question: string;
  correct: string;
  selected: string | null;
  isCorrect: boolean;
};

type Status = "idle" | "loading" | "playing" | "finished" | "error";

const QUESTIONS_COUNT = 10; // 5–10 as required
const PER_QUESTION_TIME = 15; // seconds (15–30 suggested)

/** Fisher–Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Decode HTML entities in OpenTriviaDB text */
function decodeHTML(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent || html;
}

/** Transform API data to our shape */
function normalize(raw: RawOTDQuestion[], amount: number): QuizQuestion[] {
  return raw.slice(0, amount).map((q, idx) => {
    const options = shuffle([q.correct_answer, ...q.incorrect_answers]).map(
      decodeHTML
    );
    return {
      id: `${Date.now()}-${idx}`,
      question: decodeHTML(q.question),
      options,
      correct: decodeHTML(q.correct_answer),
    };
  });
}

export default function Quiz() {
  const [status, setStatus] = useState<Status>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PER_QUESTION_TIME);

  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false); // submitted or time-up
  const [results, setResults] = useState<ResultItem[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const timerRef = useRef<number | null>(null);

  const total = questions.length;
  const progress = useMemo(
    () => (total === 0 ? 0 : (current / total) * 100),
    [current, total]
  );

  // Start quiz
  const startQuiz = async () => {
    setStatus("loading");
    setErrorMsg("");
    setResults([]);
    setCurrent(0);
    setSelected(null);
    setLocked(false);
    setSecondsLeft(PER_QUESTION_TIME);

    try {
      const url = `https://opentdb.com/api.php?amount=${QUESTIONS_COUNT}&type=multiple`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      const normalized = normalize(
        data.results as RawOTDQuestion[],
        QUESTIONS_COUNT
      );

      if (!normalized.length) throw new Error("No questions returned.");
      setQuestions(normalized);
      setStatus("playing");
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong fetching the quiz.");
      setStatus("error");
    }
  };

  // Timer for each question
  useEffect(() => {
    if (status !== "playing") return;

    // reset timer for new question
    setSecondsLeft(PER_QUESTION_TIME);

    // clear any previous intervals
    if (timerRef.current) window.clearInterval(timerRef.current);

    // start ticking as long as not locked
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (locked) return s; // pause when locked
        if (s <= 1) {
          // time up — mark wrong and auto-advance
          onTimeUp();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, current, locked]);

  const currentQ = questions[current];

  /** When user selects an option — submit immediately and lock */
  const handleSelect = (option: string) => {
    if (locked || status !== "playing") return;

    const isCorrect = option === currentQ.correct;
    setSelected(option);
    setLocked(true);

    setResults((prev) => [
      ...prev,
      {
        id: currentQ.id,
        question: currentQ.question,
        correct: currentQ.correct,
        selected: option,
        isCorrect,
      },
    ]);
  };

  /** Timer expired — mark as wrong and auto-advance shortly */
  const onTimeUp = () => {
    if (locked) return;
    setLocked(true);
    setSelected(null); // no answer

    setResults((prev) => [
      ...prev,
      {
        id: currentQ.id,
        question: currentQ.question,
        correct: currentQ.correct,
        selected: null,
        isCorrect: false,
      },
    ]);

    // slight pause so user sees it timed out
    setTimeout(() => goNext(), 700);
  };

  const goNext = () => {
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setLocked(false);
    } else {
      setStatus("finished");
      // stop timer
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
  };

  const restart = () => {
    setStatus("idle");
    setQuestions([]);
    setResults([]);
    setSelected(null);
    setLocked(false);
    setCurrent(0);
    setSecondsLeft(PER_QUESTION_TIME);
    setErrorMsg("");
  };

  const score = useMemo(
    () => results.filter((r) => r.isCorrect).length,
    [results]
  );

  return (
    <div className="quiz-main">
      <div className="quiz-container">
        <h1 className="brand">Quiz App</h1>

        {status === "idle" && (
          <div className="card center">
            <p className="muted">Ready to test yourself?</p>
            <button className="btn primary" onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="card center">
            <div className="spinner" />
            <p>Fetching questions…</p>
          </div>
        )}

        {status === "error" && (
          <div className="card center">
            <p className="error">⚠️ {errorMsg}</p>
            <button className="btn" onClick={restart}>
              Try Again
            </button>
          </div>
        )}

        {status === "playing" && currentQ && (
          <div className="card">
            {/* Progress */}
            <div className="progress-wrapper" aria-label="Progress">
              <div
                className="progress-bar"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="row space-between">
              <div className="q-meta">
                Question <strong>{current + 1}</strong> / {total}
              </div>
              <div
                className={`timer ${secondsLeft <= 5 ? "warn" : ""} ${secondsLeft <= 3 ? "dead" : ""} ${locked ? "paused" : ""}`}
                aria-label="Time remaining"
                title={locked ? "Paused (answer submitted)" : "Counting down"}
              >
                ⏳ {secondsLeft}s
              </div>
            </div>

            <h2
              className="question"
              dangerouslySetInnerHTML={{ __html: currentQ.question }}
            />
            {/* (we already decode, but *also* ensure safe rendering for any leftover HTML) */}

            <div className="options">
              {currentQ.options.map((op) => {
                const isSelected = selected === op;
                const isCorrect = op === currentQ.correct;

                // Styling states after locked:
                //  - selected wrong -> "wrong"
                //  - correct -> "correct"
                //  - others -> default
                const classNames = [
                  "option",
                  isSelected ? "selected" : "",
                  locked && isCorrect ? "correct" : "",
                  locked && isSelected && !isCorrect ? "wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={op}
                    className={classNames}
                    onClick={() => handleSelect(op)}
                    disabled={locked} // cannot change after submit/time-up
                  >
                    {op}
                  </button>
                );
              })}
            </div>

            <div className="row end">
              <button
                className="btn"
                onClick={goNext}
                disabled={!locked} // enable only after submitted/time-up
              >
                {current + 1 === total ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        )}

        {status === "finished" && (
          <div className="card">
            <h2 className="center">Your Results</h2>
            <div className="score-line">
              <div className="score-badge">
                Score: <strong>{score}</strong> / {total}
              </div>
              <div className="summary">
                ✅ Correct: <strong>{score}</strong> &nbsp;|&nbsp; ❌ Incorrect:{" "}
                <strong>{total - score}</strong>
              </div>
            </div>

            <ul className="review-list">
              {results.map((r, idx) => (
                <li key={r.id} className="review-item">
                  <div className="review-q">
                    <span className="q-index">{idx + 1}.</span> {r.question}
                  </div>
                  <div className="review-answers">
                    <div className="badge correct">
                      Correct: <strong>{r.correct}</strong>
                    </div>
                    <div
                      className={`badge ${r.isCorrect ? "correct" : "wrong"}`}
                    >
                      Your answer:{" "}
                      <strong>
                        {r.selected === null ? "— (timed out)" : r.selected}
                      </strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="row center">
              <button className="btn" onClick={restart}>
                Restart
              </button>
              <button className="btn primary" onClick={startQuiz}>
                New Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
