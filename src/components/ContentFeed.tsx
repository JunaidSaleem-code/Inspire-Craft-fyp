// "use client";

// import PostComponent from "./(content)/PostComponent";
// import TutorialComponent from "./(content)/TutorialComponent";
// import ArtworkComponent from "./(content)/ArtworkComponent";
// import AIImageComponent from "./(content)/AIImageComponent";

// interface ContentFeedProps {
//   content: any[];
//   type: "post" | "tutorial" | "artwork" | "ai-generated";
// }

// export default function ContentFeed({ content, type }: ContentFeedProps) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {content.map((item) => (
//         <div key={item._id.toString()}>
//           {type === "post" && <PostComponent post={item} />}
//           {type === "tutorial" && <TutorialComponent tutorial={item} />}
//           {type === "artwork" && <ArtworkComponent artwork={item} />}
//           {type === "ai-generated" && <AIImageComponent image={item} />}
//         </div>
//       ))}

//       {content.length === 0 && (
//         <div className="col-span-full text-center py-12">
//           <p className="text-base-content/70">No {type}s found</p>
//         </div>
//       )}
//     </div>
//   );
// }
