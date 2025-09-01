"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface Card {
  id: number
  title: string
  description: string
  image: string
}

interface CardSliderProps {
  cards: Card[]
  className?: string
}

export default function CardSlider({ cards, className = "" }: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex transition-transform duration-500 ease-in-out">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="flex-shrink-0 w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-neutral-100 rounded-lg p-6 shadow-lg transition-colors duration-200">
              <div className="w-full h-48 mb-4 relative">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain dark:brightness-150 dark:contrast-90 transition-all duration-200"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-600 transition-colors duration-200">
                {card.title}
              </h3>
              <p className="text-neutral-400 transition-colors duration-200">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}