# Caller-owned opt-in telemetry

## Context

Shared interactions can be observed, but the library does not own user consent or an analytics backend.

## Decision and alternatives

Validate typed events and use a no-op default sink with explicit consent, rather than collecting implicitly.

## Consequences

Consumers own consent and transport. Invalid payloads and sink failures are visible results, not successful delivery.
