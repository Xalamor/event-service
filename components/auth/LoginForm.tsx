"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoginMutation } from "@/lib/store/api/authApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/store/slices/authSlice";
import { setUser } from "@/lib/store/slices/userSlice";
import { Button, Input, Card } from "@/components/ui";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    try {
      const result = await login(formData).unwrap();

      console.log("Login successful:", result);

      // Сохраняем токен и данные пользователя
      dispatch(
        loginSuccess({
          access: result.token, // Используем result.token
          refresh: "", // refresh токена нет
        })
      );

      dispatch(
        setUser({
          id: result.user.id.toString(),
          email: result.user.email,
          firstName: result.user.first_name,
          lastName: result.user.last_name,
          role: result.user.is_admin ? "organizer" : "user",
        })
      );

      // Сохраняем только access токен (refresh нет)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.token);
      }

      // Редирект на главную
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.data) {
        if (err.data.detail) {
          setError(err.data.detail);
        } else if (err.data.email) {
          setError(err.data.email[0]);
        } else if (err.data.password) {
          setError(err.data.password[0]);
        } else if (err.data.message) {
          setError(err.data.message);
        } else {
          setError("Ошибка при входе. Проверьте данные.");
        }
      } else if (err.status === 401) {
        setError("Неверный email или пароль");
      } else if (err.status === 400) {
        setError("Неверный формат данных");
      } else {
        setError("Ошибка соединения с сервером");
      }
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
