"use client";

import { useEffect, useState } from "react";
import App from "../src/App";

export const dynamic = 'force-static';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <App />;
}
