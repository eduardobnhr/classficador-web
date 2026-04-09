from __future__ import annotations

from .preprocess import prepare_text


SEVERITY_LEVELS = ["baixa", "moderada", "alta", "muito_alta"]

# Base severity by predicted category.
BASE_SEVERITY_BY_CATEGORY = {
    "phishing": "moderada",
    "brute_force": "moderada",
    "malware": "alta",
    "ddos": "alta",
    "vazamento_de_dados": "muito_alta",
}

# Terms that usually indicate broader impact and should raise severity.
RAISE_SEVERITY_KEYWORDS = {
    "ransomware",
    "exfiltracao",
    "vazamento",
    "lsass",
    "indisponivel",
    "indisponibilidade",
    "fora do ar",
    "sistema critico",
    "dados pessoais",
    "dados sensiveis",
    "producao",
    "privilegio",
    "administrador",
    "persistencia",
    "botnet",
    "criptograf",
    "sequestro",
}

# Terms that usually indicate controlled scenarios and should reduce severity.
LOWER_SEVERITY_KEYWORDS = {
    "simulacao",
    "simulado",
    "teste controlado",
    "treinamento",
    "sem impacto",
    "contido",
    "bloqueado a tempo",
    "tentativa bloqueada",
    "sandbox",
}


def _level_to_index(level: str) -> int:
    return SEVERITY_LEVELS.index(level)


def _index_to_level(index: int) -> str:
    safe_index = max(0, min(index, len(SEVERITY_LEVELS) - 1))
    return SEVERITY_LEVELS[safe_index]


def infer_severity(category: str, title: str, description: str) -> str:
    base_level = BASE_SEVERITY_BY_CATEGORY.get(category, "moderada")
    severity_index = _level_to_index(base_level)

    normalized_text = prepare_text(title, description)

    raise_hits = sum(1 for keyword in RAISE_SEVERITY_KEYWORDS if keyword in normalized_text)
    lower_hits = sum(1 for keyword in LOWER_SEVERITY_KEYWORDS if keyword in normalized_text)

    # Raise by one level if at least one high-impact indicator appears.
    if raise_hits >= 1:
        severity_index += 1

    # Raise one extra level when impact signals are strong and cumulative.
    if raise_hits >= 3:
        severity_index += 1

    # Lower one level if there is explicit evidence of controlled/contained scenario.
    if lower_hits >= 1:
        severity_index -= 1

    return _index_to_level(severity_index)