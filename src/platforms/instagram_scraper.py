"""
Instagram-specific scraper for profiles, hashtags, and business accounts
"""
import time
import json
from typing import List, Dict, Optional, Any
from selenium.webdriver.common.by import By
from loguru import logger

from src.core.selenium_handler import SeleniumHandler
from src.core.data_parser import DataParser
from src.models.lead import Lead
from config.settings import PLATFORM_CONFIGS


class InstagramScraper:
    """Scraper for Instagram profiles and business accounts"""
    
    def __init__(self, username: str = None, password: str = None):
        self.config = PLATFORM_CONFIGS['instagram']
        self.username = username
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
        """Login to Instagram if credentials provided"""
        if not self.username or not self.password:
            logger.warning("No Instagram credentials provided - limited access")
            return False
        
        return self.selenium_handler.login_instagram(self.username, self.password)
    
    def scrape_profile(self, profile_url: str) -> Optional[Lead]:
        """Scrape Instagram profile for business information"""
        try:
            logger.info(f"Scraping Instagram profile: {profile_url}")
            
            if not self.selenium_handler.navigate_to(profile_url):
                return None
            
            # Wait for profile to load
            time.sleep(3)
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, profile_url)
            
            # Extract profile information
            profile_data = self._extract_profile_info(parser)
            
            if profile_data.get('username'):
                lead = Lead(
                    name=profile_data.get('full_name') or profile_data['username'],
                    platform='instagram',
                    source_url=profile_url,
                    website=profile_data.get('website'),
                    followers=profile_data.get('followers'),
                    engagement_rate=profile_data.get('engagement_rate'),
                    industry=profile_data.get('category'),
                    social_handles={'instagram': profile_data['username']}
                )
                
                # Add pain points from bio
                if profile_data.get('bio'):
                    pain_points = parser.extract_pain_points(profile_data['bio'])
                    for pain_point in pain_points:
                        lead.add_pain_point(pain_point)
                
                # Extract contact info from bio
                if profile_data.get('bio'):
                    emails = parser.find_emails(profile_data['bio'])
                    if emails:
                        lead.email = emails[0]
                    
                    phones = parser.find_phone_numbers(profile_data['bio'])
                    if phones:
                        lead.phone = phones[0]
                
                logger.info(f"Created lead: {lead.name} (Score: {lead.lead_score})")
                return lead
        
        except Exception as e:
            logger.error(f"Error scraping Instagram profile: {e}")
        
        return None
    
    def search_hashtag(self, hashtag: str, max_profiles: int = 20) -> List[Lead]:
        """Search Instagram hashtag for business profiles"""
        leads = []
        
        try:
            # Clean hashtag
            hashtag = hashtag.replace('#', '')
            hashtag_url = f"https://www.instagram.com/explore/tags/{hashtag}/"
            
            logger.info(f"Searching Instagram hashtag: #{hashtag}")
            
            if not self.selenium_handler.navigate_to(hashtag_url):
                return leads
            
            time.sleep(3)
            
            # Scroll to load more posts
            self.selenium_handler.infinite_scroll(max_scrolls=3)
            
            # Get page source and parse
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, hashtag_url)
            
            # Extract post links
            post_links = self._extract_hashtag_posts(parser)
            
            # Visit each post to get profile information
            profile_urls = set()
            for post_link in post_links[:max_profiles * 2]:  # Get more posts than needed
                profile_url = self._get_profile_from_post(post_link)
                if profile_url:
                    profile_urls.add(profile_url)
                    if len(profile_urls) >= max_profiles:
                        break
            
            # Scrape each unique profile
            for profile_url in list(profile_urls)[:max_profiles]:
                lead = self.scrape_profile(profile_url)
                if lead:
                    leads.append(lead)
                time.sleep(2)  # Rate limiting
            
            logger.info(f"Found {len(leads)} leads from hashtag #{hashtag}")
            
        except Exception as e:
            logger.error(f"Error searching Instagram hashtag: {e}")
        
        return leads
    
    def search_location(self, location: str, max_profiles: int = 20) -> List[Lead]:
        """Search Instagram location for local businesses"""
        leads = []
        
        try:
            # Search for location
            search_url = f"https://www.instagram.com/explore/locations/"
            
            logger.info(f"Searching Instagram location: {location}")
            
            if not self.selenium_handler.navigate_to(search_url):
                return leads
            
            # Use search functionality (this would need more complex implementation)
            # For now, we'll use a simplified approach
            
            time.sleep(3)
            
            # This is a placeholder - actual implementation would need to:
            # 1. Use Instagram's search API or simulate search
            # 2. Extract location-based posts
            # 3. Get profiles from those posts
            
            logger.warning("Location search not fully implemented yet")
            
        except Exception as e:
            logger.error(f"Error searching Instagram location: {e}")
        
        return leads
    
    def scrape_business_category(self, category: str, location: str = None, max_profiles: int = 20) -> List[Lead]:
        """Scrape Instagram for businesses in specific category"""
        leads = []
        
        try:
            # Create search terms
            search_terms = [
                f"{category}",
                f"{category} business",
                f"{category} service"
            ]
            
            if location:
                search_terms.extend([
                    f"{category} {location}",
                    f"{location} {category}"
                ])
            
            # Search each term as hashtag
            for term in search_terms:
                hashtag_leads = self.search_hashtag(term.replace(' ', ''), max_profiles // len(search_terms))
                leads.extend(hashtag_leads)
                
                if len(leads) >= max_profiles:
                    break
            
            # Remove duplicates based on username
            unique_leads = []
            seen_usernames = set()
            
            for lead in leads:
                username = lead.social_handles.get('instagram', '')
                if username not in seen_usernames:
                    unique_leads.append(lead)
                    seen_usernames.add(username)
            
            logger.info(f"Found {len(unique_leads)} unique leads for category: {category}")
            return unique_leads[:max_profiles]
            
        except Exception as e:
            logger.error(f"Error scraping business category: {e}")
        
        return leads
    
    def _extract_profile_info(self, parser: DataParser) -> Dict[str, Any]:
        """Extract information from Instagram profile"""
        profile_info = {}
        
        # Try to extract from JSON data first (more reliable)
        json_data = self._extract_json_data(parser)
        if json_data:
            user_data = json_data.get('entry_data', {}).get('ProfilePage', [{}])[0].get('graphql', {}).get('user', {})
            if user_data:
                profile_info.update({
                    'username': user_data.get('username'),
                    'full_name': user_data.get('full_name'),
                    'bio': user_data.get('biography'),
                    'website': user_data.get('external_url'),
                    'followers': user_data.get('edge_followed_by', {}).get('count'),
                    'following': user_data.get('edge_follow', {}).get('count'),
                    'posts_count': user_data.get('edge_owner_to_timeline_media', {}).get('count'),
                    'is_business': user_data.get('is_business_account'),
                    'category': user_data.get('business_category_name')
                })
        
        # Fallback to HTML parsing
        if not profile_info.get('username'):
            # Username from URL or page
            username_selectors = [
                'h2.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj',
                'h1',
                '.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj'
            ]
            
            for selector in username_selectors:
                username = parser.extract_text_content(selector)
                if username and len(username) < 50:  # Reasonable username length
                    profile_info['username'] = username
                    break
        
        # Bio
        if not profile_info.get('bio'):
            bio_selectors = [
                'div.-vDIg span',
                '.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x10wh9bi.x1wdrske.x8viiok.x18hxmgj'
            ]
            
            for selector in bio_selectors:
                bio = parser.extract_text_content(selector)
                if bio and len(bio) > 10:  # Reasonable bio length
                    profile_info['bio'] = bio
                    break
        
        # Follower count
        if not profile_info.get('followers'):
            follower_selectors = [
                'a[href*="/followers/"] span',
                '.g47SY'
            ]
            
            for selector in follower_selectors:
                follower_text = parser.extract_text_content(selector)
                if follower_text:
                    profile_info['followers'] = parser.parse_follower_count(follower_text)
                    break
        
        # Website link
        if not profile_info.get('website'):
            website_links = parser.extract_links('a[href*="l.instagram.com"]')
            if website_links:
                profile_info['website'] = website_links[0]['url']
        
        # Calculate engagement rate (simplified)
        if profile_info.get('followers') and profile_info.get('posts_count'):
            # This is a very simplified calculation
            # Real engagement would need post likes/comments data
            if profile_info['followers'] > 0:
                profile_info['engagement_rate'] = min(0.1, 1000 / profile_info['followers'])
        
        return profile_info
    
    def _extract_json_data(self, parser: DataParser) -> Optional[Dict]:
        """Extract JSON data from Instagram page"""
        try:
            # Look for window._sharedData
            scripts = parser.soup.find_all('script')
            for script in scripts:
                if script.string and 'window._sharedData' in script.string:
                    # Extract JSON from script
                    script_content = script.string
                    start = script_content.find('{')
                    end = script_content.rfind('}') + 1
                    if start != -1 and end != -1:
                        json_str = script_content[start:end]
                        return json.loads(json_str)
        except (json.JSONDecodeError, AttributeError):
            pass
        
        return None
    
    def _extract_hashtag_posts(self, parser: DataParser) -> List[str]:
        """Extract post URLs from hashtag page"""
        post_links = []
        
        # Instagram post link selectors
        post_selectors = [
            'a[href*="/p/"]',
            'a[href*="/reel/"]'
        ]
        
        for selector in post_selectors:
            links = parser.extract_links(selector)
            for link in links:
                if '/p/' in link['url'] or '/reel/' in link['url']:
                    post_links.append(link['url'])
        
        return list(set(post_links))  # Remove duplicates
    
    def _get_profile_from_post(self, post_url: str) -> Optional[str]:
        """Get profile URL from post URL"""
        try:
            if not self.selenium_handler.navigate_to(post_url):
                return None
            
            time.sleep(2)
            
            # Look for profile link in post
            profile_link = self.selenium_handler.wait_for_element('a[href*="/"][href*="instagram.com/"]')
            if profile_link:
                href = profile_link.get_attribute('href')
                if href and '/p/' not in href and '/reel/' not in href:
                    return href
            
            # Alternative: extract from page source
            html_content = self.selenium_handler.get_page_source()
            parser = DataParser(html_content, post_url)
            
            # Look for profile links
            profile_links = parser.extract_links('a[href*="instagram.com/"]')
            for link in profile_links:
                if '/p/' not in link['url'] and '/reel/' not in link['url'] and '/explore/' not in link['url']:
                    return link['url']
        
        except Exception as e:
            logger.warning(f"Could not extract profile from post {post_url}: {e}")
        
        return None
