# Stitch Design Source

The canonical design source is `../DESIGN.md`.

Use that root file for Stitch prompts, design.md linting, token export, and
agent context. This wrapper exists so older Stitch workflows that look inside
`.stitch/` still find the correct source of truth without creating a second
design system document.
