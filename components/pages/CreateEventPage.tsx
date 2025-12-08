"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useCreateEventMutation } from "@/lib/store/api/eventsApi";
import { Card, Button, Input } from "@/components/ui";

const CreateEventPage = () => {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { token } = useSelector((state: RootState) => state.auth);
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_time: "",
    location: "",
    category: "",
    max_participants: "",
    points_reward: "",
    image_url: "",
    is_online: false,
    price: "0",
  });

  const categories = [
    "Технологии",
    "Обучение",
    "Конференция",
    "Хакатон",
    "Воркшоп",
    "Митап",
    "Бизнес",
    "Спорт",
    "Искусство",
    "Другое",
  ];

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

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Название мероприятия обязательно");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Описание мероприятия обязательно");
      return false;
    }

    if (!formData.date_time) {
      setError("Дата и время мероприятия обязательны");
      return false;
    }

    if (!formData.location.trim() && !formData.is_online) {
      setError("Укажите место проведения или выберите онлайн формат");
      return false;
    }

    if (!formData.category) {
      setError("Выберите категорию мероприятия");
      return false;
    }

    if (!formData.max_participants || parseInt(formData.max_participants) < 1) {
      setError("Укажите максимальное количество участников (минимум 1)");
      return false;
    }

    return true;
  };

  const handleCancel = () => {
    if (confirm("Вы уверены? Все несохраненные изменения будут потеряны.")) {
      router.push("/events");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      // Форматируем дату в правильный формат ISO с Z
      let formattedDateTime = formData.date_time;
      if (!formData.date_time.endsWith("Z")) {
        formattedDateTime = formData.date_time + ":00Z";
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        date_time: formattedDateTime,
        location: formData.location,
        category: formData.category,
        max_participants: parseInt(formData.max_participants),
        points_reward: formData.points_reward
          ? parseInt(formData.points_reward)
          : undefined,
        image_url: formData.image_url || undefined,
        is_online: formData.is_online,
        price: parseFloat(formData.price) || 0,
      };

      console.log("Отправляемые данные:", JSON.stringify(eventData, null, 2));

      const result = await createEvent(eventData).unwrap();

      console.log("Успешный ответ:", result);

      setSuccess("Мероприятие успешно создано!");

      // Очищаем форму
      setFormData({
        title: "",
        description: "",
        date_time: "",
        location: "",
        category: "",
        max_participants: "",
        points_reward: "",
        image_url: "",
        is_online: false,
        price: "0",
      });

      // Автоматический редирект через 2 секунды
      setTimeout(() => {
        router.push("/events");
      }, 2000);
    } catch (err: any) {
      console.error("Полная ошибка создания мероприятия:", err);

      if (err.data) {
        console.log("Данные ошибки:", err.data);

        if (err.data.detail) {
          setError(`Ошибка: ${err.data.detail}`);
        } else if (typeof err.data === "string") {
          setError(`Ошибка: ${err.data}`);
        } else if (Array.isArray(err.data)) {
          setError(
            `Ошибки: ${err.data
              .map((e) => e.message || JSON.stringify(e))
              .join(", ")}`
          );
        } else {
          // Собираем все ошибки из объекта
          const errorMessages: string[] = [];
          Object.entries(err.data).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(", ")}`);
            } else if (typeof messages === "string") {
              errorMessages.push(`${field}: ${messages}`);
            }
          });

          if (errorMessages.length > 0) {
            setError(errorMessages.join("; "));
          } else {
            setError("Ошибка при создании мероприятия. Проверьте все поля.");
          }
        }
      } else {
        setError(
          "Ошибка соединения с сервером. Проверьте интернет-соединение."
        );
      }
    }
  };

  if (!currentUser || !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Требуется авторизация
          </h2>
          <p className="text-gray-600 mb-6">
            Для создания мероприятий необходимо войти в аккаунт
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push("/login")} className="w-full">
              Войти в аккаунт
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/register")}
              className="w-full"
            >
              Зарегистрироваться
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.push("/events")}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Все мероприятия
          </button>
        </div>

        <Card className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Создание мероприятия
            </h1>
            <p className="text-gray-600">
              Заполните информацию о вашем мероприятии
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <div className="font-semibold mb-2">
                ✅ Мероприятие успешно создано!
              </div>
              <p className="mb-3">Ваше мероприятие добавлено в систему.</p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => router.push("/events")}
                  className="flex-1"
                >
                  Посмотреть все мероприятия
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Очищаем форму для создания нового
                    setFormData({
                      title: "",
                      description: "",
                      date_time: "",
                      location: "",
                      category: "",
                      max_participants: "",
                      points_reward: "",
                      image_url: "",
                      is_online: false,
                      price: "0",
                    });
                    setSuccess("");
                  }}
                  className="flex-1"
                >
                  Создать еще одно
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Основная информация
              </h3>

              <Input
                label="Название мероприятия *"
                name="title"
                placeholder="Например: Frontend Meetup или Конференция по Data Science"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание мероприятия *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Подробно опишите ваше мероприятие. Что будет происходить, кто спикеры, что узнают участники..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Дата и время *"
                  name="date_time"
                  type="datetime-local"
                  value={formData.date_time}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Место проведения */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Место проведения
              </h3>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="is_online"
                  name="is_online"
                  checked={formData.is_online}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_online" className="ml-2 text-gray-700">
                  Онлайн мероприятие
                </label>
              </div>

              <Input
                label="Место проведения *"
                name="location"
                placeholder="Например: Москва, ул. Тверская, 15, Коворкинг 'Loft'"
                value={formData.location}
                onChange={handleChange}
                required={!formData.is_online}
                disabled={formData.is_online}
              />

              <Input
                label="Ссылка на изображение (опционально)"
                name="image_url"
                placeholder="https://example.com/event-image.jpg"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>

            {/* Участники и награды */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Участники и награды
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Максимальное количество участников *"
                  name="max_participants"
                  type="number"
                  min="1"
                  placeholder="50"
                  value={formData.max_participants}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Баллы за участие (опционально)"
                  name="points_reward"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.points_reward}
                  onChange={handleChange}
                />

                <Input
                  label="Цена (₽)"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0 - для бесплатного мероприятия"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="sm:flex-1"
              >
                Отмена
              </Button>
              <Button type="submit" isLoading={isLoading} className="sm:flex-1">
                {isLoading ? "Создание..." : "Создать мероприятие"}
              </Button>
            </div>

            <div className="text-sm text-gray-500 text-center pt-4">
              Поля, отмеченные *, обязательны для заполнения
            </div>
          </form>
        </Card>

        {/* Подсказки */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            📝 Формат даты и времени
          </h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>
              • Используйте формат: <code>ГГГГ-ММ-ДДTЧЧ:ММ</code>
            </li>
            <li>
              • Пример: <code>2024-12-25T14:00</code>
            </li>
            <li>• Сервер автоматически добавит секунды и часовой пояс (Z)</li>
            <li>• Время указывается в 24-часовом формате</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default CreateEventPage;
