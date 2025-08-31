'use client'

import { useState, useEffect } from 'react'
import {
  XMarkIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { RealContentGenerator } from '@/utils/realContentGenerator'

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  folderName: string
  folderTitle: string
  leadName: string
  files: string[]
  leadData?: any // Vollständige Lead-Daten für echte Content-Generierung
}

interface FileContent {
  name: string
  type: 'text' | 'image' | 'json' | 'pdf' | 'unknown'
  content: string
  size: string
}

export default function DocumentViewer({
  isOpen,
  onClose,
  folderName,
  folderTitle,
  leadName,
  files,
  leadData
}: DocumentViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<FileContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)

  // Real content generator based on actual lead data
  const generateRealContent = (fileName: string): FileContent => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    // Create mock lead object if leadData is not available
    const lead = leadData || {
      id: 'mock-id',
      name: leadName,
      business_type: 'restaurant',
      location: 'Deutschland',
      revenue_potential: 5000,
      calculatedScore: 75
    }

    switch (fileName) {
      case 'cursor_prompt.md':
        return RealContentGenerator.generateCursorPrompt(lead)

      case 'project_proposal.md':
        return RealContentGenerator.generateProjectProposal(lead)

      case 'business_analysis.json':
        return RealContentGenerator.generateBusinessAnalysis(lead)

      case 'development_guide.md':
        return {
          name: fileName,
          type: 'text',
          content: `# ENTWICKLUNGSGUIDE - ${leadName}

## 🛠️ SETUP ANWEISUNGEN

### 1. Projekt initialisieren
\`\`\`bash
npx create-next-app@latest ${leadName.toLowerCase().replace(/\s+/g, '-')}-website
cd ${leadName.toLowerCase().replace(/\s+/g, '-')}-website
npm install @supabase/supabase-js @headlessui/react framer-motion
\`\`\`

### 2. Umgebungsvariablen
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
\`\`\`

### 3. Supabase Schema
\`\`\`sql
-- Kunden Tabelle für ${leadName}
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Buchungen Tabelle (falls Restaurant/Service)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  party_size INTEGER DEFAULT 2,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### 4. Komponenten-Struktur
\`\`\`
src/
├── components/
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Contact.tsx
│   ├── Booking.tsx
│   └── Layout.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── app/
    ├── page.tsx
    ├── about/page.tsx
    └── contact/page.tsx
\`\`\`

### 5. Deployment Checklist
- [ ] Vercel Account erstellt
- [ ] Domain konfiguriert
- [ ] SSL Zertifikat aktiv
- [ ] Google Analytics eingerichtet
- [ ] Supabase Produktions-DB
- [ ] Performance optimiert (Lighthouse > 90)

---
**Entwicklungszeit:** 2-3 Wochen
**Go-Live:** Nach Kundenfeedback`,
          size: '3.2 KB'
        }

      case 'implementation_plan.pdf':
        return {
          name: fileName,
          type: 'pdf',
          content: `IMPLEMENTIERUNGSPLAN - ${leadName}

=== PROJEKTPHASEN ===

PHASE 1: ANALYSE & KONZEPTION (Woche 1)
- Stakeholder Interviews
- Anforderungsanalyse
- Competitive Research
- Wireframes & Mockups
- Content-Strategie
- Technische Architektur

PHASE 2: DESIGN & ENTWICKLUNG (Woche 2-3)
- UI/UX Design
- Frontend Development (Next.js)
- Backend Setup (Supabase)
- API Integration
- Content Management
- Testing & QA

PHASE 3: LAUNCH & OPTIMIERUNG (Woche 4)
- Staging Environment
- User Acceptance Testing
- Performance Optimierung
- SEO Setup
- Go-Live Vorbereitung
- Monitoring Setup

=== DELIVERABLES ===
✅ Vollständige Website
✅ Admin Dashboard
✅ Dokumentation
✅ Schulung
✅ 30 Tage Support

=== BUDGET BREAKDOWN ===
Design & UX: 30%
Development: 50%
Testing & QA: 10%
Launch & Support: 10%

Für vollständiges PDF bitte herunterladen.`,
          size: '856 KB'
        }

      case 'cost_breakdown.json':
        const costBreakdown = {
          project_name: leadName,
          total_budget: lead.revenue_potential || 5000,
          breakdown: {
            design_ux: {
              percentage: 30,
              amount: Math.floor((lead.revenue_potential || 5000) * 0.3),
              tasks: ["Wireframes", "UI Design", "UX Optimierung", "Responsive Design"]
            },
            development: {
              percentage: 50,
              amount: Math.floor((lead.revenue_potential || 5000) * 0.5),
              tasks: ["Frontend Development", "Backend Setup", "API Integration", "Database Design"]
            },
            testing_qa: {
              percentage: 10,
              amount: Math.floor((lead.revenue_potential || 5000) * 0.1),
              tasks: ["Unit Tests", "Integration Tests", "Performance Testing", "Security Audit"]
            },
            launch_support: {
              percentage: 10,
              amount: Math.floor((lead.revenue_potential || 5000) * 0.1),
              tasks: ["Deployment", "DNS Setup", "SSL Configuration", "30 Tage Support"]
            }
          },
          payment_schedule: {
            deposit: {
              percentage: 50,
              amount: Math.floor((lead.revenue_potential || 5000) * 0.5),
              due: "Bei Projektstart"
            },
            milestone_1: {
              percentage: 25,
              amount: Math.floor((lead.revenue_potential || 5000) * 0.25),
              due: "Nach Design-Approval"
            },
            final: {
              percentage: 25,
              amount: Math.floor((lead.revenue_potential || 5000) * 0.25),
              due: "Bei Go-Live"
            }
          },
          additional_services: {
            seo_optimization: 500,
            social_media_integration: 300,
            e_commerce_functionality: 1500,
            multi_language_support: 800,
            advanced_analytics: 400
          }
        }
        return {
          name: fileName,
          type: 'json',
          content: JSON.stringify(costBreakdown, null, 2),
          size: `${Math.ceil(JSON.stringify(costBreakdown).length / 1024)} KB`
        }

      case 'market_research.md':
        return {
          name: fileName,
          type: 'text',
          content: `# MARKTFORSCHUNG - ${leadName}

## 📊 MARKTÜBERSICHT

### Branche: ${lead.business_type || 'Restaurant'}
**Marktgröße Deutschland:** €45.2 Milliarden (2024)
**Lokaler Markt ${lead.location || 'Deutschland'}:** €${Math.floor((lead.revenue_potential || 5000) * 200).toLocaleString()}
**Jährliches Wachstum:** 3.2%

### Zielgruppe Analyse:
- **Primäre Zielgruppe:** Lokale Kunden (25-55 Jahre)
- **Sekundäre Zielgruppe:** Touristen und Geschäftsreisende
- **Online-Affinität:** 78% nutzen Internet für Restaurantsuche
- **Mobile Usage:** 65% buchen über Smartphone

## 🏆 WETTBEWERBSANALYSE

### Direkte Konkurrenten:
1. **Lokale Restaurants in ${lead.location || 'der Umgebung'}**
   - Anzahl: ~${Math.floor(Math.random() * 20) + 10} Betriebe
   - Online-Präsenz: 45% haben professionelle Website
   - Durchschnittliche Google-Bewertung: 4.1/5

2. **Ketten-Restaurants**
   - Marktanteil: 35%
   - Starke Online-Präsenz
   - Standardisierte Prozesse

### Wettbewerbsvorteile für ${leadName}:
✅ **Lokale Authentizität** - Persönlicher Service
✅ **Flexibilität** - Schnelle Anpassung an Kundenwünsche
✅ **Qualität** - Frische, lokale Zutaten
✅ **Community** - Stammkundenbasis

## 📱 DIGITALE TRENDS

### Online-Verhalten der Zielgruppe:
- **Google Suche:** 89% suchen online nach Restaurants
- **Social Media:** 67% folgen Restaurants auf Instagram/Facebook
- **Online-Bewertungen:** 92% lesen Bewertungen vor Besuch
- **Online-Buchung:** 54% bevorzugen Online-Reservierung

### Technologie-Adoption:
- **QR-Code Menüs:** 73% Akzeptanz seit COVID
- **Kontaktlose Zahlung:** 81% bevorzugt
- **Lieferservice:** 45% nutzen regelmäßig
- **Loyalty Apps:** 38% sind interessiert

## 💰 MARKTPOTENZIAL

### Revenue-Opportunities:
1. **Website-Traffic Monetarisierung**
   - Erwartete monatliche Besucher: ${Math.floor((lead.revenue_potential || 5000) / 10)}
   - Conversion Rate: 3-5%
   - Zusätzliche Buchungen: +${Math.floor((lead.revenue_potential || 5000) * 0.2)} pro Monat

2. **Online-Marketing ROI**
   - Google Ads ROI: 300-400%
   - Social Media ROI: 200-300%
   - SEO ROI: 500-600% (langfristig)

### Investitions-Empfehlung:
**Sofortige Maßnahmen (0-3 Monate):**
- Professionelle Website: €${Math.floor((lead.revenue_potential || 5000) * 0.8)}
- Google My Business Optimierung: €300
- Basis SEO Setup: €500

**Mittelfristige Maßnahmen (3-12 Monate):**
- Social Media Marketing: €200/Monat
- Google Ads Kampagnen: €300/Monat
- Content Marketing: €400/Monat

## 🎯 MARKTPOSITIONIERUNG

### Empfohlene Positionierung für ${leadName}:
**"Authentisches ${lead.business_type || 'Restaurant'} mit moderner Technologie"**

### Unique Selling Propositions:
1. **Lokale Tradition** trifft **digitale Innovation**
2. **Persönlicher Service** mit **modernen Buchungssystemen**
3. **Frische Qualität** mit **transparenter Kommunikation**

### Pricing-Strategie:
- **Premium-Positionierung:** 15-20% über Durchschnitt
- **Value-Proposition:** Qualität rechtfertigt Preis
- **Transparenz:** Klare Preiskommunikation online

## 📈 WACHSTUMSPROGNOSE

### Jahr 1 Ziele:
- **Website-Traffic:** 2.000 Besucher/Monat
- **Online-Buchungen:** 25% aller Reservierungen
- **Social Media:** 1.000 Follower
- **Google-Bewertungen:** 4.5+ Sterne

### 3-Jahres-Prognose:
- **Umsatzsteigerung:** +35% durch Digitalisierung
- **Kundenstamm:** +50% neue Kunden
- **Marktanteil:** Top 3 in lokaler Suche
- **ROI:** 400% auf Digital-Investment

---
**Analyse erstellt:** ${new Date().toLocaleDateString('de-DE')}
**Datenquellen:** Google Trends, Statista, Branchenverbände
**Nächste Aktualisierung:** ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}`,
          size: '4.8 KB'
        }

      case 'competitor_analysis.json':
        const competitorAnalysis = {
          analysis_date: new Date().toISOString(),
          target_business: leadName,
          location: lead.location || 'Deutschland',
          business_type: lead.business_type || 'restaurant',
          competitors: [
            {
              name: `Restaurant ${Math.floor(Math.random() * 100) + 1}`,
              distance: `${Math.floor(Math.random() * 5) + 1}km`,
              google_rating: (Math.random() * 1.5 + 3.5).toFixed(1),
              website_quality: Math.random() > 0.5 ? 'Gut' : 'Durchschnittlich',
              online_booking: Math.random() > 0.6,
              social_media_presence: Math.random() > 0.4,
              strengths: ['Etablierte Marke', 'Gute Lage', 'Stammkunden'],
              weaknesses: ['Veraltete Website', 'Schwache Online-Präsenz']
            },
            {
              name: `Bistro ${Math.floor(Math.random() * 100) + 1}`,
              distance: `${Math.floor(Math.random() * 3) + 1}km`,
              google_rating: (Math.random() * 1.5 + 3.5).toFixed(1),
              website_quality: Math.random() > 0.5 ? 'Sehr gut' : 'Gut',
              online_booking: Math.random() > 0.5,
              social_media_presence: Math.random() > 0.6,
              strengths: ['Moderne Website', 'Aktive Social Media'],
              weaknesses: ['Neue Marke', 'Begrenzte Kapazität']
            }
          ],
          market_gaps: [
            'Premium Online-Buchungssystem',
            'Personalisierte Kundenerfahrung',
            'Lokale SEO-Optimierung',
            'Mobile-First Design'
          ],
          opportunities: [
            {
              opportunity: 'Online-Reservierungssystem',
              impact: 'Hoch',
              effort: 'Mittel',
              timeline: '2-4 Wochen'
            },
            {
              opportunity: 'Social Media Marketing',
              impact: 'Mittel',
              effort: 'Niedrig',
              timeline: '1-2 Wochen'
            },
            {
              opportunity: 'Google My Business Optimierung',
              impact: 'Hoch',
              effort: 'Niedrig',
              timeline: '1 Woche'
            }
          ],
          competitive_advantages: [
            `Einzigartige Positionierung als ${lead.business_type}`,
            'Persönlicher Service und lokale Verbindung',
            'Flexibilität bei Kundenwünschen',
            'Potenzial für innovative Technologie-Integration'
          ],
          recommended_strategy: {
            short_term: 'Website-Launch und Google My Business Optimierung',
            medium_term: 'Social Media Aufbau und Content Marketing',
            long_term: 'Marktführerschaft in lokaler Online-Präsenz'
          }
        }
        return {
          name: fileName,
          type: 'json',
          content: JSON.stringify(competitorAnalysis, null, 2),
          size: `${Math.ceil(JSON.stringify(competitorAnalysis).length / 1024)} KB`
        }

      case 'timeline.md':
        return {
          name: fileName,
          type: 'text',
          content: `# PROJEKT-TIMELINE - ${leadName}

## 🗓️ PROJEKTÜBERSICHT
**Projektstart:** ${new Date().toLocaleDateString('de-DE')}
**Geplantes Go-Live:** ${new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}
**Gesamtdauer:** 3 Wochen
**Budget:** €${(lead.revenue_potential || 5000).toLocaleString()}

---

## 📅 WOCHE 1: ANALYSE & KONZEPTION

### Tag 1-2: Projektstart & Analyse
- [x] **Kickoff-Meeting** mit ${leadName}
- [x] **Anforderungsanalyse** - Detaillierte Gespräche
- [x] **Zielgruppen-Definition** - Personas erstellen
- [x] **Content-Audit** - Vorhandene Materialien sichten

### Tag 3-4: Research & Strategie
- [ ] **Competitor-Analyse** - Wettbewerber untersuchen
- [ ] **Keyword-Research** - SEO-Strategie entwickeln
- [ ] **User Journey Mapping** - Kundenerfahrung planen
- [ ] **Technical Requirements** - Hosting & Tools definieren

### Tag 5-7: Design & Konzeption
- [ ] **Wireframes erstellen** - Seitenstruktur planen
- [ ] **Design-Mockups** - Visuelle Gestaltung
- [ ] **Content-Strategie** - Texte und Bilder planen
- [ ] **Feedback-Runde 1** - Kunde-Approval für Design

**Deliverables Woche 1:**
✅ Projektdokumentation
✅ Wireframes & Mockups
✅ Content-Plan
✅ Technical Specification

---

## 🛠️ WOCHE 2: ENTWICKLUNG

### Tag 8-10: Frontend Development
- [ ] **Next.js Setup** - Projekt initialisieren
- [ ] **Responsive Layout** - Mobile-First Ansatz
- [ ] **Hero Section** - Startseite mit Branding
- [ ] **Navigation** - Menü und Footer

### Tag 11-12: Core Features
- [ ] **Service-Seiten** - Angebot präsentieren
- [ ] **Über Uns Seite** - Geschichte und Team
- [ ] **Kontakt-Integration** - Formulare und Maps
- [ ] **Bildergalerie** - Professionelle Fotos

### Tag 13-14: Backend & Integration
- [ ] **Supabase Setup** - Database & Auth
- [ ] **Kontaktformular** - E-Mail Integration
- [ ] **Buchungssystem** - Online-Reservierungen
- [ ] **CMS Integration** - Content-Management

**Deliverables Woche 2:**
✅ Funktionsfähige Website
✅ Alle Core-Features implementiert
✅ Backend-Integration abgeschlossen
✅ Staging-Environment bereit

---

## 🚀 WOCHE 3: TESTING & LAUNCH

### Tag 15-17: Testing & Optimierung
- [ ] **Cross-Browser Testing** - Kompatibilität prüfen
- [ ] **Mobile Testing** - Responsive Design validieren
- [ ] **Performance Optimization** - Ladezeiten optimieren
- [ ] **SEO Implementation** - Meta-Tags und Schema

### Tag 18-19: Content & Final Review
- [ ] **Content-Upload** - Texte und Bilder einpflegen
- [ ] **Final Review** - Letzte Anpassungen
- [ ] **Client Training** - CMS-Schulung
- [ ] **Go-Live Vorbereitung** - DNS und SSL

### Tag 20-21: Launch & Monitoring
- [ ] **Domain Setup** - DNS-Konfiguration
- [ ] **SSL-Zertifikat** - Sicherheit aktivieren
- [ ] **Go-Live** - Website veröffentlichen
- [ ] **Monitoring Setup** - Analytics und Tracking

**Deliverables Woche 3:**
✅ Live Website
✅ SSL-Verschlüsselung aktiv
✅ Analytics eingerichtet
✅ Dokumentation übergeben

---

## 📊 MEILENSTEINE & ZAHLUNGEN

### 💰 Zahlungsplan:
- **50% Anzahlung:** €${Math.floor((lead.revenue_potential || 5000) * 0.5).toLocaleString()} - Bei Projektstart ✅
- **25% Zwischenzahlung:** €${Math.floor((lead.revenue_potential || 5000) * 0.25).toLocaleString()} - Nach Design-Approval
- **25% Restzahlung:** €${Math.floor((lead.revenue_potential || 5000) * 0.25).toLocaleString()} - Bei Go-Live

### 🎯 Kritische Meilensteine:
1. **Design-Approval** (Tag 7) - Kunde bestätigt Mockups
2. **Development-Review** (Tag 14) - Funktionen getestet
3. **Content-Freeze** (Tag 17) - Alle Inhalte final
4. **Go-Live** (Tag 21) - Website ist live

---

## ⚠️ RISIKEN & MITIGATION

### Potenzielle Verzögerungen:
- **Content-Bereitstellung** - Kunde liefert Texte/Bilder verspätet
  - *Mitigation:* Content-Deadline Tag 5 setzen
- **Design-Änderungen** - Umfangreiche Änderungswünsche
  - *Mitigation:* Max. 2 Revision-Runden vereinbaren
- **Technical Issues** - Unvorhergesehene technische Probleme
  - *Mitigation:* 2 Puffer-Tage eingeplant

### Qualitätssicherung:
- **Daily Standups** - Tägliche Fortschritts-Updates
- **Weekly Reviews** - Wöchentliche Kunde-Abstimmung
- **Testing Checklist** - Systematische Qualitätsprüfung

---

## 📞 KOMMUNIKATION

### Regelmäßige Updates:
- **Täglich:** Slack/E-Mail Updates zum Fortschritt
- **Wöchentlich:** Video-Call für Review und Feedback
- **Bei Bedarf:** Sofortige Kommunikation bei Problemen

### Ansprechpartner:
- **Projektleiter:** Hassani Solutions Team
- **Kunde:** ${leadName} Ansprechpartner
- **Notfall-Kontakt:** +49 XXX XXXXXXX

**Projekt erfolgreich abgeschlossen am: [Datum wird nach Go-Live eingetragen]**`,
          size: '5.2 KB'
        }

      case 'json':
        return {
          name: fileName,
          type: 'json',
          content: JSON.stringify({
            lead_name: leadName,
            folder: folderName,
            generated_at: new Date().toISOString(),
            status: "ready",
            data: {
              business_type: lead.business_type || "restaurant",
              location: lead.location || "Deutschland",
              target_audience: "local_customers",
              key_features: [
                "Online Reservierung",
                "Menü-Management",
                "Kundenbewertungen",
                "Social Media Integration"
              ],
              technical_stack: {
                frontend: "Next.js 14",
                backend: "Supabase",
                styling: "Tailwind CSS",
                deployment: "Vercel"
              },
              estimated_timeline: "2-3 weeks",
              budget_range: `€${Math.floor((lead.revenue_potential || 5000) * 0.5)} - €${lead.revenue_potential || 5000}`
            }
          }, null, 2),
          size: '1.8 KB'
        }
      
      case 'pdf':
        return {
          name: fileName,
          type: 'pdf',
          content: `PDF-Dokument: ${fileName}

Dieses PDF-Dokument enthält:
- Detaillierte Projektspezifikationen
- Wireframes und Mockups
- Technische Anforderungen
- Implementierungsplan

Um das vollständige PDF zu öffnen, klicken Sie auf "Download".`,
          size: '856 KB'
        }
      
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
        return {
          name: fileName,
          type: 'image',
          content: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&crop=center`,
          size: '245 KB'
        }
      
      case 'target_audience.md':
        return {
          name: fileName,
          type: 'text',
          content: `# ZIELGRUPPEN-ANALYSE - ${leadName}

## 🎯 PRIMÄRE ZIELGRUPPE

### Demografische Daten:
- **Alter:** 28-55 Jahre
- **Geschlecht:** 55% weiblich, 45% männlich
- **Einkommen:** €35.000 - €75.000 jährlich
- **Bildung:** Mittlere bis höhere Bildung
- **Wohnort:** ${lead.location || 'Deutschland'} und Umgebung (15km Radius)

### Psychografische Merkmale:
- **Lifestyle:** Qualitätsbewusst, genießt gutes Essen
- **Werte:** Authentizität, lokale Verbundenheit, Nachhaltigkeit
- **Interessen:** Kulinarik, lokale Kultur, soziale Aktivitäten
- **Verhalten:** Plant Restaurantbesuche im Voraus, liest Bewertungen

### Online-Verhalten:
- **Geräte:** 70% Smartphone, 25% Desktop, 5% Tablet
- **Social Media:** Instagram (85%), Facebook (65%), Google (95%)
- **Suchverhalten:** "Restaurant ${lead.location}", "${lead.business_type} in der Nähe"
- **Buchungsverhalten:** 60% bevorzugen Online-Reservierung

## 👥 SEKUNDÄRE ZIELGRUPPEN

### Geschäftsreisende:
- **Alter:** 30-50 Jahre
- **Bedürfnisse:** Schnelle Buchung, zentrale Lage, WLAN
- **Buchungszeit:** Kurzfristig (1-2 Tage vorher)
- **Budget:** Höher, Firmen-Account

### Touristen:
- **Herkunft:** Andere deutsche Städte, internationale Besucher
- **Bedürfnisse:** Authentische lokale Erfahrung, Empfehlungen
- **Informationsquellen:** TripAdvisor, Google Maps, Hotel-Concierge
- **Saison:** Verstärkt in Ferienzeiten

### Familien:
- **Zusammensetzung:** Eltern mit Kindern (6-16 Jahre)
- **Bedürfnisse:** Kinderfreundliche Atmosphäre, flexible Zeiten
- **Buchungsverhalten:** Wochenenden, Feiertage, Schulferien
- **Preissensibilität:** Mittel bis hoch

## 📊 CUSTOMER PERSONAS

### Persona 1: "Genießer-Gabi" (42 Jahre)
**Beruf:** Marketing-Managerin
**Familie:** Verheiratet, 2 Kinder
**Einkommen:** €55.000/Jahr

**Ziele:**
- Qualitätsvolle Abende mit Partner
- Neue kulinarische Erfahrungen
- Entspannung nach stressigem Arbeitstag

**Frustrationen:**
- Lange Wartezeiten ohne Reservierung
- Unklare Speisekarten online
- Schlechter Service

**Präferierte Kanäle:**
- Instagram für Inspiration
- Google für Bewertungen
- WhatsApp für Kommunikation

### Persona 2: "Business-Bernd" (38 Jahre)
**Beruf:** Vertriebsleiter
**Status:** Häufig auf Geschäftsreisen
**Einkommen:** €70.000/Jahr

**Ziele:**
- Effiziente Geschäftsessen
- Zuverlässige Reservierungen
- Professionelle Atmosphäre

**Frustrationen:**
- Komplizierte Buchungsprozesse
- Unflexible Stornierungsbedingungen
- Schlechte Erreichbarkeit

**Präferierte Kanäle:**
- Google Maps für Standort
- Telefon für direkte Buchung
- E-Mail für Bestätigungen

## 🎯 ZIELGRUPPEN-STRATEGIE

### Content-Marketing:
**Für Genießer-Gabi:**
- Instagram-Posts mit Food-Fotografie
- Blog-Artikel über Zutaten und Zubereitung
- Behind-the-scenes Content

**Für Business-Bernd:**
- LinkedIn-Präsenz
- Business-Lunch Angebote
- Schnelle Online-Buchung

### Kommunikationsstil:
- **Ton:** Warm, einladend, professionell
- **Sprache:** Deutsch, einfach verständlich
- **Bildsprache:** Authentisch, hochwertig, appetitlich

### Kanäle-Priorität:
1. **Google My Business** - Lokale Sichtbarkeit
2. **Instagram** - Visuelle Inspiration
3. **Website** - Zentrale Anlaufstelle
4. **Facebook** - Community Building

## 📈 CONVERSION-OPTIMIERUNG

### Touchpoints optimieren:
- **Awareness:** SEO, Social Media, Mundpropaganda
- **Consideration:** Website, Bewertungen, Menü
- **Decision:** Online-Buchung, Telefon, Walk-ins
- **Retention:** Newsletter, Loyalty-Programm

### Call-to-Actions:
- "Jetzt reservieren" (Primär)
- "Speisekarte ansehen" (Sekundär)
- "Bewertungen lesen" (Tertiär)

### Erfolgsmessung:
- **Website-Conversions:** Buchungen/Besucher
- **Social Media:** Engagement-Rate
- **Kundenzufriedenheit:** Google-Bewertungen
- **Wiederkehrende Kunden:** Buchungshistorie

---
**Zielgruppen-Analyse erstellt:** ${new Date().toLocaleDateString('de-DE')}
**Nächste Überprüfung:** ${new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}
**Verantwortlich:** Hassani Solutions Marketing Team`,
          size: '4.1 KB'
        }

      case 'ai_instructions.txt':
        return {
          name: fileName,
          type: 'text',
          content: `AI DEVELOPMENT INSTRUCTIONS - ${leadName}

=== PROJEKT KONTEXT ===
Business: ${leadName}
Type: ${lead.business_type || 'restaurant'}
Location: ${lead.location || 'Deutschland'}
Budget: €${(lead.revenue_potential || 5000).toLocaleString()}
Timeline: 3 Wochen

=== AI ASSISTANT ROLE ===
Du bist ein Senior Full-Stack Developer mit Spezialisierung auf:
- Next.js 14 mit App Router
- TypeScript für Type Safety
- Tailwind CSS für Styling
- Supabase als Backend-as-a-Service
- Vercel für Deployment

=== DEVELOPMENT GUIDELINES ===

1. CODE QUALITY:
   - Verwende TypeScript für alle Komponenten
   - Implementiere proper error handling
   - Schreibe clean, readable code
   - Kommentiere komplexe Logik
   - Folge Next.js best practices

2. PERFORMANCE:
   - Optimiere für Core Web Vitals
   - Implementiere lazy loading für Bilder
   - Minimiere bundle size
   - Verwende Next.js Image component
   - Implementiere proper caching

3. SEO OPTIMIZATION:
   - Strukturierte Daten (Schema.org)
   - Meta tags für alle Seiten
   - Semantic HTML structure
   - Alt-tags für alle Bilder
   - Sitemap.xml generieren

4. ACCESSIBILITY:
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast ratios
   - Focus management

=== SPECIFIC REQUIREMENTS FOR ${leadName.toUpperCase()} ===

MUST HAVE FEATURES:
- Responsive design (mobile-first)
- Contact form with validation
- Google Maps integration
- Social media links
- Professional image gallery
- Loading states and error handling

BUSINESS-SPECIFIC FEATURES:
${getBusinessSpecificInstructions(lead.business_type || 'restaurant')}

=== TECHNICAL IMPLEMENTATION ===

FOLDER STRUCTURE:
src/
├── app/
│   ├── page.tsx (Homepage)
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── contact/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/ (Reusable components)
│   ├── sections/ (Page sections)
│   └── forms/ (Form components)
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── validations.ts
└── styles/
    └── globals.css

SUPABASE SCHEMA:
-- Contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table (if applicable)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  party_size INTEGER DEFAULT 2,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

=== DEPLOYMENT CHECKLIST ===

PRE-DEPLOYMENT:
□ All TypeScript errors resolved
□ Build process successful
□ Environment variables configured
□ Database migrations applied
□ Images optimized and compressed
□ Meta tags implemented
□ Sitemap generated

POST-DEPLOYMENT:
□ SSL certificate active
□ Google Analytics configured
□ Google Search Console setup
□ Performance testing completed
□ Mobile responsiveness verified
□ Contact forms tested
□ 404 page implemented

=== QUALITY ASSURANCE ===

TESTING REQUIREMENTS:
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile testing (iOS Safari, Android Chrome)
- Form validation testing
- Performance testing (Lighthouse score >90)
- Accessibility testing
- SEO audit

PERFORMANCE TARGETS:
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms

=== CLIENT HANDOVER ===

DELIVERABLES:
1. Live website with SSL
2. Admin access to Supabase
3. Google Analytics access
4. Documentation for content updates
5. 30 days of support included

TRAINING MATERIALS:
- How to update content
- How to view contact submissions
- How to manage bookings (if applicable)
- Basic troubleshooting guide

=== SUPPORT & MAINTENANCE ===

30-DAY SUPPORT INCLUDES:
- Bug fixes and minor adjustments
- Content updates assistance
- Performance monitoring
- Security updates
- Backup verification

ONGOING MAINTENANCE (Optional):
- Monthly performance reports
- Content updates
- Feature enhancements
- SEO optimization
- Security monitoring

=== EMERGENCY CONTACTS ===
Primary Developer: Hassani Solutions Team
Email: dev@hassanisolutions.com
Phone: +49 XXX XXXXXXX
Response Time: <4 hours during business hours

=== PROJECT SUCCESS METRICS ===
- Website loading time <3 seconds
- Mobile-friendly test passed
- Google PageSpeed score >90
- Contact form conversion >3%
- Client satisfaction score >4.5/5

Last Updated: ${new Date().toLocaleDateString('de-DE')}
Project ID: ${lead.id}`,
          size: '3.8 KB'
        }

      default:
        return {
          name: fileName,
          type: 'unknown',
          content: `Datei: ${fileName}

Diese Datei kann nicht direkt angezeigt werden.
Verwenden Sie den Download-Button, um die Datei herunterzuladen.`,
          size: '1.2 KB'
        }
    }
  }

  const getBusinessSpecificInstructions = (businessType: string): string => {
    const instructions = {
      restaurant: `
- Online-Reservierungssystem mit Kalender
- Digitale Speisekarte mit Preisen
- Bildergalerie für Gerichte und Ambiente
- Öffnungszeiten prominent anzeigen
- Kontaktformular für Events/Catering
- Integration mit Lieferdiensten
- Bewertungssystem für Kundenfeedback`,

      bakery: `
- Tagesangebot mit frischen Backwaren
- Vorbestellungssystem für Torten
- Bildergalerie für Produkte
- Öffnungszeiten und Verfügbarkeit
- Allergen-Informationen
- Catering-Angebote
- Filial-Finder bei mehreren Standorten`,

      default: `
- Service-Übersicht mit Beschreibungen
- Online-Terminbuchung
- Portfolio/Referenzen
- Kundenbewertungen
- FAQ-Bereich
- Kontaktformular
- Über uns Seite mit Team`
    }

    return instructions[businessType as keyof typeof instructions] || instructions.default
  }

  const loadFileContent = async (fileName: string) => {
    setIsLoading(true)

    // Simulate API call delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800))

    const content = generateRealContent(fileName)
    setFileContent(content)
    setIsLoading(false)
  }

  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile)
    }
  }, [selectedFile])

  useEffect(() => {
    if (isOpen && files.length > 0) {
      setSelectedFile(files[0])
      setCurrentFileIndex(0)
    }
  }, [isOpen, files])

  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      const newIndex = currentFileIndex - 1
      setCurrentFileIndex(newIndex)
      setSelectedFile(files[newIndex])
    }
  }

  const handleNextFile = () => {
    if (currentFileIndex < files.length - 1) {
      const newIndex = currentFileIndex + 1
      setCurrentFileIndex(newIndex)
      setSelectedFile(files[newIndex])
    }
  }

  const handleDownload = (fileName: string) => {
    // In a real app, this would trigger actual file download
    const element = document.createElement('a')
    const file = new Blob([fileContent?.content || ''], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'md':
      case 'txt':
        return DocumentTextIcon
      case 'js':
      case 'ts':
      case 'json':
        return CodeBracketIcon
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
        return PhotoIcon
      default:
        return DocumentTextIcon
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative h-full flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{folderTitle}</h3>
                <p className="text-sm text-gray-600">{leadName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {files.map((file, index) => {
                const FileIcon = getFileIcon(file)
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedFile(file)
                      setCurrentFileIndex(index)
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      selectedFile === file
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <FileIcon className={`h-5 w-5 ${
                      selectedFile === file ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        selectedFile === file ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {file}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePreviousFile}
                disabled={currentFileIndex === 0}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {selectedFile}
                </h4>
                <p className="text-sm text-gray-600">
                  {currentFileIndex + 1} von {files.length} Dateien
                </p>
              </div>
              
              <button
                onClick={handleNextFile}
                disabled={currentFileIndex === files.length - 1}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {fileContent?.size}
              </span>
              <button
                onClick={() => selectedFile && handleDownload(selectedFile)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : fileContent ? (
              <div className="max-w-4xl mx-auto">
                {fileContent.type === 'image' ? (
                  <div className="text-center">
                    <img
                      src={fileContent.content}
                      alt={fileContent.name}
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                ) : fileContent.type === 'json' ? (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{fileContent.content}</code>
                  </pre>
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {fileContent.content}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <EyeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Wählen Sie eine Datei zum Anzeigen aus</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
