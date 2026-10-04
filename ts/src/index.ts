// Blockchain Lab SDK — typed client for the Blockchain Lab Open Data API.
// Built by Blockchain Lab — https://blockchainlab.com
import { DATASETS, SCHEMA_VERSION, type DatasetMap, type DatasetName } from "./datasets.js";
export * from "./types.js";
export { DATASETS, SCHEMA_VERSION };
export type { DatasetMap, DatasetName };

export const DEFAULT_BASE = "https://blockchains.github.io/blockchainlab-api";
export interface ClientOptions { baseUrl?: string; fetch?: typeof fetch; cacheTtlMs?: number; timeoutMs?: number; }
export interface CatalogueEntry { dataset: string; url: string; schema?: string; description: string; source: string; source_url: string; count?: number; generated_at: string; stale?: boolean; }
export interface Catalogue { name: string; version: string; schema_version?: string; generated_at: string; errors: { dataset: string; error: string }[]; datasets: CatalogueEntry[]; }

export class BlockchainLab {
  readonly baseUrl: string; private f: typeof fetch; private ttl: number; private timeout: number;
  private cache = new Map<string, { at: number; value: unknown }>();
  constructor(o: ClientOptions = {}) { this.baseUrl = (o.baseUrl ?? DEFAULT_BASE).replace(/\/$/, ""); this.f = o.fetch ?? globalThis.fetch.bind(globalThis); this.ttl = o.cacheTtlMs ?? 10 * 60_000; this.timeout = o.timeoutMs ?? 20_000; }
  private async get<T>(path: string): Promise<T> {
    const hit = this.cache.get(path); if (hit && Date.now() - hit.at < this.ttl) return hit.value as T;
    const r = await this.f(`${this.baseUrl}${path}`, { signal: AbortSignal.timeout(this.timeout) });
    if (!r.ok) throw new Error(`Blockchain Lab API ${r.status} for ${path}`);
    const v = (await r.json()) as T; this.cache.set(path, { at: Date.now(), value: v }); return v;
  }
  /** Dataset catalogue with counts, sources and build time. */
  catalogue(): Promise<Catalogue> { return this.get<Catalogue>("/v1/index.json"); }
  /** Fetch any dataset, fully typed by name. Warns if the server's schema major version differs from this SDK's. */
  async dataset<N extends DatasetName>(name: N): Promise<DatasetMap[N]> {
    const d = await this.get<DatasetMap[N]>(`/v1/${name}.json`);
    const sv = (d as { schema_version?: string }).schema_version;
    if (sv && SCHEMA_VERSION && sv.split(".")[0] !== SCHEMA_VERSION.split(".")[0]) console.warn(`[blockchainlab-sdk] server schema ${sv} vs SDK ${SCHEMA_VERSION}; upgrade the SDK`);
    return d;
  }
  /** Rows only. */
  async rows<N extends DatasetName>(name: N): Promise<DatasetMap[N]["data"]> { return (await this.dataset(name)).data; }
  // Convenience helpers
  async chain(chainId: number) { return (await this.rows("chains")).find(c => c.chainId === chainId) ?? null; }
  async stablecoin(symbol: string) { return (await this.rows("stablecoins")).find(s => s.symbol?.toLowerCase() === symbol.toLowerCase()) ?? null; }
  async topYields(opts: { stablecoinOnly?: boolean; chain?: string; limit?: number } = {}) { return (await this.rows("yields")).filter(y => (!opts.stablecoinOnly || y.stablecoin) && (!opts.chain || y.chain === opts.chain)).sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0)).slice(0, opts.limit ?? 20); }
  async l2(idOrName: string) { const q = idOrName.toLowerCase(); return (await this.rows("l2-metrics")).find(l => l.id === q || l.name?.toLowerCase() === q) ?? null; }
  async isSanctioned(address: string) { const a = address.toLowerCase(); return (await this.rows("sanctioned-addresses")).some(x => x.address?.toLowerCase() === a); }
  async healthyRpcs(chain: string) { return (await this.rows("rpc-health")).filter(r => r.chain === chain && r.healthy).sort((a, b) => (a.latency_ms ?? 1e9) - (b.latency_ms ?? 1e9)); }
  async incidents(opts: { since?: string; minUsd?: number } = {}) { return (await this.rows("security-incidents")).filter(i => (!opts.since || (i.date ?? "") >= opts.since) && (!opts.minUsd || (i.amount_usd ?? 0) >= opts.minUsd)); }
  async eip(n: number) { return (await this.rows("eips")).find(e => e.number === n) ?? (await this.rows("ercs")).find(e => e.number === n) ?? null; }
}
export default BlockchainLab;
