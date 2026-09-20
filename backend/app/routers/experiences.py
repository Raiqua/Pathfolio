from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..ai.parser import parse_experience

router = APIRouter(prefix="/experiences", tags=["experiences"])


@router.post("", response_model=schemas.ExperienceOut)
def create_experience(payload: schemas.ExperienceCreateRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    evidence_dicts = [qa.model_dump() for qa in payload.evidence]

    try:
        parsed = parse_experience(payload.category, evidence_dicts)
    except Exception as e:
        raise HTTPException(502, f"AI parsing failed, try again: {e}")

    skills = (
        db.query(models.Skill)
        .filter(models.Skill.onet_id.in_(parsed["skill_ids"]))
        .all()
    )

    experience = models.Experience(
        user_id=payload.user_id,
        category=payload.category,
        title=parsed["title"],
        raw_input=payload.raw_input,
        evidence=evidence_dicts,
        resume_bullet=parsed["resume_bullet"],
        ai_confidence_notes=parsed.get("confidence_notes") or None,
        skills=skills,
    )
    db.add(experience)
    db.commit()
    db.refresh(experience)
    return experience


@router.get("/user/{user_id}", response_model=list[schemas.ExperienceOut])
def list_experiences(user_id: str, db: Session = Depends(get_db)):
    return (
        db.query(models.Experience)
        .filter(models.Experience.user_id == user_id)
        .order_by(models.Experience.created_at.desc())
        .all()
    )


@router.delete("/{experience_id}")
def delete_experience(experience_id: str, db: Session = Depends(get_db)):
    exp = db.query(models.Experience).filter(models.Experience.id == experience_id).first()
    if not exp:
        raise HTTPException(404, "Experience not found")
    db.delete(exp)
    db.commit()
    return {"deleted": experience_id}
