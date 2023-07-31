import scrapy


class NovelSpider(scrapy.Spider):
    name = "novel_spider"
    start_urls = ["https://noveltrust.com/book/shadow-slave"]

    def parse(self, response):
        # Find all the links on the current page
        links = response.css("a::attr(href)").getall()
        last = response.xpath("//*[contains(@class, 'index-container-btn')]").getall()
        lastPageString = last[-1].split("href=")
        lastPageNumber = lastPageString[-1]
        size = len(lastPageNumber)
        # Slice string to remove last 3 characters from string
        mod_string = lastPageNumber[: size - 10]
        finalNumber = mod_string.split("/")[-1]
        print(int(finalNumber))
