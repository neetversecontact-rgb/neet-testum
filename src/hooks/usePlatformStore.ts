import { useSyncExternalStore } from "react";
import { readStore, subscribeStore, type Store } from "@/lib/platformStore";

const serverStore: Store = {
  menu: [],
  questions: [],
  broadcasts: [],
  audit: [],
  liveSessions: [],
};

export function usePlatformStore(): Store {
  return useSyncExternalStore(
    (cb) => subscribeStore(cb),
    () => readStore(),
    () => serverStore,
  );
}
