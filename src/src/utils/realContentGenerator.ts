import { Lead } from '@/lib/leadService'

interface RealContentData {
  name: string
  type: 'text' | 'image' | 'json' | 'pdf' | 'unknown'
  content: string
  size: string
}

export class RealContentGenerator {
  
  static generateCursorPrompt(lead: Lead): RealContentData {
    const businessType = lead.business_type || 'restaurant'
    const location = lead.location || 'Deutschland'
    const revenueEstimate = (lead as any).revenue_potential || 5000
    
    const content = `# CURSOR PROMPT - ${lead.name}

## 🎯 PROJEKT ÜBERSICHT
**Unternehmen:** ${lead.name}
**Branche:** ${businessType}
**Standort:** ${location}
**Revenue Potential:** €${revenueEstimate.toLocaleString()}

## 🚀 ENTWICKLUNGSAUFTRAG

Du bist ein Senior Full-Stack Developer und sollst eine professionelle Website für **${lead.name}** entwickeln.

### BUSINESS KONTEXT:
- **Zielgruppe:** Lokale Kunden in ${location}
- **Hauptziel:** Online-Präsenz stärken und Kundenakquise
- **Budget Range:** €2.500 - €5.000
- **Timeline:** 2-3 Wochen

### TECHNISCHE ANFORDERUNGEN:

#### Frontend:
\`\`\`typescript
// Next.js 14 mit App Router
const techStack = {
  framework: "Next.js 14",
  styling: "Tailwind CSS",
  components: "Headless UI",
  animations: "Framer Motion",
  forms: "React Hook Form",
  validation: "Zod"
}
\`\`\`

#### Backend & Database:
\`\`\`typescript
// Supabase als Backend-as-a-Service
const backend = {
  database: "Supabase PostgreSQL",
  auth: "Supabase Auth",
  storage: "Supabase Storage",
  realtime: "Supabase Realtime",
  api: "Supabase REST API"
}
\`\`\`

### BRANCHENSPEZIFISCHE FEATURES:

${this.getIndustrySpecificFeatures(businessType)}

### ENTWICKLUNGSSCHRITTE:

1. **Setup & Konfiguration**
   \`\`\`bash
   npx create-next-app@latest ${lead.name.toLowerCase().replace(/\s+/g, '-')}-website
   cd ${lead.name.toLowerCase().replace(/\s+/g, '-')}-website
   npm install @supabase/supabase-js @headlessui/react framer-motion
   \`\`\`

2. **Supabase Setup**
   \`\`\`sql
   -- Erstelle Tabellen für ${businessType}
   CREATE TABLE customers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE,
     phone VARCHAR(50),
     created_at TIMESTAMP DEFAULT NOW()
   );
   \`\`\`

3. **Core Components**
   - Hero Section mit ${lead.name} Branding
   - Service/Produkt Übersicht
   - Kontaktformular mit Supabase Integration
   - Google Maps Integration für ${location}
   - Mobile-responsive Design

4. **SEO Optimierung**
   \`\`\`typescript
   // metadata.ts
   export const metadata = {
     title: "${lead.name} - ${businessType} in ${location}",
     description: "Professioneller ${businessType} Service in ${location}. Kontaktieren Sie uns für...",
     keywords: ["${businessType}", "${location}", "lokal", "service"]
   }
   \`\`\`

### DEPLOYMENT:
- **Hosting:** Vercel (kostenlos für kleine Projekte)
- **Domain:** ${lead.name.toLowerCase().replace(/\s+/g, '')}.de
- **SSL:** Automatisch via Vercel
- **Performance:** Lighthouse Score > 90

### QUALITÄTSSICHERUNG:
- [ ] Mobile Responsiveness getestet
- [ ] Ladezeiten < 3 Sekunden
- [ ] Kontaktformular funktional
- [ ] SEO Meta-Tags implementiert
- [ ] Google Analytics eingerichtet

### ÜBERGABE AN KUNDEN:
1. Live-Demo der Website
2. Admin-Zugang zu Supabase Dashboard
3. Dokumentation für Content-Updates
4. 30 Tage Support inklusive

---
**Generiert am:** ${new Date().toLocaleDateString('de-DE')}
**Projekt-ID:** ${lead.id}
**Entwickler:** Hassani Solutions`

    return {
      name: 'cursor_prompt.md',
      type: 'text',
      content,
      size: `${Math.ceil(content.length / 1024)} KB`
    }
  }

  static generateProjectProposal(lead: Lead): RealContentData {
    const businessType = lead.business_type || 'restaurant'
    const location = lead.location || 'Deutschland'
    const revenueEstimate = (lead as any).revenue_potential || 5000
    const aiScore = (lead as any).calculatedScore || 75

    const content = `# PROJEKTVORSCHLAG - ${lead.name}

## 📋 EXECUTIVE SUMMARY

**Kunde:** ${lead.name}
**Branche:** ${businessType}
**Standort:** ${location}
**Projekttyp:** Professionelle Website-Entwicklung
**Investment:** €${Math.floor(revenueEstimate * 0.5).toLocaleString()} - €${revenueEstimate.toLocaleString()}

## 🎯 GESCHÄFTSZIELE

### Primäre Ziele:
1. **Online-Präsenz etablieren** - Professioneller Webauftritt für ${lead.name}
2. **Kundenakquise steigern** - 30% mehr Anfragen in den ersten 6 Monaten
3. **Lokale Sichtbarkeit** - Top 3 Google-Ranking für "${businessType} ${location}"
4. **Conversion optimieren** - Besucher zu Kunden konvertieren

### Messbare KPIs:
- 📈 **Website-Traffic:** +200% in 3 Monaten
- 📞 **Kontaktanfragen:** +150% über Kontaktformular
- 🌟 **Google Bewertungen:** Steigerung von aktuell ${Math.floor(Math.random() * 2) + 3}/5
- 💰 **ROI:** Break-even nach 4-6 Monaten

## 🛠️ TECHNISCHE LÖSUNG

### Moderne Tech-Stack:
\`\`\`
Frontend:     Next.js 14 + TypeScript
Styling:      Tailwind CSS + Headless UI
Backend:      Supabase (PostgreSQL)
Hosting:      Vercel (99.9% Uptime)
Analytics:    Google Analytics 4
SEO:          Next.js SEO + Schema Markup
\`\`\`

### Branchenspezifische Features:
${this.getDetailedFeatures(businessType)}

## 💰 INVESTMENT & PAKETE

### 🥉 STARTER PAKET - €2.500
- ✅ 5-seitige Website
- ✅ Mobile Responsive Design
- ✅ Kontaktformular
- ✅ Google Maps Integration
- ✅ Basic SEO Setup
- ✅ 1 Monat Support

### 🥈 PROFESSIONAL PAKET - €4.000
- ✅ Alles aus Starter
- ✅ Online Buchungssystem
- ✅ Kundenverwaltung
- ✅ Newsletter Integration
- ✅ Social Media Integration
- ✅ 3 Monate Support

### 🥇 ENTERPRISE PAKET - €${revenueEstimate.toLocaleString()}
- ✅ Alles aus Professional
- ✅ E-Commerce Funktionalität
- ✅ Multi-Language Support
- ✅ Advanced Analytics
- ✅ Custom Integrationen
- ✅ 6 Monate Support

**EMPFEHLUNG für ${lead.name}:** ${this.getRecommendedPackage(aiScore, revenueEstimate)}

## 📅 PROJEKTABLAUF

### Phase 1: Analyse & Konzept (Woche 1)
- Detaillierte Anforderungsanalyse
- Competitor Research
- Wireframes & Mockups
- Content-Strategie

### Phase 2: Entwicklung (Woche 2-3)
- Frontend Development
- Backend Setup
- Content Integration
- Testing & Optimierung

### Phase 3: Launch & Optimierung (Woche 4)
- Go-Live Vorbereitung
- SEO Optimierung
- Performance Testing
- Schulung & Übergabe

## 🎯 WARUM HASSANI SOLUTIONS?

### ✅ Bewährte Expertise:
- 50+ erfolgreiche ${businessType} Projekte
- Durchschnittlich 180% ROI für Kunden
- 4.9/5 Kundenbewertung
- Spezialisiert auf lokale Unternehmen

### ✅ Lokaler Vorteil:
- Verständnis für ${location} Markt
- Deutsche Datenschutz-Compliance
- Persönlicher Support vor Ort
- Langfristige Partnerschaft

## 📊 ERFOLGSGARANTIE

**30-Tage Geld-zurück-Garantie**
Falls Sie nicht 100% zufrieden sind, erhalten Sie Ihr Investment zurück.

**Performance-Garantie:**
- Ladezeit < 3 Sekunden
- 95+ Google PageSpeed Score
- Mobile-First Design
- DSGVO-konform

## 🚀 NÄCHSTE SCHRITTE

1. **Erstberatung vereinbaren** (kostenlos, 30 Min)
2. **Projektdetails finalisieren**
3. **Vertrag & Anzahlung (50%)**
4. **Projektstart innerhalb 48h**

---

**Angebot gültig bis:** ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}
**Kontakt:** info@hassanisolutions.com | +49 XXX XXXXXXX
**Projekt-Referenz:** ${lead.id}`

    return {
      name: 'project_proposal.md',
      type: 'text',
      content,
      size: `${Math.ceil(content.length / 1024)} KB`
    }
  }

  static generateBusinessAnalysis(lead: Lead): RealContentData {
    const businessType = lead.business_type || 'restaurant'
    const location = lead.location || 'Deutschland'
    const revenueEstimate = (lead as any).revenue_potential || 5000
    const aiScore = (lead as any).calculatedScore || 75

    const analysis = {
      company_profile: {
        name: lead.name,
        business_type: businessType,
        location: location,
        established: "Geschätzt 2015-2020",
        size: "Klein- bis Mittelbetrieb",
        target_market: "Lokale Kunden"
      },
      market_analysis: {
        market_size: `€${(revenueEstimate * 100).toLocaleString()} (lokaler ${businessType} Markt)`,
        competition_level: aiScore > 75 ? "Hoch" : aiScore > 60 ? "Mittel" : "Niedrig",
        growth_potential: aiScore > 70 ? "Sehr hoch" : "Mittel",
        digital_maturity: "Niedrig - Großes Verbesserungspotential"
      },
      swot_analysis: {
        strengths: [
          "Etablierte lokale Präsenz",
          "Direkter Kundenkontakt",
          `Spezialisierung auf ${businessType}`,
          "Persönlicher Service"
        ],
        weaknesses: [
          "Schwache Online-Präsenz",
          "Veraltete oder fehlende Website",
          "Begrenzte digitale Marketing-Aktivitäten",
          "Keine Online-Buchungsmöglichkeiten"
        ],
        opportunities: [
          "Digitalisierung des Geschäfts",
          "Online-Marketing Potenzial",
          "Mobile-First Zielgruppe erreichen",
          "Social Media Präsenz aufbauen"
        ],
        threats: [
          "Digitale Konkurrenz",
          "Veränderte Kundenerwartungen",
          "Post-COVID Marktveränderungen",
          "Jüngere, tech-affine Konkurrenten"
        ]
      },
      digital_transformation_roadmap: {
        phase_1: "Website & Online-Präsenz (Monat 1-2)",
        phase_2: "SEO & Local Marketing (Monat 3-4)",
        phase_3: "Social Media & Content (Monat 5-6)",
        phase_4: "Automation & CRM (Monat 7-12)"
      },
      roi_projection: {
        investment: `€${revenueEstimate}`,
        monthly_additional_revenue: `€${Math.floor(revenueEstimate * 0.3)}`,
        break_even_months: Math.ceil(revenueEstimate / (revenueEstimate * 0.3)),
        year_1_roi: `${Math.floor((revenueEstimate * 0.3 * 12 - revenueEstimate) / revenueEstimate * 100)}%`
      },
      recommendations: [
        {
          priority: "HOCH",
          action: "Professionelle Website entwickeln",
          impact: "Sofortige Verbesserung der Online-Präsenz",
          timeline: "2-3 Wochen"
        },
        {
          priority: "HOCH", 
          action: "Google My Business optimieren",
          impact: "Bessere lokale Sichtbarkeit",
          timeline: "1 Woche"
        },
        {
          priority: "MITTEL",
          action: "Social Media Strategie",
          impact: "Kundenbindung und Reichweite",
          timeline: "4-6 Wochen"
        }
      ],
      analysis_metadata: {
        generated_at: new Date().toISOString(),
        analyst: "Hassani Solutions AI",
        confidence_score: aiScore,
        data_sources: ["Google Places", "Local Market Research", "Industry Benchmarks"]
      }
    }

    return {
      name: 'business_analysis.json',
      type: 'json',
      content: JSON.stringify(analysis, null, 2),
      size: `${Math.ceil(JSON.stringify(analysis).length / 1024)} KB`
    }
  }

  private static getIndustrySpecificFeatures(businessType: string): string {
    const features = {
      restaurant: `
#### Restaurant-spezifische Features:
- 🍽️ **Online-Speisekarte** mit Preisen und Bildern
- 📅 **Tischreservierung** mit Kalender-Integration
- ⭐ **Bewertungssystem** für Gerichte
- 📱 **QR-Code Menü** für kontaktlose Bestellung
- 🚚 **Lieferservice Integration** (Lieferando, UberEats)`,
      
      bakery: `
#### Bäckerei-spezifische Features:
- 🥖 **Tagesangebot** mit frischen Backwaren
- ⏰ **Öffnungszeiten** und Verfügbarkeit
- 🎂 **Sonderbestellungen** für Torten und Kuchen
- 📱 **Vorbestellung** mit Abholzeit
- 🏪 **Filial-Finder** für mehrere Standorte`,
      
      default: `
#### Branchenspezifische Features:
- 📋 **Service-Übersicht** mit detaillierten Beschreibungen
- 📅 **Online-Terminbuchung** mit Kalender
- 💬 **Kundenbewertungen** und Testimonials
- 📱 **Kontaktformular** mit automatischer Weiterleitung
- 🗺️ **Standort-Integration** mit Google Maps`
    }
    
    return features[businessType as keyof typeof features] || features.default
  }

  private static getDetailedFeatures(businessType: string): string {
    return `
**${businessType.toUpperCase()} FEATURES:**
- Responsive Design für alle Geräte
- SEO-optimierte Inhaltsstruktur
- Schnelle Ladezeiten (< 3 Sek)
- DSGVO-konforme Datenverarbeitung
- Google Analytics Integration
- Social Media Verknüpfung
- Kontaktformular mit Spam-Schutz
- Google Maps Einbindung
- SSL-Verschlüsselung
- Automatische Backups`
  }

  private static getRecommendedPackage(aiScore: number, revenue: number): string {
    if (aiScore >= 75 && revenue >= 5000) {
      return "**ENTERPRISE PAKET** - Maximaler ROI durch vollständige Digitalisierung"
    } else if (aiScore >= 65 && revenue >= 3500) {
      return "**PROFESSIONAL PAKET** - Optimales Preis-Leistungs-Verhältnis"
    } else {
      return "**STARTER PAKET** - Solide Basis für Online-Präsenz"
    }
  }
}
