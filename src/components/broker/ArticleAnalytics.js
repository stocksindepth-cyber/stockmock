"use client";

import { useEffect } from "react";
import { trackBrokerArticleView } from "@/lib/analytics";

export default function ArticleAnalytics({ slug }) {
  useEffect(() => {
    trackBrokerArticleView(slug);
  }, [slug]);

  return null;
}
