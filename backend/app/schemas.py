from typing import List, Optional
from pydantic import BaseModel, Field


class QAPair(BaseModel):
    question: str
    answer: str


class ExperienceCreateRequest(BaseModel):
    """What the frontend sends after the discovery interview finishes."""
    user_id: str
    category: str                 # CODING, COMMUNITIES, etc — matches skills_taxonomy hints
    raw_input: str                # user's first free-text answer, verbatim
    evidence: List[QAPair]        # full Q&A transcript from the interview


class SkillOut(BaseModel):
    onet_id: str
    name: str
    category: Optional[str] = None

    class Config:
        from_attributes = True


class ExperienceOut(BaseModel):
    id: str
    category: str
    title: str
    raw_input: str
    resume_bullet: str
    ai_confidence_notes: Optional[str] = None
    skills: List[SkillOut] = []

    class Config:
        from_attributes = True


class ResumeCreateRequest(BaseModel):
    user_id: str
    template: str = "PATH"
    color: str = "indigo"
    font: str = "Space Grotesk"
    experience_ids: List[str] = Field(default_factory=list)


class ResumeOut(BaseModel):
    id: str
    template: str
    color: str
    font: str
    experience_ids: List[str]

    class Config:
        from_attributes = True
