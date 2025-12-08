"use client";

import { useParams } from "next/navigation";
import EventDetailsPage from "@/components/pages/EventDetailsPage";

export default function EventDetails() {
  const params = useParams();
  const id = params?.id as string;

  console.log("EventDetails params:", params);
  console.log("EventDetails id:", id);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Ошибка загрузки
          </h2>
          <p className="text-gray-600 mb-4">
            Не удалось получить ID мероприятия
          </p>
          <button
            onClick={() => (window.location.href = "/events")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Вернуться к мероприятиям
          </button>
        </div>
      </div>
    );
  }

  return <EventDetailsPage eventId={id} />;
}
