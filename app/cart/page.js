"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const LOCAL_CART_KEY = "local-cart";

const initialCartItems = [
  {
    id: 1,
    title: "Crimson Elegance Bouquet",
    price: 2499,
    subtitle: "Occasion: Anniversary Special",
    badges: ["Premium Grade", "Same Day Delivery"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByehVGkCHLfSy5gY2qEQUDJ64eGmrNZjvGHOW2JmVbmEN43avh1WAWqoeBAaFeMtjM1e7nW34k_Kj1pNpWwh-GxVFAhc1jP-wDoxIPTc10RhAwqChWpnz-nRuZK0jraJ4EdNvFiqfC37CZ13XXSky1Vh4Ue95N_KuzSCYY1hpO0D8qYNjgeS0BPC9SAfQhayduiJON71OASsUJsZZNemx6gnooK0daCt4qwr6NtLcLz-rT65uVoPW8HA",
    quantity: 1,
  },
  {
    id: 2,
    title: "The Luxe Midnight Hamper",
    price: 4850,
    subtitle: "Category: Personalised LUXE",
    badges: ["Handcrafted", "Free Greeting Card"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPadg93FcXSqkVhZcGUHBnODZwauQTQasavHVcRDYIrLuKojZe0TZvje8b2o0vJcK-nqrJbF5NB2ooa4olOKYJrhQ8krUFjTqzo0XdqsPgpbVjMx04gC42RbzWRxUNFSgIjyy5QOBpglunfOQkoDupptRmvhm32fK5HIXMii3ycAYi4L0R6GqRtSHq7kW1HLmSSgkrOXa6p-7SI-b9g2IjayxEJlKX65JIKrlwQmP6ftfTF-aTNhggCQ",
    quantity: 1,
  },
];

const addOns = [
  {
    id: 101,
    title: "Scented Candle",
    price: 499,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCT4hvF4qN4zZWPLtAHHZsJnM1bMAzrymLpzTqXesgQOPtmJGgsD7npzFU2uEfrftZ57gHNK1QnyqMOEV3RRzv7zZ1CQ31pNsvZAphbdTG8n5T7Bin7u79FCQrhGvlXhvnH0F8cBed5v6UFuAXNwoa2DrxfBd2CRtN3hUoAf2p8-w8Jtl3HEIHA8P0Z1BHYErv0qhRtAKLp_R9bVyS84I1Mbj4lJyG8tJUtkytTdlIdCQCDB8hxjhWTQ",
  },
  {
    id: 102,
    title: "Premium Card",
    price: 199,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBuzp5SdilhEu-c_FH43-2VGhXAk4Z8nWd1AQdqzZYg8irolxd-2Rckj3BC2mTWo5vTgB1E4I2DXGIw_feUMh-7Q3D6w7rSzr5iKcJxtia8MWwGQQ147Vcps0-UuN088yYFcXXseEJGXaspbgLgwxLUKKChNomL2HSUKbcJGj_9T16QXPSBhBtUKc1-2uFKMnAGiSkcoNIym0NoJ36Ij2PJIfKy_BPwK0UpS3yh1hnaUHoRnzrBcwJqPg",
  },
  {
    id: 103,
    title: "Glass Vase",
    price: 750,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8NtXNTXsDwHmw2oo946eYu8_twRM2MkUFovKNf1VZF-Q4gl2t03XjZ_xGqB_mR8EE3TStINgRBedBxltbG9OJ49znd1HpxEB2M8jmuifDyNR6h7NENCbV1khtolnVA5C_XqoPYKkf_GPdJiEUU8IcSUSvVx-vMf4Wg_TJoSERlFnavTrQ5uAsTtZDn3Qmg3uAbD5Tl-tSLn_JAXSMaoNI4MeJFj5LYdmpaP4KHWhKs0X7dWyF-N6vpg",
  },
  {
    id: 104,
    title: "Sweet Treat",
    price: 899,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrXZwxH-vIlWU1EKj6-bm3px2JWzANpMDLuM3TfH6TitSi7L8T3yw431ycirdCju_j5XSWYYbIFgNsoXe4yr7qX06dpJVGO_thVzhXHUpMKt2UWMtWuoMizZKiqoLWXFZvUor0M4mHKPiqKAGLzyUf_dt4jQSG4I5Qaq2k-naDG1Hx5yMXTEcBNL8fPsO3sAo714k3mXLigiwrLJzQ_3p5UOnfUuuQLNqLM5cmm_X0ooLMEMxw595YOg",
  },
];

const accountMenuItems = [
  { icon: "account_circle", label: "My Profile", href: "/profile" },
  { icon: "receipt_long", label: "Orders", href: "/orders" },
  { icon: "location_on", label: "Saved Addresses", href: "/addresses" },
  { icon: "favorite", label: "Wishlist", href: "/wishlist" },
  { icon: "notifications", label: "Notifications", href: "/notifications" },
];

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}

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

const normalizeCartItem = (item) => ({
  ...item,
  quantity: Math.max(1, Number(item?.quantity) || 1),
  price: Number(item?.price) || 0,
});

export default function CartPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/cart");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const storedCart = readLocalCart();

    if (storedCart.length > 0) {
      setCartItems(storedCart.map(normalizeCartItem));
    } else {
      setCartItems([]);
    }

    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;

    try {
      localStorage.setItem(
        LOCAL_CART_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save local cart:", error);
    }
  }, [cartItems, cartLoaded]);

  const handleLogout = () => {
    logout();
    setAccountSheetOpen(false);
    router.push("/");
  };

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item?.price || 0) *
          Math.max(1, Number(item?.quantity) || 1),
      0
    );

    const totalItemsCount = cartItems.reduce(
      (sum, item) =>
        sum + Math.max(1, Number(item?.quantity) || 1),
      0
    );

    return {
      subtotal,
      totalPayable: subtotal,
      totalItemsCount,
    };
  }, [cartItems]);

  const handleQuantityChange = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Number(item.quantity || 1) + delta
              ),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((items) =>
      items.filter((item) => item.id !== id)
    );
  };

  const handleAddAddon = (addon) => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    setCartItems((items) => {
      const existingAddon = items.find(
        (item) =>
          item.id === addon.id &&
          item.isAddon === true
      );

      if (existingAddon) {
        return items.map((item) =>
          item.id === addon.id && item.isAddon === true
            ? {
                ...item,
                quantity:
                  Math.max(1, Number(item.quantity) || 1) + 1,
              }
            : item
        );
      }

      return [
        ...items,
        {
          id: addon.id,
          title: addon.title,
          productName: addon.title,
          price: Number(addon.price) || 0,
          quantity: 1,
          image: addon.image,
          subtitle: "Add-on",
          badges: ["Add-on"],
          isAddon: true,
        },
      ];
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] bg-background flex items-center justify-center px-4 text-center">
        <div>
          <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">
            shopping_bag
          </span>

          <p className="mt-2 text-xs font-medium text-on-surface-variant">
            Checking your login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface pb-16 md:pb-8">
      <main className="max-w-container-max mx-auto w-full px-3 sm:px-4 md:px-6 py-3 sm:py-5 md:py-6">
        {/* Page Title Header */}
        <div className="mb-3 sm:mb-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Your Shopping Cart
          </h1>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant">
            <span className="font-semibold text-primary">
              {totals.totalItemsCount} Items
            </span>

            <span className="w-1 h-1 rounded-full bg-outline-variant" />

            <span>Express Delivery Available</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-6 items-start">
          {/* Left Column */}
          <section className="lg:col-span-8 space-y-3 sm:space-y-4">
            {cartItems.length === 0 ? (
              <div className="p-8 text-center bg-surface rounded-xl border border-outline-variant shadow-sm">
                <Icon
                  name="shopping_bag"
                  className="text-[40px] mx-auto text-outline mb-2"
                />

                <p className="text-base font-medium text-on-surface">
                  Your cart is currently empty.
                </p>

                <Link
                  href="/categories/flowers"
                  className="mt-3 inline-flex px-5 py-2 bg-primary text-white font-medium rounded-lg text-xs hover:opacity-90 transition-all"
                >
                  Explore Collections
                </Link>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <article
                  key={`${item.id}-${item.isAddon ? "addon" : "product"}`}
                  className="flex gap-3 sm:gap-4 p-2.5 sm:p-4 bg-surface border border-outline-variant rounded-xl hover:shadow-md transition-shadow duration-200"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-container-low border border-outline-variant/50">
                    {item.image ? (
                      <Image
                        alt={item.title || item.productName || "Product"}
                        src={item.image}
                        fill
                        unoptimized
                        priority={index === 0}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary">
                        <Icon
                          name="local_florist"
                          className="text-[28px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="text-xs sm:text-base md:text-lg font-bold text-on-surface leading-tight line-clamp-1">
                          {item.title || item.productName || "Product"}
                        </h2>

                        <p className="text-xs sm:text-base md:text-lg font-bold text-primary whitespace-nowrap">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                        {item.subtitle || (item.isAddon ? "Add-on" : "")}
                      </p>

                      {Array.isArray(item.badges) &&
                        item.badges.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {item.badges.map((badge, idx) => (
                              <span
                                key={`${item.id}-${badge}-${idx}`}
                                className={`px-1.5 py-0.5 text-[9px] font-semibold rounded uppercase tracking-wider ${
                                  idx === 0
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "bg-surface-container text-on-surface-variant"
                                }`}
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-outline-variant/30">
                      <div className="flex items-center border border-outline-variant rounded-full bg-surface-container-lowest">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.id, -1)
                          }
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-surface-container transition-colors rounded-full"
                          aria-label={`Decrease ${
                            item.title || item.productName || "Product"
                          } quantity`}
                        >
                          <Icon
                            name="remove"
                            className="text-[14px] sm:text-[16px]"
                          />
                        </button>

                        <span className="px-2 sm:px-3 text-xs sm:text-sm font-bold text-on-surface min-w-6 text-center">
                          {Math.max(
                            1,
                            Number(item.quantity) || 1
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item.id, 1)
                          }
                          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-surface-container transition-colors rounded-full"
                          aria-label={`Increase ${
                            item.title || item.productName || "Product"
                          } quantity`}
                        >
                          <Icon
                            name="add"
                            className="text-[14px] sm:text-[16px]"
                          />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center gap-0.5 text-error text-[11px] sm:text-xs font-semibold hover:underline transition-all"
                      >
                        <Icon
                          name="delete"
                          className="text-[15px] sm:text-[16px]"
                        />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}

            {/* Add-ons Section */}
            <section className="pt-2">
              <h2 className="text-sm sm:text-base md:text-lg font-bold mb-2.5 text-on-surface">
                Make it extra special?
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {addOns.map((addon, index) => (
                  <button
                    type="button"
                    key={addon.id}
                    onClick={() => handleAddAddon(addon)}
                    className="min-w-0 p-2 bg-surface border border-outline-variant rounded-xl text-center group cursor-pointer hover:border-primary transition-all shadow-sm"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-1.5 relative bg-surface-container-low">
                      <Image
                        alt={addon.title}
                        src={addon.image}
                        fill
                        unoptimized
                        priority={index === 0}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <p className="text-[11px] sm:text-xs font-medium text-on-surface truncate">
                      {addon.title}
                    </p>

                    <p className="font-bold text-primary text-[11px] sm:text-xs mt-0.5">
                      + {formatPrice(addon.price)}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </section>

          {/* Right Column */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-surface-container-low p-3.5 sm:p-5 rounded-xl border border-outline-variant shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-on-surface mb-3 pb-2 border-b border-outline-variant">
                Order Summary
              </h2>

              <div className="space-y-2 mb-3 pb-3 border-b border-outline-variant text-xs sm:text-sm">
                <div className="flex justify-between gap-2 text-on-surface-variant">
                  <span>
                    Subtotal ({totals.totalItemsCount}{" "}
                    {totals.totalItemsCount === 1 ? "item" : "items"})
                  </span>

                  <span className="font-semibold text-on-surface">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-2 text-on-surface-variant">
                  <span>Delivery Charges</span>

                  <span className="text-primary font-bold">
                    FREE
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-on-surface-variant uppercase">
                    Total Payable
                  </p>

                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {formatPrice(totals.totalPayable)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                disabled={cartItems.length === 0}
                className="w-full py-2.5 sm:py-3 bg-primary text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                Proceed to Checkout

                <Icon
                  name="arrow_forward"
                  className="text-[16px]"
                />
              </button>

              <p className="text-[10px] text-on-surface-variant text-center mt-2 opacity-80">
                100% Secure Checkout with Cards & UPI
              </p>

              {/* Trust Badges */}
              <div className="mt-3.5 pt-3 border-t border-outline-variant/60 grid grid-cols-3 gap-1">
                {[
                  {
                    icon: "shield",
                    label: "100% Secure",
                  },
                  {
                    icon: "local_florist",
                    label: "Fresh Blooms",
                  },
                  {
                    icon: "qr_code_2",
                    label: "Fast Delivery",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center text-center gap-0.5"
                  >
                    <Icon
                      name={item.icon}
                      className="text-primary text-[18px]"
                    />

                    <span className="text-[8px] sm:text-[9px] font-bold uppercase text-on-surface-variant">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help Box */}
            <div className="mt-3 p-3 bg-surface border border-outline-variant rounded-xl flex items-center gap-2.5 shadow-sm">
              <Icon
                name="help"
                className="text-primary text-[20px] flex-shrink-0"
              />

              <div>
                <p className="text-xs font-semibold text-on-surface leading-tight">
                  Need help with order?
                </p>

                <p className="text-[10px] text-on-surface-variant">
                  Call 1800-RPETALS or chat with our experts.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Account Bottom Sheet */}
      {accountSheetOpen && user && (
        <div
          className="fixed inset-0 z-[70] md:hidden"
          onClick={() => setAccountSheetOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 w-full bg-surface rounded-t-2xl shadow-lg p-4 pb-6 max-h-[75vh] overflow-y-auto"
          >
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-3" />

            <div className="flex items-center gap-3 px-1 py-1 mb-2">
              <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "R"}
              </span>

              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">
                  {user.name || "My Account"}
                </span>

                <span className="text-[10px] text-on-surface-variant">
                  +91 {user.phoneNumber}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              {accountMenuItems.map((menuItem) => (
                <Link
                  key={menuItem.label}
                  href={menuItem.href}
                  onClick={() => setAccountSheetOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {menuItem.icon}
                  </span>

                  <span>{menuItem.label}</span>
                </Link>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all text-left text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>

                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}