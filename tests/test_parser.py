from pathlib import Path

from google_maps_scraper.parser import parse_google_maps_csv


def test_parse_google_maps_csv(tmp_path: Path):
    csv_content = """Name,Address,Website,Phone
Hotel One,Street 1,https://one.example,+49 30 111
Hotel Two,Street 2,https://two.example,+49 30 222
Hotel Three,Street 3,https://three.example,+49 30 333
Hotel Four,Street 4,https://four.example,+49 30 444
Hotel Five,Street 5,https://five.example,+49 30 555
"""
    csv_path = tmp_path / "gmaps.csv"
    csv_path.write_text(csv_content, encoding="utf-8")

    items = parse_google_maps_csv(csv_path)
    assert isinstance(items, list)
    assert len(items) == 5
    first = items[0]
    assert first["name"] == "hotel one"
    assert first["address"] == "street 1"
    assert first["website"] == "https://one.example"
    assert first["phone"] == "+49 30 111"
