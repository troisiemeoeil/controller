"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SwipeSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  onComplete?: () => void
  width?: number
  text?: string
  successText?: string
}

export function SwipeSlider({
  onComplete,
  width = 210,
  text = "slide to unlock",
  successText = "unlocked",
  className,
  ...props
}: SwipeSliderProps) {
  const [complete, setComplete] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
console.log(showSuccess);

  const thumbSize = 54
  const trackWidth = width
  const trackHeight = 60
  const maxX = trackWidth - thumbSize

  const x = useMotionValue(0)
  const thumbOpacity = useTransform(x, [0, maxX * 0.05, maxX * 0.1], [0.5, 0.8, 1])
  const trackOpacity = useTransform(x, [0, maxX], [0.3, 0])
  const iconOpacity = useTransform(x, [0, maxX * 0.9, maxX], [1, 0, 0])
  const checkIconOpacity = useTransform(x, [maxX * 0.9, maxX], [0, 1])
  const textOpacity = useTransform(x, [0, maxX * 0.5], [0.8, 0])
  const successTextOpacity = useTransform(x, [maxX * 0.8, maxX], [0, 1])

  const handleDragEnd = () => {
    const currentX = x.get()

    if (currentX >= maxX * 0.9) {
      animate(x, maxX, { type: "spring", damping: 20, stiffness: 200 })
      setComplete(true)
      setShowSuccess(true)

      if (onComplete) {
        onComplete()
      }
    } else {
      animate(x, 0, { type: "spring", damping: 20, stiffness: 400 })
    }
  }

  const handleReset = () => {
    if (complete) {
      animate(x, 0, { type: "spring", damping: 20, stiffness: 400 })
      setComplete(false)
      setTimeout(() => {
        setShowSuccess(false)
      }, 300)
    }
  }

  return (
    <div
      className={cn("relative select-none touch-none", className)}
      style={{ width: trackWidth }}
      onClick={handleReset}
      {...props}
    >
      <motion.div
        className="rounded-full relative overflow-hidden"
        style={{
          width: trackWidth,
          height: trackHeight,
          background: "linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))",
          opacity: trackOpacity,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center pl-7 text-xs font-medium uppercase tracking-wider"
          style={{ opacity: textOpacity, color: "rgba(255, 255, 255, 0.8)" }}
        >
          {text}
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-sm font-medium uppercase tracking-wider text-green-400"
          style={{ opacity: successTextOpacity }}
        >
          {successText}
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxX }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        className="absolute top-1/2 left-0 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing shadow-lg"
        style={{
          x,
          y: "-50%",
          width: thumbSize,
          height: thumbSize,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          opacity: thumbOpacity,
          touchAction: "none",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div style={{ opacity: iconOpacity }}>
          <ArrowRight className="w-5 h-5 text-white" />
        </motion.div>
        <motion.div className="absolute" style={{ opacity: checkIconOpacity }}>
          <Check className="w-5 h-5 text-green-400" />
        </motion.div>
      </motion.div>
    </div>
  )
}

