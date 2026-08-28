import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './Card';

describe('Card component', () => {
  it('рендерит дочерние элементы и применяет базовые классы анимации при ховере', () => {
    render(<Card>Содержимое карточки</Card>);

    const card = screen.getByText('Содержимое карточки');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass(
      'rounded-xl',
      'transition-all',
      'duration-300',
      'ease-out',
      'hover:-translate-y-1',
      'hover:shadow-lg',
    );
  });

  it('позволяет передавать дополнительные className и HTML-атрибуты', () => {
    render(
      <Card className="custom-class" data-testid="custom-card">
        Тест
      </Card>,
    );

    const card = screen.getByTestId('custom-card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('hover:-translate-y-1');
  });
});
