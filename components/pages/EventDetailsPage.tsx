"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  useGetEventQuery,
  useRegisterForEventMutation,
  useCancelRegistrationMutation,
} from "@/lib/store/api/eventsApi";
import { Button, Card, LoadingSpinner } from "@/components/ui";

interface EventDetailsPageProps {
  eventId: string;
}

const EventDetailsPage = ({ eventId }: EventDetailsPageProps) => {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { token } = useSelector((state: RootState) => state.auth);

  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  console.log("EventDetailsPage received eventId:", eventId);
  console.log("Current user:", currentUser);

  // Проверяем что eventId валидный - ДО любых хуков
  const parsedEventId = parseInt(eventId);

  // ВСЕ хуки должны быть вызваны до любых условных return
  const {
    data: eventResponse,
    isLoading,
    error,
    refetch,
  } = useGetEventQuery(isNaN(parsedEventId) ? 0 : parsedEventId); // Передаем 0 если невалидный

  const [registerForEvent] = useRegisterForEventMutation();
  const [cancelRegistration] = useCancelRegistrationMutation();

  // Теперь проверяем невалидный ID
  if (isNaN(parsedEventId)) {
    console.error("Invalid eventId:", eventId);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Неверный ID мероприятия
            </h2>
            <p className="text-gray-600 mb-6">
              ID мероприятия должен быть числом. Получено: "{eventId}"
            </p>
            <Button onClick={() => router.push("/events")}>
              Вернуться к мероприятиям
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Проверяем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Проверяем ошибку или отсутствие данных
  if (error || !eventResponse?.event) {
    console.error("Event error:", error);
    console.error("Event data:", eventResponse);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Мероприятие не найдено
            </h2>
            <p className="text-gray-600 mb-6">
              Запрашиваемое мероприятие не существует или было удалено.
            </p>
            <Button onClick={() => router.push("/events")}>
              Вернуться к мероприятиям
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Извлекаем событие из ответа
  const event = eventResponse.event;
  console.log("Event data:", event);

  const eventDate = new Date(event.date_time);
  const formattedDate = eventDate.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRegister = async () => {
    if (!token) {
      alert("Для регистрации необходимо войти в аккаунт");
      router.push("/login");
      return;
    }

    setIsLoadingAction(true);
    try {
      await registerForEvent(event.id).unwrap();
      setIsRegistered(true);
      alert("Вы успешно зарегистрировались на мероприятие!");
      refetch();
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.data?.detail) {
        alert(`Ошибка: ${err.data.detail}`);
      } else {
        alert("Ошибка при регистрации. Попробуйте позже.");
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (confirm("Вы уверены, что хотите отменить регистрацию?")) {
      setIsLoadingAction(true);
      try {
        await cancelRegistration(event.id).unwrap();
        setIsRegistered(false);
        alert("Регистрация отменена");
        refetch();
      } catch (err: any) {
        console.error("Cancel registration error:", err);
        alert("Ошибка при отмене регистрации");
      } finally {
        setIsLoadingAction(false);
      }
    }
  };

  const isFull =
    event.current_participants &&
    event.current_participants >= event.max_participants;
  const availableSpots =
    event.max_participants - (event.current_participants || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Хлебные крошки */}
        <nav className="mb-6">
          <button
            onClick={() => router.push("/events")}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Все мероприятия
          </button>
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

              {event.image_url && (
                <div className="mb-6">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

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
                      {event.current_participants || 0}/{event.max_participants}
                      {availableSpots > 0 && (
                        <span className="text-green-600 ml-1">
                          ({availableSpots} свободно)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {event.points_reward && event.points_reward > 0 && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      ⭐
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Награда</div>
                      <div className="text-gray-600">
                        {event.points_reward} баллов
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Дополнительная информация */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Дополнительная информация
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>
                    Мероприятие создано:{" "}
                    {new Date(event.created_at).toLocaleDateString("ru-RU")}
                  </p>
                  {event.price && event.price > 0 && (
                    <p>💰 Стоимость: {event.price} ₽</p>
                  )}
                  <p>ID организатора: {event.organizer_id}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Боковая панель с регистрацией */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  Бесплатно
                </div>
                <div className="text-gray-600">
                  {event.current_participants || 0} из {event.max_participants}{" "}
                  мест занято
                </div>
              </div>

              {isRegistered ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
                    ✅ Вы зарегистрированы на это мероприятие
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mb-2"
                    onClick={() => {
                      // Добавить в календарь
                      const calendarEvent = {
                        title: event.title,
                        description: event.description,
                        start: event.date_time,
                        end: new Date(
                          new Date(event.date_time).getTime() +
                            2 * 60 * 60 * 1000
                        ).toISOString(),
                        location: event.location,
                      };
                      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        calendarEvent.title
                      )}&details=${encodeURIComponent(
                        calendarEvent.description
                      )}&dates=${calendarEvent.start.replace(
                        /[-:]/g,
                        ""
                      )}/${calendarEvent.end.replace(
                        /[-:]/g,
                        ""
                      )}&location=${encodeURIComponent(
                        calendarEvent.location
                      )}`;
                      window.open(calendarUrl, "_blank");
                    }}
                  >
                    Добавить в календарь
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={handleCancelRegistration}
                    isLoading={isLoadingAction}
                  >
                    Отменить регистрацию
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleRegister}
                    disabled={isFull || isLoadingAction}
                    isLoading={isLoadingAction}
                    className="w-full mb-4"
                  >
                    {isFull ? "Мест нет" : "Зарегистрироваться"}
                  </Button>

                  {/* Кнопка редактирования для организатора */}
                  {currentUser?.id &&
                    event.organizer_id &&
                    currentUser.id.toString() ===
                      event.organizer_id.toString() && (
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/events/edit/${event.id}`)}
                        className="w-full mt-2"
                      >
                        Редактировать мероприятие
                      </Button>
                    )}
                </>
              )}

              <div className="text-sm text-gray-500 text-center mt-4">
                Регистрация {isFull ? "закрыта" : "открыта"}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
