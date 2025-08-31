"""
Data validation utilities for lead information
"""
import re
import requests
from typing import Optional, List, Dict, Any
from urllib.parse import urlparse
from loguru import logger


class DataValidator:
    """Validates and cleans scraped data"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        if not email:
            return False
        
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email.strip()) is not None
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        if not phone:
            return False
        
        # Remove all non-digit characters except +
        cleaned = re.sub(r'[^\d+]', '', phone)
        
        # Check if it's a reasonable phone number length
        return 7 <= len(cleaned) <= 15
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Validate URL format"""
        if not url:
            return False
        
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    @staticmethod
    def clean_phone_number(phone: str) -> Optional[str]:
        """Clean and format phone number"""
        if not phone:
            return None
        
        # Remove all non-digit characters except +
        cleaned = re.sub(r'[^\d+]', '', phone)
        
        # German phone number formatting
        if cleaned.startswith('+49'):
            # International format
            return cleaned
        elif cleaned.startswith('0'):
            # National format - convert to international
            return '+49' + cleaned[1:]
        elif len(cleaned) >= 10:
            # Assume it's missing country code
            return '+49' + cleaned
        
        return cleaned if DataValidator.validate_phone(cleaned) else None
    
    @staticmethod
    def clean_email(email: str) -> Optional[str]:
        """Clean and validate email"""
        if not email:
            return None
        
        email = email.strip().lower()
        
        # Remove common prefixes/suffixes
        email = re.sub(r'^(mailto:|email:)', '', email)
        
        return email if DataValidator.validate_email(email) else None
    
    @staticmethod
    def clean_url(url: str) -> Optional[str]:
        """Clean and validate URL"""
        if not url:
            return None
        
        url = url.strip()
        
        # Add protocol if missing
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        # Remove common tracking parameters
        url = re.sub(r'[?&](utm_|fbclid|gclid)[^&]*', '', url)
        
        return url if DataValidator.validate_url(url) else None
    
    @staticmethod
    def extract_domain(url: str) -> Optional[str]:
        """Extract domain from URL"""
        try:
            parsed = urlparse(url)
            return parsed.netloc.lower()
        except:
            return None
    
    @staticmethod
    def validate_social_handle(platform: str, handle: str) -> bool:
        """Validate social media handle format"""
        if not handle:
            return False
        
        patterns = {
            'instagram': r'^[a-zA-Z0-9_.]{1,30}$',
            'facebook': r'^[a-zA-Z0-9.]{5,50}$',
            'twitter': r'^[a-zA-Z0-9_]{1,15}$',
            'linkedin': r'^[a-zA-Z0-9\-]{3,100}$'
        }
        
        pattern = patterns.get(platform.lower())
        if not pattern:
            return True  # Unknown platform, assume valid
        
        # Remove @ symbol if present
        handle = handle.lstrip('@')
        
        return re.match(pattern, handle) is not None
    
    @staticmethod
    def detect_business_type(text: str) -> Optional[str]:
        """Detect business type from text"""
        if not text:
            return None
        
        text = text.lower()
        
        business_types = {
            'restaurant': ['restaurant', 'café', 'bistro', 'eatery', 'diner', 'food'],
            'retail': ['shop', 'store', 'boutique', 'retail', 'market'],
            'service': ['service', 'repair', 'maintenance', 'cleaning'],
            'healthcare': ['doctor', 'clinic', 'medical', 'health', 'dental', 'therapy'],
            'fitness': ['gym', 'fitness', 'yoga', 'pilates', 'training'],
            'beauty': ['salon', 'spa', 'beauty', 'hair', 'nails', 'massage'],
            'professional': ['lawyer', 'attorney', 'accountant', 'consultant', 'agency'],
            'education': ['school', 'education', 'training', 'course', 'academy'],
            'automotive': ['auto', 'car', 'mechanic', 'garage', 'automotive'],
            'real_estate': ['real estate', 'property', 'realtor', 'housing']
        }
        
        for business_type, keywords in business_types.items():
            if any(keyword in text for keyword in keywords):
                return business_type
        
        return None
    
    @staticmethod
    def validate_lead_data(lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and clean all lead data"""
        cleaned_data = lead_data.copy()
        
        # Clean email
        if 'email' in cleaned_data:
            cleaned_data['email'] = DataValidator.clean_email(cleaned_data['email'])
        
        # Clean phone
        if 'phone' in cleaned_data:
            cleaned_data['phone'] = DataValidator.clean_phone_number(cleaned_data['phone'])
        
        # Clean website
        if 'website' in cleaned_data:
            cleaned_data['website'] = DataValidator.clean_url(cleaned_data['website'])
        
        # Validate social handles
        if 'social_handles' in cleaned_data and isinstance(cleaned_data['social_handles'], dict):
            valid_handles = {}
            for platform, handle in cleaned_data['social_handles'].items():
                if DataValidator.validate_social_handle(platform, handle):
                    valid_handles[platform] = handle
            cleaned_data['social_handles'] = valid_handles
        
        # Detect business type if not provided
        if not cleaned_data.get('industry') and cleaned_data.get('name'):
            business_type = DataValidator.detect_business_type(cleaned_data['name'])
            if business_type:
                cleaned_data['industry'] = business_type
        
        return cleaned_data
    
    @staticmethod
    def check_url_accessibility(url: str, timeout: int = 5) -> bool:
        """Check if URL is accessible"""
        try:
            response = requests.head(url, timeout=timeout, allow_redirects=True)
            return response.status_code < 400
        except:
            return False
    
    @staticmethod
    def deduplicate_leads(leads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate leads based on multiple criteria"""
        seen = set()
        unique_leads = []
        
        for lead in leads:
            # Create a unique identifier based on multiple fields
            identifiers = []
            
            if lead.get('email'):
                identifiers.append(('email', lead['email'].lower()))
            if lead.get('phone'):
                identifiers.append(('phone', re.sub(r'[^\d+]', '', lead['phone'])))
            if lead.get('website'):
                domain = DataValidator.extract_domain(lead['website'])
                if domain:
                    identifiers.append(('domain', domain))
            if lead.get('name'):
                identifiers.append(('name', lead['name'].lower().strip()))
            
            # Check if any identifier has been seen before
            is_duplicate = False
            for identifier in identifiers:
                if identifier in seen:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                # Add all identifiers to seen set
                for identifier in identifiers:
                    seen.add(identifier)
                unique_leads.append(lead)
        
        logger.info(f"Removed {len(leads) - len(unique_leads)} duplicate leads")
        return unique_leads
    
    @staticmethod
    def score_data_quality(lead_data: Dict[str, Any]) -> int:
        """Score the quality of lead data (0-100)"""
        score = 0
        
        # Required fields
        if lead_data.get('name'):
            score += 20
        
        # Contact information
        if DataValidator.validate_email(lead_data.get('email')):
            score += 25
        if DataValidator.validate_phone(lead_data.get('phone')):
            score += 20
        if DataValidator.validate_url(lead_data.get('website')):
            score += 15
        
        # Additional information
        if lead_data.get('address'):
            score += 5
        if lead_data.get('industry'):
            score += 5
        if lead_data.get('social_handles'):
            score += 5
        if lead_data.get('pain_points'):
            score += 5
        
        return min(score, 100)
    
    @staticmethod
    def validate_batch(leads: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Validate and clean a batch of leads"""
        validated_leads = []
        
        for lead_data in leads:
            try:
                # Validate and clean data
                cleaned_data = DataValidator.validate_lead_data(lead_data)
                
                # Score data quality
                quality_score = DataValidator.score_data_quality(cleaned_data)
                cleaned_data['data_quality_score'] = quality_score
                
                # Only keep leads with minimum quality
                if quality_score >= 20:  # Minimum threshold
                    validated_leads.append(cleaned_data)
                else:
                    logger.debug(f"Filtered out low-quality lead: {cleaned_data.get('name', 'Unknown')}")
                    
            except Exception as e:
                logger.warning(f"Error validating lead data: {e}")
        
        # Remove duplicates
        validated_leads = DataValidator.deduplicate_leads(validated_leads)
        
        logger.info(f"Validated {len(validated_leads)} leads from {len(leads)} original leads")
        return validated_leads
