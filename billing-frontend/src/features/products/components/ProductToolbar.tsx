"use client";

import SearchInput from "@/components/common/SearchInput";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
};

export default function ProductToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
}: ProductToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <SearchInput
        placeholder="Search products..."
        value={search}
        onChange={onSearchChange}
      />

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="name-asc">
            Name: A → Z
          </SelectItem>

          <SelectItem value="name-desc">
            Name: Z → A
          </SelectItem>

          <SelectItem value="newest">
            Newest first
          </SelectItem>

          <SelectItem value="oldest">
            Oldest first
          </SelectItem>

          <SelectItem value="price-asc">
            Price: Low → High
          </SelectItem>

          <SelectItem value="price-desc">
            Price: High → Low
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}