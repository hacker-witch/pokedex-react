import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import {
  PersistedClient,
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { get, set, del } from "idb-keyval";
import App from "./App";
import "./index.scss";

const REACT_QUERY_IDB_KEY = "reactQuery";
const persister = {
  persistClient: async (client: PersistedClient) => {
    set(REACT_QUERY_IDB_KEY, client);
  },
  restoreClient: async () => {
    return await get<PersistedClient>(REACT_QUERY_IDB_KEY);
  },
  removeClient: async () => {
    await del(REACT_QUERY_IDB_KEY);
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

let buster = "1";
if (import.meta.env.DEV) {
  buster = Math.random().toString();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, buster }}
    >
      <App />
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
