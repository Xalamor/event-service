"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/ui";

// Определяем интерфейс пропсов
interface ChangePasswordFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const ChangePasswordForm = ({
  onCancel,
  onSuccess,
}: ChangePasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setError("Введите текущий пароль");
      return false;
    }

    if (!formData.newPassword.trim()) {
      setError("Введите новый пароль");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError("Новый пароль должен содержать минимум 6 символов");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Новые пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Здесь будет реальный запрос к API
      console.log("Changing password:", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess("Пароль успешно изменен!");

      // Очищаем форму
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Вызываем callback успеха
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Ошибка при смене пароля. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Смена пароля
        </h3>
        <p className="text-gray-600">Введите текущий пароль и задайте новый</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Текущий пароль *"
          name="currentPassword"
          type="password"
          placeholder="Введите текущий пароль"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />

        <Input
          label="Новый пароль *"
          name="newPassword"
          type="password"
          placeholder="Минимум 6 символов"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />

        <Input
          label="Подтвердите новый пароль *"
          name="confirmPassword"
          type="password"
          placeholder="Повторите новый пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="sm:flex-1"
          >
            Отмена
          </Button>
          <Button type="submit" isLoading={isLoading} className="sm:flex-1">
            {isLoading ? "Смена пароля..." : "Сменить пароль"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

// Экспортируем с типом
export default ChangePasswordForm;
