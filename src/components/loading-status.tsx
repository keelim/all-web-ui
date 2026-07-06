import * as React from 'react';
import { Spinner as AstryxSpinner } from '@astryxdesign/core/Spinner';

import { cn } from '../lib/cn';

export type LoadingStatusProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  spinnerClassName?: string;
  caption?: string;
  steps?: readonly string[];
  activeStep?: number;
  variant?: 'inline' | 'panel';
  tone?: 'default' | 'accent' | 'muted';
};

function clampActiveStep(activeStep: number, stepCount: number) {
  if (stepCount <= 0) {
    return -1;
  }

  if (!Number.isFinite(activeStep)) {
    return 0;
  }

  return Math.min(stepCount - 1, Math.max(0, Math.trunc(activeStep)));
}

export function LoadingStatus({
  label,
  className,
  spinnerClassName,
  caption,
  steps,
  activeStep = 0,
  variant = 'inline',
  tone = 'default',
  'aria-live': ariaLive = 'polite',
  ...props
}: LoadingStatusProps) {
  const normalizedActiveStep = clampActiveStep(activeStep, steps?.length ?? 0);

  if (variant === 'panel') {
    return (
      <div
        {...props}
        role="status"
        aria-live={ariaLive}
        data-loading-variant="panel"
        className={cn('kui-loading-panel', `kui-loading-panel--${tone}`, className)}
      >
        <div className="kui-loading-panel__header">
          <AstryxSpinner aria-hidden="true" className={cn('kui-spinner', spinnerClassName)} />
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
              const isDone = index <= normalizedActiveStep;
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
    <div
      {...props}
      role="status"
      aria-live={ariaLive}
      data-loading-variant="inline"
      className={cn('kui-loading-inline', className)}
    >
      <AstryxSpinner aria-hidden="true" className={cn('kui-spinner', spinnerClassName)} />
      <span>{label}</span>
    </div>
  );
}
