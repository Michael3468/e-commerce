"""Management command to populate database with sample products."""
from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Populates the database with initial categories and products'

    def handle(self, *args, **options):
        self.stdout.write('Заполнение базы данных товарами...')

        # после перезапуска контейнера (команда seed_products выполняется при старте).
        drinks_cat, _ = Category.objects.get_or_create(name='Напитки', slug='drinks')
        snacks_cat, _ = Category.objects.get_or_create(name='Закуски', slug='snacks')

        sample_products = [
            {
                'title': 'Морс клюквенный',
                'description': 'Натуральный морс из лесной клюквы 0.5л',
                'price': 150,
                'category': drinks_cat,
                'image_url': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60',
            },
            {
                'title': 'Картофель фри',
                'description': 'Хрустящий картофель фри с солью и соусом на выбор',
                'price': 190,
                'category': snacks_cat,
                'image_url': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
            },
        ]

        for p_data in sample_products:
            Product.objects.update_or_create(
                title=p_data['title'],
                defaults=p_data,
            )

        self.stdout.write(self.style.SUCCESS(f'Успешно загружено {len(sample_products)} товаров!'))
