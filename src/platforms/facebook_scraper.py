"""
Facebook-specific scraper for groups, pages, and business profiles
"""
import time
from typing import List, Dict, Optional, Any
from selenium.webdriver.common.by import By
from loguru import logger

from src.core.selenium_handler import SeleniumHandler
from src.core.data_parser import DataParser
from src.models.lead import Lead
from config.settings import PLATFORM_CONFIGS


class FacebookScraper:
    """Scraper for Facebook groups, pages, and business profiles"""
    
    def __init__(self, email: str = None, password: str = None):
        self.config = PLATFORM_CONFIGS['facebook']
        self.email = email
        self.password = password
        self.selenium_handler = None
        self.leads = []
    
    def __enter__(self):
        self.selenium_handler = SeleniumHandler(headless=True)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.selenium_handler:
            self.selenium_handler.close()
    
    def login(self) -> bool:
        """Login to Facebook if credentials provided"""
        if not self.email or not self.password:
            logger.warning("No Facebook credentials provided - limited access")
            return False
        
        return self.selenium_handler.login_facebook(self.email, self.password)
    
    def scrape_group(self, group_url: str, max_posts: int = 50) -> List[Lead]:
        """Scrape Facebook group for business posts and leads"""
        leads = []
        
        try:
            logger.info(f"Scraping Facebook group: {group_url}")
            
            if not self.selenium_handler.navigate_to(group_url):
                return leads
            
            # Wait for group content to load
            time.sleep(3)
            
            # Scroll to load more posts
            scrolls = self.selenium_handler.infinite_scroll(max_scrolls=5)
            logger.info(f"Performed {scrolls} scrolls to load content")
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, group_url)
            
            # Extract posts
            posts = self._extract_group_posts(parser)
            
            for post in posts[:max_posts]:
                lead = self._create_lead_from_post(post, group_url)
                if lead:
                    leads.append(lead)
            
            logger.info(f"Extracted {len(leads)} leads from Facebook group")
            
        except Exception as e:
            logger.error(f"Error scraping Facebook group: {e}")
        
        return leads
    
    def scrape_page(self, page_url: str) -> Optional[Lead]:
        """Scrape Facebook business page"""
        try:
            logger.info(f"Scraping Facebook page: {page_url}")
            
            if not self.selenium_handler.navigate_to(page_url):
                return None
            
            # Wait for page to load
            time.sleep(3)
            
            # Try to click "About" section if available
            about_button = self.selenium_handler.wait_for_element("a[href*='/about']")
            if about_button:
                self.selenium_handler.click_element("a[href*='/about']")
                time.sleep(2)
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, page_url)
            
            # Extract page information
            page_data = self._extract_page_info(parser)
            
            if page_data.get('name'):
                lead = Lead(
                    name=page_data['name'],
                    platform='facebook',
                    source_url=page_url,
                    website=page_data.get('website'),
                    phone=page_data.get('phone'),
                    address=page_data.get('address'),
                    followers=page_data.get('followers'),
                    industry=page_data.get('category'),
                    social_handles={'facebook': page_url}
                )
                
                # Add pain points from page description
                if page_data.get('description'):
                    pain_points = parser.extract_pain_points(page_data['description'])
                    for pain_point in pain_points:
                        lead.add_pain_point(pain_point)
                
                logger.info(f"Created lead: {lead.name} (Score: {lead.lead_score})")
                return lead
        
        except Exception as e:
            logger.error(f"Error scraping Facebook page: {e}")
        
        return None
    
    def search_local_businesses(self, location: str, business_type: str, max_results: int = 20) -> List[Lead]:
        """Search for local businesses on Facebook"""
        leads = []
        
        try:
            # Construct search URL
            search_query = f"{business_type} {location}"
            search_url = f"https://www.facebook.com/search/pages/?q={search_query.replace(' ', '%20')}"
            
            logger.info(f"Searching Facebook for: {search_query}")
            
            if not self.selenium_handler.navigate_to(search_url):
                return leads
            
            time.sleep(3)
            
            # Scroll to load more results
            self.selenium_handler.infinite_scroll(max_scrolls=3)
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, search_url)
            
            # Extract search results
            results = self._extract_search_results(parser)
            
            for result in results[:max_results]:
                if result.get('page_url'):
                    lead = self.scrape_page(result['page_url'])
                    if lead:
                        leads.append(lead)
                        time.sleep(2)  # Rate limiting
            
            logger.info(f"Found {len(leads)} leads from Facebook search")
            
        except Exception as e:
            logger.error(f"Error searching Facebook businesses: {e}")
        
        return leads
    
    def _extract_group_posts(self, parser: DataParser) -> List[Dict[str, Any]]:
        """Extract posts from Facebook group"""
        posts = []
        
        # Facebook group post selectors (these may need updating)
        post_selectors = [
            'div[data-pagelet="FeedUnit_0"]',
            'div[role="article"]',
            '.userContentWrapper'
        ]
        
        for selector in post_selectors:
            post_elements = parser.soup.select(selector)
            if post_elements:
                for element in post_elements:
                    post_data = {
                        'text': element.get_text(strip=True),
                        'author': self._extract_post_author(element),
                        'links': [a.get('href') for a in element.find_all('a', href=True)]
                    }
                    posts.append(post_data)
                break
        
        return posts
    
    def _extract_page_info(self, parser: DataParser) -> Dict[str, Any]:
        """Extract information from Facebook page"""
        page_info = {}
        
        # Page name
        name_selectors = [
            'h1[data-testid="page_title"]',
            '.x1heor9g.x1qlqyl8.x1pd3egz.x1a2a7pz h1',
            '.pageTitle h1'
        ]
        
        for selector in name_selectors:
            name = parser.extract_text_content(selector)
            if name:
                page_info['name'] = name
                break
        
        # Follower count
        follower_selectors = [
            'div[data-testid="page_followers_count"]',
            '.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1sur9pj.xkrqix3.x1fey0fg.x1s688f'
        ]
        
        for selector in follower_selectors:
            follower_text = parser.extract_text_content(selector)
            if follower_text:
                page_info['followers'] = parser.parse_follower_count(follower_text)
                break
        
        # Contact information
        page_info['phone'] = parser.find_phone_numbers()
        page_info['emails'] = parser.find_emails()
        
        # Website
        website_links = parser.extract_links('a[href*="l.facebook.com"]')
        if website_links:
            page_info['website'] = website_links[0]['url']
        
        # Category/Industry
        category_selectors = [
            '.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1sur9pj.xkrqix3.x1fey0fg.x1s688f',
            '.pageCategory'
        ]
        
        for selector in category_selectors:
            category = parser.extract_text_content(selector)
            if category and len(category) < 100:  # Reasonable category length
                page_info['category'] = category
                break
        
        # Description/About
        about_selectors = [
            'div[data-testid="page_about_description"]',
            '.pageAbout',
            '.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.xtlvy1s.x126k92a'
        ]
        
        for selector in about_selectors:
            description = parser.extract_text_content(selector)
            if description:
                page_info['description'] = description
                break
        
        return page_info
    
    def _extract_search_results(self, parser: DataParser) -> List[Dict[str, Any]]:
        """Extract search results from Facebook search page"""
        results = []
        
        # Search result selectors
        result_elements = parser.soup.select('div[role="article"], .x1yztbdb')
        
        for element in result_elements:
            result_data = {}
            
            # Extract page link
            page_link = element.find('a', href=True)
            if page_link and 'facebook.com' in page_link.get('href', ''):
                result_data['page_url'] = page_link['href']
                result_data['name'] = page_link.get_text(strip=True)
                results.append(result_data)
        
        return results
    
    def _extract_post_author(self, post_element) -> Optional[str]:
        """Extract author name from post element"""
        author_selectors = [
            '.actor-link',
            '.profileLink',
            'strong a',
            'h3 a'
        ]
        
        for selector in author_selectors:
            author_element = post_element.select_one(selector)
            if author_element:
                return author_element.get_text(strip=True)
        
        return None
    
    def _create_lead_from_post(self, post_data: Dict[str, Any], source_url: str) -> Optional[Lead]:
        """Create lead from Facebook post data"""
        if not post_data.get('author'):
            return None
        
        # Create basic lead
        lead = Lead(
            name=post_data['author'],
            platform='facebook',
            source_url=source_url
        )
        
        # Extract pain points from post text
        if post_data.get('text'):
            parser = DataParser(f"<div>{post_data['text']}</div>")
            pain_points = parser.extract_pain_points(post_data['text'])
            for pain_point in pain_points:
                lead.add_pain_point(pain_point)
        
        # Extract contact info from post
        if post_data.get('text'):
            emails = DataParser.find_emails(DataParser(""), post_data['text'])
            if emails:
                lead.email = emails[0]
            
            phones = DataParser.find_phone_numbers(DataParser(""), post_data['text'])
            if phones:
                lead.phone = phones[0]
        
        return lead if lead.lead_score > 10 else None  # Only return leads with decent score
