"use client";

import { EventCard } from "@/components/ui";
import { Button } from "@/components/ui";

const FeaturedEvents = () => {
  const featuredEvents = [
    {
      id: 1,
      title: "Frontend Meetup: React 18 и Beyond",
      description:
        "Ежемесячная встреча фронтенд-разработчиков. Обсуждаем последние тенденции в React и экосистеме.",
      date: "2024-12-15T19:00:00Z",
      location: 'Москва, Коворкинг "Loft"',
      category: "technology",
      organizerId: "1",
      maxParticipants: 50,
      currentParticipants: 32,
    },
    {
      id: 2,
      title: "Стартап Пикник: Лето 2024",
      description:
        "Крупнейшее событие для предпринимателей и инвесторов. Питч-сессии, нетворкинг, вдохновляющие истории.",
      date: "2024-12-20T12:00:00Z",
      location: "Москва, Парк Горького",
      category: "business",
      organizerId: "2",
      maxParticipants: 200,
      currentParticipants: 187,
    },
    {
      id: 3,
      title: "Мастер-класс по цифровой живописи",
      description:
        "Практический воркшоп для начинающих художников. Освойте Procreate под руководством профессионалов.",
      date: "2024-12-18T15:00:00Z",
      location: "Онлайн",
      category: "art",
      organizerId: "3",
      maxParticipants: 25,
      currentParticipants: 18,
    },
  ];

  const handleViewDetails = (eventId: number) => {
    console.log("View details:", eventId);
    // Здесь будет навигация на страницу мероприятия
  };

  const handleRegister = (eventId: number) => {
    console.log("Register for event:", eventId);
    // Здесь будет логика регистрации
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Рекомендуемые мероприятия
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Самые интересные события, которые могут вас заинтересовать
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={handleViewDetails}
              onRegister={handleRegister}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">Смотреть все мероприятия</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
