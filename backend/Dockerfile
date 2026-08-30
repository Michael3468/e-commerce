FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Upgrade pip and install dependencies (psycopg[binary] does not require libpq-dev/build-essential)
RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . /app/

# Expose port
EXPOSE 8000

# Run gunicorn by default
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

