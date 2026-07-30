import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  text?: string;
};

export default function LoadingSpinner({
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-10">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm text-muted-foreground">
        {text}
      </span>
    </div>
  );
}