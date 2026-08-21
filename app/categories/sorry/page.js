"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// API: GET /api/categories/sorry/products — fetch Sorry products
const sorryProducts = [
  {
    title: "Soft Apology Bouquet",
    description: "White & lavender roses, 15-piece",
    price: "₹1,049",
    rating: "4.8 (720)",
    badge: "Top Rated",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow",
  },
  {
    title: "I'm Sorry Chocolate Combo",
    description: "Roses with premium chocolate box",
    price: "₹1,299",
    rating: "4.7 (540)",
    badge: "Same Day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg",
  },
  {
    title: "Forgive Me Hamper",
    description: "White lilies, card & scented candle",
    price: "₹1,699",
    rating: "4.9 (410)",
    badge: "Bestseller",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g",
  },
  {
    title: "Gentle Apology Plant",
    description: "Peace lily with sorry note card",
    price: "₹749",
    rating: "4.6 (290)",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA",
  },
  {
    title: "Pastel Sorry Bouquet",
    description: "Mixed pastel flowers, 18-piece",
    price: "₹1,149",
    rating: "4.7 (255)",
    badge: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtpw8rdle6xtlfxqSRqJfH1ncbABiWakWw86cMXj1g8INXZCjx-ugi7doQoFkfdfYwjp2GAxqXN4eLud-8TFK4fXS2FvBdsOI1TUd-ebKvcYVe5J0CslW8Xrq3BLEE03Yt_1TGOOyoefYGtKBIldcRd071ugfw_T-U0VBqB4-gmdT7ecr2gdwFj3J8TJqFXSX7PmS_x7XCv3HgqOJuJxbhgUDsEd2-YT8tmo6dvZFMnhbPU-ifd2ajPw",
  },
  {
    title: "Make Up Combo",
    description: "Roses, teddy & personalised card",
    price: "₹1,549",
    rating: "4.8 (210)",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGvuLZcednIxtP7LvNDWh-M8j9yfFteRp7hlRekUe0b9dQV5Y_nXAAsr816jwS4NbeQ03kNVexoIPuOS4pN4eZrbVudqrfd8PDDYWyK36V8QLU_ksx-NulJT5M6IIsiS5tL5Z_thyHUyMlHu0z5qMaZyReqaylfuoLkcIkgVQXkybnGgB60SIWQp03LEt1Fzj6MeASn_uPgPhlGlC3HFSMntIsfTSwZIaVsWf-LXoSyHhbRB97AJoYaQ",
  },
];

const filterChips = [
  "All",
  "Flowers",
  "Combos",
  "Plants",
  "Same Day Delivery",
  "Under ₹1200",
];

export default function SorryPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/cart");
      return;
    }

    router.push("/cart");
  };

  const handleBuyNow = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  useEffect(() => {
    const cards = document.querySelectorAll(".product-card-hover");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(
                "opacity-100",
                "translate-y-0"
              );

              entry.target.classList.remove(
                "opacity-0",
                "translate-y-8"
              );
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => {
      card.classList.add(
        "opacity-0",
        "translate-y-8",
        "transition-all",
        "duration-500"
      );

      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-background text-on-surface min-h-screen w-full overflow-x-hidden">

      {/* =========================
          BREADCRUMB
      ========================= */}
      <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-5 md:pt-6">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm text-on-surface-variant min-w-0">

          <Link
            href="/"
            className="hover:text-primary transition-colors flex-shrink-0"
          >
            Home
          </Link>

          <span className="material-symbols-outlined text-[13px] sm:text-[14px] flex-shrink-0">
            chevron_right
          </span>

          <span className="text-on-surface font-medium truncate">
            Sorry
          </span>

        </div>
      </div>

      {/* =========================
          HERO BANNER
      ========================= */}
      <section className="pt-3 sm:pt-4 md:pt-6">
        <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6">

          <div
            className="
              relative
              w-full
              overflow-hidden
              rounded-xl
              sm:rounded-2xl
              min-h-[190px]
              sm:min-h-[220px]
              md:min-h-[260px]
              lg:min-h-[290px]
              xl:min-h-[310px]
              bg-surface-container
              shadow-lg
            "
          >

            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtpw8rdle6xtlfxqSRqJfH1ncbABiWakWw86cMXj1g8INXZCjx-ugi7doQoFkfdfYwjp2GAxqXN4eLud-8TFK4fXS2FvBdsOI1TUd-ebKvcYVe5J0CslW8Xrq3BLEE03Yt_1TGOOyoefYGtKBIldcRd071ugfw_T-U0VBqB4-gmdT7ecr2gdwFj3J8TJqFXSX7PmS_x7XCv3HgqOJuJxbhgUDsEd2-YT8tmo6dvZFMnhbPU-ifd2ajPw')",
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

            {/* Hero Content */}
            <div
              className="
                relative
                z-10
                min-h-[190px]
                sm:min-h-[220px]
                md:min-h-[260px]
                lg:min-h-[290px]
                xl:min-h-[310px]
                flex
                items-center
                px-4
                min-[400px]:px-5
                sm:px-8
                md:px-10
                lg:px-12
              "
            >
              <div className="w-full max-w-[92%] sm:max-w-lg">

                {/* Badge */}
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
                    min-[400px]:text-[10px]
                    sm:text-xs
                    font-semibold
                    mb-2
                    sm:mb-3
                  "
                >
                  <span className="material-symbols-outlined text-[13px] sm:text-[14px]">
                    sentiment_dissatisfied
                  </span>

                  Sorry
                </span>

                {/* Heading */}
                <h1
                  className="
                    text-2xl
                    min-[400px]:text-[27px]
                    sm:text-3xl
                    md:text-4xl
                    lg:text-[42px]
                    font-bold
                    text-white
                    mb-1.5
                    sm:mb-2
                    leading-tight
                  "
                >
                  Say Sorry With Soft Blooms
                </h1>

                {/* Description */}
                <p
                  className="
                    text-[11px]
                    min-[400px]:text-xs
                    sm:text-sm
                    md:text-base
                    text-white/85
                    max-w-[285px]
                    sm:max-w-sm
                    leading-relaxed
                  "
                >
                  Gentle gestures to mend hearts and start fresh again.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FILTER CHIPS
      ========================= */}
      <section className="py-4 sm:py-5 md:py-6">
        <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6">

          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-2.5
              overflow-x-auto
              hide-scrollbar
              pb-1
              min-w-0
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
                  min-[400px]:px-3.5
                  sm:px-4
                  py-1.5
                  sm:py-2
                  rounded-full
                  text-[11px]
                  min-[400px]:text-xs
                  sm:text-sm
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

      {/* =========================
          PRODUCT GRID
      ========================= */}
      <section className="pb-10 sm:pb-14 md:pb-16">
        <div className="w-full max-w-container-max mx-auto px-3 sm:px-4 md:px-6">

          {/* Result Count */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
            <p className="text-xs sm:text-sm text-on-surface-variant">
              {sorryProducts.length} gifts found
            </p>
          </div>

          {/* 
            Mobile  : 2 columns
            Tablet  : 3 columns
            Desktop : 4 columns
          */}
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
            {sorryProducts.map((product) => {
              const productSlug = product.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              return (
                <article
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
                    duration-500
                    product-card-hover
                    flex
                    flex-col
                    min-w-0
                  "
                >

                  {/* =========================
                      PRODUCT LINK
                  ========================= */}
                  <Link
                    href={`/products/${productSlug}`}
                    className="block min-w-0"
                  >

                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        aspect-square
                        overflow-hidden
                        bg-surface-container-low
                      "
                    >

                      <img
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div
                          className="
                            absolute
                            top-1.5
                            left-1.5
                            min-[400px]:top-2
                            min-[400px]:left-2
                            sm:top-3
                            sm:left-3
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
                            max-w-[65%]
                            truncate
                          "
                        >
                          {product.badge}
                        </div>
                      )}

                      {/* Wishlist */}
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
                          min-[400px]:top-2
                          min-[400px]:right-2
                          sm:top-3
                          sm:right-3
                          w-7
                          h-7
                          min-[400px]:w-8
                          min-[400px]:h-8
                          sm:w-10
                          sm:h-10
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
                            text-[15px]
                            min-[400px]:text-[17px]
                            sm:text-[20px]
                          "
                        >
                          favorite
                        </span>
                      </button>

                      {/* =========================
                          DESKTOP HOVER ACTIONS
                      ========================= */}
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
                              min-w-0
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
                              whitespace-nowrap
                            "
                          >
                            Add to Cart
                          </button>

                          <button
                            type="button"
                            onClick={handleBuyNow}
                            className="
                              flex-1
                              min-w-0
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
                              whitespace-nowrap
                            "
                          >
                            Buy Now
                          </button>

                        </div>
                      </div>
                    </div>

                    {/* PRODUCT INFORMATION */}
                    <div
                      className="
                        p-2
                        min-[400px]:p-2.5
                        sm:p-3
                        lg:p-4
                        min-w-0
                      "
                    >

                      {/* Title */}
                      <h3
                        className="
                          text-[11px]
                          min-[400px]:text-xs
                          sm:text-sm
                          lg:text-base
                          xl:text-[18px]
                          font-bold
                          text-on-surface
                          line-clamp-1
                          mb-0.5
                          sm:mb-1
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
                          min-w-0
                        "
                      >

                        <span
                          className="
                            text-xs
                            min-[400px]:text-sm
                            sm:text-base
                            lg:text-lg
                            font-bold
                            text-primary
                            flex-shrink-0
                          "
                        >
                          {product.price}
                        </span>

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
                              min-[400px]:text-[13px]
                              sm:text-[16px]
                              flex-shrink-0
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

                  {/* =========================
                      MOBILE ACTION BUTTONS
                  ========================= */}
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

                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}