"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

// API: GET /api/categories — fetch all categories with name, icon, sub-items
const categories = [
  {
    name: "Flowers",
    icon: "local_florist",
    items: [
      "Roses",
      "Tulips",
      "Orchids",
      "Lilies",
      "Sunflowers",
      "Mixed Bouquets",
    ],
  },
  {
    name: "Cakes",
    icon: "cake",
    items: [
      "Chocolate Cakes",
      "Eggless Cakes",
      "Photo Cakes",
      "Cupcakes",
      "Cheesecakes",
      "Fondant Cakes",
    ],
  },
  {
    name: "Personalised",
    icon: "redeem",
    items: [
      "Photo Frames",
      "Custom Mugs",
      "Engraved Gifts",
      "Name Cushions",
      "Memory Books",
    ],
  },
  {
    name: "Plants",
    icon: "potted_plant",
    items: [
      "Indoor Plants",
      "Succulents",
      "Bonsai",
      "Air Purifiers",
      "Flowering Plants",
      "Terrariums",
    ],
  },
  {
    name: "Combos",
    icon: "celebration",
    items: [
      "Flower & Cake",
      "Flower & Chocolate",
      "Hamper Boxes",
      "Spa Combos",
      "Gourmet Combos",
    ],
  },
  {
    name: "LUXE",
    icon: "diamond",
    items: [
      "Premium Roses",
      "Exotic Orchids",
      "Luxury Hampers",
      "Gold Dipped Flowers",
      "Bespoke Arrangements",
    ],
  },
  {
    name: "Gourmet",
    icon: "nest_eco_leaf",
    items: [
      "Chocolates",
      "Dry Fruits",
      "Cookies & Brownies",
      "Wine & Cheese",
      "Artisan Sweets",
    ],
  },
];

// API: GET /api/products/bestsellers — fetch bestseller products (limit: 4)
const products = [
  {
    title: "Crimson Velvet Roses",
    description: "Freshly cut 24-piece bouquet",
    price: "₹1,299",
    rating: "4.9 (2k+)",
    badge: "Top Rated",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow",
  },
  {
    title: "Truffle & Tulip Duo",
    description: "Premium gifting combo",
    price: "₹2,499",
    rating: "4.8 (800)",
    badge: "Same Day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg",
  },
  {
    title: "Orchid Vanilla Luxe",
    description: "0.5 kg Eggless Cake",
    price: "₹1,899",
    rating: "5.0 (1.2k)",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g",
  },
  {
    title: "Emerald Zen Ficus",
    description: "Indoor curated plant",
    price: "₹3,299",
    rating: "4.7 (450)",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA",
  },
];

// API: GET /api/categories/feelings — fetch mood-based gifting categories with images
const giftFeelings = [
  {
    name: "Love & Romance",
    desc: "Woo them with roses & sweets",
    href: "/categories/love",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow",
  },
  {
    name: "Birthday Wishes",
    desc: "Make their day extra special",
    href: "/categories/birthday",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g",
  },
  {
    name: "Congratulations",
    desc: "Celebrate their big wins",
    href: "/categories/congrats",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg",
  },
  {
    name: "Thank You",
    desc: "Show your gratitude in style",
    href: "/categories/thankyou",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA",
  },
  {
    name: "Sorry",
    desc: "Say sorry with soft blooms",
    href: "/categories/sorry",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtpw8rdle6xtlfxqSRqJfH1ncbABiWakWw86cMXj1g8INXZCjx-ugi7doQoFkfdfYwjp2GAxqXN4eLud-8TFK4fXS2FvBdsOI1TUd-ebKvcYVe5J0CslW8Xrq3BLEE03Yt_1TGOOyoefYGtKBIldcRd071ugfw_T-U0VBqB4-gmdT7ecr2gdwFj3J8TJqFXSX7PmS_x7XCv3HgqOJuJxbhgUDsEd2-YT8tmo6dvZFMnhbPU-ifd2ajPw",
  },
  {
    name: "Get Well Soon",
    desc: "Cheer them up instantly",
    href: "/categories/getwell",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGvuLZcednIxtP7LvNDWh-M8j9yfFteRp7hlRekUe0b9dQV5Y_nXAAsr816jwS4NbeQ03kNVexoIPuOS4pN4eZrbVudqrfd8PDDYWyK36V8QLU_ksx-NulJT5M6IIsiS5tL5Z_thyHUyMlHu0z5qMaZyReqaylfuoLkcIkgVQXkybnGgB60SIWQp03LEt1Fzj6MeASn_uPgPhlGlC3HFSMntIsfTSwZIaVsWf-LXoSyHhbRB97AJoYaQ",
  },
];
// =========================================================
// GIFTS FOR EVERY OCCASION
// Backend connect hone ke baad ye data API se aayega.
// published: true  -> Home Page par show
// published: false -> Home Page par hide
// =========================================================

const giftOccasions = [
  {
    id: 1,
    name: "Raksha Bandhan",
    description: "Celebrate the beautiful bond of love",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow",
    redirectUrl: "/categories/raksha-bandhan",
    displayOrder: 1,
    published: true,
  },
  {
    id: 2,
    name: "Ganesh Chaturthi",
    description: "Send blessings, love and festive joy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g",
    redirectUrl: "/categories/ganesh-chaturthi",
    displayOrder: 2,
    published: true,
  },
  {
    id: 3,
    name: "Diwali",
    description: "Brighten every celebration with thoughtful gifts",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA",
    redirectUrl: "/categories/diwali",
    displayOrder: 3,
    published: true,
  },
  {
    id: 4,
    name: "Valentine's Day",
    description: "Make every romantic moment unforgettable",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtpw8rdle6xtlfxqSRqJfH1ncbABiWakWw86cMXj1g8INXZCjx-ugi7doQoFkfdfYwjp2GAxqXN4eLud-8TFK4fXS2FvBdsOI1TUd-ebKvcYVe5J0CslW8Xrq3BLEE03Yt_1TGOOyoefYGtKBIldcRd071ugfw_T-U0VBqB4-gmdT7ecr2gdwFj3J8TJqFXSX7PmS_x7XCv3HgqOJuJxbhgUDsEd2-YT8tmo6dvZFMnhbPU-ifd2ajPw",
    redirectUrl: "/categories/valentines-day",
    displayOrder: 4,
    published: true,
  },
  {
    id: 5,
    name: "Mother's Day",
    description: "A heartfelt surprise for the most special person",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGvuLZcednIxtP7LvNDWh-M8j9yfFteRp7hlRekUe0b9dQV5Y_nXAAsr816jwS4NbeQ03kNVexoIPuOS4pN4eZrbVudqrfd8PDDYWyK36V8QLU_ksx-NulJT5M6IIsiS5tL5Z_thyHUyMlHu0z5qMaZyReqaylfuoLkcIkgVQXkybnGgB60SIWQp03LEt1Fzj6MeASn_uPgPhlGlC3HFSMntIsfTSwZIaVsWf-LXoSyHhbRB97AJoYaQ",
    redirectUrl: "/categories/mothers-day",
    displayOrder: 5,
    published: true,
  },
  {
    id: 6,
    name: "Father's Day",
    description: "Celebrate him with something truly memorable",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow",
    redirectUrl: "/categories/fathers-day",
    displayOrder: 6,
    published: true,
  },
];
const categoryRoutes = {
  Flowers: "/categories/flowers",
  Cakes: "/categories/cakes",
  Plants: "/categories/plants",
  Personalised: "/categories/personalised",
  Combos: "/categories/combos",
  LUXE: "/categories/luxe",
  Gourmet: "/categories/gourmet",
};
const LOCAL_WISHLIST_KEY = "local-wishlist";
/* =========================================================
   PRODUCT SLUG
   Same logic as Category Page
========================================================= */

const createProductSlug = (product) => {
  const source =
    product?.slug || product?.title || product?.id || product?._id || "product";

  const slug = String(source)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `product-${String(product?.id ?? product?._id ?? "item")}`;
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const occasionCarouselRef = useRef(null);
  const isDraggingOccasions = useRef(false);
  const occasionDragStartX = useRef(0);
  const occasionScrollStart = useRef(0);
  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      sessionStorage.setItem(
        "selected-product",
        JSON.stringify({
          title: product.title,
          productName: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          badge: product.badge,
          rating: product.rating,
        }),
      );
    } catch (error) {
      console.error("Failed to save selected product:", error);
      return;
    }

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${createProductSlug(product)}`,
        )}`,
      );
      return;
    }

    router.push(`/products/${createProductSlug(product)}`);
  };

  const handleBuyNow = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      sessionStorage.setItem(
        "selected-product",
        JSON.stringify({
          title: product.title,
          productName: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          badge: product.badge,
          rating: product.rating,
        }),
      );
    } catch (error) {
      console.error("Failed to save selected product:", error);
      return;
    }

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${createProductSlug(product)}?action=buynow`,
        )}`,
      );
      return;
    }

    router.push(`/products/${createProductSlug(product)}?action=buynow`);
  };

  const handleWishlistToggle = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const storedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);

      const currentWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];

      const safeWishlist = Array.isArray(currentWishlist)
        ? currentWishlist
        : [];

      const productId = String(
        product?.id ??
          product?._id ??
          product?.productId ??
          product?.title ??
          "",
      );

      const productName = product?.title ?? product?.productName ?? "";

      const existingIndex = safeWishlist.findIndex(
        (item) =>
          String(item?.productId ?? item?.id ?? item?.productName ?? "") ===
            productId || item?.productName === productName,
      );

      let updatedWishlist;

      if (existingIndex >= 0) {
        updatedWishlist = safeWishlist.filter(
          (_, index) => index !== existingIndex,
        );
      } else {
        updatedWishlist = [
          ...safeWishlist,
          {
            productId,
            productName,
            categoryName:
              product?.categoryName ?? product?.category ?? "Flowers",
            image: product?.image ?? product?.images?.[0] ?? "",
            price:
              product?.price ??
              product?.salePrice ??
              product?.currentPrice ??
              0,
            selectedChoice: product?.selectedChoice ?? "",
            addedAt: new Date().toISOString(),
          },
        ];
      }

      localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updatedWishlist));

      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  useEffect(() => {
    const cards = document.querySelectorAll(".product-card-hover");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-y-0");
              entry.target.classList.remove("opacity-0", "translate-y-8");
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 },
    );

    cards.forEach((card) => {
      card.classList.add(
        "opacity-0",
        "translate-y-8",
        "transition-all",
        "duration-500",
      );
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem(LOCAL_WISHLIST_KEY);
      if (!storedWishlist) {
        setWishlist([]);
        return;
      }
      const parsedWishlist = JSON.parse(storedWishlist);
      setWishlist(Array.isArray(parsedWishlist) ? parsedWishlist : []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    }
  }, []);
  return (
    <main className="pb-16 md:pb-0">
      {/* Hero Banner (Desktop Only) */}
      <section className="hidden md:block relative overflow-hidden pt-4 md:pt-6">
        <div className="max-w-container-max mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[3/1] bg-surface-container shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDa0Va4ArSi3WShtViA077fsL0IdoyAn4geB0a4tauku3kBBGsLbOGmxB5MeirhT5v4-3euRMFVOYeVyRrlLUJEwoWaocncaZt4bwFFnvM-pHF8BBoppeEjJsJTKqnum6K8lwGlfoQga1D-x4eIIS_2JEwTs7MEGLdm3egc9HYBkU1Kh0q_gK2xBYs2_yDivgKbpLF6BdRq3Zuk_S8_i-hMQ2CXWp5S4ULx6LjIXsoRTdOGbmmR5nQUgA')",
              }}
            />
            <div className="absolute inset-0 flex items-center px-8 lg:px-12 bg-gradient-to-r from-[#fbf9f8]/90 via-[#fbf9f8]/60 to-transparent">
              <div className="max-w-xl">
                <span className="inline-block px-4 py-1 bg-primary text-white rounded-full font-label-lg text-label-lg mb-4 animate-bounce">
                  New Season
                </span>

                <h1 className="font-display-lg text-display-lg text-on-surface mb-4 leading-tight">
                  Send Love <br />
                  <span className="text-primary italic">Beyond Borders</span>
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                  Celebrate your bond with handcrafted bouquets and curated
                  gifts.
                </p>

                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-primary text-white rounded-full font-label-lg text-label-lg hover:shadow-lg hover:scale-105 transition-all">
                    Order Now
                  </button>

                  <button className="px-8 py-3 border-2 border-primary text-primary rounded-full font-label-lg text-label-lg hover:bg-primary/5 transition-all">
                    View Luxe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Bar */}
      <section className="py-3 sm:py-5 md:py-[40px]">
        <div className="max-w-container-max mx-auto px-3 sm:px-4">
          <div className="flex gap-3 sm:gap-6 md:gap-8 overflow-x-auto hide-scrollbar pb-1 md:pb-4 md:justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={categoryRoutes[cat.name] || "#"}
                className="flex flex-col items-center gap-1 sm:gap-2 flex-shrink-0 cursor-pointer group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shadow-sm">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-3xl group-hover:text-white">
                    {cat.icon}
                  </span>
                </div>

                <span className="text-[11px] sm:text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Gifts For Every Occasion */}
      <section className="pb-5 sm:pb-8 md:pb-16">
        <div className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          {/* Section Header */}
          <div className="flex justify-between items-end mb-3 sm:mb-5 md:mb-8">
            <div>
              <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Celebrate Every Moment
              </span>

              <h2 className="mt-1 text-base min-[480px]:text-lg sm:text-2xl md:text-3xl font-bold text-on-surface">
                Gifts For Every Occasion
              </h2>

              <p className="mt-1 text-[11px] sm:text-sm text-on-surface-variant">
                Thoughtful gifts for every celebration
              </p>
            </div>
          </div>

          {/* Occasion Cards */}
          <div className="relative">
            <div
              ref={occasionCarouselRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => {
                const container = occasionCarouselRef.current;

                if (!container) return;

                isDraggingOccasions.current = true;
                occasionDragStartX.current = e.pageX;
                occasionScrollStart.current = container.scrollLeft;

                container.style.cursor = "grabbing";
              }}
              onMouseMove={(e) => {
                if (!isDraggingOccasions.current) return;

                const container = occasionCarouselRef.current;

                if (!container) return;

                const distance = e.pageX - occasionDragStartX.current;

                container.scrollLeft = occasionScrollStart.current - distance;
              }}
              onMouseUp={() => {
                isDraggingOccasions.current = false;

                if (occasionCarouselRef.current) {
                  occasionCarouselRef.current.style.cursor = "grab";
                }
              }}
              onMouseLeave={() => {
                isDraggingOccasions.current = false;

                if (occasionCarouselRef.current) {
                  occasionCarouselRef.current.style.cursor = "grab";
                }
              }}
            >
              {giftOccasions
                .filter((occasion) => occasion.published)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((occasion) => (
                  <Link
                    key={occasion.id}
                    href={occasion.redirectUrl}
                    className="group relative overflow-hidden rounded-2xl bg-surface border border-outline-variant shadow-sm hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[145px] sm:w-[190px] md:w-[210px] lg:w-[220px] snap-start"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={occasion.image}
                        alt={occasion.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Premium Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                      {/* Occasion Content */}
                      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 md:p-4">
                        <h3 className="text-[11px] sm:text-sm md:text-base font-bold text-white leading-tight line-clamp-2">
                          {occasion.name}
                        </h3>

                        <p className="mt-1 text-[9px] sm:text-[11px] text-white/80 line-clamp-2">
                          {occasion.description}
                        </p>

                        <div className="mt-2 inline-flex items-center text-[9px] sm:text-[11px] font-semibold text-white">
                          Shop Now
                          <span className="material-symbols-outlined text-[12px] sm:text-[15px] ml-0.5 transition-transform duration-300 group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        </div>
                      </div>

                      {/* Top Glow */}
                      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                    </div>
                  </Link>
                ))}
            </div>

            {/* LEFT BUTTON */}
            <button
              type="button"
              onClick={() => {
                occasionCarouselRef.current?.scrollBy({
                  left: -320,
                  behavior: "smooth",
                });
              }}
              className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg border border-outline-variant items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all"
              aria-label="Previous occasions"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>

            {/* RIGHT BUTTON */}
            <button
              type="button"
              onClick={() => {
                occasionCarouselRef.current?.scrollBy({
                  left: 320,
                  behavior: "smooth",
                });
              }}
              className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg border border-outline-variant items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all"
              aria-label="Next occasions"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>
      {/* Bestsellers Section */}
      <section className="pb-5 sm:pb-8 md:pb-16">
        <div className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between items-end mb-2.5 sm:mb-4 md:mb-8">
            <div>
              <h2 className="text-base min-[480px]:text-lg sm:text-2xl md:text-3xl font-bold text-on-surface">
                Our Bestsellers
              </h2>

              <p className="text-[11px] sm:text-sm text-on-surface-variant">
                Handpicked gifts loved by thousands
              </p>
            </div>

            <Link
              href="/products/bestsellers"
              className="text-primary font-medium text-xs sm:text-sm flex items-center hover:underline"
            >
              View All{" "}
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] ml-0.5">
                chevron_right
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                key={product.title}
                href={`/products/${createProductSlug(product)}`}
                onClick={(e) => {
                  // Agar child button ne navigation prevent ki hai,
                  // to selected product ko change mat karo.
                  if (e.defaultPrevented) {
                    return;
                  }

                  try {
                    sessionStorage.setItem(
                      "selected-product",
                      JSON.stringify({
                        title: product.title,
                        productName: product.title,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        badge: product.badge,
                        rating: product.rating,
                      }),
                    );
                  } catch (error) {
                    console.error("Failed to save selected product:", error);
                  }
                }}
                className="group bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all product-card-hover border border-outline-variant duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                    />

                    {product.badge && (
                      <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-primary text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {product.badge}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(product, e)}
                      aria-label="Toggle Wishlist"
                      className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-colors"
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] sm:text-[20px] ${
                          wishlist.some(
                            (item) => item?.productName === product.title,
                          )
                            ? "text-red-500"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {wishlist.some(
                          (item) => item?.productName === product.title,
                        )
                          ? "favorite"
                          : "favorite_border"}
                      </span>
                    </button>

                    {/* Desktop Hover Overlay */}
                    <div className="hidden md:block absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold shadow-lg hover:bg-primary/90 transition-colors"
                        >
                          Add to Cart
                        </button>

                        <button
                          onClick={(e) => handleBuyNow(e, product)}
                          className="flex-1 bg-on-surface text-white py-2 rounded-lg text-xs font-semibold shadow-lg hover:bg-primary transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 sm:p-4">
                    <h3 className="text-xs sm:text-base md:text-[18px] font-bold text-on-surface line-clamp-1 mb-0.5">
                      {product.title}
                    </h3>

                    <p className="text-[10px] sm:text-sm text-on-surface-variant line-clamp-1 mb-1 sm:mb-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-base font-bold text-primary">
                        {product.price}
                      </span>

                      <div className="flex items-center text-primary">
                        <span
                          className="material-symbols-outlined text-[12px] sm:text-[16px]"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          star
                        </span>

                        <span className="text-[10px] sm:text-xs text-on-surface-variant ml-0.5 font-medium">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="px-2 pb-2 pt-0 flex md:hidden gap-1.5">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex-1 bg-primary text-white py-1 rounded-md text-[10px] font-semibold active:scale-95 transition-transform"
                  >
                    Cart
                  </button>

                  <button
                    onClick={(e) => handleBuyNow(e, product)}
                    className="flex-1 bg-on-surface text-white py-1 rounded-md text-[10px] font-semibold active:scale-95 transition-transform"
                  >
                    Buy
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gift for Every Feeling Section */}
      <section className="pb-5 sm:pb-8 md:pb-16">
        <div className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between items-end mb-2.5 sm:mb-4 md:mb-8">
            <div>
              <h2 className="text-base min-[480px]:text-lg sm:text-2xl md:text-3xl font-bold text-on-surface">
                Gift for Every Feeling
              </h2>

              <p className="text-[11px] sm:text-sm text-on-surface-variant">
                Find the perfect gift for every emotion
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {giftFeelings.map((feeling) => (
              <Link
                key={feeling.name}
                href={feeling.href}
                className="group bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all product-card-hover border border-outline-variant duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={feeling.image}
                      alt={feeling.name}
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-2 sm:p-4">
                      <h3 className="text-xs sm:text-base md:text-[18px] font-bold text-white line-clamp-1">
                        {feeling.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-2 sm:p-4">
                    <p className="text-[10px] sm:text-sm text-on-surface-variant line-clamp-1 mb-1 sm:mb-2">
                      {feeling.desc}
                    </p>

                    <span className="inline-flex items-center text-primary text-[10px] sm:text-sm font-semibold group-hover:underline">
                      Shop Now
                      <span className="material-symbols-outlined text-[12px] sm:text-[16px] ml-0.5 transition-transform group-hover:translate-x-0.5">
                        chevron_right
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-6 sm:py-16 hero-gradient border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-4 text-center">
          <span className="material-symbols-outlined text-primary text-2xl sm:text-4xl mb-1 sm:mb-3 block">
            mail
          </span>

          <h2 className="text-lg sm:text-3xl font-bold text-on-surface mb-1.5 sm:mb-3">
            Join our Petal Circle
          </h2>

          <p className="text-[11px] sm:text-base text-on-surface-variant max-w-xl mx-auto mb-3 sm:mb-6">
            Get exclusive access to new seasonal launches and a special 15%
            discount on your first gift.
          </p>

          <form className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
            <input
              className="flex-1 bg-white border border-outline-variant px-4 py-2 sm:py-3 rounded-full text-xs sm:text-sm outline-none focus:border-primary transition-all"
              placeholder="Your email address"
              type="email"
            />

            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="px-5 py-2 sm:py-3 bg-primary text-white rounded-full text-xs sm:text-sm font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
