import Image from 'next/image';

/**
 * Пропсы для компонента PizzaImage.
 */
interface PizzaImageProps {
  /**
   * Дополнительные CSS-классы (например, классы анимации вращения).
   */
  className?: string;
}

/**
 * Фоновое изображение пиццы.
 *
 * @param props - Свойства компонента.
 * @param props.className - Дополнительные CSS-классы.
 * @returns Элемент фонового изображения.
 */
function PizzaImage({ className = '' }: Readonly<PizzaImageProps>) {
  return (
    <div className={className}>
      <Image
        src="/pizza1.png"
        alt=""
        width={500}
        height={500}
        className="h-auto w-full object-contain"
        priority
      />
    </div>
  );
}

/**
 * Фоновый декоративный компонент с циклически вращающимися пиццами.
 *
 * @returns Фоновые декоративные элементы.
 */
export default function Background() {
  return (
    <div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Слева ближе к верху — по часовой стрелке */}
        <div className="absolute -left-24 top-24 w-72 md:w-96 lg:w-[480px] -rotate-12 opacity-25 select-none">
          <PizzaImage className="animate-spin-slow" />
        </div>

        {/* Справа ближе к низу — против часовой стрелки */}
        <div className="absolute -right-24 bottom-24 w-72 md:w-96 lg:w-[480px] rotate-45 opacity-25 select-none">
          <PizzaImage className="animate-spin-slow" />
        </div>

        {/* По центру — по часовой стрелке */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 lg:w-[480px] rotate-12 opacity-20 select-none">
          <PizzaImage className="animate-spin-reverse-slow" />
        </div>
      </div>
    </div>
  );
}
