/**
 * Consul HTTP API wrapper using node-fetch
 *
 * This module provides low-level access to Consul's HTTP API.
 * It's used internally by the ConsulClient class.
 */

import fetch from 'node-fetch';

/**
 * Get Consul host from environment or default
 */
export function getConsulHost(): string {
  return process.env.CONSUL_HOST || 'localhost';
}

/**
 * Get Consul port from environment or default
 */
export function getConsulPort(): number {
  return parseInt(process.env.CONSUL_PORT || '8500', 10);
}

/**
 * Build Consul API URL
 */
export function buildUrl(path: string, host?: string, port?: number): string {
  const h = host || getConsulHost();
  const p = port || getConsulPort();
  return `http://${h}:${p}${path}`;
}

/**
 * Register service with Consul
 * PUT /v1/agent/service/register
 */
export async function registerService(
  body: Record<string, unknown>,
  host?: string,
  port?: number,
): Promise<void> {
  const url = buildUrl('/v1/agent/service/register', host, port);
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
 * Deregister service from Consul
 * PUT /v1/agent/service/deregister/:serviceId
 */
export async function deregisterService(
  serviceId: string,
  host?: string,
  port?: number,
): Promise<void> {
  const url = buildUrl(`/v1/agent/service/deregister/${serviceId}`, host, port);
  const response = await fetch(url, {
    method: 'PUT',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to deregister service: ${response.status} ${errorText}`);
  }
}

/**
 * Resolve service name to instances
 * GET /v1/catalog/service/:name
 */
export async function resolveService(
  serviceName: string,
  host?: string,
  port?: number,
): Promise<Array<{ ServiceAddress: string; Address: string; Port: number }>> {
  const url = buildUrl(`/v1/catalog/service/${serviceName}`, host, port);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to resolve service ${serviceName}: ${response.status}`);
  }

  const services = await response.json() as Array<{ ServiceAddress: string; Address: string; Port: number }>;

  if (!services || services.length === 0) {
    throw new Error(`Service ${serviceName} not found in Consul`);
  }

  return services;
}

/**
 * List all services from Consul
 * GET /v1/catalog/services
 */
export async function listAllServices(
  host?: string,
  port?: number,
): Promise<Record<string, string[]>> {
  const url = buildUrl('/v1/catalog/services', host, port);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to list services: ${response.status}`);
  }

  const data = await response.json() as Record<string, string[]>;
  return data;
}

/**
 * Get health checks for a service
 * GET /v1/health/checks/:serviceName
 */
export async function getHealthChecks(
  serviceName: string,
  host?: string,
  port?: number,
): Promise<Array<{ Status: string }>> {
  const url = buildUrl(`/v1/health/checks/${serviceName}`, host, port);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to get health checks for ${serviceName}: ${response.status}`);
  }

  const checks = await response.json() as Array<{ Status: string }>;
  return checks;
}
