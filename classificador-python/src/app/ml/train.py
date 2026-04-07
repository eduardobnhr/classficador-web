from __future__ import annotations

import json
from pathlib import Path

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


def build_pipeline() -> Pipeline:
    return Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    max_features=10000,
                    min_df=1,
                ),
            ),
            ("nb", MultinomialNB()),
        ]
    )


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

    pipeline = build_pipeline()
    pipeline.fit(x_train, y_train)

    y_pred = pipeline.predict(x_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, model_path)

    metrics = {
        "accuracy": accuracy,
        "classification_report": report,
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