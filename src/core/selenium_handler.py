"""
Selenium WebDriver handler for dynamic content scraping
"""
import time
import random
from typing import Optional, List, Dict, Any
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from loguru import logger
from config.settings import SELENIUM_CONFIG, USER_AGENTS


class SeleniumHandler:
    """Handles Selenium WebDriver operations for dynamic content scraping"""
    
    def __init__(self, headless: bool = True, user_agent: Optional[str] = None):
        self.driver: Optional[webdriver.Chrome] = None
        self.wait: Optional[WebDriverWait] = None
        self.headless = headless
        self.user_agent = user_agent or random.choice(USER_AGENTS)
        self.setup_driver()
    
    def setup_driver(self):
        """Initialize Chrome WebDriver with optimal settings"""
        try:
            chrome_options = Options()

            # Basic options
            if self.headless:
                chrome_options.add_argument("--headless")

            chrome_options.add_argument(f"--user-agent={self.user_agent}")
            chrome_options.add_argument(f"--window-size={SELENIUM_CONFIG['window_size'][0]},{SELENIUM_CONFIG['window_size'][1]}")

            # Performance and stealth options
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)

            # Disable images and CSS for faster loading (optional)
            prefs = {
                "profile.managed_default_content_settings.images": 2,
                "profile.default_content_setting_values.notifications": 2
            }
            chrome_options.add_experimental_option("prefs", prefs)

            # Use WebDriver Manager to automatically download correct ChromeDriver
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            # Set timeouts
            self.driver.implicitly_wait(SELENIUM_CONFIG['implicit_wait'])
            self.driver.set_page_load_timeout(SELENIUM_CONFIG['page_load_timeout'])
            self.driver.set_script_timeout(SELENIUM_CONFIG['script_timeout'])

            self.wait = WebDriverWait(self.driver, 10)

            logger.info("Selenium WebDriver initialized successfully")

        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            raise
    
    def navigate_to(self, url: str) -> bool:
        """Navigate to a URL with error handling"""
        try:
            logger.info(f"Navigating to: {url}")
            self.driver.get(url)
            self.random_delay(1, 3)
            return True
        except Exception as e:
            logger.error(f"Failed to navigate to {url}: {e}")
            return False
    
    def wait_for_element(self, selector: str, by: By = By.CSS_SELECTOR, timeout: int = 10) -> Optional[Any]:
        """Wait for element to be present and return it"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, selector))
            )
            return element
        except TimeoutException:
            logger.warning(f"Element not found: {selector}")
            return None
    
    def wait_for_elements(self, selector: str, by: By = By.CSS_SELECTOR, timeout: int = 10) -> List[Any]:
        """Wait for elements to be present and return them"""
        try:
            elements = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_all_elements_located((by, selector))
            )
            return elements
        except TimeoutException:
            logger.warning(f"Elements not found: {selector}")
            return []
    
    def click_element(self, selector: str, by: By = By.CSS_SELECTOR) -> bool:
        """Click an element with error handling"""
        try:
            element = self.wait_for_element(selector, by)
            if element:
                self.driver.execute_script("arguments[0].click();", element)
                self.random_delay(1, 2)
                return True
        except Exception as e:
            logger.error(f"Failed to click element {selector}: {e}")
        return False
    
    def scroll_page(self, direction: str = "down", pixels: int = 800) -> bool:
        """Scroll the page in specified direction"""
        try:
            if direction == "down":
                self.driver.execute_script(f"window.scrollBy(0, {pixels});")
            elif direction == "up":
                self.driver.execute_script(f"window.scrollBy(0, -{pixels});")
            elif direction == "bottom":
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            elif direction == "top":
                self.driver.execute_script("window.scrollTo(0, 0);")
            
            self.random_delay(1, 2)
            return True
        except Exception as e:
            logger.error(f"Failed to scroll: {e}")
            return False
    
    def infinite_scroll(self, max_scrolls: int = 10, scroll_pause: int = 2) -> int:
        """Perform infinite scroll and return number of scrolls performed"""
        scrolls_performed = 0
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        
        for i in range(max_scrolls):
            # Scroll down to bottom
            self.scroll_page("bottom")
            time.sleep(scroll_pause)
            
            # Calculate new scroll height and compare with last scroll height
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            
            if new_height == last_height:
                logger.info(f"Reached end of page after {scrolls_performed} scrolls")
                break
            
            last_height = new_height
            scrolls_performed += 1
            logger.info(f"Scroll {scrolls_performed}/{max_scrolls} completed")
        
        return scrolls_performed
    
    def login_facebook(self, email: str, password: str) -> bool:
        """Login to Facebook"""
        try:
            self.navigate_to("https://www.facebook.com/login")
            
            # Enter email
            email_field = self.wait_for_element("input[name='email']")
            if email_field:
                email_field.send_keys(email)
            
            # Enter password
            password_field = self.wait_for_element("input[name='pass']")
            if password_field:
                password_field.send_keys(password)
            
            # Click login button
            login_button = self.wait_for_element("button[name='login']")
            if login_button:
                login_button.click()
            
            # Wait for redirect
            self.random_delay(3, 5)
            
            # Check if login was successful
            if "facebook.com" in self.driver.current_url and "login" not in self.driver.current_url:
                logger.info("Facebook login successful")
                return True
            else:
                logger.error("Facebook login failed")
                return False
                
        except Exception as e:
            logger.error(f"Facebook login error: {e}")
            return False
    
    def login_instagram(self, username: str, password: str) -> bool:
        """Login to Instagram"""
        try:
            self.navigate_to("https://www.instagram.com/accounts/login/")
            
            # Wait for login form
            username_field = self.wait_for_element("input[name='username']")
            if username_field:
                username_field.send_keys(username)
            
            password_field = self.wait_for_element("input[name='password']")
            if password_field:
                password_field.send_keys(password)
            
            # Click login button
            login_button = self.wait_for_element("button[type='submit']")
            if login_button:
                login_button.click()
            
            self.random_delay(3, 5)
            
            # Check for successful login
            if "instagram.com" in self.driver.current_url and "login" not in self.driver.current_url:
                logger.info("Instagram login successful")
                return True
            else:
                logger.error("Instagram login failed")
                return False
                
        except Exception as e:
            logger.error(f"Instagram login error: {e}")
            return False
    
    def get_page_source(self) -> str:
        """Get current page source"""
        return self.driver.page_source if self.driver else ""
    
    def get_current_url(self) -> str:
        """Get current URL"""
        return self.driver.current_url if self.driver else ""
    
    def take_screenshot(self, filename: str) -> bool:
        """Take a screenshot"""
        try:
            self.driver.save_screenshot(filename)
            logger.info(f"Screenshot saved: {filename}")
            return True
        except Exception as e:
            logger.error(f"Failed to take screenshot: {e}")
            return False
    
    def random_delay(self, min_seconds: float = 1, max_seconds: float = 3):
        """Add random delay to mimic human behavior"""
        delay = random.uniform(min_seconds, max_seconds)
        time.sleep(delay)
    
    def close(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
            logger.info("WebDriver closed")
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
