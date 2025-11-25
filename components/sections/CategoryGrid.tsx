"use client";

import { Card } from "@/components/ui";

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: "Технологии",
      description: "IT-конференции, воркшопы и митапы",
      icon: "💻",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      name: "Бизнес",
      description: "Нетворкинг, стартапы и инвестиции",
      icon: "💼",
      color: "from-green-500 to-green-600",
    },
    {
      id: 3,
      name: "Искусство",
      description: "Выставки, концерты и перформансы",
      icon: "🎨",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 4,
      name: "Образование",
      description: "Лекции, семинары и курсы",
      icon: "📚",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 5,
      name: "Спорт",
      description: "Соревнования, марафоны и тренировки",
      icon: "⚽",
      color: "from-red-500 to-red-600",
    },
    {
      id: 6,
      name: "Волонтерство",
      description: "Благотворительные и социальные события",
      icon: "🤝",
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Популярные категории
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Найдите мероприятия по вашим интересам в различных категориях
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-xl mb-4`}
              >
                {category.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>

              <p className="text-gray-600 mb-4">{category.description}</p>

              <div className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                Смотреть мероприятия →
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
