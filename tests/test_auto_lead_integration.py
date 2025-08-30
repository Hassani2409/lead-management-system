import json
from pathlib import Path


def test_integrate_from_scraper_results(tmp_path: Path, monkeypatch):
    repo_root = tmp_path
    (repo_root / "scraper_results").mkdir(parents=True, exist_ok=True)
    (repo_root / "lead-management-app" / "src" / "data").mkdir(parents=True, exist_ok=True)

    sample = [
        {
            "name": "hotel one",
            "address": "street 1",
            "website": "https://one.example",
            "phone": "",
            "source": "google_maps_csv",
        },
        {
            "name": "hotel two",
            "address": "street 2",
            "website": "https://two.example",
            "phone": "",
            "source": "google_maps_csv",
        },
        {
            "name": "hotel three",
            "address": "street 3",
            "website": "https://three.example",
            "phone": "",
            "source": "google_maps_csv",
        },
        {
            "name": "hotel four",
            "address": "street 4",
            "website": "https://four.example",
            "phone": "",
            "source": "google_maps_csv",
        },
        {
            "name": "hotel five",
            "address": "street 5",
            "website": "https://five.example",
            "phone": "",
            "source": "google_maps_csv",
        },
    ]
    out_path = repo_root / "scraper_results" / "google_maps_normalized.json"
    out_path.write_text(json.dumps(sample, ensure_ascii=False, indent=2), encoding="utf-8")

    import auto_lead_integration as mod

    mod.REPO_ROOT = repo_root
    mod.APP_LEADS = repo_root / "lead-management-app" / "src" / "data" / "leads.json"
    mod.SCRAPER_RESULTS = repo_root / "scraper_results"

    count = mod.integrate_from_scraper_results()

    assert count == 5
    data = json.loads(mod.APP_LEADS.read_text(encoding="utf-8"))
    assert isinstance(data, list) and len(data) == 5
    assert all(item.get("auto_integrated") is True for item in data)
