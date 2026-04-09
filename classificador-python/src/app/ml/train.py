from __future__ import annotations

import itertools
import json
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

from .preprocess import prepare_text


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATASET_PATH = PROJECT_ROOT / "dataset" / "dataset.csv"
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "text_classifier.joblib"
METRICS_PATH = ARTIFACTS_DIR / "metrics.json"
EXPECTED_CATEGORIES = {
    "phishing",
    "malware",
    "brute_force",
    "ddos",
    "vazamento_de_dados",
}

# Model selection prioritizes classification quality.
# Confidence is used only as a secondary tie-breaker.
SELECTION_MIN_F1_IMPROVEMENT = 0.0005

PARAM_GRID = {
    "ngram_range": [(1, 1), (1, 2), (1, 3)],
    "max_features": [10000, 20000],
    "min_df": [1, 2],
    "max_df": [0.9, 0.95, 1.0],
    "sublinear_tf": [False, True],
    "alpha": [0.1, 0.3, 0.7, 1.0],
}


def load_dataset(dataset_path: Path = DATASET_PATH) -> pd.DataFrame:
    dataframe = pd.read_csv(dataset_path)

    required_columns = {"title", "description", "category"}
    missing_columns = required_columns - set(dataframe.columns)
    if missing_columns:
        missing_list = ", ".join(sorted(missing_columns))
        raise ValueError(f"Colunas ausentes no dataset: {missing_list}")

    dataframe = dataframe.copy()
    for column in required_columns:
        dataframe[column] = dataframe[column].fillna("").astype(str).str.strip()

    dataframe = dataframe[
        (dataframe["title"] != "")
        & (dataframe["description"] != "")
        & (dataframe["category"] != "")
    ]

    categories = set(dataframe["category"].unique())
    invalid_categories = categories - EXPECTED_CATEGORIES
    if invalid_categories:
        invalid_list = ", ".join(sorted(invalid_categories))
        raise ValueError(f"Categorias inesperadas no dataset: {invalid_list}")

    counts = dataframe["category"].value_counts()
    if counts.empty or counts.min() < 2:
        raise ValueError("Cada categoria precisa ter pelo menos 2 exemplos para treinar.")

    return dataframe


def build_samples(dataframe: pd.DataFrame) -> tuple[list[str], list[str]]:
    texts = [prepare_text(title, description) for title, description in zip(dataframe["title"], dataframe["description"])]
    labels = dataframe["category"].tolist()
    return texts, labels


def build_pipeline(params: dict[str, Any]) -> Pipeline:
    return Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=params["ngram_range"],
                    max_features=params["max_features"],
                    max_df=params["max_df"],
                    min_df=params["min_df"],
                    sublinear_tf=params["sublinear_tf"],
                ),
            ),
            ("nb", MultinomialNB(alpha=params["alpha"])),
        ]
    )


def iter_param_combinations() -> list[dict[str, Any]]:
    keys = list(PARAM_GRID.keys())
    combinations = itertools.product(*(PARAM_GRID[key] for key in keys))
    return [dict(zip(keys, values)) for values in combinations]


def evaluate_pipeline(
    pipeline: Pipeline,
    x_test: list[str],
    y_test: list[str],
) -> dict[str, Any]:
    y_pred = pipeline.predict(x_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    avg_confidence = 0.0
    if hasattr(pipeline, "predict_proba"):
        probabilities = pipeline.predict_proba(x_test)
        max_confidences = probabilities.max(axis=1)
        avg_confidence = float(max_confidences.mean())

    macro_f1 = float(report.get("macro avg", {}).get("f1-score", 0.0))
    return {
        "accuracy": accuracy,
        "classification_report": report,
        "macro_f1": macro_f1,
        "avg_confidence": avg_confidence,
    }


def is_better_result(candidate: dict[str, Any], current_best: dict[str, Any] | None) -> bool:
    if current_best is None:
        return True

    candidate_f1 = candidate["macro_f1"]
    current_f1 = current_best["macro_f1"]

    # Primary criterion: macro F1 should clearly improve.
    if candidate_f1 > current_f1 + SELECTION_MIN_F1_IMPROVEMENT:
        return True
    if candidate_f1 + SELECTION_MIN_F1_IMPROVEMENT < current_f1:
        return False

    # Tie-breaker 1: higher accuracy.
    if candidate["accuracy"] > current_best["accuracy"]:
        return True
    if candidate["accuracy"] < current_best["accuracy"]:
        return False

    # Tie-breaker 2: higher average confidence.
    return candidate["avg_confidence"] > current_best["avg_confidence"]


def train_and_save_model(
    dataset_path: Path = DATASET_PATH,
    model_path: Path = MODEL_PATH,
    metrics_path: Path = METRICS_PATH,
) -> dict[str, object]:
    dataframe = load_dataset(dataset_path)
    texts, labels = build_samples(dataframe)

    x_train, x_test, y_train, y_test = train_test_split(
        texts,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels,
    )

    tuning_results: list[dict[str, Any]] = []
    best_pipeline: Pipeline | None = None
    best_result: dict[str, Any] | None = None
    best_params: dict[str, Any] | None = None

    for params in iter_param_combinations():
        pipeline = build_pipeline(params)
        pipeline.fit(x_train, y_train)

        result = evaluate_pipeline(pipeline, x_test, y_test)
        result["params"] = {
            **params,
            "ngram_range": list(params["ngram_range"]),
        }
        tuning_results.append(result)

        if is_better_result(result, best_result):
            best_result = result
            best_pipeline = pipeline
            best_params = params

    if best_pipeline is None or best_result is None or best_params is None:
        raise RuntimeError("Falha ao selecionar o melhor modelo durante o treino.")

    # Train a final model on the full dataset with the best parameters.
    final_pipeline = build_pipeline(best_params)
    final_pipeline.fit(texts, labels)

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(final_pipeline, model_path)

    metrics = {
        "accuracy": best_result["accuracy"],
        "classification_report": best_result["classification_report"],
        "macro_f1": best_result["macro_f1"],
        "avg_confidence": best_result["avg_confidence"],
        "selection_strategy": {
            "primary": "macro_f1",
            "tie_breakers": ["accuracy", "avg_confidence"],
            "min_f1_improvement": SELECTION_MIN_F1_IMPROVEMENT,
        },
        "best_params": {
            **best_params,
            "ngram_range": list(best_params["ngram_range"]),
        },
        "grid_search_candidates": len(tuning_results),
        "final_model_trained_on_full_dataset": True,
        "tuning_results": sorted(
            tuning_results,
            key=lambda item: (
                item["macro_f1"],
                item["accuracy"],
                item["avg_confidence"],
            ),
            reverse=True,
        )[:10],
        "dataset_rows": int(len(dataframe)),
        "train_rows": int(len(x_train)),
        "test_rows": int(len(x_test)),
    }

    metrics_path.write_text(json.dumps(metrics, indent=2, ensure_ascii=False), encoding="utf-8")
    return metrics


def main() -> None:
    metrics = train_and_save_model()
    print(json.dumps(metrics, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()