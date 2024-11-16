'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const StatsContent = ({ stats }: { stats: any }) => {
  const progressValue = (stats.usedStorage / stats.totalStorage) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Storage Stats
      </motion.h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Total Files', value: stats.totalFiles },
          { title: 'Used Storage', value: formatBytes(stats.usedStorage) },
          { title: 'Available Storage', value: formatBytes(stats.availableStorage) },
        ].map(({ title, value }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card className="shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressValue} className="w-full" />
            <p className="mt-2 text-sm text-muted-foreground">
              {formatBytes(stats.usedStorage)} of {formatBytes(stats.totalStorage)} used
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch((error) => console.error('Failed to fetch stats:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden flex justify-center items-center h-[calc(100vh-1rem)]">
        <Loader2 className="h-32 w-32 animate-spin text-primary" />
      </div>
    );
  }

  return stats ? <StatsContent stats={stats} /> : <div>Failed to load stats</div>;
};

const getStats = async () => {
  try {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalFiles: 0,
      usedStorage: 0,
      availableStorage: 0,
      totalStorage: 0,
    };
  }
};

export default Stats;
