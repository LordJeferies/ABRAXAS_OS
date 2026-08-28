import React, {useMemo, useState} from "react";
import {Cpu, LockKeyhole, Sparkles} from "lucide-react";
import {motion, useReducedMotion} from "motion/react";
import providerStateJson from "./generated/provider-state.json";
import {ProviderStateSchema} from "@vav/transcription";

const providerState = ProviderStateSchema.parse(providerStateJson);

type MlxModelId = "large-v3-turbo" | "large-v3";

export const ProviderSelector: React.FC = () => {
  const [provider, setProvider] = useState<"whisper-cpp" | "mlx-whisper">("whisper-cpp");
  const reduce = useReducedMotion();
  const turbo = providerState.mlx.models.find((model) => model.id === "large-v3-turbo");
  const [mlxModel, setMlxModel] = useState<MlxModelId>(turbo?.id ?? providerState.mlx.models[0]?.id ?? "large-v3-turbo");

  const mlxReason = useMemo(() => {
    if (!providerState.mlx.supported) return "Apple Silicon only";
    if (!providerState.mlx.available) return "Runtime/model not detected";
    return null;
  }, []);

  return (
    <section className="inspector-section">
      <div className="section-title">
        <div><span className="eyebrow">TRANSCRIPTION</span><strong>Engine</strong></div>
        <Sparkles size={16} className="section-icon"/>
      </div>

      <div className="provider-stack">
        <motion.button
          className={`provider-card ${provider === "whisper-cpp" ? "selected" : ""}`}
          onClick={() => setProvider("whisper-cpp")}
          disabled={!providerState.whisperCpp.available}
          whileTap={{scale: reduce ? 1 : .985}}
          transition={{type: "spring", stiffness: 480, damping: 34}}
        >
          <div className="provider-icon"><Cpu size={17}/></div>
          <div className="provider-copy"><strong>Whisper.cpp</strong><span>Large V3 Turbo FULL</span></div>
          <span className="micro-badge">DEFAULT</span>
        </motion.button>

        <motion.button
          className={`provider-card ${provider === "mlx-whisper" ? "selected" : ""}`}
          onClick={() => {
            if (providerState.mlx.available) setProvider("mlx-whisper");
          }}
          disabled={!providerState.mlx.available}
          whileTap={{scale: reduce ? 1 : .985}}
          transition={{type: "spring", stiffness: 480, damping: 34}}
        >
          <div className="provider-icon">
            {providerState.mlx.available ? <Sparkles size={17}/> : <LockKeyhole size={17}/>}
          </div>
          <div className="provider-copy">
            <strong>MLX Whisper</strong>
            <span>{providerState.mlx.available ? "Apple Silicon optimized" : mlxReason}</span>
          </div>
          <span className={`micro-badge ${providerState.mlx.available ? "" : "muted"}`}>APPLE</span>
        </motion.button>
      </div>

      {provider === "mlx-whisper" && providerState.mlx.available && (
        <label className="field-stack">
          <span>MODEL</span>
          <select
            value={mlxModel}
            onChange={(event) => {
              const modelId = event.target.value;
              if (modelId === "large-v3-turbo" || modelId === "large-v3") {
                setMlxModel(modelId);
              }
            }}
          >
            {providerState.mlx.models.map((model) => (
              <option value={model.id} key={model.id}>{model.label}</option>
            ))}
          </select>
        </label>
      )}

      <p className="section-note">
        Whisper.cpp Turbo stays the project default. VAV never downloads another model automatically.
      </p>
    </section>
  );
};
