"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setUser } from "@/lib/store/slices/userSlice";
import { Button, Input, Card } from "@/components/ui";

interface EditProfileFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const EditProfileForm = ({ onCancel, onSuccess }: EditProfileFormProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "", // Добавим если нужно
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
    if (!formData.firstName.trim()) {
      setError("Имя обязательно для заполнения");
      return false;
    }

    if (!formData.lastName.trim()) {
      setError("Фамилия обязательна для заполнения");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email обязателен для заполнения");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Введите корректный email");
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
      // Имитация API запроса к бэкенду
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Обновляем данные в Redux store
      dispatch(
        setUser({
          ...currentUser!,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        })
      );

      setSuccess("Профиль успешно обновлен!");

      // Вызываем callback успеха через 1.5 секунды
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Ошибка при обновлении профиля. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Редактирование профиля
        </h3>
        <p className="text-gray-600">Обновите вашу личную информацию</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Имя *"
            name="firstName"
            placeholder="Введите ваше имя"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Фамилия *"
            name="lastName"
            placeholder="Введите вашу фамилию"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Email *"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
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
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>

        <div className="text-sm text-gray-500 text-center pt-2">
          Поля, отмеченные *, обязательны для заполнения
        </div>
      </form>
    </Card>
  );
};

export default EditProfileForm;
