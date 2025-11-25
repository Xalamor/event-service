import { Hero, CategoryGrid, FeaturedEvents } from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <CategoryGrid />
      <FeaturedEvents />
    </div>
  );
}
