"""Init file for config package to expose Celery app."""
from .celery import app as celery_app

__all__ = ('celery_app',)
