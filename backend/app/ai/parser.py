"""
Converts a discovery-interview transcript into:
  - a short human-readable title for the experience
  - a resume bullet phrased professionally
  - a list of O*NET skill IDs it demonstrates
  - a confidence note naming anything the model could NOT verify from
    the user's own words (surfaced back to the user instead of silently
    invented)

This is the enforcement point for the product rule "Pathfolio AI must
never fabricate achievements, numbers, or skills" — it's a prompting +
structured-output constraint, not something the frontend can guarantee,
so it lives here and nowhere else touches OpenAI directly.
"""
import json
from openai import OpenAI

from ..config import settings
from ..skills_taxonomy import ONET_SKILLS, CATEGORY_SKILL_HINTS

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are Pathfolio AI. You translate a student's informal \
activity into professional resume language, grounded ONLY in what they told you.

HARD RULES — violating any of these is a failure:
1. Never invent numbers, metrics, percentages, titles, dates, or outcomes \
that the user did not state. If they gave no number, do not write one \
(not even a vague one like "several" standing in for a specific figure \
they implied but didn't say).
2. Only choose skills from the CANDIDATE_SKILLS list provided to you, and \
only choose a skill if the user's own answers actually support it. It is \
correct and expected to return fewer skills than the candidate list offers.
3. If any part of the transcript is vague or you cannot verify a claim, \
say so explicitly in `confidence_notes` instead of smoothing over it in \
the bullet.
4. Write the resume bullet using only the user's own facts, rephrased in \
professional language. Do not add achievements they did not describe.

Return ONLY valid JSON matching this shape, nothing else:
{
  "title": "short professional title for this experience, e.g. 'Community Management'",
  "resume_bullet": "one sentence, past or present tense as appropriate, grounded only in the transcript",
  "skill_ids": ["2.B.1.b", "..."],
  "confidence_notes": "plain-language note on anything unverified or vague, or empty string if none"
}
"""


def build_user_prompt(category: str, evidence: list[dict]) -> str:
    candidate_ids = CATEGORY_SKILL_HINTS.get(category, [])
    candidates = [s for s in ONET_SKILLS if s[0] in candidate_ids]
    candidates_text = "\n".join(f"- {sid}: {name} ({cat})" for sid, name, cat in candidates)

    transcript = "\n".join(f"Q: {qa['question']}\nA: {qa['answer']}" for qa in evidence)

    return f"""ACTIVITY CATEGORY: {category}

CANDIDATE_SKILLS (choose only from this list, and only those genuinely supported):
{candidates_text}

INTERVIEW TRANSCRIPT (this is the only source of truth — do not use outside knowledge):
{transcript}
"""


def parse_experience(category: str, evidence: list[dict]) -> dict:
    """
    Calls the LLM and returns a dict with title, resume_bullet, skill_ids,
    confidence_notes. Raises if the model does not return valid JSON —
    callers should treat that as "try again" rather than guessing.
    """
    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.3,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(category, evidence)},
        ],
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content
    data = json.loads(content)  # let this raise on malformed output — no silent fallback

    # Defensive: strip any skill_id the model returned that wasn't actually
    # in the candidate list we gave it, in case it ignored the instruction.
    allowed = set(CATEGORY_SKILL_HINTS.get(category, []))
    data["skill_ids"] = [s for s in data.get("skill_ids", []) if s in allowed]

    return data
