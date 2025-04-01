"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Option {
  value: string
  label: string
}

interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: Option[]
  selectedValues?: string[]
  onChange?: (selectedValues: string[]) => void
  placeholder?: string
  disabled?: boolean
  maxHeight?: number
}

export function MultiSelect({
  options,
  selectedValues = [],
  onChange,
  placeholder = "Select options",
  disabled = false,
  maxHeight = 250,
  className,
  ...props
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>(selectedValues)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Sync selected values with prop
  React.useEffect(() => {
    setSelected(selectedValues)
  }, [selectedValues])

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleOptionClick = (value: string) => {
    let newSelected: string[]

    if (selected.includes(value)) {
      newSelected = selected.filter((item) => item !== value)
    } else {
      newSelected = [...selected, value]
    }

    setSelected(newSelected)

    if (onChange) {
      onChange(newSelected)
    }
  }

  const handleRemoveItem = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelected = selected.filter((item) => item !== value)
    setSelected(newSelected)

    if (onChange) {
      onChange(newSelected)
    }
  }

  const getSelectedLabels = () => {
    return selected.map((value) => {
      const option = options.find((opt) => opt.value === value)
      return option ? option.label : value
    })
  }

  const selectedLabels = getSelectedLabels()

  return (
    <div ref={containerRef} className={cn("relative", className)} {...props}>
      {/* Select Input */}
      <div
        onClick={handleToggle}
        className={cn(
          "flex min-h-[50px] w-full items-center rounded-xl px-3 py-2 cursor-pointer",
          "bg-gradient-to-r from-gray-100/90 to-gray-100/70",
          "border border-gray-200/80 shadow-sm",
          "transition-all duration-200",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300/80",
          isOpen && "border-gray-300/80 ring-2 ring-gray-200/50",
        )}
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 rounded-full bg-gray-800/10 px-2 py-1 text-xs"
              >
                <span className="max-w-[150px] truncate">{label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveItem(options.find((opt) => opt.label === label)?.value || "", e)}
                  className="rounded-full p-0.5 hover:bg-gray-800/10 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <div className="ml-auto pl-3">
          <ChevronDown
            className={cn("h-4 w-4 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 w-full rounded-xl border border-gray-200/80 bg-white shadow-lg"
            style={{
              maxHeight: maxHeight,
              overflowY: "auto",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="p-1">
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm",
                      "transition-colors duration-150",
                      isSelected ? "bg-gray-100" : "hover:bg-gray-50",
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-500"
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

