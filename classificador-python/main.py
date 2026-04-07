from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(title="Classificador Python API", version="1.0.0")


class ItemRequest(BaseModel):
    texto: str


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "API simples com FastAPI e Uvicorn"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/classificar")
def classificar(payload: ItemRequest) -> dict[str, object]:
    texto = payload.texto.strip()

    if not texto:
        return {"entrada": payload.texto, "classe": "vazio", "confianca": 0.0}

    if len(texto) >= 50:
        classe = "texto_longo"
        confianca = 0.92
    else:
        classe = "texto_curto"
        confianca = 0.78

    return {"entrada": texto, "classe": classe, "confianca": confianca}