"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Валидация
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Все поля обязательны для заполнения");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Заглушка успешной регистрации
      console.log("Registration attempt:", formData);

      // Редирект на главную после успешной регистрации
      router.push("/");
    } catch (err) {
      setError("Ошибка при регистрации. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Регистрация</h1>
        <p className="text-gray-600">Создайте новый аккаунт</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Имя"
            name="firstName"
            placeholder="Иван"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Фамилия"
            name="lastName"
            placeholder="Иванов"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Пароль"
          name="password"
          type="password"
          placeholder="Минимум 6 символов"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Подтвердите пароль"
          name="confirmPassword"
          type="password"
          placeholder="Повторите пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="text-sm text-gray-600">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 mr-2"
              required
            />
            <span>
              Я соглашаюсь с{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                условиями использования
              </Link>{" "}
              и{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700"
              >
                политикой конфиденциальности
              </Link>
            </span>
          </label>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Зарегистрироваться
        </Button>

        <div className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Войти
          </Link>
        </div>
      </form>
    </Card>
  );
};

export default RegisterForm;
