from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pandas as pd


def _normalize_str(val: str | None) -> str:
    if val is None:
        return ""
    return str(val).strip().lower()


def parse_google_maps_csv(csv_path: Path) -> list[dict[str, Any]]:
    df = pd.read_csv(csv_path)
    cols = {str(c).lower().strip(): c for c in df.columns}
    name_col = cols.get("name")
    address_col = cols.get("address")
    website_col = cols.get("website") or cols.get("site") or cols.get("url")
    phone_col = cols.get("phone") or cols.get("telephone") or cols.get("tel")

    if not name_col or not address_col:
        raise ValueError("CSV must contain at least Name and Address columns")

    out: list[dict[str, Any]] = []
    for _, row in df.iterrows():
        name = _normalize_str(row.get(name_col))
        address = _normalize_str(row.get(address_col))
        website = _normalize_str(row.get(website_col)) if website_col else ""
        phone = _normalize_str(row.get(phone_col)) if phone_col else ""
        if not name or not address:
            continue
        out.append(
            {
                "name": name,
                "address": address,
                "website": website,
                "phone": phone,
                "source": "google_maps_csv",
            }
        )
    return out


def main():
    repo_root = Path(__file__).resolve().parents[1]
    csv_path = repo_root / "google_maps_scraper" / "results.csv"
    output_dir = repo_root / "scraper_results"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "google_maps_normalized.json"

    if not csv_path.exists():
        print(f"No CSV found at {csv_path}")
        return

    try:
        data = parse_google_maps_csv(csv_path)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Wrote {len(data)} normalized leads to {output_path}")
    except Exception as e:
        print(f"Error parsing CSV: {e}")


if __name__ == "__main__":
    main()
