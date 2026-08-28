# ABRAXAS Shim Automation Bridge v1.2

One editorial decision source: `SHIM_CONFIRMED_MANIFEST.json`.

- `terminal/` creates reproducible derivative files with FFmpeg.
- `davinci/` creates editable Resolve timelines and markers.
- Neither engine may select, reject, rewrite or reinterpret editorial candidates.
- Source video is read-only.
- Carousels never enter FFmpeg/DaVinci; they use `CAROUSEL_PRODUCTION_PACKAGE.json` and return to Content Studio / Visual / Assets / QA / Calendar.
