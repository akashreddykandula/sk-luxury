import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('SK Luxury - Uncaught error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <span className="font-display text-6xl text-gold">SK</span>
            <h1 className="font-display text-3xl text-luxury-dark mt-6 mb-3">Something Went Wrong</h1>
            <p className="font-sans text-sm text-luxury-muted mb-8 leading-relaxed">
              We're sorry for the inconvenience. Our team has been notified. Please try refreshing the page or return to the homepage.
            </p>
            <button onClick={this.handleReload} className="btn-luxury">
              Return to Homepage
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
