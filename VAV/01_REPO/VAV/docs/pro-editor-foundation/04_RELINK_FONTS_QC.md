# Media Relink / Fonts / Project Health

## Media Relink
Matching signals:
filename, byte size, duration, partial hash, media metadata.

States:
online / offline / relinking / replaced.

## Font Registry
Sources:
system / bundled / project-local.
States:
available / missing / fallback / license-warning.

Render must not silently substitute a font when appearance would change.

## Project Health / VAV Check
Before export:
- media linked
- fonts available
- transcription complete
- no overflow
- platform safe zones
- reading speed
- low-confidence review
- no invalid visual segment overlap
- scene placement valid
- sync valid
- no unresolved critical issue
