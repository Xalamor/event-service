"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Card, Button } from "@/components/ui";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Доступ запрещен
          </h2>
          <p className="text-gray-600 mb-6">
            Для просмотра профиля необходимо авторизоваться
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
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Назад
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Боковая панель с информацией */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {currentUser.firstName.charAt(0)}
                  {currentUser.lastName.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p className="text-gray-600">{currentUser.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {currentUser.role === "organizer"
                      ? "Организатор"
                      : "Пользователь"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ID пользователя:</span>
                  <span className="font-medium">{currentUser.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Роль:</span>
                  <span className="font-medium capitalize">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Быстрые действия
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Редактировать профиль
                </Button>
                <Button variant="outline" className="w-full">
                  Сменить пароль
                </Button>
                <Button variant="outline" className="w-full">
                  Настройки уведомлений
                </Button>
              </div>
            </Card>
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Мой профиль
              </h1>

              <div className="space-y-6">
                {/* Личная информация */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Личная информация
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Имя
                      </label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        {currentUser.firstName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Фамилия
                      </label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        {currentUser.lastName}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Статистика */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Статистика
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-600">Посещено</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-sm text-gray-600">Организовано</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        3
                      </div>
                      <div className="text-sm text-gray-600">Предстоящих</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        2
                      </div>
                      <div className="text-sm text-gray-600">В избранном</div>
                    </div>
                  </div>
                </div>

                {/* Предстоящие мероприятия */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Предстоящие мероприятия
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Frontend Meetup: React 19 Preview
                          </h4>
                          <p className="text-sm text-gray-600">
                            15 декабря, 19:00 • Москва
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Зарегистрирован
                        </span>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Data Science Conference
                          </h4>
                          <p className="text-sm text-gray-600">
                            20 декабря, 10:00 • Онлайн
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Зарегистрирован
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* История активности */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                История активности
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    ✓
                  </div>
                  <div>
                    <p className="text-gray-900">
                      Зарегистрировались на мероприятие "Frontend Meetup"
                    </p>
                    <p className="text-sm text-gray-500">
                      5 декабря 2024, 14:30
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    👤
                  </div>
                  <div>
                    <p className="text-gray-900">Обновили информацию профиля</p>
                    <p className="text-sm text-gray-500">
                      3 декабря 2024, 10:15
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    🎟️
                  </div>
                  <div>
                    <p className="text-gray-900">
                      Создали мероприятие "Новогодний хакатон"
                    </p>
                    <p className="text-sm text-gray-500">
                      1 декабря 2024, 16:45
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
