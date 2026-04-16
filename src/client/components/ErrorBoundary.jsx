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
        <div className="rounded-[4px] border border-[#DE350B]/20 bg-[#FFEBE6] p-6 text-center">
          <p className="text-base font-semibold text-j-red dark:text-red-400">
            Something went wrong
          </p>
          <p className="mt-1.5 text-sm text-j-sub dark:text-red-400/70">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="mt-4 inline-flex items-center justify-center rounded-[3px] bg-j-red px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#BF2600] dark:bg-red-600 dark:hover:bg-red-700"
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
