"use client";

import SearchInput from "@/components/common/SearchInput";

type ProductToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function ProductToolbar({
  search,
  onSearchChange,
}: ProductToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <SearchInput
        placeholder="Search products..."
        value={search}
        onChange={onSearchChange}
      />
    </div>
  );
}