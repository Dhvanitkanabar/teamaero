import React from 'react';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';

/**
 * ErrorBoundary — catches unhandled React render errors and shows a premium fallback UI.
 * Must be a class component (React requirement for componentDidCatch).
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 *   // With custom fallback:
 *   <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *     <MyComponent />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console in development; swap for Sentry/analytics in production
    console.error('[ErrorBoundary] Unhandled render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback was passed in, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default premium Vanguard AERO error UI
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950 px-6"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-lg w-full text-center space-y-10">
            {/* Icon */}
            <div className="mx-auto w-24 h-24 rounded-[32px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle size={40} className="text-rose-400" aria-hidden="true" />
            </div>

            {/* Text */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                <Terminal size={10} className="text-rose-400" aria-hidden="true" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-400">
                  System Error
                </span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Something went wrong
              </h1>
              <p className="text-slate-400 text-base font-medium leading-relaxed">
                The Vanguard AERO interface encountered an unexpected error.
                Your data is safe — please try refreshing.
              </p>

              {/* Error details (dev helper, collapsible) */}
              {this.state.error && (
                <details className="text-left mt-4">
                  <summary className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
                    Error details
                  </summary>
                  <pre className="mt-3 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] text-rose-300 overflow-auto max-h-40 leading-relaxed">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-2xl"
                aria-label="Try again — reset the error boundary"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                aria-label="Go to the home page"
              >
                <Home size={16} aria-hidden="true" />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
