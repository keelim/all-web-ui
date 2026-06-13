import { isKuiThemeId, type KuiThemeId } from './theme-contract';

export const telemetryEventVersion = 1 as const;

export type TelemetryEventType =
  | 'tool.entry'
  | 'tool.complete'
  | 'onboarding.tour.started'
  | 'onboarding.step.viewed'
  | 'onboarding.tour.dismissed';

export type TelemetryTheme = KuiThemeId;

export type TelemetryPayloadMap = {
  'tool.entry': {
    toolId: string;
    source: string;
  };
  'tool.complete': {
    toolId: string;
    outcome?: string;
  };
  'onboarding.tour.started': {
    tourId: string;
    surface?: string;
  };
  'onboarding.step.viewed': {
    tourId: string;
    stepId: string;
    stepIndex: number;
  };
  'onboarding.tour.dismissed': {
    tourId: string;
    reason?: 'completed' | 'skipped' | 'closed';
  };
};

export type TelemetryPayloadFor<TType extends string> = TType extends TelemetryEventType
  ? TelemetryPayloadMap[TType]
  : Record<string, unknown>;

export type TelemetryContext = {
  app?: string;
  surface?: string;
  sessionId?: string;
  theme?: TelemetryTheme;
};

export type TelemetryEvent<TType extends string = TelemetryEventType> = {
  type: TType;
  version: typeof telemetryEventVersion;
  payload: TelemetryPayloadFor<TType>;
  context?: TelemetryContext;
  occurredAt?: string;
};

export type TelemetryEventInput<TType extends string = TelemetryEventType> = Omit<
  TelemetryEvent<TType>,
  'version'
> & {
  version?: typeof telemetryEventVersion;
};

export type TelemetryValidationResult<TType extends string = TelemetryEventType> =
  | { ok: true; event: TelemetryEvent<TType> }
  | { ok: false; errors: string[] };

export type TelemetryEmitFailureReason =
  | 'opt-out'
  | 'sink-disabled'
  | 'invalid-event'
  | 'sink-error';

export type TelemetryEmitResult =
  | { emitted: true }
  | { emitted: false; reason: TelemetryEmitFailureReason; errors?: string[]; error?: unknown };

export type MaybePromise<T> = T | Promise<T>;

export type TelemetrySink<TType extends string = string> = {
  enabled?: boolean;
  emit: (event: TelemetryEvent<TType>) => void | Promise<void>;
};

export type PayloadPrimitiveType = 'string' | 'number' | 'boolean';

export type PayloadSchema = {
  required: Record<string, PayloadPrimitiveType>;
  optional?: Record<string, PayloadPrimitiveType>;
};

export type TelemetryEventSchemaMap<TType extends string = string> = Readonly<Record<TType, PayloadSchema>>;

export type TelemetryValidationOptions<TType extends string = TelemetryEventType> = {
  schemas?: TelemetryEventSchemaMap<TType>;
};

export type TelemetryEmitterOptions<TType extends string = TelemetryEventType> =
  TelemetryValidationOptions<TType> & {
    optIn?: boolean | (() => boolean);
    isEnabled?: () => boolean;
    sink?: TelemetrySink<TType>;
  };

export const telemetryEventSchemas = {
  'tool.entry': {
    required: { toolId: 'string', source: 'string' }
  },
  'tool.complete': {
    required: { toolId: 'string' },
    optional: { outcome: 'string' }
  },
  'onboarding.tour.started': {
    required: { tourId: 'string' },
    optional: { surface: 'string' }
  },
  'onboarding.step.viewed': {
    required: { tourId: 'string', stepId: 'string', stepIndex: 'number' }
  },
  'onboarding.tour.dismissed': {
    required: { tourId: 'string' },
    optional: { reason: 'string' }
  }
} as const satisfies TelemetryEventSchemaMap<TelemetryEventType>;

export const noopTelemetrySink: TelemetrySink = Object.freeze({
  enabled: false,
  emit: () => undefined
});

export function createTelemetrySchema<const TExtensionType extends string>(
  extensionSchemas: TelemetryEventSchemaMap<TExtensionType>
): TelemetryEventSchemaMap<TelemetryEventType | TExtensionType> {
  return Object.freeze({
    ...telemetryEventSchemas,
    ...extensionSchemas
  }) as TelemetryEventSchemaMap<TelemetryEventType | TExtensionType>;
}

export function defineTelemetryEvent<TType extends string = TelemetryEventType>(
  event: TelemetryEventInput<TType>,
  options: TelemetryValidationOptions<TType> = {}
): TelemetryEvent<TType> {
  const validated = validateTelemetryEvent(event, options);
  if (!validated.ok) {
    throw new Error(`Invalid telemetry event: ${validated.errors.join('; ')}`);
  }
  return validated.event;
}

export function validateTelemetryEvent<TType extends string = TelemetryEventType>(
  input: unknown,
  options: TelemetryValidationOptions<TType> = {}
): TelemetryValidationResult<TType> {
  const errors: string[] = [];
  const schemas = getTelemetrySchemas(options.schemas);
  if (!isRecord(input)) return { ok: false, errors: ['event must be an object'] };

  const type = input.type;
  const typeIsSupported = isTelemetryEventType(type, schemas);
  if (!typeIsSupported) errors.push('type is not supported');

  const version = input.version ?? telemetryEventVersion;
  if (version !== telemetryEventVersion) errors.push('version must be 1');

  const payload = input.payload;
  let sanitizedPayload: Record<string, unknown> | undefined;
  if (!isRecord(payload)) {
    errors.push('payload must be an object');
  } else if (typeIsSupported) {
    sanitizedPayload = validatePayload(type, payload, schemas, errors);
  }

  const context = input.context;
  const sanitizedContext = context !== undefined ? validateContext(context, errors) : undefined;

  const occurredAt = input.occurredAt;
  if (occurredAt !== undefined && typeof occurredAt !== 'string') {
    errors.push('occurredAt must be a string');
  }

  if (errors.length > 0 || !typeIsSupported || sanitizedPayload === undefined) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    event: {
      type: type as TType,
      version: telemetryEventVersion,
      payload: sanitizedPayload as TelemetryPayloadFor<TType>,
      ...(sanitizedContext !== undefined ? { context: sanitizedContext } : {}),
      ...(typeof occurredAt === 'string' ? { occurredAt } : {})
    }
  };
}

export function serializeTelemetryEvent(event: TelemetryEventInput): string {
  return JSON.stringify(defineTelemetryEvent(event));
}

export function createTelemetryEmitter<TType extends string = TelemetryEventType>({
  optIn = false,
  isEnabled,
  sink = noopTelemetrySink as TelemetrySink<TType>,
  schemas
}: TelemetryEmitterOptions<TType> = {}) {
  return {
    emit(event: TelemetryEventInput<TType>): MaybePromise<TelemetryEmitResult> {
      if (!resolveTelemetryConsent(optIn, isEnabled)) return { emitted: false, reason: 'opt-out' };
      if (sink.enabled === false) return { emitted: false, reason: 'sink-disabled' };

      const validated = validateTelemetryEvent(event, { schemas });
      if (!validated.ok) {
        return { emitted: false, reason: 'invalid-event', errors: validated.errors };
      }

      try {
        const emitted = sink.emit(validated.event);
        if (isPromiseLike(emitted)) {
          return emitted
            .then(() => ({ emitted: true }) as const)
            .catch((error: unknown) => ({ emitted: false, reason: 'sink-error', error }) as const);
        }
        return { emitted: true };
      } catch (error) {
        return { emitted: false, reason: 'sink-error', error };
      }
    }
  };
}

function getTelemetrySchemas<TType extends string>(
  schemas?: TelemetryEventSchemaMap<TType>
): TelemetryEventSchemaMap<string> {
  return (schemas ?? telemetryEventSchemas) as TelemetryEventSchemaMap<string>;
}

function resolveTelemetryConsent(optIn: boolean | (() => boolean), isEnabled?: () => boolean) {
  if (isEnabled) return isEnabled();
  return typeof optIn === 'function' ? optIn() : optIn;
}

function validatePayload(
  type: string,
  payload: Record<string, unknown>,
  schemas: TelemetryEventSchemaMap<string>,
  errors: string[]
) {
  const schema = schemas[type];
  const sanitized: Record<string, unknown> = {};
  const allowedKeys = new Set([
    ...Object.keys(schema.required),
    ...Object.keys(schema.optional ?? {})
  ]);

  for (const key of Object.keys(payload)) {
    if (!allowedKeys.has(key)) errors.push(`${type}.payload.${key} is not supported`);
  }

  for (const [key, expectedType] of Object.entries(schema.required)) {
    if (typeof payload[key] !== expectedType) {
      errors.push(`${type}.payload.${key} must be ${expectedType}`);
    } else {
      sanitized[key] = payload[key];
    }
  }

  for (const [key, expectedType] of Object.entries(schema.optional ?? {})) {
    if (payload[key] !== undefined && typeof payload[key] !== expectedType) {
      errors.push(`${type}.payload.${key} must be ${expectedType}`);
    } else if (payload[key] !== undefined) {
      sanitized[key] = payload[key];
    }
  }

  if (type === 'onboarding.tour.dismissed') {
    const reason = payload.reason;
    if (reason !== undefined && !['completed', 'skipped', 'closed'].includes(String(reason))) {
      errors.push('onboarding.tour.dismissed.payload.reason is not supported');
    }
  }

  return sanitized;
}

function validateContext(context: unknown, errors: string[]) {
  if (!isRecord(context)) {
    errors.push('context must be an object');
    return undefined;
  }

  const sanitized: TelemetryContext = {};
  const allowedKeys = new Set(['app', 'surface', 'sessionId', 'theme']);

  for (const key of Object.keys(context)) {
    if (!allowedKeys.has(key)) errors.push(`context.${key} is not supported`);
  }

  for (const key of ['app', 'surface', 'sessionId'] as const) {
    if (context[key] !== undefined && typeof context[key] !== 'string') {
      errors.push(`context.${key} must be a string`);
    } else if (typeof context[key] === 'string') {
      sanitized[key] = context[key];
    }
  }

  if (context.theme !== undefined && !isKuiThemeId(context.theme)) {
    errors.push('context.theme is not supported');
  } else if (isKuiThemeId(context.theme)) {
    sanitized.theme = context.theme;
  }

  return sanitized;
}

function isTelemetryEventType(
  value: unknown,
  schemas: TelemetryEventSchemaMap<string>
): value is string {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(schemas, value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return isRecord(value) && typeof value.then === 'function';
}
