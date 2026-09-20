from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://pathfolio:pathfolio@localhost:5432/pathfolio"
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    frontend_origin: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()
