import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Like from '@/models/Like';
import Post from '@/models/Post';
import Tutorial from '@/models/Tutorial';
import Artwork from '@/models/Artwork';
import { Model } from 'mongoose';
import { IPost } from '@/models/Post';
import { ITutorial } from '@/models/Tutorial';
import { IArtwork } from '@/models/Artwork';

type ContentType = 'post' | 'tutorial' | 'artwork';

const ModelMap: Record<ContentType, Model<IPost | ITutorial | IArtwork>> = {
  post: Post,
  tutorial: Tutorial,
  artwork: Artwork,
};

export async function POST(
  req: Request,
  { params }: { params: { contentType: string; id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { contentType, id } = params;

    if (!['post', 'tutorial', 'artwork'].includes(contentType)) return NextResponse.json({ message: 'Invalid category' }, { status: 400 });

    const typedContentType = contentType as ContentType;
    const Model = ModelMap[typedContentType];

    const existingLike = await Like.findOne({ user: userId, [typedContentType]: id });

    console.log('existingLike', existingLike);
    
    if (existingLike) {
      await Promise.all([
      Like.deleteOne({ _id: existingLike._id }),
      Model.findByIdAndUpdate(id, { $pull: { likes: existingLike._id } }),
      ]);

      return NextResponse.json({ success: true, liked: false });
    }else{
      console.log('newlike main agaya');
      const newLike = await Like.create({ user: userId, [typedContentType]: id });
      await Model.findByIdAndUpdate(id, { $addToSet: { likes: newLike._id } });
    }

    const allLikes = await Like.find({ [typedContentType]: id })
    .populate("user", "name email image");

    return NextResponse.json({
      success: true,
      liked: true,
      totalLikes: allLikes.length,
      likes: allLikes.map((l) => l.user),
    });
  } catch (err) {
    console.error("Like error:", err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
