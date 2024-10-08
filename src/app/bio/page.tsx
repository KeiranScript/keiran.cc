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
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Me
      </motion.h1>
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div
              className="w-48 h-48 rounded-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
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
                className="text-2xl font-semibold mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Keiran
              </motion.h2>
              <motion.p
                className="text-muted-foreground mb-4"
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
                <Badge className="bg-primary text-primary-foreground">Python</Badge>
                <Badge className="bg-primary text-primary-foreground">React</Badge>
                <Badge className="bg-primary text-primary-foreground">Next.js</Badge>
                <Badge className="bg-primary text-primary-foreground">Tailwind CSS</Badge>
                <Badge className="bg-primary text-primary-foreground">Docker</Badge>
                <Badge className="bg-primary text-primary-foreground">Git</Badge>
              </motion.div>
              <motion.p
                className="text-sm text-muted-foreground"
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
            <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>AnonHost - A secure and anonymous file hosting platform (you are on it right now!)</li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
