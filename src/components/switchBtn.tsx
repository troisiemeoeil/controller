import { motion } from "framer-motion"
import { Power, PowerOff } from "lucide-react"
import { useState } from "react"

export function SwitchBtn() {
    const [isStarted, setIsStarted] = useState(false)
    const toggleStartClose = () => {
        setIsStarted((prev) => !prev)
    }

    return (
        <motion.button
                onClick={toggleStartClose}
                className=" w-17 h-17 rounded-full flex items-center justify-center focus:outline-none"
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
                    {isStarted ? <PowerOff className="w-6 h-6 text-white" /> : <Power className="w-6 h-6 text-white" />}
                </motion.div>
            </motion.button>
    )
}

