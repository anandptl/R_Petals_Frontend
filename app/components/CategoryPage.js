"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* =========================================================
   STORAGE KEYS
========================================================= */

const LOCAL_CART_KEY = "local-cart";
const LOCAL_WISHLIST_KEY = "wishlist";
const SELECTED_PRODUCT_KEY = "selected-product";

/* =========================================================
   PRICE SCROLLER
========================================================= */

function PriceScroller({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  minLimit,
  maxLimit,
  step,
}) {
  const trackRef = useRef(null);
  const [draggingHandle, setDraggingHandle] =
    useState(null);

  const range = Math.max(
    1,
    maxLimit - minLimit
  );

  const toPercent = (value) => {
    const percent =
      ((value - minLimit) / range) * 100;

    return Math.min(
      Math.max(percent, 0),
      100
    );
  };

  const snapValue = (value) => {
    const snapped =
      Math.round(
        (value - minLimit) / step
      ) *
        step +
      minLimit;

    return Math.min(
      Math.max(snapped, minLimit),
      maxLimit
    );
  };

  const getValueFromClientX = (
    clientX
  ) => {
    const track = trackRef.current;

    if (!track) {
      return minLimit;
    }

    const rect =
      track.getBoundingClientRect();

    if (!rect.width) {
      return minLimit;
    }

    let percent =
      (clientX - rect.left) /
      rect.width;

    percent = Math.min(
      Math.max(percent, 0),
      1
    );

    const rawValue =
      minLimit + percent * range;

    return snapValue(rawValue);
  };

  const updateHandle = (
    handle,
    value
  ) => {
    const nextValue =
      snapValue(value);

    if (handle === "min") {
      const nextMin = Math.min(
        Math.max(
          nextValue,
          minLimit
        ),
        maxPrice - step
      );

      setMinPrice(nextMin);
    } else {
      const nextMax = Math.max(
        Math.min(
          nextValue,
          maxLimit
        ),
        minPrice + step
      );

      setMaxPrice(nextMax);
    }
  };

  const handlePointerDown =
    (handle) => (event) => {
      event.preventDefault();
      event.stopPropagation();

      setDraggingHandle(handle);

      try {
        trackRef.current?.setPointerCapture(
          event.pointerId
        );
      } catch {
        // Safe to ignore.
      }
    };

  const handleTrackPointerDown = (
    event
  ) => {
    const value =
      getValueFromClientX(
        event.clientX
      );

    const nearestHandle =
      Math.abs(value - minPrice) <=
      Math.abs(value - maxPrice)
        ? "min"
        : "max";

    setDraggingHandle(
      nearestHandle
    );

    try {
      trackRef.current?.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Safe to ignore.
    }

    updateHandle(
      nearestHandle,
      value
    );
  };

  const handlePointerMove = (
    event
  ) => {
    if (!draggingHandle) {
      return;
    }

    const value =
      getValueFromClientX(
        event.clientX
      );

    updateHandle(
      draggingHandle,
      value
    );
  };

  const handlePointerUp = (
    event
  ) => {
    setDraggingHandle(null);

    try {
      trackRef.current?.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Safe to ignore.
    }
  };

  const handleKeyDown =
    (handle) => (event) => {
      const currentValue =
        handle === "min"
          ? minPrice
          : maxPrice;

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();

        updateHandle(
          handle,
          currentValue + step
        );
      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();

        updateHandle(
          handle,
          currentValue - step
        );
      }

      if (event.key === "Home") {
        event.preventDefault();

        updateHandle(
          handle,
          handle === "min"
            ? minLimit
            : minPrice + step
        );
      }

      if (event.key === "End") {
        event.preventDefault();

        updateHandle(
          handle,
          handle === "max"
            ? maxLimit
            : maxPrice - step
        );
      }
    };

  const minPercent =
    toPercent(minPrice);

  const maxPercent =
    toPercent(maxPrice);

  return (
    <div className="pt-2 pb-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-on-surface">
          Select Price Range
        </h2>

        {(minPrice > minLimit ||
          maxPrice < maxLimit) && (
          <button
            type="button"
            onClick={() => {
              setMinPrice(minLimit);
              setMaxPrice(maxLimit);
            }}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div
        ref={trackRef}
        onPointerDown={
          handleTrackPointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerUp
        }
        onPointerCancel={
          handlePointerUp
        }
        className="relative h-7 mb-1 cursor-pointer select-none"
        style={{
          touchAction: "none",
        }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-outline-variant pointer-events-none" />

        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary pointer-events-none"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* MIN HANDLE */}

        <div
          role="slider"
          tabIndex={0}
          aria-label="Minimum price"
          aria-valuemin={minLimit}
          aria-valuemax={maxLimit}
          aria-valuenow={minPrice}
          onPointerDown={handlePointerDown(
            "min"
          )}
          onKeyDown={handleKeyDown(
            "min"
          )}
          className={`
            absolute top-1/2
            w-5 h-5
            rounded-full
            bg-surface
            border-[2.5px]
            border-primary
            shadow-sm
            -translate-y-1/2
            -translate-x-1/2
            cursor-grab
            transition-transform
            duration-150
            focus:outline-none
            focus:ring-2
            focus:ring-primary/40
            ${
              draggingHandle === "min"
                ? "scale-125 cursor-grabbing shadow-md z-20"
                : "hover:scale-110 z-10"
            }
          `}
          style={{
            left: `${minPercent}%`,
            touchAction: "none",
          }}
        />

        {/* MAX HANDLE */}

        <div
          role="slider"
          tabIndex={0}
          aria-label="Maximum price"
          aria-valuemin={minLimit}
          aria-valuemax={maxLimit}
          aria-valuenow={maxPrice}
          onPointerDown={handlePointerDown(
            "max"
          )}
          onKeyDown={handleKeyDown(
            "max"
          )}
          className={`
            absolute top-1/2
            w-5 h-5
            rounded-full
            bg-surface
            border-[2.5px]
            border-primary
            shadow-sm
            -translate-y-1/2
            -translate-x-1/2
            cursor-grab
            transition-transform
            duration-150
            focus:outline-none
            focus:ring-2
            focus:ring-primary/40
            ${
              draggingHandle === "max"
                ? "scale-125 cursor-grabbing shadow-md z-20"
                : "hover:scale-110 z-10"
            }
          `}
          style={{
            left: `${maxPercent}%`,
            touchAction: "none",
          }}
        />
      </div>

      <div className="flex items-center justify-between px-0.5">
        <span className="text-sm font-bold text-primary">
          ₹
          {minPrice.toLocaleString(
            "en-IN"
          )}
        </span>

        <span className="text-sm font-bold text-primary">
          ₹
          {maxPrice.toLocaleString(
            "en-IN"
          )}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   CATEGORY PAGE
========================================================= */

export default function CategoryPage({
  category,
}) {
  const router = useRouter();

  const {
    headline,
    description,
    subCategories = [],
    filterTypes = [],
    filterLabel = "Flower Type",
    occasions = [],
    products = [],
  } = category || {};

  /* =======================================================
     CONSTANTS
  ======================================================= */

  const MIN_LIMIT = 500;
  const MAX_LIMIT = 10000;
  const PRICE_STEP = 50;
  const PRODUCTS_PER_PAGE = 9;

  /* =======================================================
     STATES
  ======================================================= */

  const [
    activeSub,
    setActiveSub,
  ] = useState(
    subCategories?.[0]?.name || ""
  );

  const [
    selectedTypes,
    setSelectedTypes,
  ] = useState([]);

  const [
    activeOccasion,
    setActiveOccasion,
  ] = useState("");

  const [
    mobileFilterOpen,
    setMobileFilterOpen,
  ] = useState(false);

  const [
    minPrice,
    setMinPrice,
  ] = useState(MIN_LIMIT);

  const [
    maxPrice,
    setMaxPrice,
  ] = useState(MAX_LIMIT);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    wishlistIds,
    setWishlistIds,
  ] = useState([]);

  /* =======================================================
     HELPERS
  ======================================================= */

  const getProductId = (
    product
  ) => {
    return String(
      product?.id ??
        product?._id ??
        product?.productId ??
        product?.sku ??
        product?.title ??
        ""
    );
  };

  const getProductPrice = (
    product
  ) => {
    if (!product) {
      return 0;
    }

    const rawPrice =
      product.price ??
      product.salePrice ??
      product.currentPrice ??
      product.amount ??
      product.productPrice ??
      product.totalPrice ??
      0;

    if (
      typeof rawPrice ===
        "number" &&
      Number.isFinite(rawPrice)
    ) {
      return rawPrice;
    }

    const numericPrice =
      Number(
        String(rawPrice).replace(
          /[^0-9.]/g,
          ""
        )
      );

    return Number.isFinite(
      numericPrice
    )
      ? numericPrice
      : 0;
  };

  const getProductType = (
    product
  ) => {
    return String(
      product?.flowerType ??
        product?.flower_type ??
        product?.type ??
        product?.flower ??
        ""
    )
      .trim()
      .toLowerCase();
  };

  const getProductOccasions = (
    product
  ) => {
    const value =
      product?.occasion ??
      product?.occasions ??
      product?.event ??
      "";

    if (Array.isArray(value)) {
      return value
        .map((item) =>
          String(item)
            .trim()
            .toLowerCase()
        )
        .filter(Boolean);
    }

    if (
      typeof value === "string"
    ) {
      return value
        .split(",")
        .map((item) =>
          item
            .trim()
            .toLowerCase()
        )
        .filter(Boolean);
    }

    return [];
  };

  const getProductSubCategories =
    (product) => {
      const value =
        product?.subCategory ??
        product?.subcategory ??
        product?.sub_category ??
        product?.subCategories ??
        product?.subcategories ??
        "";

      if (Array.isArray(value)) {
        return value
          .map((item) =>
            String(item)
              .trim()
              .toLowerCase()
          )
          .filter(Boolean);
      }

      if (
        typeof value === "string"
      ) {
        return value
          .split(",")
          .map((item) =>
            item
              .trim()
              .toLowerCase()
          )
          .filter(Boolean);
      }

      return value
        ? [
            String(value)
              .trim()
              .toLowerCase(),
          ]
        : [];
    };

  const createProductSlug = (
    product
  ) => {
    const source =
      product?.slug ||
      product?.title ||
      product?.id ||
      product?._id ||
      "product";

    const slug = String(source)
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /[^a-z0-9-]/g,
        ""
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );

    return (
      slug ||
      `product-${String(
        product?.id ??
          product?._id ??
          "item"
      )}`
    );
  };

  /* =======================================================
     LOAD WISHLIST
  ======================================================= */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          LOCAL_WISHLIST_KEY
        );

      if (!stored) {
        return;
      }

      const parsed =
        JSON.parse(stored);

      if (
        Array.isArray(parsed)
      ) {
        setWishlistIds(
          parsed.map((item) =>
            String(
              item?.id ??
                item?._id ??
                item
            )
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );

      setWishlistIds([]);
    }
  }, []);

  /* =======================================================
     FLOWER TYPE
  ======================================================= */

  const handleTypeToggle = (
    type
  ) => {
    setSelectedTypes(
      (previous) =>
        previous.includes(type)
          ? previous.filter(
              (item) =>
                item !== type
            )
          : [
              ...previous,
              type,
            ]
    );
  };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const handleClearAll = () => {
    setSelectedTypes([]);
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setActiveOccasion("");
    setCurrentPage(1);
  };

  /* =======================================================
     SELECT PRODUCT
     
     IMPORTANT:
     This is the frontend bridge for Option B.
     
     We save the complete clicked product before navigating
     to the clean /products/[slug] URL.
  ======================================================= */

  const openProduct = (
    product
  ) => {
    try {
      const selectedProduct = {
        ...product,

        id:
          product?.id ??
          product?._id ??
          product?.productId ??
          null,

        _id:
          product?._id ??
          product?.id ??
          product?.productId ??
          null,

        title:
          product?.title ||
          "Product",

        productName:
          product?.productName ||
          product?.title ||
          "Product",

        categoryName:
          product?.categoryName ||
          category?.name ||
          headline ||
          "",

        price:
          getProductPrice(
            product
          ),

        productPrice:
          getProductPrice(
            product
          ),

        image:
          product?.image ||
          product?.images?.[0] ||
          "",
      };

      sessionStorage.setItem(
        SELECTED_PRODUCT_KEY,
        JSON.stringify(
          selectedProduct
        )
      );
    } catch (error) {
      console.error(
        "Failed to cache selected product:",
        error
      );
    }

    router.push(
      `/products/${createProductSlug(
        product
      )}`
    );
  };

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = (
    event,
    product
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      router.push(
        "/login?redirect=/cart"
      );
      return;
    }

    try {
      const stored =
        localStorage.getItem(
          LOCAL_CART_KEY
        );

      let cart = [];

      try {
        cart = stored
          ? JSON.parse(stored)
          : [];
      } catch {
        cart = [];
      }

      if (!Array.isArray(cart)) {
        cart = [];
      }

      const productId =
        getProductId(product);

      const productPrice =
        getProductPrice(product);

      const existingIndex =
        cart.findIndex(
          (item) =>
            String(
              item?.id ??
                item?._id ??
                ""
            ) ===
              productId &&
            !item?.isAddon
        );

      if (
        existingIndex !== -1
      ) {
        const existing =
          cart[existingIndex];

        const quantity =
          Math.max(
            1,
            Number(
              existing?.quantity
            ) || 1
          ) + 1;

        const price =
          Number(
            existing?.price ??
              existing?.productPrice ??
              productPrice
          ) ||
          productPrice;

        cart[
          existingIndex
        ] = {
          ...existing,

          id:
            existing?.id ||
            productId,

          title:
            existing?.title ||
            product?.title ||
            "Product",

          productName:
            existing?.productName ||
            product?.title ||
            "Product",

          image:
            existing?.image ||
            product?.image ||
            "",

          price,

          productPrice:
            existing?.productPrice ??
            price,

          addons:
            Array.isArray(
              existing?.addons
            )
              ? existing.addons
              : [],

          addonsTotal:
            Number(
              existing?.addonsTotal
            ) || 0,

          quantity,

          totalPrice:
            price * quantity,
        };
      } else {
        cart.push({
          id:
            productId ||
            `local-${Date.now()}`,

          title:
            product?.title ||
            "Product",

          productName:
            product?.title ||
            "Product",

          categoryName:
            product?.categoryName ||
            category?.name ||
            headline ||
            "",

          image:
            product?.image ||
            product?.images?.[0] ||
            "",

          price:
            productPrice,

          productPrice:
            productPrice,

          choice: {
            count: 1,
            label: "",
            description:
              product?.description ||
              "",
            price:
              productPrice,
          },

          addons: [],

          addonsTotal: 0,

          totalPrice:
            productPrice,

          quantity: 1,

          pincode: "",

          city: "",

          deliveryDate: "",

          action: "cart",

          createdAt:
            new Date().toISOString(),
        });
      }

      localStorage.setItem(
        LOCAL_CART_KEY,
        JSON.stringify(cart)
      );

      router.push("/cart");
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );
    }
  };

  /* =======================================================
     WISHLIST
  ======================================================= */

  const handleWishlistToggle = (
    event,
    product
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const productId =
        getProductId(product);

      if (!productId) {
        return;
      }

      const stored =
        localStorage.getItem(
          LOCAL_WISHLIST_KEY
        );

      let wishlist = [];

      try {
        wishlist = stored
          ? JSON.parse(stored)
          : [];
      } catch {
        wishlist = [];
      }

      if (!Array.isArray(wishlist)) {
        wishlist = [];
      }

      const exists =
        wishlist.some(
          (item) =>
            String(
              item?.id ??
                item?._id ??
                item
            ) === productId
        );

      let nextWishlist;

      if (exists) {
        nextWishlist =
          wishlist.filter(
            (item) =>
              String(
                item?.id ??
                  item?._id ??
                  item
              ) !== productId
          );
      } else {
        nextWishlist = [
          ...wishlist,
          {
            id: productId,

            title:
              product?.title ||
              "Product",

            productName:
              product?.title ||
              "Product",

            image:
              product?.image ||
              "",

            price:
              getProductPrice(
                product
              ),
          },
        ];
      }

      localStorage.setItem(
        LOCAL_WISHLIST_KEY,
        JSON.stringify(
          nextWishlist
        )
      );

      setWishlistIds(
        nextWishlist.map(
          (item) =>
            String(
              item?.id ??
                item?._id ??
                item
            )
        )
      );
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error
      );
    }
  };

  /* =======================================================
     ACTIVE FILTER
  ======================================================= */

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    minPrice > MIN_LIMIT ||
    maxPrice < MAX_LIMIT ||
    activeOccasion !== "";

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts =
    useMemo(() => {
      const normalizedSub =
        String(activeSub || "")
          .trim()
          .toLowerCase();

      const normalizedTypes =
        selectedTypes.map(
          (item) =>
            String(item)
              .trim()
              .toLowerCase()
        );

      const normalizedOccasion =
        String(
          activeOccasion || ""
        )
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          /* ---------------------------------------------
             SUB CATEGORY
          --------------------------------------------- */

          if (normalizedSub) {
            const productSubs =
              getProductSubCategories(
                product
              );

            /*
             * If product has sub-category data,
             * selected sub-category must match.
             *
             * If product does not have that field yet,
             * we keep it visible to avoid breaking
             * existing frontend data.
             */
            if (
              productSubs.length >
              0
            ) {
              if (
                !productSubs.includes(
                  normalizedSub
                )
              ) {
                return false;
              }
            }
          }

          /* ---------------------------------------------
             PRICE
          --------------------------------------------- */

          const price =
            getProductPrice(
              product
            );

          if (
            price < minPrice ||
            price > maxPrice
          ) {
            return false;
          }

          /* ---------------------------------------------
             FLOWER TYPE
          --------------------------------------------- */

          if (
            normalizedTypes.length >
            0
          ) {
            const productType =
              getProductType(
                product
              );

            const typeMatches =
              normalizedTypes.some(
                (type) =>
                  type ===
                  productType
              );

            if (!typeMatches) {
              return false;
            }
          }

          /* ---------------------------------------------
             OCCASION
          --------------------------------------------- */

          if (
            normalizedOccasion
          ) {
            const productOccasions =
              getProductOccasions(
                product
              );

            if (
              !productOccasions.includes(
                normalizedOccasion
              )
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      products,
      activeSub,
      selectedTypes,
      activeOccasion,
      minPrice,
      maxPrice,
    ]);

  /* =======================================================
     RESET PAGINATION WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeSub,
    selectedTypes,
    activeOccasion,
    minPrice,
    maxPrice,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredProducts.length /
          PRODUCTS_PER_PAGE
      )
    );

  const safeCurrentPage =
    Math.min(
      Math.max(
        currentPage,
        1
      ),
      totalPages
    );

  const paginatedProducts =
    useMemo(() => {
      const start =
        (safeCurrentPage - 1) *
        PRODUCTS_PER_PAGE;

      return filteredProducts.slice(
        start,
        start +
          PRODUCTS_PER_PAGE
      );
    }, [
      filteredProducts,
      safeCurrentPage,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="bg-background text-on-surface min-h-screen">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="w-full bg-surface border-b border-outline-variant/60 py-3 sm:py-5 md:py-6">
        <div className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-5">

            <div className="max-w-xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight mb-0.5">
                {headline}
              </h1>

              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-2">
                {description}
              </p>
            </div>

            {/* SUB CATEGORIES */}

            {subCategories.length >
              0 && (
              <div className="flex gap-2.5 sm:gap-3.5 overflow-x-auto hide-scrollbar py-1">

                {subCategories.map(
                  (sub) => {
                    const isActive =
                      activeSub ===
                      sub.name;

                    return (
                      <button
                        key={
                          sub.name
                        }
                        type="button"
                        onClick={() =>
                          setActiveSub(
                            sub.name
                          )
                        }
                        className="flex flex-col items-center min-w-[62px] sm:min-w-[72px] group cursor-pointer"
                      >
                        <div
                          className={`
                            w-12 h-12
                            sm:w-14 sm:h-14
                            rounded-full
                            p-0.5
                            mb-1
                            transition-all
                            duration-200
                            overflow-hidden
                            border-2
                            ${
                              isActive
                                ? "border-primary shadow-sm scale-105"
                                : "border-outline-variant group-hover:border-primary/50"
                            }
                          `}
                        >
                          <div
                            className="w-full h-full rounded-full bg-cover bg-center"
                            style={{
                              backgroundImage:
                                `url('${sub.image || ""}')`,
                            }}
                          />
                        </div>

                        <span
                          className={`
                            text-[10px]
                            sm:text-xs
                            text-center
                            leading-tight
                            truncate
                            w-full
                            ${
                              isActive
                                ? "text-primary font-bold"
                                : "text-on-surface-variant group-hover:text-primary"
                            }
                          `}
                        >
                          {
                            sub.name
                          }
                        </span>
                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-5 flex flex-col md:flex-row gap-4 md:gap-6 pb-20 md:pb-12">

        {/* ===================================================
            DESKTOP FILTER
        ==================================================== */}

        <aside className="hidden md:block w-64 flex-shrink-0">

          <div className="sticky top-24 bg-surface rounded-2xl border border-outline-variant p-4 shadow-sm space-y-4">

            <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/60">

              <div className="flex items-center gap-1.5 font-bold text-sm text-on-surface uppercase tracking-wider">

                <span className="material-symbols-outlined text-[18px] text-primary">
                  tune
                </span>

                Filters
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    handleClearAll
                  }
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  Reset
                </button>
              )}

            </div>

            {/* PRICE */}

            <PriceScroller
              minPrice={
                minPrice
              }
              maxPrice={
                maxPrice
              }
              setMinPrice={
                setMinPrice
              }
              setMaxPrice={
                setMaxPrice
              }
              minLimit={
                MIN_LIMIT
              }
              maxLimit={
                MAX_LIMIT
              }
              step={
                PRICE_STEP
              }
            />

            {/* FLOWER TYPE */}

            {filterTypes.length >
              0 && (
              <div className="pt-3 border-t border-outline-variant/60">

                <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  {filterLabel ||
                    "Flower Type"}
                </h2>

                <div className="flex flex-wrap gap-1.5">

                  {filterTypes.map(
                    (type) => {
                      const isSelected =
                        selectedTypes.includes(
                          type
                        );

                      return (
                        <button
                          key={
                            type
                          }
                          type="button"
                          onClick={() =>
                            handleTypeToggle(
                              type
                            )
                          }
                          className={`
                            px-2.5
                            py-1
                            rounded-lg
                            text-xs
                            font-medium
                            transition-all
                            ${
                              isSelected
                                ? "bg-primary text-white shadow-sm"
                                : "bg-surface-container-low border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                            }
                          `}
                        >
                          {
                            type
                          }
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* OCCASION */}

            {occasions.length >
              0 && (
              <div className="pt-3 border-t border-outline-variant/60">

                <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Occasion
                </h2>

                <div className="flex flex-wrap gap-1.5">

                  {occasions.map(
                    (occ) => {
                      const isSelected =
                        activeOccasion ===
                        occ;

                      return (
                        <button
                          key={
                            occ
                          }
                          type="button"
                          onClick={() =>
                            setActiveOccasion(
                              isSelected
                                ? ""
                                : occ
                            )
                          }
                          className={`
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            transition-all
                            ${
                              isSelected
                                ? "bg-primary text-white shadow-sm"
                                : "bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary"
                            }
                          `}
                        >
                          {
                            occ
                          }
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

          </div>

        </aside>

        {/* ===================================================
            PRODUCTS AREA
        ==================================================== */}

        <section className="flex-grow min-w-0">

          {/* TOOLBAR */}

          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 bg-surface p-2.5 sm:p-3 rounded-xl border border-outline-variant">

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(
                    true
                  )
                }
                className="flex md:hidden items-center gap-1 px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-bold text-on-surface active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  tune
                </span>

                Filters

                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              <span className="hidden sm:block text-xs text-on-surface-variant">
                {
                  filteredProducts.length
                }{" "}
                {filteredProducts.length ===
                1
                  ? "product"
                  : "products"}
              </span>

            </div>

          </div>

          {/* ACTIVE FILTER CHIPS */}

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">

              {minPrice >
                MIN_LIMIT && (
                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-semibold">
                  Min ₹
                  {minPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}

              {maxPrice <
                MAX_LIMIT && (
                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-semibold">
                  Max ₹
                  {maxPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}

              {selectedTypes.map(
                (type) => (
                  <span
                    key={
                      type
                    }
                    className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-semibold"
                  >
                    {
                      type
                    }
                  </span>
                )
              )}

              {activeOccasion && (
                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-semibold">
                  {
                    activeOccasion
                  }
                </span>
              )}

            </div>
          )}

          {/* PRODUCTS */}

          {filteredProducts.length >
          0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">

                {paginatedProducts.map(
                  (
                    product,
                    index
                  ) => {
                    const productKey =
                      product?.id ??
                      product?._id ??
                      product?.productId ??
                      `${product?.title || "product"}-${index}`;

                    const productId =
                      getProductId(
                        product
                      );

                    const isWishlisted =
                      wishlistIds.includes(
                        productId
                      );

                    const productTitle =
                      product?.title ||
                      "Product";

                    const productPrice =
                      getProductPrice(
                        product
                      );

                    return (
                      <article
                        key={
                          productKey
                        }
                        className="group bg-surface rounded-xl overflow-hidden border border-outline-variant hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                      >

                        {/* PRODUCT CLICK AREA */}

                        <div
                          role="link"
                          tabIndex={0}
                          onClick={() =>
                            openProduct(
                              product
                            )
                          }
                          onKeyDown={(
                            event
                          ) => {
                            if (
                              event.key ===
                                "Enter" ||
                              event.key ===
                                " "
                            ) {
                              event.preventDefault();

                              openProduct(
                                product
                              );
                            }
                          }}
                          className="cursor-pointer"
                        >

                          {/* IMAGE */}

                          <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">

                            {product?.badge && (
                              <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                {
                                  product.badge
                                }
                              </span>
                            )}

                            <div
                              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                              style={{
                                backgroundImage:
                                  `url('${product?.image || product?.images?.[0] || ""}')`,
                              }}
                            />

                            {/* WISHLIST */}

                            <button
                              type="button"
                              onClick={(
                                event
                              ) =>
                                handleWishlistToggle(
                                  event,
                                  product
                                )
                              }
                              className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-sm"
                              aria-label={
                                isWishlisted
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                            >
                              <span
                                className="material-symbols-outlined text-[16px] sm:text-[18px]"
                                style={{
                                  fontVariationSettings:
                                    isWishlisted
                                      ? "'FILL' 1"
                                      : "'FILL' 0",
                                }}
                              >
                                favorite
                              </span>
                            </button>

                          </div>

                          {/* PRODUCT INFO */}

                          <div className="p-2 sm:p-3">

                            <h3 className="text-xs sm:text-sm md:text-base font-bold text-on-surface line-clamp-1 leading-tight mb-0.5">
                              {
                                productTitle
                              }
                            </h3>

                            <p className="text-[10px] sm:text-xs text-on-surface-variant line-clamp-1 mb-1.5">
                              {
                                product?.description ||
                                ""
                              }
                            </p>

                            <div className="flex items-center justify-between">

                              <span className="text-xs sm:text-base font-bold text-primary">
                                ₹
                                {productPrice.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              <div className="flex items-center text-primary text-[10px] sm:text-xs">

                                <span
                                  className="material-symbols-outlined text-[13px] sm:text-[15px]"
                                  style={{
                                    fontVariationSettings:
                                      "'FILL' 1",
                                  }}
                                >
                                  star
                                </span>

                                <span className="ml-0.5 font-semibold text-on-surface-variant">
                                  {
                                    product?.rating ??
                                    "4.9"
                                  }
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                        {/* ADD TO CART */}

                        <div className="p-2 sm:p-3 pt-0">

                          <button
                            type="button"
                            onClick={(
                              event
                            ) =>
                              handleAddToCart(
                                event,
                                product
                              )
                            }
                            className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all active:scale-95"
                          >
                            Add to Cart
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

              {/* PAGINATION */}

              {totalPages >
                1 && (
                <div className="flex justify-center items-center gap-1.5 mt-6 sm:mt-8">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={
                      safeCurrentPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      )
                    }
                    aria-label="Previous page"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-outline-variant text-on-surface hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (
                      _,
                      index
                    ) =>
                      index + 1
                  ).map(
                    (page) => (
                      <button
                        key={
                          page
                        }
                        type="button"
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        aria-current={
                          page ===
                          safeCurrentPage
                            ? "page"
                            : undefined
                        }
                        className={`
                          w-8 h-8
                          sm:w-9 sm:h-9
                          rounded-lg
                          text-xs
                          font-bold
                          transition-all
                          ${
                            page ===
                            safeCurrentPage
                              ? "bg-primary text-white shadow-sm"
                              : "border border-outline-variant text-on-surface hover:border-primary hover:text-primary"
                          }
                        `}
                      >
                        {
                          page
                        }
                      </button>
                    )
                  )}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      safeCurrentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                      )
                    }
                    aria-label="Next page"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-outline-variant text-on-surface hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>

                </div>
              )}

            </>
          ) : (
            /* NO PRODUCTS */

            <div className="bg-surface border border-outline-variant rounded-2xl py-14 px-5 text-center">

              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-primary">
                  search_off
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-on-surface mb-1">
                No products found
              </h3>

              <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
                Try changing your price
                range, flower type or
                occasion.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    handleClearAll
                  }
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Clear All Filters
                </button>
              )}

            </div>
          )}

        </section>

      </main>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-[80] md:hidden"
          onClick={() =>
            setMobileFilterOpen(
              false
            )
          }
        >

          <div className="absolute inset-0 bg-black/40" />

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="absolute bottom-0 left-0 w-full bg-surface rounded-t-2xl shadow-xl p-4 max-h-[80vh] overflow-y-auto space-y-4"
          >

            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">

              <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                Filter Products
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(
                    false
                  )
                }
                className="text-xs text-on-surface-variant font-bold p-1"
              >
                ✕ Close
              </button>

            </div>

            {/* MOBILE PRICE */}

            <PriceScroller
              minPrice={
                minPrice
              }
              maxPrice={
                maxPrice
              }
              setMinPrice={
                setMinPrice
              }
              setMaxPrice={
                setMaxPrice
              }
              minLimit={
                MIN_LIMIT
              }
              maxLimit={
                MAX_LIMIT
              }
              step={
                PRICE_STEP
              }
            />

            {/* MOBILE FLOWER TYPE */}

            {filterTypes.length >
              0 && (
              <div className="pt-2 border-t border-outline-variant/60">

                <h3 className="text-xs font-bold text-on-surface mb-2">
                  {
                    filterLabel ||
                    "Flower Type"
                  }
                </h3>

                <div className="flex flex-wrap gap-1.5">

                  {filterTypes.map(
                    (type) => {
                      const isSelected =
                        selectedTypes.includes(
                          type
                        );

                      return (
                        <button
                          key={
                            type
                          }
                          type="button"
                          onClick={() =>
                            handleTypeToggle(
                              type
                            )
                          }
                          className={`
                            px-3
                            py-1
                            rounded-lg
                            text-xs
                            font-medium
                            transition-all
                            ${
                              isSelected
                                ? "bg-primary text-white shadow-sm"
                                : "bg-surface-container-low border border-outline-variant text-on-surface-variant"
                            }
                          `}
                        >
                          {
                            type
                          }
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* MOBILE OCCASION */}

            {occasions.length >
              0 && (
              <div className="pt-2 border-t border-outline-variant/60">

                <h3 className="text-xs font-bold text-on-surface mb-2">
                  Occasion
                </h3>

                <div className="flex flex-wrap gap-1.5">

                  {occasions.map(
                    (occ) => {
                      const isSelected =
                        activeOccasion ===
                        occ;

                      return (
                        <button
                          key={
                            occ
                          }
                          type="button"
                          onClick={() =>
                            setActiveOccasion(
                              isSelected
                                ? ""
                                : occ
                            )
                          }
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            transition-all
                            ${
                              isSelected
                                ? "bg-primary text-white shadow-sm"
                                : "bg-surface-container-low border border-outline-variant text-on-surface-variant"
                            }
                          `}
                        >
                          {
                            occ
                          }
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* MOBILE ACTIONS */}

            <div className="flex gap-2 pt-2 border-t border-outline-variant">

              <button
                type="button"
                onClick={
                  handleClearAll
                }
                className="flex-1 py-2.5 border border-outline-variant rounded-xl text-xs font-bold text-on-surface"
              >
                Reset All
              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(
                    false
                  )
                }
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Apply Filters
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}