
Event Platform — это веб‑приложение для поиска и организации мероприятий, построенное на Next.js (App Router) с использованием TypeScript и Redux Toolkit + RTK Query для работы с реальным REST API (бэкенд на https://event-manager-q544.onrender.com/api/v1).

Платформа позволяет пользователям:

•  регистрироваться и авторизовываться;
•  просматривать список мероприятий с фильтрами и поиском;
•  просматривать детальную информацию о мероприятии;
•  регистрироваться на мероприятия и отменять регистрацию;
•  создавать новые мероприятия (для авторизованных пользователей);
•  просматривать простой профиль пользователя.



1. Основные возможности

Пользовательский функционал

•  Регистрация и вход по email/паролю.
•  Хранение JWT‑токена в localStorage и авторизация запросов к API.
•  Просмотр всех мероприятий с:
◦  поиском по названию/описанию;
◦  фильтрацией по категории;
•  Просмотр страницы конкретного мероприятия:
◦  подробное описание;
◦  дата, место, количество участников;
◦  награды (баллы), цена, ID организатора;
◦  статус регистрации пользователя.
•  Регистрация/отмена регистрации на мероприятие.
•  Создание мероприятий (для авторизованных пользователей).
•  Простейшая страница профиля с информацией о пользователе и статическими блоками статистики/активности.

Технические особенности

•  Next.js App Router (app/ директория).
•  TypeScript со строгими настройками (strict: true).
•  Redux Toolkit + RTK Query:
◦  централизованное состояние (auth, user, events);
◦  API‑слой для аутентификации и мероприятий.
•  JWT аутентификация:
◦  токен берётся из Redux‑состояния, дублируется в localStorage;
◦  автоматическое добавление Authorization: Bearer <token> к запросам событий.
•  Tailwind CSS v4 (через импорт в globals.css) + кастомные утилиты.



2. Технологический стек

•  Фреймворк: Next.js (версия 16.x, App Router).
•  Язык: TypeScript.
•  UI: React (современный функциональный подход, хуки).
•  Стили: Tailwind CSS v4 + кастомный CSS в app/globals.css.
•  Состояние: Redux Toolkit (configureStore) + RTK Query.
•  Маршрутизация: Next.js App Router (app/ роуты).
•  HTTP API: REST API на https://event-manager-q544.onrender.com/api/v1.



3. Структура проекта

Ключевые директории и файлы:

•  app/
◦  layout.tsx — корневой layout приложения:
▪  подключает глобальные стили;
▪  оборачивает всё в StoreProvider (Redux);
▪  рендерит Header и InitAuthState;
▪  устанавливает метаданные (title, description) и язык lang="ru".
◦  page.tsx — главная страница, использует секции Hero, CategoryGrid, FeaturedEvents.
◦  events/page.tsx — список мероприятий.
◦  events/[id]/page.tsx — динамический роут детальной страницы мероприятия.
◦  events/edit/[id]/page.tsx — заготовка страницы редактирования мероприятия.
◦  create-event/page.tsx — страница создания мероприятия.
◦  login/page.tsx — страница входа.
◦  register/page.tsx — страница регистрации.
◦  profile/page.tsx — страница профиля (защищённый маршрут через ProtectedRoute).
•  components/
◦  layout/Header.tsx — шапка сайта с навигацией и блоком авторизации.
◦  auth/
▪  LoginForm.tsx — форма входа.
▪  RegisterForm.tsx — форма регистрации.
▪  ProtectedRoute.tsx — HOC‑компонент для защиты маршрутов.
▪  InitAuthState.tsx — инициализация auth‑состояния из localStorage.
◦  pages/
▪  EventsPage.tsx — логика страницы списка мероприятий.
▪  EventDetailsPage.tsx — логика детальной страницы мероприятия.
▪  CreateEventPage.tsx — логика создания мероприятия.
▪  EditEventPage.tsx — заготовка UI для редактирования.
▪  ProfilePage.tsx — страница профиля.
◦  sections/
▪  Hero.tsx — hero блок на главной.
▪  CategoryGrid.tsx — сетка популярных категорий (мок‑данные).
▪  FeaturedEvents.tsx — витрина рекомендуемых мероприятий (мок‑данные).
◦  ui/
▪  Button.tsx — универсальная кнопка (variants, size, loading).
▪  Card.tsx — карточка с обводкой и паддингами.
▪  Input.tsx — инпут с лейблом и ошибками (через forwardRef).
▪  EventCard.tsx — карточка мероприятия (для списка).
▪  LoadingSpinner.tsx — индикатор загрузки.
•  lib/
◦  ReduxProvider.tsx — провайдер Redux‑хранилища.
◦  store/index.ts — конфигурация Redux store.
◦  store/api/authApi.ts — RTK Query API для аутентификации.
◦  store/api/eventsApi.ts — RTK Query API для мероприятий.
◦  store/slices/authSlice.ts — слайс авторизации.
◦  store/slices/eventsSlice.ts — слайс фильтров/локального состояния мероприятий.
◦  store/slices/userSlice.ts — слайс данных текущего пользователя.
•  Конфигурационные файлы:
◦  package.json — зависимости и скрипты.
◦  tsconfig.json — настройки TypeScript.
◦  next.config.ts — конфиг Next.js (пока почти пустой).
◦  eslint.config.mjs, postcss.config.mjs — линтер и PostCSS/Tailwind.



4. Маршруты и страницы

4.1. Главная (/)

Файл: app/page.tsx

Состоит из трёх секций:

•  Hero — призыв к действию, кнопки:
◦  «Найти мероприятия» → /events;
◦  «Создать мероприятие» → /create-event.
•  CategoryGrid — список популярных категорий (технологии, бизнес, искусство и т.д.).
•  FeaturedEvents — несколько рекомендованных мероприятий (мок).

Назначение: маркетинговый лендинг и быстрый переход к ключевым сценариям.



4.2. Список мероприятий (/events)

Файл: app/events/page.tsx → components/pages/EventsPage.tsx.

Функциональность:

•  Получение списка мероприятий через useGetEventsQuery:
◦  параметры: page, limit, category, search.
•  Вводимые пользователем параметры:
◦  строка поиска searchTerm (Input);
◦  выбранная категория selectedCategory (select из набора категорий).
•  Отображение:
◦  заголовок «Все мероприятия»;
◦  количество найденных мероприятий;
◦  форма поиска/фильтров (Input + select + кнопка сброса);
◦  сетка EventCard по результатам.
•  Обработка состояния:
◦  isLoading → показывается LoadingSpinner;
◦  error → показывается карточка с ошибкой и кнопкой «Попробовать снова».
•  Навигация:
◦  клик «Подробнее» вызывает router.push('/events/{id}');
◦  для теста есть кнопки «Тест: Мероприятие ID=1/2/3».

Регистрация:

•  Кнопка «Зарегистрироваться» на карточке вызывает useRegisterForEventMutation.
•  Если пользователь не авторизован (!token), показывается alert и редирект на /login.



4.3. Детальная страница мероприятия (/events/[id])

Файл: app/events/[id]/page.tsx → EventDetailsPage.

•  Динамический параметр id берётся через useParams.
•  При отсутствии id — пользователь видит ошибочную страницу с кнопкой «Вернуться к мероприятиям».

Компонент EventDetailsPage:

•  Получает eventId (строка), парсит в число (parsedEventId).
•  Запрашивает данные по событию:
◦  useGetEventQuery(eventId: number) → ожидаемый ответ EventResponse:
▪  event — объект мероприятия;
▪  organizer — объект организатора (пока используется только organizer_id в event).
•  Состояния:
◦  isLoading → спиннер;
◦  error или отсутствие eventResponse.event → страница «Мероприятие не найдено».
◦  isRegistered, isLoadingAction — локальное состояние регистрации.

На странице:

•  Основной блок с заголовком, категорией, описанием, картинкой, датой/местом/участниками, наградой, дополнительной инфой (дата создания, цена, ID организатора).
•  Боковая панель:
◦  цене/стоимости (сейчас текст «Бесплатно», но логика цены есть ниже);
◦  количество занятых/свободных мест;
◦  кнопки:
▪  «Зарегистрироваться» (если не зарегистрирован, есть места, авторизован);
▪  «Добавить в календарь» (если уже зарегистрирован — создаёт ссылку для Google Calendar и открывает в новом окне);
▪  «Отменить регистрацию» (вызывает useCancelRegistrationMutation).
◦  Если текущий пользователь — организатор (currentUser.id === event.organizer_id), показывается кнопка «Редактировать мероприятие» → /events/edit/{id}.



4.4. Создание мероприятия (/create-event)

Файл: app/create-event/page.tsx → CreateEventPage.

Доступ:

•  Страница доступна только авторизованным пользователям.
•  Если !currentUser или !token:
◦  показывается карточка с иконкой замка и кнопками «Войти в аккаунт» / «Зарегистрироваться».

Форма создания:

•  Поля:
◦  title — название (обязательно).
◦  description — описание (обязательно).
◦  date_time — дата и время (тип datetime-local, обязательно).
◦  location — место; опционально, если is_online = true.
◦  category — категория (обязательно, выбирается из списка).
◦  max_participants — максимальное число участников (обязательно, >= 1).
◦  points_reward — баллы за участие (опционально).
◦  image_url — URL картинки (опционально).
◦  is_online — чекбокс «онлайн мероприятие».
◦  price — цена (по умолчанию «0»; 0 — бесплатно).
•  Валидация на клиенте:
◦  проверка обязательных полей и минимальных значений.
•  Отправка:
◦  форматируется date_time в ISO‑строку (если не заканчивается на Z, добавляется :00Z);
◦  формируется объект CreateEventRequest и отправляется через useCreateEventMutation.
•  Обработка ответа/ошибок:
◦  при успехе:
▪  сообщение об успехе;
▪  очистка формы;
▪  через 2 секунды автоматический редирект на /events;
◦  при ошибке:
▪  детальный разбор err.data:
▪  detail;
▪  строка;
▪  массив ошибок;
▪  объект с ошибками по полям.

Подсказки:

•  Внизу карточка с подсказкой по формату даты/времени и примерами.



4.5. Редактирование мероприятия (/events/edit/[id])

Файл: app/events/edit/[id]/page.tsx → EditEventPage.

Состояние:

•  Пока компонент работает как заглушка:
◦  имитирует загрузку текущих данных;
◦  показывает форму (частично аналогичную созданию) с заглушечными значениями;
◦  сохраняет изменения «в никуда» (имитация) и редиректит обратно на /events/{id}.
•  Логика настоящего обновления по API ещё не реализована (но в eventsApi уже есть updateEvent).



4.6. Аутентификация: вход (/login) и регистрация (/register)

Файл: app/login/page.tsx → LoginForm, app/register/page.tsx → RegisterForm.

LoginForm

•  Поля: email, password.
•  Использует useLoginMutation (RTK Query).
•  При успехе:
◦  вызывает loginSuccess из authSlice (сохраняет токен в Redux и localStorage);
◦  вызывает setUser в userSlice (сохраняет текущего пользователя: id, email, firstName, lastName, role).
◦  редиректит на /.
•  Обработка ошибок:
◦  анализ err.data.detail, email, password, message и пр.;
◦  вывод сообщения пользователю.

RegisterForm

•  Поля: email, username, first_name, last_name, password, confirmPassword.
•  Использует useRegisterMutation.
•  При успехе:
◦  такая же логика, как в LoginForm: loginSuccess, setUser, сохранение токена, редирект на /.
•  Обработка ошибок:
◦  аналогична, с разбором полей email, username, password и общих сообщений.



4.7. Профиль (/profile)

Файл: app/profile/page.tsx → ProtectedRoute → ProfilePage.

Защита:

•  ProtectedRoute читает isAuthenticated и isLoading из auth слайса:
◦  пока isLoading — показывает спиннер;
◦  если не аутентифицирован и не грузится — редиректит на /login;
◦  защищаемый контент рендерится только для аутентифицированных.

Содержимое ProfilePage:

•  Если !currentUser (на всякий случай) — показывает страницу с требованием авторизации.
•  Для авторизованного пользователя:
◦  карточка с аватаром‑инициалами, именем, email, ролью (user/organizer).
◦  быстрые действия (кнопки без реализованной логики): «Редактировать профиль», «Сменить пароль», «Настройки уведомлений».
◦  секции:
▪  «Личная информация» (имя, фамилия, email).
▪  «Статистика» (посещено, организовано, предстоящие, избранное — статические числа).
▪  «Предстоящие мероприятия» (2 статичных примера).
▪  «История активности» (3 статичных события).



5. Состояние и хранилище (Redux)

5.1. Конфигурация хранилища

Файл: lib/store/index.ts.

•  Используется configureStore с редьюсерами:
◦  auth (authSlice);
◦  user (userSlice);
◦  events (eventsSlice);
◦  RTK Query API‑редьюсеры:
▪  [authApi.reducerPath]: authApi.reducer;
▪  [eventsApi.reducerPath]: eventsApi.reducer.
•  Подключён middleware:
◦  authApi.middleware;
◦  eventsApi.middleware.

Типы:

•  AppStore, RootState, AppDispatch экспортируются для типизации хуков и useSelector.

Провайдер:

•  ReduxProvider (в lib/ReduxProvider.tsx) создаёт store один раз через useRef и оборачивает всё приложение через <Provider>.



5.2. Слайс authSlice (авторизация)

Файл: lib/store/slices/authSlice.ts.

Состояние:

•  token: string | null
•  refreshToken: string | null (фактически не используется, но поле есть).
•  isAuthenticated: boolean
•  isLoading: boolean
•  error: string | null

Особенности:

•  Имеются функции getInitialToken и getInitialRefreshToken, которые читают из localStorage, но используются только в initializeAuth (через эффект в InitAuthState).
•  initializeAuth:
◦  читает токен и refresh токен (если есть) из localStorage;
◦  выставляет isAuthenticated в зависимости от наличия токена.
•  loginStart, loginSuccess, loginFailure, logout, clearError:
◦  управляют статусом загрузки, ошибками, токенами, а также синхронизируют их с localStorage.



5.3. Слайс userSlice (пользователь)

Файл: lib/store/slices/userSlice.ts.

Состояние:

•  currentUser: { id, email, firstName, lastName, role } | null
•  isLoading: boolean

Редьюсеры:

•  setUser — записывает пользователя.
•  clearUser — очищает.
•  setLoading — флаг загрузки.

Использование:

•  Вызывается из LoginForm и RegisterForm после успешной аутентификации.



5.4. Слайс eventsSlice (локальное состояние мероприятий)

Файл: lib/store/slices/eventsSlice.ts.

Состояние:

•  events: Event[] (локальный массив примитивного типа Event для фронта).
•  currentEvent: Event | null.
•  filters: { category, date, search }.
•  isLoading: boolean.

Роль:

•  В текущей архитектуре основная загрузка/кеширование мероприятий реализована через RTK Query (eventsApi), а eventsSlice больше подходит для дополнительных локальных сценариев (сортировки/фильтрации), которые пока используются минимально.
•  Содержит методы:
◦  setEvents, setCurrentEvent, setFilters, clearFilters, setLoading.



6. API‑слой (RTK Query)

6.1. authApi — аутентификация

Файл: lib/store/api/authApi.ts.

Базовая конфигурация:

•  baseUrl: "https://event-manager-q544.onrender.com/api/v1".
•  prepareHeaders устанавливает Content-Type: application/json.

Типы:

•  LoginRequest (email, password).
•  RegisterRequest (email, username, password, first_name, last_name).
•  UserData (id, email, username, first_name, last_name, is_admin).
•  LoginResponse / RegisterResponse: message, token, user.

Эндпоинты:

•  login: POST /auth/login с LoginRequest, возвращает LoginResponse.
•  register: POST /auth/register с RegisterRequest, возвращает RegisterResponse.

Сгенерированные хуки:

•  useLoginMutation
•  useRegisterMutation



6.2. eventsApi — мероприятия

Файл: lib/store/api/eventsApi.ts.

Базовая конфигурация:

•  baseUrl: "https://event-manager-q544.onrender.com/api/v1".
•  prepareHeaders:
◦  берёт token из state.auth.token;
◦  если есть токен, добавляет Authorization: Bearer <token>;
◦  всегда выставляет Content-Type: application/json.

Типы:

•  Event — модель мероприятия, соответствующая данным из API.
•  EventResponse — объект { event, organizer }.
•  EventsResponse — массив Event.
•  PaginationParams — page, limit, category, search.
•  CreateEventRequest — тело запроса при создании.

Эндпоинты:

•  getEvents(PaginationParams):
◦  запрос GET /events с query‑параметрами.
◦  transformResponse умеет приводить разные форматы ответа к массиву Event[]:
▪  response.events (если есть);
▪  массив { event };
▪  прямой массив Event[].
◦  providesTags для кэш‑инвалидации:
▪  список Event по id;
▪  общая метка { type: "Events", id: "LIST" }.
•  getEvent(id: number):
◦  GET /events/{id};
◦  возвращает EventResponse.
•  createEvent(data: CreateEventRequest):
◦  POST /events;
◦  invalidatesTags → список Events.
•  updateEvent({ id, data }):
◦  PUT /events/{id};
◦  инвалидация тега конкретного Event и списка Events.
•  deleteEvent(id: number):
◦  DELETE /events/{id};
◦  инвалидация списка.
•  registerForEvent(eventId: number):
◦  POST /events/{id}/register.
•  cancelRegistration(eventId: number):
◦  DELETE /events/{id}/register.

Сгенерированные хуки:

•  useGetEventsQuery
•  useGetEventQuery
•  useCreateEventMutation
•  useUpdateEventMutation
•  useDeleteEventMutation
•  useRegisterForEventMutation
•  useCancelRegistrationMutation



7. UI‑компоненты

7.1. Button

•  Поддерживает варианты: primary, secondary, outline, danger.
•  Размеры: sm, md, lg.
•  Проп isLoading — показывает мини‑спиннер и текст «Loading…».
•  Используется по всему приложению для единообразных кнопок.

7.2. Card

•  Базовый контейнер с белым фоном, скруглением, тенью и рамкой.
•  Поддерживает разные отступы: sm, md, lg.

7.3. Input

•  Обёртка над <input>:
◦  опциональный лейбл;
◦  вывод ошибок error под полем;
◦  адаптирован под Tailwind классы.

7.4. EventCard

•  Принимает event и колбэки:
◦  onViewDetails(event.id);
◦  onRegister(event.id).
•  Отображает:
◦  картинку (если image_url задано);
◦  название, описание (ограничение по двум строкам через .line-clamp-2);
◦  дату/время;
◦  место;
◦  категорию;
◦  участников и свободные места;
◦  награду (баллы).
•  Управляет кнопками «Подробнее» / «Зарегистрироваться» / «Вы зарегистрированы».

7.5. LoadingSpinner

•  Размеры: sm, md, lg.
•  Используется на страницах загрузки и в ProtectedRoute.



8. Стили и UX

Файл: app/globals.css.

•  Импортирует Tailwind (@import "tailwindcss";).
•  Настраивает CSS‑переменные для фона/текста в светлой/тёмной темах.
•  Определяет утилиту .line-clamp-2 для обрезки текста.
•  Добавляет плавные CSS‑переходы для всех элементов по цвету/фону/бордеру.

Визуально:

•  Адаптивный интерфейс (Tailwind сетки).
•  Акцент на синих/фиолетовых градиентах и карточках.
•  Мобильное меню в Header с «гамбургером».



9. Запуск и сборка

9.1. Установка зависимостей
bash
9.2. Запуск в режиме разработки
bash
По умолчанию приложение будет доступно на http://localhost:3000.

9.3. Продакшн‑сборка и запуск
bash


10. Ограничения и точки развития

•  Редактирование мероприятий:
◦  EditEventPage пока не использует настоящий API updateEvent и содержит заглушки;
◦  требуется интеграция с eventsApi.updateEvent и валидация, похожая на CreateEventPage.
•  Профиль:
◦  статистика, предстоящие мероприятия и история активности — статические;
◦  можно добавить реальные запросы к бэкенду для истории/статистики.
•  Роли/права:
◦  роль organizer выводится в профиле, но логика ограничения действий по роли минимальна;
◦  можно:
▪  ограничить создание/редактирование только для организаторов;
▪  скрывать некоторые UI‑элементы от обычных пользователей.
•  Валидация и UX:
◦  часть валидации реализована в виде alert и простых текстовых ошибок;
◦  можно добавить более дружелюбные toast‑уведомления, валидацию на уровне Input компонентов и т.п.
•  Конфигурация API:
◦  baseUrl сейчас захардкожен в коде;
◦  для продакшна имеет смысл вынести его в переменные окружения (process.env.NEXT_PUBLIC_API_URL и т.п.).
