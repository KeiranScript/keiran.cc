"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Music, Clock, UserPlus, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Tilt } from 'react-tilt';
import confetti from 'canvas-confetti';

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
  };
  discord_status: string;
  activities: Array<{
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: {
      start?: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
    };
    application_id?: string;
  }>;
  listening_to_spotify: boolean;
  spotify: {
    timestamps: {
      start: number;
      end: number;
    };
    album: string;
    album_art_url: string;
    artist: string;
    song: string;
  } | null;
}

function DiscordPresence({ userId }: { userId: string }) {
  const [presenceData, setPresenceData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await response.json();
        setPresenceData(data.data);
      } catch (error) {
        console.error('Error fetching Discord presence:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 60000);

    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  }

  if (!presenceData) {
    return <p className="text-sm text-muted-foreground">Discord presence unavailable</p>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getElapsedTime = (start: number) => {
    const now = Date.now();
    const elapsed = now - start;
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  };

  return (
    <Card className="mt-6 overflow-hidden bg-primary/5 transition-all duration-300 hover:shadow-lg border-pink-500/20 border-2">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="relative">
              <Image
                src={`https://cdn.discordapp.com/avatars/${presenceData.discord_user.id}/${presenceData.discord_user.avatar}.png`}
                alt={presenceData.discord_user.username}
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${getStatusColor(presenceData.discord_status)} border-2 border-background`}></span>
            </div>
            <div>
              <p className="font-medium text-lg">{presenceData.discord_user.username}</p>
            </div>
          </div>
          <Button
            asChild
            className="bg-pink-500 text-primary-foreground hover:bg-pink-600 transition-colors duration-200"
          >
            <a
              href={`https://discord.com/users/${presenceData.discord_user.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Me
            </a>
          </Button>
        </div>

        {presenceData.listening_to_spotify && presenceData.spotify && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-4"
          >
            <div className="flex items-center mb-2">
              <Music className="h-5 w-5 mr-2 text-green-400" />
              <span className="font-medium text-green-400">Listening to Spotify</span>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src={presenceData.spotify.album_art_url}
                alt={presenceData.spotify.album}
                width={60}
                height={60}
                className="rounded-md shadow-lg"
              />
              <div>
                <p className="font-medium">{presenceData.spotify.song}</p>
                <p className="text-sm text-muted-foreground">{presenceData.spotify.artist}</p>
                <p className="text-xs text-muted-foreground">{presenceData.spotify.album}</p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTime(presenceData.spotify.timestamps.start)} - {formatTime(presenceData.spotify.timestamps.end)}</span>
            </div>
          </motion.div>
        )}

        {presenceData.activities.filter(activity => activity.type !== 2).map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-primary/10 p-4 rounded-lg mb-2 last:mb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{activity.name}</span>
              <Badge variant="secondary" className="bg-pink-500/20 text-pink-400">
                {getElapsedTime(activity.timestamps?.start || 0)} elapsed
              </Badge>
            </div>
            {activity.details && <p className="text-sm text-foreground">{activity.details}</p>}
            {activity.state && <p className="text-sm text-muted-foreground">{activity.state}</p>}
            {activity.assets?.large_image && (
              <div className="mt-2">
                <Image
                  src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                  alt={activity.assets.large_text || activity.name}
                  width={40}
                  height={40}
                  className="rounded-md shadow-lg"
                />
              </div>
            )}
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

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
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tilt className="max-w-5xl mx-auto" options={tiltOptions}>
          <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center mb-8">
                <motion.div
                  className="relative w-48 h-48 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  onAnimationComplete={handleSparkle}
                >
                  <div className="absolute inset-0 bg-pink-500/20 animate-pulse rounded-full"></div>
                  <Image
                    src={profilePic}
                    alt="Profile GIF"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover rounded-full relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 rounded-full animate-spin-slow"></div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-4xl font-bold mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500"
                >
                  {bioName}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-sm italic text-center text-muted-foreground"
                >
                  {bioDescription}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg text-center text-muted-foreground mb-4"
                >
                  {bioTechsDesc}
                </motion.p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
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
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-primary-foreground transition-all duration-300 hover:shadow-lg hover:scale-105"
                        onClick={handleSparkle}
                      >
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
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