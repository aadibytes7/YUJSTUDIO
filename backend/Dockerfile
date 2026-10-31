FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt \
 && useradd --create-home --uid 10001 yuj
COPY index.html styles.css app.js gateway.py ./
COPY assets ./assets
USER yuj
EXPOSE 8088
CMD ["uvicorn", "gateway:app", "--host", "0.0.0.0", "--port", "8088", "--proxy-headers", "--forwarded-allow-ips", "127.0.0.1"]
