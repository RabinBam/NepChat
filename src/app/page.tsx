"use client";
import React, { useState, useEffect } from "react";
import {
  Phone,
  Video,
  MessageCircle,
  Users,
  Mountain,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const NepChatHomepage: React.FC = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fullText = "नमस्ते! Connect with Nepal and the World";
  const subtitle =
    "Experience seamless communication with the warmth of Nepali hospitality";

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Typewriter effect (client only)
  useEffect(() => {
    if (!mounted) return;
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
      setTimeout(() => setShowButton(true), 500);
    }
  }, [currentIndex, fullText, mounted]);

  const features = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Clear Voice Calls",
      description: "Crystal clear conversations",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Chat",
      description: "See your loved ones",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Easy Messaging",
      description: "Simple text and voice messages",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Groups",
      description: "Connect with everyone",
    },
  ];

  const stats = [
    { number: "10M+", label: "Happy Users" },
    { number: "50+", label: "Countries" },
    { number: "99.9%", label: "Reliability" },
    { number: "24/7", label: "Support" },
  ];

  if (!mounted) {
    // Render only minimal SSR-safe UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50">
        <h1 className="text-2xl font-bold text-gray-600">NepChat</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1200 400"
            className="w-full h-80 text-emerald-200/30"
          >
            <path
              d="M0 400 L200 200 L400 250 L600 150 L800 200 L1000 100 L1200 180 L1200 400 Z"
              fill="currentColor"
            />
          </svg>
          <svg
            viewBox="0 0 1200 300"
            className="absolute bottom-0 w-full h-60 text-blue-200/40"
          >
            <path
              d="M0 300 L150 180 L350 220 L550 120 L750 160 L950 80 L1200 140 L1200 300 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/50">
                <Mountain className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">नेप</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-700">
              Nep
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Chat
              </span>
            </h1>
          </div>
        </div>

        {/* Typewriter */}
        <div className="text-center mb-8 max-w-4xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-700 mb-6 h-20 md:h-24 flex items-center justify-center">
            {displayText}
            <span className="animate-pulse text-emerald-500 ml-1">|</span>
          </h2>
          {isTypingComplete && (
            <p className="text-xl md:text-2xl text-gray-600 animate-fade-in-up max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* CTA */}
        {showButton && (
          <div className="mb-16 animate-fade-in-up">
            <Link href="/chat">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg md:text-xl font-semibold rounded-2xl shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Start Connecting</span>
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        )}
        {/* Features */}
        {showButton && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 animate-fade-in-up max-w-4xl w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center hover:bg-white/80 transition-all duration-300 hover:scale-105 border border-gray-200/50 shadow-lg"
              >
                <div className="text-emerald-600 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-gray-700 font-semibold text-base md:text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {showButton && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-fade-in-up max-w-3xl w-full mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/50 rounded-xl p-3 md:p-4"
              >
                <div className="text-2xl md:text-4xl font-bold text-gray-700 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-xs md:text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust */}
        {showButton && (
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-6 animate-fade-in-up">
            <div className="flex items-center space-x-2 text-emerald-600 bg-white/60 px-3 py-1 md:px-4 md:py-2 rounded-full">
              <Shield className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">
                Secure & Private
              </span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 bg-white/60 px-3 py-1 md:px-4 md:py-2 rounded-full">
              <Mountain className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">
                Made in Nepal
              </span>
            </div>
            <div className="flex items-center space-x-2 text-orange-600 bg-white/60 px-3 py-1 md:px-4 md:py-2 rounded-full">
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">
                Global Reach
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NepChatHomepage;
