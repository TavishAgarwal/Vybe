import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  DevSettings,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle } from 'lucide-react-native';
import { colors, spacing, typography } from '../../theme';
import { logger } from '../../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught render error', {
      name: error.name,
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleRestart = async () => {
    try {
      DevSettings.reload();
    } catch {
      this.setState({ hasError: false });
    }
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <AlertTriangle size={56} color={colors.status.error} />
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>Restart Vybe and try again.</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
            <Text style={styles.buttonText}>Restart app</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.weights.bold,
    color: colors.text.inverse,
    fontSize: typography.sizes['2xl'],
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.weights.regular,
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary.base,
    borderRadius: spacing.radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonText: {
    ...typography.weights.bold,
    color: colors.text.inverse,
    fontSize: typography.sizes.md,
  },
});
