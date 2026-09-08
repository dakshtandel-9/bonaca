import type { Metadata } from "next";
import Link from "next/link";

import ComingSoon from "@/components/layout/ComingSoon";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSiteContent } from "@/lib/cms/content";
import { isComingSoon } from "@/lib/cms/derive";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const content = await getSiteContent();

  /**
   * While the holding page is up, an unknown URL shows it too.
   *
   * Not only for consistency: Next embeds this boundary in the payload of
   * every route, and `Header` is a client component taking the whole of
   * `SiteContent` as a prop — which serialises the entire unreleased site into
   * the one page whose job is to hide it. `ComingSoon` renders on the server,
   * so nothing but the holding page reaches the browser.
   */
  if (isComingSoon(content)) return <ComingSoon content={content} />;

  return (
    <>
      <Header content={content} />
      <main id="main-content">
        <section aria-labelledby="not-found-title">
          <Container>
            <h1 id="not-found-title">Page not found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">Return home</Link>
          </Container>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
