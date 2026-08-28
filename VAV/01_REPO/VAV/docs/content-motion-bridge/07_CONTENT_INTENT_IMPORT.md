# Content Intent Import — TXT / HTML / JSON

The user can import a document describing possible content pieces from a long
video, including timestamps and editorial roles such as hook, development,
proof and close.

## Normalized object

```json
{
  "contentId": "optional-known-content-id",
  "sourceMediaFingerprint": "sha256-or-media-id",
  "candidates": [
    {
      "candidateId": "CAND-001",
      "sourceSpan": {"startUs": 43000000, "endUs": 59000000},
      "role": "hook",
      "summary": "Opening thesis",
      "priority": 0.92,
      "motionHint": "ABRAXAS_MOTION_03",
      "captionHint": {
        "emphasisIntensity": "high",
        "structurePreference": "hero"
      },
      "provenance": ["USER"]
    }
  ]
}
```

## Import rules
- JSON contract is preferred when available.
- TXT/MD are human projections parsed into candidates.
- HTML is treated as a VIEW. If it contains embedded structured data, use it.
- Arbitrary HTML/text parsing never becomes canonical automatically.
- User gets an Import Review before Apply.
- Unknown/missing fields remain null/unknown; VAV does not invent facts.
