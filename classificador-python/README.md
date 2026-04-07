# Classificador de Incidentes

Projeto de API em Python usando FastAPI, Uvicorn, TF-IDF e Naive Bayes para classificar títulos e descrições em:

- phishing
- malware
- brute_force
- ddos
- vazamento_de_dados

## Estrutura

```text
dataset/
	dataset.csv
src/
	app/
		main.py
		schemas.py
		ml/
			preprocess.py
			predict.py
			train.py
artifacts/
	.gitkeep
main.py
requirements.txt
```

## Instalação

```bash
pip install -r requirements.txt
```

## Ambiente virtual no Windows

Não precisa criar um arquivo `.env` para a API funcionar.
O que pode ser útil é criar um ambiente virtual Python, por exemplo com `.venv`:

```bash
python -m venv .venv
```

Ative com um destes comandos:

```powershell
.venv\Scripts\Activate.ps1
```

```cmd
.venv\Scripts\activate.bat
```

Depois instale as dependências:

```bash
pip install -r requirements.txt
```

## Treinar o modelo

```bash
python -m src.app.ml.train
```

Esse comando lê `dataset/dataset.csv`, treina o pipeline e salva os artefatos em `artifacts/`.

## Como executar a API

```bash
uvicorn src.app.main:app --reload
```

Se preferir, este comando também funciona por compatibilidade:

```bash
uvicorn main:app --reload
```

## Endpoints

- `GET /` retorna uma mensagem simples.
- `GET /health` retorna o status da API e informa se o modelo está carregado.
- `POST /classificar` recebe `title` e `description` e devolve a classe prevista.

Exemplo de requisição:

```json
{
	"title": "E-mail suspeito de senha",
	"description": "Mensagem pede clique em link externo para redefinir acesso."
}
```

## Fluxo recomendado

1. Ajustar o dataset.
2. Rodar o treino.
3. Subir a API.
4. Testar o endpoint de classificação.