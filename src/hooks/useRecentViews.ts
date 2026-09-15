import { useEffect, useState } from "react";

export const useRecentViews = () => {
  const [recentIds, setRecentIds] = useState<number[]>([]);

  useEffect(() => {
    // 1. Load existing history array from local browser storage on mount
    const saved = localStorage.getItem("recent_views");
    if (saved) setRecentIds(JSON.parse(saved));
  }, []);

  const addView = (id: number) => {
    setRecentIds((prev) => {
      // Filter out duplicates to pull the item to the front of the line
      const filtered = prev.filter((itemId) => itemId !== id);
      const updated = [id, ...filtered].slice(0, 10); 
      
      localStorage.setItem("recent_views", JSON.stringify(updated));
      return updated;
    });
  };

  return { recentIds, addView };
};
