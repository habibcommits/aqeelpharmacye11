import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@shared/schema";

interface HeroBannerProps {
  banners: Banner[];
}

const defaultBanners: Banner[] = [
  {
    id: "1",
    title: "Summer Collection 2025",
    subtitle: "Protect your skin with our premium sunscreens and skincare essentials",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1920&h=700&fit=crop",
    link: "/category/skin-care",
    isActive: true,
    order: 0,
  },
  {
    id: "2",
    title: "Hair Care Solutions",
    subtitle: "Professional hair treatments for healthy, beautiful hair",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=700&fit=crop",
    link: "/category/hair-care",
    isActive: true,
    order: 1,
  },
  {
    id: "3",
    title: "Baby Care Essentials",
    subtitle: "Gentle and safe products for your little ones",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1920&h=700&fit=crop",
    link: "/category/baby",
    isActive: true,
    order: 2,
  },
];

export function HeroBanner({ banners = defaultBanners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeBanners = banners.length > 0 ? banners : defaultBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const current = activeBanners[currentIndex];

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden" data-testid="hero-banner">
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title || "Banner"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              data-testid="hero-title"
            >
              {current.title}
            </h1>
            {current.subtitle && (
              <p className="text-lg md:text-xl text-white/90 mb-6" data-testid="hero-subtitle">
                {current.subtitle}
              </p>
            )}
            {current.link && (
              <Button size="lg" asChild>
                <Link href={current.link} data-testid="hero-cta">
                  Shop Now
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {activeBanners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={goToPrev}
            data-testid="hero-prev"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={goToNext}
            data-testid="hero-next"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
                data-testid={`hero-dot-${index}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
