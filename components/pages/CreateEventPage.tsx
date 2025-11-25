"use client";

import { Card, Button } from "@/components/ui";

const CreateEventPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Создание мероприятия
          </h1>
          <p className="text-gray-600 mb-8">
            Эта страница находится в разработке
          </p>

          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Скоро здесь можно будет создавать мероприятия
            </h2>
            <Button onClick={() => window.history.back()} variant="outline">
              Вернуться назад
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateEventPage;
