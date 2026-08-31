import type {RecordingSession} from "./types.ts";

export class RecordingSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecordingSessionError";
  }
}

export const validateRecordingSession = (session: RecordingSession): void => {
  if (!session.recordingSessionId || !session.recordingSessionId.trim()) {
    throw new RecordingSessionError("RecordingSession must have a valid recordingSessionId");
  }
  if (!session.title || !session.title.trim()) {
    throw new RecordingSessionError("RecordingSession must have a non-empty title");
  }
  const start = new Date(session.startsAt).getTime();
  const end = new Date(session.endsAt).getTime();

  if (isNaN(start) || isNaN(end)) {
    throw new RecordingSessionError("RecordingSession must have valid ISO-8601 startsAt and endsAt timestamps");
  }
  if (end <= start) {
    throw new RecordingSessionError("RecordingSession endsAt must be strictly greater than startsAt");
  }
};
