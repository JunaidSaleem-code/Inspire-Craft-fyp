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

type TabType = "artworks" | "posts" | "tutorials" | "aiImages";

const TABS: TabType[] = ["artworks", "posts", "tutorials", "aiImages"];

export default function ProfilePage({ params }: { params: { userId?: string } }) {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const router = useRouter();

  const profileUserId = params?.userId || session?.user?.id;
  const isOwnProfile = session?.user?.id === profileUserId;

  const [userProfile, setUserProfile] = useState<User>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [aiImages, setAiImages] = useState<GeneratedImage[]>([]);

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
        console.log('userRes', userRes);

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
      }
    };

    fetchProfile();
  }, [profileUserId, session?.user?.id, isOwnProfile, showNotification]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Image
              src={userProfile?.avatar || "/default-avatar.png"}
              alt="Profile"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold text-indigo-700">{userProfile?.username}</h2>
              <p className="text-gray-700 mt-1">{userProfile?.bio || "No bio provided."}</p>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span><strong>{followerCount}</strong> Followers</span>
                <span><strong>{followingCount}</strong> Following</span>
              </div>

              {!isOwnProfile &&
               (
                <button
                  onClick={handleFollowToggle}
                  className={`mt-3 px-4 py-2 rounded-lg text-white font-medium ${
                    isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )
              }
              {isOwnProfile && (
                <Button
                  onClick={() => router.push("/profile/edit/" + userProfile?._id)}
                  className="mt-3 px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-2 rounded-lg text-white transition ${
                activeTab === tab
                  ? "bg-black"
                  : tab === "artworks"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : tab === "posts"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : tab === "tutorials"
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {activeTab === "artworks" &&
            artworks.map((art) => <ArtworkCard key={art._id?.toString()} artwork={art} />)}

          {activeTab === "posts" &&
            posts.map((post) => <PostCard key={post._id!.toString()} post={post} />)}

          {activeTab === "tutorials" &&
            tutorials.map((tutorial) => <TutorialCard key={tutorial._id!.toString()} tutorial={tutorial} />)}

          {activeTab === "aiImages" &&
            aiImages.map((image) => <AIImageCard key={image._id} image={image} />)}
        </div>
      </div>
    </div>
  );
}
