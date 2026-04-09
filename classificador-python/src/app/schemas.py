from pydantic import BaseModel, Field, field_validator


class ClassificationRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)

    @field_validator("title", "description")
    @classmethod
    def strip_and_validate(cls, value: str) -> str:
        cleaned_value = value.strip()
        if not cleaned_value:
            raise ValueError("O campo nao pode ficar vazio.")
        return cleaned_value


class ClassificationResponse(BaseModel):
    title: str
    description: str
    category: str
    confidence: float
    severity: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool