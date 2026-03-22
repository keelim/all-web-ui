import * as React from 'react';

import { cn } from '../lib/cn';

export type LoadingStatusProps = {
  label: string;
  className?: string;
  spinnerClassName?: string;
  caption?: string;
  steps?: readonly string[];
  activeStep?: number;
  variant?: 'inline' | 'panel';
  tone?: 'default' | 'accent' | 'muted';
};

export function LoadingStatus({
  label,
  className,
  spinnerClassName,
  caption,
  steps,
  activeStep = 0,
  variant = 'inline',
  tone = 'default'
}: LoadingStatusProps) {
  if (variant === 'panel') {
    return (
      <div role="status" aria-live="polite" data-loading-variant="panel" className={cn('kui-loading-panel', `kui-loading-panel--${tone}`, className)}>
        <div className="kui-loading-panel__header">
          <span aria-hidden="true" className={cn('kui-spinner', spinnerClassName)} />
          <div className="kui-loading-panel__copy">
            <p className="kui-loading-panel__label">{label}</p>
            {caption ? <p className="kui-loading-panel__caption">{caption}</p> : null}
          </div>
          <div className="kui-loading-panel__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        {steps?.length ? (
          <ol className="kui-loading-panel__steps">
            {steps.map((step, index) => {
              const isDone = index <= activeStep;
              return (
                <li key={step} className={cn('kui-loading-panel__step', isDone && 'is-active')}>
                  {step}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" data-loading-variant="inline" className={cn('kui-loading-inline', className)}>
      <span aria-hidden="true" className={cn('kui-spinner', spinnerClassName)} />
      <span>{label}</span>
    </div>
  );
}
