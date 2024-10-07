import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Upload, User, BarChart2 } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="font-bold text-2xl mr-6">AnonHost</Link>
        <div className="flex space-x-4 flex-1">
          <Button variant="ghost" asChild>
            <Link href="/"><Upload className="mr-2 h-4 w-4" /> Upload</Link>
          </Button>
          {/* <Button variant="ghost" asChild> */}
          {/*   <Link href="/bio"><User className="mr-2 h-4 w-4" /> Bio</Link> */}
          {/* </Button> */}
          <Button variant="ghost" asChild>
            <Link href="/stats"><BarChart2 className="mr-2 h-4 w-4" /> Stats</Link>
          </Button>
        </div>
        <ThemeSwitcher />
      </div>
    </nav>
  )
}

