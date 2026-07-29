import { useEffect } from 'react';

export const SEO = ({ title, description, keywords, canonicalUrl, ogImage, ogType = 'website', schemaData }) => {
  useEffect(() => {
    // 1. Title
    const formattedTitle = title 
      ? `${title} | DocSpot Healthcare` 
      : 'DocSpot | Find Doctors, Book Appointments & Healthcare Services';
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (selector, nameAttr, nameVal, contentVal) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Description & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', description || 'DocSpot connects you with top doctors, diagnostics, pharmacy, and 24/7 emergency care near you.');
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords || 'healthcare, doctors, OPD booking, ambulance, pharmacy, diagnostics, DocSpot');

    // OpenGraph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description || 'Find and book top doctors near you on DocSpot.');
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage || 'https://docspot.vercel.app/og-default.jpg');
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    if (canonicalUrl) {
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    }

    // Twitter
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description || 'Find and book top doctors near you on DocSpot.');

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }

    // Schema.org JSON-LD Structured Data
    let schemaScript = document.querySelector('script[id="docspot-schema-jsonld"]');
    if (schemaData) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'docspot-schema-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaData);
    } else if (schemaScript) {
      schemaScript.remove();
    }

  }, [title, description, keywords, canonicalUrl, ogImage, ogType, schemaData]);

  return null;
};

export default SEO;

