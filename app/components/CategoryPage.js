"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// API: GET /api/categories — fetch all categories with name, sub-items for nav dropdown
const navLinks = ["Flowers", "Cakes", "Plants", "Personalised", "Occasions", "LUXE"];
const navRoutes = {
  Flowers: "/categories/flowers",
  Cakes: "/categories/cakes",
  Plants: "/categories/plants",
  Personalised: "/categories/personalised",
  Occasions: "/categories/occasions",
  LUXE: "/categories/luxe",
};

const bottomNav = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Categories", icon: "grid_view", href: "/categories/flowers" },
  { label: "Occasions", icon: "celebration", href: "/categories/occasions" },
  { label: "Cart", icon: "shopping_bag", href: "/cart" },
];

export default function CategoryPage({ category }) {
  const router = useRouter();
  const {
    name,
    headline,
    description,
    subCategories,
    filterTypes,
    filterLabel,
    priceRanges,
    occasions,
    products,
    activeNavItem,
  } = category;

  const [activeSub, setActiveSub] = useState(subCategories[0]?.name || "");
  const [activeOccasion, setActiveOccasion] = useState(occasions[0] || "");

const handleAddToCart = (event) => {
    event.preventDefault();

    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/cart");
      return;
    }
  };

  // API: GET /api/products?category={name}&subCategory={activeSub}&occasion={activeOccasion}&sort={sort}&page={page}
  // — fetch filtered/sorted products for this category page

  return (
    <div className="bg-background text-on-surface min-h-screen">

      {/* Header */}
      <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-lg max-w-container-max mx-auto h-16 md:h-[90px]">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo1.png" alt="R Petals Logo" width={0} height={0} sizes="100vw" className="h-10 md:h-[70px] w-auto object-contain" />
            </Link>
            {/* API: GET /api/search?q={query}&category={name} — search within category */}
            <div className="hidden lg:flex items-center bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 w-72">
              <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">search</span>
              <input className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder:text-on-surface-variant outline-none" placeholder="Gifts for your loved ones..." type="text" />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item}
                href={navRoutes[item] || "#"}
                className={`font-label-lg text-label-lg transition-colors ${item === activeNavItem ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}
              >
                {item === "LUXE" ? (
                  <span className="flex items-center gap-1">LUXE <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></span>
                ) : item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            {/* API: GET /api/cart — fetch cart count for badge */}
            {[
              { icon: "notifications_active", label: "Alerts" },
              { icon: "currency_rupee", label: "INR" },
              { icon: "shopping_cart", label: "Cart", href: "/cart" },
              { icon: "account_circle", label: "Profile" },
            ].map((item) => {
              const className = "text-on-surface-variant hover:text-primary transition-colors flex flex-col items-center gap-0.5";
              const content = (
                <>
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  <span className="hidden lg:block text-[11px] font-semibold tracking-wide">{item.label}</span>
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
          </div>
        </div>
      </header>

      {/* Page Hero */}
      <section className="w-full bg-surface py-lg">
        <div className="max-w-container-max mx-auto px-4 md:px-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{headline}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">{description}</p>
            </div>

            {/* Sub-category circles */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
              {subCategories.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => setActiveSub(sub.name)}
                  className="flex flex-col items-center min-w-[80px] group cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-full border-2 p-1 mb-2 group-hover:scale-105 transition-transform overflow-hidden ${activeSub === sub.name ? "border-primary" : "border-outline-variant"}`}>
                    <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${sub.image}')` }} />
                  </div>
                  <span className={`font-label-sm text-label-sm text-center ${activeSub === sub.name ? "text-primary font-bold" : "text-on-surface"}`}>{sub.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-4 md:px-md py-lg flex flex-col md:flex-row gap-lg pb-24 md:pb-lg">

        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-widest">Filters</h3>
              <button className="text-primary font-label-sm text-label-sm hover:underline">Clear All</button>
            </div>

            {/* Type Filter */}
            <div>
              <h4 className="font-label-lg text-label-lg text-on-surface mb-3">{filterLabel}</h4>
              <div className="space-y-2">
                {filterTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-transparent" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range} className="flex items-center gap-2 cursor-pointer group">
                    <input className="border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-transparent" name="price" type="radio" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Occasion</h4>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setActiveOccasion(occ)}
                    className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm transition-colors ${activeOccasion === occ ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:bg-primary-fixed"}`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-grow">
          <div className="flex items-center justify-between mb-6">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Showing {products.length * 7} Items</span>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm">Sort By:</span>
              <select className="border-none bg-transparent focus:ring-0 font-label-lg text-label-lg text-primary cursor-pointer outline-none">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link
                key={product.title}
                href={`/products/${product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                className="group bg-surface rounded-xl overflow-hidden border border-outline-variant hover:border-primary/30 transition-all duration-300 block"
                style={{ boxShadow: "0px 10px 30px rgba(76, 139, 43, 0.05)" }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {product.badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-primary text-white px-3 py-1 rounded-full font-label-sm text-label-sm tracking-widest">{product.badge}</span>
                    </div>
                  )}
                  <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${product.image}')` }} />
{/* API: POST /api/wishlist — add to wishlist { productId } */}
                  <button
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
                <div className="p-3 bg-surface">
                  <h3 className="font-headline-md text-[15px] text-on-surface mb-0.5 leading-tight">{product.title}</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg text-primary text-base">{product.price}</span>
                    {/* API: POST /api/cart — add to cart { productId, quantity: 1 } */}
<button
                      onClick={(event) => handleAddToCart(event)}
                      className="bg-primary text-white px-3 py-1.5 rounded-lg font-label-lg text-[12px] hover:opacity-90 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-16 gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-label-lg text-label-lg transition-colors ${page === 1 ? "bg-primary text-white" : "border border-outline-variant text-on-surface hover:bg-primary hover:text-white"}`}
              >
                {page}
              </button>
            ))}
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant text-on-surface hover:bg-primary hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 md:hidden bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] rounded-t-xl border-t border-outline-variant">
        {bottomNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center active:scale-95 transition-transform ${item.label === "Categories" ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}
          >
            <span className="material-symbols-outlined" style={item.label === "Categories" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
