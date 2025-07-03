import Image from 'next/image';
import React from 'react';

export default function ArticlePage() {
  // Static data for demo; in production, fetch from backend or markdown
  const heroImage = "https://s3.us-east-1.amazonaws.com/images.gearjunkie.com/uploads/2025/05/Anso-of-Denmark-Aros-knife.jpg";
  const productImage = "https://s3.us-east-1.amazonaws.com/images.gearjunkie.com/uploads/2025/05/Anso-of-Denmark-Aros-in-a-box.jpg";
  const title = "A Perfect 10: Anso of Denmark ‘Aros’ Review";
  const subtitle = "The Aros, from Jens Anso, is a stunning offering that lives well in a pocket and evinces a master designer’s insight.";
  const author = "Anthony Sculimbrene";
  const date = "Jul 02, 2025 10:42 a.m. ET";
  const specs = {
    Steel: "RWL34",
    Grind: "Flat grind",
    Lock: "Button lock",
    "Blade length": "2.5\"",
    OAL: "6\"",
    Weight: "1.91 oz. in carbon fiber",
    Price: "$565 in carbon fiber",
    "Country of origin": "Made in Denmark"
  };
  const pros = [
    "Excellent size",
    "Versatile blade shape",
    "Unique asymmetric design gives rise to useful features",
    "Elegant, sculpted clip",
    "Solid materials with a wide range of prices"
  ];
  const cons = [
    "Even cheap models are expensive",
    "Absurd packaging"
  ];
  const reviewText = `\
### First Impressions: Unboxing a Bear\n\nThe Aros is definitely worth the hunt; the knife, of course, is wonderful, but the packaging bears mention. I normally don’t comment on packaging (and my favorite packaging was the old-school Strider packages — ziplock bags), but this was insane.\n\nIt was a series of Matryoshka dolls all with Anso branding. There was the big package of cardboard, and then some paper, and a smaller one, and then a zippered pouch.\n\nI understand the need to give the item a luxe presentation, but this was silly and wasteful. You pay for all that. I’d rather my money go into the knife, hence my preference for the Strider packaging.\n\n### Use and Carry\n\nDuring recycling processing, including breaking down all the ridiculous packing that this knife came in, it worked well. It allowed me to work out a bit of my frustration that I paid money to send 15 boxes and stickers and doodads around the globe, just to be thrown away.\n\nIn thick cardboard, the slender blade was like the pull tab on a zipper — it separated the material cleanly and evenly with no resistance. The blade stock is not quite as thin as something like a Victorinox blade or the TRM Nerd, but still quite thin.\n\nIn corrugated cardboard, it still pierced and sliced with ease.\n\nIn the workshop, I like to see how knives do with marking tasks and occasionally some slicing and carving. I was finishing up a walnut box for my son. (It took ages; I want it to be light, but the thin walls made finding hinges a challenge.) I was chiseling out the hinge mortise on the box — a pencil was too wide and a bigger knife too unwieldy. This made the Aros a perfect choice.\n\nI scribed the line against a square’s edge and not only was it super precise, but it also pre-cut all of the fibers. The result was surprisingly clean mortises. I have only done this a few times before, and it is a very finicky task, but the Aros made it significantly easier.\n\nThe steel, a less common steel called RWL34 (a powder steel named for Robert W Loveless, aka Bob Loveless), stayed sharp for a good long time. It was also quite balanced, displaying no corrosion whatsoever, but also being nice to strop.\n\nLoveless designed the steel for use in cutlery, and it shows. The steel is in the 154CM family, and with the use of powder metallurgy, it is really quite nice. CPM 154 is one of my all-time favorites, and this is basically the same thing from a different maker. Anso’s choice here was very smart.\n\nThe button lock was also a smart idea. It gives the Aros a very smooth action and makes it easy and intuitive to operate. Button locks aren’t the hardest-to-use lock in the world, but given the size of the knife, that weakness is irrelevant.\n\nThe clip and lanyard setup are ingenious. The clip attaches to the handle right where the lanyard hole is, but instead of passing through both scales, the lanyard goes out the back end of the knife. By embracing a bit of asymmetry, Anso solved the “clip or lanyard dilemma” with elegance, preserving both but taking up no additional space.\n\nThe flipper tab and action are equally excellent. With a bearing pivot and the low-drag button lock, even the small tab here gives plenty of leverage to pop the blade out quickly and reliably.\n\nThe handle works well too, providing plenty of grip with a small milling pattern and enough bulk to hold onto during cutting tasks.\n\nLastly, I really appreciated both the crowned (rounded-over) spine and the sharpening choil. I didn’t need to sharpen the knife, but I did strop it. It was nice and wide, allowing me to get all the way to the end of the edge easily.\n\nYou won’t find a knife much nicer than this short of an art knife. Anso seems to be producing them in real numbers, and the design is beautiful — technical, but still pleasing to the eye. The blade itself is a good size and thickness, the steel works well, and the lock works for the knife’s size. Aside from the high price, which is to be expected as this is an in-house design, and the silly amount of packaging, there is nothing I would change about the Aros purchase. Even the ship time was nice, just under a week.\n\nIf you want the best EDC knife out there right now, this has to be in the conversation. In an era with lots of high-end, semi-production knives like the Grimsmo Rask, the Oz Machine Co Roosevelt, and the SPK Lamia, the Aros sits atop the throne for its superior design and pocketable size.\n\nIt is also a little cheaper and more readily available than those other knives. This is the fulfillment of the promise young Anso showed all those years ago. Spyderco’s product literature described him as the young Michael Jordan of knife making. If that is the case, then that Aros is Anso’s 1997 playoff run — perfect and legendary.\n`;
  const authorBio = `Anthony Sculimbrene has been writing about knives and other everyday carry gear for more than a decade. He has written for numerous digital and print sources in those years. He has also cultivated relationships with people throughout the gear world both through his reviews and his work on knife laws. He enjoys reveling in the details of good design and the history of gear. Sculimbrene is a lawyer and legal consultant for AKTI (American Knife and Tool Institute), an industry advocacy and trade group that is working to reform knife laws around the United States.`;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{title}</h1>
        <h2 className="text-lg text-slate-600 mb-2">{subtitle}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-2">
          <span>By {author}</span>
          <span>• {date}</span>
        </div>
      </header>

      {/* Product Info Box */}
      <aside className="mb-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-40 h-40 relative flex-shrink-0">
          <Image
            src={productImage}
            alt={title}
            fill
            className="object-contain rounded-xl"
          />
        </div>
        <div className="flex-1 w-full">
          <ul className="mb-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {Object.entries(specs).map(([key, value]) => (
              <li key={key}><span className="font-semibold capitalize">{key}:</span> {String(value)}</li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Review Content */}
      <article className="prose prose-lg max-w-none mb-8">
        {reviewText.split('\n').map((para, i) => (
          para.trim().startsWith('###') ? <h3 key={i}>{para.replace('### ', '')}</h3> : <p key={i}>{para}</p>
        ))}
      </article>

      {/* Pros & Cons */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-green-700 mb-2">Pros</h3>
          <ul className="list-disc pl-5 space-y-1">
            {pros.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-red-700 mb-2">Cons</h3>
          <ul className="list-disc pl-5 space-y-1">
            {cons.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </section>

      {/* Author Bio */}
      <footer className="mt-12 border-t pt-6 text-sm text-slate-500">
        <div className="font-semibold mb-1">About the author</div>
        <div>{authorBio}</div>
      </footer>
    </main>
  );
}
