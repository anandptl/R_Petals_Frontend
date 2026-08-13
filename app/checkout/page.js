"use client";

import { useState, useRef } from "react";
import Link from "next/link";

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
} from "lucide-react";

import CheckoutStepper from "../components/CheckoutStepper";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    receiverName: "",
    receiverNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    senderName: "",
    deliveryType: "", // Express / Premidnight / Super
    timeSlot: "", // Specific timing e.g. "8 AM - 12 PM"
  });

  const [errors, setErrors] = useState({
    receiverName: "",
    receiverNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    senderName: "",
    submit: "",
  });

  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const timerRef = useRef(null);

  // Active hover/selected sub-options state
  const [activeDeliveryType, setActiveDeliveryType] = useState(null);

  // Delivery categories with sub-time slots
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

  // --------------------------------
  // NAME CHANGE
  // --------------------------------
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

  // --------------------------------
  // TEXT CHANGE
  // --------------------------------
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

  // MOBILE NUMBER
  const handleMobileChange = (value) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 10);

    let errorMsg = "";

    if (/\D/.test(value)) {
      errorMsg = "Only numbers are allowed.";
    } else if (numbersOnly.length === 10 && !/^[6-9]\d{9}$/.test(numbersOnly)) {
      // Indian mobile numbers hamesha 6, 7, 8 ya 9 se start hote hain
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

  // --------------------------------
  // PINCODE → CITY + STATE (WITH DEBOUNCE & LOADING)
  // --------------------------------
  const handlePincodeChange = (value) => {
  const numbersOnly = value.replace(/\D/g, "").slice(0, 6);

  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  setFormData((prev) => ({
    ...prev,
    pincode: numbersOnly,
  }));

  if (numbersOnly.length < 6) {
    setErrors((prev) => ({
      ...prev,
      pincode: "",
      city: "",
    }));
    return;
  }

  if (numbersOnly.length === 6) {
    setIsLoadingPincode(true);

    setErrors((prev) => ({
      ...prev,
      pincode: "",
      city: "",
    }));

    timerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${numbersOnly}`
        );

        if (!response.ok) {
          throw new Error("Pincode API request failed");
        }

        const data = await response.json();

        if (
          data?.[0]?.Status === "Success" &&
          Array.isArray(data?.[0]?.PostOffice) &&
          data[0].PostOffice.length > 0
        ) {
          const postOffice = data[0].PostOffice[0];

          const city = postOffice?.District || "";
          const state = postOffice?.State || "";

          // Sirf Nashik city me delivery available hai
          const isServiceable = city.trim().toLowerCase() === "nashik";

          setFormData((prev) => ({
            ...prev,
            city,
            state,
          }));

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

          setErrors((prev) => ({
            ...prev,
            pincode: "Invalid Pincode.",
            city: "",
          }));
        }
      } catch (error) {
        console.error("Pincode API Error:", error);

        setErrors((prev) => ({
          ...prev,
          pincode: "Unable to fetch pincode details.",
        }));
      } finally {
        setIsLoadingPincode(false);
      }
    }, 300);
  }
};

  // --------------------------------
  // FORM SUBMIT
  // --------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

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

    if (!formData.city.trim()) {
  newErrors.city = "City is required.";
} else if (formData.city.trim().toLowerCase() !== "nashik") {
  newErrors.city = "Service not available";
}

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required.";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = "Sender Name is required.";
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

    alert("Validation Successful! Proceeding to Payment...");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf9f6] text-[#29241e]">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-[#eee7db] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-container-max items-center justify-between px-4 sm:h-[76px] md:h-[90px] md:px-lg">
          <Link href="/" className="flex items-center">
            <img
              src="/logo1.png"
              alt="R Petals Logo"
              className="h-9 w-auto object-contain sm:h-11 md:h-[70px]"
            />
          </Link>

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
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto w-full max-w-container-max px-3 py-5 pb-24 sm:px-5 sm:py-7 md:px-lg md:py-10">
        <div className="mx-auto max-w-6xl">
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
            <CheckoutStepper currentStep={1} />
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
                {/* SECTION TITLE */}
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

                {/* FIELDS */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  {/* RECEIVER NAME */}
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

                  {/* RECEIVER NUMBER */}
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

                  {/* ADDRESS */}
                  <div className="col-span-2">
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

                  {/* CITY */}
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

                  {/* STATE */}
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

                  {/* PINCODE */}
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

                  {/* SENDER NAME */}
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
                </div>

                {/* PINCODE INFO */}
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f5f9f2] px-3 py-2.5 text-[10px] leading-4 text-[#66805a] sm:text-xs">
                  <Sparkles
                    size={14}
                    className="mt-0.5 shrink-0 text-[#4d8f2b]"
                  />
                  <span>
                    Enter a 6-digit pincode and City & State will be filled
                    automatically.
                  </span>
                </div>
              </div>

              {/* ================= TIME SLOT SECTION ================= */}
              {/* ================= TIME SLOT SECTION ================= */}
              <div className="rounded-[20px] border border-[#eee7db] bg-white p-3 shadow-[0_8px_35px_rgba(49,38,20,0.04)] sm:rounded-[22px] sm:p-5 md:p-7">
                {/* TITLE */}
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

                {/* 30% / 70% SPLIT LAYOUT */}
                <div className="grid grid-cols-[38%_62%] gap-2.5 sm:grid-cols-[30%_70%] sm:gap-4">
                  {/* ============ LEFT COLUMN (30%) — 3 ROWS ============ */}
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

                  {/* ============ RIGHT COLUMN (70%) — OPTIONS OF ACTIVE TYPE ============ */}
                  <div className="rounded-xl border border-[#eee5d8] bg-[#fbfdf9] p-3 sm:rounded-2xl sm:p-4">
                    {(() => {
                      // Jo hover/click ho raha hai wo dikhao, warna already selected type, warna pehla type default
                      const currentSlot =
                        timeSlotsData.find(
                          (s) => s.id === activeDeliveryType,
                        ) ||
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

                {/* SELECTED SUMMARY DISPLAY */}
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
              {/* SUMMARY TITLE */}
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

              {/* PRODUCT */}
              <div className="mb-5 rounded-2xl bg-[#faf9f6] p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#4d8f2b] shadow-sm">
                    <Leaf size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#29241e]">
                      Flower Arrangement
                    </p>

                    <p className="mt-0.5 text-xs text-[#918a80]">
                      Fresh & premium flowers
                    </p>
                  </div>

                  <span className="text-sm font-bold text-[#29241e]">
                    ₹7,349
                  </span>
                </div>
              </div>

              {/* PRICE */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#827b71]">Subtotal</span>

                  <span className="font-semibold text-[#29241e]">₹7,349</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#827b71]">Delivery</span>

                  <span className="font-semibold text-[#4d8f2b]">FREE</span>
                </div>

                <div className="border-t border-dashed border-[#ddd8ce] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#29241e]">Total</span>

                    <span className="text-xl font-bold text-[#4d8f2b]">
                      ₹7,349
                    </span>
                  </div>
                </div>
              </div>

              {/* SECURITY */}
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#f5f9f2] px-3 py-2.5 text-[10px] text-[#66805a] sm:text-xs">
                <ShieldCheck size={15} className="shrink-0 text-[#4d8f2b]" />

                <span>Secure & protected checkout</span>
              </div>

              {/* PAYMENT */}
              <div className="mt-3 flex items-center gap-2 text-[10px] text-[#918a80] sm:text-xs">
                <LockKeyhole size={13} />

                <span>Your payment details are encrypted</span>
              </div>

              {/* ERROR */}
              {errors.submit && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-500">
                  {errors.submit}
                </p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4d8f2b] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(77,143,43,0.22)] transition-all hover:bg-[#417d24] hover:shadow-[0_10px_25px_rgba(77,143,43,0.28)] active:scale-[0.99] sm:py-4"
              >
                <CreditCard size={17} />
                Continue to Payment
              </button>

              <p className="mt-3 text-center text-[9px] leading-4 text-[#aaa297] sm:text-[10px]">
                By continuing, you agree to our terms and conditions.
              </p>
            </aside>
          </form>
        </div>
      </main>
    </div>
  );
}
