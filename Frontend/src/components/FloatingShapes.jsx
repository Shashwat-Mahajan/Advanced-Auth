import { motion } from 'framer-motion'
import React from 'react'


const FloatingShapes = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`${color} ${size} absolute rounded-full opacity-60 blur-xl`}
      style={{ top, left }}
      initial={{ y: -100 }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}

      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
        delay,
      }}

      aria-hidden='true'
    />
  )
}

export default FloatingShapes
