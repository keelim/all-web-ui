# Shared component meaning

A primitive is eligible here when it serves reusable presentation or interaction. A route, account workflow, or product calculation remains with its consumer even if two screens look similar.

Tokens carry semantic intent across finance and admin themes. A component must resolve its colors through `--kui-*` and the shadcn HSL bridge; a new hardcoded palette would make theme changes incomplete. Shared component CSS is loaded once; optional theme scopes apply to the smallest relevant application shell.

Public component availability is the conjunction of implementation, export, type declaration, style assets, and manifest entry. Adding only a source file does not make a usable package API. Lifecycle labels describe the exported component contract; they do not prove downstream adoption.

Telemetry consent and transport are independent. Without consent, emitting is a no-op; an enabled sink does not grant consent. Invalid events or sink failure do not establish successful delivery. Remote design synchronization is complete only when the retrieved remote `designTheme.designMd` matches root `DESIGN.md`; a successful upload alone is insufficient.
