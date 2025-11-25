"use client";

import { useState } from "react";
import { EventCard, Button, Input, Card } from "@/components/ui";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Все",
    "Технологии",
    "Бизнес",
    "Искусство",
    "Образование",
    "Спорт",
    "Волонтерство",
  ];

  const events = [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
    {
      id: "4",
      title: "Data Science Conference 2024",
      description:
        "Ежегодная конференция по Data Science и Machine Learning. Доклады от ведущих специалистов.",
      date: "2024-12-22T09:00:00Z",
      location: "Москва, Digital October",
      category: "technology",
      organizerId: "4",
      maxParticipants: 300,
      currentParticipants: 245,
    },
    {
      id: "5",
      title: 'Беговой марафон "Осенний забег"',
      description:
        "Ежегодный благотворительный марафон на 10 км. Все средства идут в фонд помощи детям.",
      date: "2024-12-25T08:00:00Z",
      location: "Москва, Воробьевы горы",
      category: "sport",
      organizerId: "5",
      maxParticipants: 1000,
      currentParticipants: 856,
    },
    {
      id: "6",
      title: "Волонтерский день в приюте для животных",
      description:
        "Помощь приюту для бездомных животных. Уборка территории, выгул собак, сбор кормов.",
      date: "2024-12-28T10:00:00Z",
      location: 'Москва, Приют "Друг"',
      category: "volunteering",
      organizerId: "6",
      maxParticipants: 30,
      currentParticipants: 22,
    },
  ];

  const handleViewDetails = (eventId: string) => {
    console.log("View details:", eventId);
    // Навигация на страницу мероприятия
    window.location.href = `/events/${eventId}`;
  };

  const handleRegister = (eventId: string) => {
    console.log("Register for event:", eventId);
    // Логика регистрации
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "Все" ||
      event.category === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

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
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Найдено: {filteredEvents.length} мероприятий
              </span>
              <Button variant="outline">Сбросить фильтры</Button>
            </div>
          </Card>
        </div>

        {/* Сетка мероприятий */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={handleViewDetails}
                onRegister={handleRegister}
              />
            ))}
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

        {/* Пагинация (пока заглушка) */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              Назад
            </Button>
            <Button variant="primary">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Вперед</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
