"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import CategoryPage from "../../../components/CategoryPage";

/*
 * This page keeps the existing storefront CategoryPage component.
 * Current source data is the Flowers page data. Later, the same route
 * can be connected to the backend using categoryId + subCategoryId.
 */

const subCategoryProducts = {
  roses: {
    name: "Roses",
    activeNavItem: "Flowers",
    headline: "Rose Collection",
    description:
      "Fresh rose arrangements curated for every special moment.",
    subCategories: [],
    filterLabel: "Rose Type",
    filterTypes: ["Red Roses", "Pink Roses", "White Roses", "Mixed Roses"],
    priceRanges: [
      "Below ₹999",
      "₹1000 - ₹2499",
      "₹2500 - ₹4999",
      "Luxury (₹5000+)",
    ],
    occasions: ["Birthday", "Anniversary", "Love", "Romance"],
    products: [
      {
        title: "Red Rose Bouquet",
        description: "Fresh red roses arranged beautifully",
        price: "₹999",
        badge: "Popular",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDdVJfGTRWlYUKe5w-MpJDj4to8Z8KfzOCnMxCkR98spZIbHkQpcSlYH38BUIrY37BAOa4n-Aoz3FIS-bI24oz2TtgV63XG7iardH9ikydT15cF7_uF8W37830n32wRcl5i_ZUjWZs8v6pWi9nlNDszY_jYq69YOQECvRZ4P8C34zetWfRJqkWIKhQ8pzV8PIemqkQP5udkBT2wJVpNG2pEOiPHdqj1zsFlPo1nvnAnWkyJxR04MJcLxw",
      },
      {
        title: "Premium Rose Bouquet",
        description: "Premium roses with elegant wrapping",
        price: "₹1,499",
        badge: "Premium",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDdVJfGTRWlYUKe5w-MpJDj4to8Z8KfzOCnMxCkR98spZIbHkQpcSlYH38BUIrY37BAOa4n-Aoz3FIS-bI24oz2TtgV63XG7iardH9ikydT15cF7_uF8W37830n32wRcl5i_ZUjWZs8v6pWi9nlNDszY_jYq69YOQECvRZ4P8C34zetWfRJqkWIKhQ8pzV8PIemqkQP5udkBT2wJVpNG2pEOiPHdqj1zsFlPo1nvnAnWkyJxR04MJcLxw",
      },
    ],
  },
};

export default function SubCategoryPage() {
  const params = useParams();
  const router = useRouter();

  const subCategoryId = params?.subCategoryId;

  const data = useMemo(() => {
    /*
     * Existing storefront data is currently static.
     * The route is dynamic so it is ready for backend integration.
     */
    return (
      subCategoryProducts[String(subCategoryId || "").toLowerCase()] ||
      subCategoryProducts.roses
    );
  }, [subCategoryId]);

  return <CategoryPage category={data} />;
}
