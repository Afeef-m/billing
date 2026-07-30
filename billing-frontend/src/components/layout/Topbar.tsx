"use client";

import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  const title =
    pathname === "/"
      ? "Dashboard"
      : pathname.replace("/", "").replace("-", " ");

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-xl font-semibold capitalize">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted" />
      </div>
    </header>
  );
}