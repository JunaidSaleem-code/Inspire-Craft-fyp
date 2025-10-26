"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import  {apiClient} from "@/lib/api-client";
import { useNotification } from "@/components/Notification";
import { useRouter } from "next/navigation";

import ArtworkCard from "@/components/ArtworkCard";
import PostCard from "@/components/PostCard";
import TutorialCard from "@/components/TutorialCard";
import AIImageCard from "@/components/AIImageCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Artwork, GeneratedImage, Post, Tutorial, User } from "@/app/types/page";
import { motion } from "framer-motion";
import { UserPlus, UserMinus, Edit, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CardSkeleton from "@/components/skeletons/CardSkeleton";

type TabType = "artworks" | "posts" | "tutorials" | "aiImages";

const TABS: TabType[] = ["artworks", "posts", "tutorials", "aiImages"];

export default function ProfilePage({ params }: { params: Promise<{ id?: string }> }) {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [profileUserId, setProfileUserId] = useState<string | undefined>();

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setProfileUserId(resolvedParams?.id || session?.user?.id);
    }
    getParams();
  }, [params, session?.user?.id]);
  
  const isOwnProfile = session?.user?.id === profileUserId;

  const [userProfile, setUserProfile] = useState<User>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [aiImages, setAiImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>("artworks");
  const [loadedTabs, setLoadedTabs] = useState<Record<TabType, boolean>>({
    artworks: true,
    posts: false,
    tutorials: false,
    aiImages: false,
  });

  useEffect(() => {
    if (!profileUserId) return;

    const fetchProfile = async () => {
      try {
        const userRes = await apiClient.getUserById(profileUserId);
        setUserProfile(userRes);

        const artworksRes = await apiClient.getArtworksByUser(profileUserId);
        setArtworks(artworksRes);

        setFollowerCount(userRes.followers?.length || 0);
        setFollowingCount(userRes.following?.length || 0);

        if (!isOwnProfile && session?.user?.id) {
          if(userRes.followers)
          setIsFollowing(userRes.followers?.includes(session.user.id));
        }
      } catch {
        showNotification("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileUserId, session?.user?.id, isOwnProfile, showNotification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Profile header skeleton */}
          <div className="glass-strong rounded-3xl p-8 mb-8 border border-white/20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Skeleton className="w-40 h-40 rounded-full" />
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
          {/* Content skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={6} aspectRatio="square" />
          </div>
        </div>
      </div>
    );
  }


  const handleTabClick = async (tab: TabType) => {
    setActiveTab(tab);
    if (loadedTabs[tab]) return;

    try {
      if(!profileUserId) return;
      if (tab === "posts") {
        const data: Post[] = await apiClient.getPostsByUser(profileUserId);
        setPosts(data);
      } else if (tab === "tutorials") {
        const data: Tutorial[] = await apiClient.getTutorialsByUser(profileUserId);
        setTutorials(data);
      } else if (tab === "aiImages") {
        const data: GeneratedImage[] = await apiClient.getAiImagesByUser(profileUserId);
        setAiImages(data);
      }

      setLoadedTabs((prev) => ({ ...prev, [tab]: true }));
    } catch {
      showNotification(`Failed to load ${tab}`, "error");
    }
  };

  const handleFollowToggle = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await apiClient.toggleFollow(profileUserId!);
      setIsFollowing(res.isFollowing);
      setFollowerCount((prev) => prev + (res.isFollowing ? 1 : -1));
      showNotification('pressed follow', 'success');
    } catch {
      showNotification("Failed to update follow status", "error");
    }
  };

  if (!session) return <div>Please log in to view profiles.</div>;

  const tabColors = {
    artworks: "from-purple-600 to-pink-600",
    posts: "from-pink-600 to-red-600",
    tutorials: "from-orange-600 to-yellow-600",
    aiImages: "from-green-600 to-teal-600",
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50"></div>
              <Image
                src={userProfile?.avatar || "/default-avatar.png"}
                alt="Profile"
                width={160}
                height={160}
                className="relative w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover"
              />
              {isOwnProfile && (
                <div className="absolute bottom-2 right-2 p-2 glass rounded-full border border-white/20">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
                {userProfile?.username}
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-2xl">
                {userProfile?.bio || "No bio provided."}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 sm:gap-6 mb-6 justify-center md:justify-start">
                <div className="glass rounded-xl px-6 py-3 border border-white/10">
                  <div className="text-2xl font-bold text-white">{followerCount}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="glass rounded-xl px-6 py-3 border border-white/10">
                  <div className="text-2xl font-bold text-white">{followingCount}</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
                <div className="glass rounded-xl px-6 py-3 border border-white/10">
                  <div className="text-2xl font-bold text-white">{artworks.length}</div>
                  <div className="text-sm text-gray-400">Artworks</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center md:justify-start">
                {!isOwnProfile ? (
                  <Button
                    onClick={handleFollowToggle}
                    className={`${
                      isFollowing
                        ? "glass border-white/30 text-white hover:bg-red-500/20"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    } px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/profile/edit/" + userProfile?._id)}
                    className="glass border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-12 flex-wrap"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? `bg-gradient-to-r ${tabColors[tab]} text-white shadow-lg scale-105`
                  : "glass border border-white/20 text-gray-300 hover:border-white/40 hover:scale-105"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {activeTab === "artworks" &&
            artworks.map((art, index) => (
              <motion.div
                key={art._id?.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArtworkCard artwork={art} />
              </motion.div>
            ))}

          {activeTab === "posts" &&
            posts.map((post, index) => (
              <motion.div
                key={post._id!.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}

          {activeTab === "tutorials" &&
            tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial._id!.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TutorialCard tutorial={tutorial} />
              </motion.div>
            ))}

          {activeTab === "aiImages" &&
            aiImages.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AIImageCard image={image} />
              </motion.div>
            ))}
        </motion.div>

        {/* Empty State */}
        {((activeTab === "artworks" && artworks.length === 0) ||
          (activeTab === "posts" && posts.length === 0) ||
          (activeTab === "tutorials" && tutorials.length === 0) ||
          (activeTab === "aiImages" && aiImages.length === 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 glass rounded-full flex items-center justify-center border border-white/20">
              <Sparkles className="w-12 h-12 text-gray-500" />
            </div>
            <p className="text-gray-400 text-xl">No {activeTab} yet</p>
            <p className="text-gray-500 text-sm mt-2">
              {isOwnProfile ? "Start creating and sharing your work!" : "Check back later"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
