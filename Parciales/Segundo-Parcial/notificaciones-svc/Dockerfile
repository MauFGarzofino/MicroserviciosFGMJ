FROM python:3.12-alpine
WORKDIR /app
RUN pip install --no-cache-dir Flask==3.0.0
COPY app.py /app/app.py
EXPOSE 3003
CMD ["python", "app.py"]
