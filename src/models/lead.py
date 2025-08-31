"""
Lead data model for storing and managing scraped data
"""
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from datetime import datetime
import re
import json
import pandas as pd


@dataclass
class Lead:
    """Data model for a lead/prospect"""
    
    # Required fields
    name: str
    platform: str
    source_url: str
    
    # Contact information
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    
    # Social media data
    followers: Optional[int] = None
    engagement_rate: Optional[float] = None
    social_handles: Dict[str, str] = field(default_factory=dict)
    
    # Business information
    industry: Optional[str] = None
    business_type: Optional[str] = None
    pain_points: List[str] = field(default_factory=list)
    
    # Lead scoring
    lead_score: int = 0
    score_breakdown: Dict[str, int] = field(default_factory=dict)
    
    # Metadata
    scraped_at: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)
    notes: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        """Validate and clean data after initialization"""
        self.clean_data()
        self.calculate_lead_score()
    
    def clean_data(self):
        """Clean and validate lead data"""
        # Clean name
        if self.name:
            self.name = self.name.strip()
        
        # Validate and clean email
        if self.email and not pd.isna(self.email):
            self.email = str(self.email).strip().lower()
            if not self._is_valid_email(self.email):
                self.email = None
        else:
            self.email = None
        
        # Clean phone number
        if self.phone:
            self.phone = self._clean_phone(self.phone)
        
        # Clean website URL
        if self.website and not pd.isna(self.website):
            self.website = self._clean_url(str(self.website))
        else:
            self.website = None
        
        # Clean social handles
        if self.social_handles:
            self.social_handles = {k: v for k, v in self.social_handles.items() if v}
        else:
            self.social_handles = {}
    
    def calculate_lead_score(self):
        """Calculate lead score based on available data and pain points"""
        score = 0
        breakdown = {}
        
        # Contact information scoring
        if self.email:
            score += 20
            breakdown['email'] = 20
        if self.phone:
            score += 15
            breakdown['phone'] = 15
        if self.website:
            score += 10
            breakdown['website'] = 10
        
        # Social media presence scoring
        if self.followers:
            if self.followers > 10000:
                score += 15
                breakdown['high_followers'] = 15
            elif self.followers > 1000:
                score += 10
                breakdown['medium_followers'] = 10
            else:
                score += 5
                breakdown['low_followers'] = 5
        
        if self.engagement_rate and self.engagement_rate > 0.03:  # 3%+
            score += 10
            breakdown['high_engagement'] = 10
        
        # Pain points scoring
        pain_point_score = len(self.pain_points) * 5
        if pain_point_score > 0:
            score += pain_point_score
            breakdown['pain_points'] = pain_point_score
        
        # Business information scoring
        if self.industry:
            score += 5
            breakdown['industry'] = 5
        
        self.lead_score = min(score, 100)  # Cap at 100
        self.score_breakdown = breakdown
    
    def add_pain_point(self, pain_point: str):
        """Add a pain point and recalculate score"""
        if pain_point and pain_point not in self.pain_points:
            self.pain_points.append(pain_point)
            self.calculate_lead_score()
    
    def add_social_handle(self, platform: str, handle: str):
        """Add a social media handle"""
        if platform and handle:
            self.social_handles[platform] = handle

    def _get_priority_level(self) -> str:
        """Get priority level based on lead score"""
        if self.lead_score >= 80:
            return "High Priority"
        elif self.lead_score >= 60:
            return "Medium Priority"
        else:
            return "Low Priority"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert lead to dictionary for export"""
        return {
            'name': self.name,
            'platform': self.platform,
            'source_url': self.source_url,
            'website': self.website,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'followers': self.followers,
            'engagement_rate': self.engagement_rate,
            'social_handles': json.dumps(self.social_handles) if self.social_handles else None,
            'industry': self.industry,
            'business_type': self.business_type,
            'pain_points': ', '.join(self.pain_points) if self.pain_points else None,
            'lead_score': self.lead_score,
            'score_breakdown': json.dumps(self.score_breakdown) if self.score_breakdown else None,
            'scraped_at': self.scraped_at.isoformat(),
            'last_updated': self.last_updated.isoformat(),
            'notes': self.notes,
            'tags': ', '.join(self.tags) if self.tags else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Lead':
        """Create lead from dictionary"""
        # Remove fields that are not part of Lead.__init__
        clean_data = data.copy()
        clean_data.pop('data_quality_score', None)  # Remove validation score

        # Handle JSON fields
        if isinstance(clean_data.get('social_handles'), str):
            clean_data['social_handles'] = json.loads(clean_data['social_handles'])
        if isinstance(clean_data.get('score_breakdown'), str):
            clean_data['score_breakdown'] = json.loads(clean_data['score_breakdown'])
        if isinstance(clean_data.get('pain_points'), str):
            clean_data['pain_points'] = clean_data['pain_points'].split(', ')
        if isinstance(clean_data.get('tags'), str):
            clean_data['tags'] = clean_data['tags'].split(', ')

        # Handle datetime fields
        if isinstance(clean_data.get('scraped_at'), str):
            clean_data['scraped_at'] = datetime.fromisoformat(clean_data['scraped_at'])
        if isinstance(clean_data.get('last_updated'), str):
            clean_data['last_updated'] = datetime.fromisoformat(clean_data['last_updated'])

        return cls(**clean_data)
    
    def _is_valid_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def _clean_phone(self, phone: str) -> str:
        """Clean phone number"""
        if not phone or pd.isna(phone):
            return None

        # Convert to string if it's not already
        phone_str = str(phone)

        # Remove all non-digit characters except +
        cleaned = re.sub(r'[^\d+]', '', phone_str)
        return cleaned if len(cleaned) >= 7 else None
    
    def _clean_url(self, url: str) -> str:
        """Clean and validate URL"""
        url = url.strip()
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        return url
    
    def __str__(self) -> str:
        return f"Lead(name='{self.name}', platform='{self.platform}', score={self.lead_score})"
    
    def __repr__(self) -> str:
        return self.__str__()
