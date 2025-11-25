"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      setError("Все поля обязательны для заполнения");
      setIsLoading(false);
      return;
    }

    try {
      // Имитация API запроса (позже подключим Redux)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Заглушка успешного входа
      console.log("Login attempt:", formData);

      // Редирект на главную после успешного входа
      router.push("/");
    } catch (err) {
      setError("Ошибка при входе. Проверьте email и пароль.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Вход в аккаунт
        </h1>
        <p className="text-gray-600">Введите ваши данные для входа</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
          placeholder="Введите пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-600">Запомнить меня</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700"
          >
            Забыли пароль?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Войти
        </Button>

        <div className="text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;
