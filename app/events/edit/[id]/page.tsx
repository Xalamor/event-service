"use client";

import { useParams } from "next/navigation";
import EventDetailsPage from "@/components/pages/EventDetailsPage";

export default function EventDetails() {
  // Используем useParams() который работает на клиенте
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">
          Ошибка: ID мероприятия не найден
        </div>
      </div>
    );
  }

  return <EventDetailsPage eventId={id} />;
}
