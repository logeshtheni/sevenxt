from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from . import service, schemas

router = APIRouter(prefix="/b2b", tags=["B2B Management"])

@router.get("/users", response_model=List[schemas.B2BResponse])
def read_b2b_users(db: Session = Depends(get_db)):
    """
    Fetch all B2B applications including Business Name, GSTIN, PAN, and Documents.
    """
    users = service.get_b2b_users(db)
    return users

@router.put("/verify/{id}", response_model=schemas.B2BResponse)
def verify_b2b_user(id: int, status_update: schemas.B2BStatusUpdate, db: Session = Depends(get_db)):
    """
    Update B2B status to Verified or Rejected.
    """
    updated_user = service.update_status(db, id, status_update.status)
    if not updated_user:
        raise HTTPException(status_code=404, detail="B2B Application not found")
    return updated_user