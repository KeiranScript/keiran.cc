'use client';

import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/KeiranScript',
    label: 'GitHub',
    color: 'hover:text-[#2ea043]',
  },
  {
    icon: Mail,
    href: 'mailto:keiranscript@gmail.com',
    label: 'Email',
    color: 'hover:text-[#ea4335]',
  },
];

export function SocialLinks() {
  return (
    <div className="flex gap-6">
      {socialLinks.map(({ icon: Icon, href, label, color }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-muted-foreground ${color} transition-all duration-300`}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon className="w-6 h-6" />
        </motion.a>
      ))}
    </div>
  );
}
