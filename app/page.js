"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


// API: GET /api/categories — fetch all categories with name, icon, sub-items
const categories = [
  {
    name: "Flowers",
    icon: "local_florist",
    items: [
      "Roses",
      "Tulips",
      "Orchids",
      "Lilies",
      "Sunflowers",
      "Mixed Bouquets",
    ],
  },
  {
    name: "Cakes",
    icon: "cake",
    items: [
      "Chocolate Cakes",
      "Eggless Cakes",
      "Photo Cakes",
      "Cupcakes",
      "Cheesecakes",
      "Fondant Cakes",
    ],
  },
  {
    name: "Personalised",
    icon: "redeem",
    items: [
      "Photo Frames",
      "Custom Mugs",
      "Engraved Gifts",
      "Name Cushions",
      "Memory Books",
    ],
  },
  {
    name: "Plants",
    icon: "potted_plant",
    items: [
      "Indoor Plants",
      "Succulents",
      "Bonsai",
      "Air Purifiers",
      "Flowering Plants",
      "Terrariums",
    ],
  },
  {
    name: "Combos",
    icon: "celebration",
    items: [
      "Flower & Cake",
      "Flower & Chocolate",
      "Hamper Boxes",
      "Spa Combos",
      "Gourmet Combos",
    ],
  },
  {
    name: "LUXE",
    icon: "diamond",
    items: [
      "Premium Roses",
      "Exotic Orchids",
      "Luxury Hampers",
      "Gold Dipped Flowers",
      "Bespoke Arrangements",
    ],
  },
  {
    name: "Gourmet",
    icon: "nest_eco_leaf",
    items: [
      "Chocolates",
      "Dry Fruits",
      "Cookies & Brownies",
      "Wine & Cheese",
      "Artisan Sweets",
    ],
  },
];

// API: GET /api/products/bestsellers — fetch bestseller products (limit: 4)
const products = [
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

const navLinks = [
  "Flowers",
  "Cakes",
  "Plants",
  "Personalised",
  "Occasions",
  "LUXE",
];

const occasionsItems = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Valentine's Day",
  "Mother's Day",
  "Farewell",
];

const footerCompany = ["About Us", "Contact Us", "Franchise", "Careers"];
const footerSupport = [
  "Shipping Info",
  "Terms & Conditions",
  "Privacy Policy",
  "FAQs",
];
const footerCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Dubai",
];

const bottomNav = [
  { label: "Home", icon: "home", href: "/", active: true },
  { label: "Categories", icon: "grid_view", href: "/categories/flowers" },
  { label: "Occasions", icon: "celebration", href: "/categories/occasions" },
  { label: "Cart", icon: "shopping_bag", href: "/cart" },
];

function NavDropdown({ item, index, cat, isMobile = false }) {
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl border border-outline-variant text-sm text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all"
        >
          <span>{item}</span>
          {cat && (
            <span
              className="material-symbols-outlined text-[16px] transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              expand_more
            </span>
          )}
        </button>
        {open && cat && (
          <div className="mt-1.5 ml-2 flex flex-wrap gap-1.5 pl-2 border-l-2 border-primary/20">
            {cat.items.map((subItem) => (
              <a
                key={subItem}
                href="#"
                className="px-3 py-1 text-xs rounded-full bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white transition-all"
              >
                {subItem}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href="#"
        className={`font-label-lg text-label-lg transition-colors flex items-center gap-1 ${
          index === 0
            ? "text-primary border-b-2 border-primary pb-1"
            : "text-on-surface-variant hover:text-primary"
        }`}
      >
        {item === "LUXE" ? (
          <span className="flex items-center gap-1">
            LUXE{" "}
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          </span>
        ) : (
          item
        )}
      </a>
      {open && cat && (
        <div
          className={`absolute top-full mt-1 z-[100] min-w-[170px] bg-surface border border-outline-variant shadow-lg py-2 ${
            index >= 4 ? "right-0" : "left-1/2 -translate-x-1/2"
          }`}
          style={{ borderRadius: "12px" }}
        >
          {cat.items.map((subItem) => (
            <a
              key={subItem}
              href="#"
              className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors whitespace-nowrap"
            >
              {subItem}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const categoryRoutes = {
  Flowers: "/categories/flowers",
  Cakes: "/categories/cakes",
  Plants: "/categories/plants",
  Personalised: "/categories/personalised",
  Combos: "/categories/combos",
  LUXE: "/categories/luxe",
  Gourmet: "/categories/gourmet",
};

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Accordion state for mobile footer
  const [footerCompanyOpen, setFooterCompanyOpen] = useState(false);
  const [footerSupportOpen, setFooterSupportOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("rpetalsUser");
    setUser(null);
    setMenuOpen(false);
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/cart");
      return;
    }
  };

  const handleBuyNow = (event) => {
    event.preventDefault();
    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  useEffect(() => {
    const header = document.querySelector("header");
    const storedUser = localStorage.getItem("rpetalsUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("rpetalsUser");
      }
    }

    const handleScroll = () => {
      if (window.pageYOffset > 50) {
        header?.classList.add("shadow-md");
      } else {
        header?.classList.remove("shadow-md");
      }
    };
    window.addEventListener("scroll", handleScroll);

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
      { threshold: 0.1 },
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="bg-surface sticky top-0 z-[60] shadow-sm border-b border-outline-variant transition-all duration-300">
        <div className="flex items-center w-full px-3 sm:px-4 md:px-6 max-w-container-max mx-auto h-16 md:h-[90px] gap-2 sm:gap-4 md:gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/logo1.png"
              alt="R Petals Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="h-9 sm:h-11 md:h-[70px] w-auto object-contain"
            />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-full px-12 py-2.5 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-secondary"
                placeholder="Gifts for your loved ones..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">
                search
              </span>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="flex md:hidden flex-1 max-w-[180px] min-[480px]:max-w-xs">
            <div className="relative w-full">
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-8 pr-3 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-secondary"
                placeholder="Search..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-[16px]">
                search
              </span>
            </div>
          </div>

          {/* Desktop Trailing Actions */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {[
              { icon: "notifications_active", label: "Alerts" },
              { icon: "currency_rupee", label: "INR" },
              { icon: "shopping_cart", label: "Cart", href: "/cart" },
            ].map((item) => {
              const className =
                "text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center gap-0.5";
              const content = (
                <>
                  <span className="material-symbols-outlined text-[24px]">
                    {item.icon}
                  </span>
                  <span className="font-label-sm text-label-sm hidden lg:block text-[11px]">
                    {item.label}
                  </span>
                </>
              );

              return item.href ? (
                <Link key={item.icon} href={item.href} className={className}>
                  {content}
                </Link>
              ) : (
                <button key={item.icon} className={className}>
                  {content}
                </button>
              );
            })}
            {user ? (
              <div
                className="relative flex items-center gap-3 border-l border-outline-variant pl-4"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-label-lg text-label-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : "R"}
                  </span>
                  <span className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="font-label-sm text-[11px] text-on-surface-variant">
                      {user.name ? "Welcome" : "Profile"}
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface">
                      {user.name ? user.name : user.phoneNumber}
                    </span>
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px] transition-transform duration-200"
                    style={{
                      transform: profileMenuOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    expand_more
                  </span>
                </button>

                {/* HOVER DROPDOWN LIST */}
                {profileMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 z-[100] min-w-[210px] bg-surface border border-outline-variant shadow-lg py-2"
                    style={{ borderRadius: "12px" }}
                  >
                    {[
                      {
                        icon: "account_circle",
                        label: "My Profile",
                        href: "/profile",
                      },
                      {
                        icon: "receipt_long",
                        label: "Orders",
                        href: "/orders",
                      },
                      {
                        icon: "location_on",
                        label: "Saved Addresses",
                        href: "/addresses",
                      },
                      {
                        icon: "favorite",
                        label: "Wishlist",
                        href: "/wishlist",
                      },
                      {
                        icon: "notifications",
                        label: "Notifications",
                        href: "/notifications",
                      },
                    ].map((menuItem) => (
                      <Link
                        key={menuItem.label}
                        href={menuItem.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          {menuItem.icon}
                        </span>
                        {menuItem.label}
                      </Link>
                    ))}

                    <hr className="my-1.5 border-outline-variant" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        logout
                      </span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 bg-primary text-white rounded-full font-label-lg text-label-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile: Cart + User Icon */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <Link
              href="/cart"
              className="text-on-surface-variant hover:text-primary transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[22px]">
                shopping_cart
              </span>
            </Link>
            
            {/* Replaced 3-line hamburger with User Icon */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-on-surface-variant hover:text-primary transition-colors p-1 flex items-center justify-center"
              aria-label="User Account"
            >
              {user ? (
                <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "R"}
                </span>
              ) : (
                <span className="material-symbols-outlined text-[24px]">
                  account_circle
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-center border-t border-outline-variant py-2 bg-surface">
          <div className="flex gap-8">
            {navLinks.map((item, index) => {
              const cat =
                categories.find((c) => c.name === item) ||
                (item === "Occasions" ? { items: occasionsItems } : null);
              return (
                <NavDropdown key={item} item={item} index={index} cat={cat} />
              );
            })}
          </div>
        </nav>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="md:hidden bg-surface border-t border-outline-variant shadow-lg max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 py-3">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-semibold">
                Account
              </p>
              <div className="flex flex-col gap-1">
                {user ? (
                  <>
                    <button
                      onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                      className="w-full flex items-center justify-between gap-3 px-2 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-label-lg text-label-lg">
                          {user.name ? user.name.charAt(0).toUpperCase() : "R"}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-medium text-on-surface">
                            {user.name ? user.name : "My Profile"}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            +91 {user.phoneNumber}
                          </span>
                        </span>
                      </div>
                      <span
                        className="material-symbols-outlined text-[20px] transition-transform duration-200"
                        style={{ transform: mobileProfileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        expand_more
                      </span>
                    </button>

                    {/* EXPANDABLE LIST */}
                    {mobileProfileOpen && (
                      <div className="ml-2 pl-3 border-l-2 border-primary/20 flex flex-col gap-1 mb-1">
                        {[
                          { icon: "account_circle", label: "My Profile", href: "/profile" },
                          { icon: "receipt_long", label: "Orders", href: "/orders" },
                          { icon: "location_on", label: "Saved Addresses", href: "/addresses" },
                          { icon: "favorite", label: "Wishlist", href: "/wishlist" },
                          { icon: "notifications", label: "Notifications", href: "/notifications" },
                        ].map((menuItem) => (
                          <Link
                            key={menuItem.label}
                            href={menuItem.href}
                            onClick={() => {
                              setMenuOpen(false);
                              setMobileProfileOpen(false);
                            }}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[19px]">
                              {menuItem.icon}
                            </span>
                            {menuItem.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all text-left"
                    >
                      <span className="material-symbols-outlined text-[22px]">logout</span>
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-primary hover:bg-surface-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[22px]">login</span>
                    <span className="text-sm font-semibold">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-3 sm:pt-4 md:pt-6">
          <div className="max-w-container-max mx-auto px-3 sm:px-4">
            {/* Mobile Hero */}
            <div className="md:hidden relative rounded-2xl overflow-hidden bg-surface-container shadow-xl min-h-[350px] min-[480px]:min-h-[380px] sm:min-h-[420px] flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDa0Va4ArSi3WShtViA077fsL0IdoyAn4geB0a4tauku3kBBGsLbOGmxB5MeirhT5v4-3euRMFVOYeVyRrlLUJEwoWaocncaZt4bwFFnvM-pHF8BBoppeEjJsJTKqnum6K8lwGlfoQga1D-x4eIIS_2JEwTs7MEGLdm3egc9HYBkU1Kh0q_gK2xBYs2_yDivgKbpLF6BdRq3Zuk_S8_i-hMQ2CXWp5S4ULx6LjIXsoRTdOGbmmR5nQUgA')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#fbf9f8]/40 via-[#fbf9f8]/75 to-[#fbf9f8]/95" />
              <div className="relative z-10 p-4 min-[480px]:p-5 sm:p-6">
                <span className="inline-block w-fit px-3 py-0.5 min-[480px]:py-1 bg-primary text-white rounded-full text-xs font-semibold mb-2 sm:mb-3">
                  New Season
                </span>
                <h1 className="text-xl min-[480px]:text-2xl sm:text-[28px] font-serif font-bold text-on-surface mb-1.5 sm:mb-2 leading-tight">
                  Send Love <br />
                  <span className="text-primary italic">Beyond Borders</span>
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-4 sm:mb-5">
                  Handcrafted bouquets & curated gifts. Same-day delivery across
                  300+ cities.
                </p>
                <div className="flex gap-2.5 sm:gap-3">
                  <button className="flex-1 py-2 min-[480px]:py-2.5 bg-primary text-white rounded-full text-xs sm:text-sm font-semibold hover:shadow-lg transition-all active:scale-95">
                    Order Now
                  </button>
                  <button className="flex-1 py-2 min-[480px]:py-2.5 border-2 border-primary text-primary rounded-full text-xs sm:text-sm font-semibold hover:bg-primary/5 transition-all active:scale-95">
                    View Luxe
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Hero */}
            <div className="hidden md:block relative rounded-2xl overflow-hidden aspect-[3/1] bg-surface-container shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDa0Va4ArSi3WShtViA077fsL0IdoyAn4geB0a4tauku3kBBGsLbOGmxB5MeirhT5v4-3euRMFVOYeVyRrlLUJEwoWaocncaZt4bwFFnvM-pHF8BBoppeEjJsJTKqnum6K8lwGlfoQga1D-x4eIIS_2JEwTs7MEGLdm3egc9HYBkU1Kh0q_gK2xBYs2_yDivgKbpLF6BdRq3Zuk_S8_i-hMQ2CXWp5S4ULx6LjIXsoRTdOGbmmR5nQUgA')",
                }}
              />
              <div className="absolute inset-0 flex items-center px-8 lg:px-12 bg-gradient-to-r from-[#fbf9f8]/90 via-[#fbf9f8]/60 to-transparent">
                <div className="max-w-xl">
                  <span className="inline-block px-4 py-1 bg-primary text-white rounded-full font-label-lg text-label-lg mb-4 animate-bounce">
                    New Season
                  </span>
                  <h1 className="font-display-lg text-display-lg text-on-surface mb-4 leading-tight">
                    Send Love <br />
                    <span className="text-primary italic">Beyond Borders</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                    Celebrate your bond with handcrafted bouquets and curated
                    gifts. Same-day delivery available across 300+ cities.
                  </p>
                  <div className="flex gap-4">
                    <button className="px-8 py-3 bg-primary text-white rounded-full font-label-lg text-label-lg hover:shadow-lg hover:scale-105 transition-all">
                      Order Now
                    </button>
                    <button className="px-8 py-3 border-2 border-primary text-primary rounded-full font-label-lg text-label-lg hover:bg-primary/5 transition-all">
                      View Luxe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Bar */}
        <section className="py-[40px]">
          <div className="max-w-container-max mx-auto px-3 sm:px-4">
            <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto hide-scrollbar pb-2 md:pb-4 md:justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={categoryRoutes[cat.name] || "#"}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shadow-sm">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl group-hover:text-white">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="pb-8 sm:pb-12 md:pb-16">
          <div className="max-w-container-max mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex justify-between items-end mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-lg min-[480px]:text-xl sm:text-2xl md:text-3xl font-bold text-on-surface">
                  Our Bestsellers
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Handpicked gifts loved by thousands
                </p>
              </div>
              <a
                href="#"
                className="text-primary font-medium text-xs sm:text-sm flex items-center hover:underline"
              >
                View All{" "}
                <span className="material-symbols-outlined text-[18px] ml-0.5">
                  chevron_right
                </span>
              </a>
            </div>

            <div className="grid grid-cols-2 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-2.5 min-[480px]:gap-3.5 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <Link
                  key={product.title}
                  href={`/products/${product.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")}`}
                  className="group bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all product-card-hover border border-outline-variant duration-500 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                      />
                      {product.badge && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-white text-[8px] min-[480px]:text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {product.badge}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 min-[480px]:w-8 min-[480px]:h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Add to Wishlist"
                      >
                        <span className="material-symbols-outlined text-[16px] min-[480px]:text-[18px] sm:text-[20px]">
                          favorite
                        </span>
                      </button>

                      {/* Desktop Hover Overlay */}
                      <div className="hidden md:block absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => handleAddToCart(e)}
                            className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-semibold shadow-lg hover:bg-primary/90 transition-colors"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={(e) => handleBuyNow(e)}
                            className="flex-1 bg-on-surface text-white py-2 rounded-lg text-xs font-semibold shadow-lg hover:bg-primary transition-colors"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 min-[480px]:p-3 sm:p-4">
                      <h3 className="text-xs min-[480px]:text-sm sm:text-base md:text-[18px] font-bold text-on-surface line-clamp-1 mb-0.5">
                        {product.title}
                      </h3>
                      <p className="text-[11px] min-[480px]:text-xs sm:text-sm text-on-surface-variant line-clamp-1 mb-1.5 min-[480px]:mb-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs min-[480px]:text-sm sm:text-base font-bold text-primary">
                          {product.price}
                        </span>
                        <div className="flex items-center text-primary">
                          <span
                            className="material-symbols-outlined text-[13px] sm:text-[16px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="text-[10px] min-[480px]:text-xs text-on-surface-variant ml-0.5 font-medium">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Touch Action Buttons */}
                  <div className="px-2.5 min-[480px]:px-3 pb-2.5 min-[480px]:pb-3 pt-0 flex md:hidden gap-1.5">
                    <button
                      onClick={(e) => handleAddToCart(e)}
                      className="flex-1 bg-primary text-white py-1.5 rounded-lg text-[10px] min-[480px]:text-[11px] font-semibold active:scale-95 transition-transform"
                    >
                      Cart
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e)}
                      className="flex-1 bg-on-surface text-white py-1.5 rounded-lg text-[10px] min-[480px]:text-[11px] font-semibold active:scale-95 transition-transform"
                    >
                      Buy
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Bento Grid */}
        <section className="pb-12 sm:pb-16">
          <div className="max-w-container-max mx-auto px-3 sm:px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 auto-rows-auto md:auto-rows-[250px]">
              {/* Large Card */}
              <div className="md:col-span-2 md:row-span-2 min-h-[300px] min-[480px]:min-h-[340px] sm:min-h-[400px] md:min-h-full relative rounded-2xl overflow-hidden group flex flex-col justify-end">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEQeKGSYFH_RPpCNYFNwYYjYnT0Q5GjNQDbFwSfJhJzPHUCH_BnGB9kpdBrVWDyHj5TgCPbY8csBy2geT3tMHIN2FN1XYbOz9JQrwJghIRZ_Vs5zIXVexLCmbUgG95CRF_kgmKetwHCmbFOF4W-Zp50lQwPqzqpA6h5uHav83oHUEt7G8y9GXvLAMHjCMEBAg78D9CDFE6UJTnNAnbLZOgSRWCVxkhCOBU3B9EoWPZHeUvzd-WCcEAPg')",
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />
                <div className="relative z-10 p-4 min-[480px]:p-5 sm:p-8 text-white">
                  <h2 className="text-xl min-[480px]:text-2xl sm:text-3xl md:text-[40px] font-serif font-bold mb-1.5 sm:mb-2 leading-tight">
                    The Luxe <br />
                    Collection
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-6 opacity-90 max-w-sm">
                    Bespoke arrangements for life&apos;s biggest milestones.
                  </p>
                  <button className="px-5 min-[480px]:px-6 sm:px-8 py-2 min-[480px]:py-2.5 sm:py-3 bg-white text-on-surface rounded-full text-xs sm:text-sm font-semibold hover:bg-primary hover:text-white transition-colors active:scale-95">
                    Explore Luxe
                  </button>
                </div>
              </div>

              {/* Secondary Card 1 */}
              <div className="relative rounded-2xl overflow-hidden group min-h-[180px] min-[480px]:min-h-[200px] sm:min-h-[220px] md:min-h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtpw8rdle6xtlfxqSRqJfH1ncbABiWakWw86cMXj1g8INXZCjx-ugi7doQoFkfdfYwjp2GAxqXN4eLud-8TFK4fXS2FvBdsOI1TUd-ebKvcYVe5J0CslW8Xrq3BLEE03Yt_1TGOOyoefYGtKBIldcRd071ugfw_T-U0VBqB4-gmdT7ecr2gdwFj3J8TJqFXSX7PmS_x7XCv3HgqOJuJxbhgUDsEd2-YT8tmo6dvZFMnhbPU-ifd2ajPw')",
                  }}
                />
                <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/50 transition-all" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                  <h3 className="text-lg min-[480px]:text-xl sm:text-2xl font-bold text-white mb-2">
                    Personalised
                  </h3>
                  <button className="text-white text-xs sm:text-sm font-semibold underline decoration-2 underline-offset-4">
                    Customise Now
                  </button>
                </div>
              </div>

              {/* Secondary Card 2 */}
              <div className="relative rounded-2xl overflow-hidden group min-h-[180px] min-[480px]:min-h-[200px] sm:min-h-[220px] md:min-h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGvuLZcednIxtP7LvNDWh-M8j9yfFteRp7hlRekUe0b9dQV5Y_nXAAsr816jwS4NbeQ03kNVexoIPuOS4pN4eZrbVudqrfd8PDDYWyK36V8QLU_ksx-NulJT5M6IIsiS5tL5Z_thyHUyMlHu0z5qMaZyReqaylfuoLkcIkgVQXkybnGgB60SIWQp03LEt1Fzj6MeASn_uPgPhlGlC3HFSMntIsfTSwZIaVsWf-LXoSyHhbRB97AJoYaQ')",
                  }}
                />
                <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/50 transition-all" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 text-white">
                  <h3 className="text-lg min-[480px]:text-xl sm:text-2xl font-bold mb-2">
                    Green Decor
                  </h3>
                  <button className="text-white text-xs sm:text-sm font-semibold underline decoration-2 underline-offset-4">
                    Shop Plants
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-10 sm:py-16 hero-gradient border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-4 text-center">
            <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl mb-3 block">
              mail
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-surface mb-3">
              Join our Petal Circle
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-on-surface-variant max-w-xl mx-auto mb-6">
              Get exclusive access to new seasonal launches and a special 15%
              discount on your first gift.
            </p>
            <form className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-md mx-auto">
              <input
                className="flex-1 bg-white border border-outline-variant px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm outline-none focus:border-primary transition-all"
                placeholder="Your email address"
                type="email"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white rounded-full text-xs sm:text-sm font-semibold hover:shadow-lg transition-all active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-[#FAF8F5] border-t border-gray-200/80 pt-8 pb-24 md:pb-12 text-[#2D2825]">
        <div className="max-w-container-max mx-auto px-4 sm:px-6">
          <div className="hidden min-[720px]:grid min-[720px]:grid-cols-4 gap-4 lg:gap-8 pb-8 border-b border-gray-200/90">
            {/* Div 1: About */}
            <div className="col-span-1">
              <Image
                src="/logo1.png"
                alt="R Petals Logo"
                width={0}
                height={0}
                sizes="100vw"
                className="h-14 lg:h-16 w-auto max-w-[180px] lg:max-w-[200px] mb-3 lg:mb-4 object-contain"
              />
              <p className="text-[12px] lg:text-sm text-[#5C544E] leading-relaxed mb-4">
                Established in 1994, R Petals has been the pioneer in delivering
                happiness through blossoms across the globe.
              </p>
              <div className="flex gap-2.5">
                <a
                  href="#"
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] hover:text-primary hover:border-primary transition-colors bg-white/40"
                >
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]">
                    share
                  </span>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] hover:text-primary hover:border-primary transition-colors bg-white/40"
                >
                  <span className="material-symbols-outlined text-[16px] lg:text-[18px]">
                    photo_camera
                  </span>
                </a>
              </div>
            </div>

            {/* Div 2: Company */}
            <div className="col-span-1">
              <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest mb-3 lg:mb-4">
                COMPANY
              </h4>
              <ul className="space-y-2 lg:space-y-2.5">
                {footerCompany.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs lg:text-sm text-[#5C544E] hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Div 3: Support */}
            <div className="col-span-1">
              <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest mb-3 lg:mb-4">
                SUPPORT
              </h4>
              <ul className="space-y-2 lg:space-y-2.5">
                {footerSupport.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs lg:text-sm text-[#5C544E] hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Div 4: Delivery To */}
            <div className="col-span-1">
              <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest mb-3 lg:mb-4">
                DELIVERY TO
              </h4>
              <div className="flex flex-wrap gap-1.5 lg:gap-2">
                {footerCities.map((city) => (
                  <span
                    key={city}
                    className="px-2.5 lg:px-3.5 py-1 lg:py-1.5 bg-[#F0ECE6] rounded-full text-[11px] lg:text-xs font-medium text-[#4A423D]"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="block min-[720px]:hidden">
            {/* Logo & Intro */}
            <div className="mb-6">
              <Image
                src="/logo1.png"
                alt="R Petals Logo"
                width={0}
                height={0}
                sizes="100vw"
                className="h-14 w-auto max-w-[200px] mb-4 object-contain"
              />
              <p className="text-[13px] text-[#5C544E] leading-relaxed mb-5">
                Established in 1994, R Petals has been the pioneer in delivering
                happiness through blossoms across the globe.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-11 h-11 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] bg-white/40"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] bg-white/40"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    photo_camera
                  </span>
                </a>
              </div>
            </div>

            <hr className="border-t border-gray-200/90 my-4" />

            {/* COMPANY Accordion */}
            <div>
              <button
                onClick={() => setFooterCompanyOpen(!footerCompanyOpen)}
                className="w-full flex items-center justify-between py-2 text-left"
              >
                <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest">
                  COMPANY
                </h4>
                <span
                  className="material-symbols-outlined text-gray-500 text-[20px] transition-transform duration-200"
                  style={{
                    transform: footerCompanyOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
              </button>
              {footerCompanyOpen && (
                <ul className="space-y-2.5 pb-3 pt-1">
                  {footerCompany.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-xs text-[#5C544E]">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <hr className="border-t border-gray-200/90 my-4" />

            {/* SUPPORT Accordion */}
            <div>
              <button
                onClick={() => setFooterSupportOpen(!footerSupportOpen)}
                className="w-full flex items-center justify-between py-2 text-left"
              >
                <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest">
                  SUPPORT
                </h4>
                <span
                  className="material-symbols-outlined text-gray-500 text-[20px] transition-transform duration-200"
                  style={{
                    transform: footerSupportOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
              </button>
              {footerSupportOpen && (
                <ul className="space-y-2.5 pb-3 pt-1">
                  {footerSupport.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-xs text-[#5C544E]">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <hr className="border-t border-gray-200/90 my-4" />

            {/* DELIVERY TO */}
            <div className="py-2">
              <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest mb-3">
                DELIVERY TO
              </h4>
              <div className="flex flex-wrap gap-2">
                {footerCities.map((city) => (
                  <span
                    key={city}
                    className="px-4 py-1.5 bg-[#F0ECE6] rounded-full text-xs font-medium text-[#4A423D]"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200/90 my-6" />

          {/* Copyright & Payment Options */}
          <div className="flex flex-col min-[720px]:flex-row justify-between items-center gap-4 text-center">
            <div className="flex gap-4 text-[#4A423D] order-1 min-[720px]:order-2">
              <span className="material-symbols-outlined text-[26px]">
                payments
              </span>
              <span className="material-symbols-outlined text-[26px]">
                credit_card
              </span>
            </div>
            <p className="text-xs text-[#6B625B] order-2 min-[720px]:order-1">
              © 2024 R Petals. All rights reserved. Flowers that speak.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 md:hidden bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.08)] border-t border-outline-variant">
        {bottomNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center p-1 active:scale-95 transition-transform ${item.active ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                item.active ? { fontVariationSettings: "'FILL' 1" } : undefined
              }
            >
              {item.icon}
            </span>
            <span className="text-[10px] sm:text-xs mt-0.5">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}