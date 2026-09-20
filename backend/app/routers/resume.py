from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("", response_model=schemas.ResumeOut)
def upsert_resume(payload: schemas.ResumeCreateRequest, db: Session = Depends(get_db)):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == payload.user_id)
        .first()
    )
    if resume:
        resume.template = payload.template
        resume.color = payload.color
        resume.font = payload.font
        resume.experience_ids = payload.experience_ids
    else:
        resume = models.Resume(
            user_id=payload.user_id,
            template=payload.template,
            color=payload.color,
            font=payload.font,
            experience_ids=payload.experience_ids,
        )
        db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/user/{user_id}", response_model=schemas.ResumeOut)
def get_resume(user_id: str, db: Session = Depends(get_db)):
    resume = db.query(models.Resume).filter(models.Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(404, "No resume yet for this user")
    return resume
