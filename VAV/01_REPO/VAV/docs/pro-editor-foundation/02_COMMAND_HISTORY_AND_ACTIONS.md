# Undo / Redo / Command Bus

Todo cambio mutable debe converger en VAV Actions.

USER / LOCAL AUTO / AI
        ↓
    VAV ACTION
        ↓
   COMMAND BUS
    ↙      ↘
 APPLY    HISTORY
           ↓
       UNDO / REDO

Debe cubrir:
- text corrections
- split/join
- emphasis
- placement
- size
- style
- structure
- motion
- Scene Smart suggestions
- markers
- bulk operations
- locks/unlocks

La UI nunca debe mutar el Project State de forma paralela al Command Bus.
