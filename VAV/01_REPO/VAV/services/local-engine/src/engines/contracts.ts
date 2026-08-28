export interface VavEngine {
  readonly id: string;
  readonly status: "ready" | "stub";
}

export const engineContractVersion = 1 as const;
