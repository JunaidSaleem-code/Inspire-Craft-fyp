"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  PlusCircle,
  User,
  LogOut,
  Search,
  MessageCircle,
} from "lucide-react";
import { useNotification } from "@/components/Notification";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();


  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-xl bg-black/40">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold hover:opacity-90 transition-all duration-300 group"
          onClick={() => showNotification("Welcome to InspireCraft!", "info")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <Home className="w-7 h-7 relative z-10 text-white" />
          </div>
          <span className="hidden sm:block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            InspireCraft
          </span>
        </Link>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Link 
                href="/explore" 
                className="p-2 rounded-full glass hover:bg-white/10 transition-all duration-300 hover:scale-110 group"
              >
                <Search className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
              </Link>
              
              <Link href="/messages">
                <Button className="glass hover:bg-white/10 border border-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110 group">
                  <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </Button>
              </Link>
              
              <Link href="/upload">
                <Button className="glass hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110 group">
                  <PlusCircle className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="p-2 rounded-full glass hover:bg-white/10 border border-white/20 transition-all duration-300 hover:scale-110 group"
                  >
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-black"></div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent 
                  align="end" 
                  className="glass-strong border border-white/20 shadow-xl rounded-xl w-56 mt-2"
                >
                  <DropdownMenuItem className="text-sm font-semibold text-purple-300 py-3">
                    {session.user?.email?.split("@")[0]}
                  </DropdownMenuItem>
                  <div className="border-t border-white/10 my-2" />
                  <DropdownMenuItem asChild>
                    <Link 
                      href={`/profile/${session.user?.id}`} 
                      className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-400 hover:bg-red-500/20 cursor-pointer flex items-center gap-2 py-2 px-3 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button 
                variant="outline" 
                className="glass border border-white/30 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:border-transparent font-semibold transition-all duration-300 hover:scale-105"
              >
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
