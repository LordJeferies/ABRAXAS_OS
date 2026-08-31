/**
 * ABRAXAS OS Desktop Native Boot Initializer
 * Executed upon Tauri application startup.
 */

import { AbraxasKernel } from "../../../../../../ABRAXAS_CORE/kernel/abraxas-kernel.js";
import { SystemStatusPanelProvider } from "../../../../../../ABRAXAS_CORE/kernel/status-panel.js";

export async function bootAbraxas(dbPath?: string): Promise<{ kernel: AbraxasKernel; statusPanel: ReturnType<SystemStatusPanelProvider["getModel"]> }> {
  console.log("============================================================");
  console.log("   ABRAXAS OS DESKTOP SHELL — BOOTING NATIVE KERNEL");
  console.log("============================================================");

  const kernel = new AbraxasKernel(dbPath);
  const system = kernel.boot();

  console.log(`[BOOT] System:  ${system.system} (${system.version})`);
  console.log(`[BOOT] Status:  ${system.status} | Sefirah: ${system.state}`);
  console.log(`[BOOT] Modules: ${system.registeredModulesCount} registered and active`);
  console.log(`[BOOT] Memory:  Connected (SQLite Stratigraphic Core)`);
  console.log(`[BOOT] Guardian: ${system.guardianStatus} (Background Daemon Active)`);

  const statusProvider = new SystemStatusPanelProvider(kernel);
  const statusPanel = statusProvider.getModel();

  console.log("============================================================");
  console.log("   ABRAXAS OS ONLINE — READY FOR CONVERSATIONAL INTENTION");
  console.log("============================================================\n");

  return { kernel, statusPanel };
}
