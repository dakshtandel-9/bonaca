import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AmenitiesSection from "@/components/sections/AmenitiesSection";
import BookingSection from "@/components/sections/BookingSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "@/components/sections/HeroSection";
import LocationSection from "@/components/sections/LocationSection";
import PropertyOverviewSection from "@/components/sections/PropertyOverviewSection";
import StorySection from "@/components/sections/StorySection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PropertyOverviewSection />
        <StorySection />
        <GallerySection />
        <ExperienceSection />
        <AmenitiesSection />
        <LocationSection />
        <BookingSection />
      </main>
      <Footer />
    </>
  );
}
