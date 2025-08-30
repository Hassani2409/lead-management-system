#!/usr/bin/env python3
"""
Lead Scoring Application Script
Wendet das intelligente Scoring-System auf alle Leads an
"""

import json
import logging
from datetime import datetime
from pathlib import Path

# Logging Setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LeadScoringApplicator:
    """Wendet Lead-Scoring auf alle Leads an"""

    def __init__(self):
        self.project_root = Path(__file__).parent
        self.leads_file = self.project_root / "lead-management-app" / "src" / "data" / "leads.json"

    def calculate_lead_score(self, lead):
        """Python-Version des TypeScript Lead-Scoring-Algorithmus"""

        # Vollständigkeits-Score
        completeness = 0
        if lead.get("name", "").strip():
            completeness += 20
        if lead.get("email", "") and "@" in lead.get("email", ""):
            completeness += 25
        if lead.get("phone", "").strip():
            completeness += 20
        if lead.get("website", "") and (
            "http" in lead.get("website", "") or "." in lead.get("website", "")
        ):
            completeness += 20
        if lead.get("location", "").strip():
            completeness += 10
        if lead.get("business_type", "").strip():
            completeness += 5
        completeness = min(completeness, 100)

        # Verifizierungs-Score
        verification = 0
        if lead.get("verified", False):
            verification += 80
        if lead.get("ai_score", 0) > 0:
            verification += min(lead.get("ai_score", 0) / 10, 20)
        if lead.get("quality_score", 0) > 0:
            verification = max(verification, lead.get("quality_score", 0))
        verification = min(verification, 100)

        # Business-Wert-Score
        business_value = 40  # Basis-Score
        business_type = lead.get("business_type", "").lower()

        high_value_types = [
            "restaurant",
            "hotel",
            "retail",
            "technology",
            "software",
            "consulting",
            "finance",
            "healthcare",
            "real estate",
            "automotive",
        ]
        medium_value_types = ["service", "education", "manufacturing", "construction", "transport"]

        if any(t in business_type for t in high_value_types):
            business_value += 40
        elif any(t in business_type for t in medium_value_types):
            business_value += 20

        # Revenue Estimate
        if lead.get("revenue_estimate", 0) > 0:
            revenue = lead.get("revenue_estimate", 0)
            if revenue > 1000000:
                business_value += 20
            elif revenue > 500000:
                business_value += 15
            elif revenue > 100000:
                business_value += 10
            else:
                business_value += 5

        # Premium Brands
        name = lead.get("name", "").lower()
        premium_brands = [
            "hyatt",
            "hilton",
            "marriott",
            "sofitel",
            "adina",
            "mercedes",
            "bmw",
            "audi",
            "porsche",
            "michelin",
            "gault",
            "millau",
        ]
        if any(brand in name for brand in premium_brands):
            business_value += 20

        business_value = min(business_value, 100)

        # Standort-Score
        location_score = 50
        location = lead.get("location", "").lower()

        premium_cities = [
            "berlin",
            "münchen",
            "hamburg",
            "köln",
            "frankfurt",
            "düsseldorf",
            "stuttgart",
            "dortmund",
            "essen",
            "leipzig",
        ]
        good_cities = [
            "hannover",
            "dresden",
            "nürnberg",
            "duisburg",
            "bochum",
            "wuppertal",
            "bielefeld",
            "bonn",
            "münster",
            "karlsruhe",
        ]

        if any(city in location for city in premium_cities):
            location_score += 40
        elif any(city in location for city in good_cities):
            location_score += 20

        # Premium Bezirke Berlin
        premium_districts = [
            "mitte",
            "charlottenburg",
            "wilmersdorf",
            "schöneberg",
            "prenzlauer berg",
            "friedrichshain",
            "kreuzberg",
        ]
        if any(district in location for district in premium_districts):
            location_score += 10

        location_score = min(location_score, 100)

        # Quellen-Score
        source_score = 50
        source = lead.get("source", "").lower()

        if "working_lead_scraper" in source:
            source_score += 30
        elif "crawl4ai" in source:
            source_score += 25
        elif "playwright" in source:
            source_score += 20
        elif "google_maps" in source:
            source_score += 15
        elif "manual" in source or "verified" in source:
            source_score += 40

        if lead.get("auto_integrated", False):
            source_score += 10
        source_score = min(source_score, 100)

        # Aktualitäts-Score
        freshness_score = 50
        if lead.get("created_at"):
            try:
                created_date = datetime.fromisoformat(lead["created_at"].replace("Z", "+00:00"))
                days_diff = (datetime.now() - created_date.replace(tzinfo=None)).days

                if days_diff <= 1:
                    freshness_score = 100
                elif days_diff <= 7:
                    freshness_score = 90
                elif days_diff <= 30:
                    freshness_score = 70
                elif days_diff <= 90:
                    freshness_score = 50
                elif days_diff <= 180:
                    freshness_score = 30
                else:
                    freshness_score = 10
            except Exception:
                freshness_score = 50

        # Gewichtete Berechnung
        weights = {
            "completeness": 0.25,
            "verification": 0.20,
            "business_value": 0.25,
            "location": 0.10,
            "source": 0.10,
            "freshness": 0.10,
        }

        total_score = (
            completeness * weights["completeness"]
            + verification * weights["verification"]
            + business_value * weights["business_value"]
            + location_score * weights["location"]
            + source_score * weights["source"]
            + freshness_score * weights["freshness"]
        )

        return {
            "total_score": round(min(total_score, 100)),
            "factors": {
                "completeness": round(completeness),
                "verification": round(verification),
                "business_value": round(business_value),
                "location": round(location_score),
                "source": round(source_score),
                "freshness": round(freshness_score),
            },
        }

    def categorize_lead_by_score(self, score):
        """Kategorisiert Lead basierend auf Score"""

        if score >= 80:
            return {"category": "hot", "label": "Hot Lead", "color": "#ef4444", "priority": 1}
        elif score >= 60:
            return {"category": "warm", "label": "Warm Lead", "color": "#f97316", "priority": 2}
        elif score >= 40:
            return {"category": "cold", "label": "Cold Lead", "color": "#3b82f6", "priority": 3}
        else:
            return {"category": "poor", "label": "Poor Lead", "color": "#6b7280", "priority": 4}

    def apply_scoring_to_all_leads(self):
        """Wendet Scoring auf alle Leads an"""

        logger.info("🧠 Applying intelligent lead scoring...")

        # Lade Leads
        if not self.leads_file.exists():
            logger.error("❌ Leads file not found")
            return False

        with open(self.leads_file, encoding="utf-8") as f:
            leads = json.load(f)

        logger.info(f"📊 Processing {len(leads)} leads...")

        # Wende Scoring an
        scored_leads = []
        score_distribution = {"hot": 0, "warm": 0, "cold": 0, "poor": 0}

        for lead in leads:
            # Berechne Score
            scoring_result = self.calculate_lead_score(lead)
            category = self.categorize_lead_by_score(scoring_result["total_score"])

            # Aktualisiere Lead
            lead.update(
                {
                    "calculated_score": scoring_result["total_score"],
                    "score_category": category["category"],
                    "score_label": category["label"],
                    "score_priority": category["priority"],
                    "scoring_factors": scoring_result["factors"],
                    "scoring_updated": datetime.now().isoformat(),
                }
            )

            scored_leads.append(lead)
            score_distribution[category["category"]] += 1

        # Speichere aktualisierte Leads
        with open(self.leads_file, "w", encoding="utf-8") as f:
            json.dump(scored_leads, f, indent=2, ensure_ascii=False)

        # Statistiken
        avg_score = sum(lead["calculated_score"] for lead in scored_leads) / len(scored_leads)

        logger.info("✅ Lead scoring completed!")
        logger.info(f"📈 Average Score: {avg_score:.1f}")
        logger.info(f"🔥 Hot Leads: {score_distribution['hot']}")
        logger.info(f"🌡️ Warm Leads: {score_distribution['warm']}")
        logger.info(f"❄️ Cold Leads: {score_distribution['cold']}")
        logger.info(f"📉 Poor Leads: {score_distribution['poor']}")

        return True

    def generate_scoring_report(self):
        """Erstellt Scoring-Bericht"""

        with open(self.leads_file, encoding="utf-8") as f:
            leads = json.load(f)

        # Top Leads
        top_leads = sorted(leads, key=lambda x: x.get("calculated_score", 0), reverse=True)[:10]

        hot_count = len(
            [lead_item for lead_item in leads if lead_item.get("calculated_score", 0) >= 80]
        )
        warm_count = len(
            [lead_item for lead_item in leads if 60 <= lead_item.get("calculated_score", 0) < 80]
        )
        cold_count = len(
            [lead_item for lead_item in leads if 40 <= lead_item.get("calculated_score", 0) < 60]
        )
        poor_count = len(
            [lead_item for lead_item in leads if lead_item.get("calculated_score", 0) < 40]
        )

        report = f"""# 🧠 LEAD SCORING REPORT
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 📊 Overview
- **Total Leads:** {len(leads)}
- **Average Score:** {sum(lead.get('calculated_score', 0) for lead in leads) / len(leads):.1f}

## 🎯 Score Distribution
- **Hot Leads (80+):** {hot_count}
- **Warm Leads (60-79):** {warm_count}
- **Cold Leads (40-59):** {cold_count}
- **Poor Leads (<40):** {poor_count}

## 🏆 Top 10 Leads
"""

        for i, lead in enumerate(top_leads, 1):
            score = lead.get("calculated_score", 0)
            category = lead.get("score_label", "Unknown")
            report += f"{i}. **{lead['name']}** - Score: {score} ({category})\n"

        report += """
## 🎯 Recommendations
1. **Immediate Action:** Contact all Hot Leads (80+ score) immediately
2. **This Week:** Reach out to Warm Leads (60-79 score)
3. **Next Month:** Qualify Cold Leads (40-59 score)
4. **Review:** Consider archiving Poor Leads (<40 score)

## 📈 Scoring Factors
The scoring system evaluates leads based on:
- **Completeness (25%):** Data completeness and quality
- **Verification (20%):** Verified status and AI scores
- **Business Value (25%):** Industry type and revenue potential
- **Location (10%):** Geographic premium locations
- **Source (10%):** Data source quality and reliability
- **Freshness (10%):** How recent the lead data is
"""

        report_file = self.project_root / "LEAD_SCORING_REPORT.md"
        with open(report_file, "w", encoding="utf-8") as f:
            f.write(report)

        logger.info(f"📋 Scoring report saved: {report_file}")
        return report_file


def main():
    """Hauptfunktion"""

    applicator = LeadScoringApplicator()

    print("🧠 INTELLIGENT LEAD SCORING SYSTEM")
    print("=" * 50)
    print("Applying advanced scoring algorithm to all leads...")
    print("=" * 50)

    # Wende Scoring an
    success = applicator.apply_scoring_to_all_leads()

    if success:
        # Erstelle Bericht
        report_file = applicator.generate_scoring_report()

        print("\n" + "=" * 50)
        print("✅ LEAD SCORING COMPLETE!")
        print("=" * 50)
        print("🎯 All leads now have intelligent scores")
        print("📊 Scoring factors calculated for each lead")
        print("🏆 Top leads identified for immediate action")
        print(f"📋 Detailed report: {report_file.name}")
        print("🚀 Lead Management App updated with scores!")
    else:
        print("\n❌ Lead scoring failed. Check logs for details.")


if __name__ == "__main__":
    main()
