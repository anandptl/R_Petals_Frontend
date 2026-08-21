"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Suspense,
} from "react";

import Link from "next/link";
import {
  getAccessToken,
  getStoredUser,
  initializeAuthSession,
} from "@/lib/auth";


const SELECTED_PRODUCT_KEY = "selected-product";

const PENDING_ACTION_KEY = "pdp-pending-action";

const LOCAL_CART_KEY = "local-cart";

const LOCAL_WISHLIST_KEY = "local-wishlist";

/* =========================================================
   DEFAULT ADDONS
========================================================= */

const defaultAddons = [
  {
    id: "classic-truffles",
    title: "Classic Truffles (12pc)",
    price: 899,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqAjmbgZaICtdtT8Rp5Fvs3YZYFU15ZTOZts6wItYjZ4HsBnN-marCdWNOCYNNHTax9RYwJxOi60QrqIazKF-Tre3JXyhPoqY0EL09Pd7ms1qnr1LdXl1EK1FLzQ2YM31xOlp3A0PKSihlynggVh1r6pDx9WDb5Kk-RcSo5j7Ov_aKW5hz7bSrWTS3kzHJAB2ZLMuSbQpkgE63j-3PLlUInYNEvWYlLNw7XC3BdlYAjj2x1tcLiOm6xmg",
  },
  {
    id: "cream-teddy",
    title: "Cream Teddy Bear",
    price: 499,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1FnJKpd28sZpGXko-oaup_oZC8nlwuH-yDZRO3y8KbmCjB734qHt_ofLGhNI-qFRfqNl2lfFbxCeLBl__jJ1nd4Pwr9mY7eKfESGaFB_yba5zRotfxS0Fy-JYlqXE9Zt388rVkwhiMigza9oUXfQ8NBurq-z9S0q0oyla54JsDH-ddiKf0FsqKlhHVHa0D22yeceDyg9JSS78QfxXtucLMlOSluuVWTnAe4oInXKrPxnU7_f1Zcpldg",
  },
  {
    id: "designer-gold-vase",
    title: "Designer Gold Vase",
    price: 1299,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-cCi-IgT58SzGFVDO7hq68BxD9HRAkbGQydRegVEdokuu_B6IemDFlSOaqJ_LAcfYdD-lWm5NviazBuH_sHweXeRojY7cXcbG3k9xdV7T-9C3Nzg_3wtbpygpgk4QWyi8h-_IyrNWz64K0Dh42M9f8sftRnZRRPV78HJlq2HATjdGz4yviWsqQvlgtfNDCprJiDTA3ewXuSCreXym6IYgDAlT6TSuDXJV3RMXC1gu-ebqSJQWxLB9w",
  },
  {
    id: "festive-balloons",
    title: "Festive Balloons",
    price: 299,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNaC3HxKMXLL4019YGJwCaBu1oV9a0lDKgt6Zc-YA54sRPccFE3LS2vHDCbOzbGBzBiIj_QKrKZpgbaLuFhggYdEMYz32peoe9KrSdZRLMmZJ3UE1frbnDgiuvVNgepJCNjO8F9xOKsTcu60j22YAW4Wq6knlfG-TFCXGGmdlhb6v3GpNfd0HGxbH23UeBULw_C-SG3oUwDuCwn_WFjlqyjcQ1AWV8HSZjzYzcLSHDfqDSH9TBRd08Uw",
  },
];

/* =========================================================
   DEFAULT PRODUCT IMAGES
========================================================= */

const defaultThumbnails = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBIPPeLJGfJhzGG74widG5HFece0nyOAmqtUPrxWJ1NcB_26_No74FYUvGX8jLk5awkxA0ftRgl5Ku4VYbXpKS06S7Ya0avFo0xYrQGhKJHrfnK1NKxL1WtzM3c-C4ROXjwlw8LGmZc2jaS_WnjsRXevTCw-vxSa25d-cV6Q60ZIkRvEUUr3q7zmYXEFdK59Bo-eiLZCoEdPVqYf9CSmwAUDnNBJaKZeAFmgn67WikguO3fhQDDvQBLXQ",

  "https://lh3.googleusercontent.com/aida-public/AB6AXuAcPzxx46V34pi3O8LuXaGKK5cW0ff8NR5Yx6duGGx5IIVelsro7QHbT-vijAcSQ8P_gF8gA6LOgMf-UG31FrR8cjEfHJuTT7261ZHbF4BRbAuyVkk4uSyhdFYjKiU42UsskAWtm0xp00rQ72dxxARUVowtWj5o7aO2A8_gnfqqD0VuU9jxw2lQLg-4ZTHKTJQAUneTjdwy3nXysTfh-htJ5RLYg1BBNlVIgq1vQgw5N7gQRURlxVeNYw",

  "https://lh3.googleusercontent.com/aida-public/AB6AXuDRSXppwvMCPlDSahPizujIqR9IzYPk-J5aOZbcRrjBQMAe0s-md0xTg_MU8r1FgjjAK_9RSEW9qLWgg1oKJYicdkxAMgmJRz2USXjt_0c6I_U3rjNjbxi73rUuSrgplWXUN9MXj_3t9BTGUI73BuAwCtOH3LVgOSBFu9a5f0vNghks8iPzEgSeWoGrwEhlXrWYwiEyUYKGv18CJQfqklCCoGNK-d0_TuL02xXJW5CtwYvTTYaT7b5fGw",
];

/* =========================================================
   DEFAULT CHOICES
========================================================= */

const defaultChoicePrices = [
  {
    count: "15",
    price: 1999,
    originalPrice: 2399,
    saveAmount: 400,
  },
  {
    count: "20",
    price: 2499,
    originalPrice: 2999,
    saveAmount: 500,
  },
  {
    count: "25",
    price: 2999,
    originalPrice: 3599,
    saveAmount: 600,
  },
];

/* =========================================================
   TABS
========================================================= */

const tabs = [
  {
    id: "description",
    label: "Description",
  },
  {
    id: "delivery",
    label: "Delivery Info",
  },
  {
    id: "care",
    label: "Care Instructions",
  },
  {
    id: "reviews",
    label: "Reviews (124)",
  },
];

/* =========================================================
   STORAGE HELPERS
========================================================= */

const readStorage = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);

    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (error) {
    console.error(`Failed to write ${key}:`, error);

    return false;
  }
};

/* =========================================================
   DATE HELPERS
========================================================= */

const formatLocalDateInput = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTodayDateString = () => formatLocalDateInput(new Date());

const getTomorrowDateString = () => {
  const date = new Date();

  date.setDate(date.getDate() + 1);

  return formatLocalDateInput(date);
};

const getMinLaterDate = () => {
  const date = new Date();

  date.setDate(date.getDate() + 2);

  return formatLocalDateInput(date);
};

/* =========================================================
   SAFE NUMBER
========================================================= */

const toNumber = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(String(value ?? "").replace(/[^0-9.]/g, ""));

  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeImageSource = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    return String(
      value?.url ||
        value?.src ||
        value?.image ||
        value?.imageUrl ||
        value?.thumbnail ||
        "",
    ).trim();
  }

  return "";
};

/* =========================================================
   PRODUCT DETAIL
========================================================= */

function ProductDetailContent() {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);

  /* =======================================================
     AUTH SESSION
     Keep this page on the same centralized auth flow used by
     Admin/storefront pages: access token -> refresh token ->
     auth-changed event. Logout is handled centrally by Header.
  ======================================================= */
  useEffect(() => {
    let mounted = true;

    const syncUser = () => {
      if (mounted) {
        setUser(getStoredUser());
      }
    };

    syncUser();

    const handleAuthChanged = () => syncUser();

    window.addEventListener("rpetals-auth-changed", handleAuthChanged);
    window.addEventListener("storage", handleAuthChanged);

    const token = getAccessToken();
    if (token) {
      initializeAuthSession()
        .then(syncUser)
        .catch(() => syncUser());
    }

    return () => {
      mounted = false;
      window.removeEventListener("rpetals-auth-changed", handleAuthChanged);
      window.removeEventListener("storage", handleAuthChanged);
    };
  }, []);

  /* =======================================================
     SELECTED PRODUCT FROM CATEGORY
  ======================================================= */

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productLoaded, setProductLoaded] = useState(false);

  /* =======================================================
     READ SELECTED PRODUCT
  ======================================================= */

 useEffect(() => {
  setProductLoaded(false);

  try {
    const raw = sessionStorage.getItem(SELECTED_PRODUCT_KEY);

    if (!raw) {
      setSelectedProduct(null);
      return;
    }

    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object") {
      setSelectedProduct(parsed);
    } else {
      setSelectedProduct(null);
    }
  } catch (error) {
    console.error("Failed to load selected product:", error);
    setSelectedProduct(null);
  } finally {
    setProductLoaded(true);
  }
}, [pathname, searchParams.toString()]);
  /* =======================================================
     PRODUCT NAME
  ======================================================= */

  const productName =
    selectedProduct?.title ||
    selectedProduct?.productName ||
    searchParams.get("name") ||
    "Exquisite Pink Lily & Rose Bouquet";

  /* =======================================================
     CATEGORY
  ======================================================= */

  const categoryName =
    selectedProduct?.categoryName ||
    selectedProduct?.category ||
    searchParams.get("category") ||
    "Flowers";

  /* =======================================================
     DESCRIPTION
  ======================================================= */

  const productDescription =
    selectedProduct?.description ||
    "Beautifully arranged fresh flowers, curated for special moments.";

  /* =======================================================
     PRODUCT BASE PRICE
  ======================================================= */

  const productBasePrice = toNumber(
    selectedProduct?.price ??
      selectedProduct?.salePrice ??
      selectedProduct?.currentPrice,
    2499,
  );

  /* =======================================================
     PRODUCT ID
  ======================================================= */

  const productId = String(
    selectedProduct?.id ??
      selectedProduct?._id ??
      selectedProduct?.productId ??
      productName,
  );

  /* =======================================================
     FULL PATH
  ======================================================= */

  const fullPath = useMemo(() => {
    const qs = searchParams.toString();

    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  /* =======================================================
     ITEM TYPE
  ======================================================= */

  const itemType = useMemo(() => {
    const source = String(
      selectedProduct?.flowerType || selectedProduct?.type || productName,
    ).toLowerCase();

    if (source.includes("rose")) {
      return "Roses";
    }

    if (source.includes("lily")) {
      return "Lilies";
    }

    if (source.includes("orchid")) {
      return "Orchids";
    }

    if (source.includes("carnation")) {
      return "Carnations";
    }

    if (source.includes("cake")) {
      return "Portions";
    }

    if (source.includes("plant")) {
      return "Plants";
    }

    if (source.includes("chocolate") || source.includes("truffle")) {
      return "Pieces";
    }

    return "Stems";
  }, [selectedProduct, productName]);

  /* =======================================================
   PRODUCT IMAGES
   ======================================================= */

  const productImages = useMemo(() => {
    const possibleImages = Array.isArray(selectedProduct?.images)
      ? selectedProduct.images
      : [];

    const combined = [...possibleImages, selectedProduct?.image]
      .map(normalizeImageSource)
      .filter(Boolean);

    const unique = Array.from(new Set(combined));

    return unique.length > 0 ? unique : defaultThumbnails;
  }, [selectedProduct]);

  /* =======================================================
     ADDONS
  ======================================================= */

  const addons = useMemo(() => {
    const source = selectedProduct?.addons;

    if (Array.isArray(source) && source.length > 0) {
      return source
        .map((addon, index) => ({
          id: addon?.id ?? addon?._id ?? `addon-${index}`,

          title: addon?.title ?? addon?.name ?? "Add-on",

          price: toNumber(addon?.price, 0),

          image: addon?.image || addon?.images?.[0] || "",
        }))
        .filter((addon) => addon.price >= 0);
    }

    return defaultAddons;
  }, [selectedProduct]);

  /* =======================================================
   DYNAMIC CHOICES
   ======================================================= */

  const dynamicChoices = useMemo(() => {
    const source =
      selectedProduct?.choices ||
      selectedProduct?.variants ||
      selectedProduct?.options;

    /*
     * =====================================================
     * REAL PRODUCT CHOICES
     *
     * Every choice can have its own:
     * - count / quantity
     * - price
     * - originalPrice
     * - label
     * - description
     * - image
     *
     * Example:
     * 15 -> 15 flowers image
     * 20 -> 20 flowers image
     * 25 -> 25 flowers image
     * =====================================================
     */

    if (Array.isArray(source) && source.length > 0) {
      return source
        .map((choice, index) => {
          const count = String(
            choice?.count ?? choice?.quantity ?? choice?.qty ?? index + 1,
          );

          const price = toNumber(
            choice?.price ?? choice?.salePrice ?? choice?.currentPrice,
            productBasePrice,
          );

          const originalPrice = toNumber(
            choice?.originalPrice ?? choice?.mrp ?? choice?.compareAtPrice,
            Math.round(price * 1.2),
          );

          /*
           * IMPORTANT:
           * Choice-specific image gets highest priority.
           *
           * This means:
           * 15 -> choice.image
           * 20 -> choice.image
           * 25 -> choice.image
           *
           * If image is not directly available,
           * we try common image fields and finally
           * fall back to the product gallery image.
           */

          const choiceImage =
            normalizeImageSource(
              choice?.image ||
                choice?.images?.[0] ||
                choice?.photo ||
                choice?.thumbnail ||
                choice?.thumbnailImage,
            ) ||
            productImages[index % Math.max(productImages.length, 1)] ||
            productImages[0] ||
            defaultThumbnails[0];

          return {
            count,

            label: choice?.label || choice?.name || `${count} ${itemType}`,

            desc:
              choice?.description ||
              choice?.desc ||
              choice?.label ||
              `${count} ${itemType}`,

            price,

            originalPrice,

            saveAmount: Math.max(0, originalPrice - price),

            image: choiceImage,
          };
        })
        .filter(Boolean);
    }

    /*
     * =====================================================
     * CATEGORY PRODUCT WITH ONLY ONE NORMAL PRICE
     * =====================================================
     */

    /*
     * CATEGORY PRODUCT WITHOUT EXPLICIT CHOICES
     *
     * Show the standard 15 / 20 / 25 choices
     * using the current selected product image.
     */
    if (selectedProduct && selectedProduct.price) {
      return defaultChoicePrices.map((choice, index) => ({
        count: choice.count,

        label: `${choice.count} ${itemType}`,

        desc:
          index === 0
            ? `Standard Pack of ${choice.count} ${itemType}`
            : index === 1
              ? `Popular Pack of ${choice.count} ${itemType}`
              : `Grand Deluxe ${choice.count} ${itemType}`,

        price: choice.price,

        originalPrice: choice.originalPrice,

        saveAmount: choice.saveAmount,

        image:
          productImages[0] ||
          selectedProduct?.image ||
          defaultThumbnails[0] ||
          "",
      }));
    }

    /*
     * =====================================================
     * FALLBACK FOR DIRECT PRODUCT DETAIL URL
     *
     * Keep the original 15 / 20 / 25 choices.
     * Each choice gets its corresponding image.
     *
     * 15 -> first image
     * 20 -> second image
     * 25 -> third image
     * =====================================================
     */

    return defaultChoicePrices.map((choice, index) => ({
      count: choice.count,

      label: `${choice.count} ${itemType}`,

      desc:
        index === 0
          ? `Standard Pack of ${choice.count} ${itemType}`
          : index === 1
            ? `Popular Pack of ${choice.count} ${itemType}`
            : `Grand Deluxe ${choice.count} ${itemType}`,

      price: choice.price,

      originalPrice: choice.originalPrice,

      saveAmount: choice.saveAmount,

      image:
        productImages[index] ||
        defaultThumbnails[index] ||
        productImages[0] ||
        "",
    }));
  }, [selectedProduct, productBasePrice, itemType, productImages]);

  /* =======================================================
     DEFAULT SELECTED CHOICE
  ======================================================= */

  const defaultChoice =
    dynamicChoices.find((choice) => choice.count === "20") || dynamicChoices[0];

  /* =======================================================
     STATES
  ======================================================= */

  const [activeImage, setActiveImage] = useState("");

  const [selectedChoice, setSelectedChoice] = useState("");

  const [activeTab, setActiveTab] = useState("description");

  const [cartLoading, setCartLoading] = useState(false);

  const [cartDone, setCartDone] = useState(false);

  const [isFavorited, setIsFavorited] = useState(false);

  const [flowStep, setFlowStep] = useState(null);

  const [flowAction, setFlowAction] = useState(null);

  const [flowSource, setFlowSource] = useState("desktop");

  const [selectedDate, setSelectedDate] = useState("today");

  const [customDate, setCustomDate] = useState("");

  const [selectedAddons, setSelectedAddons] = useState([]);

  const [checkPincode, setCheckPincode] = useState("");

  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  const [availability, setAvailability] = useState(null);

  const [availabilityCity, setAvailabilityCity] = useState("");

  const [availabilityError, setAvailabilityError] = useState("");

  /* =======================================================
     INITIALIZE PRODUCT STATE
  ======================================================= */

  useEffect(() => {
    if (!productLoaded || !dynamicChoices.length) {
      return;
    }

    const initialChoice =
      dynamicChoices.find(
        (choice) => String(choice.count) === String(selectedChoice),
      ) || defaultChoice;

    if (!initialChoice) {
      return;
    }

    setSelectedChoice(String(initialChoice.count));

    if (!activeImage) {
      setActiveImage(
        normalizeImageSource(initialChoice.image) ||
          productImages[0] ||
          defaultThumbnails[0],
      );
    }
  }, [
    productLoaded,
    dynamicChoices,
    productImages,
    selectedChoice,
    defaultChoice,
    activeImage,
  ]);

  /* =======================================================
     FALLBACK IMAGE
  ======================================================= */

  useEffect(() => {
    if (!activeImage && productImages.length) {
      setActiveImage(productImages[0]);
    }
  }, [activeImage, productImages]);

  /* =======================================================
     ACTIVE PRICING
  ======================================================= */

  const activePricing = useMemo(() => {
    const matched = dynamicChoices.find(
      (choice) => choice.count === selectedChoice,
    );

    if (matched) {
      return matched;
    }

    return (
      dynamicChoices[0] || {
        price: productBasePrice,

        originalPrice: Math.round(productBasePrice * 1.2),

        saveAmount: 0,
      }
    );
  }, [dynamicChoices, selectedChoice, productBasePrice]);

  /* =======================================================
     ADDON OBJECTS
  ======================================================= */

  const selectedAddonObjects = useMemo(() => {
    return addons.filter((addon) => selectedAddons.includes(addon.id));
  }, [addons, selectedAddons]);

  /* =======================================================
     ADDON TOTAL
  ======================================================= */

  const addonsTotal = useMemo(() => {
    return selectedAddonObjects.reduce(
      (total, addon) => total + toNumber(addon.price),
      0,
    );
  }, [selectedAddonObjects]);

  /* =======================================================
     GRAND TOTAL
  ======================================================= */

  const grandTotal = useMemo(() => {
    return toNumber(activePricing.price) + addonsTotal;
  }, [activePricing.price, addonsTotal]);

  /* =======================================================
     DATE LABELS
  ======================================================= */

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  const tomorrowLabel = useMemo(() => {
    const date = new Date();

    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  const minLaterDate = useMemo(() => getMinLaterDate(), []);

  /* =======================================================
     SAME DAY DELIVERY
     
     EXISTING BUSINESS RULE:
     BEFORE 7 PM
  ======================================================= */

  const sameDayAvailable = useMemo(() => {
    const now = new Date();

    return now.getHours() < 19;
  }, []);

  /* =======================================================
     PINCODE REQUEST REFS
  ======================================================= */

  const debounceRef = useRef(null);

  const abortControllerRef = useRef(null);

  const requestIdRef = useRef(0);

  const resumedRef = useRef(false);

  /* =======================================================
     PINCODE CHECK
  ======================================================= */

  useEffect(() => {
    requestIdRef.current += 1;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();

      abortControllerRef.current = null;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);

      debounceRef.current = null;
    }

    if (checkPincode.length !== 6) {
      setAvailability(null);
      setAvailabilityCity("");
      setIsCheckingPincode(false);

      return;
    }

    setIsCheckingPincode(true);

    setAvailability(null);
    setAvailabilityCity("");
    setAvailabilityError("");

    const currentRequestId = requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();

      abortControllerRef.current = controller;

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${checkPincode}`,
          {
            method: "GET",

            signal: controller.signal,

            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Pincode API request failed");
        }

        const data = await response.json();

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (
          data?.[0]?.Status === "Success" &&
          Array.isArray(data?.[0]?.PostOffice) &&
          data[0].PostOffice.length > 0
        ) {
          const postOffices = data[0].PostOffice;

          const city =
            postOffices[0]?.Name ||
            postOffices[0]?.Block ||
            postOffices[0]?.District ||
            "";

          /*
           * EXISTING BUSINESS RULE:
           * NASHIK / NASIK ONLY
           */

          const isServiceable = postOffices.some((po) => {
            const district = String(po?.District || "")
              .trim()
              .toLowerCase();

            const block = String(po?.Block || "")
              .trim()
              .toLowerCase();

            const region = String(po?.Region || "")
              .trim()
              .toLowerCase();

            const state = String(po?.State || "")
              .trim()
              .toLowerCase();

            return (
              district === "nashik" ||
              district === "nasik" ||
              block === "nashik" ||
              block === "nasik" ||
              region === "nashik" ||
              region === "nasik" ||
              (state === "maharashtra" &&
                (district.includes("nashik") || district.includes("nasik")))
            );
          });

          setAvailabilityCity(city);

          setAvailability(isServiceable ? "available" : "unavailable");
        } else {
          setAvailability("invalid");

          setAvailabilityCity("");
        }
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        console.error("Pincode API Error:", error);

        setAvailability("error");

        setAvailabilityCity("");
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsCheckingPincode(false);
        }
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkPincode]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /* =======================================================
     SAVE PENDING ACTION
  ======================================================= */

  const savePendingAction = useCallback(
    (actionData) => {
      try {
        const payload =
          typeof actionData === "string"
            ? {
                action: actionData,
              }
            : actionData;

        const pendingData = {
          ...payload,

          path: fullPath,

          productId,

          pincode: checkPincode,

          availability,

          availabilityCity,

          selectedChoice,

          productName,

          categoryName,

          activeImage,

          price: activePricing.price,

          originalPrice: activePricing.originalPrice,

          addons: selectedAddons,

          addonsTotal,

          grandTotal,

          deliveryDate: selectedDate === "later" ? customDate : selectedDate,

          savedAt: Date.now(),
        };

        sessionStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(pendingData));
      } catch (error) {
        console.error("Failed to save pending action:", error);
      }
    },
    [
      fullPath,
      productId,
      checkPincode,
      availability,
      availabilityCity,
      selectedChoice,
      productName,
      categoryName,
      activeImage,
      activePricing.price,
      activePricing.originalPrice,
      selectedAddons,
      addonsTotal,
      grandTotal,
      selectedDate,
      customDate,
    ],
  );

  /* =======================================================
     CREATE LOCAL CART ITEM
  ======================================================= */

  const createCartItem = useCallback(
    (action) => {
      const selectedChoiceData =
        dynamicChoices.find((choice) => choice.count === selectedChoice) ||
        dynamicChoices[0];

      const addonItems = addons.filter((addon) =>
        selectedAddons.includes(addon.id),
      );

      const deliveryDate = selectedDate === "later" ? customDate : selectedDate;

      const normalizedDeliveryDate =
        deliveryDate === "today"
          ? getTodayDateString()
          : deliveryDate === "tomorrow"
            ? getTomorrowDateString()
            : deliveryDate;

      return {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

        productId,

        title: productName,

        price: grandTotal,

        productName,

        categoryName,

        image: activeImage,

        choice: {
          count: selectedChoiceData?.count || selectedChoice,

          label: selectedChoiceData?.label || "",

          description: selectedChoiceData?.desc || "",

          price: toNumber(selectedChoiceData?.price, activePricing.price),
        },

        addons: addonItems.map((addon) => ({
          id: addon.id,
          title: addon.title,
          price: addon.price,
          image: addon.image,
        })),

        productPrice: activePricing.price,

        addonsTotal,

        totalPrice: grandTotal,

        pincode: checkPincode,

        city: availabilityCity,

        deliveryDate: normalizedDeliveryDate,

        action,

        quantity: 1,

        createdAt: new Date().toISOString(),
      };
    },
    [
      dynamicChoices,
      selectedChoice,
      selectedAddons,
      selectedDate,
      customDate,
      productId,
      productName,
      categoryName,
      activeImage,
      activePricing.price,
      addonsTotal,
      grandTotal,
      checkPincode,
      availabilityCity,
    ],
  );

  /* =======================================================
     SAVE LOCAL CART
  ======================================================= */

  const saveToLocalCart = useCallback((cartItem) => {
    try {
      const currentCart = readStorage(LOCAL_CART_KEY, []);

      const safeCart = Array.isArray(currentCart) ? currentCart : [];

      const existingIndex = safeCart.findIndex(
        (item) =>
          (item.productId || item.productName) ===
            (cartItem.productId || cartItem.productName) &&
          item.choice?.count === cartItem.choice?.count &&
          item.pincode === cartItem.pincode &&
          item.deliveryDate === cartItem.deliveryDate &&
          JSON.stringify((item.addons || []).map((a) => a.id).sort()) ===
            JSON.stringify((cartItem.addons || []).map((a) => a.id).sort()),
      );

      if (existingIndex >= 0) {
        safeCart[existingIndex] = {
          ...safeCart[existingIndex],

          quantity: (safeCart[existingIndex].quantity || 1) + 1,
        };
      } else {
        safeCart.push(cartItem);
      }

      return writeStorage(LOCAL_CART_KEY, safeCart);
    } catch (error) {
      console.error("Failed to save local cart:", error);

      return false;
    }
  }, []);

  /* =======================================================
     RESUME PENDING LOGIN ACTION
  ======================================================= */

  useEffect(() => {
    if (!productLoaded || !dynamicChoices.length) {
      return;
    }

    let raw = null;

    try {
      raw = sessionStorage.getItem(PENDING_ACTION_KEY);
    } catch (error) {
      console.error("Failed to read pending action:", error);

      return;
    }

    if (!raw) {
      return;
    }

    let pending = null;

    try {
      pending = JSON.parse(raw);
    } catch (error) {
      console.error("Failed to parse pending action:", error);

      sessionStorage.removeItem(PENDING_ACTION_KEY);

      return;
    }

    /*
     * Only resume on same product.
     */
    if (pending.productId && String(pending.productId) !== String(productId)) {
      return;
    }

    if (!resumedRef.current) {
      resumedRef.current = true;

      if (pending.pincode) {
        setCheckPincode(pending.pincode);
      }

      if (pending.availability) {
        setAvailability(pending.availability);
      }

      if (pending.availabilityCity) {
        setAvailabilityCity(pending.availabilityCity);
      }

      if (pending.selectedChoice) {
        setSelectedChoice(String(pending.selectedChoice));

        const match = dynamicChoices.find(
          (choice) => String(choice.count) === String(pending.selectedChoice),
        );

        if (match?.image) {
          setActiveImage(match.image);
        } else if (productImages[0]) {
          setActiveImage(productImages[0]);
        }
      } else if (pending.activeImage) {
        const pendingImage = normalizeImageSource(pending.activeImage);

        if (pendingImage && productImages.includes(pendingImage)) {
          setActiveImage(pendingImage);
        }
      }

      if (pending.deliveryDate) {
        if (
          pending.deliveryDate === "today" ||
          pending.deliveryDate === "tomorrow"
        ) {
          setSelectedDate(pending.deliveryDate);
        } else {
          setSelectedDate("later");

          setCustomDate(pending.deliveryDate);
        }
      }

      if (Array.isArray(pending.addons)) {
        setSelectedAddons(pending.addons);
      }
    }

    /*
     * Not logged in:
     * wait for login.
     */
    if (!user) {
      return;
    }

    sessionStorage.removeItem(PENDING_ACTION_KEY);

    if (pending.action !== "orderFlow") {
      return;
    }

    const action = pending.flowAction === "cart" ? "cart" : "buynow";

    const selectedChoiceData =
      dynamicChoices.find(
        (choice) => String(choice.count) === String(pending.selectedChoice),
      ) || dynamicChoices[0];

    const pendingAddonItems = addons.filter(
      (addon) =>
        Array.isArray(pending.addons) && pending.addons.includes(addon.id),
    );

    const pendingProductPrice = toNumber(
      pending.price,
      selectedChoiceData?.price || activePricing.price,
    );

    const pendingAddonTotal = pendingAddonItems.reduce(
      (total, addon) => total + toNumber(addon.price),
      0,
    );

    const pendingDeliveryDate =
      pending.deliveryDate === "today"
        ? getTodayDateString()
        : pending.deliveryDate === "tomorrow"
          ? getTomorrowDateString()
          : pending.deliveryDate;

    const pendingCartItem = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

      productId,

      title: pending.productName || productName,

      productName: pending.productName || productName,

      price: pendingProductPrice + pendingAddonTotal,

      categoryName: pending.categoryName || categoryName,

      image: pending.activeImage || selectedChoiceData?.image || activeImage,

      choice: {
        count: pending.selectedChoice || selectedChoiceData?.count,

        label: selectedChoiceData?.label || "",

        description: selectedChoiceData?.desc || "",

        price: pendingProductPrice,
      },

      addons: pendingAddonItems.map((addon) => ({
        id: addon.id,
        title: addon.title,
        price: addon.price,
        image: addon.image,
      })),

      productPrice: pendingProductPrice,

      addonsTotal: pendingAddonTotal,

      totalPrice: pendingProductPrice + pendingAddonTotal,

      pincode: pending.pincode || "",

      city: pending.availabilityCity || "",

      deliveryDate: pendingDeliveryDate,

      action,

      quantity: 1,

      createdAt: new Date().toISOString(),
    };

    setCartLoading(true);

    const saved = saveToLocalCart(pendingCartItem);

    setTimeout(() => {
      setCartLoading(false);

      if (!saved) {
        setAvailabilityError("Unable to save your item. Please try again.");

        return;
      }

      setCartDone(true);

      setTimeout(() => {
        router.push(action === "cart" ? "/cart" : "/checkout");
      }, 400);
    }, 300);
  }, [
    productLoaded,
    dynamicChoices,
    addons,
    user,
    productId,
    productName,
    categoryName,
    activeImage,
    productImages,
    activePricing.price,
    saveToLocalCart,
    router,
  ]);

  /* =======================================================
     LOAD WISHLIST
  ======================================================= */

  useEffect(() => {
    try {
      const wishlist = readStorage(LOCAL_WISHLIST_KEY, []);

      if (
        Array.isArray(wishlist) &&
        wishlist.some(
          (item) =>
            String(item?.productId ?? item?.id ?? item?.productName) ===
              String(productId) || item?.productName === productName,
        )
      ) {
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  }, [productId, productName]);

  /* =======================================================
   SELECT CHOICE
   ======================================================= */

  const handleSelectChoice = (choice) => {
    if (!choice) {
      return;
    }

    const nextChoice = String(choice.count);

    /*
     * Save selected choice.
     */
    setSelectedChoice(nextChoice);

    /*
     * Important:
     * Selecting 15 / 20 / 25 must immediately
     * change the main product image.
     */
    if (choice.image) {
      setActiveImage(choice.image);
    }

    /*
     * Reset cart success state because
     * user has changed the product variant.
     */
    setCartDone(false);

    /*
     * Clear any old validation/error message.
     */
    setAvailabilityError("");
  };

  /* =======================================================
     VALIDATE DELIVERY DATE
  ======================================================= */

  const validateDeliveryDate = () => {
    if (selectedDate === "today") {
      if (!sameDayAvailable) {
        setAvailabilityError(
          "Same-day delivery is available only before 7 PM. Please choose Tomorrow or Later.",
        );

        setSelectedDate("tomorrow");

        return false;
      }

      return true;
    }

    if (selectedDate === "tomorrow") {
      return true;
    }

    if (selectedDate === "later") {
      if (!customDate) {
        setAvailabilityError("Please select a delivery date.");

        return false;
      }

      if (customDate < getMinLaterDate()) {
        setAvailabilityError(
          "Please select a date at least 2 days from today.",
        );

        return false;
      }

      return true;
    }

    return false;
  };

  /* =======================================================
     DESKTOP ADD TO CART
  ======================================================= */

  const handleDesktopAddToCart = () => {
    setCartDone(false);

    if (availability !== "available") {
      setAvailabilityError(
        "Please enter your pincode to check delivery availability first.",
      );

      document.getElementById("availabilitySection")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setAvailabilityError("");

    setFlowAction("cart");

    setFlowSource("desktop");

    setFlowStep("date");
  };

  /* =======================================================
     DESKTOP BUY NOW
  ======================================================= */

  const handleDesktopBuyNow = () => {
    setCartDone(false);

    if (availability !== "available") {
      setAvailabilityError(
        "Please enter your pincode to check delivery availability first.",
      );

      document.getElementById("availabilitySection")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setAvailabilityError("");

    setFlowAction("buynow");

    setFlowSource("desktop");

    setFlowStep("date");
  };

  /* =======================================================
     MOBILE FLOW
  ======================================================= */

  const handleMobileStartFlow = (action) => {
    setCartDone(false);

    setFlowAction(action);

    setFlowSource("mobile");

    setAvailabilityError("");

    setFlowStep(availability === "available" ? "date" : "pincode");
  };

  /* =======================================================
     RESET FLOW
  ======================================================= */

  const resetFlow = () => {
    setFlowStep(null);

    setFlowAction(null);

    setFlowSource("desktop");

    setAvailabilityError("");
  };

  /* =======================================================
     FINALIZE FLOW
  ======================================================= */

  const finalizeFlow = () => {
    setAvailabilityError("");

    if (availability !== "available") {
      setAvailabilityError("Please check delivery availability first.");

      setFlowStep("pincode");

      return;
    }

    if (!validateDeliveryDate()) {
      return;
    }

    const action = flowAction === "cart" ? "cart" : "buynow";

    const deliveryDate = selectedDate === "later" ? customDate : selectedDate;

    /*
     * NOT LOGGED IN
     */

    if (!user) {
      savePendingAction({
        action: "orderFlow",

        flowAction: action,

        deliveryDate,

        addons: selectedAddons,
      });

      resetFlow();

      router.push(`/login?redirect=${encodeURIComponent(fullPath)}`);

      return;
    }

    /*
     * LOGGED IN
     */

    setCartLoading(true);

    const cartItem = createCartItem(action);

    const saved = saveToLocalCart(cartItem);

    resetFlow();

    setTimeout(() => {
      setCartLoading(false);

      if (!saved) {
        setAvailabilityError("Unable to save your item. Please try again.");

        return;
      }

      setCartDone(true);

      setTimeout(() => {
        router.push(action === "cart" ? "/cart" : "/checkout");
      }, 400);
    }, 300);
  };

  /* =======================================================
     WISHLIST
  ======================================================= */

  const handleWishlistToggle = () => {
    const wishlist = readStorage(LOCAL_WISHLIST_KEY, []);

    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

    const existingIndex = safeWishlist.findIndex(
      (item) =>
        String(item?.productId ?? item?.id ?? item?.productName) ===
          String(productId) || item?.productName === productName,
    );

    if (existingIndex >= 0) {
      safeWishlist.splice(existingIndex, 1);

      setIsFavorited(false);
    } else {
      safeWishlist.push({
        productId,

        productName,

        categoryName,

        image: activeImage,

        price: activePricing.price,

        selectedChoice,

        addedAt: new Date().toISOString(),
      });

      setIsFavorited(true);
    }

    writeStorage(LOCAL_WISHLIST_KEY, safeWishlist);
  };

  /* =======================================================
     CATEGORY SLUG
  ======================================================= */

  const categorySlug = useMemo(() => {
    return encodeURIComponent(
      categoryName.trim().toLowerCase().replace(/\s+/g, "-"),
    );
  }, [categoryName]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (!productLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="max-w-container-max mx-auto px-4 sm:px-5 md:px-6 lg:px-lg py-3 sm:py-4 md:py-6 pb-6 md:pb-8">
      {/* =====================================================
          ORDER FLOW
      ===================================================== */}

      {flowStep && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-start md:justify-end p-0 md:p-6 md:top-16">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={resetFlow}
          />

          <div className="relative pointer-events-auto w-full md:w-[360px] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col max-h-[80vh] md:max-h-[calc(100vh-5rem)]">
            {/* =================================================
                PINCODE
            ================================================= */}

            {flowStep === "pincode" && (
              <>
                <div className="px-4 py-3.5 bg-gradient-to-r from-pink-50/80 via-white to-amber-50/50 border-b border-outline-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Step 1 of 3
                      </span>

                      <h2 className="text-sm font-bold text-on-surface">
                        Check Delivery Pincode
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetFlow}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <label
                    htmlFor="flow-pincode"
                    className="block text-xs font-semibold text-on-surface-variant"
                  >
                    Delivery Pincode
                  </label>

                  <div className="relative">
                    <input
                      id="flow-pincode"
                      value={checkPincode}
                      onChange={(e) => {
                        setCheckPincode(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        );

                        setAvailabilityError("");
                      }}
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="Enter 6-digit pincode"
                      className="w-full h-11 bg-surface-container/40 border border-outline-variant rounded-xl px-4 pr-12 outline-none text-sm tracking-[0.08em] focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />

                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCheckingPincode && (
                        <span className="block w-[18px] h-[18px] rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                      )}

                      {!isCheckingPincode && availability === "available" && (
                        <span className="material-symbols-outlined text-green-600">
                          check_circle
                        </span>
                      )}

                      {!isCheckingPincode &&
                        availability &&
                        availability !== "available" && (
                          <span className="material-symbols-outlined text-red-500">
                            error
                          </span>
                        )}
                    </div>
                  </div>

                  <div aria-live="polite">
                    {availability === "available" && (
                      <p className="text-xs font-semibold text-green-600">
                        Delivery available! We deliver to {availabilityCity}.
                      </p>
                    )}

                    {availability === "unavailable" && (
                      <p className="text-xs font-semibold text-red-500">
                        Sorry, we currently deliver only in Nashik.
                      </p>
                    )}

                    {availability === "invalid" && (
                      <p className="text-xs font-semibold text-red-500">
                        Invalid pincode.
                      </p>
                    )}

                    {availability === "error" && (
                      <p className="text-xs font-semibold text-red-500">
                        Couldn't check availability.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={availability !== "available"}
                    onClick={() => setFlowStep("date")}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* =================================================
                DATE
            ================================================= */}

            {flowStep === "date" && (
              <>
                <div className="px-4 py-3.5 bg-gradient-to-r from-pink-50/80 via-white to-amber-50/50 border-b border-outline-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        event
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {flowSource === "desktop"
                          ? "Step 1 of 2"
                          : "Step 2 of 3"}
                      </span>

                      <h2 className="text-sm font-bold text-on-surface">
                        Choose Delivery Date
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetFlow}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>

                <div className="p-4 space-y-2.5">
                  {!sameDayAvailable && (
                    <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
                      <p className="text-xs font-medium text-amber-700">
                        Same-day delivery is no longer available. Please choose
                        Tomorrow or Later.
                      </p>
                    </div>
                  )}

                  {[
                    {
                      key: "today",
                      label: "Today",
                      sub: todayLabel,
                    },
                    {
                      key: "tomorrow",
                      label: "Tomorrow",
                      sub: tomorrowLabel,
                    },
                    {
                      key: "later",
                      label: "Later",
                      sub: "Pick a custom date",
                    },
                  ].map((option) => {
                    const disabled =
                      option.key === "today" && !sameDayAvailable;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setAvailabilityError("");

                          setSelectedDate(option.key);
                        }}
                        className={`w-full flex items-center justify-between rounded-xl border-2 px-3.5 py-3 text-left ${
                          disabled
                            ? "opacity-40 cursor-not-allowed border-outline-variant"
                            : selectedDate === option.key
                              ? "border-green-600 bg-green-50/50"
                              : "border-outline-variant hover:border-green-500/60"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-bold">
                            {option.label}
                          </span>

                          <span className="block text-xs text-on-surface-variant">
                            {option.sub}
                          </span>
                        </span>

                        <span
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedDate === option.key && !disabled
                              ? "border-green-600 bg-green-600"
                              : "border-outline-variant"
                          }`}
                        />
                      </button>
                    );
                  })}

                  {selectedDate === "later" && (
                    <input
                      type="date"
                      min={minLaterDate}
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);

                        setAvailabilityError("");
                      }}
                      className="w-full h-11 border border-outline-variant rounded-xl px-3 text-sm outline-none focus:border-primary"
                    />
                  )}

                  {availabilityError && (
                    <p className="text-xs font-medium text-red-600">
                      {availabilityError}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={selectedDate === "later" && !customDate}
                    onClick={() => {
                      if (!validateDeliveryDate()) {
                        return;
                      }

                      setAvailabilityError("");

                      setFlowStep("addons");
                    }}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40"
                  >
                    Save &amp; Continue
                  </button>
                </div>
              </>
            )}

            {/* =================================================
                MAKE IT SPECIAL
            ================================================= */}

            {flowStep === "addons" && (
              <>
                <div className="px-4 py-3.5 bg-gradient-to-r from-pink-50/80 via-white to-amber-50/50 border-b border-outline-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        redeem
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {flowSource === "desktop"
                          ? "Step 2 of 2 · Make It Special"
                          : "Step 3 of 3 · Make It Special"}
                      </span>

                      <h2 className="text-sm font-bold text-on-surface">
                        Add a Personal Touch
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetFlow}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>

                <div className="p-3.5 overflow-y-auto space-y-2.5 max-h-[45vh]">
                  {addons.map((addon) => {
                    const isAdded = selectedAddons.includes(addon.id);

                    return (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl bg-surface-container/30 border border-outline-variant/40"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white">
                            {addon.image ? (
                              <img
                                src={addon.image}
                                alt={addon.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">
                                  redeem
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">
                              {addon.title}
                            </p>

                            <p className="text-xs font-bold text-primary mt-0.5">
                              ₹{toNumber(addon.price).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAddons((previous) =>
                              isAdded
                                ? previous.filter((id) => id !== addon.id)
                                : [...previous, addon.id],
                            )
                          }
                          className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                            isAdded
                              ? "bg-primary text-white border-primary"
                              : "bg-white border-primary/40 text-primary"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isAdded ? "check" : "add"}
                          </span>

                          {isAdded ? "Added" : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="px-3.5 py-2.5 border-t border-outline-variant/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Product</span>

                    <span className="font-semibold">
                      ₹{toNumber(activePricing.price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {selectedAddonObjects.length > 0 && (
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-on-surface-variant">Add-ons</span>

                      <span className="font-semibold">
                        ₹{addonsTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-outline-variant/40">
                    <span className="text-sm font-bold">Total</span>

                    <span className="text-sm font-bold text-primary">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-surface-container/20 border-t border-outline-variant/40">
                  <button
                    type="button"
                    onClick={finalizeFlow}
                    disabled={cartLoading}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {cartLoading && (
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                    )}

                    {cartLoading
                      ? "Processing..."
                      : selectedAddons.length > 0
                        ? "Continue"
                        : "Skip & Continue"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <nav className="flex items-center gap-1.5 text-on-surface-variant mb-3 md:mb-4 flex-wrap text-xs">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>

        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>

        <Link
          href={`/categories/${categorySlug}`}
          className="hover:text-primary capitalize"
        >
          {categoryName}
        </Link>

        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>

        <span className="text-on-surface font-medium truncate max-w-[180px]">
          {productName}
        </span>
      </nav>

      {/* =====================================================
          PRODUCT MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-7 xl:gap-8">
        {/* ===================================================
            GALLERY
        =================================================== */}

        <div className="lg:col-span-6 flex flex-col gap-2.5 lg:sticky lg:top-6 lg:self-start">
          <div className="aspect-[4/3] sm:aspect-square lg:aspect-[4/3] xl:aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden bg-surface-container relative group shadow-sm border border-outline-variant/30">
            {activeImage ? (
              <img
                src={activeImage || productImages[0] || defaultThumbnails[0]}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                onError={(event) => {
                  const fallbackImage =
                    productImages[0] || defaultThumbnails[0] || "";

                  if (
                    fallbackImage &&
                    event.currentTarget.src !== fallbackImage
                  ) {
                    setActiveImage(fallbackImage);
                    event.currentTarget.src = fallbackImage;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary/30">
                  image
                </span>
              </div>
            )}

            {selectedProduct?.badge && (
              <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {selectedProduct.badge}
              </div>
            )}

            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={
                isFavorited ? "Remove from wishlist" : "Add to wishlist"
              }
              className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-md w-9 h-9 md:w-10 md:h-10 rounded-full shadow-md flex items-center justify-center active:scale-90 transition-all"
            >
              <span
                className={`material-symbols-outlined ${
                  isFavorited ? "text-primary" : "text-on-surface-variant"
                }`}
                style={
                  isFavorited
                    ? {
                        fontVariationSettings: "'FILL' 1",
                      }
                    : undefined
                }
              >
                favorite
              </span>
            </button>
          </div>

          {/* THUMBNAILS */}

          <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1">
            {productImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`snap-start flex-shrink-0 w-[56px] h-[56px] sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-xl overflow-hidden border-2 ${
                  activeImage === image
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-outline-variant"
                }`}
              >
                <img
                  src={image || defaultThumbnails[0]}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    const fallbackImage = defaultThumbnails[0];

                    if (
                      fallbackImage &&
                      event.currentTarget.src !== fallbackImage
                    ) {
                      event.currentTarget.src = fallbackImage;
                    }
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================
            PRODUCT DETAILS
        ==================================================== */}

        <div className="lg:col-span-6 flex flex-col gap-3.5 md:gap-4">
          {/* HEADER */}

          <div className="border-b border-outline-variant/70 pb-3 md:pb-4">
            <h1 className="text-[21px] sm:text-[23px] md:text-3xl font-bold text-on-surface mb-2 leading-[1.15]">
              {productName}
            </h1>

            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <div className="flex items-center bg-primary-fixed px-2.5 py-1 rounded-lg">
                <span className="font-bold text-primary mr-1">
                  {selectedProduct?.rating ?? "4.8"}
                </span>

                <span
                  className="material-symbols-outlined text-[13px] text-primary"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  star
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="text-on-surface-variant text-xs hover:text-primary hover:underline"
              >
                124 Reviews
              </button>

              <span className="text-primary text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  eco
                </span>
                Fresh Delivery
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl md:text-[26px] text-primary font-bold">
                ₹{toNumber(activePricing.price).toLocaleString("en-IN")}
              </span>

              {activePricing.originalPrice > activePricing.price && (
                <span className="text-base text-on-surface-variant line-through">
                  ₹
                  {toNumber(activePricing.originalPrice).toLocaleString(
                    "en-IN",
                  )}
                </span>
              )}

              {activePricing.saveAmount > 0 && (
                <span className="text-xs text-primary font-bold bg-primary-fixed px-2.5 py-1 rounded-md">
                  Save ₹
                  {toNumber(activePricing.saveAmount).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* =================================================
              AVAILABILITY
          ================================================= */}

          <div
            id="availabilitySection"
            className="rounded-2xl border border-outline-variant/60 bg-white p-3 md:p-4 shadow-sm"
          >
            <div className="hidden md:block">
              <div className="flex items-start gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[19px]">
                    location_on
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-on-surface">
                    Check Delivery Availability
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Enter your pincode to check delivery
                  </p>
                </div>
              </div>

              <label
                htmlFor="delivery-pincode"
                className="block text-xs font-semibold text-on-surface-variant mb-1.5"
              >
                Delivery Pincode
              </label>

              <div className="relative">
                <input
                  id="delivery-pincode"
                  value={checkPincode}
                  onChange={(e) => {
                    setCheckPincode(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    );

                    setAvailabilityError("");
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="Enter 6-digit pincode"
                  className="w-full h-11 bg-surface-container/40 border border-outline-variant rounded-xl px-4 pr-12 outline-none text-sm tracking-[0.08em] focus:border-primary focus:ring-4 focus:ring-primary/10"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingPincode && (
                    <span className="block w-[18px] h-[18px] rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  )}

                  {!isCheckingPincode && availability === "available" && (
                    <span className="material-symbols-outlined text-green-600">
                      check_circle
                    </span>
                  )}

                  {!isCheckingPincode &&
                    availability &&
                    availability !== "available" && (
                      <span className="material-symbols-outlined text-red-500">
                        error
                      </span>
                    )}
                </div>
              </div>

              <div className="mt-2.5" aria-live="polite">
                {availability === "available" && (
                  <div className="rounded-xl bg-green-50 border border-green-100 px-3.5 py-2.5">
                    <p className="text-sm font-semibold text-green-700">
                      Delivery available!
                    </p>

                    <p className="text-xs text-green-600">
                      We deliver to {availabilityCity}.
                    </p>
                  </div>
                )}

                {availability === "unavailable" && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
                    <p className="text-sm font-semibold text-red-600">
                      Delivery unavailable
                    </p>

                    <p className="text-xs text-red-500">
                      We currently deliver only in Nashik.
                    </p>
                  </div>
                )}

                {availability === "invalid" && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
                    <p className="text-sm font-semibold text-red-600">
                      Invalid pincode
                    </p>
                  </div>
                )}

                {availability === "error" && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
                    <p className="text-sm font-semibold text-red-600">
                      Couldn't check availability
                    </p>
                  </div>
                )}

                {availabilityError && (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 mt-2">
                    <p className="text-xs font-medium text-amber-700">
                      {availabilityError}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BENEFITS */}

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-outline-variant/50">
              <div className="flex items-center gap-2 rounded-lg bg-surface-container/50 px-2.5 py-2">
                <span className="material-symbols-outlined text-primary text-[17px]">
                  schedule
                </span>

                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase">
                    Delivery
                  </p>

                  <p className="text-xs font-semibold">
                    {sameDayAvailable ? "Today" : "Tomorrow"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-surface-container/50 px-2.5 py-2">
                <span className="material-symbols-outlined text-primary text-[17px]">
                  local_shipping
                </span>

                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase">
                    Shipping
                  </p>

                  <p className="text-xs font-semibold">Free Delivery</p>
                </div>
              </div>
            </div>

            {/* MOBILE ACTIONS */}

            <div className="md:hidden mt-3 pt-3 border-t border-outline-variant/50">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleMobileStartFlow("buynow")}
                  className="w-full border-2 border-primary text-primary font-bold text-[13px] py-3 rounded-xl bg-white active:scale-[0.98]"
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={() => handleMobileStartFlow("cart")}
                  className="w-full text-white font-bold text-[13px] py-3 rounded-xl bg-primary active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    shopping_bag
                  </span>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              CHOICE
          ================================================= */}

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">Choice Available</p>

              <span className="text-xs text-on-surface-variant">
                Selected:{" "}
                <span className="font-bold text-green-700">
                  {selectedChoice} {itemType}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-2.5">
              {dynamicChoices.map((choice) => {
                const isSelected =
                  String(selectedChoice) === String(choice.count);

                return (
                  <button
                    key={choice.count}
                    type="button"
                    onClick={() => handleSelectChoice(choice)}
                    className={`group relative flex flex-col rounded-2xl p-2 text-left border-2 transition-all ${
                      isSelected
                        ? "border-green-600 bg-green-50/50 shadow-sm ring-2 ring-green-600/20"
                        : "border-outline-variant bg-white hover:border-green-500/60"
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-1.5 bg-surface-container">
                      {choice.image ? (
                        <img
                          src={
                            choice.image ||
                            productImages[0] ||
                            defaultThumbnails[0]
                          }
                          alt={choice.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(event) => {
                            const fallbackImage =
                              productImages[0] || defaultThumbnails[0];

                            if (
                              fallbackImage &&
                              event.currentTarget.src !== fallbackImage
                            ) {
                              event.currentTarget.src = fallbackImage;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary/30 text-4xl">
                            local_florist
                          </span>
                        </div>
                      )}
                    </div>

                    <p
                      className={`text-[12px] sm:text-[13px] font-semibold leading-snug ${
                        isSelected ? "text-green-700" : "text-on-surface"
                      }`}
                    >
                      {choice.desc}
                    </p>

                    <p className="text-[11px] font-bold text-primary mt-1">
                      ₹{toNumber(choice.price).toLocaleString("en-IN")}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              DESKTOP ACTIONS
          ================================================= */}

          <div className="hidden md:flex gap-3">
            <button
              type="button"
              onClick={handleDesktopAddToCart}
              disabled={cartLoading}
              className={`flex-1 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                cartDone ? "bg-green-600" : "bg-primary"
              }`}
            >
              <span
                className={
                  cartLoading
                    ? "material-symbols-outlined animate-spin"
                    : "material-symbols-outlined"
                }
              >
                {cartLoading
                  ? "progress_activity"
                  : cartDone
                    ? "check"
                    : "shopping_bag"}
              </span>

              {cartLoading ? "Adding..." : cartDone ? "Added!" : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={handleDesktopBuyNow}
              className="flex-1 border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary-fixed bg-white"
            >
              Buy Now
            </button>
          </div>

          {/* =================================================
              FEATURES
          ================================================= */}

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              {
                icon: "temp_preferences_eco",
                label: "Handcrafted",
              },
              {
                icon: "history",
                label: "Fresh Always",
              },
              {
                icon: "lock",
                label: "Secure Pay",
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-1 text-center rounded-xl py-1"
              >
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">
                    {feature.icon}
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-on-surface-variant">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <section className="mt-6 md:mt-8 border-t border-outline-variant pt-5 md:pt-6">
        <div className="max-w-4xl">
          <div className="flex gap-6 md:gap-8 border-b border-outline-variant mb-4 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`font-semibold pb-2.5 whitespace-nowrap border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-on-surface-variant border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* DESCRIPTION */}

          {activeTab === "description" && (
            <div className="space-y-3 text-on-surface-variant">
              <p className="text-sm sm:text-base text-on-surface leading-relaxed">
                {productDescription}
              </p>

              <ul className="space-y-2">
                {[
                  `${selectedChoice || "Premium"} ${itemType}`,
                  "Seasonal Greenery and Filler Flowers",
                  "Signature Luxury Wrap and Ribbon",
                  "Complimentary Personalized Message Card",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      spa
                    </span>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="italic text-primary border-l-2 border-primary/40 pl-3">
                "Flowers that speak the language of the heart."
              </p>
            </div>
          )}

          {/* DELIVERY */}

          {activeTab === "delivery" && (
            <div className="text-sm text-on-surface-variant space-y-3">
              <p className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  bolt
                </span>

                <span>
                  {sameDayAvailable
                    ? "Same-day delivery available for orders placed before 7 PM."
                    : "Same-day delivery is no longer available today. Orders can be scheduled for tomorrow or later."}
                </span>
              </p>

              <p className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  local_shipping
                </span>

                <span>Free delivery on eligible orders.</span>
              </p>

              <p className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  location_city
                </span>

                <span>Currently available across Nashik.</span>
              </p>
            </div>
          )}

          {/* CARE */}

          {activeTab === "care" && (
            <div className="text-sm text-on-surface-variant space-y-3">
              <p className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  wb_shade
                </span>

                <span>
                  Keep flowers in a cool, shaded area away from direct sunlight.
                </span>
              </p>

              <p className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  water_drop
                </span>

                <span>
                  Change water every 2 days and trim stems at an angle.
                </span>
              </p>

              <p className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  content_cut
                </span>

                <span>Remove wilted petals to extend freshness.</span>
              </p>
            </div>
          )}

          {/* REVIEWS */}

          {activeTab === "reviews" && (
            <div className="text-sm text-on-surface-variant space-y-2">
              <p>Customer reviews will be available soon.</p>

              <p>
                Current product rating:{" "}
                <strong>
                  {selectedProduct?.rating ?? "4.8"}
                  /5
                </strong>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   PAGE WRAPPER
========================================================= */

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
