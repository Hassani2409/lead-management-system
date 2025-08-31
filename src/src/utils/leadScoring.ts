/**
 * Intelligentes Lead-Scoring-System
 * Bewertet Leads basierend auf verschiedenen Faktoren
 */

export interface Lead {
  id?: string
  name: string
  business_type?: string
  email?: string
  phone?: string
  website?: string
  location?: string
  verified?: boolean
  quality_score?: number
  ai_score?: number
  revenue_estimate?: number
  created_at?: string
  source?: string
  auto_integrated?: boolean
}

export interface ScoringFactors {
  completeness: number
  verification: number
  businessValue: number
  location: number
  source: number
  freshness: number
}

export class LeadScoringEngine {
  
  /**
   * Berechnet den Gesamt-Score für einen Lead
   */
  static calculateLeadScore(lead: Lead): number {
    const factors = this.analyzeScoringFactors(lead)
    
    // Gewichtete Berechnung
    const weights = {
      completeness: 0.25,    // 25% - Vollständigkeit der Daten
      verification: 0.20,    // 20% - Verifizierung
      businessValue: 0.25,   // 25% - Business-Wert
      location: 0.10,        // 10% - Standort
      source: 0.10,          // 10% - Quelle
      freshness: 0.10        // 10% - Aktualität
    }
    
    const score = 
      factors.completeness * weights.completeness +
      factors.verification * weights.verification +
      factors.businessValue * weights.businessValue +
      factors.location * weights.location +
      factors.source * weights.source +
      factors.freshness * weights.freshness
    
    return Math.round(Math.min(score, 100)) // Max 100 Punkte
  }
  
  /**
   * Analysiert einzelne Scoring-Faktoren
   */
  static analyzeScoringFactors(lead: Lead): ScoringFactors {
    return {
      completeness: this.calculateCompletenessScore(lead),
      verification: this.calculateVerificationScore(lead),
      businessValue: this.calculateBusinessValueScore(lead),
      location: this.calculateLocationScore(lead),
      source: this.calculateSourceScore(lead),
      freshness: this.calculateFreshnessScore(lead)
    }
  }
  
  /**
   * Berechnet Vollständigkeits-Score (0-100)
   */
  private static calculateCompletenessScore(lead: Lead): number {
    let score = 0
    
    // Basis-Daten
    if (lead.name?.trim()) score += 20
    if (lead.email && lead.email.includes('@')) score += 25
    if (lead.phone?.trim()) score += 20
    if (lead.website && (lead.website.includes('http') || lead.website.includes('.'))) score += 20
    if (lead.location?.trim()) score += 10
    if (lead.business_type?.trim()) score += 5
    
    return Math.min(score, 100)
  }
  
  /**
   * Berechnet Verifizierungs-Score (0-100)
   */
  private static calculateVerificationScore(lead: Lead): number {
    let score = 0
    
    // Verifizierte Leads bekommen hohen Score
    if (lead.verified) {
      score += 80
    }
    
    // AI-Score berücksichtigen
    if (lead.ai_score && lead.ai_score > 0) {
      score += Math.min(lead.ai_score / 10, 20) // Max 20 Punkte
    }
    
    // Qualitäts-Score berücksichtigen
    if (lead.quality_score && lead.quality_score > 0) {
      score = Math.max(score, lead.quality_score)
    }
    
    return Math.min(score, 100)
  }
  
  /**
   * Berechnet Business-Wert-Score (0-100)
   */
  private static calculateBusinessValueScore(lead: Lead): number {
    let score = 40 // Basis-Score
    
    const businessType = lead.business_type?.toLowerCase() || ''
    
    // High-Value Business Types
    const highValueTypes = [
      'restaurant', 'hotel', 'retail', 'technology', 'software',
      'consulting', 'finance', 'healthcare', 'real estate', 'automotive'
    ]
    
    const mediumValueTypes = [
      'service', 'education', 'manufacturing', 'construction', 'transport'
    ]
    
    if (highValueTypes.some(type => businessType.includes(type))) {
      score += 40
    } else if (mediumValueTypes.some(type => businessType.includes(type))) {
      score += 20
    }
    
    // Revenue Estimate berücksichtigen
    if (lead.revenue_estimate && lead.revenue_estimate > 0) {
      if (lead.revenue_estimate > 1000000) score += 20      // > 1M
      else if (lead.revenue_estimate > 500000) score += 15  // > 500K
      else if (lead.revenue_estimate > 100000) score += 10  // > 100K
      else score += 5
    }
    
    // Bekannte Marken/Ketten
    const name = lead.name?.toLowerCase() || ''
    const premiumBrands = [
      'hyatt', 'hilton', 'marriott', 'sofitel', 'adina',
      'mercedes', 'bmw', 'audi', 'porsche',
      'michelin', 'gault', 'millau'
    ]
    
    if (premiumBrands.some(brand => name.includes(brand))) {
      score += 20
    }
    
    return Math.min(score, 100)
  }
  
  /**
   * Berechnet Standort-Score (0-100)
   */
  private static calculateLocationScore(lead: Lead): number {
    let score = 50 // Basis-Score
    
    const location = lead.location?.toLowerCase() || ''
    
    // Premium-Standorte (Großstädte)
    const premiumCities = [
      'berlin', 'münchen', 'hamburg', 'köln', 'frankfurt',
      'düsseldorf', 'stuttgart', 'dortmund', 'essen', 'leipzig'
    ]
    
    const goodCities = [
      'hannover', 'dresden', 'nürnberg', 'duisburg', 'bochum',
      'wuppertal', 'bielefeld', 'bonn', 'münster', 'karlsruhe'
    ]
    
    if (premiumCities.some(city => location.includes(city))) {
      score += 40
    } else if (goodCities.some(city => location.includes(city))) {
      score += 20
    }
    
    // Premium-Bezirke in Berlin
    const premiumDistricts = [
      'mitte', 'charlottenburg', 'wilmersdorf', 'schöneberg',
      'prenzlauer berg', 'friedrichshain', 'kreuzberg'
    ]
    
    if (premiumDistricts.some(district => location.includes(district))) {
      score += 10
    }
    
    return Math.min(score, 100)
  }
  
  /**
   * Berechnet Quellen-Score (0-100)
   */
  private static calculateSourceScore(lead: Lead): number {
    let score = 50 // Basis-Score
    
    const source = lead.source?.toLowerCase() || ''
    
    // High-Quality Sources
    if (source.includes('working_lead_scraper')) score += 30
    else if (source.includes('crawl4ai')) score += 25
    else if (source.includes('playwright')) score += 20
    else if (source.includes('google_maps')) score += 15
    else if (source.includes('manual') || source.includes('verified')) score += 40
    
    // Auto-integrierte Leads sind aktueller
    if (lead.auto_integrated) score += 10
    
    return Math.min(score, 100)
  }
  
  /**
   * Berechnet Aktualitäts-Score (0-100)
   */
  private static calculateFreshnessScore(lead: Lead): number {
    if (!lead.created_at) return 50
    
    const createdDate = new Date(lead.created_at)
    const now = new Date()
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysDiff <= 1) return 100      // Heute
    if (daysDiff <= 7) return 90       // Diese Woche
    if (daysDiff <= 30) return 70      // Dieser Monat
    if (daysDiff <= 90) return 50      // Letzten 3 Monate
    if (daysDiff <= 180) return 30     // Letzten 6 Monate
    
    return 10 // Älter als 6 Monate
  }
  
  /**
   * Kategorisiert Lead basierend auf Score
   */
  static categorizeLeadByScore(score: number): {
    category: 'hot' | 'warm' | 'cold' | 'poor'
    label: string
    color: string
    priority: number
  } {
    if (score >= 80) {
      return {
        category: 'hot',
        label: 'Hot Lead',
        color: '#ef4444', // red-500
        priority: 1
      }
    } else if (score >= 60) {
      return {
        category: 'warm',
        label: 'Warm Lead',
        color: '#f97316', // orange-500
        priority: 2
      }
    } else if (score >= 40) {
      return {
        category: 'cold',
        label: 'Cold Lead',
        color: '#3b82f6', // blue-500
        priority: 3
      }
    } else {
      return {
        category: 'poor',
        label: 'Poor Lead',
        color: '#6b7280', // gray-500
        priority: 4
      }
    }
  }
  
  /**
   * Erstellt detaillierte Scoring-Analyse
   */
  static createScoringAnalysis(lead: Lead) {
    const factors = this.analyzeScoringFactors(lead)
    const totalScore = this.calculateLeadScore(lead)
    const category = this.categorizeLeadByScore(totalScore)
    
    return {
      totalScore,
      category,
      factors,
      recommendations: this.generateRecommendations(lead, factors, totalScore),
      strengths: this.identifyStrengths(factors),
      weaknesses: this.identifyWeaknesses(factors)
    }
  }
  
  /**
   * Generiert Empfehlungen zur Lead-Verbesserung
   */
  private static generateRecommendations(lead: Lead, factors: ScoringFactors, score: number): string[] {
    const recommendations: string[] = []
    
    if (factors.completeness < 70) {
      if (!lead.email) recommendations.push('E-Mail-Adresse recherchieren')
      if (!lead.phone) recommendations.push('Telefonnummer ermitteln')
      if (!lead.website) recommendations.push('Website finden')
    }
    
    if (factors.verification < 50) {
      recommendations.push('Lead-Daten verifizieren')
      recommendations.push('Unternehmen online recherchieren')
    }
    
    if (score >= 80) {
      recommendations.push('Sofort kontaktieren - Hot Lead!')
      recommendations.push('Personalisierte Ansprache vorbereiten')
    } else if (score >= 60) {
      recommendations.push('In den nächsten 2-3 Tagen kontaktieren')
      recommendations.push('Weitere Informationen sammeln')
    } else if (score >= 40) {
      recommendations.push('Lead weiter qualifizieren')
      recommendations.push('Automatisierte Follow-up-Sequenz starten')
    } else {
      recommendations.push('Lead-Daten vervollständigen oder archivieren')
    }
    
    return recommendations
  }
  
  /**
   * Identifiziert Stärken des Leads
   */
  private static identifyStrengths(factors: ScoringFactors): string[] {
    const strengths: string[] = []
    
    if (factors.completeness >= 80) strengths.push('Vollständige Kontaktdaten')
    if (factors.verification >= 70) strengths.push('Verifizierte Informationen')
    if (factors.businessValue >= 70) strengths.push('Hoher Business-Wert')
    if (factors.location >= 70) strengths.push('Premium-Standort')
    if (factors.freshness >= 80) strengths.push('Aktuelle Daten')
    
    return strengths
  }
  
  /**
   * Identifiziert Schwächen des Leads
   */
  private static identifyWeaknesses(factors: ScoringFactors): string[] {
    const weaknesses: string[] = []
    
    if (factors.completeness < 50) weaknesses.push('Unvollständige Daten')
    if (factors.verification < 40) weaknesses.push('Nicht verifiziert')
    if (factors.businessValue < 50) weaknesses.push('Niedriger Business-Wert')
    if (factors.freshness < 30) weaknesses.push('Veraltete Daten')
    
    return weaknesses
  }
}
