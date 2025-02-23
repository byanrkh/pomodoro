import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-md">{children}</div>
    </main>
  );
}
