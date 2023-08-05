import cloudscraper
import requests
from bs4 import BeautifulSoup

scraper = cloudscraper.create_scraper()


class Scraper:
    def novelScraper(self, ln):
        url = f"https://novelusb.com/novel-book/{ln}-novel"
        req = scraper.get(url)
        soup = BeautifulSoup(req.content, "html.parser")

        data = {}

        infoList = soup.find_all("ul")[5].find_all("li")
        if "Author:" not in infoList[0].text:
            infoList.pop(0)

        data["title"] = soup.find("h3", class_="title").text
        data["cover"] = soup.find_all("img")[1]["src"]
        data["author"] = infoList[0].find("a").text

        genresA = infoList[1].find_all("a")
        genres = []
        for a in genresA:
            genres.append(a.text)
        data["genres"] = genres

        data["status"] = infoList[-1].find("a").text
        data["rating"] = float(soup.find("span", itemprop="ratingValue").text) / 2
        
        return data

    def chapterListScraper(self, ln):
        url = f"https://novelusb.com/ajax/chapter-archive?novelId={ln}"
        req = scraper.get(url)
        soup = BeautifulSoup(req.content, "html.parser")

        chapters = []
        links = soup.find_all("a")
        for link in links:
            chapter = {}
            chapter["title"] = link["title"]
            chapter["url"] = link["href"]
            chapter["timestamp"] = 1690000000000
            chapters.append(chapter)

        return chapters

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

        hotNovels = soup.find(id=f"{topicId}").find(class_="index-novel")
        links = hotNovels.find_all("a")

        novels = []

        for link in links:
            novel = {}
            novel["url"] = link["href"]
            novel["cover"] = link.find("img")["src"]
            novel["title"] = link["title"]
            
            novels.append(novel)

        return novels

    def searchScraper(self, keyword, page):
        url = f"https://novelusb.com/search?keyword={keyword}&page={page}"
        req = scraper.get(url)
        soup = BeautifulSoup(req.content, "html.parser")
        novelLinks = []
        searchedNovels = soup.find_all("h3", class_="novel-title")
        for title in searchedNovels:
            href = title.find("a")["href"]
            novelLinks.append(href)
        last = soup.find(class_="last").find("a")["href"]
        queries = last.split("&")
        for query in queries:
            if "page" in query:
                pageNumber = int(query.split("=")[-1])
        return [novelLinks, pageNumber]
