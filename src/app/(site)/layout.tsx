import ComingSoon from "@/components/layout/ComingSoon";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PageLoader from "@/components/ui/PageLoader";
import { getSiteContent } from "@/lib/cms/content";
import { isComingSoon } from "@/lib/cms/derive";
import { buildStructuredData } from "@/lib/structured-data";

/**
 * Everything the public site wears. The CRM sits outside this group, so it
 * never inherits the villa's header, footer or page loader.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const content = await getSiteContent();

  /* The holding page replaces the site rather than sitting in front of it, so
     none of the villa's chrome renders and none of the real copy is in the
     markup for anyone to read. It is deliberately decided from content alone —
     reading the admin cookie here would make all four pages dynamic for every
     visitor, for a preview only one person ever needs. */
  if (isComingSoon(content)) return <ComingSoon content={content} />;

  return (
    <>
      {/* The loader renders visible, so with scripts off there would be
          nothing left to take it away again. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>.page-loader{display:none!important}</style>",
        }}
      />
      <PageLoader
        name={content.site.name}
        tagline={content.site.tagline}
        logo={content.site.branding.logoLight}
      />

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
