"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const footerCompany = ["About Us", "Contact Us", "Franchise", "Careers"];
const footerSupport = ["Shipping Info", "Terms & Conditions", "Privacy Policy", "FAQs"];
const footerCities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Dubai"];

export default function Footer() {
  const [footerCompanyOpen, setFooterCompanyOpen] = useState(false);
  const [footerSupportOpen, setFooterSupportOpen] = useState(false);

  return (
    <footer className="bg-[#FAF8F5] border-t border-gray-200/80 pt-8 pb-24 md:pb-12 text-[#2D2825]">
      <div className="max-w-container-max mx-auto px-4 sm:px-6">
        
        {/* Desktop View */}
        <div className="hidden min-[720px]:grid min-[720px]:grid-cols-4 gap-4 lg:gap-8 pb-8 border-b border-gray-200/90">
          <div className="col-span-1">
            <Image
              src="/logo1.png"
              alt="R Petals Logo"
              width={180}
              height={60}
              style={{ width: "auto", height: "auto" }}
              className="h-14 lg:h-16 w-auto max-w-[180px] lg:max-w-[200px] mb-3 lg:mb-4 object-contain"
            />
            <p className="text-[12px] lg:text-sm text-[#5C544E] leading-relaxed mb-4">
              Established in 1994, R Petals has been the pioneer in delivering happiness through
              blossoms across the globe.
            </p>
            <div className="flex gap-2.5">
              <a
                href="#"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] hover:text-primary hover:border-primary transition-colors bg-white/40"
              >
                <span className="material-symbols-outlined text-[16px] lg:text-[18px]">share</span>
              </a>
              <a
                href="#"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] hover:text-primary hover:border-primary transition-colors bg-white/40"
              >
                <span className="material-symbols-outlined text-[16px] lg:text-[18px]">photo_camera</span>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest mb-3 lg:mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2 lg:space-y-2.5">
              {footerCompany.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-xs lg:text-sm text-[#5C544E] hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest mb-3 lg:mb-4">
              SUPPORT
            </h4>
            <ul className="space-y-2 lg:space-y-2.5">
              {footerSupport.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-xs lg:text-sm text-[#5C544E] hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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

        {/* Mobile Accordion View */}
        <div className="block min-[720px]:hidden">
          <div className="mb-6">
            <Image
              src="/logo1.png"
              alt="R Petals Logo"
              width={180}
              height={60}
              style={{ width: "auto", height: "auto" }}
              className="h-14 w-auto max-w-[200px] mb-4 object-contain"
            />
            <p className="text-[13px] text-[#5C544E] leading-relaxed mb-5">
              Established in 1994, R Petals has been the pioneer in delivering happiness through
              blossoms across the globe.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-11 h-11 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] bg-white/40"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-2xl border border-gray-300 flex items-center justify-center text-[#4A403A] bg-white/40"
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </a>
            </div>
          </div>

          <hr className="border-t border-gray-200/90 my-4" />

          <div>
            <button
              onClick={() => setFooterCompanyOpen(!footerCompanyOpen)}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest">COMPANY</h4>
              <span
                className="material-symbols-outlined text-gray-500 text-[20px] transition-transform duration-200"
                style={{ transform: footerCompanyOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                expand_more
              </span>
            </button>
            {footerCompanyOpen && (
              <ul className="space-y-2.5 pb-3 pt-1">
                {footerCompany.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-xs text-[#5C544E]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <hr className="border-t border-gray-200/90 my-4" />

          <div>
            <button
              onClick={() => setFooterSupportOpen(!footerSupportOpen)}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest">SUPPORT</h4>
              <span
                className="material-symbols-outlined text-gray-500 text-[20px] transition-transform duration-200"
                style={{ transform: footerSupportOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                expand_more
              </span>
            </button>
            {footerSupportOpen && (
              <ul className="space-y-2.5 pb-3 pt-1">
                {footerSupport.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-xs text-[#5C544E]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <hr className="border-t border-gray-200/90 my-4" />

          <div className="py-2">
            <h4 className="text-xs font-bold text-[#3A332E] uppercase tracking-widest mb-3">
              DELIVERY TO
            </h4>
            <div className="flex flex-wrap gap-2">
              {footerCities.map((city) => (
                <span key={city} className="px-4 py-1.5 bg-[#F0ECE6] rounded-full text-xs font-medium text-[#4A423D]">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-t border-gray-200/90 my-6" />

        <div className="flex flex-col min-[720px]:flex-row justify-between items-center gap-4 text-center">
          <div className="flex gap-4 text-[#4A423D] order-1 min-[720px]:order-2">
            <span className="material-symbols-outlined text-[26px]">payments</span>
            <span className="material-symbols-outlined text-[26px]">credit_card</span>
          </div>
          <p className="text-xs text-[#6B625B] order-2 min-[720px]:order-1">
            © 2024 R Petals. All rights reserved. Flowers that speak.
          </p>
        </div>
      </div>
    </footer>
  );
}