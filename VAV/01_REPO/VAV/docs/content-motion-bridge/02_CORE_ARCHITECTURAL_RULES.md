# Core Architectural Rules

1. Ficha/content_id can be imported from Universal Content OS.
2. A stage adds a module/layer; it does not erase prior layers.
3. Planned / Observed / Resolved remain separate.
4. TXT and HTML are projections/import sources, not VAV's internal truth.
5. Original source files are retained as immutable import artifacts.
6. Imported data keeps provenance.
7. Source timestamps and timeline timestamps are different coordinate systems.
8. Caption semantic grouping is different from scene/presentation.
9. Visual Motion is different from Caption Motion.
10. Visual motions constrain captions; they do not directly mutate caption data.
11. Manual locks always beat automation.
12. Changing motions invalidates only affected visual caption plans, not
    transcription or unrelated analysis.
13. Cut/edit manifests remap source-anchored words/captions to output timeline.
14. VAV-Captions remains useful whether motions arrive before or after captions.
