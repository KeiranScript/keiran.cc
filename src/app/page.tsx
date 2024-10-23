'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation, useDragControls } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Upload, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

export default function LandingPage() {
  const controls = useAnimation();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    controls.start('visible');

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [controls]);

  const dragControls = useDragControls();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
      transition: { duration: 0.3 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      rotate: 360,
      transition: { duration: 0.6 },
    },
  };

  const titleVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,

        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="relative z-0 overflow-hidden">
      <div className="min-h-screen overflow-hidden relative">
        <motion.div
          className="container mx-auto px-4 py-16 md:py-24 relative z-10 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            variants={itemVariants}
            animate="animate"
          >
            <motion.span variants={titleVariants}>Welcome to </motion.span>
            <motion.span variants={titleVariants} className="text-primary">
              AnonHost
            </motion.span>
          </motion.h1>
          <motion.div
            className="text-xl md:text-2xl text-center text-muted-foreground mb-12 overflow-hidden"
            variants={itemVariants}
          >
            <TextGenerateEffect
              className="text-xl md:text-2xl text-center text-muted-foreground mb-12"
              words="Upload and share files anonymously. For free, forever."
              duration={1}
            />
          </motion.div>
          <motion.div
            className="flex justify-center mb-16 overflow-hidden"
            variants={itemVariants}
          >
            <Link href="/upload">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Button
                  size="lg"
                  className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Uploading <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              {
                icon: Upload,
                title: 'Easy Uploads',
                description:
                  'Drag and drop or click to upload files up to 1GB.',
              },
              {
                icon: Shield,
                title: 'Anonymous Sharing',
                description:
                  'No account required. Your privacy is our priority.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description:
                  'Optimized for speed, your files are ready in seconds.',
              },
            ].map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  className="rounded-lg p-6 shadow-lg border border-primary/10 backdrop-blur-sm hover:shadow-xl"
                  variants={itemVariants}
                  whileHover={cardVariants.hover}
                  dragControls={dragControls}
                  dragMomentum={true}
                  dragElastic={1}
                  dragTransition={{ bounceStiffness: 100, bounceDamping: 0 }}
                  onDragStart={() => controls.start({ scale: 1.05 })}
                  onDragEnd={() => controls.start({ scale: 1 })}
                >
                  <motion.div variants={iconVariants}>
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Proudly open source on{' '}
            <a href="https://github.com/KeiranScript/keiran.cc" target="_blank">
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
