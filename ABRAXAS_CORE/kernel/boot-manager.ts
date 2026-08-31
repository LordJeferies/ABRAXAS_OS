/**
 * ABRAXAS Boot Manager
 */

import { AbraxasKernel } from "./abraxas-kernel.js";
import { SystemStateTracker } from "./system-state.js";

export class BootManager {
  private readonly stateTracker = new SystemStateTracker();

  public async bootstrap(kernel: AbraxasKernel): Promise<ReturnType<AbraxasKernel["boot"]>> {
    this.stateTracker.setStatus("INITIALIZING");
    console.log("BOOT MANAGER: Initializing ABRAXAS subsystems...");

    const bootResult = await kernel.boot();
    this.stateTracker.setStatus("ONLINE");
    console.log("BOOT MANAGER: ABRAXAS KERNEL ONLINE (State: " + bootResult.state + ")");
    return bootResult;
  }

  public getStateTracker(): SystemStateTracker {
    return this.stateTracker;
  }
}
