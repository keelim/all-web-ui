# Package trust and access

There is no package-owned user login or credential store. Consumers own user sessions and sensitive application data. Package installation and publication authenticate to GitHub Packages separately.

| Subject/action | Condition | Denied boundary |
| --- | --- | --- |
| Consumer renders a primitive | Compatible peers, exported path, required styles | Product authorization is not supplied by a UI control |
| Telemetry caller emits | Consent resolves true and an enabled sink accepts a valid event | No implicit collection or built-in network sink |
| Maintainer publishes or changes a remote design | User authorizes that target/action and provider authentication works | Local build success is not publication authority |

Keep registry tokens in environment-backed registry configuration, never in source, fixtures, reports, or design artifacts. Missing/expired credentials block installation or publication; do not embed credentials to bypass that failure. Credential creation, rotation, and revocation remain with the provider and operator; no package-specific lifetime policy exists.

Review event payloads for unnecessary private data before adding schemas or sinks. Record publication identity/version, verification outcome, remote design parity, and authentication failures without token values. No central package audit service or automatic incident response is implemented.
