"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryToolbarProps {
  search: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function CategoryToolbar({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: CategoryToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search categories..."
          className="pl-9"
        />
      </div>

      {/* Sort */}
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[190px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="name-asc">Name: A → Z</SelectItem>

          <SelectItem value="name-desc">Name: Z → A</SelectItem>

          <SelectItem value="newest">Newest first</SelectItem>

          <SelectItem value="oldest">Oldest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
