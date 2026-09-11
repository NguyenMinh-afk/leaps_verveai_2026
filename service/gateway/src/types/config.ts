export interface GatewayConfig {
  http: {
    port: number;
  };
  apiEndpoints: Record<string, { paths: string[] }>;
  serviceEndpoints: Record<string, { url: string }>;
  pipelines: Record<string, { apiEndpoints: string[]; policies: string[] }>;
}
