"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// API: GET /api/categories/love/products — fetch Love & Romance products
const loveProducts = [
  {
    title: "Crimson Velvet Roses",
    description: "Freshly cut 24-piece bouquet",
    price: "₹1,299",
    rating: "4.9 (2k+)",
    badge: "Top Rated",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow",
  },
  {
    title: "Truffle & Tulip Duo",
    description: "Premium gifting combo",
    price: "₹2,499",
    rating: "4.8 (800)",
    badge: "Same Day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCjOOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg",
  },
  {
    title: "Rose & Chocolate Hamper",
    description: "12 roses with Belgian chocolates",
    price: "₹1,899",
    rating: "4.9 (1.5k)",
    badge: "Bestseller",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g",
  },
  {
    title: "Eternal Love Bouquet",
    description: "50 red roses grand arrangement",
    price: "₹3,499",
    rating: "5.0 (600)",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA",
  },
  {
    title: "Blushing Pink Roses",
    description: "18-piece pink rose bouquet",
    price: "₹1,099",
    rating: "4.7 (900)",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtpw8rdle6xtlfxqSRqJfH1ncbABiWakWw86cMXj1g8INXZCjx-ugi7doQoFkfdfYwjp2GAxqXN4eLud-8TFK4fXS2FvBdsOI1TUd-ebKvcYVe5J0CslW8Xrq3BLEE03Yt_1TGOOyoefYGtKBIldcRd071ugfw_T-U0VBqB4-gmdT7ecr2gdwFj3J8TJqFXSX7PmS_x7XCv3HgqOJuJxbhgUDsEd2-YT8tmo6dvZFMnhbPU-ifd2ajPw",
  },
  {
    title: "Love Letters Combo",
    description: "Roses + personalised card + candle",
    price: "₹2,199",
    rating: "4.8 (400)",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGvuLZcednIxtP7LvNDWh-M8j9yfFteRp7hlRekUe0b9dQV5Y_nXAAsr816jwS4NbeQ03kNVexoIPuOS4pN4eZrbVudqrfd8PDDYWyK36V8QLU_ksx-NulJT5M6IIsiS5tL5Z_thyHUyMlHu0z5qMaZyReqaylfuoLkcIkgVQXkybnGgB60SIWQp03LEt1Fzj6MeASn_uPgPhlGlC3HFSMntIsfTSwZIaVsWf-LXoSyHhbRB97AJoYaQ",
  },
];

const filterChips = [
  "All",
  "Roses",
  "Combos",
  "Hampers",
  "Same Day Delivery",
  "Under ₹1500",
];

export default function LoveRomancePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  // Add To Cart
  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/cart");
      return;
    }

    router.push("/cart");
  };

  // Buy Now
  const handleBuyNow = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  // Product card entrance animation
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
      {
        threshold: 0.1,
      },
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

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background text-on-surface min-h-screen w-full overflow-x-hidden">
      {/* =========================================================
          BREADCRUMB
      ========================================================= */}
      <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-5 lg:pt-6">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm text-on-surface-variant overflow-hidden">
          <Link
            href="/"
            className="hover:text-primary transition-colors flex-shrink-0"
          >
            Home
          </Link>

          <span className="material-symbols-outlined text-[13px] sm:text-[15px] flex-shrink-0">
            chevron_right
          </span>

          <span className="text-on-surface font-medium truncate">
            Love & Romance
          </span>
        </div>
      </div>

      {/* =========================================================
          HERO BANNER
      ========================================================= */}
      <section className="pt-3 sm:pt-4 md:pt-6">
        <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          <div
            className="
              relative
              overflow-hidden
              rounded-xl
              sm:rounded-2xl
              min-h-[190px]
              sm:min-h-[220px]
              md:min-h-[260px]
              lg:min-h-[300px]
              xl:min-h-[320px]
              bg-surface-container
              shadow-lg
            "
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow')",
              }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* Hero Content */}
            <div
              className="
                relative
                z-10
                min-h-[190px]
                sm:min-h-[220px]
                md:min-h-[260px]
                lg:min-h-[300px]
                xl:min-h-[320px]
                flex
                items-center
                px-4
                sm:px-7
                md:px-10
                lg:px-12
              "
            >
              <div className="max-w-[92%] sm:max-w-lg">
                {/* Category Badge */}
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-2.5
                    sm:px-3
                    py-1
                    bg-primary
                    text-white
                    rounded-full
                    text-[9px]
                    sm:text-xs
                    font-semibold
                    mb-2
                    sm:mb-3
                  "
                >
                  <span className="material-symbols-outlined text-[13px] sm:text-[15px]">
                    favorite
                  </span>
                  Love & Romance
                </span>

                {/* Heading */}
                <h1
                  className="
                    text-2xl
                    min-[400px]:text-3xl
                    sm:text-4xl
                    md:text-5xl
                    lg:text-5xl
                    font-bold
                    text-white
                    mb-2
                    leading-tight
                  "
                >
                  Say It With Roses
                </h1>

                {/* Description */}
                <p
                  className="
                    text-[11px]
                    min-[400px]:text-xs
                    sm:text-sm
                    md:text-base
                    text-white/85
                    max-w-[280px]
                    sm:max-w-sm
                    leading-relaxed
                  "
                >
                  Curated bouquets & hampers to woo the one you love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FILTER CHIPS
      ========================================================= */}
      <section className="py-4 sm:py-5 md:py-6">
        <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          <div
            className="
              flex
              gap-2
              sm:gap-2.5
              overflow-x-auto
              hide-scrollbar
              pb-1
              -mx-1
              px-1
            "
          >
            {filterChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(chip)}
                className={`
                  flex-shrink-0
                  px-3
                  sm:px-3.5
                  md:px-4
                  py-1.5
                  sm:py-2
                  rounded-full
                  text-[11px]
                  sm:text-xs
                  md:text-sm
                  font-medium
                  border
                  transition-all
                  whitespace-nowrap
                  touch-manipulation
                  ${
                    activeFilter === chip
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                  }
                `}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT SECTION
      ========================================================= */}
      <section className="pb-10 sm:pb-14 lg:pb-20">
        <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          {/* Result Count */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
            <p className="text-xs sm:text-sm text-on-surface-variant">
              {loveProducts.length} gifts found
            </p>
          </div>

          {/* =====================================================
              RESPONSIVE PRODUCT GRID

              Mobile  : 2 columns
              Tablet  : 3 columns
              Desktop : 4 columns
          ===================================================== */}
          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              min-[400px]:gap-3
              sm:gap-4
              md:grid-cols-3
              lg:grid-cols-4
              lg:gap-5
              xl:gap-6
            "
          >
            {loveProducts.map((product) => {
              const productSlug = product.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              return (
                <div
                  key={product.title}
                  className="
                    group
                    bg-surface
                    rounded-xl
                    sm:rounded-2xl
                    overflow-hidden
                    border
                    border-outline-variant
                    shadow-sm
                    hover:shadow-lg
                    transition-all
                    duration-300
                    product-card-hover
                    flex
                    flex-col
                    min-w-0
                  "
                >
                  {/* =================================================
                      PRODUCT IMAGE AREA
                  ================================================= */}
                  <Link href={`/products/${productSlug}`} className="block">
                    <div
                      className="
                        relative
                        aspect-square
                        overflow-hidden
                        bg-surface-container-low
                      "
                    >
                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />

                      {/* Product Badge */}
                      {product.badge && (
                        <div
                          className="
                            absolute
                            top-1.5
                            left-1.5
                            sm:top-2
                            sm:left-2
                            lg:top-3
                            lg:left-3
                            bg-primary
                            text-white
                            text-[8px]
                            min-[400px]:text-[9px]
                            sm:text-[10px]
                            font-bold
                            px-1.5
                            sm:px-2
                            py-0.5
                            sm:py-1
                            rounded
                            uppercase
                            tracking-wide
                          "
                        >
                          {product.badge}
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="
                          absolute
                          top-1.5
                          right-1.5
                          sm:top-2
                          sm:right-2
                          lg:top-3
                          lg:right-3
                          w-7
                          h-7
                          sm:w-8
                          sm:h-8
                          lg:w-10
                          lg:h-10
                          rounded-full
                          bg-white/85
                          backdrop-blur-sm
                          flex
                          items-center
                          justify-center
                          text-on-surface-variant
                          hover:text-primary
                          transition-colors
                          touch-manipulation
                        "
                        aria-label="Add to Wishlist"
                      >
                        <span
                          className="
                            material-symbols-outlined
                            text-[16px]
                            sm:text-[18px]
                            lg:text-[20px]
                          "
                        >
                          favorite
                        </span>
                      </button>

                      {/* =================================================
                          DESKTOP HOVER ACTIONS
                      ================================================= */}
                      <div
                        className="
                          hidden
                          md:block
                          absolute
                          bottom-0
                          left-0
                          right-0
                          p-2
                          lg:p-3
                          bg-gradient-to-t
                          from-black/50
                          to-transparent
                          translate-y-full
                          group-hover:translate-y-0
                          transition-transform
                          duration-300
                        "
                      >
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            className="
                              flex-1
                              bg-primary
                              text-white
                              py-2
                              lg:py-2.5
                              rounded-lg
                              text-[10px]
                              lg:text-xs
                              font-semibold
                              shadow-lg
                              hover:bg-primary/90
                              transition-colors
                            "
                          >
                            Add to Cart
                          </button>

                          <button
                            type="button"
                            onClick={handleBuyNow}
                            className="
                              flex-1
                              bg-on-surface
                              text-white
                              py-2
                              lg:py-2.5
                              rounded-lg
                              text-[10px]
                              lg:text-xs
                              font-semibold
                              shadow-lg
                              hover:bg-primary
                              transition-colors
                            "
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}
                    <div
                      className="
                        p-2
                        min-[400px]:p-2.5
                        sm:p-3
                        lg:p-4
                      "
                    >
                      {/* Title */}
                      <h3
                        className="
                          text-[11px]
                          min-[400px]:text-xs
                          sm:text-sm
                          lg:text-base
                          xl:text-[17px]
                          font-bold
                          text-on-surface
                          line-clamp-1
                          mb-1
                        "
                      >
                        {product.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="
                          text-[10px]
                          min-[400px]:text-[11px]
                          sm:text-xs
                          lg:text-sm
                          text-on-surface-variant
                          line-clamp-1
                          mb-1.5
                          sm:mb-2
                        "
                      >
                        {product.description}
                      </p>

                      {/* Price + Rating */}
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-1
                        "
                      >
                        {/* Price */}
                        <span
                          className="
                            text-xs
                            min-[400px]:text-sm
                            sm:text-base
                            lg:text-lg
                            font-bold
                            text-primary
                          "
                        >
                          {product.price}
                        </span>

                        {/* Rating */}
                        <div
                          className="
                            flex
                            items-center
                            min-w-0
                            text-primary
                          "
                        >
                          <span
                            className="
                              material-symbols-outlined
                              text-[12px]
                              sm:text-[14px]
                              lg:text-[16px]
                            "
                            style={{
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            star
                          </span>

                          <span
                            className="
                              text-[9px]
                              min-[400px]:text-[10px]
                              sm:text-xs
                              text-on-surface-variant
                              ml-0.5
                              font-medium
                              truncate
                            "
                          >
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* =================================================
                      MOBILE ACTION BUTTONS
                  ================================================= */}
                  <div
                    className="
                      flex
                      md:hidden
                      gap-1.5
                      px-2
                      min-[400px]:px-2.5
                      pb-2
                      min-[400px]:pb-2.5
                    "
                  >
                    {/* Cart */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="
                        flex-1
                        min-w-0
                        bg-primary
                        text-white
                        py-1.5
                        min-[400px]:py-2
                        rounded-lg
                        text-[10px]
                        min-[400px]:text-[11px]
                        font-semibold
                        active:scale-95
                        transition-transform
                        touch-manipulation
                      "
                    >
                      Cart
                    </button>

                    {/* Buy */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="
                        flex-1
                        min-w-0
                        bg-on-surface
                        text-white
                        py-1.5
                        min-[400px]:py-2
                        rounded-lg
                        text-[10px]
                        min-[400px]:text-[11px]
                        font-semibold
                        active:scale-95
                        transition-transform
                        touch-manipulation
                      "
                    >
                      Buy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
