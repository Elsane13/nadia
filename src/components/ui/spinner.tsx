import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-primary h-8 w-8",
        className
      )}
      {...props}
    >
      <span className="sr-only">Chargement...</span>
    </div>
  );
}
