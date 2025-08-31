"""
Yelp-specific scraper for business listings and reviews
"""
import time
from typing import List, Dict, Optional, Any
from urllib.parse import quote_plus
from loguru import logger

from src.core.selenium_handler import SeleniumHandler
from src.core.data_parser import DataParser
from src.models.lead import Lead
from config.settings import PLATFORM_CONFIGS


class YelpScraper:
    """Scraper for Yelp business listings"""
    
    def __init__(self):
        self.config = PLATFORM_CONFIGS['yelp']
        self.selenium_handler = None
        self.leads = []
    
    def __enter__(self):
        self.selenium_handler = SeleniumHandler(headless=True)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.selenium_handler:
            self.selenium_handler.close()
    
    def search_businesses(self, business_type: str, location: str, max_results: int = 50) -> List[Lead]:
        """Search Yelp for businesses by type and location"""
        leads = []
        
        try:
            # Construct search URL
            search_url = f"https://www.yelp.com/search?find_desc={quote_plus(business_type)}&find_loc={quote_plus(location)}"
            
            logger.info(f"Searching Yelp for: {business_type} in {location}")
            
            if not self.selenium_handler.navigate_to(search_url):
                return leads
            
            time.sleep(3)
            
            # Scroll to load more results
            self.selenium_handler.infinite_scroll(max_scrolls=3)
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, search_url)
            
            # Extract business listings
            business_links = self._extract_business_links(parser)
            
            # Scrape each business
            for business_link in business_links[:max_results]:
                lead = self.scrape_business(business_link)
                if lead:
                    leads.append(lead)
                time.sleep(1)  # Rate limiting
            
            logger.info(f"Found {len(leads)} leads from Yelp search")
            
        except Exception as e:
            logger.error(f"Error searching Yelp businesses: {e}")
        
        return leads
    
    def scrape_business(self, business_url: str) -> Optional[Lead]:
        """Scrape individual Yelp business page"""
        try:
            logger.info(f"Scraping Yelp business: {business_url}")
            
            if not self.selenium_handler.navigate_to(business_url):
                return None
            
            time.sleep(3)
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, business_url)
            
            # Extract business information
            business_data = self._extract_business_info(parser)
            
            if business_data.get('name'):
                lead = Lead(
                    name=business_data['name'],
                    platform='yelp',
                    source_url=business_url,
                    website=business_data.get('website'),
                    phone=business_data.get('phone'),
                    address=business_data.get('address'),
                    industry=business_data.get('categories'),
                    social_handles={'yelp': business_url}
                )
                
                # Add pain points from reviews or description
                if business_data.get('description'):
                    pain_points = parser.extract_pain_points(business_data['description'])
                    for pain_point in pain_points:
                        lead.add_pain_point(pain_point)
                
                # Add rating as engagement metric (converted to 0-1 scale)
                if business_data.get('rating'):
                    lead.engagement_rate = business_data['rating'] / 5.0
                
                logger.info(f"Created lead: {lead.name} (Score: {lead.lead_score})")
                return lead
        
        except Exception as e:
            logger.error(f"Error scraping Yelp business: {e}")
        
        return None
    
    def search_by_category(self, category: str, location: str, max_results: int = 50) -> List[Lead]:
        """Search Yelp by specific category"""
        return self.search_businesses(category, location, max_results)
    
    def scrape_reviews_for_insights(self, business_url: str, max_reviews: int = 20) -> Dict[str, Any]:
        """Scrape reviews to extract business insights and pain points"""
        insights = {
            'common_complaints': [],
            'positive_aspects': [],
            'pain_points': [],
            'customer_needs': []
        }
        
        try:
            if not self.selenium_handler.navigate_to(business_url):
                return insights
            
            time.sleep(3)
            
            # Scroll to load reviews
            self.selenium_handler.scroll_page("down", 1000)
            time.sleep(2)
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, business_url)
            
            # Extract reviews
            reviews = self._extract_reviews(parser, max_reviews)
            
            # Analyze reviews for insights
            for review in reviews:
                review_text = review.get('text', '').lower()
                
                # Extract pain points
                pain_points = parser.extract_pain_points(review_text)
                insights['pain_points'].extend(pain_points)
                
                # Look for common complaint keywords
                complaint_keywords = ['slow', 'expensive', 'rude', 'poor', 'bad', 'terrible', 'awful']
                for keyword in complaint_keywords:
                    if keyword in review_text:
                        insights['common_complaints'].append(keyword)
                
                # Look for positive aspects
                positive_keywords = ['great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'perfect']
                for keyword in positive_keywords:
                    if keyword in review_text:
                        insights['positive_aspects'].append(keyword)
            
            # Remove duplicates and count occurrences
            insights['common_complaints'] = list(set(insights['common_complaints']))
            insights['positive_aspects'] = list(set(insights['positive_aspects']))
            insights['pain_points'] = list(set(insights['pain_points']))
            
            logger.info(f"Extracted insights from {len(reviews)} reviews")
            
        except Exception as e:
            logger.error(f"Error extracting review insights: {e}")
        
        return insights
    
    def _extract_business_links(self, parser: DataParser) -> List[str]:
        """Extract business page links from search results"""
        business_links = []

        # Yelp business link selectors (updated for current Yelp structure)
        link_selectors = [
            'a[href*="/biz/"]',
            'a[data-testid="business-name"]',
            '.businessName a',
            '[data-testid="serp-ia-card"] a[href*="/biz/"]',
            '.css-1egxyvc a[href*="/biz/"]'
        ]

        for selector in link_selectors:
            links = parser.extract_links(selector)
            for link in links:
                if '/biz/' in link['url'] and link['url'] not in business_links:
                    # Clean URL (remove query parameters)
                    clean_url = link['url'].split('?')[0]
                    business_links.append(clean_url)

        # If no links found with specific selectors, try generic approach
        if not business_links:
            all_links = parser.extract_links('a[href]')
            for link in all_links:
                if '/biz/' in link['url'] and 'yelp.com' in link['url']:
                    clean_url = link['url'].split('?')[0]
                    if clean_url not in business_links:
                        business_links.append(clean_url)

        return business_links[:10]  # Limit to first 10 results
    
    def _extract_business_info(self, parser: DataParser) -> Dict[str, Any]:
        """Extract business information from Yelp business page"""
        business_info = {}
        
        # Business name
        name_selectors = [
            'h1[data-font-weight="semibold"]',
            '.css-1se8maq',
            '.biz-page-title'
        ]
        
        for selector in name_selectors:
            name = parser.extract_text_content(selector)
            if name:
                business_info['name'] = name
                break
        
        # Phone number
        phone_selectors = [
            'p[color="inherit"]',
            '.css-1p9ibgf',
            '.biz-phone'
        ]
        
        for selector in phone_selectors:
            phone_text = parser.extract_text_content(selector)
            if phone_text and any(char.isdigit() for char in phone_text):
                phones = parser.find_phone_numbers(phone_text)
                if phones:
                    business_info['phone'] = phones[0]
                    break
        
        # Website
        website_selectors = [
            'a[href*="biz_redir"]',
            '.css-1idmmu3 a',
            '.biz-website a'
        ]
        
        for selector in website_selectors:
            website = parser.extract_attribute(selector, 'href')
            if website:
                business_info['website'] = website
                break
        
        # Address
        address_selectors = [
            'p[color="inherit"]',
            '.css-qyp8bo',
            '.mapbox-text'
        ]
        
        for selector in address_selectors:
            address_text = parser.extract_text_content(selector)
            if address_text and ('str' in address_text.lower() or 'avenue' in address_text.lower() or 
                               'road' in address_text.lower() or any(char.isdigit() for char in address_text)):
                business_info['address'] = address_text
                break
        
        # Categories
        category_selectors = [
            '.css-bq71j2 a',
            '.category-str-list a',
            '.biz-main-info .category-str-list'
        ]
        
        categories = []
        for selector in category_selectors:
            category_elements = parser.soup.select(selector)
            for element in category_elements:
                category_text = element.get_text(strip=True)
                if category_text and len(category_text) < 50:
                    categories.append(category_text)
        
        if categories:
            business_info['categories'] = ', '.join(categories[:3])  # Limit to first 3 categories
        
        # Rating
        rating_selectors = [
            'div[role="img"][aria-label*="star"]',
            '.i-stars',
            '.rating-large'
        ]
        
        for selector in rating_selectors:
            rating_element = parser.soup.select_one(selector)
            if rating_element:
                aria_label = rating_element.get('aria-label', '')
                if 'star' in aria_label:
                    # Extract rating from aria-label like "4.5 star rating"
                    import re
                    rating_match = re.search(r'(\d+\.?\d*)', aria_label)
                    if rating_match:
                        business_info['rating'] = float(rating_match.group(1))
                        break
        
        # Review count
        review_count_selectors = [
            '.css-1fdy0l5',
            '.review-count',
            '.biz-rating .review-count'
        ]
        
        for selector in review_count_selectors:
            review_text = parser.extract_text_content(selector)
            if review_text and 'review' in review_text.lower():
                import re
                count_match = re.search(r'(\d+)', review_text)
                if count_match:
                    business_info['review_count'] = int(count_match.group(1))
                    break
        
        # Business description/about
        description_selectors = [
            '.css-1p9ibgf',
            '.biz-page-header-left .biz-page-title',
            '.short-def-list dd'
        ]
        
        for selector in description_selectors:
            description = parser.extract_text_content(selector)
            if description and len(description) > 20:
                business_info['description'] = description
                break
        
        return business_info
    
    def _extract_reviews(self, parser: DataParser, max_reviews: int = 20) -> List[Dict[str, Any]]:
        """Extract reviews from business page"""
        reviews = []
        
        # Review selectors
        review_selectors = [
            '.css-1qn0b6x',
            '.review',
            '.review-content'
        ]
        
        for selector in review_selectors:
            review_elements = parser.soup.select(selector)
            if review_elements:
                for element in review_elements[:max_reviews]:
                    review_text = element.get_text(strip=True)
                    if review_text and len(review_text) > 10:
                        reviews.append({
                            'text': review_text,
                            'length': len(review_text)
                        })
                break
        
        return reviews[:max_reviews]
