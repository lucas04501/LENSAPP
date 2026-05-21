'use client';

import { useState, useEffect } from "react";
import { getQuoteOfTheDay, Quote } from "@/lib/quotes";

export function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(getQuoteOfTheDay());
  }, []);

  if (!quote) return null;

  return (
    <div className="py-1">
      <p className="text-[13px] font-normal text-[#4B5563] truncate">
        — &quot;{quote.text}&quot;
      </p>
    </div>
  );
}
