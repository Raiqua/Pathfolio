const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type QAPair = { question: string; answer: string };

export type Skill = { onet_id: string; name: string; category: string | null };

export type Experience = {
  id: string;
  category: string;
  title: string;
  raw_input: string;
  resume_bullet: string;
  ai_confidence_notes: string | null;
  skills: Skill[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export function createExperience(payload: {
  user_id: string;
  category: string;
  raw_input: string;
  evidence: QAPair[];
}): Promise<Experience> {
  return request("/experiences", { method: "POST", body: JSON.stringify(payload) });
}

export function listExperiences(userId: string): Promise<Experience[]> {
  return request(`/experiences/user/${userId}`);
}

export function deleteExperience(id: string): Promise<{ deleted: string }> {
  return request(`/experiences/${id}`, { method: "DELETE" });
}

export function saveResume(payload: {
  user_id: string;
  template: string;
  color: string;
  font: string;
  experience_ids: string[];
}) {
  return request("/resumes", { method: "POST", body: JSON.stringify(payload) });
}

export function getResume(userId: string) {
  return request(`/resumes/user/${userId}`);
}
