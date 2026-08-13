// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// // API: GET /api/products/addons — fetch add-on products list
// const addons = [
//   { title: "Classic Truffles (12pc)", price: "₹899", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqAjmbgZaICAdtT8Rp5Fvs3YZYFU15ZTOZts6wItYjZ4HsBnN-marCdWNOCYNNHTax9RYwJxOi60QrqIazKF-Tre3JXyhPoqY0EL09Pd7ms1qnr1LdXl1EK1FLzQ2YM31xOlp3A0PKSihlynggVh1r6pDx9WDb5Kk-RcSo5j7Ov_aKW5hz7bSrWTS3kzHJAB2ZLMuSbQpkgE63j-3PLlUInYNEvWYlLNw7XC3BdlYAj2x1tcLiOm6xmg" },
//   { title: "Cream Teddy Bear", price: "₹499", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1FnJKpd28sZpGXko-oaup_oZC8nlwuH-yDZRO3y8KbmCjB734qHt_ofLGhNI-qFRfqNl2lfFbxCeLBl__jJ1nd4Pwr9mY7eKfESGaFB_yba5zRotfxS0Fy-JYlqXE9Zt388rVkwhiMigza9oUXfQ8NBurq-z9S0q0oyla54JsDH-ddiKf0FsqKlhHVHa0D22yeceDyg9JSS78QfxXtucLMlOSluuVWTnAe4oInXKrPxnU7_f1Zcpldg" },
//   { title: "Designer Gold Vase", price: "₹1,299", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-cCi-IgT58SzGFVDO7hq68BxD9HRAkbGfQydRegVEdokuu_B6IemDFlSOaqJ_LAcfYdD-lWm5NviazBuH_sHweXeRojY7cXcbG3k9xdV7T-9C3Nzg_3wtbpygpgk4QWyi8h-_IyrNWz64K0Dh42M9f8sftRnZRRPV78HJlq2HATjdGz4yviWsqQvlgtfNDCprJiDTA3ewXuSCreXym6IYgDAlT6TSuDXJV3RMXC1gu-ebqSJQWxLB9w" },
//   { title: "Festive Balloons", price: "₹299", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNaC3HxKMXLL4019YGJwCaBu1oV9a0lDKgt6Zc-YA54sRPccFE3LS2vHDCbOzbGBzBiIj_QKrKZpgbaLuFhggYdEMYz32peoe9KrSdZRLMmZJ3UE1frbnDgiuvVNgepJCNjO8F9xOKsTcu60j22YAW4Wq6knlfG-TFCXGGmdlhb6v3GpNfd0HGxbH23UeBULw_C-SG3oUwDuCwn_WFjlqyjcQ1AWV8HSZjzYzcLSHDfqDSH9TBRd08Uw" },
// ];

// const thumbnails = [
//   "https://lh3.googleusercontent.com/aida-public/AB6AXuBIPPeLJGfJhzGG74widG5HFece0nyOAmqtUPrxWJ1NcB_26_No74FYUvGX8jLk5awkxA0ftRgl5Ku4VYbXpKS06S7Ya0avFo0xYrQGhKjHrfnK1NKxL1WtzM3c-C4ROXjwlw8LGmZc2jaS_WnjsRXevTCw-vxSa25d-cV6Q60ZIkRvEUUr3q7zmYXEFdK59Bo-eiLZCoEdPVqYf9CSmwAUDnNBJaKZeAFmgn67WikguO3fhQDDvQBLXQ",
//   "https://lh3.googleusercontent.com/aida-public/AB6AXuDRSXppwvMCPlDSahPizujIqR9IzYPk-J5aOZbcRrjBQMAe0s-md0xTg_MU8r1FgjjAK_9RSEW9qLWgg1oKJYicdkxAMgmJRz2USXjt_0c6I_U3rjNjbxi73rUuSrgplWXUN9MXj_3t9BTGUI73BuAwCtOH3LVgOSBFu9a5f0vNghks8iPzEgSeWoGrwEhlXrWYwiEyUYKGv18CJQfqklCCoGNK-d0_TuL02xXJW5CtwYvTTYaT7b5fGw",
//   "https://lh3.googleusercontent.com/aida-public/AB6AXuD2etjStOdFaNeL16FTvZHNsFyw0xUMNFVfBRGUQSJkKior0PisqQgIJsSuE1IuB5aKGdeZ1wcPmCTy8lcdoHGwZqwkgD6TlNuK3x6cs6J8-mS06KKaAq8CcrUkU53_DxC-6drrgl6QFrkVZ_cqHzcW6ybbSVpNwrOQTCodyMVCOCOqZG8AuUUYqOk0VGQbSHvcA4RfY1TiVVVzJWkGTw_SpjP326gJpBE6T-KxH0tATzPOwjRKIXNVHg",
// ];

// // API: GET /api/products/{id} — fetch product detail by id (images, price, sizes, rating, description)
// const mainImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAcPzxx46V34pi3O8LuXaGKK5cW0ff8NR5Yx6duGGx5IIVelsro7QHbT-vijAcSQ8P_gF8gA6LOgMf-UG31FrR8cjEfHJuTT7261ZHbF4BRbAuyVkk4uSyhdFYjKiU42UsskAWtm0xp00rQ72dxxARUVowtWj5o7aO2A8_gnfqqD0VuU9jxw2lQLg-4ZTHKTJQAUneTjdwy3nXysTfh-htJ5RLYg1BBNlVIgq1vQgw5N7gQRURlxVeNYw";

// const navLinks = ["Flowers", "Cakes", "Plants", "Personalised", "Occasions", "LUXE"];
// const navRoutes = {
//   Flowers: "/categories/flowers",
//   Cakes: "/categories/cakes",
//   Plants: "/categories/plants",
//   Personalised: "/categories/personalised",
//   Occasions: "/categories/occasions",
//   LUXE: "/categories/luxe",
// };

// const tabs = ["Description", "Delivery Info", "Care Instructions", "Reviews (124)"];

// export default function ProductDetailPage() {
//   const router = useRouter();
//   const [activeImage, setActiveImage] = useState(mainImage);
//   const [selectedSize, setSelectedSize] = useState("Standard");
//   const [activeTab, setActiveTab] = useState("Description");
//   const [cartLoading, setCartLoading] = useState(false);
//   const [cartDone, setCartDone] = useState(false);

// const handleAddToCart = () => {
//     if (!localStorage.getItem("rpetalsUser")) {
//       router.push("/login?redirect=/cart");
//       return;
//     }

//     // API: POST /api/cart — add to cart { productId, size: selectedSize, quantity: 1 }
//     setCartLoading(true);
//     setTimeout(() => {
//       setCartLoading(false);
//       setCartDone(true);
//       setTimeout(() => setCartDone(false), 2000);
//     }, 1000);
//   };

//   const handleAddAddon = (addonTitle) => {
//     if (!localStorage.getItem("rpetalsUser")) {
//       router.push("/login?redirect=/cart");
//       return;
//     }
//   };

//   const handleBuyNow = () => {
//     if (!localStorage.getItem("rpetalsUser")) {
//       router.push("/login?redirect=/checkout");
//       return;
//     }

//     // API: POST /api/orders/buynow — direct checkout { productId, size: selectedSize, quantity: 1 }
//     router.push("/checkout");
//   };

//   return (
//     <div className="bg-background text-on-surface min-h-screen">

//       {/* Header */}
//       <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant shadow-sm h-16 md:h-[90px] flex items-center">
//         <div className="flex justify-between items-center w-full px-4 md:px-lg max-w-container-max mx-auto">
//           <Link href="/">
//             <Image src="/logo1.png" alt="R Petals Logo" width={0} height={0} sizes="100vw" className="h-10 md:h-[70px] w-auto object-contain" />
//           </Link>

//           <nav className="hidden md:flex items-center gap-6">
//             {navLinks.map((item) => (
//               <Link key={item} href={navRoutes[item] || "#"}
//                 className={`font-label-lg text-label-lg transition-colors ${item === "Flowers" ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}>
//                 {item === "LUXE" ? <span className="flex items-center gap-1">LUXE <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></span> : item}
//               </Link>
//             ))}
//           </nav>

//           <div className="flex items-center gap-2">
//             <button className="p-2 hover:bg-surface-container transition-all rounded-full">
//               <span className="material-symbols-outlined text-on-surface-variant">search</span>
//             </button>
//             {/* API: GET /api/cart — fetch cart item count for badge */}
//             <Link href="/cart" className="p-2 hover:bg-surface-container transition-all rounded-full relative">
//               <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
//               <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
//             </Link>
//             <button className="p-2 hover:bg-surface-container transition-all rounded-full">
//               <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-container-max mx-auto px-4 md:px-lg py-6 md:py-lg pb-24 md:pb-lg">

//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-1 text-on-surface-variant mb-6 font-label-sm text-label-sm flex-wrap">
//           <Link href="/" className="hover:text-primary">Home</Link>
//           <span className="material-symbols-outlined text-[14px]">chevron_right</span>
//           <Link href="/categories/flowers" className="hover:text-primary">Flowers</Link>
//           <span className="material-symbols-outlined text-[14px]">chevron_right</span>
//           <span className="text-on-surface font-medium truncate max-w-[160px] md:max-w-none">Exquisite Pink Lily & Rose Bouquet</span>
//         </nav>

//         <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">

//           {/* Image Gallery */}
//           <div className="md:col-span-7 flex flex-col gap-3">
//             <div className="aspect-square w-full rounded-xl overflow-hidden bg-surface-container relative group">
//               <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={activeImage} alt="Product" />
// {/* API: POST /api/wishlist — add to wishlist { productId } */}
//               <button
//                 className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
//               >
//                 <span className="material-symbols-outlined text-primary">favorite</span>
//               </button>
//             </div>
//             <div className="flex gap-2 overflow-x-auto hide-scrollbar">
//               {thumbnails.map((img, i) => (
//                 <button key={i} onClick={() => setActiveImage(img)}
//                   className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === img ? "border-primary" : "border-outline-variant hover:border-primary"}`}>
//                   <img className="w-full h-full object-cover" src={img} alt={`Thumbnail ${i + 1}`} />
//                 </button>
//               ))}
//               <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-outline-variant flex items-center justify-center bg-surface-container cursor-pointer hover:border-primary transition-colors">
//                 <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
//               </div>
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="md:col-span-5 flex flex-col gap-6">
//             <div className="border-b border-outline-variant pb-6">
//               <h1 className="font-headline-md text-[28px] md:text-headline-md text-on-surface mb-2 leading-tight">Exquisite Pink Lily & Rose Bouquet</h1>
//               <div className="flex items-center gap-3 mb-3 flex-wrap">
//                 <div className="flex items-center bg-primary-fixed px-2 py-0.5 rounded-lg">
//                   <span className="font-label-sm text-label-sm text-primary font-bold mr-1">4.8</span>
//                   <span className="material-symbols-outlined text-[12px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                 </div>
//                 <span className="text-on-surface-variant font-label-sm text-label-sm">124 Reviews</span>
//                 <span className="text-outline">|</span>
//                 <span className="text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
//                   <span className="material-symbols-outlined text-[16px]">eco</span> Fresh Delivery
//                 </span>
//               </div>
//               <div className="flex items-baseline gap-3">
//                 <span className="font-headline-md text-[28px] text-primary">₹2,499</span>
//                 <span className="font-label-lg text-label-lg text-on-surface-variant line-through">₹2,999</span>
//                 <span className="font-label-sm text-label-sm text-primary font-bold">(17% OFF)</span>
//               </div>
//             </div>

//             {/* Delivery Check */}
//             <div className="bg-surface-container/40 p-4 rounded-xl space-y-3">
//               <h3 className="font-label-lg text-label-lg flex items-center gap-2">
//                 <span className="material-symbols-outlined text-primary">location_on</span> Check Availability
//               </h3>
//               {/* API: POST /api/delivery/check — check delivery availability { pincode } */}
//               <div className="flex gap-2">
//                 <input className="flex-1 bg-white border border-outline-variant rounded-lg px-3 py-2 focus:ring-primary focus:border-primary font-body-md outline-none text-sm" placeholder="Enter Pincode" type="text" />
//                 <button className="bg-primary text-white font-label-lg text-label-lg px-4 py-2 rounded-lg hover:opacity-90 transition-colors">Check</button>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
//                   <span className="font-label-sm text-label-sm">Earliest: Today</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
//                   <span className="font-label-sm text-label-sm">Free Delivery</span>
//                 </div>
//               </div>
//             </div>

//             {/* Size Selection */}
//             <div className="space-y-3">
//               <p className="font-label-lg text-label-lg">Choose Size</p>
//               <div className="flex gap-3">
//                 {[
//                   { name: "Standard", desc: "10 Roses, 3 Lilies" },
//                   { name: "Premium", desc: "15 Roses, 5 Lilies" },
//                 ].map((size) => (
//                   <button key={size.name} onClick={() => setSelectedSize(size.name)}
//                     className={`flex-1 border-2 p-3 rounded-xl text-left transition-all ${selectedSize === size.name ? "border-primary bg-primary-fixed" : "border-outline-variant bg-white hover:border-primary"}`}>
//                     <p className={`font-label-lg text-label-lg font-bold ${selectedSize === size.name ? "text-primary" : ""}`}>{size.name}</p>
//                     <p className="font-label-sm text-label-sm text-on-surface-variant">{size.desc}</p>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={cartLoading}
//                 className={`flex-1 text-white font-label-lg text-label-lg py-3 md:py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${cartDone ? "bg-green-600" : "bg-primary"}`}
//               >
//                 <span className={`material-symbols-outlined ${cartLoading ? "animate-spin" : ""}`}>
//                   {cartLoading ? "sync" : cartDone ? "check" : "shopping_bag"}
//                 </span>
//                 {cartLoading ? "Adding..." : cartDone ? "Added!" : "Add to Cart"}
//               </button>
// {/* API: POST /api/orders/buynow — direct checkout { productId, size: selectedSize, quantity: 1 } */}
//               <button
//                 onClick={handleBuyNow}
//                 className="flex-1 border-2 border-primary text-primary font-label-lg text-label-lg py-3 md:py-4 rounded-xl hover:bg-primary-fixed transition-colors active:scale-95 bg-white"
//               >
//                 Buy Now
//               </button>
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-3 gap-2 py-2">
//               {[
//                 { icon: "temp_preferences_eco", label: "Handcrafted" },
//                 { icon: "history", label: "Fresh Always" },
//                 { icon: "lock", label: "Secure Pay" },
//               ].map((f) => (
//                 <div key={f.label} className="flex flex-col items-center gap-1 text-center">
//                   <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
//                     <span className="material-symbols-outlined text-primary text-xl">{f.icon}</span>
//                   </div>
//                   <span className="font-label-sm text-[11px] md:text-[12px] uppercase tracking-wider text-on-surface-variant">{f.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <section className="mt-16 border-t border-outline-variant pt-lg">
//           <div className="max-w-4xl">
//             <div className="flex gap-8 border-b border-outline-variant mb-6 overflow-x-auto hide-scrollbar">
//               {tabs.map((tab) => (
//                 <button key={tab} onClick={() => setActiveTab(tab)}
//                   className={`font-label-lg text-label-lg pb-3 whitespace-nowrap transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}>
//                   {tab}
//                 </button>
//               ))}
//             </div>
//             {activeTab === "Description" && (
//               <div className="space-y-4 text-on-surface-variant">
//                 <p className="font-body-lg text-body-lg text-on-surface">Experience the epitome of floral elegance with our Exquisite Pink Lily & Rose Bouquet. Perfectly curated for moments that demand sophistication.</p>
//                 <ul className="list-disc list-inside space-y-2 ml-4 font-body-md text-body-md">
//                   <li>10 Premium Long-Stem Pink Roses</li>
//                   <li>3 Fragrant Pink Oriental Lilies (Multiple Buds)</li>
//                   <li>Seasonal Greenery and Filler Flowers</li>
//                   <li>Signature R Petals Luxury Wrap and Ribbon</li>
//                   <li>Complimentary Personalized Message Card</li>
//                 </ul>
//                 <p className="font-body-md italic text-primary">"Flowers that speak the language of the heart."</p>
//               </div>
//             )}
//             {activeTab === "Delivery Info" && (
//               <div className="font-body-md text-body-md text-on-surface-variant space-y-2">
//                 <p>Same-day delivery available for orders placed before 4 PM.</p>
//                 <p>Free delivery on orders above ₹999.</p>
//                 <p>Available across 300+ cities in India.</p>
//               </div>
//             )}
//             {activeTab === "Care Instructions" && (
//               <div className="font-body-md text-body-md text-on-surface-variant space-y-2">
//                 <p>Keep flowers in a cool, shaded area away from direct sunlight.</p>
//                 <p>Change water every 2 days and trim stems at an angle.</p>
//                 <p>Remove wilted petals to extend freshness.</p>
//               </div>
//             )}
//               {/* API: GET /api/products/{id}/reviews — fetch paginated reviews */}
//             {activeTab === "Reviews (124)" && (
//               <p className="font-body-md text-body-md text-on-surface-variant">Reviews coming soon...</p>
//             )}
//           </div>
//         </section>

//         {/* Add-ons */}
//         <section className="mt-16 py-lg">
//           <div className="flex justify-between items-end mb-6">
//             <h2 className="font-headline-md text-[28px] text-on-surface">Add a Personal Touch</h2>
//             <a className="text-primary font-label-lg text-label-lg hover:underline" href="#">View All Add-ons</a>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
//             {addons.map((addon) => (
//               <div key={addon.title} className="group cursor-pointer">
//                 <div className="aspect-[4/5] rounded-xl overflow-hidden mb-2 relative">
//                   <img className="w-full h-full object-cover transition-transform group-hover:scale-110" src={addon.image} alt={addon.title} />
//                   <div className="absolute bottom-2 right-2">
//                   {/* API: POST /api/cart/addon — add addon to cart { addonId, quantity: 1 } */}
//                     <button
//                       onClick={() => handleAddAddon(addon.title)}
//                       className="bg-white/90 p-2 rounded-full shadow hover:bg-primary hover:text-white transition-all"
//                     >
//                       <span className="material-symbols-outlined text-[18px]">add</span>
//                     </button>
//                   </div>
//                 </div>
//                 <p className="font-label-lg text-label-lg text-on-surface">{addon.title}</p>
//                 <p className="font-label-sm text-label-sm text-primary">{addon.price}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Mobile Bottom Nav */}
//       <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] md:hidden border-t border-outline-variant">
//         {[
//           { label: "Home", icon: "home", href: "/" },
//           { label: "Categories", icon: "grid_view", href: "/categories/flowers" },
//           { label: "Occasions", icon: "celebration", href: "/categories/occasions" },
//           { label: "Cart", icon: "shopping_bag", href: "/cart", active: true },
//         ].map((item) => (
//           <Link key={item.label} href={item.href}
//             className={`flex flex-col items-center justify-center active:scale-95 transition-transform ${item.active ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}>
//             <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
//             <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// API: GET /api/products/addons — fetch add-on products list
const addons = [
  { title: "Classic Truffles (12pc)", price: "₹899", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqAjmbgZaICAdtT8Rp5Fvs3YZYFU15ZTOZts6wItYjZ4HsBnN-marCdWNOCYNNHTax9RYwJxOi60QrqIazKF-Tre3JXyhPoqY0EL09Pd7ms1qnr1LdXl1EK1FLzQ2YM31xOlp3A0PKSihlynggVh1r6pDx9WDb5Kk-RcSo5j7Ov_aKW5hz7bSrWTS3kzHJAB2ZLMuSbQpkgE63j-3PLlUInYNEvWYlLNw7XC3BdlYAj2x1tcLiOm6xmg" },
  { title: "Cream Teddy Bear", price: "₹499", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1FnJKpd28sZpGXko-oaup_oZC8nlwuH-yDZRO3y8KbmCjB734qHt_ofLGhNI-qFRfqNl2lfFbxCeLBl__jJ1nd4Pwr9mY7eKfESGaFB_yba5zRotfxS0Fy-JYlqXE9Zt388rVkwhiMigza9oUXfQ8NBurq-z9S0q0oyla54JsDH-ddiKf0FsqKlhHVHa0D22yeceDyg9JSS78QfxXtucLMlOSluuVWTnAe4oInXKrPxnU7_f1Zcpldg" },
  { title: "Designer Gold Vase", price: "₹1,299", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-cCi-IgT58SzGFVDO7hq68BxD9HRAkbGfQydRegVEdokuu_B6IemDFlSOaqJ_LAcfYdD-lWm5NviazBuH_sHweXeRojY7cXcbG3k9xdV7T-9C3Nzg_3wtbpygpgk4QWyi8h-_IyrNWz64K0Dh42M9f8sftRnZRRPV78HJlq2HATjdGz4yviWsqQvlgtfNDCprJiDTA3ewXuSCreXym6IYgDAlT6TSuDXJV3RMXC1gu-ebqSJQWxLB9w" },
  { title: "Festive Balloons", price: "₹299", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNaC3HxKMXLL4019YGJwCaBu1oV9a0lDKgt6Zc-YA54sRPccFE3LS2vHDCbOzbGBzBiIj_QKrKZpgbaLuFhggYdEMYz32peoe9KrSdZRLMmZJ3UE1frbnDgiuvVNgepJCNjO8F9xOKsTcu60j22YAW4Wq6knlfG-TFCXGGmdlhb6v3GpNfd0HGxbH23UeBULw_C-SG3oUwDuCwn_WFjlqyjcQ1AWV8HSZjzYzcLSHDfqDSH9TBRd08Uw" },
];

const thumbnails = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBIPPeLJGfJhzGG74widG5HFece0nyOAmqtUPrxWJ1NcB_26_No74FYUvGX8jLk5awkxA0ftRgl5Ku4VYbXpKS06S7Ya0avFo0xYrQGhKjHrfnK1NKxL1WtzM3c-C4ROXjwlw8LGmZc2jaS_WnjsRXevTCw-vxSa25d-cV6Q60ZIkRvEUUr3q7zmYXEFdK59Bo-eiLZCoEdPVqYf9CSmwAUDnNBJaKZeAFmgn67WikguO3fhQDDvQBLXQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDRSXppwvMCPlDSahPizujIqR9IzYPk-J5aOZbcRrjBQMAe0s-md0xTg_MU8r1FgjjAK_9RSEW9qLWgg1oKJYicdkxAMgmJRz2USXjt_0c6I_U3rjNjbxi73rUuSrgplWXUN9MXj_3t9BTGUI73BuAwCtOH3LVgOSBFu9a5f0vNghks8iPzEgSeWoGrwEhlXrWYwiEyUYKGv18CJQfqklCCoGNK-d0_TuL02xXJW5CtwYvTTYaT7b5fGw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD2etjStOdFaNeL16FTvZHNsFyw0xUMNFVfBRGUQSJkKior0PisqQgIJsSuE1IuB5aKGdeZ1wcPmCTy8lcdoHGwZqwkgD6TlNuK3x6cs6J8-mS06KKaAq8CcrUkU53_DxC-6drrgl6QFrkVZ_cqHzcW6ybbSVpNwrOQTCodyMVCOCOqZG8AuUUYqOk0VGQbSHvcA4RfY1TiVVVzJWkGTw_SpjP326gJpBE6T-KxH0tATzPOwjRKIXNVHg",
];

// API: GET /api/products/{id} — fetch product detail by id (images, price, sizes, rating, description)
const mainImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAcPzxx46V34pi3O8LuXaGKK5cW0ff8NR5Yx6duGGx5IIVelsro7QHbT-vijAcSQ8P_gF8gA6LOgMf-UG31FrR8cjEfHJuTT7261ZHbF4BRbAuyVkk4uSyhdFYjKiU42UsskAWtm0xp00rQ72dxxARUVowtWj5o7aO2A8_gnfqqD0VuU9jxw2lQLg-4ZTHKTJQAUneTjdwy3nXysTfh-htJ5RLYg1BBNlVIgq1vQgw5N7gQRURlxVeNYw";

const navLinks = ["Flowers", "Cakes", "Plants", "Personalised", "Occasions", "LUXE"];
const navRoutes = {
  Flowers: "/categories/flowers",
  Cakes: "/categories/cakes",
  Plants: "/categories/plants",
  Personalised: "/categories/personalised",
  Occasions: "/categories/occasions",
  LUXE: "/categories/luxe",
};

const tabs = ["Description", "Delivery Info", "Care Instructions", "Reviews (124)"];

export default function ProductDetailPage() {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(mainImage);
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [activeTab, setActiveTab] = useState("Description");
  const [cartLoading, setCartLoading] = useState(false);
  const [cartDone, setCartDone] = useState(false);

  // ---- PINCODE AVAILABILITY CHECK STATES ----
  const [checkPincode, setCheckPincode] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [availability, setAvailability] = useState(null);
  // availability possible values: null | "available" | "unavailable" | "invalid" | "error"
  const [availabilityCity, setAvailabilityCity] = useState("");

  // API: POST /api/delivery/check — check delivery availability { pincode }
  const handleCheckPincode = async () => {
    const numbersOnly = checkPincode.replace(/\D/g, "").slice(0, 6);

    if (numbersOnly.length !== 6) {
      setAvailability("invalid");
      setAvailabilityCity("");
      return;
    }

    setIsCheckingPincode(true);
    setAvailability(null);
    setAvailabilityCity("");

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
        const city = data[0].PostOffice[0]?.District || "";
        const isServiceable = city.trim().toLowerCase() === "nashik";

        setAvailabilityCity(city);
        setAvailability(isServiceable ? "available" : "unavailable");
      } else {
        setAvailability("invalid");
      }
    } catch (error) {
      console.error("Pincode API Error:", error);
      setAvailability("error");
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const handleAddToCart = () => {
    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/cart");
      return;
    }

    // API: POST /api/cart — add to cart { productId, size: selectedSize, quantity: 1 }
    setCartLoading(true);
    setTimeout(() => {
      setCartLoading(false);
      setCartDone(true);
      setTimeout(() => setCartDone(false), 2000);
    }, 1000);
  };

  const handleAddAddon = (addonTitle) => {
    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/cart");
      return;
    }
  };

  const handleBuyNow = () => {
    if (!localStorage.getItem("rpetalsUser")) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // API: POST /api/orders/buynow — direct checkout { productId, size: selectedSize, quantity: 1 }
    router.push("/checkout");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">

      {/* Header */}
      <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant shadow-sm h-16 md:h-[90px] flex items-center">
        <div className="flex justify-between items-center w-full px-4 md:px-lg max-w-container-max mx-auto">
          <Link href="/">
            <Image src="/logo1.png" alt="R Petals Logo" width={0} height={0} sizes="100vw" className="h-10 md:h-[70px] w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link key={item} href={navRoutes[item] || "#"}
                className={`font-label-lg text-label-lg transition-colors ${item === "Flowers" ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}>
                {item === "LUXE" ? <span className="flex items-center gap-1">LUXE <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></span> : item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container transition-all rounded-full">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
            </button>
            {/* API: GET /api/cart — fetch cart item count for badge */}
            <Link href="/cart" className="p-2 hover:bg-surface-container transition-all rounded-full relative">
              <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
              <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
            </Link>
            <button className="p-2 hover:bg-surface-container transition-all rounded-full">
              <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-4 md:px-lg py-6 md:py-lg pb-24 md:pb-lg">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-on-surface-variant mb-6 font-label-sm text-label-sm flex-wrap">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/categories/flowers" className="hover:text-primary">Flowers</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-medium truncate max-w-[160px] md:max-w-none">Exquisite Pink Lily & Rose Bouquet</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">

          {/* Image Gallery */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-surface-container relative group">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={activeImage} alt="Product" />
{/* API: POST /api/wishlist — add to wishlist { productId } */}
              <button
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-primary">favorite</span>
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {thumbnails.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === img ? "border-primary" : "border-outline-variant hover:border-primary"}`}>
                  <img className="w-full h-full object-cover" src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-outline-variant flex items-center justify-center bg-surface-container cursor-pointer hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">videocam</span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="border-b border-outline-variant pb-6">
              <h1 className="font-headline-md text-[28px] md:text-headline-md text-on-surface mb-2 leading-tight">Exquisite Pink Lily & Rose Bouquet</h1>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="flex items-center bg-primary-fixed px-2 py-0.5 rounded-lg">
                  <span className="font-label-sm text-label-sm text-primary font-bold mr-1">4.8</span>
                  <span className="material-symbols-outlined text-[12px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <span className="text-on-surface-variant font-label-sm text-label-sm">124 Reviews</span>
                <span className="text-outline">|</span>
                <span className="text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">eco</span> Fresh Delivery
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-headline-md text-[28px] text-primary">₹2,499</span>
                <span className="font-label-lg text-label-lg text-on-surface-variant line-through">₹2,999</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">(17% OFF)</span>
              </div>
            </div>

            {/* Delivery Check */}
            <div className="bg-surface-container/40 p-4 rounded-xl space-y-3">
              <h3 className="font-label-lg text-label-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span> Check Availability
              </h3>

              {/* API: POST /api/delivery/check — check delivery availability { pincode } */}
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-white border border-outline-variant rounded-lg px-3 py-2 focus:ring-primary focus:border-primary font-body-md outline-none text-sm"
                  placeholder="Enter Pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={checkPincode}
                  onChange={(e) => {
                    setCheckPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setAvailability(null);
                    setAvailabilityCity("");
                  }}
                />
                <button
                  onClick={handleCheckPincode}
                  disabled={isCheckingPincode}
                  className="bg-primary text-white font-label-lg text-label-lg px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-60"
                >
                  {isCheckingPincode ? "Checking..." : "Check"}
                </button>
              </div>

              {/* RESULT MESSAGE */}
              {availability === "available" && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Delivery available in {availabilityCity}!
                </p>
              )}

              {availability === "unavailable" && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  Service not available
                </p>
              )}

              {availability === "invalid" && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  Enter a valid 6-digit pincode.
                </p>
              )}

              {availability === "error" && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  Unable to check right now. Try again.
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                  <span className="font-label-sm text-label-sm">Earliest: Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                  <span className="font-label-sm text-label-sm">Free Delivery</span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <p className="font-label-lg text-label-lg">Choose Size</p>
              <div className="flex gap-3">
                {[
                  { name: "Standard", desc: "10 Roses, 3 Lilies" },
                  { name: "Premium", desc: "15 Roses, 5 Lilies" },
                ].map((size) => (
                  <button key={size.name} onClick={() => setSelectedSize(size.name)}
                    className={`flex-1 border-2 p-3 rounded-xl text-left transition-all ${selectedSize === size.name ? "border-primary bg-primary-fixed" : "border-outline-variant bg-white hover:border-primary"}`}>
                    <p className={`font-label-lg text-label-lg font-bold ${selectedSize === size.name ? "text-primary" : ""}`}>{size.name}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{size.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className={`flex-1 text-white font-label-lg text-label-lg py-3 md:py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${cartDone ? "bg-green-600" : "bg-primary"}`}
              >
                <span className={`material-symbols-outlined ${cartLoading ? "animate-spin" : ""}`}>
                  {cartLoading ? "sync" : cartDone ? "check" : "shopping_bag"}
                </span>
                {cartLoading ? "Adding..." : cartDone ? "Added!" : "Add to Cart"}
              </button>
{/* API: POST /api/orders/buynow — direct checkout { productId, size: selectedSize, quantity: 1 } */}
              <button
                onClick={handleBuyNow}
                className="flex-1 border-2 border-primary text-primary font-label-lg text-label-lg py-3 md:py-4 rounded-xl hover:bg-primary-fixed transition-colors active:scale-95 bg-white"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 py-2">
              {[
                { icon: "temp_preferences_eco", label: "Handcrafted" },
                { icon: "history", label: "Fresh Always" },
                { icon: "lock", label: "Secure Pay" },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">{f.icon}</span>
                  </div>
                  <span className="font-label-sm text-[11px] md:text-[12px] uppercase tracking-wider text-on-surface-variant">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <section className="mt-16 border-t border-outline-variant pt-lg">
          <div className="max-w-4xl">
            <div className="flex gap-8 border-b border-outline-variant mb-6 overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`font-label-lg text-label-lg pb-3 whitespace-nowrap transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}>
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "Description" && (
              <div className="space-y-4 text-on-surface-variant">
                <p className="font-body-lg text-body-lg text-on-surface">Experience the epitome of floral elegance with our Exquisite Pink Lily & Rose Bouquet. Perfectly curated for moments that demand sophistication.</p>
                <ul className="list-disc list-inside space-y-2 ml-4 font-body-md text-body-md">
                  <li>10 Premium Long-Stem Pink Roses</li>
                  <li>3 Fragrant Pink Oriental Lilies (Multiple Buds)</li>
                  <li>Seasonal Greenery and Filler Flowers</li>
                  <li>Signature R Petals Luxury Wrap and Ribbon</li>
                  <li>Complimentary Personalized Message Card</li>
                </ul>
                <p className="font-body-md italic text-primary">"Flowers that speak the language of the heart."</p>
              </div>
            )}
            {activeTab === "Delivery Info" && (
              <div className="font-body-md text-body-md text-on-surface-variant space-y-2">
                <p>Same-day delivery available for orders placed before 4 PM.</p>
                <p>Free delivery on orders above ₹999.</p>
                <p>Available across 300+ cities in India.</p>
              </div>
            )}
            {activeTab === "Care Instructions" && (
              <div className="font-body-md text-body-md text-on-surface-variant space-y-2">
                <p>Keep flowers in a cool, shaded area away from direct sunlight.</p>
                <p>Change water every 2 days and trim stems at an angle.</p>
                <p>Remove wilted petals to extend freshness.</p>
              </div>
            )}
              {/* API: GET /api/products/{id}/reviews — fetch paginated reviews */}
            {activeTab === "Reviews (124)" && (
              <p className="font-body-md text-body-md text-on-surface-variant">Reviews coming soon...</p>
            )}
          </div>
        </section>

        {/* Add-ons */}
        <section className="mt-16 py-lg">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline-md text-[28px] text-on-surface">Add a Personal Touch</h2>
            <a className="text-primary font-label-lg text-label-lg hover:underline" href="#">View All Add-ons</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {addons.map((addon) => (
              <div key={addon.title} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-2 relative">
                  <img className="w-full h-full object-cover transition-transform group-hover:scale-110" src={addon.image} alt={addon.title} />
                  <div className="absolute bottom-2 right-2">
                  {/* API: POST /api/cart/addon — add addon to cart { addonId, quantity: 1 } */}
                    <button
                      onClick={() => handleAddAddon(addon.title)}
                      className="bg-white/90 p-2 rounded-full shadow hover:bg-primary hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
                <p className="font-label-lg text-label-lg text-on-surface">{addon.title}</p>
                <p className="font-label-sm text-label-sm text-primary">{addon.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] md:hidden border-t border-outline-variant">
        {[
          { label: "Home", icon: "home", href: "/" },
          { label: "Categories", icon: "grid_view", href: "/categories/flowers" },
          { label: "Occasions", icon: "celebration", href: "/categories/occasions" },
          { label: "Cart", icon: "shopping_bag", href: "/cart", active: true },
        ].map((item) => (
          <Link key={item.label} href={item.href}
            className={`flex flex-col items-center justify-center active:scale-95 transition-transform ${item.active ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"}`}>
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
            <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}