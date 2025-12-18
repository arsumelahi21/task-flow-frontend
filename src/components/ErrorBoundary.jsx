import React from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <h1 className="text-3xl font-semibold mb-2">
            Something went wrong
          </h1>

          <p className="text-gray-600 mb-6 text-center">
            An unexpected error occurred. Please try again or return to the dashboard.
          </p>

          <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-2 bg-blue-600 text-white rounded"
           >
            Back to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
