"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IKImage } from "imagekitio-next";
import { Heart, Bookmark } from "lucide-react";
import { Artwork } from "../types/page";

export default function ExplorePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  // const [tutorials, setTutorials] = useState<ITutorial[]>([]);
  const IMAGEKIT_BASE_URL = process.env.NEXT_PUBLIC_URL_ENDPOINT;

  useEffect(() => {
    async function fetchData() {
      try {
        const artworkRes = await fetch("/api/artwork");
        // const tutorialRes = await fetch("/api/tutorials");

        if (!artworkRes.ok 
          // || !tutorialRes.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const artworkData = await artworkRes.json();
        // const tutorialData = await tutorialRes.json();

        // console.log("Fetched Artworks:", artworkData);
        // console.log("Fetched Tutorials:", tutorialData);

        setArtworks(
          [artworkData]
          // Array.isArray(artworkData)
          //   ? artworkData.map((art) => ({
          //       ...art,
          //       _id: art._id?.toString(),
          //       artist: { ...art.artist, _id: art.artist?._id?.toString() },
          //     }))
          //   : []
        );
        // setTutorials(
        //   Array.isArray(tutorialData)
        //     ? tutorialData.map((tut) => ({ ...tut, _id: tut._id?.toString() }))
        //     : []
        // );
      } catch (error) {
        console.error("Error fetching data:", error);
        setArtworks([]);
        // setTutorials([]);
      }
    }
    fetchData();
  }, []);

  // console.log("State Artworks:", artworks);
  // console.log("State Tutorials:", tutorials);

  if (!artworks.length 
    // && !tutorials.length
  ) {
    return <p className="text-center text-gray-500">No artworks or tutorials available</p>;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {[...(artworks ?? [])
      // , ...(tutorials ?? [])
    ].map((item) => (
        <Card key={item._id?.toString() || Math.random().toString()} className="relative overflow-hidden rounded-xl shadow-lg">
          <CardContent className="p-0">
          
            {item.mediaUrl ? (
              <IKImage
                urlEndpoint={IMAGEKIT_BASE_URL}
                path={!item.mediaUrl.startsWith("http") ? item.mediaUrl : undefined}
                src={item.mediaUrl.startsWith("http") ? item.mediaUrl : undefined}
                transformation={[{ height: "600", width: "600" }]}
                alt={item.title}
                className="w-full h-[400px] object-cover"
              />
            ) :  (
              <p className="w-full h-[400px] flex items-center justify-center bg-gray-200">
                No image available
              </p>
            )}
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <div className="flex gap-2">
              <Heart className="w-5 h-5 cursor-pointer" />
              <Bookmark className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
