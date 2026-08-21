"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, initializeAuthSession } from "@/lib/auth";

import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  Leaf,
  LockKeyhole,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  Building2,
  Map,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
  ChevronDown,
  Mail,
  MessageSquare,
} from "lucide-react";

import CheckoutStepper from "../components/CheckoutStepper";

const LOCAL_CART_KEY = "local-cart";

const readLocalCart = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read local cart:", error);
    return [];
  }
};

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const token = await initializeAuthSession();

        if (!mounted) return;

        if (!token) {
          router.replace("/login?redirect=/checkout");
          return;
        }

        setUser(getStoredUser());
      } catch (error) {
        console.error("CHECKOUT SESSION ERROR:", error);
        if (mounted) router.replace("/login?redirect=/checkout");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  const [formData, setFormData] = useState({
    receiverName: "",
    receiverNumber: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    senderName: "",
    senderEmail: "",
    receiverMessage: "",
    deliveryType: "",
    timeSlot: "",
    deliveryDate: "",
  });

  const [errors, setErrors] = useState({
    receiverName: "",
    receiverNumber: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    senderName: "",
    senderEmail: "",
    submit: "",
  });

  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [verifiedPincode, setVerifiedPincode] = useState("");
  const [cartItems, setCartItems] = useState([]);
 

  const cartItemCount = cartItems.reduce(
  (total, item) => total + (Number(item.quantity) || 1),
  0
);

const cartSubtotal = cartItems.reduce(
  (total, item) =>
    total +
    Number(item.price || 0) *
      (Number(item.quantity) || 1),
  0
);

  const timerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const pincodeRequestIdRef = useRef(0);

  const [activeDeliveryType, setActiveDeliveryType] = useState(null);

  const timeSlotsData = [
    {
      id: "Express",
      title: "Express Delivery",
      subtitle: "Standard time windows",
      icon: Sun,
      iconColor: "text-[#e6a52d]",
      bg: "bg-[#fff8e8]",
      options: ["8 AM - 12 PM", "12 PM - 4 PM", "4 PM - 8 PM", "8 PM - 11 PM"],
    },
    {
      id: "Premidnight",
      title: "Premidnight Delivery",
      subtitle: "Late night surprise",
      icon: Sparkles,
      iconColor: "text-[#e5a53a]",
      bg: "bg-[#fff8e8]",
      options: ["11 PM - 11:59 PM"],
    },
    {
      id: "Super",
      title: "Super Delivery",
      subtitle: "Ultra fast delivery",
      icon: Zap,
      iconColor: "text-[#747cc0]",
      bg: "bg-[#f1f2ff]",
      options: ["Within 1 hour"],
    },
  ];

 useEffect(() => {
  const items = readLocalCart();

  setCartItems(items);

  const firstDeliveryDate = items?.[0]?.deliveryDate || "";

  setFormData((prev) => ({
    ...prev,
    deliveryDate: firstDeliveryDate,
  }));
}, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleNameChange = (field, value) => {
    const isValid = /^[A-Za-z\s]*$/.test(value);

    setErrors((prev) => ({
      ...prev,
      [field]: isValid ? "" : "Only letters are allowed.",
    }));

    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleTextChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleEmailChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      senderEmail: value,
    }));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        senderEmail: "Sender Email is required.",
      }));
    } else if (!emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        senderEmail: "Enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        senderEmail: "",
      }));
    }
  };

  const handleMobileChange = (value) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 10);

    let errorMsg = "";

    if (/\D/.test(value)) {
      errorMsg = "Only numbers are allowed.";
    } else if (numbersOnly.length === 10 && !/^[6-9]\d{9}$/.test(numbersOnly)) {
      errorMsg = "Enter a valid Indian mobile number.";
    }

    setErrors((prev) => ({
      ...prev,
      receiverNumber: errorMsg,
    }));

    setFormData((prev) => ({
      ...prev,
      receiverNumber: numbersOnly,
    }));
  };

  const handlePincodeChange = (value) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 6);

    // Invalidate every previous request immediately.
    pincodeRequestIdRef.current += 1;
    const currentRequestId = pincodeRequestIdRef.current;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // A changed pincode must never keep the previous verified address.
    setIsPincodeVerified(false);
    setVerifiedPincode("");
    setIsLoadingPincode(false);

    setFormData((prev) => ({
      ...prev,
      pincode: numbersOnly,
      city: "",
      state: "",
    }));

    setErrors((prev) => ({
      ...prev,
      pincode: "",
      city: "",
      state: "",
    }));

    if (numbersOnly.length !== 6) {
      return;
    }

    setIsLoadingPincode(true);

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${numbersOnly}`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Pincode API request failed");
        }

        const data = await response.json();

        // Ignore a response belonging to an older pincode.
        if (currentRequestId !== pincodeRequestIdRef.current) {
          return;
        }

        if (
          data?.[0]?.Status === "Success" &&
          Array.isArray(data?.[0]?.PostOffice) &&
          data[0].PostOffice.length > 0
        ) {
          const postOffice = data[0].PostOffice[0];

          const city = postOffice?.District || "";
          const state = postOffice?.State || "";

          const isServiceable =
            city.trim().toLowerCase() === "nashik" ||
            city.trim().toLowerCase() === "nasik";

          setFormData((prev) => ({
            ...prev,
            city,
            state,
          }));

          setIsPincodeVerified(
            Boolean(isServiceable && city && state)
          );
          setVerifiedPincode(
            isServiceable && city && state ? numbersOnly : ""
          );

          setErrors((prev) => ({
            ...prev,
            pincode: "",
            city: !city
              ? "City not found."
              : !isServiceable
              ? "Service not available"
              : "",
            state: state ? "" : "State not found.",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            city: "",
            state: "",
          }));

          setIsPincodeVerified(false);
          setVerifiedPincode("");

          setErrors((prev) => ({
            ...prev,
            pincode: "Invalid Pincode.",
            city: "",
            state: "",
          }));
        }
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        if (currentRequestId !== pincodeRequestIdRef.current) {
          return;
        }

        console.error("Pincode API Error:", error);

        setFormData((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));

        setIsPincodeVerified(false);
        setVerifiedPincode("");

        setErrors((prev) => ({
          ...prev,
          pincode: "Unable to fetch pincode details.",
          city: "",
          state: "",
        }));
      } finally {
        if (currentRequestId === pincodeRequestIdRef.current) {
          setIsLoadingPincode(false);
          abortControllerRef.current = null;
        }
      }
    }, 300);
  };

// Check karein ki saara address sahi bhara hai ya nahi
const isAddressComplete = Boolean(
  formData.receiverName.trim() &&
  /^[6-9]\d{9}$/.test(formData.receiverNumber) &&
  formData.address.trim() &&
  formData.pincode.length === 6 &&
  isPincodeVerified &&
  verifiedPincode === formData.pincode &&
  formData.city.trim().toLowerCase() === "nashik" &&
  formData.state.trim() &&
  formData.senderName.trim() &&
  formData.senderEmail.trim() &&
  !errors.receiverName &&
  !errors.receiverNumber &&
  !errors.pincode &&
  !errors.city &&
  !errors.state &&
  !errors.senderName &&
  !errors.senderEmail &&
  !isLoadingPincode
);

const isTimeSlotComplete = Boolean(formData.deliveryType && formData.timeSlot);

// Step calculate karein:
// 1. Address bharne par -> Step 2 (Address pe Green Checkmark aayega)
// 2. Time slot select karne par -> Step 3 (Time slot pe bhi Green Checkmark aayega)
const currentStep = isAddressComplete && isTimeSlotComplete
  ? 3
  : isAddressComplete
  ? 2
  : 1;


  
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (isLoadingPincode) {
      newErrors.submit = "Please wait while we verify your pincode.";
    }

    if (formData.pincode.length === 6 && !isPincodeVerified) {
      newErrors.pincode =
        newErrors.pincode || "Please enter a valid Nashik pincode and wait for verification.";
    }

    if (cartItems.length === 0) {
      newErrors.submit =
        "Your cart is empty. Please add a product before continuing.";
    }

    if (!formData.receiverName.trim()) {
      newErrors.receiverName = "Receiver Name is required.";
    }

    if (!formData.receiverNumber) {
      newErrors.receiverNumber = "Receiver Mobile Number is required.";
    } else if (formData.receiverNumber.length !== 10) {
      newErrors.receiverNumber = "Mobile number must be exactly 10 digits.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required.";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    } else if (
      !isPincodeVerified ||
      verifiedPincode !== formData.pincode
    ) {
      newErrors.pincode =
        "Please wait for pincode verification to complete.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    } else if (formData.city.trim().toLowerCase() !== "nashik") {
      newErrors.city = "Service not available";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = "Sender Name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.senderEmail.trim()) {
      newErrors.senderEmail = "Sender Email is required.";
    } else if (!emailRegex.test(formData.senderEmail)) {
      newErrors.senderEmail = "Enter a valid email address.";
    }

    if (!formData.deliveryType || !formData.timeSlot) {
      newErrors.submit =
        "Please select a Delivery Option and Time Slot before proceeding.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      return;
    }

    setErrors((prev) => ({
      ...prev,
      submit: "",
    }));

    localStorage.setItem(
  "checkout-data",
  JSON.stringify(formData)
);

router.push("/payment");
  };

  if (loading || !user) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-container-max items-center justify-center px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4d8f2b] border-t-transparent"></div>
          <p className="text-sm font-medium text-[#827b71]">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-container-max px-3 py-5 pb-24 sm:px-5 sm:py-7 md:px-lg md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* ================= BACK TO CART ================= */}
        <div className="mb-5 flex justify-end sm:mb-6">
          <Link
            href="/cart"
            className="group flex items-center gap-1.5 rounded-full border border-[#e8e1d5] px-3 py-2 text-xs font-semibold text-[#4d8f2b] transition hover:border-[#4d8f2b] hover:bg-[#f3f9ef] sm:gap-2 sm:px-4 sm:text-sm"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Cart
          </Link>
        </div>

        {/* ================= TITLE ================= */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#edf6e7] text-[#4d8f2b] sm:h-14 sm:w-14">
            <ShoppingBag size={21} className="sm:h-6 sm:w-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#29241e] sm:text-3xl md:text-4xl">
            Complete Your Order
          </h1>

          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#918a80] sm:text-sm">
            Complete your delivery details and payment securely.
          </p>
        </div>

        {/* ================= STEPPER ================= */}
        <div className="mb-5 rounded-[20px] border border-[#eee7db] bg-white p-3 shadow-[0_8px_35px_rgba(49,38,20,0.04)] sm:mb-6 sm:rounded-[22px] sm:p-5 md:p-7">
          <CheckoutStepper currentStep={currentStep} />
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:gap-6"
        >
          {/* ================= LEFT ================= */}
          <section className="min-w-0 space-y-5">
            {/* ================= DELIVERY ADDRESS ================= */}
            <div className="rounded-[20px] border border-[#eee7db] bg-white p-4 shadow-[0_8px_35px_rgba(49,38,20,0.04)] sm:rounded-[22px] sm:p-5 md:p-7">
              <div className="mb-5 flex items-center gap-3 sm:mb-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf6e7] text-[#4d8f2b] sm:h-12 sm:w-12">
                  <MapPin size={19} className="sm:h-5 sm:w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#29241e] sm:text-xl md:text-2xl">
                    Delivery Address
                  </h2>

                  <p className="mt-0.5 hidden text-xs text-[#918a80] sm:block">
                    Enter the details where you want your order delivered
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {/* 1. Receiver Name */}
                <div className="min-w-0">
                  <div className="relative">
                    <User
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      type="text"
                      placeholder="Receiver Name"
                      value={formData.receiverName}
                      onChange={(e) =>
                        handleNameChange("receiverName", e.target.value)
                      }
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        errors.receiverName
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4] focus:border-[#4d8f2b] focus:ring-4 focus:ring-[#4d8f2b]/10"
                      }`}
                    />
                  </div>

                  {errors.receiverName && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.receiverName}
                    </p>
                  )}
                </div>

                {/* 2. Receiver Number */}
                <div className="min-w-0">
                  <div className="relative">
                    <Phone
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Receiver Number"
                      value={formData.receiverNumber}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        errors.receiverNumber
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4] focus:border-[#4d8f2b] focus:ring-4 focus:ring-[#4d8f2b]/10"
                      }`}
                    />
                  </div>

                  {errors.receiverNumber && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.receiverNumber}
                    </p>
                  )}
                </div>

                {/* 3. House / Flat / Street Address */}
                <div className="min-w-0">
                  <div className="relative">
                    <Building2
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      type="text"
                      placeholder="House / Flat / Street Address"
                      value={formData.address}
                      onChange={(e) =>
                        handleTextChange("address", e.target.value)
                      }
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        errors.address
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4] focus:border-[#4d8f2b] focus:ring-4 focus:ring-[#4d8f2b]/10"
                      }`}
                    />
                  </div>

                  {errors.address && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* 4. Pincode */}
                <div className="min-w-0">
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        errors.pincode
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4] focus:border-[#4d8f2b] focus:ring-4 focus:ring-[#4d8f2b]/10"
                      }`}
                    />
                  </div>

                  {errors.pincode && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                {/* 5. City */}
                <div className="min-w-0">
                  <div className="relative">
                    <Map
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      id="city"
                      type="text"
                      placeholder={
                        isLoadingPincode ? "Fetching City..." : "City"
                      }
                      readOnly={true}
                      value={formData.city}
                      className={`w-full rounded-xl border py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        isLoadingPincode
                          ? "bg-gray-100 cursor-not-allowed opacity-70"
                          : "bg-white"
                      } ${
                        errors.city
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4]"
                      }`}
                    />
                  </div>

                  {errors.city && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* 6. State */}
                <div className="min-w-0">
                  <div className="relative">
                    <Map
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      id="state"
                      type="text"
                      placeholder={
                        isLoadingPincode ? "Fetching State..." : "State"
                      }
                      readOnly={true}
                      value={formData.state}
                      className={`w-full rounded-xl border py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        isLoadingPincode
                          ? "bg-gray-100 cursor-not-allowed opacity-70"
                          : "bg-white"
                      } ${
                        errors.state
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4]"
                      }`}
                    />
                  </div>

                  {errors.state && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* 7. Sender Name */}
                <div className="min-w-0">
                  <div className="relative">
                    <User
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      type="text"
                      placeholder="Sender Name"
                      value={formData.senderName}
                      onChange={(e) =>
                        handleNameChange("senderName", e.target.value)
                      }
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        errors.senderName
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4] focus:border-[#4d8f2b] focus:ring-4 focus:ring-[#4d8f2b]/10"
                      }`}
                    />
                  </div>

                  {errors.senderName && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.senderName}
                    </p>
                  )}
                </div>

                {/* 8. Sender Email (Required) */}
                <div className="min-w-0">
                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa297]"
                    />

                    <input
                      type="email"
                      placeholder="Sender Email"
                      value={formData.senderEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm ${
                        errors.senderEmail
                          ? "border-red-300 focus:ring-4 focus:ring-red-100"
                          : "border-[#e7e0d4] focus:border-[#4d8f2b] focus:ring-4 focus:ring-[#4d8f2b]/10"
                      }`}
                    />
                  </div>

                  {errors.senderEmail && (
                    <p className="mt-1 px-1 text-[10px] text-red-500 sm:text-xs">
                      {errors.senderEmail}
                    </p>
                  )}
                </div>

                {/* 9. Message for Receiver (Optional - Full Width) */}
                <div className="col-span-2 min-w-0">
                  <div className="relative">
                    <MessageSquare
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-3.5 text-[#aaa297]"
                    />

                    <textarea
                      rows={2}
                      placeholder="Message for Receiver (Optional)"
                      value={formData.receiverMessage}
                      onChange={(e) =>
                        handleTextChange("receiverMessage", e.target.value)
                      }
                      className="w-full rounded-xl border border-[#e7e0d4] bg-white py-3 pl-10 pr-3 text-xs text-[#29241e] outline-none transition-all placeholder:text-[#aaa297] focus:border-[#4d8f2b] focus:ring-4 focus:ring-[#4d8f2b]/10 sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f5f9f2] px-3 py-2.5 text-[10px] leading-4 text-[#66805a] sm:text-xs">
                <Sparkles
                  size={14}
                  className="mt-0.5 shrink-0 text-[#4d8f2b]"
                />
                <span>
                  Enter a 6-digit pincode and City & State will be filled
                  automatically. Delivery is currently available only in Nashik.
                </span>
              </div>
            </div>

            {/* ================= TIME SLOT SECTION ================= */}
            <div className="rounded-[20px] border border-[#eee7db] bg-white p-3 shadow-[0_8px_35px_rgba(49,38,20,0.04)] sm:rounded-[22px] sm:p-5 md:p-7">
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf6e7] text-[#4d8f2b] sm:h-12 sm:w-12">
                  <Clock size={18} className="sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#29241e] sm:text-xl md:text-2xl">
                    Select Delivery Mode & Time Slot
                  </h2>
                  <p className="text-xs text-[#918a80]">
                    Hover (desktop) or tap (mobile) a delivery type to see its
                    slots
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[38%_62%] gap-2.5 sm:grid-cols-[30%_70%] sm:gap-4">
                <div className="flex flex-col gap-2 sm:gap-3">
                  {timeSlotsData.map((slot) => {
                    const Icon = slot.icon;
                    const isTypeSelected = formData.deliveryType === slot.id;
                    const isActive = activeDeliveryType === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onMouseEnter={() => setActiveDeliveryType(slot.id)}
                        onClick={() => {
                          setActiveDeliveryType(slot.id);
                          if (formData.deliveryType !== slot.id) {
                            setFormData((prev) => ({
                              ...prev,
                              deliveryType: slot.id,
                              timeSlot: slot.options[0],
                            }));
                          }
                        }}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all duration-200 sm:gap-3 sm:rounded-2xl sm:p-3.5 ${
                          isTypeSelected
                            ? "border-[#4d8f2b] bg-[#f3f9ef] shadow-[0_6px_20px_rgba(77,143,43,0.13)]"
                            : isActive
                            ? "border-[#b7cfaa] bg-[#fbfdf9]"
                            : "border-[#eee5d8] bg-white hover:border-[#cfe3c2]"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${slot.bg}`}
                        >
                          <Icon
                            size={16}
                            className={slot.iconColor}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div className="min-w-0">
                          <span className="block truncate text-[11px] font-bold text-[#29241e] sm:text-sm">
                            {slot.title}
                          </span>
                          <span className="hidden text-[10px] text-[#827b71] sm:block">
                            {slot.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-[#eee5d8] bg-[#fbfdf9] p-3 sm:rounded-2xl sm:p-4">
                  {(() => {
                    const currentSlot =
                      timeSlotsData.find((s) => s.id === activeDeliveryType) ||
                      timeSlotsData.find(
                        (s) => s.id === formData.deliveryType,
                      ) ||
                      timeSlotsData[0];

                    return (
                      <div>
                        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#918a80] sm:text-xs">
                          <currentSlot.icon
                            size={13}
                            className={currentSlot.iconColor}
                          />
                          {currentSlot.title} — Available Slots
                        </p>

                        <div className="space-y-1.5 sm:space-y-2">
                          {currentSlot.options.map((option) => {
                            const isSlotSelected =
                              formData.deliveryType === currentSlot.id &&
                              formData.timeSlot === option;

                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setActiveDeliveryType(currentSlot.id);
                                  setFormData((prev) => ({
                                    ...prev,
                                    deliveryType: currentSlot.id,
                                    timeSlot: option,
                                  }));
                                }}
                                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all sm:px-3 sm:py-2.5 sm:text-sm ${
                                  isSlotSelected
                                    ? "bg-[#4d8f2b] text-white shadow-sm"
                                    : "bg-white text-[#29241e] border border-[#e8e1d5] hover:border-[#4d8f2b] hover:bg-[#f3f9ef]"
                                }`}
                              >
                                <span>{option}</span>
                                {isSlotSelected && (
                                  <Check size={13} strokeWidth={3} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {formData.deliveryType && formData.timeSlot && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#edf6e7] px-3.5 py-2.5 text-xs font-semibold text-[#4d8f2b]">
                  <Check size={15} strokeWidth={2.5} />
                  <span>
                    Selected: <b>{formData.deliveryType} Delivery</b> (
                    {formData.timeSlot})
                  </span>
                </div>
              )}

              {errors.submit && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
                  {errors.submit}
                </p>
              )}
            </div>
          </section>

          {/* ================= ORDER SUMMARY ================= */}
          <aside className="h-fit rounded-[20px] border border-[#eee7db] bg-white p-4 shadow-[0_8px_35px_rgba(49,38,20,0.04)] sm:rounded-[22px] sm:p-5 md:p-7 lg:sticky lg:top-[108px]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf6e7] text-[#4d8f2b]">
                <ShoppingBag size={19} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#29241e] sm:text-xl">
                  Order Summary
                </h2>

                <p className="text-[10px] text-[#918a80] sm:text-xs">
                  Your order details
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl bg-[#faf9f6] p-3.5 sm:p-4">
              {cartItems.length > 0 ? (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const quantity = Math.max(1, Number(item?.quantity) || 1);
                    const itemTotal = Number(
                      item?.totalPrice ?? item?.price ?? item?.productPrice ?? 0
                    );
                    const lineTotal = itemTotal * quantity;

                    return (
                      <div
                        key={item?.id || `${item?.productName}-${item?.createdAt}`}
                        className="flex items-center gap-3"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item?.productName || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#4d8f2b]">
                              <Leaf size={22} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#29241e]">
                            {item?.productName || item?.title || "Product"}
                          </p>

                          <p className="mt-0.5 text-xs text-[#918a80]">
                            Qty: {quantity}
                            {item?.choice?.label
                              ? ` • ${item.choice.label}`
                              : ""}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-[#29241e]">
                          ₹{lineTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#918a80] shadow-sm">
                    <ShoppingBag size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#29241e]">
                      Your cart is empty
                    </p>
                    <p className="mt-0.5 text-xs text-[#918a80]">
                      Add a product to continue checkout.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#827b71]">
                  Subtotal {cartItemCount > 0 ? `(${cartItemCount} item${cartItemCount > 1 ? "s" : ""})` : ""}
                </span>

                <span className="font-semibold text-[#29241e]">
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#827b71]">Delivery</span>

                <span className="font-semibold text-[#4d8f2b]">FREE</span>
              </div>

              <div className="border-t border-dashed border-[#ddd8ce] pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#29241e]">Total</span>

                  <span className="text-xl font-bold text-[#4d8f2b]">
                    ₹{cartSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#f5f9f2] px-3 py-2.5 text-[10px] text-[#66805a] sm:text-xs">
              <ShieldCheck size={15} className="shrink-0 text-[#4d8f2b]" />

              <span>Secure & protected checkout</span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-[#918a80] sm:text-xs">
              <LockKeyhole size={13} />

              <span>Your payment details are encrypted</span>
            </div>

            {errors.submit && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-500">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={
                isLoadingPincode ||
                cartItems.length === 0
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4d8f2b] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(77,143,43,0.22)] transition-all hover:bg-[#417d24] hover:shadow-[0_10px_25px_rgba(77,143,43,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:py-4"
            >
              <CreditCard size={17} />
              {isLoadingPincode ? "Verifying Pincode..." : "Continue to Payment"}
            </button>

            <p className="mt-3 text-center text-[9px] leading-4 text-[#aaa297] sm:text-[10px]">
              By continuing, you agree to our terms and conditions.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}