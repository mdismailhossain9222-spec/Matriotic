import playwright.sync_api
import time

def run():
    with playwright.sync_api.sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()
        page.goto("https://matriotic.vercel.app/")

        # Start recording
        # Note: Playwright doesn't natively record video, but we can take screenshots
        # or use a screen capture tool. Since we are in a CLI, we will simulate the scroll.
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(2000)

        # Take screenshot as a proxy for the raw assets
        page.screenshot(path="D:/MyProjects/MyProjects/Matriotic/raw_assets/website_scroll.png")

        browser.close()

run()