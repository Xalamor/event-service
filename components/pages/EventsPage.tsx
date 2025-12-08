"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  useGetEventsQuery,
  useRegisterForEventMutation,
  useCancelRegistrationMutation,
} from "@/lib/store/api/eventsApi";
import {
  EventCard,
  Button,
  Input,
  Card,
  LoadingSpinner,
} from "@/components/ui";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page] = useState(1);
  const [limit] = useState(12);

  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { token } = useSelector((state: RootState) => state.auth);

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useGetEventsQuery({
    page,
    limit,
    category: selectedCategory,
    search: searchTerm,
  });

  const [registerForEvent] = useRegisterForEventMutation();
  const [cancelRegistration] = useCancelRegistrationMutation();

  const categories = [
    "Все",
    "Технологии",
    "Обучение",
    "Конференция",
    "Хакатон",
    "Воркшоп",
    "Митап",
    "Бизнес",
    "Спорт",
    "Искусство",
  ];

  useEffect(() => {
    console.log("Events data:", events);
    console.log("Events count:", events.length);
  }, [events]);

  const handleViewDetails = (eventId: number) => {
    console.log("Navigating to event with ID:", eventId);
    // Используем router.push вместо window.location.href
    router.push(`/events/${eventId}`);
  };

  const handleRegister = async (eventId: number) => {
    if (!token) {
      alert("Для регистрации необходимо войти в аккаунт");
      router.push("/login"); // Тоже через router
      return;
    }

    try {
      await registerForEvent(eventId).unwrap();
      alert("Вы успешно зарегистрировались на мероприятие!");
      refetch();
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.data?.detail) {
        alert(`Ошибка: ${err.data.detail}`);
      } else {
        alert("Ошибка при регистрации. Попробуйте позже.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    console.error("Events loading error:", error);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Ошибка загрузки мероприятий
            </h2>
            <p className="text-gray-600 mb-6">
              Не удалось загрузить мероприятия. Попробуйте обновить страницу.
            </p>
            <Button onClick={() => refetch()}>Попробовать снова</Button>
          </Card>
        </div>
      </div>
    );
  }

  console.log("Raw events data:", events);
  console.log("First event structure:", events[0]);

  const displayEvents = Array.isArray(events) ? events : [];

  if (displayEvents.length > 0) {
    console.log("First event full structure:", displayEvents[0]);
    console.log("First event id:", displayEvents[0]?.id);
    console.log("First event has event property?", "event" in displayEvents[0]);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок и поиск */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Все мероприятия
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Найдите мероприятие по душе из {events.length} доступных
          </p>

          {/* Поиск и фильтры */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Поиск мероприятий..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category === "Все" ? "" : category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Найдено: {events.length} мероприятий
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          </Card>
        </div>

        {/* Сетка мероприятий */}
        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents
              .map((item: any, index: number) => {
                // Извлекаем событие из объекта
                const event = item.event || item;
                console.log(`Processing event ${index}:`, event);

                if (!event || !event.id) {
                  console.warn("Invalid event data:", item);
                  return null;
                }

                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onRegister={handleRegister}
                    isRegistered={false}
                  />
                );
              })
              .filter(Boolean)}{" "}
            {/* Удаляем null элементы */}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Мероприятия не найдены
            </div>
            <p className="text-gray-400 mb-4">
              Попробуйте изменить параметры поиска или сбросить фильтры
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
            >
              Сбросить фильтры
            </Button>
          </Card>
        )}
      </div>
      <Card className="p-6 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Тестовые ссылки</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/events/1")}
          >
            Тест: Мероприятие ID=1
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/events/2")}
          >
            Тест: Мероприятие ID=2
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/events/3")}
          >
            Тест: Мероприятие ID=3
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EventsPage;
