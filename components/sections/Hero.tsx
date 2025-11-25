"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

const Hero = () => {
  const router = useRouter();

  const handleFindEvents = () => {
    router.push("/events");
  };

  const handleCreateEvent = () => {
    router.push("/create-event");
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Найдите своё следующее
            <span className="block text-blue-200">мероприятие</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Откройте для себя тысячи мероприятий вокруг вас - от конференций и
            мастер-классов до встреч по интересам и культурных событий
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleFindEvents}
              className="bg-transparent text-white hover:bg-white/10 text-lg px-8 py-3 border-2 border-white"
            >
              Найти мероприятия
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleCreateEvent}
              className="bg-transparent text-white hover:bg-white/10 text-lg px-8 py-3 border-2 border-white"
            >
              Создать мероприятие
            </Button>
          </div>

          {/* Статистика */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Мероприятий ежемесячно</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Участников сообщества</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Городов по всей стране</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
