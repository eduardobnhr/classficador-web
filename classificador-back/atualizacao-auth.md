# Refatoração de Autenticação Backend (NestJS): JWT para Cookies HttpOnly com CSRF

Atue como um desenvolvedor especialista em NestJS. Sua tarefa é refatorar o sistema de autenticação atual do backend. Devemos migrar a entrega do JWT de uma resposta JSON padrão para a utilização de Cookies `HttpOnly`, e já deixar a proteção CSRF configurada e pronta para ser consumida por um futuro frontend.

Siga rigorosamente as etapas abaixo:

## Etapa 1: Configurações Base e Dependências
* Instale os pacotes necessários: `cookie-parser` e a solução de CSRF atual recomendada para NestJS.
* Registre o `cookie-parser` globalmente no arquivo `main.ts`.
* Altere as configurações de CORS no `main.ts` para habilitar `credentials: true`. Como o frontend ainda não está definido, remova a origem curinga (`origin: '*'`) e deixe um array de origens permitidas (ex: `['http://localhost:4200']`) ou uma variável de ambiente preparada.

## Etapa 2: Modificando Login e Logout
* Refatore o Controller e Service de Login para não retornar mais o JWT no corpo da resposta JSON.
* No endpoint de Login, defina o JWT em um cookie na resposta (`res.cookie`) utilizando as flags obrigatórias: `httpOnly: true`, `secure: true` (se em produção) e `sameSite: 'strict'` (ou 'lax').
* Crie um endpoint de Logout (`POST /logout`) que retorne o cookie de autenticação com uma data de expiração no passado ou com valor limpo, para que o navegador destrua a sessão.

## Etapa 3: Atualizando a Validação do Token
* Atualize o `JwtStrategy` (ou seu Guard de autenticação principal). Ele deve parar de procurar o token no cabeçalho `Authorization: Bearer` e passar a extrair o token JWT diretamente de `request.cookies['nome_do_seu_cookie']`.

## Etapa 4: Implementando Proteção CSRF
* Ative e configure o middleware de CSRF no `main.ts`.
* Prepare a entrega do token CSRF para o futuro frontend de forma segura. Faça isso criando uma rota `GET /csrf-token` que retorne o token, OU configurando o NestJS para anexar o token CSRF em um cookie padrão (não-HttpOnly) chamado `XSRF-TOKEN`.
* Assegure-se de que a validação do CSRF esteja ativa para interceptar e validar requisições de mutação (POST, PUT, DELETE, PATCH).