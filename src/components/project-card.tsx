'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  tech: string[];
  link: string;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="border-b last:border-0 pb-6 last:pb-0"
    >
      <h3 className="text-xl font-semibold mb-2">
        <a
          href={project.link}
          className="hover:text-primary transition-colors inline-flex items-center gap-2 group"
          target="_blank"
          rel="noopener noreferrer"
        >
          {project.name}
          <BookOpen className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </a>
      </h3>
      <p className="text-muted-foreground mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <Badge
            key={tech}
            variant="secondary"
            className="text-xs bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            {tech}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}
