import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PageLoader from "@/components/ui/PageLoader";
import { getSiteContent } from "@/lib/cms/content";
import { buildStructuredData } from "@/lib/structured-data";

/**
 * Everything the public site wears. The CRM sits outside this group, so it
 * never inherits the villa's header, footer or page loader.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const content = await getSiteContent();

  return (
    <>
      {/* The loader renders visible, so with scripts off there would be
          nothing left to take it away again. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>.page-loader{display:none!important}</style>",
        }}
      />
      <PageLoader />

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header content={content} />
      {children}
      <Footer content={content} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(content)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
