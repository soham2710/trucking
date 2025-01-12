import requests
import random
import time

# Your GA4 Measurement ID
MEASUREMENT_ID = "G-NDFVWRH841"

# List of random pages to simulate
PAGES = [
    "/",
    "/faq",
    "/glossary",
    "/contact",
]

# Function to send hits to GA4
def send_hit():
    client_id = f"{random.randint(1, 1000000)}.{random.randint(1, 1000000)}"  # Generate a random client ID
    page_path = random.choice(PAGES)  # Randomly select a page

    # Construct the query parameters
    payload = {
        "v": "2",  # Protocol version
        "tid": MEASUREMENT_ID,  # Measurement ID
        "cid": client_id,  # Client ID
        "t": "pageview",  # Hit type
        "dp": page_path,  # Document path
        "dt": "Simulated Page",  # Document title
    }

    try:
        # Send the GET request
        response = requests.get("https://www.google-analytics.com/g/collect", params=payload)

        # Check if the response is 204 (success)
        if response.status_code == 204:
            print(f"Hit sent successfully for {page_path}")
        else:
            print(f"Unexpected response for {page_path}: {response.status_code} {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Failed to send hit for {page_path}: {e}")


# Simulate multiple hits
TOTAL_HITS = 100
DELAY_BETWEEN_HITS = 0.5  # Delay in seconds

if __name__ == "__main__":
    print(f"Sending {TOTAL_HITS} hits to GA4...")
    for _ in range(TOTAL_HITS):
        send_hit()
        time.sleep(DELAY_BETWEEN_HITS)
    print("Simulation complete.")
