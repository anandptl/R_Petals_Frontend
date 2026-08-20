"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// API: GET /api/categories — Gift Type list with sub-items & route
const giftTypeCategories = [
  {
    name: "Flowers",
    icon: "local_florist",
    href: "/categories/flowers",
    items: ["Roses", "Tulips", "Orchids", "Lilies", "Sunflowers", "Mixed Bouquets"],
  },
  {
    name: "Cakes",
    icon: "cake",
    href: "/categories/cakes",
    items: ["Chocolate Cakes", "Eggless Cakes", "Photo Cakes", "Cupcakes", "Cheesecakes", "Fondant Cakes"],
  },
  {
    name: "Personalised",
    icon: "redeem",
    href: "/categories/personalised",
    items: ["Photo Frames", "Custom Mugs", "Engraved Gifts", "Name Cushions", "Memory Books"],
  },
  {
    name: "Plants",
    icon: "potted_plant",
    href: "/categories/plants",
    items: ["Indoor Plants", "Succulents", "Bonsai", "Air Purifiers", "Flowering Plants", "Terrariums"],
  },
  {
    name: "Balloon n Experiential Services",
    icon: "celebration",
    href: "/categories/balloons",
    items: ["Birthday Decor", "Balloon Bouquets", "Surprise Setup", "Photo Booth"],
  },
  {
    name: "Chocolates",
    icon: "cookie",
    href: "/categories/chocolates",
    items: ["Chocolate Boxes", "Truffles", "Assorted Bars", "Sugar-Free"],
  },
  {
    name: "Hatke - Gen Z Gifting Store",
    icon: "bolt",
    href: "/categories/hatke",
    items: ["Quirky Mugs", "Meme Merch", "Neon Decor", "Trendy Combos"],
  },
  {
    name: "LUXE",
    icon: "diamond",
    href: "/categories/luxe",
    items: ["Premium Roses", "Exotic Orchids", "Luxury Hampers", "Gold Dipped Flowers", "Bespoke Arrangements"],
  },
  {
    name: "Gift Sets n Hampers",
    icon: "card_giftcard",
    href: "/categories/combos",
    items: ["Flower & Cake", "Flower & Chocolate", "Hamper Boxes", "Spa Combos", "Gourmet Combos"],
  },
  {
    name: "Lifestyle Gifts",
    icon: "watch",
    href: "/categories/lifestyle",
    items: ["Jewellery", "Watches", "Bags", "Accessories"],
  },
];

// API: GET /api/occasions — Occasions list
const occasionCategories = [
  { name: "Birthday", icon: "cake", href: "/categories/occasions?type=birthday" },
  { name: "Anniversary", icon: "favorite", href: "/categories/occasions?type=anniversary" },
  { name: "Wedding", icon: "diversity_3", href: "/categories/occasions?type=wedding" },
  { name: "Valentine's Day", icon: "favorite_border", href: "/categories/occasions?type=valentines" },
  { name: "Mother's Day", icon: "volunteer_activism", href: "/categories/occasions?type=mothers-day" },
  { name: "Farewell", icon: "flight_takeoff", href: "/categories/occasions?type=farewell" },
];

const bottomNav = [
  { label: "Home", icon: "home", href: "/" },
  { label: "All Gifts", icon: "grid_view", href: "/categories/allgifts", active: true },
  { label: "Luxe", icon: "diamond", href: "/categories/luxe" },
];

const accountMenuItems = [
  { icon: "account_circle", label: "My Profile", href: "/profile" },
  { icon: "receipt_long", label: "Orders", href: "/orders" },
  { icon: "location_on", label: "Saved Addresses", href: "/addresses" },
  { icon: "favorite", label: "Wishlist", href: "/wishlist" },
  { icon: "notifications", label: "Notifications", href: "/notifications" },
];

function CategoryRow({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center flex-shrink-0 overflow-hidden">
          <span className="material-symbols-outlined text-primary text-[26px]">
            {item.icon}
          </span>
        </div>
        <span className="flex-1 font-label-lg text-label-lg text-on-surface">
          {item.name}
        </span>
        <span
          className="material-symbols-outlined text-on-surface-variant text-[22px] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-0">
          <div className="flex flex-wrap gap-2 pl-[60px]">
            {item.items?.map((sub) => (
              <Link
                key={sub}
                href={item.href}
                className="px-3 py-1.5 text-xs rounded-full bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white transition-all"
              >
                {sub}
              </Link>
            ))}
            <Link
              href={item.href}
              className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white transition-all"
            >
              View All →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AllGiftsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Gift Type");
  const [user, setUser] = useState(null);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("rpetalsUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("rpetalsUser");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rpetalsUser");
    setUser(null);
    setAccountSheetOpen(false);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24 md:pb-0">
      <main className="max-w-container-max mx-auto px-4 md:px-md py-6 md:py-lg">
        <h1 className="font-headline-md text-[22px] md:text-headline-md text-on-surface mb-4">
          All Gifts
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-8 border-b border-outline-variant mb-5">
          {["Gift Type", "Occasions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-label-lg text-label-lg transition-colors ${
                activeTab === tab
                  ? "text-on-surface font-bold border-b-2 border-on-surface"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gift Type list */}
        {activeTab === "Gift Type" && (
          <div className="flex flex-col gap-3">
            {giftTypeCategories.map((item) => (
              <CategoryRow key={item.name} item={item} />
            ))}
          </div>
        )}

        {/* Occasions list */}
        {activeTab === "Occasions" && (
          <div className="flex flex-col gap-3">
            {occasionCategories.map((occ) => (
              <Link
                key={occ.name}
                href={occ.href}
                className="w-full flex items-center gap-3 p-3 bg-surface border border-outline-variant rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[26px]">
                    {occ.icon}
                  </span>
                </div>
                <span className="flex-1 font-label-lg text-label-lg text-on-surface">
                  {occ.name}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Nav Mobile */}
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

        {/* Account tab */}
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
    </div>
  );
}