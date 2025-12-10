# Event Platform

Event Platform — веб‑приложение для поиска и организации мероприятий, построенное на **Next.js (App Router)** с использованием **TypeScript** и **Redux Toolkit + RTK Query** для работы с реальным REST API (`https://event-manager-q544.onrender.com/api/v1`).

Платформа позволяет пользователям:

- регистрироваться и авторизовываться;
- просматривать список мероприятий с фильтрами и поиском;
- открывать детальную страницу мероприятия;
- регистрироваться на мероприятия и отменять регистрацию;
- создавать новые мероприятия (для авторизованных пользователей);
- просматривать профиль пользователя.

---

## Основные возможности

### Пользовательский функционал

- Регистрация и вход по email/паролю.
- Хранение JWT‑токена в `localStorage` и авторизация запросов к API.
- Просмотр всех мероприятий:
  - поиск по названию/описанию;
  - фильтрация по категории.
- Детальная страница мероприятия:
  - описание, дата, место, количество участников;
  - награда (баллы), цена, ID организатора;
  - отображение статуса регистрации.
- Регистрация/отмена регистрации на мероприятие.
- Создание мероприятий (для авторизованных пользователей).
- Страница профиля с основной информацией о пользователе и статической статистикой.

### Технические особенности

- **Next.js App Router** (`app/` директория).
- **TypeScript** со строгими настройками (`strict: true`).
- **Redux Toolkit + RTK Query**:
  - централизованное состояние (`auth`, `user`, `events`);
  - API‑слой для аутентификации и мероприятий.
- **JWT‑аутентификация**:
  - токен хранится в Redux‑состоянии и `localStorage`;
  - автоматическое добавление заголовка `Authorization: Bearer <token>` к запросам.
- **Tailwind CSS v4** (через импорт в `app/globals.css`) + кастомные утилиты.

---

## Технологический стек

- **Фреймворк:** Next.js 16.x (App Router).
- **Язык:** TypeScript.
- **UI:** React (хуки, функциональные компоненты).
- **Стили:** Tailwind CSS v4 + пользовательский CSS в `app/globals.css`.
- **Состояние:** Redux Toolkit (`configureStore`) + RTK Query.
- **Маршрутизация:** Next.js App Router (`app/`‑роуты).
- **Бэкенд:** REST API `https://event-manager-q544.onrender.com/api/v1`.

---

## Структура проекта

Ключевые директории и файлы:

- `app/`
  - `layout.tsx` — корневой layout:
    - глобальные стили;
    - обёртка `StoreProvider` (Redux);
    - `Header` и `InitAuthState`;
    - метаданные (`title`, `description`), язык `lang="ru"`.
  - `page.tsx` — главная (лендинг: `Hero`, `CategoryGrid`, `FeaturedEvents`).
  - `events/page.tsx` — список мероприятий.
  - `events/[id]/page.tsx` — детальная страница мероприятия.
  - `events/edit/[id]/page.tsx` — заготовка страницы редактирования.
  - `create-event/page.tsx` — создание мероприятия.
  - `login/page.tsx` — вход.
  - `register/page.tsx` — регистрация.
  - `profile/page.tsx` — профиль (защищён `ProtectedRoute`).

- `components/`
  - `layout/Header.tsx` — шапка с навигацией и блоком авторизации.
  - `auth/`
    - `LoginForm.tsx` — форма входа.
    - `RegisterForm.tsx` — форма регистрации.
    - `ProtectedRoute.tsx` — защита маршрутов.
    - `InitAuthState.tsx` — инициализация `auth` из `localStorage`.
  - `pages/`
    - `EventsPage.tsx` — логика списка мероприятий.
    - `EventDetailsPage.tsx` — логика детальной страницы мероприятия.
    - `CreateEventPage.tsx` — логика создания мероприятия.
    - `EditEventPage.tsx` — заготовка UI редактирования.
    - `ProfilePage.tsx` — страница профиля.
  - `sections/`
    - `Hero.tsx` — hero‑блок на главной.
    - `CategoryGrid.tsx` — популярные категории (мок‑данные).
    - `FeaturedEvents.tsx` — рекомендуемые мероприятия (мок‑данные).
  - `ui/`
    - `Button.tsx` — универсальная кнопка (варианты, размеры, `isLoading`).
    - `Card.tsx` — карточка с рамкой и отступами.
    - `Input.tsx` — инпут с лейблом и выводом ошибок.
    - `EventCard.tsx` — карточка мероприятия для списков.
    - `LoadingSpinner.tsx` — индикатор загрузки.

- `lib/`
  - `ReduxProvider.tsx` — провайдер Redux‑хранилища.
  - `store/index.ts` — конфигурация Redux store.
  - `store/api/authApi.ts` — RTK Query API для аутентификации.
  - `store/api/eventsApi.ts` — RTK Query API для мероприятий.
  - `store/slices/authSlice.ts` — слайс авторизации.
  - `store/slices/eventsSlice.ts` — слайс локального состояния мероприятий/фильтров.
  - `store/slices/userSlice.ts` — слайс данных текущего пользователя.

- Конфигурация:
  - `package.json` — зависимости и npm‑скрипты.
  - `tsconfig.json` — настройки TypeScript.
  - `next.config.ts` — конфиг Next.js.
  - `eslint.config.mjs`, `postcss.config.mjs` — ESLint и PostCSS/Tailwind.

---

## Маршруты и страницы

### Главная (`/`)

- Файл: `app/page.tsx`.
- Секции:
  - `Hero` — призыв к действию:
    - «Найти мероприятия» → `/events`;
    - «Создать мероприятие» → `/create-event`.
  - `CategoryGrid` — популярные категории.
  - `FeaturedEvents` — подборка рекомендованных мероприятий.
- Назначение: лендинг и быстрый переход к основным сценариям.

### Список мероприятий (`/events`)

- Файл: `app/events/page.tsx` → `components/pages/EventsPage.tsx`.
- Загрузка через `useGetEventsQuery({ page, limit, category, search })`.
- Пользовательские параметры:
  - строка поиска `searchTerm`;
  - категория `selectedCategory`.
- UI:
  - заголовок и счётчик найденных мероприятий;
  - форма фильтров (поиск + select + кнопка сброса);
  - сетка `EventCard`.
- Состояния:
  - `isLoading` → `LoadingSpinner`;
  - `error` → карточка с ошибкой и кнопкой «Попробовать снова».
- Навигация:
  - «Подробнее» → `router.push('/events/{id}')`.
- Регистрация:
  - кнопка «Зарегистрироваться» вызывает `useRegisterForEventMutation`;
  - при отсутствии токена — `alert` + редирект на `/login`.

### Детальная страница мероприятия (`/events/[id]`)

- Файл: `app/events/[id]/page.tsx` → `EventDetailsPage`.
- `id` берётся через `useParams`.
- При отсутствии/некорректном `id` — ошибка и кнопка «Вернуться к мероприятиям».
- Данные мероприятия:
  - `useGetEventQuery(id)` → `EventResponse` (`event`, `organizer`).
- Состояния:
  - `isLoading` → спиннер;
  - `error` или отсутствие `eventResponse.event` → «Мероприятие не найдено».
  - локальные `isRegistered`, `isLoadingAction`.
- Основной блок:
  - категория, заголовок, описание, картинка;
  - дата/время, место, участники, баллы, цена, ID организатора.
- Боковая панель:
  - информация о заполняемости (сколько мест занято/свободно);
  - кнопки:
    - «Зарегистрироваться» (если есть места, пользователь авторизован);
    - «Добавить в календарь» (Google Calendar, для зарегистрированных);
    - «Отменить регистрацию» (`useCancelRegistrationMutation`).
  - если текущий пользователь — организатор (`currentUser.id === event.organizer_id`) —
    кнопка «Редактировать мероприятие» → `/events/edit/{id}`.

### Создание мероприятия (`/create-event`)

- Файл: `app/create-event/page.tsx` → `CreateEventPage`.
- Доступ только для авторизованных (`currentUser` и `token`).
  - если нет — карточка с замком и кнопками входа/регистрации.
- Форма:
  - `title`, `description`, `date_time (datetime-local)`, `location`, `category`,
    `max_participants`, `points_reward`, `image_url`, `is_online`, `price`.
  - валидация обязательных полей и минимальных значений.
- Отправка:
  - `date_time` форматируется в ISO (при необходимости добавляется `:00Z`);
  - данные отправляются через `useCreateEventMutation`.
- Обработка ответа:
  - при успехе — сообщение, очистка формы и авто‑редирект на `/events` через 2 сек;
  - при ошибке — разбор `err.data` (detail, массивы/объекты ошибок по полям).
- Внизу подсказка по формату даты/времени.

### Редактирование мероприятия (`/events/edit/[id]`)

- Файл: `app/events/edit/[id]/page.tsx` → `EditEventPage`.
- Сейчас это заглушка:
  - имитирует загрузку текущих данных;
  - показывает форму с тестовыми значениями;
  - имитирует сохранение и возвращает на `/events/{id}`.
- В `eventsApi` уже есть `updateEvent`, но не интегрирован в UI.

### Аутентификация (`/login`, `/register`)

- Файлы:
  - `app/login/page.tsx` → `LoginForm`.
  - `app/register/page.tsx` → `RegisterForm`.

**LoginForm**

- Поля: `email`, `password`.
- Использует `useLoginMutation`.
- При успехе:
  - `loginSuccess` (`authSlice`) → запись токена в Redux и `localStorage`;
  - `setUser` (`userSlice`) → текущий пользователь (`id`, `email`, `firstName`, `lastName`, `role`);
  - редирект на `/`.
- Ошибки:
  - анализ `err.data.detail`, `email`, `password`, `message` и др.

**RegisterForm**

- Поля: `email`, `username`, `first_name`, `last_name`, `password`, `confirmPassword`.
- Использует `useRegisterMutation`.
- При успехе — та же логика, что в `LoginForm` (автовход и редирект на `/`).
- Ошибки:
  - разбор полей `email`, `username`, `password` и общих сообщений.

### Профиль (`/profile`)

- Файл: `app/profile/page.tsx` → `ProtectedRoute` → `ProfilePage`.

**ProtectedRoute**

- Читает `isAuthenticated` и `isLoading` из `authSlice`.
- Пока `isLoading` — показывает спиннер.
- Если пользователь не авторизован — редирект на `/login`.

**ProfilePage**

- Если `!currentUser` — страница с требованием авторизации.
- Для авторизованного:
  - карточка с инициалами, именем, email, ролью (`user`/`organizer`);
  - быстрые действия (пока без логики): редактирование профиля, смена пароля, настройки уведомлений;
  - секции:
    - «Личная информация» (имя, фамилия, email);
    - «Статистика» (посещено/организовано/предстоящие/в избранном — статические значения);
    - «Предстоящие мероприятия» (2 статичных примера);
    - «История активности» (3 статичных события).

---

## Состояние и хранилище (Redux)

### Конфигурация store

- Файл: `lib/store/index.ts`.
- `configureStore` с редьюсерами:
  - `auth` (`authSlice`);
  - `user` (`userSlice`);
  - `events` (`eventsSlice`);
  - `authApi.reducer`, `eventsApi.reducer`.
- Middleware:
  - `authApi.middleware`;
  - `eventsApi.middleware`.
- Экспортируются типы:
  - `AppStore`, `RootState`, `AppDispatch`.

**ReduxProvider**

- Файл: `lib/ReduxProvider.tsx`.
- Создаёт store один раз (через `useRef`) и оборачивает приложение в `<Provider>`.

### `authSlice` (авторизация)

- Файл: `lib/store/slices/authSlice.ts`.
- Состояние:
  - `token: string | null`;
  - `refreshToken: string | null` (зарезервировано, фактически не используется);
  - `isAuthenticated: boolean`;
  - `isLoading: boolean`;
  - `error: string | null`.
- `initializeAuth`:
  - читает токен(ы) из `localStorage`;
  - выставляет `isAuthenticated` на основе токена.
- `loginStart`, `loginSuccess`, `loginFailure`, `logout`, `clearError`:
  - управляют статусами, ошибками и синхронизацией токенов с `localStorage`.

### `userSlice` (пользователь)

- Файл: `lib/store/slices/userSlice.ts`.
- Состояние:
  - `currentUser: { id, email, firstName, lastName, role } | null`;
  - `isLoading: boolean`.
- Редьюсеры:
  - `setUser` — записывает пользователя;
  - `clearUser` — очищает;
  - `setLoading` — флаг загрузки.

### `eventsSlice` (локальное состояние мероприятий)

- Файл: `lib/store/slices/eventsSlice.ts`.
- Состояние:
  - `events: Event[]`;
  - `currentEvent: Event | null`;
  - `filters: { category, date, search }`;
  - `isLoading: boolean`.
- Методы:
  - `setEvents`, `setCurrentEvent`, `setFilters`, `clearFilters`, `setLoading`.
- Основное кэширование/загрузка мероприятий идёт через RTK Query (`eventsApi`),
  `eventsSlice` пригоден для дополнительных локальных сценариев.

---

## API‑слой (RTK Query)

### `authApi` — аутентификация

- Файл: `lib/store/api/authApi.ts`.
- Базовые настройки:
  - `baseUrl: "https://event-manager-q544.onrender.com/api/v1"`;
  - `prepareHeaders` → `Content-Type: application/json`.
- Типы:
  - `LoginRequest` (`email`, `password`);
  - `RegisterRequest` (`email`, `username`, `password`, `first_name`, `last_name`);
  - `UserData` (`id`, `email`, `username`, `first_name`, `last_name`, `is_admin`);
  - `LoginResponse` / `RegisterResponse` (`message`, `token`, `user`).
- Эндпоинты:
  - `login`: `POST /auth/login`;
  - `register`: `POST /auth/register`.
- Сгенерированные хуки:
  - `useLoginMutation`;
  - `useRegisterMutation`.

### `eventsApi` — мероприятия

- Файл: `lib/store/api/eventsApi.ts`.
- Базовые настройки:
  - `baseUrl: "https://event-manager-q544.onrender.com/api/v1"`;
  - `prepareHeaders`:
    - читает `token` из `state.auth.token`;
    - добавляет `Authorization: Bearer <token>` при наличии;
    - всегда ставит `Content-Type: application/json`.
- Типы:
  - `Event`, `EventResponse`, `EventsResponse`;
  - `PaginationParams` (`page`, `limit`, `category`, `search`);
  - `CreateEventRequest` (тело создания).
- Эндпоинты:
  - `getEvents(PaginationParams)` — `GET /events`:
    - `transformResponse` поддерживает несколько форматов ответа (`response.events`, массив `{ event }`, простой `Event[]`);
    - `providesTags` для кэш‑инвалидации (`Event` по id, `{ type: "Events", id: "LIST" }`).
  - `getEvent(id)` — `GET /events/{id}` → `EventResponse`.
  - `createEvent(data)` — `POST /events` (инвалидация списка `Events`).
  - `updateEvent({ id, data })` — `PUT /events/{id}` (инвалидация `Event` и списка).
  - `deleteEvent(id)` — `DELETE /events/{id}`.
  - `registerForEvent(eventId)` — `POST /events/{id}/register`.
  - `cancelRegistration(eventId)` — `DELETE /events/{id}/register`.
- Сгенерированные хуки:
  - `useGetEventsQuery`;
  - `useGetEventQuery`;
  - `useCreateEventMutation`;
  - `useUpdateEventMutation`;
  - `useDeleteEventMutation`;
  - `useRegisterForEventMutation`;
  - `useCancelRegistrationMutation`.

---

## UI‑компоненты

- **Button**
  - варианты: `primary`, `secondary`, `outline`, `danger`;
  - размеры: `sm`, `md`, `lg`;
  - `isLoading` — мини‑спиннер и текст `Loading…`.
- **Card**
  - базовый контейнер с белым фоном, тенью и рамкой;
  - поддержка отступов: `sm`, `md`, `lg`.
- **Input**
  - обёртка над `<input>`;
  - лейбл, подсветка ошибок, Tailwind‑классы.
- **EventCard**
  - принимает `event` и колбэки `onViewDetails`, `onRegister`;
  - показывает ключевую информацию о мероприятии и кнопки действий.
- **LoadingSpinner**
  - размеры: `sm`, `md`, `lg`;
  - используется на страницах загрузки и в `ProtectedRoute`.

---

## Стили и UX

- Файл: `app/globals.css`.
  - импортирует Tailwind: `@import "tailwindcss";`;
  - настраивает CSS‑переменные фона/текста для светлой/тёмной темы;
  - определяет `.line-clamp-2` для обрезки длинного текста;
  - добавляет плавные переходы для большинства свойств (цвет, фон, бордер).
- Визуально:
  - адаптивный дизайн (Tailwind‑сетки);
  - акцент на синих/фиолетовых градиентах и карточках;
  - мобильное меню в `Header` (гамбургер‑иконка).

---

## Запуск и сборка

### Установка зависимостей

```bash path=null start=null
npm install
