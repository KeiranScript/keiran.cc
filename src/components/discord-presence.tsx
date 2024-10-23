import { useState, useEffect } from 'react';
import { Loader2, Music, UserPlus, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DiscordPresence({ userId }: { userId: string }) {
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

  const [presence, setPresence] = useState<LanyardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresenceData = async () => {
      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${userId}`,
        );
        const data = await response.json();
        setPresence(data.data);
      } catch (error) {
        console.error('Error fetching Discord presence:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresenceData();
    const intervalId = setInterval(fetchPresenceData, 60000);

    return () => clearInterval(intervalId);
  }, [userId]);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  }

  if (!presence) {
    return (
      <p className="text-sm text-muted-foreground">
        Discord presence unavailable
      </p>
    );
  }

  const hasActivity = presence.activities.some(
    (activity: { type: number }) => activity.type === 0,
  );
  if (!hasActivity) {
    return null;
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
        <ScrollArea className="max-h-96">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={`https://cdn.discordapp.com/avatars/${presence.discord_user.id}/${presence.discord_user.avatar}.png`}
                    alt={presence.discord_user.username}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${getStatusColor(presence.discord_status)} border-2 border-background`}
                ></span>
              </div>
              <div>
                <p className="font-medium text-lg">
                  {presence.discord_user.username}
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-pink-500 text-primary-foreground hover:bg-pink-600 transition-colors duration-200"
            >
              <a
                href={`https://discord.com/users/${presence.discord_user.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Me
              </a>
            </Button>
          </div>

          {presence.listening_to_spotify && presence.spotify && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-4"
            >
              <div className="flex items-center mb-2">
                <Music className="h-5 w-5 mr-2 text-green-400" />
                <span className="font-medium text-green-400">
                  Listening to Spotify
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={presence.spotify.album_art_url}
                    alt={presence.spotify.album}
                    width={60}
                    height={60}
                    className="rounded-md shadow-lg"
                  />
                </Avatar>
                <div>
                  <p className="font-medium">{presence.spotify.song}</p>
                  <p className="text-sm text-muted-foreground">
                    {presence.spotify.artist}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {presence.spotify.album}
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {formatTime(presence.spotify.timestamps.start)} -{' '}
                  {formatTime(presence.spotify.timestamps.end)}
                </span>
              </div>
            </motion.div>
          )}

          {presence.activities
            .filter((activity) => activity.type !== 2)
            .map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-primary/10 p-4 rounded-lg mb-2 last:mb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">
                    {activity.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-pink-500/20 text-pink-400"
                  >
                    {getElapsedTime(activity.timestamps?.start || 0)} elapsed
                  </Badge>
                </div>
                {activity.details && (
                  <p className="text-sm text-foreground">{activity.details}</p>
                )}
                {activity.state && (
                  <p className="text-sm text-muted-foreground">
                    {activity.state}
                  </p>
                )}
                {activity.assets?.large_image && (
                  <div className="mt-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                        alt={activity.assets.large_text || activity.name}
                        width={40}
                        height={40}
                        className="rounded-md shadow-lg"
                      />
                    </Avatar>
                  </div>
                )}
              </motion.div>
            ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
