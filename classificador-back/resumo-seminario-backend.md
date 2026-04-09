# Análise Técnica: Backend - Classificador Web

### 🚀 Principais Tecnologias
*   **Framework:** **NestJS** (Node.js) – Arquitetura robusta, modular e escalável.
*   **Linguagem:** **TypeScript** – Adiciona tipagem estática ao JavaScript, reduzindo erros em tempo de desenvolvimento.
*   **Banco de Dados:** **PostgreSQL** – Banco de dados relacional potente para armazenamento seguro dos dados.
*   **ORM:** **TypeORM** – Facilita a interação com o banco de dados através de objetos, simplificando consultas complexas.
*   **Segurança:** Implementação de JWT (Autenticação), Bcrypt (Criptografia) e CSRF (Proteção contra vulnerabilidades web).
*   **Documentação:** **Swagger (OpenAPI)** – Interface interativa para visualização e teste de todos os endpoints da API.

### 🛠️ Funcionalidades Chave
1.  **Gestão de Usuários:** Sistema completo de CRUD com controle de permissões (Roles) para Administradores e Usuários comuns.
2.  **Autenticação Centralizada:** Fluxo de login seguro com proteção de rotas via decodificação de tokens.
3.  **Gestão de Incidentes:** Cadastro e acompanhamento detalhado de ocorrências registradas no sistema.
4.  **Integração de Inteligência:** Comunicação via HTTP com uma **API externa em Python** para classificação inteligente dos dados.
5.  **Dashboard Estatístico:** Agregação de dados para fornecer métricas visuais sobre o estado dos incidentes.

### 🔐 Criptografia de Senhas
O sistema prioriza a segurança dos dados sensíveis utilizando a biblioteca **Bcrypt**:
*   **Fluxo de Hashing:** A senha original nunca é salva. O sistema aplica o algoritmo de hashing junto a um **Salt** (caracteres aleatórios), gerando uma string única e irreversível.
*   **Segurança:** Mesmo que o banco de dados seja acessado indevidamente, as senhas originais permanecem protegidas, pois o processo de hashing é unidirecional.
*   **Comparação:** No momento do login, o sistema compara o hash gerado pela senha digitada com o hash armazenado, garantindo a autenticidade sem expor o dado real.

### 🔑 Autenticação
*   **Mecanismo:** Utiliza o padrão **JWT (JSON Web Token)**.
*   **Funcionamento:** 
    1. Após validar as credenciais, o servidor gera um token assinado com uma chave secreta do backend.
    2. O frontend armazena este token e o envia no cabeçalho `Authorization: Bearer <token>` em cada requisição.
    3. O backend utiliza **Passport Strategies** e **Guards** para validar se o token é legítimo e não expirou.
*   **Proteção de Sessão:** O uso de cookies e tokens JWT permite uma autenticação *stateless*, ideal para escalabilidade.

### 📊 Tratamento de Dados (Entrada e Saída)
*   **Entrada (Input):**
    - **DTOs (Data Transfer Objects):** Definem contratos claros para os dados aceitos.
    - **Validação Automática:** Uso de `class-validator` para rejeitar requisições com dados malformados (ex: email inválido) antes mesmo de processar o código.
*   **Saída (Output):**
    - **Sanitização:** O sistema garante que propriedades internas (como `password_hash` ou IDs internos) sejam ocultadas ou removidas das respostas enviadas ao cliente.
    - **Consistência:** Todas as respostas seguem um padrão de tipagem consistente, facilitando a integração com o frontend.
