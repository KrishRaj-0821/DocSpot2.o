import { useEffect } from 'react';

export const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title 
      ? `${title} | Purnia Care` 
      : 'Purnia Care | Modern Hospital Management & Patient Portal';
    if (document.title !== formattedTitle) {
      document.title = formattedTitle;
    }

    // 2. Update/Create Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    const targetDesc = description || 'Purnia Care connects you with the finest local doctors, advanced diagnostics, same-day pharmacy, and 24/7 emergency response in Seemanchal.';
    metaDescription.setAttribute('content', targetDesc);

    // 3. Update/Create Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    const targetKeywords = keywords || 'healthcare, doctors, booking, ambulance, pharmacy, diagnostics, Purnia Care';
    metaKeywords.setAttribute('content', targetKeywords);

  }, [title, description, keywords]);

  return null;
};

export default SEO;
