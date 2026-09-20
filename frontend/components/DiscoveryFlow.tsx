"use client";
import { useState } from "react";
import { createExperience, Experience, QAPair } from "../lib/api";

const CATEGORY_QUESTIONS: Record<string, string[]> = {
  CODING: [
    "What have you built or coded?",
    "Roughly how many people used it, or was it just for you/school?",
    "What was the hardest problem you had to solve while making it?",
  ],
  COMMUNITIES: [
    "What community or server do you run or help run?",
    "About how many members does it have?",
    "Have you had to moderate, resolve conflicts, or organize events there?",
  ],
  BUSINESS: [
    "What have you sold or run as a small business or side hustle?",
    "How do you handle customers, pricing, or marketing?",
    "What's the scale — revenue, orders, or reach — if you're comfortable sharing?",
  ],
  TEACHING: [
    "Who do you tutor or teach, and in what?",
    "How many students, and how regularly?",
    "Has a student's grade, confidence, or skill visibly improved because of you?",
  ],
  OTHER: [
    "In your own words, what do you spend real time on outside school?",
    "What are you actually responsible for when you do it?",
    "Has it led to any result, recognition, or change you can point to?",
  ],
};

const CATEGORIES = Object.keys(CATEGORY_QUESTIONS);

// Demo user id — swap for real auth (see README) once you have login.
const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || "";

export default function DiscoveryFlow({ onDiscovered }: { onDiscovered: (exp: Experience) => void }) {
  const [category, setCategory] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0 = category picker, 1..n = questions
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Experience | null>(null);
  const [error, setError] = useState<string | null>(null);

  const questions = category ? CATEGORY_QUESTIONS[category] : [];
  const finalQuestion = "What changed, or what would you tell someone about the result of your work here?";
  const allQuestions = [...questions, finalQuestion];

  async function finish(finalAnswers: string[]) {
    if (!category) return;
    setLoading(true);
    setError(null);
    const evidence: QAPair[] = allQuestions.map((q, i) => ({ question: q, answer: finalAnswers[i] }));
    try {
      const exp = await createExperience({
        user_id: DEMO_USER_ID,
        category,
        raw_input: finalAnswers[0],
        evidence,
      });
      setResult(exp);
      onDiscovered(exp);
    } catch (e: any) {
      setError(e.message || "Something went wrong talking to Pathfolio AI. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    const nextAnswers = [...answers, draft.trim()];
    setAnswers(nextAnswers);
    setDraft("");
    if (step < allQuestions.length) {
      setStep(step + 1);
    }
    if (step === allQuestions.length) {
      finish(nextAnswers);
    }
  }

  if (result) {
    return (
      <div className="q-card">
        <h3>WE FOUND SOMETHING.</h3>
        <p style={{ marginTop: 12, fontWeight: 700 }}>{result.title}</p>
        <p style={{ marginTop: 8, color: "var(--ink-dim)" }}>{result.resume_bullet}</p>
        {result.ai_confidence_notes && (
          <p style={{ marginTop: 12, fontSize: ".8rem", color: "#f0a" }}>
            Pathfolio AI couldn't verify: {result.ai_confidence_notes}
          </p>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {result.skills.map((s) => (
            <span
              key={s.onet_id}
              style={{ fontSize: ".72rem", border: "1px solid var(--line)", borderRadius: 100, padding: "6px 14px" }}
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="q-card" style={{ maxWidth: 640, border: "1px solid var(--line)", borderRadius: 24, padding: 32 }}>
      {step === 0 && (
        <>
          <p style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: 20 }}>
            WHAT DO YOU SPEND YOUR TIME DOING OUTSIDE SCHOOL?
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setStep(1);
                }}
                style={{
                  padding: "12px 20px",
                  borderRadius: 100,
                  border: "1px solid var(--line)",
                  background: "none",
                  color: "var(--ink)",
                  fontWeight: 600,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      {step > 0 && step <= allQuestions.length && (
        <>
          <p style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 20 }}>{allQuestions[step - 1]}</p>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your answer…"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--line)",
              color: "var(--ink)",
              fontSize: "1.1rem",
              padding: "10px 0",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <button
              className="btn-primary"
              disabled={draft.trim().length === 0 || loading}
              onClick={handleNext}
            >
              {loading ? "ASKING PATHFOLIO AI…" : step === allQuestions.length ? "SEE MY EXPERIENCE →" : "NEXT →"}
            </button>
          </div>
          {error && <p style={{ color: "#f66", marginTop: 12, fontSize: ".85rem" }}>{error}</p>}
        </>
      )}
    </div>
  );
}
