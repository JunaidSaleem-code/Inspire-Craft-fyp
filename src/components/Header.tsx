"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Search,
  Bell,
  PlusCircle,
  User,
  LogOut,
  BookOpen,
  Image,
  BrainCircuit,
  Brush,
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
    <nav className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold hover:opacity-90 transition"
          onClick={() => showNotification("Welcome to InspireCraft!", "info")}
        >
          <Home className="w-6 h-6" />
          <span className="hidden sm:block">InspireCraft</span>
        </Link>

        {/* Navigation Links */}
        {/* <div className="hidden md:flex items-center space-x-6">
          <Link href="/feed" className="flex items-center gap-1 hover:scale-105 transition">
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Feed</span>
          </Link> */}
          {/* <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="flex items-center gap-1 hover:scale-105 transition">
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </Link> */}

          {/* <Link href="/explore" className="flex items-center gap-1 hover:scale-105 transition">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Explore</span>
          </Link> */}

          {/* <Link href="/ai-images/public" className="flex items-center gap-1 hover:scale-105 transition">
            <BrainCircuit className="w-5 h-5" />
            <span className="hidden sm:inline">AI-Images</span>
          </Link>

          <Link href="/tutorial" className="flex items-center gap-1 hover:scale-105 transition">
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Tutorials</span>
          </Link>

          <Link href="/artwork" className="flex items-center gap-1 hover:scale-105 transition">
            <Brush className="w-5 h-5" />
            <span className="hidden sm:inline">Artworks</span>
          </Link> */}

          {/* <Link href="/notifications" className="flex items-center gap-1 hover:scale-105 transition">
            <Bell className="w-5 h-5" />
            <span className="hidden sm:inline">Alerts</span>
          </Link> */}

          {/* <Link href="/post" className="flex items-center gap-1 hover:scale-105 transition">
            <Image className="w-5 h-5" />
            <span className="hidden sm:inline">Posts</span>
          </Link>

        </div> */}


        {/* User Profile */}
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Link href="/upload">
                <Button className="bg-white text-pink-600 hover:bg-gray-100 p-2 rounded-full">
                  <PlusCircle className="w-6 h-6" />
                </Button>
              </Link>
              {/* <Link href="/explore" className="flex items-center hover:scale-105 transition">
                <Search className="w-5 h-5" />
              </Link> */}
             

              {/* <Link href="/notifications"   className="flex items-center  hover:scale-105 transition">
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Alerts</span>
              </Link> */}


              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 rounded-full hover:bg-white/20">
                    <User className="w-6 h-6 text-white" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-lg w-56 text-gray-800">
                  <DropdownMenuItem className="text-sm font-semibold text-indigo-600">
                    {session.user?.email?.split("@")[0]}
                  </DropdownMenuItem>
                  <div className="border-t my-2" />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${session.user?.id}`} className="flex items-center gap-2">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500 hover:bg-red-100 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
