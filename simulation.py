import aiohttp
import asyncio
import random
import time
import uuid
from datetime import datetime
from urllib.parse import urlencode

class EnhancedAnalyticsSimulator:
    def __init__(self):
        self.session_timestamps = {}
        self.tracking_ids = []
        
        # Enhanced browser profiles
        self.browsers = {
            "Chrome": ["99", "100", "101", "102", "103"],
            "Firefox": ["98", "99", "100"],
            "Safari": ["14", "15", "16"],
            "Edge": ["99", "100"],
            "Opera": ["85", "86"],
            "Samsung Internet": ["16", "17"],
            "UC Browser": ["13", "14"]
        }
        
        # Device profiles
        self.devices = {
            "Desktop": ["Windows", "MacOS", "Linux"],
            "Mobile": ["iPhone", "Android", "iPad"],
            "Tablet": ["iPad", "Android Tablet"]
        }
        
        # Screen resolutions
        self.screen_resolutions = [
            "1920x1080", "1366x768", "2560x1440",
            "375x812", "414x896", "360x640"
        ]
        
        # Enhanced traffic sources
        self.traffic_sources = {
            "Organic": {
                "source": "google",
                "medium": "organic",
                "campaign": "none"
            },
            "Social": {
                "source": "facebook",
                "medium": "social",
                "campaign": "social_traffic"
            },
            "Email": {
                "source": "newsletter",
                "medium": "email",
                "campaign": "weekly_digest"
            },
            "Direct": {
                "source": "(direct)",
                "medium": "(none)",
                "campaign": "(not set)"
            }
        }

    def generate_utm_parameters(self, source_type):
        """Generate UTM parameters for better analytics tracking"""
        source_info = self.traffic_sources[source_type]
        utm_params = {
            'utm_source': source_info['source'],
            'utm_medium': source_info['medium'],
            'utm_campaign': source_info['campaign'],
            'utm_content': f"test_{int(time.time())}",
            'utm_term': f"test_term_{random.randint(1, 100)}"
        }
        return urlencode(utm_params)

    def generate_client_id(self):
        """Generate a consistent client ID for analytics tracking"""
        return f"{uuid.uuid4()}.{int(time.time())}"

    def generate_event_data(self, page_path):
        """Generate rich event data for analytics"""
        return {
            "client_id": self.generate_client_id(),
            "page_path": page_path,
            "page_title": f"Test Page - {page_path.replace('/', ' ').strip()}",
            "screen_resolution": random.choice(self.screen_resolutions),
            "device_category": random.choice(list(self.devices.keys())),
            "timestamp": int(time.time() * 1000)
        }

    async def send_pageview(self, session, base_url, path, headers, tracking_data):
        """Send pageview with enhanced tracking"""
        url = f"{base_url}{path}"
        
        # Add analytics-specific parameters
        if '?' in url:
            url += '&'
        else:
            url += '?'
        url += urlencode(tracking_data)

        try:
            async with session.get(url, headers=headers, timeout=30) as response:
                if response.status == 200:
                    # Store successful tracking ID
                    self.tracking_ids.append(tracking_data['client_id'])
                    print(f"✓ Pageview sent: {url} | Client ID: {tracking_data['client_id'][:8]}")
                    return True
                else:
                    print(f"✗ Failed pageview: {url} | Status: {response.status}")
                    return False
        except Exception as e:
            print(f"✗ Error sending pageview: {str(e)}")
            return False

    async def simulate_session(self, session, base_url):
        """Simulate a complete user session with enhanced tracking"""
        session_id = str(uuid.uuid4())
        client_id = self.generate_client_id()
        device_type = random.choice(list(self.devices.keys()))
        device = random.choice(self.devices[device_type])
        browser = random.choice(list(self.browsers.keys()))
        browser_version = random.choice(self.browsers[browser])
        source_type = random.choice(list(self.traffic_sources.keys()))

        # Generate rich headers
        headers = {
            "User-Agent": f"Mozilla/5.0 ({device}) {browser}/{browser_version}",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache",
            "X-Client-ID": client_id,
            "X-Session-ID": session_id
        }

        # Simulate multiple page views in the session
        pages = [
            "/",
            "/faq",
            "/glossary"            
        ]
        
        pages_to_visit = random.sample(pages, random.randint(2, len(pages)))
        
        for page in pages_to_visit:
            tracking_data = self.generate_event_data(page)
            tracking_data['utm_params'] = self.generate_utm_parameters(source_type)
            
            success = await self.send_pageview(
                session, base_url, page, headers, tracking_data
            )
            
            if success:
                # Simulate realistic user behavior
                await asyncio.sleep(random.uniform(5, 15))
            else:
                break

    async def run_simulation(self, base_url, total_sessions, concurrent_sessions):
        """Run enhanced simulation with better concurrency control"""
        print(f"\nStarting enhanced analytics simulation...")
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            for i in range(total_sessions):
                task = self.simulate_session(session, base_url)
                tasks.append(task)
                
                if len(tasks) >= concurrent_sessions:
                    await asyncio.gather(*tasks)
                    tasks = []
                    # Add natural delay between batches
                    await asyncio.sleep(random.uniform(2, 5))
            
            if tasks:
                await asyncio.gather(*tasks)

        print(f"\nSimulation Statistics:")
        print(f"Total Sessions: {total_sessions}")
        print(f"Successful Tracking IDs: {len(self.tracking_ids)}")
        print(f"Completion Rate: {(len(self.tracking_ids)/total_sessions)*100:.1f}%")

async def main():
    # Configuration
    BASE_URL = "https://www.instantshippingcalculator.com"
    TOTAL_SESSIONS = 100
    CONCURRENT_SESSIONS = 10
    
    simulator = EnhancedAnalyticsSimulator()
    
    start_time = time.time()
    await simulator.run_simulation(BASE_URL, TOTAL_SESSIONS, CONCURRENT_SESSIONS)
    duration = time.time() - start_time
    
    print(f"\nSimulation completed in {duration:.2f} seconds")

if __name__ == "__main__":
    asyncio.run(main())