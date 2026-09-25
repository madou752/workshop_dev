import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

/** Props to spread on the input so assistive tech links it to its message. */
export interface FieldA11y {
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  /** Helper text shown when there is no error. */
  hint?: ReactNode;
  children: (a11y: FieldA11y) => ReactNode;
}

/** Label, input and a styled message under it (error or hint). */
export default function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const messageId = error || hint ? `${id}-message` : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children({ "aria-invalid": Boolean(error), "aria-describedby": messageId })}
      {error ? (
        <p id={messageId} className="animate-in fade-in text-sm text-alerte duration-200">
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="text-sm text-gris">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
