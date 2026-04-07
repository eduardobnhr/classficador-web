export interface IApiClassificacaoPythonResponse {
    category: string;
    severity: string;
    confidence_score: number;
    recommended_actions: string[];
}