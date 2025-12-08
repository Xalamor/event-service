"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegisterMutation } from "@/lib/store/api/authApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/store/slices/authSlice";
import { setUser } from "@/lib/store/slices/userSlice";
import { Button, Input, Card } from "@/components/ui";

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
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

    // Валидация...

    const registrationData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
    };

    try {
      const result = await register(registrationData).unwrap();

      console.log("Registration successful:", result);

      // Сохраняем токен и данные пользователя
      dispatch(
        loginSuccess({
          access: result.token, // Используем result.token
          refresh: "",
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

      // Сохраняем токен
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.token);
      }

      router.push("/");
    } catch (err: any) {
      console.error("Registration error:", err);

      // Аналогичная обработка ошибок как в LoginForm
      if (err.data) {
        if (err.data.detail) {
          setError(err.data.detail);
        } else if (err.data.email) {
          setError(`Email: ${err.data.email[0]}`);
        } else if (err.data.username) {
          setError(`Имя пользователя: ${err.data.username[0]}`);
        } else if (err.data.password) {
          setError(`Пароль: ${err.data.password[0]}`);
        } else if (err.data.message) {
          setError(err.data.message);
        } else {
          const firstError = Object.values(err.data)[0];
          setError(
            Array.isArray(firstError) ? firstError[0] : "Ошибка при регистрации"
          );
        }
      } else {
        setError("Ошибка соединения с сервером");
      }
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
          label="Имя пользователя"
          name="username"
          placeholder="ivan123"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Имя"
            name="first_name"
            placeholder="Иван"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Фамилия"
            name="last_name"
            placeholder="Иванов"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

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
