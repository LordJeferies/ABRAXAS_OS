# Recommended Default Workflow

For a large library of long recordings:

1. Ingest the long source once.
2. Run whisper/transcript once.
3. Build source-anchored Word[].
4. Import Content OS TXT/HTML/JSON with hook/development/close candidates.
5. Resolve/approve candidate spans.
6. Let Vav-cuts or another editing layer create final clips.
7. Import `.vavedit.json`.
8. Add/import visual motions.
9. Import `.vavmotion.json`.
10. Compile final captions with motion-aware rules.
11. Review full Caption Document + timeline.
12. VAV Check.
13. Render.

Why:
transcription is expensive but source-stable.
visual caption composition is timeline/motion-dependent and should happen late.

Nevertheless, VAV supports captions-first and motions-first as valid alternate
orders through dependency invalidation and time mapping.
