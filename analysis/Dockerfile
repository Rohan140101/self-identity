FROM python:3.13.12

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libx11-xcb1 \
    libxtst6 \
    fonts-liberation \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*


COPY analysis/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN playwright install chromium
RUN playwright install-deps

RUN yes y | plotly_get_chrome

COPY . .
WORKDIR /app/analysis
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]