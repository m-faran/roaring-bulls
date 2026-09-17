"use client";

import { useEffect } from "react";
import { useBasket } from "../lib/store/basket-context";
import Home from "../page";

export default function AppPage() {
  const { setActiveTab } = useBasket();

  useEffect(() => {
    setActiveTab("app");
  }, [setActiveTab]);

  return <Home />;
}
