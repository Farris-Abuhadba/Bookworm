from fastapi import FastAPI
from scraper import Scraper
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
lightNovel = Scraper()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/light-novel/{ln}")
async def LnList(ln):
    novel = lightNovel.novelScraper(ln)
    chapters = lightNovel.chapterListScraper(ln)

    novel["chapter_count"] = len(chapters)
    novel["chapters"] = chapters

    return novel

@app.get("/{ln}/{chapter}")
async def Chapter(chapter, ln):
    return lightNovel.pageScraper(chapter, ln)


@app.get("/hot-novels")
async def Featured(topicId):
    return lightNovel.miscScraper(topicId)


@app.get("/search")
async def searched(keyword, page):
    return lightNovel.searchScraper(keyword, page)
