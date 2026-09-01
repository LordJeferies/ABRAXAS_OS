use serde::Serialize;
use serde_json::Value;
use std::path::PathBuf;
use std::process::Command;

#[derive(Serialize)]
struct PlatformInfo {
    os: String,
    arch: String,
}

#[tauri::command]
fn get_platform_info() -> PlatformInfo {
    PlatformInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
    }
}

fn resolve_node() -> Result<PathBuf, String> {
    let candidates = [
        PathBuf::from("node"),
        PathBuf::from("/opt/homebrew/bin/node"),
        PathBuf::from("/usr/local/bin/node"),
    ];

    for candidate in candidates {
        if let Ok(output) = Command::new(&candidate).arg("--version").output() {
            if output.status.success() {
                return Ok(candidate);
            }
        }
    }

    Err("Node.js no pudo resolverse para el ABRAXAS local engine.".to_string())
}

fn full_alpha_cli() -> Result<PathBuf, String> {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../../services/local-engine/src/full-alpha-cli.ts")
        .canonicalize()
        .map_err(|error| format!("ABRAXAS CLI no encontrado: {error}"))
}

#[tauri::command]
async fn run_full_alpha_engine(command: String, payload: Value) -> Result<Value, String> {
    tauri::async_runtime::spawn_blocking(move || -> Result<Value, String> {
        let node = resolve_node()?;
        let cli = full_alpha_cli()?;
        let payload_text = serde_json::to_string(&payload)
            .map_err(|error| format!("Payload no serializable: {error}"))?;

        let output = Command::new(node)
            .arg("--experimental-strip-types")
            .arg(cli)
            .arg(command)
            .arg(payload_text)
            .output()
            .map_err(|error| format!("No pude iniciar ABRAXAS local engine: {error}"))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            return Err(if stderr.is_empty() { stdout } else { stderr });
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        serde_json::from_str(stdout.trim())
            .map_err(|error| format!("Local engine devolvió JSON inválido: {error}"))
    })
    .await
    .map_err(|error| format!("Tarea local engine falló: {error}"))?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_platform_info,
            run_full_alpha_engine
        ])
        .run(tauri::generate_context!())
        .expect("error while running ABRAXAS OS");
}
