import React from "react";
import {
  Activity,
  Captions,
  FileVideo2,
  FolderKanban,
  LayoutTemplate,
  MessageSquareText,
  Move3D,
  Music2,
  Palette,
  ScanSearch,
  Sparkles,
  Video
} from "lucide-react";
import {motion, useReducedMotion} from "motion/react";
import {type ActiveSection, useUiState} from "./uiState.ts";

const items: readonly [ActiveSection, string, React.ComponentType<{size?: number; strokeWidth?: number}>][] = [
  ["project", "Proyecto", FolderKanban],
  ["media", "Video", Video],
  ["transcript", "Transcripción", MessageSquareText],
  ["captions", "Subtítulos", Captions],
  ["styles", "Estilos", Palette],
  ["structure", "Estructura", LayoutTemplate],
  ["motion", "Motion", Move3D],
  ["scene-smart", "Scene Smart", Sparkles],
  ["context", "Contexto", FileVideo2],
  ["audio", "Audio", Music2],
  ["diagnostics", "Diagnóstico", Activity]
];

export const NavRail: React.FC<{collapsed: boolean}> = ({collapsed}) => {
  const reduce = useReducedMotion();
  const activeSection = useUiState((state) => state.activeSection);
  const setActiveSection = useUiState((state) => state.setActiveSection);

  return (
    <aside className={`nav-rail ${collapsed ? "collapsed" : ""}`}>
      <div className="rail-brand" title="VAV Captions">
        <span>V</span>
        {!collapsed && <strong>VAV</strong>}
      </div>
      <nav className="rail-items" aria-label="Herramientas de VAV">
        {items.map(([id,label,Icon]) => (
          <motion.button
            key={id}
            className={`rail-item ${activeSection === id ? "active" : ""}`}
            title={label}
            aria-label={label}
            onClick={() => setActiveSection(id)}
            whileTap={{scale: reduce ? 1 : .97}}
            transition={{type:"spring",stiffness:520,damping:34}}
          >
            <Icon size={18} strokeWidth={1.75}/>
            {!collapsed && <span>{label}</span>}
          </motion.button>
        ))}
      </nav>
      <div className="rail-footer">
        <ScanSearch size={16}/>
        {!collapsed && <span>Corrida 01.6</span>}
      </div>
    </aside>
  );
};
