/**
 * Comprehensive CRM System Types
 * HubSpot-like CRM with advanced features
 */

export interface Contact {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  mobile?: string
  website?: string
  company?: string
  jobTitle?: string
  address?: Address
  socialProfiles?: SocialProfile[]
  tags: string[]
  customFields: Record<string, any>
  createdAt: string
  updatedAt: string
  lastContactedAt?: string
  source: LeadSource
  assignedTo?: string
  avatar?: string
}

export interface Address {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface SocialProfile {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'xing'
  url: string
  username?: string
}

export interface Lead extends Contact {
  score: number
  scoreCategory: 'hot' | 'warm' | 'cold' | 'poor'
  status: LeadStatus
  stage: LeadStage
  priority: 'high' | 'medium' | 'low'
  estimatedValue?: number
  probability?: number
  expectedCloseDate?: string
  lostReason?: string
  qualificationNotes?: string
  interactions: Interaction[]
  activities: Activity[]
  projects: string[]
  campaigns: string[]
  business_type?: string
  calculated_score?: number
  score_category?: string
  score_label?: string
  score_priority?: number
  scoring_factors?: {
    completeness: number
    verification: number
    business_value: number
    location: number
    source: number
    freshness: number
  }
  scoring_updated?: string
  revenue_estimate?: number
  ai_score?: number
  location?: string
  folder_name?: string
  name?: string
  created_at?: string
}

export type LeadStatus = 
  | 'new'
  | 'contacted' 
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'converted'
  | 'lost'
  | 'nurturing'

export type LeadStage = 
  | 'awareness'
  | 'interest'
  | 'consideration'
  | 'intent'
  | 'evaluation'
  | 'purchase'

export type LeadSource = 
  | 'website'
  | 'social_media'
  | 'email_campaign'
  | 'referral'
  | 'cold_outreach'
  | 'event'
  | 'webinar'
  | 'content_download'
  | 'scraper'
  | 'manual'
  | 'import'

export interface Interaction {
  id: string
  type: InteractionType
  direction: 'inbound' | 'outbound'
  subject?: string
  content?: string
  duration?: number
  outcome?: string
  scheduledAt?: string
  completedAt?: string
  createdBy: string
  attachments?: string[]
  metadata?: Record<string, any>
}

export type InteractionType = 
  | 'email'
  | 'call'
  | 'meeting'
  | 'note'
  | 'task'
  | 'sms'
  | 'social'
  | 'website_visit'
  | 'document_view'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  completedAt?: string
  assignedTo: string
  createdBy: string
  relatedLeads: string[]
  relatedProjects: string[]
  estimatedDuration?: number
  actualDuration?: number
  tags: string[]
}

export type ActivityType = 
  | 'follow_up_call'
  | 'send_email'
  | 'schedule_meeting'
  | 'send_proposal'
  | 'demo'
  | 'research'
  | 'qualification'
  | 'nurturing'

export interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  type: 'campaign' | 'outreach' | 'nurturing' | 'event' | 'product_launch'
  startDate: string
  endDate?: string
  budget?: number
  actualCost?: number
  targetLeads?: number
  convertedLeads?: number
  assignedTeam: string[]
  leads: string[]
  activities: string[]
  kpis: ProjectKPI[]
  tags: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ProjectKPI {
  name: string
  target: number
  actual: number
  unit: string
  description?: string
}

export interface Campaign {
  id: string
  name: string
  type: 'email' | 'social' | 'content' | 'event' | 'webinar' | 'cold_outreach'
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
  startDate: string
  endDate?: string
  budget?: number
  spent?: number
  targetAudience: string[]
  content: CampaignContent[]
  metrics: CampaignMetrics
  leads: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CampaignContent {
  id: string
  type: 'email' | 'social_post' | 'ad' | 'landing_page' | 'blog_post'
  title: string
  content: string
  subject?: string
  cta?: string
  scheduledAt?: string
  publishedAt?: string
  metrics?: ContentMetrics
}

export interface CampaignMetrics {
  impressions?: number
  clicks?: number
  opens?: number
  responses?: number
  conversions?: number
  cost_per_lead?: number
  roi?: number
}

export interface ContentMetrics {
  views?: number
  clicks?: number
  shares?: number
  comments?: number
  downloads?: number
  engagement_rate?: number
}

export interface Team {
  id: string
  name: string
  description?: string
  members: TeamMember[]
  permissions: TeamPermissions
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  userId: string
  role: 'admin' | 'manager' | 'sales_rep' | 'marketing' | 'viewer'
  permissions: string[]
  joinedAt: string
}

export interface TeamPermissions {
  leads: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    assign: boolean
  }
  projects: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    manage: boolean
  }
  campaigns: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    manage: boolean
  }
  reports: {
    view: boolean
    create: boolean
    export: boolean
  }
  settings: {
    view: boolean
    edit: boolean
  }
}

export interface AIPrompt {
  id: string
  name: string
  type: 'email_template' | 'follow_up' | 'qualification' | 'proposal' | 'nurturing'
  prompt: string
  variables: string[]
  category: string
  tags: string[]
  usage_count: number
  success_rate?: number
  createdBy: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface AIRecommendation {
  id: string
  leadId: string
  type: 'next_action' | 'email_template' | 'qualification' | 'scoring_update'
  title: string
  description: string
  confidence: number
  reasoning: string[]
  suggestedActions: SuggestedAction[]
  createdAt: string
  status: 'pending' | 'accepted' | 'rejected' | 'implemented'
}

export interface SuggestedAction {
  type: ActivityType
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimatedDuration?: number
  dueDate?: string
}

export interface Pipeline {
  id: string
  name: string
  stages: PipelineStage[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface PipelineStage {
  id: string
  name: string
  order: number
  probability: number
  color: string
  requirements?: string[]
  automations?: StageAutomation[]
}

export interface StageAutomation {
  trigger: 'stage_entry' | 'stage_exit' | 'time_based'
  action: 'send_email' | 'create_task' | 'update_score' | 'assign_user'
  parameters: Record<string, any>
}

export interface Report {
  id: string
  name: string
  type: 'leads' | 'pipeline' | 'activities' | 'campaigns' | 'team_performance'
  filters: ReportFilter[]
  metrics: ReportMetric[]
  visualization: 'table' | 'chart' | 'graph' | 'dashboard'
  schedule?: ReportSchedule
  recipients?: string[]
  createdBy: string
  createdAt: string
  lastGenerated?: string
}

export interface ReportFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in'
  value: any
}

export interface ReportMetric {
  name: string
  field: string
  aggregation: 'count' | 'sum' | 'average' | 'min' | 'max'
  format?: 'number' | 'currency' | 'percentage' | 'date'
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  time: string
  timezone: string
  isActive: boolean
}

export interface CRMSettings {
  company: {
    name: string
    logo?: string
    website?: string
    industry?: string
    size?: string
    timezone: string
    currency: string
  }
  scoring: {
    factors: ScoringFactor[]
    weights: Record<string, number>
    thresholds: {
      hot: number
      warm: number
      cold: number
    }
  }
  automation: {
    lead_assignment: boolean
    email_notifications: boolean
    task_reminders: boolean
    score_updates: boolean
  }
  integrations: {
    email: boolean
    calendar: boolean
    social_media: boolean
    analytics: boolean
  }
  privacy: {
    gdpr_compliance: boolean
    data_retention_days: number
    consent_tracking: boolean
  }
}

export interface ScoringFactor {
  name: string
  field: string
  weight: number
  rules: ScoringRule[]
}

export interface ScoringRule {
  condition: string
  operator: string
  value: any
  points: number
}
