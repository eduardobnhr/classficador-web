from __future__ import annotations

from fastapi import FastAPI, HTTPException

from .ml.predict import ModelNotTrainedError, load_model, model_is_ready, predict_category
from .schemas import ClassificationRequest, ClassificationResponse, HealthResponse


app = FastAPI(title="Classificador de Incidentes", version="1.0.0")


@app.on_event("startup")
def startup_event() -> None:
    if model_is_ready():
        try:
            load_model()
        except ModelNotTrainedError:
            pass


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "API de classificacao pronta"}


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", model_loaded=model_is_ready())


@app.post("/classificar", response_model=ClassificationResponse)
def classificar(payload: ClassificationRequest) -> ClassificationResponse:
    try:
        category, confidence = predict_category(payload.title, payload.description)
    except ModelNotTrainedError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return ClassificationResponse(
        title=payload.title,
        description=payload.description,
        category=category,
        confidence=confidence,
    )