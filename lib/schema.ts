import { SITE } from "./site";

/** JSON-LD for the home page: who XVN Media is and what it sells. */
export function homeSchema() {
  const sameAs = SITE.socials.map((s) => s.href).filter((h) => h.startsWith("http"));
  const org = {
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    ...(SITE.phone ? { telephone: SITE.phone } : {}),
    logo: `${SITE.url}/icon.svg`,
    image: `${SITE.url}/opengraph-image`,
    description: SITE.description,
    ...(sameAs.length ? { sameAs } : {}),
    knowsAbout: ["Website design", "Web development", "Google Ads", "Meta Ads", "TikTok Ads", "Search engine optimisation", "Local SEO"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: SITE.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.description, provider: { "@id": `${SITE.url}/#organization` } },
      })),
    },
  };
  const site = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en",
  };
  return { "@context": "https://schema.org", "@graph": [org, site] };
}
