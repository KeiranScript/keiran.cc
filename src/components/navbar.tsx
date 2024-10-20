'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Upload, Link as LinkIcon, BarChart2, Menu, Cat, Code } from 'lucide-react'
import ThemeSwitcher from '@/components/theme-switcher'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const branding = process.env.NEXT_PUBLIC_BRANDING || 'keiran.cc'

const navItems = [
  { href: '/upload', icon: Upload, label: 'Upload' },
  { href: '/shorten', icon: LinkIcon, label: 'Shorten' },
  { href: '/pastes', icon: Code, label: 'Pastes' },
  { href: '/stats', icon: BarChart2, label: 'Stats' },
  { href: '/gallery', icon: Cat, label: 'Zoe' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "default" : "ghost"}
          asChild
          onClick={() => setIsOpen(false)}
        >
          <Link href={item.href} className="flex items-center">
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </>
  )

  return (
    <motion.nav
      className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm transition-shadow ${
        scrolled ? 'shadow-md' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-2xl hover:text-primary transition-colors">
          {branding}
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <NavItems />
          <ThemeSwitcher />
        </div>
        <div className="md:hidden flex items-center">
          <ThemeSwitcher />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-4">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  )
}