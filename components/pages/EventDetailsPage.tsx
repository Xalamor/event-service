"use client";

import { useState } from "react";
import { Button, Card, LoadingSpinner } from "@/components/ui";

interface EventDetailsPageProps {
  eventId: string;
}

const EventDetailsPage = ({ eventId }: EventDetailsPageProps) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Заглушка данных мероприятия (позже заменим на API)
  const event = {
    id: eventId,
    title: "Frontend Meetup: React 18 и Beyond",
    description:
      "Ежемесячная встреча фронтенд-разработчиков, где мы обсуждаем последние тенденции в React и его экосистеме. На этой встрече мы рассмотрим новые возможности React 18, серверные компоненты и лучшие практики для современных приложений.",
    longDescription: `Присоединяйтесь к нашему ежемесячному митапу для фронтенд-разработчиков! 
    
В программе:
• Доклад "React 18: Что нового и как использовать"
• Практические примеры с Concurrent Features
• Обсуждение Server Components и их применение
• Воркшоп по оптимизации производительности

После официальной части - неформальное общение, обмен опытом и нетворкинг. Идеальная возможность познакомиться с единомышленниками и узнать о последних трендах в разработке.`,
    date: "2024-12-15T19:00:00Z",
    location: 'Москва, Коворкинг "Loft", ул. Тверская, 15',
    category: "technology",
    organizerId: "1",
    organizer: {
      name: "Tech Community Moscow",
      email: "hello@techcommunity.ru",
    },
    maxParticipants: 50,
    currentParticipants: 32,
    price: 0,
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
  };

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRegister = async () => {
    setIsLoading(true);
    // Имитация API запроса
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRegistered(true);
    setIsLoading(false);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Хлебные крошки */}
        <nav className="mb-6">
          <a href="/events" className="text-blue-600 hover:text-blue-800">
            ← Все мероприятия
          </a>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                    {event.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h1>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6">{event.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    📅
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Дата и время
                    </div>
                    <div className="text-gray-600">{formattedDate}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    📍
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Место</div>
                    <div className="text-gray-600">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    👥
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Участники</div>
                    <div className="text-gray-600">
                      {event.currentParticipants} / {event.maxParticipants}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    🏢
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Организатор</div>
                    <div className="text-gray-600">{event.organizer.name}</div>
                  </div>
                </div>
              </div>

              {/* Теги */}
              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Подробное описание */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  О мероприятии
                </h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {event.longDescription}
                </div>
              </div>
            </Card>
          </div>

          {/* Боковая панель с регистрацией */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {event.price === 0 ? "Бесплатно" : `${event.price} ₽`}
                </div>
                <div className="text-gray-600">
                  {event.currentParticipants} из {event.maxParticipants} мест
                  занято
                </div>
              </div>

              {isRegistered ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
                    ✅ Вы зарегистрированы на это мероприятие
                  </div>
                  <Button variant="outline" className="w-full">
                    Добавить в календарь
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={
                    event.currentParticipants >= event.maxParticipants ||
                    isLoading
                  }
                  isLoading={isLoading}
                  className="w-full mb-4"
                >
                  {event.currentParticipants >= event.maxParticipants
                    ? "Мест нет"
                    : "Зарегистрироваться"}
                </Button>
              )}

              <div className="text-sm text-gray-500 text-center">
                Регистрация{" "}
                {event.currentParticipants >= event.maxParticipants
                  ? "закрыта"
                  : "открыта"}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
