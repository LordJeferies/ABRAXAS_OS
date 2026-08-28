# Publishing Model

Content != Publication.

Un Lienzo tiene `publication_targets[]`.

Cada target:
platform
account_id
scheduled_at
timezone
status
copy_version
asset_version
cover_version
snapshot
remote_post_id
provider
last_sync_at

Estados:
DRAFT
READY
SCHEDULED
PUBLISHED
FAILED
CANCELLED

Al programar:
guardar snapshot de asset/copy/cover/metadata/time/account/version.

Cambios posteriores al Lienzo no alteran silenciosamente una publicación ya programada.
