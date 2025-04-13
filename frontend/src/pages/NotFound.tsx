
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TradingNav from '@/components/TradingNav';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-trading-bg-dark text-foreground">
      <TradingNav />
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page not found</p>
        <Link 
          to="/" 
          className="flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trading
        </Link>
      </div>
    </div>
  );
}
