import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { get, set, del } from "idb-keyval";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootRoute } from "./routes/RootRoute";
import "./index.scss";
import { PersistedClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const idbKey = "react-query";
const persister = {
  persistClient: async (client: PersistedClient) => {
    set(idbKey, client);
  },
  restoreClient: async () => {
    return await get<PersistedClient>(idbKey);
  },
  removeClient: async () => {
    await del(idbKey);
  },
};

const cacheBuster = Math.random().toString();

const router = createBrowserRouter([
  {
    path: "/pokedex-react",
    element: <RootRoute />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, buster: cacheBuster }}
    >
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
