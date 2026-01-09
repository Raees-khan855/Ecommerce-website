import { useEffect } from "react";

const useSEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    // Helper function
    const setMeta = (name, content, property = false) => {
      if (!content) return;

      let tag = document.querySelector(
        property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      );

      if (!tag) {
        tag = document.createElement("meta");
        property
          ? tag.setAttribute("property", name)
          : tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // Basic SEO
    setMeta("description", description);
    setMeta("keywords", keywords);

    // Open Graph (WhatsApp / Facebook)
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", image, true);
    setMeta("og:url", url, true);
    setMeta("og:type", "website", true);

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
  }, [title, description, keywords, image, url]);
};

export default useSEO;
