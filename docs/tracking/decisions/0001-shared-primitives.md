# Shared primitives with independent consumers

## Context

Two products need a common UI surface without sharing their routes and business state.

## Decision and alternatives

Keep reusable primitives and tokens in this package; use app-local adapters instead of duplicated generic forks or product routes in the library.

## Consequences

Public exports and consumer integration must be verified together; standalone registry access remains separate from workspace linking.
