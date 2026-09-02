import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AmenitiesSection from "@/components/sections/AmenitiesSection";
import BookingSection from "@/components/sections/BookingSection";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "@/components/sections/HeroSection";
import LocationSection from "@/components/sections/LocationSection";
import MomentsSection from "@/components/sections/MomentsSection";
import OverviewSection from "@/components/sections/OverviewSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import RoomsSection from "@/components/sections/RoomsSection";
import StorySection from "@/components/sections/StorySection";

/**
 * Bands alternate light → dark → light so the page reads as chapters rather
 * than one long scroll. The order below is also the visual rhythm; moving a
 * section means checking the band colour either side of it.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />        {/* photo  */}
        <OverviewSection />    {/* cream  */}
        <StorySection />       {/* dark   */}
        <RoomsSection />       {/* warm   */}
        <GallerySection />     {/* dark   */}
        <MomentsSection />     {/* sand   */}
        <AmenitiesSection />   {/* dark   */}
        <ReviewsSection />     {/* cream  */}
        <LocationSection />    {/* warm   */}
        <BookingSection />     {/* sand   */}
      </main>
      <Footer />
    </>
  );
}
