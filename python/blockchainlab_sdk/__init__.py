"""Blockchain Lab SDK — typed Python client for the Blockchain Lab Open Data API.

Built by Blockchain Lab — https://blockchainlab.com . Standard library only (urllib), Python 3.9+.
"""
from __future__ import annotations
import json, time, urllib.request, warnings
from typing import Any, Dict, List, Optional
from .datasets import DATASETS, SCHEMA_VERSION
from . import types

__all__ = ["BlockchainLab", "DATASETS", "SCHEMA_VERSION", "types", "DEFAULT_BASE"]
__version__ = "1.1.0"
DEFAULT_BASE = "https://blockchains.github.io/blockchainlab-api"


class BlockchainLab:
    def __init__(self, base_url: str = DEFAULT_BASE, cache_ttl: float = 600.0, timeout: float = 30.0) -> None:
        self.base_url = base_url.rstrip("/"); self.cache_ttl = cache_ttl; self.timeout = timeout
        self._cache: Dict[str, Any] = {}

    def _get(self, path: str) -> Any:
        hit = self._cache.get(path)
        if hit and time.time() - hit[0] < self.cache_ttl:
            return hit[1]
        req = urllib.request.Request(self.base_url + path, headers={"user-agent": f"blockchainlab-sdk-python/{__version__}"})
        with urllib.request.urlopen(req, timeout=self.timeout) as r:
            value = json.load(r)
        self._cache[path] = (time.time(), value)
        return value

    def catalogue(self) -> Dict[str, Any]:
        return self._get("/v1/index.json")

    def dataset(self, name: str) -> Dict[str, Any]:
        if name not in DATASETS:
            raise KeyError(f"unknown dataset {name!r}; known: {', '.join(DATASETS)}")
        d = self._get(f"/v1/{name}.json")
        sv = d.get("schema_version")
        if sv and SCHEMA_VERSION and sv.split(".")[0] != SCHEMA_VERSION.split(".")[0]:
            warnings.warn(f"server schema {sv} vs SDK {SCHEMA_VERSION}; upgrade blockchainlab-sdk")
        return d

    def rows(self, name: str) -> List[Dict[str, Any]]:
        return self.dataset(name)["data"]

    # typed convenience helpers
    def chains(self) -> "types.ChainsRows": return self.rows("chains")  # type: ignore[return-value]
    def stablecoins(self) -> "types.StablecoinsRows": return self.rows("stablecoins")  # type: ignore[return-value]
    def yields(self) -> "types.YieldsRows": return self.rows("yields")  # type: ignore[return-value]
    def l2_metrics(self) -> "types.L2MetricsRows": return self.rows("l2-metrics")  # type: ignore[return-value]
    def security_incidents(self) -> "types.SecurityIncidentsRows": return self.rows("security-incidents")  # type: ignore[return-value]

    def chain(self, chain_id: int) -> "Optional[types.ChainsRow]":
        return next((c for c in self.chains() if c.get("chainId") == chain_id), None)

    def stablecoin(self, symbol: str) -> "Optional[types.StablecoinsRow]":
        return next((s for s in self.stablecoins() if (s.get("symbol") or "").lower() == symbol.lower()), None)

    def top_yields(self, stablecoin_only: bool = False, chain: Optional[str] = None, limit: int = 20) -> "List[types.YieldsRow]":
        ys = [y for y in self.yields() if (not stablecoin_only or y.get("stablecoin")) and (not chain or y.get("chain") == chain)]
        return sorted(ys, key=lambda y: y.get("apy") or 0, reverse=True)[:limit]

    def l2(self, id_or_name: str) -> "Optional[types.L2MetricsRow]":
        q = id_or_name.lower()
        return next((l for l in self.l2_metrics() if l.get("id") == q or (l.get("name") or "").lower() == q), None)

    def is_sanctioned(self, address: str) -> bool:
        a = address.lower()
        return any((x.get("address") or "").lower() == a for x in self.rows("sanctioned-addresses"))

    def healthy_rpcs(self, chain: str) -> List[Dict[str, Any]]:
        return sorted([r for r in self.rows("rpc-health") if r.get("chain") == chain and r.get("healthy")], key=lambda r: r.get("latency_ms") or 1e9)

    def incidents(self, since: Optional[str] = None, min_usd: float = 0) -> "List[types.SecurityIncidentsRow]":
        return [i for i in self.security_incidents() if (not since or (i.get("date") or "") >= since) and (i.get("amount_usd") or 0) >= min_usd]

    def eip(self, n: int) -> Optional[Dict[str, Any]]:
        return next((e for e in self.rows("eips") + self.rows("ercs") if e.get("number") == n), None)
