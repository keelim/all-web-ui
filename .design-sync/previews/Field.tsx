import { Field, FieldDescription, FieldError, FieldLabel, Input, Textarea } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-5)', maxWidth: 340 };

export const WithDescription = () => (
  <div style={stack}>
    <Field>
      <FieldLabel>Display name</FieldLabel>
      <Input placeholder="Portfolio A" />
      <FieldDescription>Shown on shared reports.</FieldDescription>
    </Field>
  </div>
);

export const Invalid = () => (
  <div style={stack}>
    <Field invalid>
      <FieldLabel>Target weight (%)</FieldLabel>
      <Input defaultValue="140" />
      <FieldError>Target weight must be between 0 and 100.</FieldError>
    </Field>
  </div>
);

export const Form = () => (
  <div style={stack}>
    <Field>
      <FieldLabel>Symbol</FieldLabel>
      <Input placeholder="VTI" />
    </Field>
    <Field>
      <FieldLabel>Note</FieldLabel>
      <Textarea rows={3} placeholder="Optional context for this trade" />
      <FieldDescription>Visible to your advisor.</FieldDescription>
    </Field>
  </div>
);
