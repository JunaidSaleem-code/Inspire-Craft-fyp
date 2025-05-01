import { NextResponse } from "next/server";
import OpenAI from "openai";
import GeneratedImage, { AI_IMAGE_DIMENSIONS } from "@/models/GeneratedImage";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import imagekit from "@/lib/imagekit";
import { authOptions } from "@/lib/auth";

const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY,
});

export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  await connectDB();
  try {
    const { prompt } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
      const userId = session.user.id;
    
      const fluxConfig = {
        width: AI_IMAGE_DIMENSIONS.default.width,
        height: AI_IMAGE_DIMENSIONS.default.height,
      };

    const response = await client.images.generate({
        "model": "black-forest-labs/flux-dev",
        "response_format": "url",
        "extra_body": {
            "response_extension": "png",
            "width": fluxConfig.width,
            "height": fluxConfig.height,
            "num_inference_steps": 28,
            "negative_prompt": "",
            "seed": -1
        },
        "prompt": prompt,
    } as any)
      console.log('response::', response);
      const rawImageUrl = response.data[0].url;

      if (!rawImageUrl) {
        return NextResponse.json({ success: false, message: "Image generation failed" }, { status: 500 });
      }

      const uploaded = await imagekit.upload({
        file: rawImageUrl as string,
        fileName: `${userId}_${Date.now()}.png`,
        useUniqueFileName: true,
        folder: "ai-images",
      });
      console.log('uploaded::', uploaded);
      const newImage = await GeneratedImage.create({
        user: userId,
        prompt,
        mediaUrl: uploaded.filePath,
        isPublic: false,
        source: "FLUX.1-dev",
        transformation: fluxConfig,
      });
  
      return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to generate image" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const images = await GeneratedImage.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, images });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch images" }, { status: 500 });
  }
}
