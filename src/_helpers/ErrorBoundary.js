import React, { Component } from "react";
import { View, Text } from "react-native";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: null, stack: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log("========error========", error.toString());
    return { hasError: true, message: error.toString(), stack: error.stack };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log("========error========", error.toString());
    console.log("========errorInfo========", errorInfo);
  }

  render() {
    const { hasError, message } = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <View>
          <Text>{message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
