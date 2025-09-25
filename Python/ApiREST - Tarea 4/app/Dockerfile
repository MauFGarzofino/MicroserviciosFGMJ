FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dependencias del sistema (opcional, pero útil para compilación de libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Copia e instala requirements primero para aprovechar cache
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copia el código
COPY . .

# Exponer puerto de Flask
EXPOSE 3000

# Comando default (producción ligera con gunicorn)
# Si prefieres el servidor de Flask en dev, cambia por: python app.py
CMD ["gunicorn", "-b", "0.0.0.0:3000", "app:app", "--workers", "3", "--timeout", "60"]