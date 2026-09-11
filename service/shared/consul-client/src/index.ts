/**
 * Consul Service Discovery Client for VERVEAI Microservices
 *
 * Provides service registration, discovery, and health checking capabilities
 * using Consul's HTTP API.
 *
 * Usage:
 * ```typescript
 * import { ConsulClient } from '@verveai/consul-client';
 *
 * const consul = new ConsulClient('localhost', 8500);
 * await consul.register({
 *   name: 'svc-auth',
 *   port: 3001,
 *   healthCheck: '/health',
 *   tags: ['auth', 'v1'],
 * });
 *
 * const url = await consul.resolve('svc-auth');
 * // Returns: 'http://localhost:3001'
 * ```
 */

export interface ServiceRegistration {
  /** Service name (e.g., 'svc-auth', 'svc-bkt') */
  name: string;
  /** Port where the service is listening */
  port: number;
  /** Host address (defaults to hostname from environment) */
  host?: string;
  /** Health check endpoint path */
  healthCheck: string;
  /** Optional tags for service identification */
  tags?: string[];
  /** Optional metadata key-value pairs */
  meta?: Record<string, string>;
}

export interface ServiceInstance {
  /** Service ID */
  ID: string;
  /** Service name */
  Address: string;
  /** Service port */
  Port: number;
  /** Optional tags */
  Tags?: string[];
  /** Optional metadata */
  Meta?: Record<string, string>;
}

export class ConsulClient {
  private readonly host: string;
  private readonly port: number;
  private serviceId?: string;

  constructor(host: string = process.env.CONSUL_HOST || 'localhost', port: number = parseInt(process.env.CONSUL_PORT || '8500', 10)) {
    this.host = host;
    this.port = port;
  }

  /**
   * Register this service with Consul
   */
  async register(config: ServiceRegistration): Promise<void> {
    const { name, port, host, healthCheck, tags, meta } = config;
    const serviceHost = host || process.env.HOSTNAME || 'localhost';
    this.serviceId = `${name}-${port}`;

    const body = {
      ID: this.serviceId,
      Name: name,
      Address: serviceHost,
      Port: port,
      Check: {
        HTTP: `http://${serviceHost}:${port}${healthCheck}`,
        Interval: '10s',
        Timeout: '5s',
        DeregisterCriticalServiceAfter: '30s',
      },
      Tags: tags || [],
      Meta: meta || {},
    };

    const url = `http://${this.host}:${this.port}/v1/agent/service/register`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to register service: ${response.status} ${errorText}`);
    }
  }

  /**
   * Deregister this service from Consul
   */
  async deregister(serviceId?: string): Promise<void> {
    const id = serviceId || this.serviceId;
    if (!id) {
      throw new Error('No service ID provided and no service has been registered');
    }

    const url = `http://${this.host}:${this.port}/v1/agent/service/deregister/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to deregister service: ${response.status} ${errorText}`);
    }
  }

  /**
   * Resolve a service name to its URL
   * Returns the HTTP URL for the first healthy instance
   */
  async resolve(serviceName: string): Promise<string> {
    const url = `http://${this.host}:${this.port}/v1/catalog/service/${serviceName}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to resolve service ${serviceName}: ${response.status}`);
    }

    const services = await response.json() as Array<{
      ServiceAddress: string;
      Address: string;
      Port: number;
    }>;

    if (!services || services.length === 0) {
      throw new Error(`Service ${serviceName} not found in Consul`);
    }

    // Prefer ServiceAddress over Address
    const service = services[0];
    const address = service.ServiceAddress || service.Address;

    return `http://${address}:${service.Port}`;
  }

  /**
   * List all registered services in Consul
   */
  async listServices(): Promise<Record<string, { Address: string; Port: number; ID: string }>> {
    const url = `http://${this.host}:${this.port}/v1/catalog/services`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to list services: ${response.status}`);
    }

    const data = await response.json() as Record<string, string[]>;

    // Fetch details for each service
    const services: Record<string, { Address: string; Port: number; ID: string }> = {};

    for (const serviceName of Object.keys(data)) {
      const detailUrl = `http://${this.host}:${this.port}/v1/catalog/service/${serviceName}`;
      const detailResponse = await fetch(detailUrl);

      if (detailResponse.ok) {
        const instances = await detailResponse.json() as Array<{
          ServiceID: string;
          ServiceAddress: string;
          Address: string;
          Port: number;
        }>;

        if (instances && instances.length > 0) {
          const instance = instances[0];
          services[serviceName] = {
            ID: instance.ServiceID,
            Address: instance.ServiceAddress || instance.Address,
            Port: instance.Port,
          };
        }
      }
    }

    return services;
  }

  /**
   * Check if a service is healthy
   */
  async healthCheck(serviceName: string): Promise<boolean> {
    const url = `http://${this.host}:${this.port}/v1/health/checks/${serviceName}`;
    const response = await fetch(url);

    if (!response.ok) {
      return false;
    }

    const checks = await response.json() as Array<{
      Status: string;
    }>;

    if (!checks || checks.length === 0) {
      return false;
    }

    // All checks must be passing
    return checks.every(check => check.Status === 'passing');
  }
}

// Default export instance for convenience
export default new ConsulClient();

/**
 * Default singleton instance — convenience alias matching the
 * `import { Consul } from '@verveai/consul-client'` pattern used across
 * VERVEAI services. Equivalent to the default export.
 */
export const Consul = new ConsulClient();
