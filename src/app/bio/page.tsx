"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Tilt } from 'react-tilt';
import confetti from 'canvas-confetti';
import DiscordPresence from '@/components/discord-presence'

function BioContent() {
  const searchParams = useSearchParams();
  const isGuraProfilePic = searchParams.get('linqfy-stop-asking-for-the-gura-pfp') !== null;
  const profilePic = isGuraProfilePic ? '/gura.gif' : '/profile.gif';

  const bioName = process.env.NEXT_PUBLIC_BIO_NAME || "Skid";
  const bioTechsDesc = process.env.NEXT_PUBLIC_BIO_TECHS_DESCRIPTION || "Some technologies I use to skid";
  const bioTechs = process.env.NEXT_PUBLIC_BIO_TECHS
    ? process.env.NEXT_PUBLIC_BIO_TECHS.split(',')
    : ["Skidding"];
  const bioDescription = process.env.NEXT_PUBLIC_BIO_DESCRIPTION || "brb skidding";
  const discordUserId = process.env.NEXT_PUBLIC_DISCORD_USER_ID || "1230319937155760131";

  const techs = isGuraProfilePic
    ? [...bioTechs, "Linqfy's mom"]
    : bioTechs;

  const [loadingProgress, setLoadingProgress] = useState(0);

  const tiltOptions = {
    reverse:        false,
    max:            25,
    scale:          1,
    speed:          1000,
    transition:     true,
    axis:           null,
    reset:          true,
    easing:         "cubic-bezier(.03,.98,.52,.99)",
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleSparkle = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="min-h-screen h-full w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tilt className="max-w-3xl mx-auto" options={tiltOptions}>
          <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardContent className="p-8 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-none">
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-pink-500/20 animate-pulse rounded-full"></div>
                  <Image
                    src={profilePic}
                    alt="Profile GIF"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover rounded-full relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 rounded-full animate-spin-slow"></div>
                </div>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-4xl font-bold mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500"
                >
                  {bioName}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-sm italic text-center text-muted-foreground"
                >
                  {bioDescription}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg text-center text-muted-foreground mb-4"
                >
                  {bioTechsDesc}
                </motion.p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6 justify-center overflow-auto">
                <AnimatePresence>
                  {techs.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <Badge 
                        className="bg-primary text-sm rounded-full px-2 py-1 transition-all duration-300 hover:shadow-lg hover:scale-105"
                        onClick={handleSparkle}
                      >
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                onAnimationComplete={handleSparkle}
              >
                <DiscordPresence userId={discordUserId} />
              </motion.div>
            </CardContent>
          </Card>
        </Tilt>
      </motion.div>
    </div>
  );
}

function Bio() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-screen">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity,
            }}
            className="mb-4"
          >
            <Upload className="h-12 w-12 text-pink-500" />
          </motion.div>
          <Progress value={0} className="w-64 mb-2" />
          <p className="text-sm text-muted-foreground">Loading bio...</p>
        </div>
      }>
        <BioContent />
      </Suspense>
    </div>
  );
}

export default Bio;