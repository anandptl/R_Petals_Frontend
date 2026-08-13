"use client";
import CategoryPage from "../../components/CategoryPage";

const occasionsData = {
  name: "Occasions",
  activeNavItem: "Occasions",
  headline: "Gifts for Every Occasion",
  description: "Celebrate life's most precious moments with our curated gift collections. From birthdays to weddings, we have the perfect gift.",
  subCategories: [
    { name: "Birthday", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow" },
    { name: "Anniversary", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg" },
    { name: "Wedding", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g" },
    { name: "Valentine", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA" },
  ],
  filterLabel: "Occasion Type",
  filterTypes: ["Birthday", "Anniversary", "Wedding", "Valentine's Day", "Mother's Day", "Farewell"],
  priceRanges: ["Below ₹999", "₹1000 - ₹2499", "₹2500 - ₹4999", "Luxury (₹5000+)"],
  occasions: ["Same Day", "Next Day", "Scheduled", "Midnight"],
  products: [
    { title: "Birthday Bloom Box", description: "Roses, balloons & chocolates", price: "₹1,799", badge: "BESTSELLER", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow" },
    { title: "Anniversary Red Roses", description: "24 premium red roses", price: "₹2,299", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg" },
    { title: "Wedding Centrepiece", description: "Luxury table arrangement", price: "₹5,999", badge: "LUXE", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsUMTiUIlK-BvyqTudaF3hCC4vuJdtAgtiZ_SAkgSdaEEQ6ArCeGIbBfrrYH8gwcaTznkii6gY_VnzBLgkt4ffcq1M-Q_EdGOpoKEsy-R8SI4oxV-df5stGgyXWXDmRHOt2g_iRABA52ixyOTBFXvWC4fH5NPmHEQS3ZY26AmZLvoMe1C5Xuo5tJMTIQJvmwNVP-5V7zmGIsPEu-30NkIPLTcUt9BHIBURXvtEcS6adjFsehWpTfF38g" },
    { title: "Valentine Heart Box", description: "Red roses in heart shape", price: "₹1,499", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeYtWlLaEkb52raoUB5UHe_ozMf1Fan6skG3SE6UH6xvVM5Oxd_4bxLrrqtEn20DeOywonQYJG7yF8OnKRIBMKkITGOIg8UIGr-TAZCDUDWYQN-klMHi-HYEZ-V0Jykn8d8T3YgM0IWXTwI4ABpdeBSRUoopPXZ_Pu9Bdte7Jbf7tb3vC2VUm_F1R7GPK0fVOX6cQhaAU_PcgkYHqqCNUiTjgWpb5xB2wkCOuC5Paf15WNHUwP2I_0OA" },
    { title: "Mother's Day Hamper", description: "Flowers, chocolates & spa kit", price: "₹3,299", badge: "NEW", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N1NWG1kDBgtvnAQ6BdebyIWk-KtczTq21P0OcNh1-lfjiMW41pHfc_OfOBw6YLlpCRhWPTrOPGovXmuX-4NW_QYk1CaM7Rf2i0Gg4kALxYKq63-4DyR_yN_Egbyo_ZVdhN-Y2IcOs9qDqJCWCjFDjEFXGfYHsDik44iiRkzkt4qQvZQBGWJ9nmXNBWf66lQxH9Wn8HnCv81uEI8s2hLUMIg-svhN6yYD9Uwnra7QZ8flxGwJEDxGow" },
    { title: "Farewell Sunshine", description: "Sunflowers & good luck charm", price: "₹1,199", badge: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PEfMCmBsAdSOxNXO-fFNUBHuUlE5P9pv-FaFiyBehCy8u7-EFicLPEP_n9-FnnN8V_5mj5QpnLhwcixpFvYCVpEM2J_2OaMRJfz80p2fhQPuX-D7Ug55QHf12UxUPgjehnb_FaD0DTWabodkFuEdBBuugE8_bthG00bCj0OOvpjJ9ixJo0zQECHHcfCGi0tJEDzHVQAxiq-L31il6vJ5DblkY3A-0rqfLfeS5PeyuByLZ9_M_hv3tg" },
  ],
};

export default function OccasionsPage() {
  return <CategoryPage category={occasionsData} />;
}
