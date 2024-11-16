'use client';

import { useState, useEffect } from 'react';
import { Loader2, Music, UserPlus, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  emoji?: {
    id: string;
    name: string;
    animated: boolean;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
  };
  application_id?: string;
  created_at?: number;
}

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    global_name?: string;
    display_name?: string;
  };
  discord_status: string;
  activities: Activity[];
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
  active_on_discord_web?: boolean;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
}

export default function DiscordPresence({ userId }: { userId: string }) {
  const [presence, setPresence] = useState<LanyardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresenceData = async () => {
      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${userId}`,
        );
        const data = await response.json();
        if (data.success) {
          setPresence(data.data);
        }
      } catch (error) {
        console.error('Error fetching Discord presence:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresenceData();
    const intervalId = setInterval(fetchPresenceData, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!presence) {
    return (
      <p className="text-sm text-muted-foreground text-center p-4">
        Discord presence unavailable
      </p>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'dnd':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'dnd':
        return 'Do Not Disturb';
      default:
        return 'Offline';
    }
  };

  const getDeviceIcon = () => {
    if (presence.active_on_discord_web) return '🌐';
    if (presence.active_on_discord_desktop) return '💻';
    if (presence.active_on_discord_mobile) return '📱';
    return null;
  };

  const customStatus = presence.activities.find(
    (activity) => activity.type === 4
  );

  return (
    <Card className="overflow-hidden bg-primary/5 transition-all duration-300 hover:shadow-lg border-pink-500/20">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`https://cdn.discordapp.com/avatars/${presence.discord_user.id}/${presence.discord_user.avatar}.png`}
                  alt={presence.discord_user.username}
                />
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(
                  presence.discord_status
                )} border-2 border-background`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-lg">
                  {presence.discord_user.display_name || presence.discord_user.global_name || presence.discord_user.username}
                </p>
                {getDeviceIcon() && (
                  <span className="text-sm">{getDeviceIcon()}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getStatusText(presence.discord_status)}
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
          >
            <a
              href={`https://discord.com/users/${presence.discord_user.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Friend
            </a>
          </Button>
        </div>

        {customStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 rounded-lg p-3 mb-2"
          >
            <div className="flex items-center gap-2">
              {customStatus.emoji && (
                <img
                  src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${
                    customStatus.emoji.animated ? 'gif' : 'png'
                  }`}
                  alt={customStatus.emoji.name}
                  className="w-5 h-5"
                />
              )}
              <p className="text-sm">{customStatus.state}</p>
            </div>
          </motion.div>
        )}

        {presence.listening_to_spotify && presence.spotify && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1DB954] bg-opacity-20 p-4 rounded-lg"
          >
            <div className="flex items-center mb-2">
              <Music className="h-5 w-5 mr-2 text-[#1DB954]" />
              <span className="font-medium text-[#1DB954]">
                Listening to Spotify
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={presence.spotify.album_art_url}
                alt={presence.spotify.album}
                className="w-12 h-12 rounded-md shadow-lg"
              />
              <div>
                <p className="font-medium">{presence.spotify.song}</p>
                <p className="text-sm text-muted-foreground">
                  {presence.spotify.artist}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {presence.activities
          .filter((activity) => activity.type !== 4 && activity.type !== 2)
          .map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary/10 p-4 rounded-lg mt-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{activity.name}</span>
                {activity.timestamps?.start && (
                  <Badge variant="secondary" className="bg-primary/20">
                    {formatElapsedTime(activity.timestamps.start)}
                  </Badge>
                )}
              </div>
              {activity.details && (
                <p className="text-sm">{activity.details}</p>
              )}
              {activity.state && (
                <p className="text-sm text-muted-foreground">
                  {activity.state}
                </p>
              )}
            </motion.div>
          ))}
      </CardContent>
    </Card>
  );
}

function formatElapsedTime(start: number): string {
  const now = Date.now();
  const elapsed = now - start;
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}
