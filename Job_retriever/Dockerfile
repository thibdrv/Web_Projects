FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PORT=8000
WORKDIR /app

COPY requirements.txt requirements-web.txt ./
RUN pip install --no-cache-dir -r requirements-web.txt

COPY engine.py excel_io.py experience.py settings.py webapp.py ./
COPY sources ./sources
COPY web ./web

RUN useradd --create-home app
USER app

# One worker: the searches in progress are kept in its memory. Threads handle the visitors.
CMD gunicorn --workers 1 --threads 16 --timeout 60 --bind 0.0.0.0:${PORT} webapp:app
