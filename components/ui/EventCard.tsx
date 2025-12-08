"use client";

import Button from "./Button";
import Card from "./Card";

interface EventCardProps {
  event: any; // Временно используем any
  onViewDetails?: (eventId: number) => void;
  onRegister?: (eventId: number) => void;
  isRegistered?: boolean;
}

const EventCard = ({
  event,
  onViewDetails,
  onRegister,
  isRegistered = false,
}: EventCardProps) => {
  console.log("EventCard props:", {
    event,
    hasId: event?.id,
    hasTitle: event?.title,
  });

  if (!event || !event.id) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          Некорректные данные мероприятия
        </div>
      </Card>
    );
  }

  const eventDate = new Date(event.date_time);
  const formattedDate = eventDate.toLocaleDateString("ru-RU", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isFull =
    event.current_participants &&
    event.current_participants >= event.max_participants;
  const availableSpots =
    event.max_participants - (event.current_participants || 0);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col h-full">
        {event.image_url && (
          <div className="mb-4">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {event.title || "Без названия"}
            </h3>
            {event.points_reward && event.points_reward > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full whitespace-nowrap">
                +{event.points_reward} баллов
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description || "Без описания"}
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-20 font-medium">Когда:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium">Где:</span>
              <span>{event.location || "Не указано"}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium">Категория:</span>
              <span className="capitalize">
                {event.category || "Не указана"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium">Участники:</span>
              <span>
                {event.current_participants || 0}/{event.max_participants}
                {availableSpots > 0 && (
                  <span className="text-green-600 ml-1">
                    ({availableSpots} свободно)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(event.id)}
              className="flex-1"
            >
              Подробнее
            </Button>
          )}

          {onRegister && !isRegistered && (
            <Button
              size="sm"
              onClick={() => onRegister(event.id)}
              disabled={isFull}
              className="flex-1"
            >
              {isFull ? "Мест нет" : "Зарегистрироваться"}
            </Button>
          )}

          {isRegistered && (
            <Button variant="secondary" size="sm" disabled className="flex-1">
              Вы зарегистрированы
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
