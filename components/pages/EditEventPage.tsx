"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, LoadingSpinner } from "@/components/ui";

interface EditEventPageProps {
  eventId: string;
}

const EditEventPage = ({ eventId }: EditEventPageProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxParticipants: "",
    price: "0",
    isOnline: false,
    onlineLink: "",
    tags: "",
  });

  useEffect(() => {
    // Имитация загрузки данных мероприятия
    const loadEventData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Заглушка данных
        setFormData({
          title: "Frontend Meetup: React 19 Preview",
          description:
            "Ежемесячная встреча фронтенд-разработчиков. Обсуждаем React 19 и новые возможности.",
          date: "2024-12-20",
          time: "19:00",
          location: 'Москва, Коворкинг "Loft"',
          category: "Технологии",
          maxParticipants: "50",
          price: "0",
          isOnline: false,
          onlineLink: "",
          tags: "React, JavaScript, Frontend, Meetup",
        });
      } catch (err) {
        setError("Ошибка загрузки данных мероприятия");
      } finally {
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // Имитация сохранения
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Изменения сохранены успешно!");

      setTimeout(() => {
        router.push(`/events/${eventId}`);
      }, 1500);
    } catch (err) {
      setError("Ошибка при сохранении изменений");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Назад к мероприятию
          </button>
        </div>

        <Card className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Редактирование мероприятия
            </h1>
            <p className="text-gray-600">ID мероприятия: {eventId}</p>
          </div>

          {/* Форма аналогичная CreateEventPage */}
          {/* Можно вынести общую форму в отдельный компонент */}

          <div className="text-center">
            <p className="text-gray-500">
              Компонент редактирования в разработке
            </p>
            <Button
              onClick={() => router.push(`/events/${eventId}`)}
              variant="outline"
              className="mt-4"
            >
              Вернуться к просмотру
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditEventPage;
