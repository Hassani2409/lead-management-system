Lead Management System - Scraper Integration

Setup
- Requires Python 3.12
- Install dev tools: pip install -r requirements if present; for tests: pip install pytest pandas

Directories
- lead-management-app/src/data/leads.json: main leads database (JSON array)
- scraper_results/: normalized scraper outputs (CSV/JSON)
- google_maps_scraper/: raw Google Maps CSV and parser
- live_scraper_results/, ki_automation_leads/: optional sources

Commands
- Parse Google Maps CSV to normalized JSON:
  python -m google_maps_scraper.parser
  Input: google_maps_scraper/results.csv
  Output: scraper_results/google_maps_normalized.json

- Auto integrate into leads.json:
  python auto_lead_integration.py

Testing (CI)
- GitHub Actions runs pytest (tests/). Local:
  pytest -q

Notes
- Normalization: lowercase, trim for name/address/website/phone
- Deduplication: by (name, address)
- Error handling included for parser and integration
