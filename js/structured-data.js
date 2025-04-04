// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Build To Wear",
  "url": "https://buildtowear.com",
  "logo": "https://buildtowear.com/assets/logo/logo.png",
  "description": "Empowering sustainable fashion through innovative technology and community-driven initiatives.",
  "sameAs": [
    "https://instagram.com/buildtowear",
    "https://linkedin.com/company/buildtowear"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
};

// Website Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Build To Wear",
  "url": "https://buildtowear.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://buildtowear.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Add schemas to page
function addStructuredData() {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify([organizationSchema, websiteSchema]);
  document.head.appendChild(script);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', addStructuredData); 