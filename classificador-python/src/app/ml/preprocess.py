from __future__ import annotations

import re
import unicodedata


def normalize_text(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[^a-z0-9\s]", " ", ascii_text)
    ascii_text = re.sub(r"\s+", " ", ascii_text)
    return ascii_text.strip()


def combine_title_description(title: str, description: str) -> str:
    return f"{title} {description}".strip()


def prepare_text(title: str, description: str) -> str:
    return normalize_text(combine_title_description(title, description))