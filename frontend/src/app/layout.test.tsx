import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('рендерит контейнер и дочерний контент', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Дочерний контент</div>
      </RootLayout>,
    );

    expect(
      screen.getByRole('navigation', { name: 'Основная навигация' }),
    ).toBeInTheDocument();
    expect(getByText('Дочерний контент')).toBeInTheDocument();
  });

  // Расширения браузера (например, Dark Reader) могут добавлять атрибуты на
  // <html> уже после SSR, что вызывает конфликт гидратации. В layout.tsx на
  // корневом <html> стоит suppressHydrationWarning — это зарезервированный
  // проп React, который обрабатывается во время гидратации и не сериализуется
  // в разметку. Поэтому здесь проверяем корректность SSR-разметки корневого
  // элемента, а сам механизм подавления проверки остаётся за React.
  it('формирует корректную серверную разметку корневого <html>', () => {
    const markup = renderToStaticMarkup(<RootLayout>{null}</RootLayout>);

    expect(markup).toContain('<html lang="ru"');
    expect(markup).toContain('</html>');
  });
});
