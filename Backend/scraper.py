import cloudscraper
import requests
from bs4 import BeautifulSoup

scraper = cloudscraper.create_scraper()


class Scraper:
    def linkScraper(self, ln):
        url = f"https://novelusb.com/ajax/chapter-archive?novelId={ln}"
        req = scraper.get(url)
        soup = BeautifulSoup(req.content, "html.parser")

        chapLinks = []
        links = soup.find_all("a", href=True)
        for link in links:
            href = link["href"]
            if href.startswith(f"https://novelusb.com/novel-book/{ln}-novel/"):
                chapLinks.append(href)
        return chapLinks

    def pageScraper(self, chap, ln):
        url = f"https://novelusb.com/novel-book/{ln}-novel/{chap}"
        req = scraper.get(url)
        soup = BeautifulSoup(req.content, "html.parser")

        text = soup.find(id="chr-content").get_text()
        return text

    def miscScraper(self, topicId):
        url = "https://novelusb.com"
        req = scraper.get(url)
        soup = BeautifulSoup(req.content, "html.parser")

        lightNovelLinks = []
        hotNovels = soup.find(id=f"{topicId}")
        links = hotNovels.find_all(
            "a",
        )
        for link in links:
            href = link["href"]
            if href.startswith("https://novelusb.com/novel-book/"):
                lightNovelLinks.append(href)
        return lightNovelLinks
