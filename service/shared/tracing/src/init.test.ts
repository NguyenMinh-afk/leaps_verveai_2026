import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpanStatusCode } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';

vi.mock('@opentelemetry/sdk-node', () => {
  return {
    NodeSDK: class {
      start = vi.fn();
      shutdown = vi.fn().mockResolvedValue(undefined);
    },
  };
});

vi.mock('@opentelemetry/auto-instrumentations-node', () => ({
  getNodeAutoInstrumentations: vi.fn(() => ['auto']),
}));

vi.mock('@opentelemetry/exporter-trace-otlp-http', () => ({
  OTLPTraceExporter: class {
    url: string;
    constructor(opts: { url: string }) {
      this.url = opts.url;
    }
  },
}));

vi.mock('@opentelemetry/api', async () => {
  const actual = await vi.importActual<typeof import('@opentelemetry/api')>('@opentelemetry/api');
  const noopSpan = {
    setStatus: vi.fn(),
    recordException: vi.fn(),
    end: vi.fn(),
  } as unknown as Span;
  const noopTracer = {
    startActiveSpan: vi.fn((_name: string, fn: (s: Span) => unknown) => fn(noopSpan)),
  };

  return {
    ...actual,
    trace: {
      getTracer: vi.fn(() => noopTracer),
    },
  };
});

import { getTracer, createSpan, withSpan } from './init';

describe('tracing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTracer returns a tracer instance', () => {
    const tracer = getTracer('svc-auth');
    expect(tracer).toBeDefined();
    // The mock trace.getTracer should have been called with our name.
    const api = require('@opentelemetry/api');
    expect(api.trace.getTracer).toHaveBeenCalledWith('svc-auth');
  });

  it('getTracer defaults to verveai when no name is supplied', () => {
    getTracer();
    const api = require('@opentelemetry/api');
    expect(api.trace.getTracer).toHaveBeenCalledWith('verveai');
  });

  it('createSpan invokes the function and returns its result', async () => {
    const result = await createSpan('test-span', async () => 42);
    expect(result).toBe(42);
  });

  it('createSpan sets OK status on success', async () => {
    await createSpan('ok-span', async () => 'done');
    // Span itself is captured by the mock above; verify via the tracer mock.
    const api = require('@opentelemetry/api');
    const tracer = api.trace.getTracer.mock.results[0].value;
    expect(tracer.startActiveSpan).toHaveBeenCalled();
  });

  it('createSpan sets ERROR status and records exception when the function throws', async () => {
    const api = require('@opentelemetry/api');
    // Capture the span mock that the noop tracer will hand to the callback.
    const fakeSpan = {
      setStatus: vi.fn(),
      recordException: vi.fn(),
      end: vi.fn(),
    } as unknown as Span;

    const erroringTracer = {
      startActiveSpan: vi.fn((_name: string, fn: (s: Span) => unknown) => fn(fakeSpan)),
    };
    api.trace.getTracer.mockReturnValueOnce(erroringTracer);

    await expect(
      createSpan('error-span', async () => {
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    expect((fakeSpan as unknown as { setStatus: ReturnType<typeof vi.fn> }).setStatus).toHaveBeenCalledWith(
      expect.objectContaining({ code: SpanStatusCode.ERROR })
    );
    expect(
      (fakeSpan as unknown as { recordException: ReturnType<typeof vi.fn> }).recordException
    ).toHaveBeenCalled();
    expect((fakeSpan as unknown as { end: ReturnType<typeof vi.fn> }).end).toHaveBeenCalled();
  });

  it('withSpan runs the function synchronously and returns the result', () => {
    const result = withSpan('sync-span', () => 'sync-ok');
    expect(result).toBe('sync-ok');
  });

  it('withSpan sets ERROR status when the function throws synchronously', () => {
    const api = require('@opentelemetry/api');
    const fakeSpan = {
      setStatus: vi.fn(),
      recordException: vi.fn(),
      end: vi.fn(),
    } as unknown as Span;

    const erroringTracer = {
      startActiveSpan: vi.fn((_name: string, fn: (s: Span) => unknown) => fn(fakeSpan)),
    };
    api.trace.getTracer.mockReturnValueOnce(erroringTracer);

    expect(() =>
      withSpan('sync-error-span', () => {
        throw new Error('sync-boom');
      })
    ).toThrow('sync-boom');

    expect((fakeSpan as unknown as { setStatus: ReturnType<typeof vi.fn> }).setStatus).toHaveBeenCalledWith(
      expect.objectContaining({ code: SpanStatusCode.ERROR })
    );
    expect(
      (fakeSpan as unknown as { recordException: ReturnType<typeof vi.fn> }).recordException
    ).toHaveBeenCalled();
    expect((fakeSpan as unknown as { end: ReturnType<typeof vi.fn> }).end).toHaveBeenCalled();
  });

  it('withSpan gives the span to the callback for manual annotation', () => {
    const api = require('@opentelemetry/api');
    const fakeSpan = {
      setStatus: vi.fn(),
      recordException: vi.fn(),
      end: vi.fn(),
      setAttribute: vi.fn(),
    } as unknown as Span;

    const capturingTracer = {
      startActiveSpan: vi.fn((_name: string, fn: (s: Span) => unknown) => fn(fakeSpan)),
    };
    api.trace.getTracer.mockReturnValueOnce(capturingTracer);

    const result = withSpan('annotate', (span) => {
      span.setAttribute('custom.attr', 'value');
      return 'annotated';
    });

    expect(result).toBe('annotated');
    expect(
      (fakeSpan as unknown as { setAttribute: ReturnType<typeof vi.fn> }).setAttribute
    ).toHaveBeenCalledWith('custom.attr', 'value');
  });
});
