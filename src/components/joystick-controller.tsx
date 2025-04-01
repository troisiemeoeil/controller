"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { Move } from "lucide-react"
import { cn } from "@/lib/utils"

// Override the onChange type explicitly in JoystickControllerProps
interface JoystickControllerProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  size?: number
  onChange?: (x: number, y: number) => void
}

export function JoystickController({
  size = 180,
  onChange,
  className,
  ...props
}: JoystickControllerProps) {
  const knobSize = size * 0.4
  const baseSize = size
  const constraintSize = baseSize - knobSize
  const center = constraintSize / 2

  // Add state to track if the joystick is being actively dragged
  const [isDragging, setIsDragging] = React.useState(false)

  // Motion values for the knob position
  const x = useMotionValue(center)
  const y = useMotionValue(center)

  // Normalized values from -1 to 1 for camera control
  const normalizedX = useTransform(x, [0, constraintSize], [-1, 1])
  const normalizedY = useTransform(y, [0, constraintSize], [-1, 1])

  // Add these state variables at the top of the component, after the other useMotionValue declarations
  const [displayXValue, setDisplayXValue] = React.useState("0.00")
  const [displayYValue, setDisplayYValue] = React.useState("0.00")

  // Add this effect to update the display values
  React.useEffect(() => {
    const unsubscribeX = normalizedX.on("change", (value) => {
      setDisplayXValue(value.toFixed(2))
    })

    const unsubscribeY = normalizedY.on("change", (value) => {
      setDisplayYValue(value.toFixed(2))
    })

    return () => {
      unsubscribeX()
      unsubscribeY()
    }
  }, [normalizedX, normalizedY])

  // Update the onChange callback when position changes, but only when actively dragging
  React.useEffect(() => {
    const unsubscribeX = normalizedX.on("change", (latestX) => {
      if (onChange && isDragging) {
        onChange(latestX, normalizedY.get())
      }
    })

    const unsubscribeY = normalizedY.on("change", (latestY) => {
      if (onChange && isDragging) {
        onChange(normalizedX.get(), latestY)
      }
    })

    return () => {
      unsubscribeX()
      unsubscribeY()
    }
  }, [normalizedX, normalizedY, onChange, isDragging])

  // Handle drag start - set dragging state to true
  const handleDragStart = () => {
    setIsDragging(true)
  }

  // Reset to center when drag ends and set dragging state to false
  const handleDragEnd = () => {
    setIsDragging(false)
    animate(x, center, { type: "spring", damping: 15, stiffness: 150 })
    animate(y, center, { type: "spring", damping: 15, stiffness: 150 })

    // Optionally send a final "centered" position
    if (onChange) {
      onChange(0, 0)
    }
  }

  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: baseSize,
          height: baseSize,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Crosshair guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-white/20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-full w-px bg-white/20" />
        </div>

        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white/30 -translate-x-1/2 -translate-y-1/2" />

        {/* Draggable knob */}
        <motion.div
          drag
          dragConstraints={{
            top: 0,
            left: 0,
            right: constraintSize,
            bottom: constraintSize,
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            x,
            y,
            width: knobSize,
            height: knobSize,
          }}
          className="absolute top-0 left-0 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Move className="w-5 h-5 text-white/80" />
          </div>
        </motion.div>
      </div>

      {/* Position display */}
      <div className="mt-4 text-sm text-white/70 font-mono bg-black/20 px-3 py-1.5 rounded-md backdrop-blur-sm">
        <span>X: {displayXValue}</span>
        <span className="mx-2">|</span>
        <span>Y: {displayYValue}</span>
      </div>
    </div>
  )
}
