"""Celery configuration for the e-commerce project."""
import os
from celery import Celery

# Устанавливаем настройки Django по умолчанию для Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('ecommerce')

# Загружаем настройки из Django settings с префиксом CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# Автоматически находим таски в установленных приложениях (tasks.py)
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task for verifying Celery worker execution."""
    print(f'Request: {self.request!r}')
