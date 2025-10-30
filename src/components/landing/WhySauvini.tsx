"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

interface CardData {
  id: number
  title: string
  description: string
  image: string
  borderColor: string
}

export default function WhySauvini() {
  const { t, isRTL } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(2) // Start with middle card
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const cards: CardData[] = [
    {
      id: 1,
      title: t("landing.whySauvini.structuredLearning.title") || "Structured Learning",
      description: t("landing.whySauvini.structuredLearning.desc") || "Modules, chapters, and lessons designed for Algerian academic streams.",
      image: "/landing/reading-glasses.svg",
      borderColor: "var(--second02-200, #9663FE)"
    },
    {
      id: 2,
      title: t("landing.whySauvini.expertProfessors.title") || "Expert Professors",
      description: t("landing.whySauvini.expertProfessors.desc") || "Learn from verified teachers with years of real experience.",
      image: "/landing/professor.svg",
      borderColor: "var(--second01-200, #FFD427)"
    },
    {
      id: 3,
      title: t("landing.whySauvini.trackProgress.title") || "Track Progress",
      description: t("landing.whySauvini.trackProgress.desc") || "Stay on top of your completed lessons and achievements.",
      image: "/landing/progress-indicator.svg",
      borderColor: "var(--primary-300, #324C72)"
    },
    {
      id: 4,
      title: t("landing.whySauvini.gamifiedLearning.title") || "Gamified Learning",
      description: t("landing.whySauvini.gamifiedLearning.desc") || "Earn XP, unlock badges, and level up as you study.",
      image: "/landing/winners.svg",
      borderColor: "var(--second01-200, #FFD427)"
    },
    {
      id: 5,
      title: t("landing.whySauvini.trustedSecure.title") || "Trusted & Secure",
      description: t("landing.whySauvini.trustedSecure.desc") || "Your data and payments are safe, and content is validated by admins.",
      image: "/landing/secure-data.svg",
      borderColor: "var(--second02-200, #9663FE)"
    },
    {
      id: 6,
      title: t("landing.whySauvini.accessibleAnywhere.title") || "Accessible Anywhere",
      description: t("landing.whySauvini.accessibleAnywhere.desc") || "Learn at your own pace, anytime, anywhere, on any device.",
      image: "/landing/web-devices.svg",
      borderColor: "var(--primary-300, #324C72)"
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, cards.length])

  const nextCard = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const prevCard = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const getVisibleCards = () => {
    const visibleCards = []
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + cards.length) % cards.length
      visibleCards.push({
        ...cards[index],
        position: i,
        isActive: i === 0
      })
    }
    return visibleCards
  }

  const getCardTransform = (position: number, isActive: boolean) => {
    const CARD_SPACING = 22
    const ACTIVE_CARD_WIDTH = 444
    const INACTIVE_CARD_WIDTH = 390
    
    const cardWidth = isActive ? ACTIVE_CARD_WIDTH : INACTIVE_CARD_WIDTH
    const translateX = position * (cardWidth + CARD_SPACING)
    const scale = isActive ? 1 : 0.85
    const opacity = Math.abs(position) > 2 ? 0.3 : 1
    
    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      zIndex: isActive ? 10 : 5 - Math.abs(position),
      opacity,
    }
  }

  const handleCardClick = (position: number) => {
    if (position !== 0) {
      setCurrentIndex((currentIndex + position + cards.length) % cards.length)
      setIsAutoPlaying(false)
    }
  }

  const renderCard = (card: CardData & { position: number; isActive: boolean }) => {
    const { position, isActive } = card

    return (
      <motion.div
        key={card.id}
        animate={getCardTransform(position, isActive)}
        transition={{ 
          duration: 0.5,
          ease: "easeInOut"
        }}
        className="absolute cursor-pointer"
        onClick={() => handleCardClick(position)}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: isActive ? "444px" : "390px",
          height: isActive ? "542px" : "476px",
          padding: "60px 20px",
          gap: "44px",
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
            className="object-contain"
            style={{
              width: "241.571px",
              height: "180px",
              aspectRatio: "51/38"
            }}
          />
        </div>

        {/* Card Content */}
        <div 
          className="flex flex-col items-center self-stretch"
          style={{
            gap: "16px",
            borderRadius: isActive ? "70px" : "0"
          }}
        >
          <h3 
            className="text-center font-semibold transition-colors duration-200"
            style={{
              fontSize: "36px",
              lineHeight: "normal",
              letterSpacing: "-0.72px",
              fontWeight: 600,
              color: "var(--neutral-600, #1A1A1A)"
            }}
          >
            {card.title}
          </h3>

          <p 
            className="self-stretch text-center font-medium transition-colors duration-200"
            style={{
              fontSize: "24px",
              lineHeight: "36px",
              letterSpacing: "-0.48px",
              fontWeight: 500,
              color: "var(--neutral-400, #7C7C7C)"
            }}
          >
            {card.description}
          </p>
        </div>
      </motion.div>
    )
  }

  const NavigationButton = ({ direction, onClick }: { direction: 'left' | 'right', onClick: () => void }) => (
    <motion.button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center
                 bg-primary-50 backdrop-blur-sm 
                 text-primary-600
                 transition-all duration-200 ease-out
                 hover:bg-white hover:border-neutral-400
                 dark:hover:bg-neutral-200"
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "28px",
        [direction === 'left' ? 'left' : 'right']: "40px",
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)"
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={direction === 'left' ? 'Previous card' : 'Next card'}
    >
      {direction === 'left' ? (
        <ChevronLeft className="w-6 h-6" strokeWidth={2} />
      ) : (
        <ChevronRight className="w-6 h-6" strokeWidth={2} />
      )}
    </motion.button>
  )

  return (
    <section 
      className="w-full overflow-hidden"
      style={{
        height: "747px",
        flexShrink: 0,
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full h-full flex flex-col">
        {/* Section Title */}
        <div
          className="inline-flex justify-center items-center"
          style={{
            padding: "20px 40px",
            gap: "10px",
          }}
        >
          <h2 
            className="font-bold transition-colors duration-200"
            style={{
              fontSize: "96px",
              fontWeight: 700,
              lineHeight: "normal",
              letterSpacing: "-1.92px",
              color: "var(--neutral-600, #1A1A1A)"
            }}
          >
            {t("landing.whySauvini.title") || "Why Sauvini?"}
          </h2>
        </div>

        {/* Cards Slider */}
        <div className="relative flex-1">
          {/* Navigation Buttons */}
          <NavigationButton 
            direction="left" 
            onClick={isRTL ? nextCard : prevCard} 
          />
          <NavigationButton 
            direction="right" 
            onClick={isRTL ? prevCard : nextCard} 
          />

          <div
            className="inline-flex items-center overflow-hidden"
            style={{
              gap: "22px",
              padding: "80px 0",
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <div className="relative flex items-center justify-center w-full">
              {getVisibleCards().map(renderCard)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}