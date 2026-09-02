import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section aria-labelledby="not-found-title">
          <Container>
            <h1 id="not-found-title">Page not found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">Return home</Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
