import { SearchResult } from "@/app/types/page";
import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import GeneratedImage from "@/models/GeneratedImage";
import Post from "@/models/Post";
import Tutorial from "@/models/Tutorial";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");
  const skip = (page - 1) * limit;

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 });
  }

  await connectDB();

  try {
    const searchQuery = { $text: { $search: query } };
    const results: SearchResult = { artworks: [], posts: [], tutorials: [], generatedImages: [] };

    if (!category || category === "artwork") {
      results.artworks = await Artwork.find({
        ...searchQuery,
        price: { $gte: minPrice, $lte: maxPrice }
      })
        .skip(skip)
        .limit(limit);
    }

    if (!category || category === "post") {
      results.posts = await Post.find(searchQuery).skip(skip).limit(limit);
    }

    if (!category || category === "tutorial") {
      results.tutorials = await Tutorial.find(searchQuery).skip(skip).limit(limit);
    }

    if (!category || category === "image") {
      results.generatedImages = await GeneratedImage.find({
        ...searchQuery,
        isPublic: true,
      })
        .skip(skip)
        .limit(limit);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
