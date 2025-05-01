import ContentFeed from "@/components/ContentFeed";
import { IArtwork } from "@/models/Artwork";
import { IGeneratedImage } from "@/models/GeneratedImage";
import { IPost } from "@/models/Post";
import { ITutorial } from "@/models/Tutorial";

interface ExplorePageProps {
    posts: IPost[];
    tutorials: ITutorial[];
    artworks: IArtwork[];
    aiImages: IGeneratedImage[];
  }
  

export default function ExplorePage({ posts, tutorials, artworks, aiImages } : ExplorePageProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Latest Posts</h2>
      <ContentFeed content={posts} type="post" />

      <h2 className="text-xl font-bold">Tutorials</h2>
      <ContentFeed content={tutorials} type="tutorial" />

      <h2 className="text-xl font-bold">Artworks for Sale</h2>
      <ContentFeed content={artworks} type="artwork" />

      <h2 className="text-xl font-bold">AI-Generated Images</h2>
      <ContentFeed content={aiImages} type="ai-generated" />
    </div>
  );
}
