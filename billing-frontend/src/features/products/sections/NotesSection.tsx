"use client";

import { UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";


type NotesSectionProps = {
  form: UseFormReturn<ProductFormValues>;
};

export default function NotesSection({
  form,
}: NotesSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          Notes
        </h3>

        <Separator className="mt-2" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes
        </Label>

        <Textarea
          id="notes"
          rows={4}
          placeholder="Product notes..."
          {...form.register("notes")}
        />

        {form.formState.errors.notes && (
          <p className="text-sm text-destructive">
            {form.formState.errors.notes.message}
          </p>
        )}
      </div>
    </section>
  );
}