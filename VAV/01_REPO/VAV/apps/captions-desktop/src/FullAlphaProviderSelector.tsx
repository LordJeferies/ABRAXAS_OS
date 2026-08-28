import React from "react";
import {Cpu, LockKeyhole, Sparkles} from "lucide-react";
import providerStateJson from "./generated/provider-state.json";
import {ProviderStateSchema} from "@vav/transcription";
import {useFullAlpha} from "./fullAlphaState.ts";

const providerState = ProviderStateSchema.parse(providerStateJson);

export const FullAlphaProviderSelector: React.FC = () => {
  const provider = useFullAlpha((s) => s.provider);
  const modelId = useFullAlpha((s) => s.modelId);
  const status = useFullAlpha((s) => s.transcriptionStatus);
  const setProvider = useFullAlpha((s) => s.setProvider);
  const setModelId = useFullAlpha((s) => s.setModelId);

  return (
    <div className="fa-card">
      <div className="fa-card-title">MOTOR DE TRANSCRIPCIÓN</div>
      <div className="fa-provider-stack">
        <button
          className={`fa-provider ${provider === "whisper-cpp" ? "active" : ""}`}
          disabled={!providerState.whisperCpp.available || status === "running"}
          onClick={() => setProvider("whisper-cpp")}
        >
          <Cpu size={17}/>
          <span><strong>Whisper.cpp</strong><small>Large V3 Turbo FULL</small></span>
          <b>DEFAULT</b>
        </button>

        <button
          className={`fa-provider ${provider === "mlx-whisper" ? "active" : ""}`}
          disabled={!providerState.mlx.available || status === "running"}
          onClick={() => {
            if (!providerState.mlx.available) return;
            setProvider("mlx-whisper");
            setModelId(providerState.mlx.models[0]?.id ?? "large-v3-turbo");
          }}
        >
          {providerState.mlx.available ? <Sparkles size={17}/> : <LockKeyhole size={17}/>}
          <span>
            <strong>MLX Whisper</strong>
            <small>{providerState.mlx.available ? "Apple Silicon" : "No detectado"}</small>
          </span>
          <b>APPLE</b>
        </button>
      </div>

      {provider === "mlx-whisper" && providerState.mlx.available && (
        <select value={modelId} onChange={(event) => setModelId(event.target.value)}>
          {providerState.mlx.models.map((model) => (
            <option key={model.id} value={model.id}>{model.label}</option>
          ))}
        </select>
      )}
      <small>No se descargan modelos automáticamente.</small>
    </div>
  );
};
