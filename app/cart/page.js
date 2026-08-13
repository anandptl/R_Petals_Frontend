"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPadg93FcXSqkVhZcGUHBnODZwauQTQasavHVcRDYIrLuKojZe0TZjvE8b2o0vJcK-nqrJbF5NB2ooa4olOKYJrhQ8krUFjTqzo0XdqsPgpbVjMx04gC42RbzWRxUNFSgIjyy5QOBpglunfOQkoDupptRmvhm32fK5HIXMii3ycAYi4L0R6GqRtSHq7kW1HLmSSgkrOXa6p-7SI-b9g2IjayxEJlKX65JIKrlwQmP6ftfTF-aTNhggCQ",
    quantity: 1,
  },
];

const addOns = [
  {
    id: 101,
    title: "Scented Candle",
    price: 499,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCT4hvF4qN4zZWPLtAHHZsJnM1bMAzrymLpzTqXesgQOPtmJGgsD7npzFU2uEfrftZ57gHNK1QnyqMOEV3RRzv7zZ1CQ31pNsvZAphbdTG8n5T7Bin7Uu79FCQrhGvlXhvnH0F8cBed5v6UFuAXNwoa2DrxfBd2CRtN3hUoAf2p8-w8Jtl3HEIHA8P0Z1BHYErv0qhRtAKLp_R9bVyS84I1Mbj4lJyG8tJUtkytTdlIdCQCDB8hxjhWTQ",
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

const navLinks = [
  { label: "Flowers", href: "/categories/flowers" },
  { label: "Cakes", href: "/categories/cakes" },
  { label: "Occasions", href: "/categories/occasions" },
];

const footerColumns = [
  {
    title: "Company",
    links: ["About Us", "Franchise", "Careers", "Reviews"],
  },
  {
    title: "Support",
    links: ["Contact Us", "Shipping Info", "Returns & Refunds", "Order Tracking"],
  },
  {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Terms of Use", "Cookie Policy"],
  },
];

const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function CartPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);

  useEffect(() => {
    if (!localStorage.getItem("rpetalsUser")) {
      router.replace("/login?redirect=/cart");
      return;
    }

    setAuthChecked(true);
  }, [router]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gst = Math.round(subtotal * 0.12);
    const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      gst,
      totalPayable: subtotal,
      totalItemsCount,
    };
  }, [cartItems]);

  const handleQuantityChange = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleAddAddon = () => {
    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/cart");
      return;
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 text-center">
        <div>
          <span className="material-symbols-outlined text-primary text-[36px] animate-pulse">shopping_bag</span>
          <p className="mt-3 font-label-lg text-label-lg text-on-surface-variant">
            Checking your login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface pb-20 md:pb-0">
      <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-3 sm:px-4 md:px-lg max-w-container-max mx-auto h-16 md:h-[90px] gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-4 flex-shrink-0">
            <Image
              alt="R Petals Logo"
              src="/logo1.png"
              width={0}
              height={0}
              sizes="100vw"
              className="h-10 md:h-[70px] w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-11 pr-4 py-2.5 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-secondary"
                placeholder="Gifts for your loved ones..."
                type="text"
              />
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]" />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 rounded-full hover:bg-surface-container transition-all text-on-surface-variant hover:text-primary">
              <Icon name="notifications_active" className="text-[24px]" />
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container transition-all text-on-surface-variant hover:text-primary">
              <Icon name="account_circle" className="text-[24px]" />
            </button>
            <button className="p-2.5 rounded-full bg-primary text-white shadow-md relative">
              <Icon name="shopping_bag" className="text-[22px]" />
              <span className="absolute top-0 right-0 bg-[#BF9B30] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totals.totalItemsCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto w-full px-3 sm:px-4 md:px-md py-6 md:py-lg">
        <div className="mb-6 md:mb-lg">
          <h1 className="font-headline-lg text-[32px] leading-tight md:text-headline-lg text-on-surface mb-1">Your Shopping Cart</h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-on-surface-variant font-label-lg text-sm md:text-label-lg">
            <span>{totals.totalItemsCount} Items</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span>Express Delivery Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-lg items-start">
          <section className="lg:col-span-8 space-y-6">
            {cartItems.length === 0 ? (
              <div className="p-10 md:p-12 text-center bg-surface rounded-xl border border-outline-variant shadow-sm">
                <Icon name="shopping_bag" className="text-[48px] mx-auto text-outline mb-3" />
                <p className="text-lg font-medium text-on-surface">Your cart is currently empty.</p>
                <Link
                  href="/categories/flowers"
                  className="mt-4 inline-flex px-6 py-2.5 bg-primary text-white font-medium rounded-lg text-sm hover:opacity-90 transition-all"
                >
                  Explore Collections
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[128px_minmax(0,1fr)] md:flex md:flex-row gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-surface border border-outline-variant rounded-xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-container">
                    <Image alt={item.title} src={item.image} fill unoptimized className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-grow flex flex-col justify-between gap-4 md:gap-5">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <h2 className="font-headline-md text-[20px] md:text-[24px] leading-tight text-on-surface break-words">{item.title}</h2>
                        <p className="font-headline-md text-[20px] md:text-[24px] text-primary whitespace-nowrap">{formatPrice(item.price)}</p>
                      </div>
                      <p className="text-on-surface-variant text-sm font-medium mt-1">{item.subtitle}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.badges.map((badge, index) => (
                          <span
                            key={badge}
                            className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                              index === 0 ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center border border-outline-variant rounded-full px-2 py-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors rounded-full"
                          aria-label={`Decrease ${item.title} quantity`}
                        >
                          <Icon name="remove" className="text-[18px]" />
                        </button>
                        <span className="px-3 sm:px-4 font-bold text-on-surface min-w-10 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface-container transition-colors rounded-full"
                          aria-label={`Increase ${item.title} quantity`}
                        >
                          <Icon name="add" className="text-[18px]" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center gap-1 text-error text-sm font-semibold hover:underline transition-all"
                      >
                        <Icon name="delete" className="text-[18px]" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}

            <section className="mt-10">
              <h2 className="font-headline-md text-[24px] md:text-[28px] mb-4 text-on-surface">Make it extra special?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {addOns.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => handleAddAddon()}
                    className="min-w-0 p-2 bg-surface border border-outline-variant rounded-xl text-center group cursor-pointer hover:border-primary transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 relative bg-surface-container">
                      <Image alt={addon.title} src={addon.image} fill unoptimized className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-sm font-medium text-on-surface truncate">{addon.title}</p>
                    <p className="font-bold text-primary text-sm mt-0.5">Add {formatPrice(addon.price)}</p>
                  </button>
                ))}
              </div>
            </section>
          </section>

          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-surface-container p-4 sm:p-5 md:p-6 rounded-xl border border-outline-variant shadow-sm">
              <h2 className="font-headline-md text-[24px] md:text-[28px] text-on-surface mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-outline-variant text-sm">
                <div className="flex justify-between gap-4 text-on-surface-variant">
                  <span>Subtotal ({totals.totalItemsCount} items)</span>
                  <span className="font-semibold whitespace-nowrap">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4 text-on-surface-variant">
                  <span>Delivery Charges</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <div className="flex justify-between gap-4 text-on-surface-variant">
                  <span>GST (Inc. 12%)</span>
                  <span className="whitespace-nowrap">{formatPrice(totals.gst)}</span>
                </div>
                <button
                  className="flex items-center gap-1.5 text-primary font-semibold py-1 hover:opacity-80 transition-opacity"
                >
                  <Icon name="sell" className="text-[18px]" />
                  Apply Coupon Code
                </button>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:justify-between sm:items-end gap-3 mb-8">
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant">Total Payable</p>
                  <p className="font-headline-lg text-[32px] md:text-[36px] font-semibold text-primary whitespace-nowrap">{formatPrice(totals.totalPayable)}</p>
                </div>
                <p className="text-[10px] text-white font-bold uppercase tracking-widest bg-[#BF9B30] px-2.5 py-1 rounded w-fit">
                  You save ₹500
                </p>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                disabled={cartItems.length === 0}
                className="w-full py-4 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-soft hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <Icon name="arrow_forward" className="text-[18px]" />
              </button>
              <p className="text-[11px] text-on-surface-variant text-center px-4 mt-3">
                Secure payment powered by R Petals Gate. We accept all major cards and UPI.
              </p>

              <div className="mt-8 pt-6 border-t border-outline-variant grid grid-cols-3 gap-2">
                {[
                  { icon: "shield", label: "100% Secure" },
                  { icon: "local_florist", label: "Fresh Flowers" },
                  { icon: "qr_code_2", label: "Fast Delivery" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center gap-1">
                    <Icon name={item.icon} className="text-primary text-[22px]" />
                    <span className="text-[9px] font-bold uppercase text-on-surface-variant">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-surface border border-outline-variant rounded-xl flex items-start gap-3 shadow-sm">
              <Icon name="help" className="text-primary text-[22px] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-on-surface">Need help with your order?</p>
                <p className="text-xs text-on-surface-variant">Call us at 1800-RPETALS or chat with our experts.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-surface-container-low mt-16 border-t border-outline-variant">
        <div className="w-full py-12 px-6 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Image
                alt="R Petals Logo"
                src="/logo1.png"
                width={0}
                height={0}
                sizes="100vw"
                className="h-20 w-full max-w-[220px] object-contain mb-4"
              />
              <p className="text-sm text-on-surface-variant mb-4">
                Crafting moments of joy through nature's most beautiful creations. Your premium destination for flowers, cakes, and artisanal gifts.
              </p>
              <div className="flex gap-3 text-primary">
                <Icon name="qr_code_2" className="text-[22px]" />
                <Icon name="photo_camera" className="text-[22px]" />
                <Icon name="mail" className="text-[22px]" />
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="font-label-lg text-label-lg text-on-surface mb-4">{column.title}</h3>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} R Petals. All rights reserved. Flowers that speak.</p>
            <div className="flex gap-4 text-on-surface-variant">
              <Icon name="credit_card" className="text-[24px]" />
              <Icon name="account_balance_wallet" className="text-[24px]" />
            </div>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 md:hidden bg-surface rounded-t-xl shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] border-t border-outline-variant">
        {[
          { label: "Home", icon: "home", href: "/" },
          { label: "Categories", icon: "grid_view", href: "/categories/flowers" },
          { label: "Occasions", icon: "celebration", href: "/categories/occasions" },
          { label: "Cart", icon: "shopping_bag", href: "/cart", active: true },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center active:scale-95 transition-transform ${
              item.active ? "text-primary font-bold scale-105" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon name={item.icon} className="text-[22px]" />
            <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
