/**
 * Comprehensive CRM Service Layer
 * HubSpot-like functionality with advanced features
 */

import { 
  Lead, 
  Contact, 
  Project, 
  Campaign, 
  Activity, 
  Interaction, 
  AIRecommendation,
  Pipeline,
  Report,
  CRMSettings,
  LeadStatus,
  LeadStage
} from '@/types/crm'

class CRMService {
  private apiBase = '/api/crm'

  // ==================== LEAD MANAGEMENT ====================

  async getLeads(filters?: any): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters)
      const response = await fetch(`${this.apiBase}/leads?${params}`)
      if (!response.ok) {
        // Fallback to local data
        const { getLeads } = await import('@/lib/leadService')
        return getLeads()
      }
      return response.json()
    } catch (error) {
      // Fallback to local data
      const { getLeads } = await import('@/lib/leadService')
      return getLeads()
    }
  }

  async getLeadById(id: string): Promise<Lead | null> {
    const response = await fetch(`${this.apiBase}/leads/${id}`)
    if (!response.ok) return null
    return response.json()
  }

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`${this.apiBase}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })
    return response.json()
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const response = await fetch(`${this.apiBase}/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  }

  async deleteLead(id: string): Promise<boolean> {
    const response = await fetch(`${this.apiBase}/leads/${id}`, {
      method: 'DELETE'
    })
    return response.ok
  }

  async bulkUpdateLeads(leadIds: string[], updates: Partial<Lead>): Promise<Lead[]> {
    const response = await fetch(`${this.apiBase}/leads/bulk`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadIds, updates })
    })
    return response.json()
  }

  async assignLeads(leadIds: string[], assigneeId: string): Promise<boolean> {
    const response = await fetch(`${this.apiBase}/leads/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadIds, assigneeId })
    })
    return response.ok
  }

  // ==================== LEAD SCORING ====================

  async calculateLeadScore(leadId: string): Promise<number> {
    const response = await fetch(`${this.apiBase}/leads/${leadId}/score`, {
      method: 'POST'
    })
    const result = await response.json()
    return result.score
  }

  async bulkRecalculateScores(): Promise<boolean> {
    const response = await fetch(`${this.apiBase}/leads/scores/recalculate`, {
      method: 'POST'
    })
    return response.ok
  }

  async getLeadsByScore(category: 'hot' | 'warm' | 'cold' | 'poor'): Promise<Lead[]> {
    const response = await fetch(`${this.apiBase}/leads/by-score/${category}`)
    return response.json()
  }

  // ==================== IMPORT/EXPORT ====================

  async importLeads(file: File, mapping: Record<string, string>): Promise<{
    success: number
    errors: string[]
    duplicates: number
  }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mapping', JSON.stringify(mapping))

    const response = await fetch(`${this.apiBase}/leads/import`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  }

  async exportLeads(filters?: any, format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams({ ...filters, format })
    const response = await fetch(`${this.apiBase}/leads/export?${params}`)
    return response.blob()
  }

  // ==================== INTERACTIONS ====================

  async addInteraction(leadId: string, interaction: Partial<Interaction>): Promise<Interaction> {
    const response = await fetch(`${this.apiBase}/leads/${leadId}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interaction)
    })
    return response.json()
  }

  async getInteractions(leadId: string): Promise<Interaction[]> {
    const response = await fetch(`${this.apiBase}/leads/${leadId}/interactions`)
    return response.json()
  }

  async updateInteraction(leadId: string, interactionId: string, updates: Partial<Interaction>): Promise<Interaction> {
    const response = await fetch(`${this.apiBase}/leads/${leadId}/interactions/${interactionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  }

  // ==================== ACTIVITIES & TASKS ====================

  async getActivities(filters?: any): Promise<Activity[]> {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${this.apiBase}/activities?${params}`)
    return response.json()
  }

  async createActivity(activity: Partial<Activity>): Promise<Activity> {
    const response = await fetch(`${this.apiBase}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    })
    return response.json()
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity> {
    const response = await fetch(`${this.apiBase}/activities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  }

  async completeActivity(id: string, outcome?: string): Promise<Activity> {
    const response = await fetch(`${this.apiBase}/activities/${id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome })
    })
    return response.json()
  }

  // ==================== PROJECTS ====================

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.apiBase}/projects`)
    return response.json()
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await fetch(`${this.apiBase}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    })
    return response.json()
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await fetch(`${this.apiBase}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  }

  async addLeadsToProject(projectId: string, leadIds: string[]): Promise<boolean> {
    const response = await fetch(`${this.apiBase}/projects/${projectId}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadIds })
    })
    return response.ok
  }

  // ==================== CAMPAIGNS ====================

  async getCampaigns(): Promise<Campaign[]> {
    const response = await fetch(`${this.apiBase}/campaigns`)
    return response.json()
  }

  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await fetch(`${this.apiBase}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    })
    return response.json()
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const response = await fetch(`${this.apiBase}/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  }

  // ==================== AI RECOMMENDATIONS ====================

  async getAIRecommendations(leadId?: string): Promise<AIRecommendation[]> {
    const url = leadId
      ? `${this.apiBase}/ai/recommendations?leadId=${leadId}`
      : `${this.apiBase}/ai/recommendations`
    const response = await fetch(url)
    return response.json()
  }

  async generateEmailTemplate(leadId: string, type: string): Promise<string> {
    const response = await fetch(`${this.apiBase}/ai/email-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, type })
    })
    const result = await response.json()
    return result.template
  }

  async qualifyLead(leadId: string): Promise<{
    qualification: string
    score: number
    recommendations: string[]
  }> {
    const response = await fetch(`${this.apiBase}/ai/qualify/${leadId}`, {
      method: 'POST'
    })
    return response.json()
  }

  // ==================== DEEP RESEARCH INTEGRATION ====================

  async runDeepResearchAnalysis(leadId: string): Promise<{
    websiteAnalysis: any
    businessAnalysis: any
    aiRecommendations: any
    generatedContent: any
    analysisScore: number
  }> {
    const response = await fetch(`${this.apiBase}/deep-research/analyze/${leadId}`, {
      method: 'POST'
    })
    return response.json()
  }

  async generatePersonalizedContent(leadId: string, contentType: 'email' | 'proposal' | 'landing_page'): Promise<{
    content: string
    variables: Record<string, any>
    confidence: number
  }> {
    const response = await fetch(`${this.apiBase}/ai/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, contentType })
    })
    return response.json()
  }

  async createProjectProposal(leadId: string, analysisData: any): Promise<{
    proposal: string
    timeline: string[]
    pricing: any
    deliverables: string[]
  }> {
    const response = await fetch(`${this.apiBase}/ai/create-proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, analysisData })
    })
    return response.json()
  }

  async generateLandingPageConcept(leadId: string, businessData: any): Promise<{
    concept: string
    wireframe: any
    designTokens: any
    contentSuggestions: string[]
  }> {
    const response = await fetch(`${this.apiBase}/ai/landing-page-concept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, businessData })
    })
    return response.json()
  }

  // ==================== PROMPT TEMPLATES ====================

  async getPromptTemplates(category?: string): Promise<Array<{
    id: string
    name: string
    type: string
    template: string
    variables: string[]
    successRate: number
    usage: number
  }>> {
    const params = category ? `?category=${category}` : ''
    const response = await fetch(`${this.apiBase}/ai/prompt-templates${params}`)
    return response.json()
  }

  async createPromptTemplate(template: {
    name: string
    type: string
    template: string
    variables: string[]
    category: string
  }): Promise<any> {
    const response = await fetch(`${this.apiBase}/ai/prompt-templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    })
    return response.json()
  }

  async executePromptTemplate(templateId: string, leadId: string, variables: Record<string, any>): Promise<{
    generatedContent: string
    confidence: number
    suggestions: string[]
  }> {
    const response = await fetch(`${this.apiBase}/ai/execute-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, leadId, variables })
    })
    return response.json()
  }

  // ==================== PIPELINE MANAGEMENT ====================

  async getPipelines(): Promise<Pipeline[]> {
    const response = await fetch(`${this.apiBase}/pipelines`)
    return response.json()
  }

  async moveLeadToStage(leadId: string, stageId: string): Promise<boolean> {
    const response = await fetch(`${this.apiBase}/leads/${leadId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId })
    })
    return response.ok
  }

  // ==================== ANALYTICS & REPORTING ====================

  async getDashboardMetrics(): Promise<{
    totalLeads: number
    hotLeads: number
    conversionRate: number
    pipelineValue: number
    activitiesCompleted: number
    averageScore: number
    monthlyGrowth: number
    topSources: Array<{ source: string; count: number }>
  }> {
    try {
      const response = await fetch(`${this.apiBase}/analytics/dashboard`)
      if (!response.ok) throw new Error('API not available')
      return response.json()
    } catch (error) {
      // Mock data fallback
      const { getLeads } = await import('@/lib/leadService')
      const leads = getLeads()

      return {
        totalLeads: leads.length,
        hotLeads: leads.filter(lead => (lead.calculated_score || 0) >= 80).length,
        conversionRate: 23.5,
        pipelineValue: 2010000,
        activitiesCompleted: 156,
        averageScore: leads.reduce((sum, lead) => sum + (lead.calculated_score || 0), 0) / leads.length,
        monthlyGrowth: 12.3,
        topSources: [
          { source: 'scraper', count: 245 },
          { source: 'website', count: 89 },
          { source: 'referral', count: 45 },
          { source: 'social_media', count: 23 }
        ]
      }
    }
  }

  async getLeadConversionFunnel(): Promise<Array<{
    stage: string
    count: number
    conversionRate: number
  }>> {
    try {
      const response = await fetch(`${this.apiBase}/analytics/funnel`)
      if (!response.ok) throw new Error('API not available')
      return response.json()
    } catch (error) {
      // Mock funnel data
      return [
        { stage: 'New Leads', count: 402, conversionRate: 100 },
        { stage: 'Contacted', count: 298, conversionRate: 74.1 },
        { stage: 'Qualified', count: 156, conversionRate: 38.8 },
        { stage: 'Proposal', count: 89, conversionRate: 22.1 },
        { stage: 'Negotiation', count: 45, conversionRate: 11.2 },
        { stage: 'Converted', count: 23, conversionRate: 5.7 }
      ]
    }
  }

  async getTeamPerformance(): Promise<Array<{
    userId: string
    name: string
    leadsAssigned: number
    leadsConverted: number
    conversionRate: number
    activitiesCompleted: number
    averageResponseTime: number
  }>> {
    const response = await fetch(`${this.apiBase}/analytics/team`)
    return response.json()
  }

  async generateReport(reportConfig: Partial<Report>): Promise<Blob> {
    const response = await fetch(`${this.apiBase}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportConfig)
    })
    return response.blob()
  }

  // ==================== SETTINGS ====================

  async getSettings(): Promise<CRMSettings> {
    const response = await fetch(`${this.apiBase}/settings`)
    return response.json()
  }

  async updateSettings(settings: Partial<CRMSettings>): Promise<CRMSettings> {
    const response = await fetch(`${this.apiBase}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    return response.json()
  }

  // ==================== SEARCH & FILTERING ====================

  async searchLeads(query: string, filters?: any): Promise<Lead[]> {
    const params = new URLSearchParams({ q: query, ...filters })
    const response = await fetch(`${this.apiBase}/search/leads?${params}`)
    return response.json()
  }

  async getFilterOptions(): Promise<{
    sources: string[]
    statuses: string[]
    stages: string[]
    businessTypes: string[]
    locations: string[]
    assignees: Array<{ id: string; name: string }>
  }> {
    const response = await fetch(`${this.apiBase}/filters/options`)
    return response.json()
  }
}

export const crmService = new CRMService()
export default crmService
