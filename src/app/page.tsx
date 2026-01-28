"use client";

import { useEffect, useState } from "react";
import App from "../App";

export const dynamic = 'force-static';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <App />;
}
