import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='error-boundary-container'>
          <h5>oops! something went wrong.</h5>
          <p>Dont worry, Please try again,  if the issue persist contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
