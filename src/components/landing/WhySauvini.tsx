"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  borderColor: string;
}

export default function WhySauvini() {
  const { t, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(2); // Start with middle card
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const cards: CardData[] = [
    {
      id: 1,
      title:
        t("landing.whySauvini.structuredLearning.title") ||
        "Structured Learning",
      description:
        t("landing.whySauvini.structuredLearning.desc") ||
        "Modules, chapters, and lessons designed for Algerian academic streams.",
      image: "/landing/reading-glasses.svg",
      borderColor: "var(--second02-200, #9663FE)",
    },
    {
      id: 2,
      title:
        t("landing.whySauvini.expertProfessors.title") || "Expert Professors",
      description:
        t("landing.whySauvini.expertProfessors.desc") ||
        "Learn from verified teachers with years of real experience.",
      image: "/landing/professor.svg",
      borderColor: "var(--second01-200, #FFD427)",
    },
    {
      id: 3,
      title: t("landing.whySauvini.trackProgress.title") || "Track Progress",
      description:
        t("landing.whySauvini.trackProgress.desc") ||
        "Stay on top of your completed lessons and achievements.",
      image: "/landing/progress-indicator.svg",
      borderColor: "var(--primary-300, #324C72)",
    },
    {
      id: 4,
      title:
        t("landing.whySauvini.gamifiedLearning.title") || "Gamified Learning",
      description:
        t("landing.whySauvini.gamifiedLearning.desc") ||
        "Earn XP, unlock badges, and level up as you study.",
      image: "/landing/winners.svg",
      borderColor: "var(--second01-200, #FFD427)",
    },
    {
      id: 5,
      title: t("landing.whySauvini.trustedSecure.title") || "Trusted & Secure",
      description:
        t("landing.whySauvini.trustedSecure.desc") ||
        "Your data and payments are safe, and content is validated by admins.",
      image: "/landing/secure-data.svg",
      borderColor: "var(--second02-200, #9663FE)",
    },
    {
      id: 6,
      title:
        t("landing.whySauvini.accessibleAnywhere.title") ||
        "Accessible Anywhere",
      description:
        t("landing.whySauvini.accessibleAnywhere.desc") ||
        "Learn at your own pace, anytime, anywhere, on any device.",
      image: "/landing/web-devices.svg",
      borderColor: "var(--primary-300, #324C72)",
    },
  ];

  // Track mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, cards.length]);

  const nextCard = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + cards.length) % cards.length;
      visibleCards.push({
        ...cards[index],
        position: i,
        isActive: i === 0,
      });
    }
    return visibleCards;
  };

  const getCardTransform = (position: number, isActive: boolean) => {
    // Mobile: show single card centered
    if (isMobile) {
      if (position === 0) {
        return {
          transform: "translateX(0) scale(1)",
          zIndex: 10,
          opacity: 1,
        };
      }
      return {
        transform: "translateX(0) scale(0)",
        zIndex: 0,
        opacity: 0,
      };
    }

    // Desktop: carousel view
    const CARD_SPACING = 22;
    const ACTIVE_CARD_WIDTH = 444;
    const INACTIVE_CARD_WIDTH = 390;

    const cardWidth = isActive ? ACTIVE_CARD_WIDTH : INACTIVE_CARD_WIDTH;
    const translateX = position * (cardWidth + CARD_SPACING);
    const scale = isActive ? 1 : 0.85;
    const opacity = Math.abs(position) > 2 ? 0.3 : 1;

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      zIndex: isActive ? 10 : 5 - Math.abs(position),
      opacity,
    };
  };

  const handleCardClick = (position: number) => {
    if (position !== 0) {
      setCurrentIndex((currentIndex + position + cards.length) % cards.length);
      setIsAutoPlaying(false);
    }
  };

  const renderCard = (
    card: CardData & { position: number; isActive: boolean }
  ) => {
    const { position, isActive } = card;

    return (
      <motion.div
        key={card.id}
        animate={getCardTransform(position, isActive)}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="absolute cursor-pointer w-[calc(100%-2rem)] max-w-[444px] md:w-[390px] lg:w-auto"
        onClick={() => handleCardClick(position)}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: isActive ? "min(444px, calc(100% - 2rem))" : "390px",
          height: isActive ? "auto" : "476px",
          minHeight: isActive ? "400px" : "400px",
          padding: "40px 20px",
          gap: "32px",
          flexShrink: 0,
          borderRadius: "52px",
          background: "var(--neutral-100, #F8F8F8)",
          border: isActive ? `4px solid ${card.borderColor}` : "none",
          boxShadow: isActive ? "0 4px 8px 0 rgba(0, 0, 0, 0.25)" : "none",
        }}
      >
        {/* Card Image */}
        <div className="flex-shrink-0">
          <Image
            src={card.image}
            alt={card.title}
            width={242}
            height={180}
            className="object-contain w-full max-w-[180px] sm:max-w-[220px] lg:max-w-[241.571px] h-auto"
            style={{
              aspectRatio: "51/38",
            }}
          />
        </div>

        {/* Card Content */}
        <div
          className="flex flex-col items-center self-stretch"
          style={{
            gap: "16px",
            borderRadius: isActive ? "70px" : "0",
          }}
        >
          <h3
            className="text-center font-semibold transition-colors duration-200 text-xl sm:text-2xl md:text-3xl lg:text-[36px] leading-tight"
            style={{
              letterSpacing: "-0.36px",
              fontWeight: 600,
              color: "var(--neutral-600, #1A1A1A)",
            }}
          >
            {card.title}
          </h3>

          <p
            className="self-stretch text-center font-medium transition-colors duration-200 text-sm sm:text-base md:text-lg lg:text-[24px] leading-relaxed"
            style={{
              letterSpacing: "-0.24px",
              fontWeight: 500,
              color: "var(--neutral-400, #7C7C7C)",
            }}
          >
            {card.description}
          </p>
        </div>
      </motion.div>
    );
  };

  const NavigationButton = ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick: () => void;
  }) => (
    <motion.button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center
                 bg-primary-50 backdrop-blur-sm 
                 text-primary-600
                 transition-all duration-200 ease-out
                 hover:bg-white hover:border-neutral-400
                 dark:hover:bg-neutral-200
                 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14
                 rounded-full"
      style={{
        [direction === "left" ? "left" : "right"]: "10px",
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={direction === "left" ? "Previous card" : "Next card"}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
      ) : (
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
      )}
    </motion.button>
  );

  return (
    <section
      className="w-full overflow-hidden min-h-[600px] md:min-h-[700px] lg:h-[747px] py-8 md:py-12 lg:py-0"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full h-full flex flex-col">
        {/* Section Title */}
        <div className="inline-flex justify-center items-center px-4 py-4 md:py-6 lg:py-5">
          <h2
            className="font-bold transition-colors duration-200 text-3xl sm:text-4xl md:text-5xl lg:text-[96px] text-center"
            style={{
              fontWeight: 700,
              lineHeight: "normal",
              letterSpacing: "-0.96px",
              color: "var(--neutral-600, #1A1A1A)",
            }}
          >
            {t("landing.whySauvini.title") || "Why Sauvini?"}
          </h2>
        </div>

        {/* Cards Slider */}
        <div className="relative flex-1 min-h-[500px] md:min-h-[550px]">
          {/* Navigation Buttons */}
          <NavigationButton
            direction="left"
            onClick={isRTL ? nextCard : prevCard}
          />
          <NavigationButton
            direction="right"
            onClick={isRTL ? prevCard : nextCard}
          />

          <div className="inline-flex items-center overflow-hidden gap-4 md:gap-5 lg:gap-[22px] px-4 py-8 md:py-12 lg:py-20 w-full h-full justify-center">
            <div className="relative flex items-center justify-center w-full h-full">
              {getVisibleCards().map(renderCard)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
