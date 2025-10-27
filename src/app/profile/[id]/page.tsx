"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import  {apiClient} from "@/lib/api-client";
import { useNotification } from "@/components/Notification";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Artwork, GeneratedImage, Post, Tutorial, User } from "@/app/types/page";
import { motion } from "framer-motion";
import { UserPlus, UserMinus, Edit, Loader2, Image as ImageIcon } from "lucide-react";
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
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUserId]);

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
    if (!session?.user?.id || isFollowingLoading) return;

    setIsFollowingLoading(true);
    const previousState = isFollowing;
    
    // Optimistic update
    setIsFollowing(!isFollowing);
    setFollowerCount((prev) => prev + (!isFollowing ? 1 : -1));

    try {
      const res = await apiClient.toggleFollow(profileUserId!);
      setIsFollowing(res.isFollowing);
      setFollowerCount((prev) => prev + (res.isFollowing && !previousState ? 1 : !res.isFollowing && previousState ? -1 : 0));
    } catch {
      // Revert on error
      setIsFollowing(previousState);
      setFollowerCount((prev) => prev + (previousState ? 1 : -1));
      showNotification("Failed to update follow status", "error");
    } finally {
      setIsFollowingLoading(false);
    }
  };

  if (!session) return <div>Please log in to view profiles.</div>;

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header - Instagram Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar - Smaller size */}
            <div className="relative mx-auto md:mx-0">
              <Image
                src={userProfile?.avatar || "/default-avatar.png"}
                alt="Profile"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
              />
              {isOwnProfile && (
                <div className="absolute -bottom-1 -right-1 p-1.5 glass rounded-full border-2 border-black">
                  <Edit className="w-3 h-3 text-purple-400" />
                </div>
              )}
            </div>

              {/* Profile Info */}
              <div className="flex-1 w-full">
                {/* Username and Action Button */}
                <div className="flex items-center gap-2 sm:gap-4 mb-4 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  {userProfile?.username}
                </h2>
                {!isOwnProfile ? (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={isFollowingLoading}
                    className={`${
                      isFollowing
                        ? "px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    } font-semibold transition-all duration-300 active:scale-95`}
                  >
                    {isFollowingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Following
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
                    className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 font-semibold transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Stats - Instagram Style */}
              <div className="flex gap-4 sm:gap-8 mb-4">
                <div>
                  <span className="font-semibold text-white">
                    {activeTab === "artworks" ? artworks.length : 
                     activeTab === "posts" ? posts.length : 
                     activeTab === "tutorials" ? tutorials.length : 
                     aiImages.length}
                  </span>
                  <span className="text-gray-400 ml-1">posts</span>
                </div>
                <div>
                  <span className="font-semibold text-white">{followerCount}</span>
                  <span className="text-gray-400 ml-1">followers</span>
                </div>
                <div>
                  <span className="font-semibold text-white">{followingCount}</span>
                  <span className="text-gray-400 ml-1">following</span>
                </div>
              </div>

              {/* Bio */}
              {userProfile?.bio && (
                <div className="mb-4">
                  <p className="text-gray-300">{userProfile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs - Instagram Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-white/10 mb-4"
        >
          <div className="flex justify-center">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-4 font-semibold transition-all duration-300 border-t-2 ${
                  activeTab === tab
                    ? "border-white text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content - Instagram Grid Style */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2"
        >
          {activeTab === "artworks" &&
            artworks.map((art) => (
              <Link key={art._id?.toString()} href={`/artwork/${art._id}`}>
                <div className="aspect-square relative group overflow-hidden cursor-pointer">
                  <Image
                    src={art.mediaUrl}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4 text-white">
                      <span className="font-semibold">{art.title}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

          {activeTab === "posts" &&
            posts.map((post) => (
              <Link key={post._id!.toString()} href={`/post/${post._id}`}>
                <div className="aspect-square relative group overflow-hidden cursor-pointer">
                  <Image
                    src={post.mediaUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4 text-white">
                      <span className="font-semibold">{post.title}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

          {activeTab === "tutorials" &&
            tutorials.map((tutorial) => (
              <Link key={tutorial._id!.toString()} href={`/tutorial/${tutorial._id}`}>
                <div className="aspect-square relative group overflow-hidden cursor-pointer">
                  <Image
                    src={tutorial.mediaUrl}
                    alt={tutorial.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4 text-white">
                      <span className="font-semibold">{tutorial.title}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

          {activeTab === "aiImages" &&
            aiImages.map((image) => (
              <Link key={image._id} href={`/ai-images/${image._id}`}>
                <div className="aspect-square relative group overflow-hidden cursor-pointer">
                  <Image
                    src={image.mediaUrl}
                    alt={image.prompt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4 text-white">
                      <span className="font-semibold">AI Generated</span>
                    </div>
                  </div>
                </div>
              </Link>
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
              <ImageIcon className="w-12 h-12 text-gray-500" />
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
