type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const redact = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value
      .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, 'Bearer [REDACTED]')
      .replace(/eyJ[A-Za-z0-9._~+/=-]+/g, '[REDACTED_JWT]');
  }

  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(source).map(([key, nested]) => {
        if (/password|token|secret|authorization|email/i.test(key)) {
          return [key, '[REDACTED]'];
        }
        return [key, redact(nested)];
      }),
    );
  }

  return value;
};

const write = (level: LogLevel, message: string, metadata?: unknown) => {
  if (!__DEV__) {
    return;
  }
  const payload = metadata === undefined ? [] : [redact(metadata)];
  console[level](`[Vybe] ${message}`, ...payload);
};

export const logger = {
  debug: (message: string, metadata?: unknown) =>
    write('debug', message, metadata),
  info: (message: string, metadata?: unknown) =>
    write('info', message, metadata),
  warn: (message: string, metadata?: unknown) =>
    write('warn', message, metadata),
  error: (message: string, metadata?: unknown) =>
    write('error', message, metadata),
};
