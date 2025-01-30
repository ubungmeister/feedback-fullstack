"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer
          position="bottom-right"
          hideProgressBar={true}
          closeOnClick={true}
          autoClose={3000}
          closeButton={false}
          draggable={true}
          toastClassName={() =>
            `mb-2 relative flex  justify-between flex-row p-1 rounded-md overflow-hidden cursor-pointer min-h-10`
          }
          className={() => `flex flex-row p-4 justify-center rounded-md`}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
