import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-un-dark flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-xl font-bold text-un-text mb-2">Something went wrong</h1>
          <p className="text-un-muted text-sm mb-4 max-w-md">
            This page encountered an error. Try refreshing.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-un-accent/20 text-un-accent hover:bg-un-accent/30 transition-colors font-medium"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
