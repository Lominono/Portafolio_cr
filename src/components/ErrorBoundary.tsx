/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un fallo inesperado:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full apple-card p-8 md:p-10 rounded-apple-card border border-black/[0.08] shadow-apple-card">
            <div className="w-12 h-12 rounded-full bg-accentMain/10 text-accentMain flex items-center justify-center mx-auto mb-4">
              <RotateCw size={22} className="text-accentMain" />
            </div>
            
            <h1 className="title-main text-xl text-textMain mb-2">
              RECARGA NECESARIA
            </h1>
            
            <p className="text-xs text-textSecondary font-sans font-light leading-relaxed mb-8">
              Ha ocurrido un detalle inesperado al procesar la vista. Tu navegación está a salvo y puedes reiniciar la sesión sin problema.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary w-full text-xs gap-2"
              >
                <RotateCw size={14} />
                <span>RECARGAR PÁGINA</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="min-h-[44px] px-5 rounded-apple-btn border border-black/[0.12] text-textMain text-xs uppercase tracking-widest font-sans hover:bg-black/[0.03] transition-all flex items-center justify-center gap-2"
              >
                <Home size={14} />
                <span>IR AL INICIO</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
