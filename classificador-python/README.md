# API simples com FastAPI

Projeto mínimo de API em Python usando FastAPI e Uvicorn.

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

## Como executar

```bash
uvicorn main:app --reload
```

Se o comando acima não funcionar, tente:

```bash
python -m uvicorn main:app --reload
```

## Endpoints

- `GET /` retorna uma mensagem simples.
- `GET /health` retorna o status da aplicação.
- `POST /classificar` recebe um JSON com `texto` e devolve uma classificação simples.

Exemplo de requisição:

```json
{
	"texto": "Este é um exemplo de entrada"
}
```