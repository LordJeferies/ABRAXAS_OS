import React from "react";
import {Activity} from "lucide-react";
import {engines} from "@vav/engine-registry";

export const EngineHealth: React.FC = () => (
  <section className="inspector-section">
    <div className="section-title">
      <div><span className="eyebrow">DEVELOPMENT</span><strong>Engine Registry</strong></div>
      <Activity size={16} className="section-icon"/>
    </div>
    <div className="engine-list">
      {engines.map((engine) => (
        <div className="engine-row" key={engine.id}>
          <span>{engine.label}</span>
          <span className={`status-pill ${engine.status}`}><i/>{engine.status}</span>
        </div>
      ))}
    </div>
  </section>
);
