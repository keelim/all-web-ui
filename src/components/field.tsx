"use client";

import * as React from "react";

import { cn } from "../lib/cn";

type FieldContextValue = {
  controlId: string;
  descriptionIds: string[];
  errorIds: string[];
  invalid: boolean;
  registerDescription: (id: string) => () => void;
  registerError: (id: string) => () => void;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

export type FieldProps = React.ComponentPropsWithoutRef<"div"> & {
  controlId?: string;
  invalid?: boolean;
};

export type FieldLabelProps = React.ComponentPropsWithoutRef<"label">;
export type FieldDescriptionProps = React.ComponentPropsWithoutRef<"p">;
export type FieldErrorProps = React.ComponentPropsWithoutRef<"p">;

export type FieldControlProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "aria-describedby" | "aria-errormessage" | "aria-invalid"
>;

function useFieldContext(componentName: string) {
  const context = React.useContext(FieldContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Field`);
  }

  return context;
}

function mergeIdRefs(...values: Array<string | undefined>): string | undefined {
  const ids = values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []);
  return ids.length ? [...new Set(ids)].join(" ") : undefined;
}

function useRegisteredIds() {
  const [ids, setIds] = React.useState<string[]>([]);
  const register = React.useCallback((id: string) => {
    setIds((current) => (current.includes(id) ? current : [...current, id]));
    return () => setIds((current) => current.filter((currentId) => currentId !== id));
  }, []);

  return [ids, register] as const;
}

export function useFieldControlProps({
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
  "aria-invalid": ariaInvalid
}: FieldControlProps): FieldControlProps {
  const context = React.useContext(FieldContext);

  if (!context) {
    return { id, "aria-describedby": ariaDescribedBy, "aria-errormessage": ariaErrorMessage, "aria-invalid": ariaInvalid };
  }

  return {
    id: id ?? context.controlId,
    "aria-describedby": mergeIdRefs(
      ariaDescribedBy,
      ...context.descriptionIds,
      ...(context.invalid ? context.errorIds : [])
    ),
    "aria-errormessage": ariaErrorMessage ?? (
      context.invalid ? mergeIdRefs(...context.errorIds) : undefined
    ),
    "aria-invalid": ariaInvalid ?? (context.invalid || undefined)
  };
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field({ className, controlId, invalid = false, ...props }, ref) {
    const generatedId = React.useId();
    const [descriptionIds, registerDescription] = useRegisteredIds();
    const [errorIds, registerError] = useRegisteredIds();
    const value = React.useMemo(
      () => ({
        controlId: controlId ?? `${generatedId}-control`,
        descriptionIds,
        errorIds,
        invalid,
        registerDescription,
        registerError
      }),
      [controlId, descriptionIds, errorIds, generatedId, invalid, registerDescription, registerError]
    );

    return (
      <FieldContext.Provider value={value}>
        <div ref={ref} className={cn("kui-field", className)} data-invalid={invalid || undefined} {...props} />
      </FieldContext.Provider>
    );
  }
);

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel({ className, htmlFor, ...props }, ref) {
    const { controlId } = useFieldContext("FieldLabel");

    return <label ref={ref} className={cn("kui-field__label", className)} htmlFor={htmlFor ?? controlId} {...props} />;
  }
);

export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, id, ...props }, ref) {
    const { registerDescription } = useFieldContext("FieldDescription");
    const generatedId = React.useId();
    const resolvedId = id ?? `${generatedId}-description`;
    React.useEffect(() => registerDescription(resolvedId), [registerDescription, resolvedId]);

    return <p ref={ref} className={cn("kui-field__description", className)} id={resolvedId} {...props} />;
  }
);

export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  function FieldError({ className, id, role = "alert", ...props }, ref) {
    const { registerError } = useFieldContext("FieldError");
    const generatedId = React.useId();
    const resolvedId = id ?? `${generatedId}-error`;
    React.useEffect(() => registerError(resolvedId), [registerError, resolvedId]);

    return <p ref={ref} className={cn("kui-field__error", className)} id={resolvedId} role={role} {...props} />;
  }
);
