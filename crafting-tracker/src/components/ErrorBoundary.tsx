import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  appName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-xl font-bold text-slate-100 mb-2">Something went wrong</h1>
          <p className="text-slate-400 text-sm mb-4 max-w-md">
            {this.props.appName ?? "This app"} encountered an error. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25 transition-colors font-medium"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
