from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import joblib

from .preprocess import prepare_text


PROJECT_ROOT = Path(__file__).resolve().parents[3]
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "text_classifier.joblib"


class ModelNotTrainedError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def load_model():
    if not MODEL_PATH.exists():
        raise ModelNotTrainedError("Modelo nao encontrado. Execute o treino primeiro.")

    return joblib.load(MODEL_PATH)


def model_is_ready() -> bool:
    return MODEL_PATH.exists()


def predict_category(title: str, description: str) -> tuple[str, float]:
    model = load_model()
    text = prepare_text(title, description)
    category = model.predict([text])[0]

    confidence = 0.0
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba([text])[0]
        confidence = float(max(probabilities))

    return str(category), confidence