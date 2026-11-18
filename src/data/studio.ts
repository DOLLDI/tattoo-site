import type { PortfolioWork, TattooStyle } from '../utils/portfolioFilter';

export interface StudioSpaceItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  slotNote: string;
}

export const STUDIO_SPACES: readonly StudioSpaceItem[] = [
  {
    id: 'space-workstation',
    title: 'Приватные рабочие боксы',
    caption:
      'Изолированное пространство для каждого сеанса: акустический комфорт, регулируемый свет 5600K CRI 98+ и эргономика без постороннего шума.',
    image: '/assets/stills/craft-process.jpg',
    slotNote: 'Временный кадр · Заменяется фотографией рабочего бокса',
  },
  {
    id: 'space-sterility',
    title: 'Медицинский стандарт стерильности',
    caption:
      'Автоклавная обработка класса B, барьерная защита всех поверхностей и строго одноразовые сертифицированные картриджи.',
    image: '/assets/stills/rotary-machine.jpg',
    slotNote: 'Временный кадр · Заменяется фотографией зоны стерилизации',
  },
  {
    id: 'space-design',
    title: 'Лаборатория эскиза',
    caption:
      'Индивидуальная разработка проекта с учётом анатомии, контраста кожи и долгосрочной читаемости татуировки.',
    image: '/assets/stills/stencil-detail.jpg',
    slotNote: 'Временный кадр · Заменяется фотографией зоны проектирования',
  },
] as const;

export interface ArtistProfile {
  id: string;
  name: string;
  role: string;
  specialization: string;
  primaryStyle: TattooStyle;
  experience: string;
  bio: string;
  image: string;
  featuredWorkIds: string[];
}

export const ARTISTS: readonly ArtistProfile[] = [
  {
    id: 'artist-vorontsov',
    name: 'Алексей Воронцов',
    role: 'Арт-директор · Резидент (демо-профиль)',
    specialization: 'Black & Grey · Скульптурный реализм',
    primaryStyle: 'Black & Grey',
    experience: '9 лет практики',
    bio: 'Специализируется на монументальных чёрно-серых композициях, античной пластике и многосеансных проектах с высоким контрастом.',
    image: '/assets/stills/statue-black-grey.jpg',
    featuredWorkIds: ['work-1', 'work-4', 'work-7'],
  },
  {
    id: 'artist-romanova',
    name: 'Мила Романова',
    role: 'Ведущий мастер · Резидент (демо-профиль)',
    specialization: 'Realism · Fine Line',
    primaryStyle: 'Realism',
    experience: '7 лет практики',
    bio: 'Создаёт эмоциональные портреты и тонкие графические композиции, сочетая ювелирную точность контура с мягкой тенью.',
    image: '/assets/stills/portrait-realism.jpg',
    featuredWorkIds: ['work-2', 'work-3', 'work-8'],
  },
  {
    id: 'artist-serov',
    name: 'Даниил Серов',
    role: 'Мастер масштабных форм · Резидент (демо-профиль)',
    specialization: 'Blackwork · Биомеханика',
    primaryStyle: 'Blackwork',
    experience: '8 лет практики',
    bio: 'Работает с крупной анатомией: цельные рукава, спина и органические структуры, интегрированные в рельеф тела.',
    image: '/assets/stills/biomech-sleeve.jpg',
    featuredWorkIds: ['work-5', 'work-6'],
  },
  {
    id: 'artist-lebedeva',
    name: 'Кира Лебедева',
    role: 'Мастер авторской графики · Резидент (демо-профиль)',
    specialization: 'Lettering · Custom Tattoo',
    primaryStyle: 'Custom Tattoo',
    experience: '6 лет практики',
    bio: 'Объединяет каллиграфию, орнаментальную геометрию и индивидуальные концепт-эскизы, создаваемые под конкретный силуэт.',
    image: '/assets/stills/mandala-back.jpg',
    featuredWorkIds: ['work-9', 'work-3'],
  },
] as const;

export const PORTFOLIO_WORKS: readonly PortfolioWork[] = [
  {
    id: 'work-1',
    title: 'Marmoreo — Фрагмент античной скульптуры',
    style: 'Black & Grey',
    artistId: 'artist-vorontsov',
    artistName: 'Алексей Воронцов',
    placement: 'Предплечье',
    sessionNote: '1 сеанс · Зажившая работа',
    image: '/assets/stills/statue-black-grey.jpg',
    aspect: 'landscape',
    description:
      'Классический бюст с трещинами мрамора и орнаментальным обрамлением, выстроенный по геометрии предплечья.',
  },
  {
    id: 'work-2',
    title: 'Nocturne Gaze — Камерный портрет',
    style: 'Realism',
    artistId: 'artist-romanova',
    artistName: 'Мила Романова',
    placement: 'Плечо',
    sessionNote: '2 сеанса · Мягкая светотень',
    image: '/assets/stills/portrait-realism.jpg',
    aspect: 'portrait',
    description:
      'Высококонтрастный монохромный портрет с аккуратной проработкой бликов и плавных теневых переходов.',
  },
  {
    id: 'work-3',
    title: 'Botanica & Wave — Японская графика',
    style: 'Fine Line',
    artistId: 'artist-romanova',
    artistName: 'Мила Романова',
    placement: 'Плечо и грудь',
    sessionNote: '2 сеанса · Тонкий контур',
    image: '/assets/stills/japanese-peony.jpg',
    aspect: 'landscape',
    description:
      'Деликатное сочетание пиона и динамичной волны с акцентом на чистоту контура и читаемость формы.',
  },
  {
    id: 'work-4',
    title: 'Synthesis Collage — Анатомия линий',
    style: 'Custom Tattoo',
    artistId: 'artist-vorontsov',
    artistName: 'Алексей Воронцов',
    placement: 'Индивидуальные проекты',
    sessionNote: 'Авторская серия',
    image: '/assets/stills/living-collage.jpg',
    aspect: 'landscape',
    description:
      'Исследование взаимодействия различных техник — от микрографики до плотного теневого объёма.',
  },
  {
    id: 'work-5',
    title: 'Biomechanical Architecture — Полный рукав',
    style: 'Blackwork',
    artistId: 'artist-serov',
    artistName: 'Даниил Серов',
    placement: 'Полный рукав',
    sessionNote: '4 сеанса · Продолжающийся проект',
    image: '/assets/stills/biomech-sleeve.jpg',
    aspect: 'landscape',
    description:
      'Многослойная структура с глубокими тенями, повторяющая естественную механику плеча и предплечья.',
  },
  {
    id: 'work-6',
    title: 'Sacral Geometry — Спинная композиция',
    style: 'Blackwork',
    artistId: 'artist-serov',
    artistName: 'Даниил Серов',
    placement: 'Верхняя часть спины',
    sessionNote: '2 сеанса · Симметрия',
    image: '/assets/stills/mandala-back.jpg',
    aspect: 'portrait',
    description:
      'Центрированный орнаментальный паттерн с плотной графикой и воздушными разрядками.',
  },
  {
    id: 'work-7',
    title: 'Precision Stencil — Работа в процессе',
    style: 'Black & Grey',
    artistId: 'artist-vorontsov',
    artistName: 'Алексей Воронцов',
    placement: 'Плечо',
    sessionNote: 'Детализация контура',
    image: '/assets/stills/craft-process.jpg',
    aspect: 'landscape',
    description:
      'Фрагмент сеанса: точная укладка пигмента вдоль трансферного рисунка в контролируемом освещении.',
  },
  {
    id: 'work-8',
    title: 'Ink Dispersion Study',
    style: 'Custom Tattoo',
    artistId: 'artist-romanova',
    artistName: 'Мила Романова',
    placement: 'Концепт-исследование',
    sessionNote: 'Свободный проект',
    image: '/assets/stills/ink-splash.jpg',
    aspect: 'landscape',
    description:
      'Динамика чернил и текстур в авторском проекте, объединяющем абстракцию и реалистичный объём.',
  },
  {
    id: 'work-9',
    title: 'Monolith Script & Structure',
    style: 'Lettering',
    artistId: 'artist-lebedeva',
    artistName: 'Кира Лебедева',
    placement: 'Предплечье / Рука',
    sessionNote: '1 сеанс · Авторский леттеринг',
    image: '/assets/stills/stencil-detail.jpg',
    aspect: 'landscape',
    description:
      'Интеграция каллиграфических акцентов и структурных линий непосредственно под геометрию руки.',
  },
] as const;

export const STUDIO_CONTACTS = {
  brandName: 'NOCTURNE ATELIER',
  addressLabel: 'Локация студии (заполняется перед запуском)',
  addressDetail: 'Приватное пространство в центре города · Точный адрес и схема прохода отправляются после подтверждения записи',
  phoneDisplay: '+7 (000) 000-00-00',
  phoneHref: '#booking',
  telegramHandle: '@nocturne_atelier_demo',
  instagramHandle: '@nocturne.atelier.demo',
  hours: 'Ежедневно, 11:00 — 21:00 · Строго по предварительной записи',
  mapCoordinatesPlaceholder: '55.75° N · 37.61° E (слот для карты)',
} as const;
