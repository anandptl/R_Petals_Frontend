"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; 
const categories = [
  {
    name: "Flowers",
    icon: "local_florist",
    items: ["Roses", "Tulips", "Orchids", "Lilies", "Sunflowers", "Mixed Bouquets"],
  },
  {
    name: "Cakes",
    icon: "cake",
    items: ["Chocolate Cakes", "Eggless Cakes", "Photo Cakes", "Cupcakes", "Cheesecakes", "Fondant Cakes"],
  },
  {
    name: "Personalised",
    icon: "redeem",
    items: ["Photo Frames", "Custom Mugs", "Engraved Gifts", "Name Cushions", "Memory Books"],
  },
  {
    name: "Plants",
    icon: "potted_plant",
    items: ["Indoor Plants", "Succulents", "Bonsai", "Air Purifiers", "Flowering Plants", "Terrariums"],
  },
  {
    name: "Combos",
    icon: "celebration",
    items: ["Flower & Cake", "Flower & Chocolate", "Hamper Boxes", "Spa Combos", "Gourmet Combos"],
  },
  {
    name: "LUXE",
    icon: "diamond",
    items: ["Premium Roses", "Exotic Orchids", "Luxury Hampers", "Gold Dipped Flowers", "Bespoke Arrangements"],
  },
  {
    name: "Gourmet",
    icon: "nest_eco_leaf",
    items: ["Chocolates", "Dry Fruits", "Cookies & Brownies", "Wine & Cheese", "Artisan Sweets"],
  },
];

const navLinks = ["Flowers", "Cakes", "Plants", "Personalised", "Occasions", "LUXE"];

const occasionsItems = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Valentine's Day",
  "Mother's Day",
  "Farewell",
];

const categoryRoutes = {
  Flowers: "/categories/flowers",
  Cakes: "/categories/cakes",
  Plants: "/categories/plants",
  Personalised: "/categories/personalised",
  Combos: "/categories/combos",
  LUXE: "/categories/luxe",
  Gourmet: "/categories/gourmet",
};

const bottomNav = [
  { label: "Home", icon: "home", href: "/", active: true },
  { label: "All Gifts", icon: "grid_view", href: "/categories/allgifts" },
  { label: "Luxe", icon: "diamond", href: "/categories/luxe" },
];

const accountMenuItems = [
  { icon: "account_circle", label: "My Profile", href: "/profile" },
  { icon: "receipt_long", label: "Orders", href: "/orders" },
  { icon: "location_on", label: "Saved Addresses", href: "/addresses" },
  { icon: "favorite", label: "Wishlist", href: "/wishlist" },
  { icon: "notifications", label: "Notifications", href: "/notifications" },
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

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth(); 
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    setAccountSheetOpen(false);
  };

  useEffect(() => {
    const header = document.querySelector("header");

    const handleScroll = () => {
      if (window.pageYOffset > 50) {
        header?.classList.add("shadow-md");
      } else {
        header?.classList.remove("shadow-md");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-surface sticky top-0 z-[60] shadow-sm border-b border-outline-variant transition-all duration-300">
        <div className="flex items-center w-full px-3 sm:px-4 md:px-6 max-w-container-max mx-auto h-16 md:h-[90px] gap-2 sm:gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <Image
              src="/logo1.png"
              alt="R Petals Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="h-9 sm:h-11 md:h-[70px] w-auto object-contain"
              priority
            />
          </div>

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

          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {[
              { icon: "notifications_active", label: "Alerts" },
              { icon: "shopping_cart", label: "Cart", href: "/cart" },
            ].map((item) => {
              const className =
                "text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center gap-0.5";
              const content = (
                <>
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
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
                    style={{ transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    expand_more
                  </span>
                </button>

                {profileMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 z-[100] min-w-[210px] bg-surface border border-outline-variant shadow-lg py-2"
                    style={{ borderRadius: "12px" }}
                  >
                    {accountMenuItems.map((menuItem) => (
                      <Link
                        key={menuItem.label}
                        href={menuItem.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[19px]">{menuItem.icon}</span>
                        {menuItem.label}
                      </Link>
                    ))}
                    <hr className="my-1.5 border-outline-variant" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[19px]">logout</span>
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

          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <Link href="/cart" className="text-on-surface-variant hover:text-primary transition-colors p-1">
              <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            </Link>
          </div>
        </div>

        <nav className="hidden md:flex justify-center border-t border-outline-variant py-2 bg-surface">
          <div className="flex gap-8">
            {navLinks.map((item, index) => {
              const cat =
                categories.find((c) => c.name === item) ||
                (item === "Occasions" ? { items: occasionsItems } : null);
              return <NavDropdown key={item} item={item} index={index} cat={cat} />;
            })}
          </div>
        </nav>
      </header>

      {/* Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 md:hidden bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.08)] border-t border-outline-variant">
        {bottomNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center p-1 active:scale-95 transition-transform ${
              item.active ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[10px] sm:text-xs mt-0.5">{item.label}</span>
          </Link>
        ))}

        <button
          onClick={() => {
            if (user) {
              setAccountSheetOpen(true);
            } else {
              router.push("/login");
            }
          }}
          className="flex flex-col items-center justify-center p-1 active:scale-95 transition-transform text-on-surface-variant hover:text-primary"
        >
          {user ? (
            <span className="w-[22px] h-[22px] rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "R"}
            </span>
          ) : (
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
          )}
          <span className="text-[10px] sm:text-xs mt-0.5">Account</span>
        </button>
      </nav>

      {/* Mobile Account Bottom Sheet */}
      {accountSheetOpen && user && (
        <div className="fixed inset-0 z-[70] md:hidden" onClick={() => setAccountSheetOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 w-full bg-surface rounded-t-2xl shadow-lg p-4 pb-8 max-h-[75vh] overflow-y-auto"
          >
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-4" />

            <div className="flex items-center gap-3 px-1 py-2 mb-2">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-label-lg text-label-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "R"}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface">{user.name || "My Account"}</span>
                <span className="text-xs text-on-surface-variant">+91 {user.phoneNumber}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {accountMenuItems.map((menuItem) => (
                <Link
                  key={menuItem.label}
                  href={menuItem.href}
                  onClick={() => setAccountSheetOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[21px]">{menuItem.icon}</span>
                  <span>{menuItem.label}</span>
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all text-left"
              >
                <span className="material-symbols-outlined text-[21px]">logout</span>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
