"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";

import CheckoutStepper from "../components/CheckoutStepper";
// ↑ Agar tumhara CheckoutStepper kisi aur folder mein hai,
//   sirf is import path ko apne actual path ke according change karna.

const LOCAL_CART_KEY = "local-cart";
const CHECKOUT_DATA_KEY = "checkout-data";

/*
|--------------------------------------------------------------------------
| BACKEND CONFIG
|--------------------------------------------------------------------------
| Backend wala jab APIs dega, yahan exact endpoints replace kar dena.
|
| Example:
| NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
|
*/
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const CREATE_ORDER_ENDPOINT = `${API_BASE_URL}/payments/create-order`;
const VERIFY_PAYMENT_ENDPOINT = `${API_BASE_URL}/payments/verify`;

/*
|--------------------------------------------------------------------------
| RAZORPAY
|--------------------------------------------------------------------------
| Key ID frontend mein use ho sakti hai.
| Key Secret kabhi frontend mein mat rakhna.
|--------------------------------------------------------------------------
*/
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function formatPrice(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function readStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);

    if (!raw) return fallback;

    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);
    return fallback;
  }
}

function normalizeCartItem(item) {
  return {
    ...item,
    title: item?.title || item?.productName || "Product",

    productName: item?.productName || item?.title || "Product",

    price:
      Number(item?.price ?? item?.totalPrice ?? item?.productPrice ?? 0) || 0,

    quantity: Math.max(1, Number(item?.quantity) || 1),
  };
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));

      existingScript.addEventListener("error", () => resolve(false));

      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [checkoutData, setCheckoutData] = useState(null);

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const [paymentError, setPaymentError] = useState("");

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD CART + CHECKOUT DATA
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const storedCart = readStorage(LOCAL_CART_KEY, []);

    const storedCheckout = readStorage(CHECKOUT_DATA_KEY, null);

    const normalizedCart = Array.isArray(storedCart)
      ? storedCart.map(normalizeCartItem)
      : [];

    setCartItems(normalizedCart);

    setCheckoutData(storedCheckout);

    setIsLoadingPage(false);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD RAZORPAY SCRIPT
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let mounted = true;

    loadRazorpayScript().then((loaded) => {
      if (mounted) {
        setRazorpayLoaded(loaded);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TOTALS
  |--------------------------------------------------------------------------
  */
  const cartItemCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Math.max(1, Number(item.quantity) || 1),
      0,
    );
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) * Math.max(1, Number(item.quantity) || 1),
      0,
    );
  }, [cartItems]);

  const totalAmount = cartSubtotal;

  /*
  |--------------------------------------------------------------------------
  | DELIVERY INFORMATION
  |--------------------------------------------------------------------------
  */
  const deliveryDateLabel =
    checkoutData?.deliveryDate || "Selected delivery date";

  const deliveryType = checkoutData?.deliveryType || "Selected delivery option";

  const timeSlot = checkoutData?.timeSlot || "Selected time slot";
  const formatDeliveryDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");

    if (!year || !month || !day) {
      return dateString;
    }

    return `${day}-${month}-${year}`;
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY PAYMENT
  |--------------------------------------------------------------------------
  */
  const verifyPayment = async (paymentResponse, serverOrderId) => {
    setIsVerifyingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch(VERIFY_PAYMENT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,

          razorpay_order_id: paymentResponse.razorpay_order_id,

          razorpay_signature: paymentResponse.razorpay_signature,

          server_order_id: serverOrderId,

          amount: totalAmount,

          currency: "INR",

          checkoutData,

          cartItems,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Payment verification failed.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      | Backend verification successful.
      |--------------------------------------------------------------------------
      */

      setPaymentSuccess(true);

      /*
      | Backend wala agar confirmation/orderId
      | return kare to later yahan use kar sakte hain.
      */

      const confirmationId =
        data?.orderId || data?.orderNumber || data?.id || "";

      if (confirmationId) {
        localStorage.setItem("last-order-id", String(confirmationId));
      }

      /*
      | Cart clear karna abhi intentionally
      | backend confirmation ke baad hi kar rahe hain.
      */
      localStorage.removeItem(LOCAL_CART_KEY);

      localStorage.removeItem(CHECKOUT_DATA_KEY);

      /*
      | Payment confirmation screen ko thoda
      | visible rehne dete hain.
      */
      setTimeout(() => {
        router.push(
          confirmationId
            ? `/order-success?orderId=${encodeURIComponent(confirmationId)}`
            : "/order-success",
        );
      }, 900);
    } catch (error) {
      console.error("Payment verification error:", error);

      setPaymentError(
        error?.message ||
          "Payment verification failed. Please contact support before trying again.",
      );
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN RAZORPAY
  |--------------------------------------------------------------------------
  */
  const openRazorpay = async () => {
    setPaymentError("");

    if (cartItems.length === 0) {
      setPaymentError(
        "Your cart is empty. Please add a product before payment.",
      );
      return;
    }

    if (!checkoutData) {
      setPaymentError(
        "Checkout information is missing. Please return to checkout and continue again.",
      );
      return;
    }

    if (!totalAmount || totalAmount <= 0) {
      setPaymentError(
        "Invalid order amount. Please return to checkout and try again.",
      );
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      setPaymentError(
        "Razorpay Key ID is not configured yet. Add NEXT_PUBLIC_RAZORPAY_KEY_ID when your backend/payment setup is ready.",
      );
      return;
    }

    setIsCreatingOrder(true);

    try {
      /*
      |--------------------------------------------------------------------------
      | STEP 1
      | Ask backend to create Razorpay Order
      |--------------------------------------------------------------------------
      |
      | IMPORTANT:
      | Amount is sent in rupees here for your API contract.
      | Backend should calculate/validate the final amount itself
      | and create Razorpay order in paise.
      |--------------------------------------------------------------------------
      */

      const response = await fetch(CREATE_ORDER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",

          cartItems,

          checkoutData,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to create payment order.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | BACKEND RESPONSE
      |--------------------------------------------------------------------------
      | We support a few common names so backend mapping is easy.
      |--------------------------------------------------------------------------
      */

      const razorpayOrderId =
        data?.orderId || data?.razorpayOrderId || data?.id;

      const razorpayAmount = Number(data?.amount || totalAmount * 100);

      const razorpayCurrency = data?.currency || "INR";

      if (!razorpayOrderId) {
        throw new Error("Backend did not return a Razorpay Order ID.");
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 2
      | Ensure Razorpay script is available
      |--------------------------------------------------------------------------
      */

      const loaded = razorpayLoaded || (await loadRazorpayScript());

      if (!loaded || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please try again.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 3
      | Open Razorpay
      |--------------------------------------------------------------------------
      */

      const options = {
        key: RAZORPAY_KEY_ID,

        amount: razorpayAmount,

        currency: razorpayCurrency,

        name: "RPetals",

        description: "RPetals Flower Order",

        order_id: razorpayOrderId,

        /*
        |--------------------------------------------------------------------------
        | PREFILL
        |--------------------------------------------------------------------------
        */
        prefill: {
          name: checkoutData?.receiverName || "",

          email: checkoutData?.senderEmail || "",

          contact: checkoutData?.receiverNumber
            ? `+91${String(checkoutData.receiverNumber).replace(/\D/g, "")}`
            : "",
        },

        notes: {
          city: checkoutData?.city || "",

          pincode: checkoutData?.pincode || "",

          deliveryType: checkoutData?.deliveryType || "",

          timeSlot: checkoutData?.timeSlot || "",
        },

        theme: {
          color: "#4d8f2b",
        },

        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,

          ondismiss: () => {
            setIsCreatingOrder(false);

            setPaymentError(
              "Payment window was closed. Your order has not been confirmed.",
            );
          },
        },

        retry: {
          enabled: true,
          max_count: 4,
        },

        /*
        |--------------------------------------------------------------------------
        | SUCCESS HANDLER
        |--------------------------------------------------------------------------
        */
        handler: async (paymentResponse) => {
          setIsCreatingOrder(false);

          await verifyPayment(paymentResponse, razorpayOrderId);
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response);

        setIsCreatingOrder(false);

        setPaymentError(
          response?.error?.description || "Payment failed. Please try again.",
        );
      });

      /*
      |--------------------------------------------------------------------------
      | IMPORTANT:
      | rzp.open() is triggered from the Pay button action.
      |--------------------------------------------------------------------------
      */
      razorpay.open();
    } catch (error) {
      console.error("Create Razorpay order error:", error);

      setPaymentError(
        error?.message || "Unable to start payment. Please try again.",
      );

      setIsCreatingOrder(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE LOADING
  |--------------------------------------------------------------------------
  */
  if (isLoadingPage) {
    return (
      <main className="min-h-screen bg-[#fffdf9] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <p className="text-sm font-medium text-[#827b71]">
            Loading payment details...
          </p>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | SUCCESS UI
  |--------------------------------------------------------------------------
  */
  if (paymentSuccess) {
    return (
      <main className="min-h-screen bg-[#fffdf9] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-[#e8e1d6] shadow-sm p-7 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#29241e]">
            Payment Successful
          </h1>

          <p className="mt-2 text-sm text-[#827b71]">
            Your payment has been verified. Redirecting to your order
            confirmation...
          </p>

          <div className="mt-5 rounded-2xl bg-[#f8faf5] p-4">
            <p className="text-xs text-[#827b71]">Amount Paid</p>

            <p className="mt-1 text-2xl font-bold text-[#4d8f2b]">
              {formatPrice(totalAmount)}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EMPTY CART
  |--------------------------------------------------------------------------
  */
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#fffdf9] px-4 py-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e8e1d6] bg-white p-8 text-center shadow-sm">
          <PackageCheck className="mx-auto h-12 w-12 text-[#a59d91]" />

          <h1 className="mt-4 text-xl font-bold text-[#29241e]">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-[#827b71]">
            Add a product before proceeding to payment.
          </p>

          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Go to Cart
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#29241e] pb-10">
      <div className="mx-auto w-full max-w-[1180px] px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#827b71] hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Checkout
        </button>

        {/* Stepper */}
        <div className="mb-7 rounded-2xl border border-[#e8e1d6] bg-white p-4 sm:p-5 shadow-sm">
          <CheckoutStepper currentStep={3} />
        </div>

        {/* Page Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Payment
            </h1>
          </div>

          <p className="mt-1.5 text-sm text-[#827b71]">
            Review your order and complete your secure payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 lg:gap-7 items-start">
          {/* LEFT */}
          <section className="space-y-4">
            {/* Payment Method */}
            <div className="rounded-2xl border border-[#e8e1d6] bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-xs sm:text-sm text-[#827b71]">
                    Pay securely using Razorpay.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  SECURE
                </div>
              </div>

              <div className="mt-4 rounded-xl border-2 border-primary bg-[#f8faf5] p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                    <CreditCard className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold">Razorpay</p>

                    <p className="mt-0.5 text-xs text-[#827b71]">
                      UPI, Cards, Net Banking & supported methods
                    </p>
                  </div>

                  <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-green-600" />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="rounded-2xl border border-[#e8e1d6] bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#29241e]">
                    Delivery Details
                  </h2>

                  <p className="mt-1 text-xs text-[#827b71]">
                    Your selected delivery information
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf6e7] text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {/* Receiver Name */}
                <div className="rounded-xl bg-[#faf8f4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                    Receiver Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#29241e]">
                    {checkoutData?.receiverName?.trim()
                      ? checkoutData.receiverName
                      : "Not provided"}
                  </p>
                </div>

                {/* Receiver Number */}
                <div className="rounded-xl bg-[#faf8f4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                    Receiver Number
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#29241e]">
                    {checkoutData?.receiverNumber
                      ? checkoutData.receiverNumber
                      : "Not provided"}
                  </p>
                </div>

                {/* Full Address */}
                <div className="rounded-xl bg-[#faf8f4] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-relaxed text-[#29241e]">
                    {checkoutData?.address?.trim()
                      ? checkoutData.address
                      : "Address not provided"}
                  </p>
                </div>

                {/* Pincode / City / State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Pincode */}
                  <div className="rounded-xl bg-[#faf8f4] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                      Pincode
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#29241e]">
                      {checkoutData?.pincode
                        ? checkoutData.pincode
                        : "Not provided"}
                    </p>
                  </div>

                  {/* City */}
                  <div className="rounded-xl bg-[#faf8f4] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                      City
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#29241e]">
                      {checkoutData?.city?.trim()
                        ? checkoutData.city
                        : "Not provided"}
                    </p>
                  </div>

                  {/* State */}
                  <div className="rounded-xl bg-[#faf8f4] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                      State
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#29241e]">
                      {checkoutData?.state?.trim()
                        ? checkoutData.state
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Optional Receiver Message */}
                {checkoutData?.receiverMessage?.trim() && (
                  <div className="rounded-xl border border-[#e8e1d6] bg-[#fffdf9] p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💌</span>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                        Message for Receiver
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-[#29241e]">
                      {checkoutData.receiverMessage}
                    </p>
                  </div>
                )}

                {/* Delivery Slot */}
                <div className="rounded-xl border border-[#dfead8] bg-[#f8faf5] p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf6e7] text-primary">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#918a80]">
                        Delivery Slot
                      </p>

                      {/* Delivery Type */}
                      <p className="mt-1 text-sm font-bold text-[#29241e]">
                        {checkoutData?.deliveryType?.trim()
                          ? checkoutData.deliveryType
                          : "Delivery option not selected"}
                      </p>

                      {/* Selected Time */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-primary">
                          Selected Time:
                        </span>

                        <span className="text-xs font-medium text-[#29241e]">
                          {checkoutData?.timeSlot?.trim()
                            ? checkoutData.timeSlot
                            : "Time slot not selected"}
                        </span>
                      </div>

                      {/* Delivery Date */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-primary">
                          Delivery Date:
                        </span>

                        <span className="text-xs font-medium text-[#29241e]">
                          {checkoutData?.deliveryDate?.trim()
                            ? formatDeliveryDate(checkoutData.deliveryDate)
                            : "Delivery date not selected"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="rounded-2xl border border-[#e8e1d6] bg-white p-4 sm:p-5 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5">
                  <LockKeyhole className="h-5 w-5 text-primary shrink-0" />

                  <div>
                    <p className="text-xs font-bold">Secure Payment</p>

                    <p className="text-[10px] text-[#827b71]">
                      Protected checkout
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Smartphone className="h-5 w-5 text-primary shrink-0" />

                  <div>
                    <p className="text-xs font-bold">Multiple Methods</p>

                    <p className="text-[10px] text-[#827b71]">
                      UPI, cards & more
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />

                  <div>
                    <p className="text-xs font-bold">Trusted Gateway</p>

                    <p className="text-[10px] text-[#827b71]">
                      Powered by Razorpay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT / SUMMARY */}
          <aside className="lg:sticky lg:top-5">
            <div className="rounded-2xl border border-[#e8e1d6] bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold">Order Summary</h2>

              <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const quantity = Math.max(1, Number(item.quantity) || 1);

                  const lineTotal = Number(item.price || 0) * quantity;

                  return (
                    <div
                      key={`${item.id}-${item.isAddon ? "addon" : "product"}`}
                      className="flex gap-3"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f6f2ec] border border-[#eee5d8]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <PackageCheck className="h-5 w-5 text-[#a59d91]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs sm:text-sm font-semibold leading-tight line-clamp-2">
                            {item.title || item.productName || "Product"}
                          </p>

                          <p className="shrink-0 text-xs sm:text-sm font-bold">
                            {formatPrice(lineTotal)}
                          </p>
                        </div>

                        <p className="mt-1 text-[11px] text-[#827b71]">
                          Qty: {quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-[#e8e1d6] pt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-[#827b71]">
                  <span>
                    Subtotal ({cartItemCount}{" "}
                    {cartItemCount === 1 ? "item" : "items"})
                  </span>

                  <span className="font-semibold text-[#29241e]">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#827b71]">
                  <span>Delivery</span>

                  <span className="font-bold text-primary">FREE</span>
                </div>

                <div className="border-t border-dashed border-[#ddd8ce] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#29241e]">
                      Total Payable
                    </span>

                    <span className="text-xl font-bold text-primary">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {paymentError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  <p className="text-xs font-medium leading-relaxed">
                    {paymentError}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={openRazorpay}
                disabled={
                  isCreatingOrder || isVerifyingPayment || !razorpayLoaded
                }
                className="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingOrder || isVerifyingPayment ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />

                    {isVerifyingPayment
                      ? "Verifying Payment..."
                      : "Starting Payment..."}
                  </span>
                ) : !razorpayLoaded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Payment...
                  </span>
                ) : (
                  `Pay ${formatPrice(totalAmount)}`
                )}
              </button>

              <p className="mt-2 text-center text-[10px] leading-relaxed text-[#827b71]">
                You will be redirected to the secure Razorpay payment window.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
