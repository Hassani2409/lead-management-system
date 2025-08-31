"""
BeautifulSoup-based data parser for extracting structured data from HTML
"""
import re
from typing import List, Dict, Optional, Any
from bs4 import BeautifulSoup, Tag
from urllib.parse import urljoin, urlparse
from loguru import logger
from config.settings import PAIN_POINT_KEYWORDS, TARGET_FIELDS


class DataParser:
    """Handles HTML parsing and data extraction using BeautifulSoup"""
    
    def __init__(self, html_content: str, base_url: str = ""):
        self.soup = BeautifulSoup(html_content, 'lxml')
        self.base_url = base_url
        self.extracted_data = {}
    
    def extract_text_content(self, selector: str) -> Optional[str]:
        """Extract text content from CSS selector"""
        try:
            element = self.soup.select_one(selector)
            if element:
                return element.get_text(strip=True)
        except Exception as e:
            logger.warning(f"Failed to extract text from {selector}: {e}")
        return None
    
    def extract_multiple_texts(self, selector: str) -> List[str]:
        """Extract text from multiple elements matching selector"""
        try:
            elements = self.soup.select(selector)
            return [elem.get_text(strip=True) for elem in elements if elem.get_text(strip=True)]
        except Exception as e:
            logger.warning(f"Failed to extract multiple texts from {selector}: {e}")
        return []
    
    def extract_attribute(self, selector: str, attribute: str) -> Optional[str]:
        """Extract attribute value from element"""
        try:
            element = self.soup.select_one(selector)
            if element:
                return element.get(attribute)
        except Exception as e:
            logger.warning(f"Failed to extract attribute {attribute} from {selector}: {e}")
        return None
    
    def extract_links(self, selector: str = "a[href]") -> List[Dict[str, str]]:
        """Extract all links from page"""
        links = []
        try:
            for link in self.soup.select(selector):
                href = link.get('href')
                text = link.get_text(strip=True)
                if href:
                    full_url = urljoin(self.base_url, href)
                    links.append({
                        'url': full_url,
                        'text': text,
                        'domain': urlparse(full_url).netloc
                    })
        except Exception as e:
            logger.warning(f"Failed to extract links: {e}")
        return links
    
    def find_emails(self, text: str = None) -> List[str]:
        """Find email addresses in text or entire page"""
        if text is None:
            text = self.soup.get_text()
        
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text, re.IGNORECASE)
        
        # Filter out common false positives
        filtered_emails = []
        for email in emails:
            if not any(exclude in email.lower() for exclude in ['example.com', 'test.com', 'placeholder']):
                filtered_emails.append(email.lower())
        
        return list(set(filtered_emails))  # Remove duplicates
    
    def find_phone_numbers(self, text: str = None) -> List[str]:
        """Find phone numbers in text or entire page"""
        if text is None:
            text = self.soup.get_text()
        
        # German phone number patterns
        phone_patterns = [
            r'\+49\s?[0-9\s\-\(\)]{10,}',  # German international format
            r'0[0-9\s\-\(\)]{10,}',        # German national format
            r'\([0-9]{3,5}\)\s?[0-9\s\-]{6,}',  # Format with area code in parentheses
            r'[0-9]{3,5}[\s\-][0-9]{6,}',  # Simple format with separator
        ]
        
        phones = []
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            phones.extend(matches)
        
        # Clean phone numbers
        cleaned_phones = []
        for phone in phones:
            cleaned = re.sub(r'[^\d+]', '', phone)
            if len(cleaned) >= 10:  # Minimum length for valid phone
                cleaned_phones.append(phone.strip())
        
        return list(set(cleaned_phones))
    
    def find_social_handles(self) -> Dict[str, str]:
        """Find social media handles and profiles"""
        social_handles = {}
        
        # Social media patterns
        social_patterns = {
            'instagram': [
                r'instagram\.com/([a-zA-Z0-9_.]+)',
                r'@([a-zA-Z0-9_.]+)',  # Generic @ mention
            ],
            'facebook': [
                r'facebook\.com/([a-zA-Z0-9_.]+)',
                r'fb\.com/([a-zA-Z0-9_.]+)',
            ],
            'linkedin': [
                r'linkedin\.com/in/([a-zA-Z0-9\-]+)',
                r'linkedin\.com/company/([a-zA-Z0-9\-]+)',
            ],
            'twitter': [
                r'twitter\.com/([a-zA-Z0-9_]+)',
                r'x\.com/([a-zA-Z0-9_]+)',
            ],
            'youtube': [
                r'youtube\.com/c/([a-zA-Z0-9_]+)',
                r'youtube\.com/channel/([a-zA-Z0-9_]+)',
            ]
        }
        
        page_text = self.soup.get_text()
        
        for platform, patterns in social_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, page_text, re.IGNORECASE)
                if matches:
                    # Take the first match for each platform
                    social_handles[platform] = matches[0]
                    break
        
        return social_handles
    
    def extract_pain_points(self, text: str = None) -> List[str]:
        """Extract pain points based on keyword matching"""
        if text is None:
            text = self.soup.get_text().lower()
        
        found_pain_points = []
        
        for category, keywords in PAIN_POINT_KEYWORDS.items():
            for keyword in keywords:
                if keyword.lower() in text:
                    found_pain_points.append(category)
                    break  # Only add category once
        
        return found_pain_points
    
    def extract_business_info(self, selectors: Dict[str, str]) -> Dict[str, Any]:
        """Extract business information using provided selectors"""
        business_info = {}
        
        for field, selector in selectors.items():
            if field in ['name', 'industry', 'address']:
                business_info[field] = self.extract_text_content(selector)
            elif field in ['website', 'phone']:
                # Try to extract from href or text
                attr_value = self.extract_attribute(selector, 'href')
                if not attr_value:
                    attr_value = self.extract_text_content(selector)
                business_info[field] = attr_value
            elif field == 'followers':
                follower_text = self.extract_text_content(selector)
                if follower_text:
                    business_info[field] = self.parse_follower_count(follower_text)
        
        return business_info
    
    def parse_follower_count(self, text: str) -> Optional[int]:
        """Parse follower count from text (handles K, M suffixes)"""
        if not text:
            return None
        
        # Remove non-numeric characters except K, M, k, m
        cleaned = re.sub(r'[^\d.,KMkm]', '', text)
        
        try:
            if 'k' in cleaned.lower():
                number = float(cleaned.lower().replace('k', '').replace(',', '.'))
                return int(number * 1000)
            elif 'm' in cleaned.lower():
                number = float(cleaned.lower().replace('m', '').replace(',', '.'))
                return int(number * 1000000)
            else:
                return int(cleaned.replace(',', '').replace('.', ''))
        except (ValueError, AttributeError):
            return None
    
    def extract_structured_data(self) -> Dict[str, Any]:
        """Extract structured data (JSON-LD, microdata)"""
        structured_data = {}
        
        # Extract JSON-LD
        json_scripts = self.soup.find_all('script', type='application/ld+json')
        for script in json_scripts:
            try:
                import json
                data = json.loads(script.string)
                if isinstance(data, dict):
                    structured_data.update(data)
            except (json.JSONDecodeError, AttributeError):
                continue
        
        # Extract microdata
        microdata_items = self.soup.find_all(attrs={'itemtype': True})
        for item in microdata_items:
            item_type = item.get('itemtype', '')
            if 'Organization' in item_type or 'LocalBusiness' in item_type:
                props = item.find_all(attrs={'itemprop': True})
                for prop in props:
                    prop_name = prop.get('itemprop')
                    prop_value = prop.get('content') or prop.get_text(strip=True)
                    if prop_name and prop_value:
                        structured_data[prop_name] = prop_value
        
        return structured_data
    
    def find_contact_section(self) -> Optional[Tag]:
        """Find contact information section"""
        contact_keywords = ['kontakt', 'contact', 'impressum', 'imprint', 'about']
        
        for keyword in contact_keywords:
            # Look for sections with contact-related text
            sections = self.soup.find_all(['section', 'div', 'footer'], 
                                        string=re.compile(keyword, re.IGNORECASE))
            if sections:
                return sections[0]
            
            # Look for elements with contact-related IDs or classes
            elements = self.soup.find_all(attrs={'id': re.compile(keyword, re.IGNORECASE)})
            if elements:
                return elements[0]
            
            elements = self.soup.find_all(attrs={'class': re.compile(keyword, re.IGNORECASE)})
            if elements:
                return elements[0]
        
        return None
    
    def extract_all_data(self, platform_selectors: Dict[str, str] = None) -> Dict[str, Any]:
        """Extract all available data from the page"""
        data = {}
        
        # Extract basic information
        if platform_selectors:
            data.update(self.extract_business_info(platform_selectors))
        
        # Extract contact information
        data['emails'] = self.find_emails()
        data['phones'] = self.find_phone_numbers()
        data['social_handles'] = self.find_social_handles()
        
        # Extract pain points
        data['pain_points'] = self.extract_pain_points()
        
        # Extract structured data
        structured = self.extract_structured_data()
        if structured:
            data['structured_data'] = structured
        
        # Extract all links
        data['links'] = self.extract_links()
        
        return data
