"use client";
import CategoryPage from "../../components/CategoryPage";

const plantsData = {
  name: "Plants",
  activeNavItem: "Plants",
  headline: "Curated Indoor & Outdoor Plants",
  description: "Bring nature indoors with our handpicked collection of plants. From air-purifying greens to exotic succulents.",
  subCategories: [
    { name: "Indoor", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA" },
    { name: "Succulents", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow" },
    { name: "Bonsai", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg" },
    { name: "Flowering", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g" },
  ],
  filterLabel: "Plant Type",
  filterTypes: ["Indoor Plants", "Succulents", "Bonsai", "Air Purifiers", "Flowering Plants", "Terrariums"],
  priceRanges: ["Below ₹999", "₹1000 - ₹2499", "₹2500 - ₹4999", "Luxury (₹5000+)"],
  occasions: ["Housewarming", "Birthday", "Corporate", "Get Well Soon"],
  products: [
    { title: "Emerald Zen Ficus", description: "Indoor curated plant", price: "₹3,299", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA" },
    { title: "Mini Succulent Set", description: "Set of 3 desert plants", price: "₹899", badge: "BESTSELLER", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow" },
    { title: "Jade Bonsai Tree", description: "5 year old, ceramic pot", price: "₹4,500", badge: "LUXE", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg" },
    { title: "Peace Lily", description: "Air purifying, low maintenance", price: "₹1,199", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g" },
    { title: "Terrarium Garden", description: "Glass bowl, moss & pebbles", price: "₹2,199", badge: "NEW", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA" },
    { title: "Monstera Deliciosa", description: "Large tropical leaf plant", price: "₹2,799", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow" },
  ],
};

export default function PlantsPage() {
  return <CategoryPage category={plantsData} />;
}
