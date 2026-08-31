# Recording Session Contract V1

## Purpose
Represents physical, remote, or hybrid production scheduling linking talent, Lienzos, logistics, and preparation tasks.

## Canonical Payload Shape
```json
{
  "recordingSessionId": "rec_01",
  "version": 1,
  "title": "Batch Studio Session",
  "status": "CONFIRMED",
  "startsAt": "2026-09-02T14:00:00Z",
  "endsAt": "2026-09-02T18:00:00Z",
  "timezone": "America/Bogota",
  "locationType": "PHYSICAL",
  "locationDetails": "Studio A — Hub",
  "people": [
    {"userId": "u_talent_01", "role": "Presenter"},
    {"userId": "u_director", "role": "Director"}
  ],
  "relatedLienzoIds": ["lienzo_001", "lienzo_002"],
  "relatedTaskIds": ["tsk_01"],
  "preparationTaskIds": ["tsk_prep_01"],
  "notes": "4K 60fps capture",
  "createdBy": "u_producer",
  "createdAt": "2026-08-30T12:00:00Z"
}
```

## Canonical Enums
* `status`: `"DRAFT"` | `"PROPOSED"` | `"CONFIRMED"` | `"IN_PROGRESS"` | `"COMPLETED"` | `"CANCELLED"`.
* `locationType`: `"PHYSICAL"` | `"REMOTE"` | `"TBD"`.

## Permissions
* `recording.create`: Create draft session.
* `recording.edit`: Modify session details / cancel.
* `recording.confirm`: Move session to CONFIRMED.
