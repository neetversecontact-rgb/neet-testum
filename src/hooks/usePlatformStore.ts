import { useEffect, useState } from "react";
import { readStore, subscribeStore, Store } from "@/lib/platformStore";

export function usePlatformStore() {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAndSetStore = async () => {
      const fetchedStore = await readStore();
      if (isMounted) {
        setStore(fetchedStore);
      }
    };

    fetchAndSetStore();
    const unsubscribe = subscribeStore(fetchAndSetStore);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return store;
}
