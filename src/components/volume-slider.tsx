"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"


interface VolumeSliderProps {
    height?: number
    onChange?: (volume: number) => void
    className?: string 
  }

export function VolumeSlider({ height = 300, onChange, className, ...props }: VolumeSliderProps) {
    const [volume, setVolume] = React.useState(0.5)
    const [isDragging, setIsDragging] = React.useState(false)
    const [isStarted, setIsStarted] = React.useState(false)

    // Increase the slider width
    const sliderWidth = 80
    const trackHeight = height
    // Adjust thumb dimensions
    const thumbHeight = 22
    const thumbWidth = sliderWidth

    // Calculate the y position based on volume (0-1)
    const getYFromVolume = (vol: number) => trackHeight - trackHeight * vol
    // const getVolumeFromY = (yPos: number) => 1 - yPos / trackHeight

    // Motion values
    const y = useMotionValue(getYFromVolume(volume))

    // Transform y position to volume (0-1)
    const currentVolume = useTransform(y, [0, trackHeight], [1, 0])

    // Update volume state when motion value changes
    React.useEffect(() => {
        const unsubscribe = currentVolume.onChange((value) => {
            const clampedValue = Math.max(0, Math.min(1, value))
            setVolume(clampedValue)
            if (onChange) {
                onChange(clampedValue)
            }
        })

        return unsubscribe
    }, [currentVolume, onChange])

    // Handle drag start
    const handleDragStart = () => {
        setIsDragging(true)
    }

    // Handle drag end
    const handleDragEnd = () => {
        setIsDragging(false)
    }

    // Toggle start/close
    const toggleStartClose = () => {
        setIsStarted((prev) => !prev)
    }

    return (
        <div className={cn("flex flex-col items-center", className)} {...props}>
            <div className="flex items-center gap-3 mb-2">
                {volume === 0 ? <VolumeX className="w-5 h-5 text-black/70" /> : <Volume2 className="w-5 h-5 text-black/70" />}
                <div className="text-sm font-medium text-black/70">{Math.round(volume * 100)}%</div>
            </div>

            <div
                className="relative rounded-4xl overflow-hidden"
                style={{
                    width: sliderWidth,
                    height: trackHeight,
                    background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                {/* Fill */}
                <div
                    className="absolute left-0 right-0 bg-white/20"
                    style={{
                        height: `${volume * 100}%`,
                        transition: isDragging ? "none" : "height 0.1s ease-out",
                        bottom: `calc(var(--spacing) * -1.5)`,
                    }}
                />


                {/* Thumb */}
                <motion.div
                    drag="y"
                    dragConstraints={{
                        top: 0,
                        bottom: trackHeight - thumbHeight,
                    }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    style={{
                        y,
                        width: thumbWidth,
                        height: thumbHeight,
                        // Center the thumb horizontally
                        left: `${(sliderWidth - thumbWidth) / 2}px`,
                    }}
                    className=" top-0 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing"
                >
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: "linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5))",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }}
                    />
                </motion.div>
            </div>

            {/* Start/Close Button */}
            <motion.button
                onClick={toggleStartClose}
                className="mt-6 w-14 h-14 rounded-full flex items-center justify-center focus:outline-none"
                whileTap={{ scale: 0.95 }}
                style={{
                    background: isStarted 
                        ? "bg-green-400"
                        : "bg-red-600",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
            >
                <motion.div initial={false} animate={{ rotate: isStarted ? 0 : 0 }}>
                    {isStarted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                </motion.div>
            </motion.button>
        </div>
    )
}

