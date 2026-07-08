import * as React from 'react';
import { Text as AstryxText } from '@astryxdesign/core/Text';

import { cn } from '../lib/cn';

const AstryxTextRuntime = AstryxText as unknown as React.ElementType;

export type OnboardingStepState = 'pending' | 'active' | 'complete';

export type OnboardingStep = {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
  state?: OnboardingStepState;
};

export type OnboardingStepListProps = React.HTMLAttributes<HTMLOListElement> & {
  steps: OnboardingStep[];
  activeStepId?: string;
  completedStepIds?: string[];
  orientation?: 'vertical' | 'horizontal';
};

export function OnboardingStepList({
  className,
  steps,
  activeStepId,
  completedStepIds = [],
  orientation = 'vertical',
  ...props
}: OnboardingStepListProps) {
  return (
    <ol className={cn('kui-onboarding-steps', `kui-onboarding-steps--${orientation}`, className)} {...props}>
      {steps.map((step, index) => {
        const state = resolveStepState(step, activeStepId, completedStepIds);
        return (
          <li
            key={step.id}
            className="kui-onboarding-step"
            data-step-state={state}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <AstryxTextRuntime as="span" className="kui-onboarding-step__indicator" aria-hidden="true">
              {state === 'complete' ? 'OK' : index + 1}
            </AstryxTextRuntime>
            <span className="kui-onboarding-step__body">
              <AstryxTextRuntime as="span" className="kui-onboarding-step__title">
                {step.title}
                {step.optional ? <span className="kui-onboarding-step__optional">Optional</span> : null}
                <span className="sr-only">{getStepStateLabel(state)}</span>
              </AstryxTextRuntime>
              {step.description ? (
                <AstryxTextRuntime as="span" className="kui-onboarding-step__description">
                  {step.description}
                </AstryxTextRuntime>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export type OnboardingHighlightProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  marker?: React.ReactNode;
  tone?: 'default' | 'accent' | 'success' | 'warning';
};

export function OnboardingHighlight({
  className,
  title,
  description,
  marker,
  tone = 'default',
  children,
  ...props
}: OnboardingHighlightProps) {
  return (
    <div className={cn('kui-onboarding-highlight', `kui-onboarding-highlight--${tone}`, className)} {...props}>
      {marker ? <span className="kui-onboarding-highlight__marker">{marker}</span> : null}
      <div className="kui-onboarding-highlight__content">
        {title ? (
          <AstryxTextRuntime as="p" className="kui-onboarding-highlight__title">
            {title}
          </AstryxTextRuntime>
        ) : null}
        {description ? (
          <AstryxTextRuntime as="p" className="kui-onboarding-highlight__description">
            {description}
          </AstryxTextRuntime>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export type OnboardingTourProps = React.HTMLAttributes<HTMLElement> & {
  title: string;
  description?: string;
  steps: OnboardingStep[];
  activeStepId?: string;
  completedStepIds?: string[];
  actions?: React.ReactNode;
  theme?: 'finance' | 'admin-bw';
};

export function OnboardingTour({
  className,
  title,
  description,
  steps,
  activeStepId,
  completedStepIds,
  actions,
  children,
  theme,
  ...props
}: OnboardingTourProps) {
  return (
    <section
      className={cn('kui-onboarding-tour', theme && `kui-onboarding-tour--${theme}`, className)}
      data-onboarding-theme={theme}
      {...props}
    >
      <div className="kui-onboarding-tour__header">
        <div>
          <AstryxTextRuntime as="p" className="kui-onboarding-tour__eyebrow">
            Onboarding
          </AstryxTextRuntime>
          <AstryxTextRuntime as="h2" className="kui-onboarding-tour__title">
            {title}
          </AstryxTextRuntime>
          {description ? (
            <AstryxTextRuntime as="p" className="kui-onboarding-tour__description">
              {description}
            </AstryxTextRuntime>
          ) : null}
        </div>
        {actions ? <div className="kui-onboarding-tour__actions">{actions}</div> : null}
      </div>
      <OnboardingStepList steps={steps} activeStepId={activeStepId} completedStepIds={completedStepIds} />
      {children ? <div className="kui-onboarding-tour__content">{children}</div> : null}
    </section>
  );
}

function resolveStepState(
  step: OnboardingStep,
  activeStepId: string | undefined,
  completedStepIds: string[]
): OnboardingStepState {
  if (step.state) return step.state;
  if (completedStepIds.includes(step.id)) return 'complete';
  if (activeStepId === step.id) return 'active';
  return 'pending';
}

function getStepStateLabel(state: OnboardingStepState) {
  if (state === 'active') return 'Current step';
  if (state === 'complete') return 'Completed step';
  return 'Pending step';
}
