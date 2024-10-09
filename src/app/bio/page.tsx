'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Bio() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Me
      </motion.h1>
      <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div
              className="w-48 h-48 rounded-full overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src="/profile.gif"
                alt="Profile GIF"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex-1">
              <motion.h2
                className="text-3xl font-semibold mb-4 tracking-wider"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, rotate: -2 }} // Add hover effect
              >
                <span className="glow">Keiran</span>
              </motion.h2>
              <motion.p
                className="text-lg text-muted-foreground mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Some technologies I have experience in using:
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {["Python", "React", "Next.js", "Tailwind CSS", "Docker", "Git"].map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }} // Stagger the badges
                  >
                    <Badge className="bg-primary text-primary-foreground">{tech}</Badge>
                  </motion.div>
                ))}
              </motion.div>
              <motion.p
                className="text-sm text-muted-foreground italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                There would be a bio here but I am far too lazy to write it right now.
              </motion.p>
            </div>
          </div>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-primary">Recent Projects</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <motion.li
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                AnonHost - A secure and anonymous file hosting platform (you are on it right now!)
              </motion.li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>

      <style jsx>{`
        .glow {
          position: relative;
          color: white;
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.5), 
            0 0 20px rgba(255, 255, 255, 0.4), 
            0 0 30px rgba(255, 255, 255, 0.3);
          transition: text-shadow 0.3s ease;
        }

        .glow:hover {
          text-shadow: 
            0 0 15px rgba(255, 255, 255, 1), 
            0 0 25px rgba(255, 255, 255, 0.8), 
            0 0 35px rgba(255, 255, 255, 0.6);
        }

      `}</style>
    </div>
  )
}
