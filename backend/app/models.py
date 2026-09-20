import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Text, DateTime, ForeignKey, Table, JSON
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base


def gen_uuid():
    return str(uuid.uuid4())


# Many-to-many: an experience can demonstrate several O*NET skills,
# and a skill can be demonstrated by many experiences.
experience_skills = Table(
    "experience_skills",
    Base.metadata,
    Column("experience_id", UUID(as_uuid=False), ForeignKey("experiences.id"), primary_key=True),
    Column("skill_id", String, ForeignKey("skills.onet_id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=True)
    target_role = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    experiences = relationship("Experience", back_populates="owner", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="owner", cascade="all, delete-orphan")


class Skill(Base):
    """
    A skill drawn from a real labor-market taxonomy (O*NET or Lightcast),
    not an invented label. `onet_id` holds the O*NET-SOC element ID
    (e.g. "2.B.1.a" for Oral Comprehension) or a Lightcast skill ID
    if LIGHTCAST_MODE is used instead — see skills_taxonomy.py.
    """
    __tablename__ = "skills"

    onet_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)  # e.g. "Basic Skills", "Social Skills"
    source = Column(String, default="ONET")    # "ONET" or "LIGHTCAST"

    experiences = relationship("Experience", secondary=experience_skills, back_populates="skills")


class Experience(Base):
    """
    One discovered activity: the user's raw description, the interview
    answers that back it up, and the skills it was mapped to.
    Nothing here is written by the AI without a corresponding user answer
    in `evidence` — see ai/parser.py for the enforcement.
    """
    __tablename__ = "experiences"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)

    category = Column(String, nullable=False)          # e.g. "COMMUNITIES"
    title = Column(String, nullable=False)              # AI-generated, human-readable title
    raw_input = Column(Text, nullable=False)             # user's own words
    evidence = Column(JSON, nullable=False)              # list of Q&A pairs from the interview
    resume_bullet = Column(Text, nullable=False)         # AI-phrased, evidence-grounded bullet
    ai_confidence_notes = Column(Text, nullable=True)    # AI's own note on what it could NOT verify
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="experiences")
    skills = relationship("Skill", secondary=experience_skills, back_populates="experiences")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    template = Column(String, default="PATH")
    color = Column(String, default="indigo")
    font = Column(String, default="Space Grotesk")
    experience_ids = Column(JSON, default=list)  # ordered list of Experience.id to include
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="resumes")
