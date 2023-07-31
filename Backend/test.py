import cloudscraper
import requests
from bs4 import BeautifulSoup

scraper = cloudscraper.create_scraper()


def linkScraper(ln):
    url = f"https://novelusb.com/ajax/chapter-archive?novelId={ln}"
    req = scraper.get(url)
    soup = BeautifulSoup(req.content, "html.parser")

    chapLinks = []
    links = soup.find_all("a", href=True)
    for link in links:
        href = link["href"]
        if href.startswith(f"https://novelusb.com/novel-book/{ln}/chapter"):
            chapLinks.append(href)
    print(chapLinks)
