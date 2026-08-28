import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Background from './Background';

describe('Background', () => {
  it('рендерит фоновые изображения с анимациями вращения', () => {
    const { container } = render(<Background />);

    const spinElements = container.querySelectorAll('.animate-spin-slow');
    const spinReverseElements = container.querySelectorAll(
      '.animate-spin-reverse-slow',
    );

    // Первая и третья пиццы вращаются по часовой стрелке
    expect(spinElements).toHaveLength(2);
    // Вторая пицца вращается против часовой стрелки
    expect(spinReverseElements).toHaveLength(1);
  });
});
