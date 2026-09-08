import AmenitiesSection from "@/components/sections/AmenitiesSection";
import GallerySection from "@/components/sections/GallerySection";
import HeroSection from "@/components/sections/HeroSection";
import MomentsSection from "@/components/sections/MomentsSection";
import OverviewSection from "@/components/sections/OverviewSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import RoomsSection from "@/components/sections/RoomsSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import StorySection from "@/components/sections/StorySection";
import { getSiteContent } from "@/lib/cms/content";
import { isComingSoon } from "@/lib/cms/derive";

/**
 * Bands alternate light → dark → light so the page reads as chapters rather
 * than one long scroll. The order below is also the visual rhythm; moving a
 * section means checking the band colour either side of it.
 *
 * Every band's copy, photography and lists come from the CRM, so this file
 * only decides what appears and in what order.
 */
export default async function HomePage() {
  const content = await getSiteContent();

  /* The layout draws the holding page; this segment must render nothing,
     or its copy still reaches the browser in the RSC payload. */
  if (isComingSoon(content)) return null;

  return (
    <main id="main-content">
      <HeroSection content={content} />        {/* photo  */}
      <OverviewSection content={content} />    {/* cream  */}
      <StorySection content={content} />       {/* dark   */}
      <RoomsSection content={content} />       {/* warm   */}
      <GallerySection content={content} />     {/* dark   */}
      <ShowcaseSection content={content} />    {/* cream  */}
      <MomentsSection content={content} />     {/* sand   */}
      <AmenitiesSection content={content} />   {/* dark   */}
      <ReviewsSection content={content} />     {/* cream  */}
    </main>
  );
}
