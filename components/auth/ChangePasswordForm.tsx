"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Card, Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import EditProfileForm from "@/components/auth/EditProfileForm";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";

const ProfilePage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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

  // Функции для обработки кликов
  const handleEditProfile = () => {
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    setShowPasswordForm(true);
  };

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
                    {currentUser.role === "admin"
                      ? "Администратор"
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

              <div className="mt-6 pt-6 border-t">
                {!isEditing ? (
                  <Button onClick={handleEditProfile} className="w-full">
                    Редактировать профиль
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="w-full"
                  >
                    Отменить редактирование
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Быстрые действия
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleEditProfile}
                >
                  Редактировать профиль
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePasswordChange}
                >
                  Сменить пароль
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    alert("Настройки уведомлений в разработке");
                  }}
                >
                  Настройки уведомлений
                </Button>
              </div>
            </Card>
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <EditProfileForm
                onCancel={handleCancelEdit}
                onSuccess={handleCancelEdit}
              />
            ) : (
              <>
                <Card className="p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Мой профиль
                    </h1>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditProfile}
                    >
                      Редактировать
                    </Button>
                  </div>

                  {/* ... остальной контент профиля ... */}
                </Card>

                {/* ... остальные карточки ... */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно для смены пароля */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <ChangePasswordForm
              onCancel={() => setShowPasswordForm(false)}
              onSuccess={() => setShowPasswordForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
