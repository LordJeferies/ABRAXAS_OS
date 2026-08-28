# ABRAXAS v1.2 · DaVinci Resolve Automation Bridge

Run `ABRAXAS_IMPORT_TO_RESOLVE.py` from DaVinci Resolve's Python scripting environment after opening/creating the destination project. It reads the same `SHIM_CONFIRMED_MANIFEST.json` used by the Terminal bridge, imports the source as read-only media, creates one editable timeline per confirmed video, appends the confirmed source ranges in editorial order, and adds markers for HOOK / DEVELOPMENT / PAYOFF / B-ROLL / VFX / SFX / CLAIM / REVIEW.

The script does **not** decide which candidates are good. That decision must already be recorded as `CONFIRMADO` in the manifest. It does not delete, trim or overwrite the source file. Subtitle generation, Text+ styling, visual effects and final mix remain editable Resolve operations and must be manually QA'd after automation.

If Resolve's scripting API is unavailable, use the Terminal bridge to create clean derivative MP4 files and import them manually; the manifest and marker JSON remain the source of truth.
