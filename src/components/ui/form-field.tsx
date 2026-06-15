import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
}

export const FormField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldProps
>(({ label, hint, error, className, ...rest }, ref) => (
  <label className={cn("block space-y-1.5", className)}>
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    <input
      ref={ref}
      className={cn(
        "w-full control-radius border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground",
        "placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring transition-colors",
        error && "border-destructive/60",
      )}
      {...rest}
    />
    {error ? (
      <span className="text-xs text-destructive">{error}</span>
    ) : hint ? (
      <span className="text-xs text-muted-foreground/80">{hint}</span>
    ) : null}
  </label>
));
FormField.displayName = "FormField";

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ label, hint, error, className, ...rest }, ref) => (
  <label className={cn("block space-y-1.5", className)}>
    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    <textarea
      ref={ref}
      className={cn(
        "w-full control-radius border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground min-h-[88px]",
        "placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring transition-colors",
        error && "border-destructive/60",
      )}
      {...rest}
    />
    {error ? (
      <span className="text-xs text-destructive">{error}</span>
    ) : hint ? (
      <span className="text-xs text-muted-foreground/80">{hint}</span>
    ) : null}
  </label>
));
TextAreaField.displayName = "TextAreaField";
