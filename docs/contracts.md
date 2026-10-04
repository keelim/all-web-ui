# Consumer contracts

Install an exact released `@keelim/all-web-ui` version from `https://npm.pkg.github.com` with package-read access and React/React DOM `^19.0.0`. Import public package paths rather than sibling source. Missing registry access fails installation; an unexported subpath fails resolution.

| Interface | Input | Output and failure |
| --- | --- | --- |
| Root and component subpaths such as `/button`, `/field`, `/panel` | Typed React props, callbacks, and compatible peers | React UI plus declarations; props remain component-specific, unsupported imports are not part of the package contract |
| `/styles.css`, `/spacing.css`, `/themes/finance.css`, `/themes/admin-bw.css` | One global component import and optional theme wrapper | Semantic CSS; absent style imports produce incomplete presentation |
| `/manifest` | Import `componentManifest` | Frozen entries with name, exportPath, lifecycle, styleImports, themeScopes; reference metadata, not a renderer |
| `/theme-contract` | Theme id/token/selector metadata | `finance` and `admin-bw` theme contracts; `isKuiThemeId` returns false for unsupported values |
| `/telemetry` validation | Object with `type`, `payload`, optional version/context/time | `validateTelemetryEvent` returns `{ok:true,event}` or `{ok:false,errors}`; `defineTelemetryEvent` throws on invalid input |
| `/telemetry` emitter | Consent, optional enable callback, sink, schemas, then event | `{emitted:true}` or `{emitted:false,reason}`; async sinks return a Promise |

Telemetry version is 1. Built-in events are `tool.entry` (toolId/source), `tool.complete` (toolId, optional outcome), `onboarding.tour.started` (tourId, optional surface), `onboarding.step.viewed` (tourId/stepId/stepIndex), and `onboarding.tour.dismissed` (tourId, optional completed/skipped/closed reason). Context permits app, surface, sessionId, and valid theme. Unknown payload/context fields fail validation. Failure reasons are `opt-out`, `sink-disabled`, `invalid-event`, and `sink-error`; callers must not equate a returned object with delivery success.

Finance scopes support `.theme-finance`, `.kui-theme-finance`, and `[data-kui-theme='finance']` with supported dark selectors. Admin scopes include `.admin-bw-theme`, `.theme-admin-bw`, `.kui-theme-admin-bw`, and `[data-kui-theme='admin-bw']`.
