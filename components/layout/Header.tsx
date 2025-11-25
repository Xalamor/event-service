"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: "Главная", href: "/" },
    { name: "Мероприятия", href: "/events" },
    { name: "Создать мероприятие", href: "/create-event" },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("User logged out");
    setIsMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">
              EventPlatform
            </span>
          </Link>

          {/* Навигация - десктоп */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Кнопки авторизации - десктоп */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Мой профиль
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Войти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Регистрация</Button>
                </Link>
              </>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <div className="w-6 h-6 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-current transform transition duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2.5" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-current transition duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-current transform transition duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Мобильное меню - раскрывающееся */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-left text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                >
                  {item.name}
                </button>
              ))}

              <div className="pt-2 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="text-left text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors w-full"
                    >
                      Мой профиль
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleNavigation("/login")}
                    >
                      Войти
                    </Button>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleNavigation("/register")}
                    >
                      Регистрация
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
