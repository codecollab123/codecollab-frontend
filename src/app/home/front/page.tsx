"use client";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add smooth scroll handler with offset
  const handleSmoothScroll = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Adjust this value based on your navbar height
      const position = element.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: position,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  }, []);

  const features = [
    // ... existing features array
    { 
      title: "Real-Time Collaboration",
      desc: "Collaborate with team members instantly",
      icon: "👥"
    },
    {
      title: "Multiple Language Support",
      desc: "Supports 20+ programming languages",
      icon: "🌐"
    },
    {
      title: "Live-Chat",
      desc: "Integrated chat system for seamless communication",
      icon: "💬"
    },
    {
      title: "White-Board",
      desc: "Visualize ideas with shared digital whiteboard",
      icon: "🖍️"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
    {/* Navbar */}
    <nav className="fixed top-0 w-full bg-[#1e293b] border-b border-[#334155] z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#7adac0]">
           CODE COLLAB
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <button
                  onClick={() => handleSmoothScroll("home")}
                  className="text-gray-300 hover:text-[#7adac0] transition-colors"
                >
                  Home
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={() => handleSmoothScroll("features")}
                  className="text-gray-300 hover:text-[#7adac0] transition-colors"
                >
                  Features
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={() => handleSmoothScroll("about")}
                  className="text-gray-300 hover:text-[#7adac0] transition-colors"
                >
                  About
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-[#7adac0] transition-colors"
                >
                  Login
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger className="md:hidden text-gray-300">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#1e293b] border-l border-[#334155]">
              <div className="flex flex-col space-y-6 pt-8">
                <button
                  onClick={() => handleSmoothScroll("home")}
                  className="text-gray-300 hover:text-[#7adac0] transition-colors text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => handleSmoothScroll("features")}
                  className="text-gray-300 hover:text-[#7adac0] transition-colors text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => handleSmoothScroll("about")}
                  className="text-gray-300 hover:text-[#7adac0] transition-colors text-left"
                >
                  About
                </button>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-[#7adac0] transition-colors text-left"
                >
                  Login
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

       {/* Hero Section */}
     <section id="home" className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6 mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-[#7adac0] leading-tight">
              Collaborative Code Editor
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Experience the future of collaborative coding with real-time editing, live chat, and an interactive whiteboard. Code together, anywhere        </p>
          </div>
          <Button 
            className="bg-[#7adac0] hover:bg-[#68b8a5] text-[#0f172a] px-8 py-6 text-lg rounded-full transition-all"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#1e293b]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#7adac0] mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-8 bg-[#0f172a] rounded-xl hover:transform hover:scale-105 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#7adac0] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#0f172a]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#7adac0] mb-12">About</h2>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xl text-gray-300">
            Transform your coding experience with real-time collaboration features. 
            Our platform supports multiple programming languages and provides integrated tools for seamless team communication.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#1e293b] rounded-lg text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-[#7adac0] mb-2">1000+</h3>
              <p className="text-gray-300">Active Users</p>
            </div>
            <div className="p-6 bg-[#1e293b] rounded-lg text-center">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-[#7adac0] mb-2">50+</h3>
              <p className="text-gray-300">Projects Daily</p>
            </div>
            <div className="p-6 bg-[#1e293b] rounded-lg text-center">
              <div className="text-4xl mb-4">🌎</div>
              <h3 className="text-2xl font-bold text-[#7adac0] mb-2">20+</h3>
              <p className="text-gray-300">Countries</p>
            </div>
          </div>
        </div>
      </section>


{/* Footer section */}
<footer className="bg-[#1e293b] border-t border-[#334155]">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Logo Section */}
      <div className="text-center">
        <h5 className="text-xl font-bold text-[#7adac0] mb-4">LOGO</h5>
      </div>

      {/* Terms Link */}
      <div className="text-center">
        <h5 className="text-lg font-semibold text-[#7adac0] mb-3">
          <a href="/terms" className="hover:underline">Terms</a>
        </h5>
      </div>

      {/* Privacy Link */}
      <div className="text-center">
        <h5 className="text-lg font-semibold text-[#7adac0] mb-3">
          <a href="/privacy" className="hover:underline">Privacy</a>
        </h5>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <h5 className="text-lg font-semibold text-[#7adac0] mb-3">Contact</h5>
        <p className="text-gray-300">xyz@gmail.com</p>
        <div className="mt-4 flex justify-center space-x-4">
          {/* Social Icons */}
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <svg className="w-6 h-6 text-gray-300 hover:text-[#7adac0] cursor-pointer" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zm-.5 4H0v12h4.48V7.5zM8 7.5h4.48V9h.07c.62-1.18 2.13-2.43 4.43-2.43 4.74 0 5.6 3.12 5.6 7.17v7.26h-4.48v-6.42c0-1.52-.03-3.48-2.12-3.48s-2.44 1.66-2.44 3.38v6.52H8V7.5z"/>
            </svg>
          </a>

          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
            <svg className="w-6 h-6 text-gray-300 hover:text-[#7adac0] cursor-pointer" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.317 3.438 9.822 8.207 11.418.6.11.793-.258.793-.577v-2.173c-3.338.727-4.042-1.61-4.042-1.61-.546-1.38-1.334-1.747-1.334-1.747-1.09-.745.083-.73.083-.73 1.206.085 1.842 1.24 1.842 1.24 1.07 1.835 2.807 1.306 3.492.998.11-.775.42-1.306.763-1.607-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.524.116-3.176 0 0 1.008-.323 3.301 1.23a11.53 11.53 0 0 1 3-.405c1.017.005 2.04.138 3 .405 2.29-1.553 3.296-1.23 3.296-1.23.653 1.652.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.48 5.921.432.375.823 1.113.823 2.253v3.34c0 .323.192.693.8.575C20.565 22.12 24 17.615 24 12.297 24 5.67 18.627.297 12 .297z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="mt-8 text-center text-gray-400">
      <p>© 2024 CodeCollab. All rights reserved.</p>
    </div>
  </div>
</footer>

    </div>
  );
}
