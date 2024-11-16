'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Globe, Mail, Coffee, Heart } from 'lucide-react';
import DiscordPresence from '@/components/discord-presence';
import { ProjectCard } from '@/components/project-card';
import { SocialLinks } from '@/components/social-links';

export default function AboutPage() {
  const tabsRef = useRef(null);
  const isTabsInView = useInView(tabsRef, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState('about');

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  const projects = [
    {
      name: 'AnonHost',
      description:
        'AnonHost aims to provide a free, private and user-first solution for uploading files, sharing code and shortening URLs',
      tech: [
        'React',
        'TypeScript',
        'Node.js',
        'TailwindCSS',
        'PostgreSQL',
        'Git',
        'Pnpm',
        'PM2',
        'Prisma',
      ],
      link: '/',
    },
    {
      name: 'uwurs',
      description:
        'uwurs is a rust library I worked on to learn the Rust programming language. It is fairly simple and just functions as a text formatting tool.',
      tech: ['Git', 'Rust'],
      link: 'https://github.com/KeiranScript/uwurs',
    },
    {
      name: 'Archium',
      description:
        'A fork of the Archie project aiming to improve the UX for Arch Linux users by acting as a wrapper for the two most popular pacman wrappers, Paru and YAY.',
      tech: ['C', 'Paru', 'YAY', 'Arch Linux', 'Make', 'Git'],
      link: 'https://github.com/KeiranScript/archium',
    },
  ];

  return (
    <motion.div
      className="container mx-auto px-4 py-16 max-w-5xl"
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-16" variants={itemVariants}>
        <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          <TextGenerateEffect
            words="Keiran"
            className="dark:text-white text-black"
            duration={1}
          />
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I hate frontend.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col items-center mb-16 space-y-8"
        variants={itemVariants}
      >
        <div className="relative group">
          <Avatar className="w-40 h-40 border-4 border-primary/20 ring-4 ring-primary/10 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:scale-105">
            <AvatarImage src="/gura.gif" />
          </Avatar>
          <motion.div
            className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-30 blur transition-all duration-500"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
        <SocialLinks />
      </motion.div>

      <motion.div
        ref={tabsRef}
        style={{
          transform: isTabsInView ? 'none' : 'translateY(50px)',
          opacity: isTabsInView ? 1 : 0,
          transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
        }}
      >
        <Tabs
          defaultValue="about"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="about"
              className="text-lg transition-all duration-200 data-[state=active]:bg-primary/20"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="text-lg transition-all duration-200 data-[state=active]:bg-primary/20"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="text-lg transition-all duration-200 data-[state=active]:bg-primary/20"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-6">
            <AnimatePresence mode="wait">
              <TabsContent value="about" key="about">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">Background</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Totam dolor harum magni hic exercitationem suscipit, non
                      cupiditate? Autem, fuga repudiandae aliquid beatae,
                      tempora blanditiis ipsa quaerat ratione maxime quidem
                      nihil!
                    </p>
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4 text-muted-foreground">
                        Discord Presence
                      </h3>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary opacity-30 blur-lg rounded-lg" />
                        <div className="relative">
                          <DiscordPresence userId="1230319937155760131" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="projects" key="projects">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <div className="space-y-8">
                      {projects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="contact" key="contact">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-center gap-2 mb-6">
                      <Mail className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">Get in Touch</h2>
                    </div>
                    <div className="space-y-4">
                      <Button className="w-full sm:w-auto group">
                        <Mail className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                        Contact Me
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto group"
                      >
                        <Coffee className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                        Buy me a coffee
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isTabsInView ? 1 : 0,
            y: isTabsInView ? 0 : 20,
          }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" />{' '}
            using Next.js and Tailwind
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
