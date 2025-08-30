from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any

import pandas as pd

REPO_ROOT = Path(__file__).parent
APP_LEADS = REPO_ROOT / "lead-management-app" / "src" / "data" / "leads.json"
SCRAPER_RESULTS = REPO_ROOT / "scraper_results"


def _normalize_str(s: Any) -> str:
    if s is None:
        return ""
    return str(s).strip().lower()


def _load_leads_db() -> list[dict[str, Any]]:
    if not APP_LEADS.exists():
        APP_LEADS.parent.mkdir(parents=True, exist_ok=True)
        APP_LEADS.write_text("[]", encoding="utf-8")
        return []
    with open(APP_LEADS, encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return []


def _save_leads_db(leads: list[dict[str, Any]]) -> None:
    with open(APP_LEADS, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)


def _signature(lead: dict[str, Any]) -> tuple[str, str]:
    return _normalize_str(lead.get("name")), _normalize_str(lead.get("address"))


def _dedupe(
    existing: list[dict[str, Any]], new_items: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    seen = {_signature(item) for item in existing}
    out: list[dict[str, Any]] = []
    for it in new_items:
        sig = _signature(it)
        if not sig[0] or not sig[1]:
            continue
        if sig in seen:
            continue
        seen.add(sig)
        out.append(it)
    return out


def _normalize_record(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "name": _normalize_str(item.get("name")),
        "address": _normalize_str(item.get("address")),
        "website": _normalize_str(item.get("website")),
        "phone": _normalize_str(item.get("phone")),
        "source": _normalize_str(item.get("source") or "scraper_results"),
        "auto_integrated": True,
    }


def _load_json_file(p: Path) -> list[dict[str, Any]]:
    with open(p, encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict):
        data = data.get("items", [])
    if not isinstance(data, list):
        return []
    return [_normalize_record(d) for d in data]


def _load_csv_file(p: Path) -> list[dict[str, Any]]:
    try:
        df = pd.read_csv(p)
    except Exception:
        with open(p, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
        return [_normalize_record(r) for r in rows]
    rows = df.to_dict(orient="records")
    return [_normalize_record(r) for r in rows]


def integrate_from_scraper_results(limit: int | None = None) -> int:
    SCRAPER_RESULTS.mkdir(parents=True, exist_ok=True)
    files = list(SCRAPER_RESULTS.glob("*.json")) + list(SCRAPER_RESULTS.glob("*.csv"))
    items: list[dict[str, Any]] = []
    for p in files:
        try:
            if p.suffix.lower() == ".json":
                items.extend(_load_json_file(p))
            elif p.suffix.lower() == ".csv":
                items.extend(_load_csv_file(p))
        except Exception:
            continue
    if limit is not None:
        items = items[:limit]

    db = _load_leads_db()
    new_items = _dedupe(db, items)
    if not new_items:
        return 0

    merged = db + new_items
    _save_leads_db(merged)
    return len(new_items)


def main():
    count = integrate_from_scraper_results()
    print(f"Integrated {count} new leads into {APP_LEADS}")


if __name__ == "__main__":
    main()
