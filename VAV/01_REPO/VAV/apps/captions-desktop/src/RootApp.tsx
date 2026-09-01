import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AbraxasMasterApp } from './AbraxasMasterApp';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ABRAXAS OS:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#08080a', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', color: '#ef4444', marginBottom: '12px' }}>▲ ABRAXAS RECOVERY ENGINE</div>
          <p style={{ color: '#d4af37', fontSize: '14px' }}>Se detectó una excepción en la interfaz. El kernel continúa activo.</p>
          <pre style={{ background: '#121217', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '800px', overflowX: 'auto', color: '#fca5a5', fontSize: '12px' }}>
            {this.state.error?.stack || this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '8px 20px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
          >
            REINICIAR INTERFAZ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const RootApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <AbraxasMasterApp />
    </ErrorBoundary>
  );
};
