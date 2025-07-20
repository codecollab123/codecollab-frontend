"use client";
import {
  Code,
  Users,
  MessageSquare,
  Palette,
  Globe,
  Shield,
  Zap,
  Github,
  Play,
  Menu,
  X,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Rocket,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const features = [
    {
      icon: Users,
      title: "Real-time Collaboration",
      description:
        "Code together with your team in real-time with live cursor tracking and instant synchronization.",
      gradient: "from-blue-500 to-cyan-500",
      delay: "0s",
    },
    {
      icon: MessageSquare,
      title: "Built-in Chat",
      description:
        "Communicate seamlessly without leaving your coding environment with our integrated chat system.",
      gradient: "from-purple-500 to-pink-500",
      delay: "0.1s",
    },
    {
      icon: Palette,
      title: "Interactive Whiteboard",
      description:
        "Brainstorm and visualize ideas with our collaborative whiteboard feature.",
      gradient: "from-green-500 to-emerald-500",
      delay: "0.2s",
    },
    {
      icon: Globe,
      title: "50+ Languages",
      description:
        "Support for all major programming languages with intelligent syntax highlighting.",
      gradient: "from-orange-500 to-red-500",
      delay: "0.3s",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with end-to-end encryption and SOC 2 compliance.",
      gradient: "from-indigo-500 to-purple-500",
      delay: "0.4s",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance with sub-100ms latency for real-time collaboration.",
      gradient: "from-yellow-500 to-orange-500",
      delay: "0.5s",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "1M+", label: "Lines of Code", icon: Code },
    { number: "99.9%", label: "Uptime", icon: Zap },
    { number: "150+", label: "Countries", icon: Globe },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Lead Developer at TechCorp",
      content:
        "Code Collab has revolutionized how our team works together. The real-time collaboration is seamless!",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Mike Rodriguez",
      role: "Senior Engineer at StartupXYZ",
      content:
        "The whiteboard feature is a game-changer for our brainstorming sessions. Highly recommend!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Emily Davis",
      role: "Tech Lead at Innovation Labs",
      content:
        "Best collaborative coding platform I've ever used. The UI is intuitive and performance is outstanding.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Enhanced Navigation with Parallax */}
      <nav
        className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* <Code className="h-8 w-8 text-cyan-400" /> */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CODE COLLAB
              </span>
              {/* <Badge variant="secondary" className="hidden sm:inline-flex bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                v2.0
              </Badge> */}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="hover:text-cyan-400 transition-all duration-300 hover:scale-105 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#features"
                className="hover:text-cyan-400 transition-all duration-300 hover:scale-105 relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#about"
                className="hover:text-cyan-400 transition-all duration-300 hover:scale-105 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="#home">
                  <Button className="bg-gradient-to-r from-cyan-500 to-red-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-cyan-400 transition-colors p-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-800/50">
              <div className="flex flex-col space-y-4 pt-4">
                <a
                  href="#home"
                  className="hover:text-cyan-400 transition-colors"
                  onClick={toggleMenu}
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="hover:text-cyan-400 transition-colors"
                  onClick={toggleMenu}
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="hover:text-cyan-400 transition-colors"
                  onClick={toggleMenu}
                >
                  About
                </a>
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/auth/login" onClick={toggleMenu}>
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:text-cyan-400 hover:bg-slate-800/50"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="#home" onClick={toggleMenu}>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-red-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section with Advanced Parallax */}
      <section
        id="home"
        className="relative pt-24 pb-16 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden"
      >
        {/* Multi-layer Parallax Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          {/* Enhanced floating particles with parallax */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`,
              }}
            />
          ))}
          {/* Geometric shapes with parallax */}
          <div
            className="absolute top-20 left-10 w-32 h-32 border border-cyan-500/20 rounded-full"
            style={{
              transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)`,
            }}
          />
          <div
            className="absolute top-40 right-20 w-24 h-24 border border-purple-500/20 rounded-lg"
            style={{
              transform: `translateY(${scrollY * 0.15}px) rotate(${-scrollY * 0.1}deg)`,
            }}
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* <div className="flex justify-center mb-6"
                 style={{ transform: `translateY(${scrollY * -0.05}px)` }}>
              <Badge className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Now with AI-powered code suggestions
              </Badge>
            </div> */}

            <h1
              className={`text-4xl sm:text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-white leading-tight ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ transform: `translateY(${scrollY * -0.2}px)` }}
            >
              Code Together,
              <br />
              <span className="text-white bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text">
                Build Faster
              </span>
            </h1>

            <p
              className={`text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.2s",
                transform: `translateY(${scrollY * -0.1}px)`,
              }}
            >
              Experience the future of collaborative development with real-time
              editing, AI assistance, and seamless team communication. Join
              thousands of developers building the next generation of software.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.4s",
                transform: `translateY(${scrollY * -0.05}px)`,
              }}
            >
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-red-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/25 group"
                >
                  Start Coding Now
                  <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {/* <Button size="lg" variant="outline" className="border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-400/25 backdrop-blur-sm group bg-slate-900/30"> */}
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-red-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Section with Parallax */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{
                animationDelay: "0.6s",
                transform: `translateY(${scrollY * -0.03}px)`,
              }}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Parallax */}
      <section
        id="features"
        className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-900/50 to-slate-950 overflow-hidden"
      >
        {/* Parallax background elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div
            className="text-center mb-20"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <Badge className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20 mb-4">
              Features
            </Badge>
            {/* <h2 className="text-4xl font-bold text-center text-[	#1464d3ff] mb-12">FEATURES</h2> */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-white">
              Powerful Tools for
              <br />
              Modern Development
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to collaborate effectively and build amazing
              software together.
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ transform: `translateY(${scrollY * -0.02}px)` }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 shadow-xl hover:shadow-2xl group animate-fade-in`}
                style={{ animationDelay: feature.delay }}
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Parallax */}
      <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-950 to-slate-900/50 overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div
            className="text-center mb-20"
            style={{ transform: `translateY(${scrollY * -0.03}px)` }}
          >
            <Badge className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20 mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-white">
              Loved by Developers
              <br />
              Around the World
            </h2>
          </div>

          <div
            className="grid md:grid-cols-3 gap-8"
            style={{ transform: `translateY(${scrollY * -0.02}px)` }}
          >
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Parallax */}
      <section
        id="about"
        className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-900/50 to-slate-950 overflow-hidden"
      >
        {/* Parallax background */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div
            className="max-w-4xl mx-auto text-center"
            style={{ transform: `translateY(${scrollY * -0.04}px)` }}
          >
            <Badge className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/20 mb-4">
              About Us
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-white">
              Building the Future of
              <br />
              Collaborative Development
            </h2>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed">
              Code Collab was born from a simple vision: to make collaborative
              coding as natural as working side by side. Our platform combines
              cutting-edge technology with intuitive design to create the
              ultimate development experience.
            </p>

            <div
              className="grid md:grid-cols-3 gap-8 mt-16"
              style={{ transform: `translateY(${scrollY * -0.02}px)` }}
            >
              {[
                {
                  icon: Rocket,
                  title: "Innovation First",
                  description:
                    "We're constantly pushing boundaries with AI-powered features and next-gen collaborative tools.",
                },
                {
                  icon: Heart,
                  title: "Developer-Centric",
                  description:
                    "Built by developers, for developers. Every feature is designed with your workflow in mind.",
                },
                {
                  icon: Shield,
                  title: "Enterprise Ready",
                  description:
                    "Bank-level security, 99.9% uptime, and compliance with industry standards.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-10 w-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section - Fixed Background */}
      <section className="relative py-24 px-4 sm:px-6 bg-slate-900 overflow-hidden">
        {/* Subtle background pattern instead of bright gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-900/20 to-blue-900/20"></div>
        </div>

        {/* Parallax geometric elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-10 left-10 w-24 h-24 border border-cyan-500/20 rounded-full"
            style={{
              transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`,
            }}
          />
          <div
            className="absolute bottom-10 right-10 w-32 h-32 border border-blue-500/20 rounded-lg"
            style={{
              transform: `translateY(${scrollY * 0.08}px) rotate(${-scrollY * 0.05}deg)`,
            }}
          />
        </div>

        <div
          className="container mx-auto text-center relative z-10"
          style={{ transform: `translateY(${scrollY * -0.02}px)` }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-white">
              Development Workflow?
            </span>
          </h2>
          <p className="text-xl mb-8 text-slate-300 max-w-2xl mx-auto">
            Join thousands of developers who are already building the future
            with Code Collab. Start your free trial today and experience the
            difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-red-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {/* <Button size="lg" variant="outline" className="border-2 border-slate-400/50 text-slate-300 hover:bg-slate-800/50 hover:border-slate-300 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              Schedule Demo */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-red-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-xl group"
            >
              Schedule Demo
            </Button>
          </div>
          <div className="flex items-center justify-center mt-8 text-slate-400">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>No credit card required • 14-day free trial</span>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Parallax */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle parallax background */}
        <div className="absolute inset-0">
          <div
            className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-cyan-900/10 to-transparent rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          />
        </div>

        <div
          className="container mx-auto relative z-10"
          style={{ transform: `translateY(${scrollY * -0.01}px)` }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Code className="h-8 w-8 text-cyan-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  CODE COLLAB
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The next-generation collaborative development platform that
                brings teams together to build amazing software faster than ever
                before.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 md:mb-0">
              &copy; 2024 Code Collab. All rights reserved.
            </p>
            <div className="flex space-x-6 text-slate-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
