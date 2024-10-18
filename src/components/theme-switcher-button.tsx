import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute top-4 right-4"
      onClick={ () => setTheme(theme === 'dark' ? 'light' : 'dark') }
    >
      <Sparkles className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sparkles className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeSwitcher;