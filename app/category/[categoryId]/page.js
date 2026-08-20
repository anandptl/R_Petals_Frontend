"use client";
import CategoryPage from "../../components/CategoryPage";


const flowersData = {
  name: "Flowers",
  activeNavItem: "Flowers",
  headline: "Bespoke Floral Arrangements",
  description: "Curated blooms designed to speak the language of your heart. From romantic roses to joyful lilies, find the perfect gesture.",
  subCategories: [
    { name: "Roses", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdVJfGTRWlYUKe5w-MpJDj4to8Z8KfzOCnMxCkR98spZIbHkQpcSlYH38BUIrY37BAOa4n-Aoz3FIS-bI24oz2TtgV63XG7iardH9ikydT15cF7_uF8W37830n32wRcl5i_ZUjWZs8v6pWi9nlNDszY_jYq69YOQECvRZ4P8C34zetWfRJqkWIKhQ8pzV8PIemqkQP5udkBT2wJVpNG2pEOiPHdqj1zsFlPo1nvnAnWkyJxR04MJcLxw" },
    { name: "Lilies", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQSb3bnA3O-mFQ_Hh2D3z1Mi_CHRHIYFUYtlEJEHPnOBRBholtO0bBOwaf3SmtMWl0iTUF8yjowh9w7DLHZBmmTXsgmJHDz21TXMLmgrefPrBAVAp3rX8Fq9ZsWwAgSgOi9d1bqnZ5SiS42Sr0P4ojbcWY82n7mMuBrF1sj5virz6VxzPue1zd1yvjKThaTXKw9wQx7Mp9xzeqhypz7ynWurworyTHRry97SUEnU2V3n_odjsvKxTR-A" },
    { name: "Orchids", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm1SYO27DyK33aJqwjcRLTV0SXX9D3UO9HgjGUWJnNtCkYuPiZFZ0TDVa6KHCKUtfWyj8I7Hxxk4m9hY7zUxhsKGfnOXRMhyW6yIwrACmZUEyp6dvGa4BxZZhVFjrbpq-JEk2XbTMzQjwxzMZudidi-a2s_NMsn95jnBBTg1Pwid2dejucVMKLJT2AhFtNkyu4pKTXlyFNN8jj5MHh39n2SUWXlwtj-07RwKFx4o_NNdxLLTEN0HQRzA" },
    { name: "Carnations", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxu6mLAXHM0Bw77beYp0Bw8ybavrX7NykZoXXbkMpQhPwtHRx4S2_HOIg4eBBAEh7r5PIlsutCMrJ-lS0r2wI-hgbqd-a0noFqoPryGjx6cg44ewsKinszDJoSA4G2HmP6avx_Zo8i9dZbBlqAd19biGOUTS3vjRAfpEf7bbBAB_r8vBI7OxDuqsNPrUDZzsuW9TUQfKCz7W_c2SEpUB7tn2xX9pUvhy-eI1uexxCEUDWpOM8HEvvijQ" },
  ],
  filterLabel: "Flower Type",
  filterTypes: ["Roses", "Lilies", "Orchids", "Carnations", "Sunflowers", "Mixed Bouquets"],
  priceRanges: ["Below ₹999", "₹1000 - ₹2499", "₹2500 - ₹4999", "Luxury (₹5000+)"],
  occasions: ["Birthday", "Anniversary", "Love", "Sympathy"],
  products: [
    { title: "Velvet Midnight Bouquet", description: "Roses, Hydrangeas, Eucalyptus", price: "₹3,499", badge: "LUXE", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA68ltBgx7UZpQ3kFGrAbReBNFeWYvio1JUfpY1mVTn7I5gGxw7T9zxFa7Gtc7o3Rr7rSbmpNcIM2UE2-PgBWfuzTxaBgdFWqZ5BPOv5OCbXFUW6L6vjuoWX-gAvyRa6AYHsHuhYxqSEX1YIA60H5smkUcp9pwBy1S59hFZuWu-F1V7X3ayRYE7-OatQ_0VOWZ4nPP1YvS4qh_v76qtDIrbjriMZddiUuVzpgAOlxfJNIvCW8zi4qY-hQ" },
    { title: "Blush Tulip Whisper", description: "Imported Tulips, Gypsophila", price: "₹1,899", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYPhpwpptsaAhy84SN5yEPWGFU_knK6HyEcP6I8OR1TZfzePmSm-FvCvLlI0AoTrCF_2O1bSvqSx43WvUP4zikKdZMqTscxyY6OWZ6kugkk8lsQF-czoF0Nqrv9vDQXEbVTDVoBNHFIkn8tEteojenUf_7IYNHPn6FdLSM34mQSJxgJ9z0J-FEOv82s4h0yUDeMV_9Wxm4D24_Wv-40p75_keKxc8QN7HFVaO17uxwAJJ3WwDCJmZkig" },
    { title: "Golden Orchid Cascade", description: "Phalaenopsis, Ruscus, Monstera", price: "₹4,200", badge: "BESTSELLER", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDvt3Ah9a6CyeP2KCKKV89Lh4xA9ESl_QdUVxHJUQkDWNRlIDbgU437sg-ten_6c9Rb3dDq0NZ642vq81IyJiFKBafkGb-4YFA2DQszkbWgGMLFuTngV-83YTwe2LIqaCGXMMHthjDVK_1uZiH5jtDZAMeEHyQZOhnSa-RdCEUVXTgEvMq4NXRlvR1VwWCZ-H0lsktqenYK-NwL2vzJA8w9Sx-ItjYwlYPemXlkHAzOpZPYFQ9BG7dQA" },
    { title: "Peachy Dream Box", description: "Peonies, Seasonal Dahlias", price: "₹2,150", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFPmLL4sFiNz8i1bZwIpFKmfErvOjWJe3m1rDQjQuBBUnyFvq3AvJ3DuIW-XTT1RnTSu2PXV_YtEnqHoZsCMdJJzVIOVrrcm-0wiCwDJ6fkBrRXDNg_m7Ijes7It1TiaW__9EL4d3rVaQqorhGszqahlrKqD78U3vBg8zpK0yClJFPCO-gqI4Xps9jiRMGSvD23t0hx-LcGxY0_4skhvO9iJl2f26s_gDquroy-tREOYGNvnuOMWwyKA" },
    { title: "Arctic Elegance", description: "Calla Lilies, Steel Grass", price: "₹2,799", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJTM7NYQzMPhQ2wnPyXVD8On7V0njKepspqD9LaIOIJLGkgIyi3lh3XpRz-3MTC7kCJk3kvc-C93-O_A2CqgfmmehcSFT7MhTDuhavUPoZJQFVWHG7Nn1Xf0b-jQ3iW1wnwoS2XCr-xOTv8DhrU7rcLGknraLsGhJWTx9UhUZ_QR6_njhwaQHFBvSvwsX58CcP7Kv6PShwyfgY3Urqj_b1KEghi4HPDJTcjUwfyTb_-6d87LvhGJAqVA" },
    { title: "Sun-Kissed Meadow", description: "Sunflowers, Lavender, Wheat", price: "₹1,499", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAflvwY7c8laQ07kVcRDtD_L0zPl7Zt3vEy8mThChaWrkN2LOSATS4V_hd7mN5aPtX1AC3AL_TGT6apPKlCu6-0fVQ1m4xc6lQtz-RGUszCIW2c5ggnLmLY5mjlcKso_8bhunF-HbOvKqckI3tW_CnvUM72_TH4jhWOvM0IgVi-HzhRnt9QvVQxrg_jYH1sZd15LCXSwNsf0pqGzcXTIGSii6GasgumrvhIvIHxq-MKap2EoFJE8J91kQ" },
  ],
};

export default function FlowersPage() {
  return <CategoryPage category={flowersData} />;
}
