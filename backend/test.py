import cloudscraper
import requests
from bs4 import BeautifulSoup

scraper = cloudscraper.create_scraper()


def searchScraper():
    url = f"https://novelusb.com/search?keyword=mart&page=1"
    req = scraper.get(url)
    soup = BeautifulSoup(req.content, "html.parser")
    novelLinks = []
    searchedNovels = soup.find_all("h3", class_="novel-title")
    for title in searchedNovels:
        href = title.find("a")["href"]
        novelLinks.append(href)
    url2 = f"https://novelusb.com/search?keyword=mart"
    req2 = scraper.get(url2)
    soup2 = BeautifulSoup(req2.content, "html.parser")
    div = soup2.find("main", id="container")
    div2 = div.find("div", class_=("container text-center pagination-container"))
    div3 = div2.find("div", class_=("col-xs-12 col-sm-12 col-md-9 col-novel-main"))
    pagination = div3.find("ul", class_="pagination pagination-sm")
    lastButton = pagination.find("li", class_="last")
    link = lastButton.find("a", {"class": "last"})
    print(link)
    # return [novelLinks, pageNumber]


searchScraper()
