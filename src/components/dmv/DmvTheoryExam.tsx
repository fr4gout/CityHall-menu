import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { mockDmvQuestions } from "@/nui/mockDmvQuestions";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { TheoryQuestion } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DmvView } from "./DmvDashboard";
import { dmvBackBtn, dmvSectionLabel, dmvStatGrid } from "./dmv-layout";

type ExamStep = "intro" | "active" | "result";

interface AnswerRecord {
  question: TheoryQuestion;
  selected: number | null;
  correct: boolean;
}

interface DmvTheoryExamProps {
  onNavigate: (view: DmvView) => void;
}

const EXAM_DURATION_SEC = 4 * 60;
const PASS_MARK = 75;
const QUESTION_COUNT = 8;

function shuffleQuestions(questions: TheoryQuestion[]): TheoryQuestion[] {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, QUESTION_COUNT);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function DmvTheoryExam({ onNavigate }: DmvTheoryExamProps) {
  const addViolation = usePlayerStore((s) => s.addViolation);
  const [step, setStep] = useState<ExamStep>("intro");
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SEC);
  const failRecorded = useRef(false);
  const answersRef = useRef<AnswerRecord[]>([]);

  answersRef.current = answers;

  const current = questions[index];

  const correctCount = useMemo(() => answers.filter((a) => a.correct).length, [answers]);
  const mistakes = answers.length - correctCount;
  const liveScore = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 100;
  const finalScore = answers.length > 0 ? Math.round((correctCount / QUESTION_COUNT) * 100) : 0;
  const passed = finalScore >= PASS_MARK;

  const beginExam = useCallback(() => {
    setQuestions(shuffleQuestions(mockDmvQuestions));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setTimeLeft(EXAM_DURATION_SEC);
    failRecorded.current = false;
    setStep("active");
  }, []);

  const finishExam = useCallback(
    (finalAnswers: AnswerRecord[]) => {
      const correct = finalAnswers.filter((a) => a.correct).length;
      const score = Math.round((correct / QUESTION_COUNT) * 100);
      if (score < PASS_MARK && !failRecorded.current) {
        failRecorded.current = true;
        addViolation({
          name: "Failed Theory Exam",
          points: 1,
          date: new Date().toISOString().slice(0, 10),
          location: "SA-DMV TESTING CENTER",
        });
      }
      setStep("result");
    },
    [addViolation],
  );

  const submitAnswer = useCallback(() => {
    if (!current || selected === null) return;
    const record: AnswerRecord = {
      question: current,
      selected,
      correct: selected === current.correctAnswer,
    };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);
    setSelected(null);

    if (index + 1 >= QUESTION_COUNT) {
      finishExam(nextAnswers);
    } else {
      setIndex((i) => i + 1);
    }
  }, [answers, current, finishExam, index, selected]);

  useEffect(() => {
    if (step !== "active") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          finishExam(answersRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [step, finishExam]);

  useEffect(() => {
    if (step !== "active") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "4") {
        const opt = Number(e.key) - 1;
        if (current && opt < current.options.length) {
          setSelected(opt);
        }
      }
      if (e.key === "Enter") {
        e.preventDefault();
        submitAnswer();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, current, submitAnswer]);

  if (step === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <button type="button" onClick={() => onNavigate("dashboard")} className={dmvBackBtn}>
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        <GlassCard className="space-y-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--tx)]">
              Driver Theory Examination
            </h2>
            <p className="mt-2 text-sm text-[var(--tx-2)]">
              Eight randomized questions across signs, scenarios, hazard perception and traffic law.
              Pass mark 75%. Timer: 4 minutes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Questions", value: String(QUESTION_COUNT) },
              { label: "Time", value: "4:00" },
              { label: "Pass", value: "75%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[var(--bd)] bg-[var(--bg-row)] p-3 text-center control-radius"
              >
                <div className="text-[10px] uppercase tracking-wider text-[var(--tx-3)]">
                  {stat.label}
                </div>
                <div className="mt-1 font-mono text-lg text-[var(--tx)]">{stat.value}</div>
              </div>
            ))}
          </div>

          <NeonButton className="w-full" onClick={beginExam}>
            Begin Examination
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <GlassCard className="space-y-5 text-center">
          <div
            className="mx-auto inline-block rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{
              color: passed ? "var(--c-green)" : "var(--c-red)",
              borderColor: passed ? "var(--c-green)" : "var(--c-red)",
              boxShadow: passed
                ? "0 0 24px color-mix(in srgb, var(--c-green) 40%, transparent)"
                : "0 0 24px color-mix(in srgb, var(--c-red) 40%, transparent)",
            }}
          >
            {passed ? "Passed" : "Failed"}
          </div>

          <div className={dmvStatGrid}>
            {[
              { label: "Score", value: `${finalScore}%` },
              { label: "Correct", value: String(correctCount) },
              { label: "Mistakes", value: String(mistakes) },
              { label: "Pass Mark", value: "75%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[var(--bd)] bg-[var(--bg-row)] p-3 text-center control-radius"
              >
                <div className="text-[10px] uppercase tracking-wider text-[var(--tx-3)]">
                  {stat.label}
                </div>
                <div className="mt-1 font-mono text-[var(--tx)]">{stat.value}</div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[var(--tx-2)]">
            {passed
              ? "Examination passed! You are now certified."
              : "Examination not passed. A failed-test point has been added to your license record."}
          </p>

          <div className="text-left">
            <div className={`mb-2 ${dmvSectionLabel}`}>Question Breakdown</div>
            <ul className="space-y-2">
              {answers.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 border border-[var(--bd)] bg-[var(--bg-row)] p-3 control-radius text-sm"
                >
                  <span className="min-w-0 line-clamp-2 text-[var(--tx-2)]">
                    {a.question.question}
                  </span>
                  <span
                    className="shrink-0 text-[10px] font-semibold uppercase"
                    style={{ color: a.correct ? "var(--c-green)" : "var(--c-red)" }}
                  >
                    {a.correct ? "Correct" : "Wrong"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <NeonButton variant="secondary" onClick={beginExam}>
              Retake
            </NeonButton>
            <NeonButton onClick={() => onNavigate("record")}>Review License</NeonButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <button type="button" onClick={() => onNavigate("dashboard")} className={dmvBackBtn}>
        <ArrowLeft className="size-4" />
        Exit Examination
      </button>

      <GlassCard className="space-y-4">
        <div className={dmvStatGrid}>
          <div className="text-center">
            <div className={dmvSectionLabel}>Question</div>
            <div className="mt-1 font-mono text-sm text-[var(--tx)]">
              {index + 1} / {QUESTION_COUNT}
            </div>
          </div>
          <div className="text-center">
            <div className={dmvSectionLabel}>Time</div>
            <div className="mt-1 font-mono text-sm text-[var(--c-orange)]">
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-center">
            <div className={dmvSectionLabel}>Mistakes</div>
            <div className="mt-1 font-mono text-sm text-[var(--tx)]">{mistakes}</div>
          </div>
          <div className="text-center">
            <div className={dmvSectionLabel}>Score</div>
            <div className="mt-1 font-mono text-sm text-[var(--tx)]">{liveScore}%</div>
          </div>
        </div>

        {current && (
          <>
            <div className="text-[10px] uppercase tracking-wider text-[var(--primary)]">
              {current.category}
            </div>
            <p className="text-base text-[var(--tx)]">{current.question}</p>

            <ul className="space-y-2">
              {current.options.map((opt, i) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    className="w-full border px-4 py-3 text-left text-sm control-radius transition-colors"
                    style={{
                      borderColor: selected === i ? "var(--bd-primary)" : "var(--bd)",
                      backgroundColor: selected === i ? "var(--primary-15)" : "var(--bg-row)",
                      color: "var(--tx)",
                    }}
                  >
                    <span className="font-mono text-[var(--tx-2)]">
                      {String.fromCharCode(65 + i)}.
                    </span>{" "}
                    {opt}
                  </button>
                </li>
              ))}
            </ul>

            <p className="text-[10px] text-[var(--tx-3)]">
              Press 1–4 to select · Enter to continue
            </p>

            <NeonButton className="w-full" disabled={selected === null} onClick={submitAnswer}>
              Next
            </NeonButton>
          </>
        )}
      </GlassCard>
    </div>
  );
}
