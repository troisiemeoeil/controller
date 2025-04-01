"use client"

import * as React from "react"
import { Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"

interface CircularSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  size?: number
  min?: number
  max?: number
  defaultValue?: number
  onChange?: (value: number) => void
  step?: number
}

export function CircularSlider({
  size = 200,
  min = 10,
  max = 30,
  defaultValue = 21,
  step = 0.5,
  onChange,
  className,
  ...props
}: CircularSliderProps) {
  const [value, setValue] = React.useState(defaultValue)
  const [angle, setAngle] = React.useState(valueToAngle(defaultValue))
  const sliderRef = React.useRef<SVGSVGElement>(null)
  const isDraggingRef = React.useRef(false)

  const center = size / 2
  const radius = size * 0.35
  const handleSize = size * 0.12

  function valueToAngle(val: number): number {
    return ((val - min) / (max - min)) * 300 + 30
  }

  function angleToValue(ang: number): number {
    ang = Math.max(30, Math.min(330, ang))
    let val = ((ang - 30) / 300) * (max - min) + min
    if (step) {
      val = Math.round(val / step) * step
    }
    return Number.parseFloat(val.toFixed(1))
  }

  const getHandlePosition = (angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(angleInRadians),
      y: center + radius * Math.sin(angleInRadians),
    }
  }

  const handlePosition = getHandlePosition(angle)

  const updateAngleFromPoint = (clientX: number, clientY: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left - center
    const y = clientY - rect.top - center

    let newAngle = Math.atan2(y, x) * (180 / Math.PI) + 90
    if (newAngle < 0) newAngle += 360

    if (newAngle > 330 && newAngle < 360) newAngle = 330
    if (newAngle >= 0 && newAngle < 30) newAngle = 30

    setAngle(newAngle)
    const newValue = angleToValue(newAngle)
    setValue(newValue)

    if (onChange) {
      onChange(newValue)
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    updateAngleFromPoint(e.clientX, e.clientY)
    document.addEventListener("pointermove", handlePointerMove)
    document.addEventListener("pointerup", handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault()
      updateAngleFromPoint(e.clientX, e.clientY)
    }
  }

  const handlePointerUp = (e: PointerEvent) => {
    e.preventDefault()
    isDraggingRef.current = false
    document.removeEventListener("pointermove", handlePointerMove)
    document.removeEventListener("pointerup", handlePointerUp)
  }

  React.useEffect(() => {
    return () => {
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", handlePointerUp)
    }
  }, [])

  const ticks = React.useMemo(() => {
    const result = []
    const totalTicks = (max - min) / step
    const tickStep = 300 / totalTicks

    for (let i = 0; i <= totalTicks; i++) {
      const tickAngle = 30 + i * tickStep
      const isLarge = i % 2 === 0
      const tickRadius = radius + (isLarge ? 8 : 4)
      const x1 = center + radius * Math.cos((tickAngle - 90) * (Math.PI / 180))
      const y1 = center + radius * Math.sin((tickAngle - 90) * (Math.PI / 180))
      const x2 = center + tickRadius * Math.cos((tickAngle - 90) * (Math.PI / 180))
      const y2 = center + tickRadius * Math.sin((tickAngle - 90) * (Math.PI / 180))

      result.push({ x1, y1, x2, y2, isLarge })
    }

    return result
  }, [center, radius, min, max, step])

  return (
    <div className={cn("relative", className)} {...props}>
      <svg
        ref={sliderRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="touch-none select-none"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="1 6"
        />
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.isLarge ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)"}
            strokeWidth={tick.isLarge ? 2 : 1}
          />
        ))}
        <path
          d={`M ${getHandlePosition(30).x} ${getHandlePosition(30).y} A ${radius} ${radius} 0 ${angle - 30 > 180 ? 1 : 0} 1 ${handlePosition.x} ${handlePosition.y}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle
          cx={handlePosition.x}
          cy={handlePosition.y}
          r={handleSize / 2}
          fill="rgba(255, 255, 255, 0.9)"
          filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))"
          cursor="grab"
          onPointerDown={handlePointerDown}
        />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center" style={{ width: size * 0.5, height: size * 0.5 }}>
        <div className="flex items-center gap-1 mb-1">
          <Thermometer className="w-4 h-4 text-white/70" />
          <span className="text-xs font-medium text-white/70">TEMP</span>
        </div>
        <div className="text-3xl font-bold text-white">{value}°</div>
        <div className="text-xs text-white/50 mt-1">
          {value < 18 ? "Cool" : value < 22 ? "Comfort" : "Warm"}
        </div>
      </div>
    </div>
  )
}
