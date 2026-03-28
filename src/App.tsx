import { useEffect, useState, useRef } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Minimal White Dress",
    price: 1999,
    image: "https://images.unsplash.com/photo-1520975922284-7b0b2c6e8b57",
  },
  {
    id: "2",
    name: "Classic Brown Outfit",
    price: 2499,
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a7e",
  },
];

export default function App() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const collectionRef = useRef<HTMLDivElement>(null);

  // ✅ Load wishlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  // ✅ Save wishlist
  const syncWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  // ✅ Toggle wishlist
  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      syncWishlist(wishlist.filter((item) => item !== id));
    } else {
      syncWishlist([...wishlist, id]);
    }
  };

  // ✅ Scroll to collection
  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans">
      {/* HEADER */}
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Verve</h1>

        <div className="flex gap-4">
          <button onClick={scrollToCollection}>Shop</button>
          <button onClick={() => alert("Collections clicked")}>
            Collections
          </button>
          <button onClick={() => alert("About clicked")}>About</button>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center p-10">
        <h2 className="text-3xl font-semibold mb-4">
          The Art of Understated
        </h2>
        <button
          onClick={scrollToCollection}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Shop Collection
        </button>
      </section>

      {/* PRODUCTS */}
      <section ref={collectionRef} className="p-10 grid grid-cols-2 gap-6">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-60 object-cover"
            />

            <h3 className="mt-2 font-medium">{product.name}</h3>
            <p>₹{product.price}</p>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="mt-2 px-4 py-1 border rounded"
            >
              {wishlist.includes(product.id)
                ? "❤️ Remove"
                : "🤍 Wishlist"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
