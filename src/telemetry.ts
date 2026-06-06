export const telemetryEventVersion = 1 as const;

export type TelemetryEventType =
  | 'tool.entry'
  | 'tool.complete'
  | 'onboarding.tour.started'
  | 'onboarding.step.viewed'
  | 'onboarding.tour.dismissed';

export type TelemetryTheme = 'finance' | 'admin-bw';

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

export type TelemetryContext = {
  app?: string;
  surface?: string;
  sessionId?: string;
  theme?: TelemetryTheme;
};

export type TelemetryEvent<TType extends TelemetryEventType = TelemetryEventType> = {
  type: TType;
  version: typeof telemetryEventVersion;
  payload: TelemetryPayloadMap[TType];
  context?: TelemetryContext;
  occurredAt?: string;
};

export type TelemetryEventInput<TType extends TelemetryEventType = TelemetryEventType> = Omit<
  TelemetryEvent<TType>,
  'version'
> & {
  version?: typeof telemetryEventVersion;
};

export type TelemetryValidationResult =
  | { ok: true; event: TelemetryEvent }
  | { ok: false; errors: string[] };

export type TelemetryEmitResult =
  | { emitted: true }
  | { emitted: false; reason: 'opt-out' | 'sink-disabled' };

export type TelemetrySink = {
  enabled?: boolean;
  emit: (event: TelemetryEvent) => void | Promise<void>;
};

type PayloadSchema = {
  required: Record<string, 'string' | 'number'>;
  optional?: Record<string, 'string'>;
};

export const telemetryEventSchemas: Record<TelemetryEventType, PayloadSchema> = {
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
};

export const noopTelemetrySink: TelemetrySink = Object.freeze({
  enabled: false,
  emit: () => undefined
});

export function defineTelemetryEvent<TType extends TelemetryEventType>(
  event: TelemetryEventInput<TType>
): TelemetryEvent<TType> {
  const validated = validateTelemetryEvent(event);
  if (!validated.ok) {
    throw new Error(`Invalid telemetry event: ${validated.errors.join('; ')}`);
  }
  return validated.event as TelemetryEvent<TType>;
}

export function validateTelemetryEvent(input: unknown): TelemetryValidationResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { ok: false, errors: ['event must be an object'] };

  const type = input.type;
  if (!isTelemetryEventType(type)) errors.push('type is not supported');

  const version = input.version ?? telemetryEventVersion;
  if (version !== telemetryEventVersion) errors.push('version must be 1');

  const payload = input.payload;
  if (!isRecord(payload)) {
    errors.push('payload must be an object');
  } else if (isTelemetryEventType(type)) {
    validatePayload(type, payload, errors);
  }

  const context = input.context;
  if (context !== undefined) validateContext(context, errors);

  const occurredAt = input.occurredAt;
  if (occurredAt !== undefined && typeof occurredAt !== 'string') {
    errors.push('occurredAt must be a string');
  }

  if (errors.length > 0 || !isTelemetryEventType(type) || !isRecord(payload)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    event: {
      type,
      version: telemetryEventVersion,
      payload: payload as TelemetryPayloadMap[typeof type],
      ...(context !== undefined ? { context: context as TelemetryContext } : {}),
      ...(typeof occurredAt === 'string' ? { occurredAt } : {})
    }
  };
}

export function serializeTelemetryEvent(event: TelemetryEventInput): string {
  return JSON.stringify(defineTelemetryEvent(event));
}

export function createTelemetryEmitter({
  optIn = false,
  sink = noopTelemetrySink
}: {
  optIn?: boolean;
  sink?: TelemetrySink;
} = {}) {
  return {
    emit(event: TelemetryEventInput): TelemetryEmitResult {
      if (!optIn) return { emitted: false, reason: 'opt-out' };
      if (sink.enabled === false) return { emitted: false, reason: 'sink-disabled' };
      sink.emit(defineTelemetryEvent(event));
      return { emitted: true };
    }
  };
}

function validatePayload(type: TelemetryEventType, payload: Record<string, unknown>, errors: string[]) {
  const schema = telemetryEventSchemas[type];
  for (const [key, expectedType] of Object.entries(schema.required)) {
    if (typeof payload[key] !== expectedType) errors.push(`${type}.payload.${key} must be ${expectedType}`);
  }
  for (const [key, expectedType] of Object.entries(schema.optional ?? {})) {
    if (payload[key] !== undefined && typeof payload[key] !== expectedType) {
      errors.push(`${type}.payload.${key} must be ${expectedType}`);
    }
  }

  if (type === 'onboarding.tour.dismissed') {
    const reason = payload.reason;
    if (reason !== undefined && !['completed', 'skipped', 'closed'].includes(String(reason))) {
      errors.push('onboarding.tour.dismissed.payload.reason is not supported');
    }
  }
}

function validateContext(context: unknown, errors: string[]) {
  if (!isRecord(context)) {
    errors.push('context must be an object');
    return;
  }

  for (const key of ['app', 'surface', 'sessionId']) {
    if (context[key] !== undefined && typeof context[key] !== 'string') {
      errors.push(`context.${key} must be a string`);
    }
  }

  if (context.theme !== undefined && context.theme !== 'finance' && context.theme !== 'admin-bw') {
    errors.push('context.theme is not supported');
  }
}

function isTelemetryEventType(value: unknown): value is TelemetryEventType {
  return typeof value === 'string' && value in telemetryEventSchemas;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
