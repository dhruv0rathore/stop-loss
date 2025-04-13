
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Bell, ChevronDown, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navItems = [{
  title: 'Trade',
  href: '/',
  active: true
}, {
  title: 'Vaults',
  href: '/vaults'
}, {
  title: 'Portfolio',
  href: '/portfolio'
}, {
  title: 'Referrals',
  href: '/referrals'
}, {
  title: 'Points',
  href: '/points'
}, {
  title: 'Leaderboard',
  href: '/leaderboard'
}];

export default function TradingNav() {
  return <header className="sticky top-0 z-50 w-full border-b border-trading-border-light bg-trading-bg-dark py-2">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">ElliotRodgers
          </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <Link 
                key={item.title} 
                to={item.href} 
                className={`text-sm font-medium transition-colors hover:text-primary ${item.active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {item.title}
              </Link>
            ))}
            <div className="relative group">
              
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-primary hover:bg-primary/80 text-white">
            Deposit
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">0x110a...c633</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-5 w-5 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>;
}
