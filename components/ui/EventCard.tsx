"use client";

import { Event } from "@/lib/store/api/eventsApi";
import Button from "./Button";
import Card from "./Card";

interface EventCardProps {
  event: Event;
  onViewDetails?: (eventId: string) => void;
  onRegister?: (eventId: string) => void;
  isRegistered?: boolean;
}

const EventCard = ({
  event,
  onViewDetails,
  onRegister,
  isRegistered = false,
}: EventCardProps) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("ru-RU", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isEventFull =
    event.maxParticipants && event.currentParticipants >= event.maxParticipants;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-20 font-medium">Когда:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium">Где:</span>
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 font-medium">Категория:</span>
              <span className="capitalize">{event.category}</span>
            </div>
            {event.maxParticipants && (
              <div className="flex items-center">
                <span className="w-20 font-medium">Участники:</span>
                <span>
                  {event.currentParticipants}/{event.maxParticipants}
                </span>
              </div>
            )}
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
              disabled={isEventFull}
              className="flex-1"
            >
              {isEventFull ? "Мест нет" : "Зарегистрироваться"}
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
