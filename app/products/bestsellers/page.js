"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";

const LOCAL_WISHLIST_KEY = "local-wishlist";

/*
  Temporary frontend bestseller data.

  Backend connect hone ke baad:
  GET /api/products/bestsellers
  se ye data replace kiya ja sakta hai.
*/
const bestsellerProducts = [
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

const createProductSlug = (product) => {
  const source =
    product?.slug ||
    product?.title ||
    product?.id ||
    product?._id ||
    "product";

  const slug = String(source)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    slug ||
    `product-${String(
      product?.id ?? product?._id ?? "item",
    )}`
  );
};

export default function BestsellersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setUser(getStoredUser());

    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("rpetals-auth-changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("rpetals-auth-changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem(
        LOCAL_WISHLIST_KEY,
      );

      if (!storedWishlist) {
        setWishlist([]);
        return;
      }

      const parsedWishlist = JSON.parse(storedWishlist);

      setWishlist(
        Array.isArray(parsedWishlist)
          ? parsedWishlist
          : [],
      );
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error,
      );

      setWishlist([]);
    }
  }, []);

  const saveSelectedProduct = (product) => {
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

      return true;
    } catch (error) {
      console.error(
        "Failed to save selected product:",
        error,
      );

      return false;
    }
  };

  const handleProductClick = (product) => {
    const saved = saveSelectedProduct(product);

    if (!saved) {
      return;
    }

    router.push(
      `/products/${createProductSlug(product)}`,
    );
  };

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    const saved = saveSelectedProduct(product);

    if (!saved) {
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

    router.push(
      `/products/${createProductSlug(product)}`,
    );
  };

  const handleBuyNow = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    const saved = saveSelectedProduct(product);

    if (!saved) {
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

    router.push(
      `/products/${createProductSlug(product)}?action=buynow`,
    );
  };

  const handleWishlistToggle = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const storedWishlist =
        localStorage.getItem(
          LOCAL_WISHLIST_KEY,
        );

      const currentWishlist = storedWishlist
        ? JSON.parse(storedWishlist)
        : [];

      const safeWishlist = Array.isArray(
        currentWishlist,
      )
        ? currentWishlist
        : [];

      const productId = String(
        product?.id ??
          product?._id ??
          product?.productId ??
          product?.title ??
          "",
      );

      const productName =
        product?.title ??
        product?.productName ??
        "";

      const existingIndex =
        safeWishlist.findIndex(
          (item) =>
            String(
              item?.productId ??
                item?.id ??
                item?.productName ??
                "",
            ) === productId ||
            item?.productName === productName,
        );

      let updatedWishlist;

      if (existingIndex >= 0) {
        updatedWishlist =
          safeWishlist.filter(
            (_, index) =>
              index !== existingIndex,
          );
      } else {
        updatedWishlist = [
          ...safeWishlist,
          {
            productId,
            productName,
            categoryName:
              product?.categoryName ??
              product?.category ??
              "Flowers",
            image:
              product?.image ??
              product?.images?.[0] ??
              "",
            price:
              product?.price ??
              product?.salePrice ??
              product?.currentPrice ??
              0,
            selectedChoice:
              product?.selectedChoice ??
              "",
            addedAt:
              new Date().toISOString(),
          },
        ];
      }

      localStorage.setItem(
        LOCAL_WISHLIST_KEY,
        JSON.stringify(updatedWishlist),
      );

      setWishlist(updatedWishlist);
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error,
      );
    }
  };

  const isWishlisted = (product) => {
    return wishlist.some(
      (item) =>
        item?.productName === product?.title,
    );
  };

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Page Header */}
      <section className="pt-6 sm:pt-8 md:pt-12 pb-5 sm:pb-8">
        <div className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant">
              <Link
                href="/"
                className="hover:text-primary transition-colors"
              >
                Home
              </Link>

              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>

              <span className="text-primary font-medium">
                Our Bestsellers
              </span>
            </div>

            <div className="mt-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface">
                Our Bestsellers
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm md:text-base text-on-surface-variant">
                Handpicked gifts loved by thousands
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="pb-8 sm:pb-12 md:pb-16">
        <div className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {bestsellerProducts.map((product) => {
              const wishlisted =
                isWishlisted(product);

              return (
                <Link
                  key={product.title}
                  href={`/products/${createProductSlug(product)}`}
                  onClick={(event) => {
                    if (event.defaultPrevented) {
                      return;
                    }

                    saveSelectedProduct(product);
                  }}
                  className="group bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-outline-variant flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-primary text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {product.badge}
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        type="button"
                        onClick={(event) =>
                          handleWishlistToggle(
                            event,
                            product,
                          )
                        }
                        className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        aria-label={
                          wishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        <span
                          className={`material-symbols-outlined text-[14px] sm:text-[20px] ${
                            wishlisted
                              ? "text-red-500"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {wishlisted
                            ? "favorite"
                            : "favorite_border"}
                        </span>
                      </button>

                      {/* Desktop Actions */}
                      <div className="hidden md:block absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            type="button"
                            onClick={(event) =>
                              handleAddToCart(
                                event,
                                product,
                              )
                            }
                            className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold shadow-lg hover:bg-primary/90 transition-colors"
                          >
                            Add to Cart
                          </button>

                          <button
                            type="button"
                            onClick={(event) =>
                              handleBuyNow(
                                event,
                                product,
                              )
                            }
                            className="flex-1 bg-on-surface text-white py-2 rounded-lg text-xs font-semibold shadow-lg hover:bg-primary transition-colors"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-4">
                      <h2 className="text-xs sm:text-base md:text-[18px] font-bold text-on-surface line-clamp-1 mb-0.5">
                        {product.title}
                      </h2>

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
                              fontVariationSettings:
                                "'FILL' 1",
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

                  {/* Mobile Actions */}
                  <div className="px-2 pb-2 pt-0 flex md:hidden gap-1.5">
                    <button
                      type="button"
                      onClick={(event) =>
                        handleAddToCart(
                          event,
                          product,
                        )
                      }
                      className="flex-1 bg-primary text-white py-1 rounded-md text-[10px] font-semibold active:scale-95 transition-transform"
                    >
                      Cart
                    </button>

                    <button
                      type="button"
                      onClick={(event) =>
                        handleBuyNow(
                          event,
                          product,
                        )
                      }
                      className="flex-1 bg-on-surface text-white py-1 rounded-md text-[10px] font-semibold active:scale-95 transition-transform"
                    >
                      Buy
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}