"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Music, Clock, UserPlus, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <Card className="mt-6 overflow-hidden">
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
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
              <Badge variant="secondary" className="bg-primary/20 text-primary">
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

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "skidderhost";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-background to-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-48 h-48 rounded-full overflow-hidden shadow-lg relative"
              >
                <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full"></div>
                <Image
                  src={profilePic}
                  alt="Profile GIF"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover rounded-full relative z-10"
                />
              </motion.div>
              <div className="flex-1">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-3xl font-semibold mb-4 tracking-wider text-primary glow"
                >
                  <span className="glow">{bioName}</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg text-muted-foreground mb-4"
                >
                  {bioTechsDesc}
                </motion.p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {techs.map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <Badge className="bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/80 hover:shadow-lg hover:scale-105">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-sm text-muted-foreground italic"
                >
                  <span className="text-sm font-light leading-relaxed tracking-wide">{bioDescription}</span>
                </motion.p>
              </div>
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
      </motion.div>
    </div>
  );
}

export default function Bio() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
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
        >
          <Upload className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    }>
      <BioContent />
    </Suspense>
  );
}