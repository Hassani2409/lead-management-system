'use client'

import { useState, useEffect } from 'react'
import { Lead } from '@/types/crm'
import { crmService } from '@/services/crmService'
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
  CogIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface DeepResearchAnalysis {
  leadId: string
  websiteAnalysis: {
    painPoints: string[]
    opportunities: string[]
    technicalStack: string[]
    designQuality: number
    contentQuality: number
    seoScore: number
  }
  businessAnalysis: {
    industry: string
    businessModel: string
    targetAudience: string[]
    competitiveAdvantages: string[]
    challenges: string[]
    marketPosition: string
  }
  aiRecommendations: {
    nextActions: string[]
    emailTemplates: string[]
    proposalOutline: string[]
    followUpStrategy: string[]
  }
  generatedContent: {
    personalizedEmail: string
    projectProposal: string
    landingPageConcept: string
    designSystemTokens: any
  }
  analysisScore: number
  lastUpdated: string
}

interface AIPromptTemplate {
  id: string
  name: string
  type: 'email' | 'proposal' | 'follow_up' | 'analysis' | 'landing_page'
  template: string
  variables: string[]
  successRate: number
  usage: number
}

export default function DeepResearchCRM() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [analysis, setAnalysis] = useState<DeepResearchAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'analysis' | 'prompts' | 'content' | 'automation'>('analysis')
  const [promptTemplates, setPromptTemplates] = useState<AIPromptTemplate[]>([])
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    loadLeads()
    loadPromptTemplates()
  }, [])

  const loadLeads = async () => {
    try {
      const leadsData = await crmService.getLeads()
      setLeads(leadsData)
    } catch (error) {
      console.error('Error loading leads:', error)
    }
  }

  const loadPromptTemplates = async () => {
    // Mock data - in real implementation, load from API
    setPromptTemplates([
      {
        id: '1',
        name: 'Restaurant Outreach Email',
        type: 'email',
        template: 'Hallo {{name}}, ich habe Ihre Website {{website}} analysiert und {{painpoint}} identifiziert...',
        variables: ['name', 'website', 'painpoint', 'solution'],
        successRate: 85,
        usage: 142
      },
      {
        id: '2',
        name: 'Bakery Modernization Proposal',
        type: 'proposal',
        template: 'Projektvorschlag für {{company}}: Digitale Transformation Ihrer Bäckerei...',
        variables: ['company', 'current_challenges', 'proposed_solutions'],
        successRate: 92,
        usage: 67
      },
      {
        id: '3',
        name: 'Hotel Website Analysis',
        type: 'analysis',
        template: 'Deep-Research Analyse für {{hotel_name}}: Ihre aktuelle Website zeigt {{strengths}} aber {{weaknesses}}...',
        variables: ['hotel_name', 'strengths', 'weaknesses', 'opportunities'],
        successRate: 78,
        usage: 89
      }
    ])
  }

  const runDeepResearchAnalysis = async (lead: Lead) => {
    setLoading(true)
    try {
      // Simulate deep research analysis using existing AI-LeadAnalyse system
      const mockAnalysis: DeepResearchAnalysis = {
        leadId: lead.id,
        websiteAnalysis: {
          painPoints: [
            'Veraltetes Design aus 2018',
            'Keine mobile Optimierung',
            'Langsame Ladezeiten (4.2s)',
            'Fehlende Online-Buchung'
          ],
          opportunities: [
            'Moderne Responsive Website',
            'Online-Reservierungssystem',
            'Social Media Integration',
            'SEO-Optimierung'
          ],
          technicalStack: ['WordPress', 'PHP 7.4', 'MySQL', 'Apache'],
          designQuality: 45,
          contentQuality: 62,
          seoScore: 38
        },
        businessAnalysis: {
          industry: lead.business_type || 'Restaurant',
          businessModel: 'B2C Service',
          targetAudience: ['Lokale Kunden', 'Touristen', 'Geschäftskunden'],
          competitiveAdvantages: ['Traditionelle Küche', 'Zentrale Lage', 'Familiengeführt'],
          challenges: ['Digitale Präsenz', 'Online-Marketing', 'Moderne Buchungssysteme'],
          marketPosition: 'Etabliert, aber digital unterrepräsentiert'
        },
        aiRecommendations: {
          nextActions: [
            'Website-Modernisierung vorschlagen',
            'Online-Buchungssystem implementieren',
            'Social Media Strategie entwickeln',
            'SEO-Audit durchführen'
          ],
          emailTemplates: [
            'Personalisierte Erstansprache',
            'Website-Analyse Präsentation',
            'Projektvorschlag Follow-up'
          ],
          proposalOutline: [
            'Aktuelle Situation & Herausforderungen',
            'Lösungsansatz & Technologie',
            'Projektphasen & Timeline',
            'Investment & ROI'
          ],
          followUpStrategy: [
            'Tag 1: Analyse-Report senden',
            'Tag 3: Telefontermin vereinbaren',
            'Tag 7: Projektvorschlag präsentieren',
            'Tag 14: Entscheidung einholen'
          ]
        },
        generatedContent: {
          personalizedEmail: `Hallo ${lead.fullName},

ich habe Ihre Website ${lead.website} analysiert und interessante Optimierungsmöglichkeiten entdeckt. Besonders aufgefallen sind mir:

• Ihre authentische Küche und der Charme Ihres Restaurants
• Das Potenzial für eine moderne, mobile Website
• Möglichkeiten für ein Online-Reservierungssystem

Gerne zeige ich Ihnen in einem 15-minütigen Gespräch, wie Sie mit gezielten digitalen Maßnahmen mehr Gäste erreichen können.

Beste Grüße,
[Ihr Name]`,
          projectProposal: `# Projektvorschlag: Digitale Transformation für ${lead.fullName}

## Ausgangssituation
Ihre Website zeigt Potenzial, benötigt aber moderne Optimierungen für bessere Kundengewinnung.

## Lösungsansatz
1. Responsive Website-Redesign
2. Online-Buchungssystem
3. SEO-Optimierung
4. Social Media Integration

## Timeline: 6-8 Wochen
## Investment: €4.500 - €7.500`,
          landingPageConcept: 'Moderne Restaurant-Website mit Online-Reservierung und Menü-Showcase',
          designSystemTokens: {
            colors: { primary: '#8B4513', secondary: '#D2691E', accent: '#F4A460' },
            fonts: { heading: 'Playfair Display', body: 'Source Sans Pro' },
            spacing: { small: '8px', medium: '16px', large: '32px' }
          }
        },
        analysisScore: 87,
        lastUpdated: new Date().toISOString()
      }

      setAnalysis(mockAnalysis)
    } catch (error) {
      console.error('Error running analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAIContent = async (templateId: string, leadId: string) => {
    setLoading(true)
    try {
      // Simulate AI content generation using existing prompt system
      const template = promptTemplates.find(t => t.id === templateId)
      if (!template || !selectedLead) return

      // Use existing AI prompt generation system
      const generatedContent = await crmService.generateEmailTemplate(leadId, template.type)
      
      // Update analysis with generated content
      if (analysis) {
        setAnalysis({
          ...analysis,
          generatedContent: {
            ...analysis.generatedContent,
            personalizedEmail: generatedContent
          }
        })
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <SparklesIcon className="w-8 h-8 text-purple-600" />
                  Deep Research CRM
                </h1>
                <p className="text-gray-600 mt-1">AI-powered lead analysis and content generation</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Settings
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  New Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lead Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Lead</h3>
              <div className="space-y-3">
                {leads.slice(0, 10).map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedLead?.id === lead.id
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{lead.fullName}</div>
                    <div className="text-sm text-gray-500">{lead.company}</div>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        lead.scoreCategory === 'hot' ? 'bg-red-100 text-red-800' :
                        lead.scoreCategory === 'warm' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        Score: {lead.score}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedLead ? (
              <div className="space-y-6">
                {/* Lead Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedLead.fullName}</h2>
                      <p className="text-gray-600">{selectedLead.company} • {selectedLead.business_type}</p>
                    </div>
                    <button
                      onClick={() => runDeepResearchAnalysis(selectedLead)}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <MagnifyingGlassIcon className="w-4 h-4" />
                      )}
                      {loading ? 'Analyzing...' : 'Run Deep Analysis'}
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {[
                        { id: 'analysis', name: 'Analysis', icon: ChartBarIcon },
                        { id: 'prompts', name: 'AI Prompts', icon: SparklesIcon },
                        { id: 'content', name: 'Generated Content', icon: DocumentTextIcon },
                        { id: 'automation', name: 'Automation', icon: CogIcon }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                            activeTab === tab.id
                              ? 'border-purple-500 text-purple-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === 'analysis' && analysis && (
                      <div className="space-y-6">
                        {/* Analysis Score */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-600">{analysis.analysisScore}</div>
                            <div className="text-sm text-gray-600">Overall Score</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">{analysis.websiteAnalysis.designQuality}</div>
                            <div className="text-sm text-gray-600">Design Quality</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">{analysis.websiteAnalysis.seoScore}</div>
                            <div className="text-sm text-gray-600">SEO Score</div>
                          </div>
                        </div>

                        {/* Pain Points & Opportunities */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                              Pain Points
                            </h4>
                            <ul className="space-y-2">
                              {analysis.websiteAnalysis.painPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-red-500 mt-1">•</span>
                                  <span className="text-gray-700">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <LightBulbIcon className="w-5 h-5 text-green-500" />
                              Opportunities
                            </h4>
                            <ul className="space-y-2">
                              {analysis.websiteAnalysis.opportunities.map((opportunity, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  <span className="text-gray-700">{opportunity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* AI Recommendations */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-purple-500" />
                            AI Recommendations
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analysis.aiRecommendations.nextActions.map((action, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium text-gray-900">{action}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'prompts' && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">AI Prompt Templates</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {promptTemplates.map((template) => (
                            <div key={template.id} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{template.name}</h5>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  template.type === 'email' ? 'bg-blue-100 text-blue-800' :
                                  template.type === 'proposal' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {template.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{template.template.substring(0, 100)}...</p>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  Success: {template.successRate}% • Used: {template.usage}x
                                </div>
                                <button
                                  onClick={() => generateAIContent(template.id, selectedLead.id)}
                                  className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                                >
                                  Generate
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'content' && analysis && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Generated Email</h4>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700">
                              {analysis.generatedContent.personalizedEmail}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Project Proposal</h4>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700">
                              {analysis.generatedContent.projectProposal}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'automation' && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Automation Workflows</h4>
                        <div className="text-center py-8 text-gray-500">
                          <CogIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p>Automation workflows coming soon...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <InformationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Lead</h3>
                <p className="text-gray-600">Choose a lead from the sidebar to start deep research analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
