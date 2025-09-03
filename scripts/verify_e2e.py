import json
from pathlib import Path


def main():
    p = Path("lead-management-app/src/data/leads.json")
    print("Leads file exists:", p.exists())
    data = []
    if p.exists():
        data = json.loads(p.read_text(encoding="utf-8"))
    print("Lead count:", len(data))
    if data:
        print("First lead:", data[0])
    assert len(data) == 5, "Expected 5 leads"
    assert all(
        item.get("auto_integrated") is True for item in data
    ), "auto_integrated flags missing"


if __name__ == "__main__":
    main()
