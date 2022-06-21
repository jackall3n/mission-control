import { useEffect, useState } from "react";
import { Analytics, getAnalytics } from "firebase/analytics";
import app from "../firebase/app";

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnalytics(getAnalytics(app))
    }

  }, [])

  return analytics;
}
