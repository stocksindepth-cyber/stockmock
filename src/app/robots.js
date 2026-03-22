export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/"],
      },
    ],
    sitemap: "https://optionsgyani.com/sitemap.xml",
  };
}
