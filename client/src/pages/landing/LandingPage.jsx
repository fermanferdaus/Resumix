import { LandingNavbar } from "../../components/landing/LandingNavbar.jsx";
import { HeroSection } from "../../components/landing/HeroSection.jsx";
import { TemplateShowcaseSection } from "../../components/landing/TemplateShowcaseSection.jsx";
import { FeaturesSection } from "../../components/landing/FeaturesSection.jsx";
import { ContactSection } from "../../components/landing/ContactSection.jsx";
import { CtaBannerSection } from "../../components/landing/CtaBannerSection.jsx";
import { LandingFooter } from "../../components/landing/LandingFooter.jsx";

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ff] text-[#1a1b22] font-sans antialiased selection:bg-[#af101a] selection:text-white">
      {/* Top Navbar */}
      <LandingNavbar />

      {/* Main Sections */}
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <TemplateShowcaseSection />
        <FeaturesSection />
        <ContactSection />
        <CtaBannerSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

