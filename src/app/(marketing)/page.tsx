import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { HeroSection } from "@/components/marketing/HeroSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { EbookSection } from "@/components/marketing/EbookSection";
import { FinalCtaSection } from "@/components/marketing/FinalCtaSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090B]">
      <MarketingHeader />
      
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <EbookSection />
        <FinalCtaSection />
      </main>

      <MarketingFooter />
    </div>
  );
}
