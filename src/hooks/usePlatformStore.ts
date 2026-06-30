import { useEffect, useState } from "react";
import { readStore, subscribeStore } from "@/lib/platformStore";

export function usePlatformStore() {
  const [store, setStore] = useState(() => readStore());

  useEffect(() => subscribeStore(() => setStore(readStore())), []);

  return store;
}