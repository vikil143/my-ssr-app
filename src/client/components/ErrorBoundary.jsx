import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-8 text-center">
          <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">
            Something went wrong
          </p>
          <p className="mt-2 text-sm text-rose-600/80 dark:text-rose-400/70">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="mt-5 rounded-2xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
