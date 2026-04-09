# Análise Técnica: Frontend - Classificador Web

### 🚀 Principais Tecnologias
*   **Framework:** **Angular 17** – Framework robusto para construção de Single Page Applications (SPAs).
*   **Linguagem:** **TypeScript** – Fornece tipagem forte e recursos modernos de POO para o frontend.
*   **Biblioteca de UI:** **PrimeNG** – Coleção rica de componentes de interface (tabelas, formulários, modais) com design profissional.
*   **Ícones:** **PrimeIcons** – Conjunto de ícones vetoriais integrados ao ecossistema Prime.
*   **Gráficos:** **Chart.js** – Utilizado para renderizar estatísticas visuais no dashboard.
*   **Programação Reativa:** **RxJS** – Gerenciamento de fluxos de dados assíncronos e eventos de forma eficiente.

### 🛠️ Funcionalidades Chave
1.  **Interface de Login:** Tela de autenticação integrada ao backend com tratamento de erros.
2.  **Dashboard Dinâmico:** Visualização de dados de incidentes através de gráficos interativos (Pizza, Barras).
3.  **Gestão de Incidentes:** Listagem, filtragem e formulários detalhados para registro de ocorrências.
4.  **Sistema de Temas:** Interface moderna e responsiva que se adapta a diferentes tamanhos de tela.
5.  **Notificações em Tempo Real:** Uso de componentes de "Toast" do PrimeNG para feedback imediato ao usuário (sucesso, erro, avisos).

### 🔑 Autenticação e Segurança
*   **Gerenciamento de Token:** O `AuthService` é responsável por armazenar o **JWT** de forma segura no `localStorage` após o login.
*   **Interceptor de Requisições:** Implementação de um `AuthInterceptor` que intercepta automaticamente todas as chamadas HTTP para o backend e anexa o token de autorização no cabeçalho.
*   **Guardas de Rota (Guards):** Proteção de rotas no lado do cliente, impedindo que usuários não autenticados acessem áreas restritas do sistema.
*   **Fluxo de Logout:** Limpeza centralizada de tokens e redirecionamento automático para a tela de login.

### 📊 Tratamento de Dados e Comunicação
*   **Formulários Reativos:** Uso de `ReactiveFormsModule` para validações complexas no lado do cliente (ex: campos obrigatórios, formatos de email, tamanhos de senha) antes do envio.
*   **Serviços Desacoplados:** A lógica de comunicação com a API é isolada em serviços dedicados (`IncidentService`, `AuthService`), seguindo o princípio de responsabilidade única.
*   **Consumo de API REST:** Uso do módulo `HttpClient` do Angular para interações assíncronas e tipadas com o Backend.
*   **Feedback Visual:** Uso de estados de carregamento (spinners/skeletons) para melhorar a experiência do usuário durante requisições lentas.
