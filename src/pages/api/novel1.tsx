import { NextApiRequest, NextApiResponse } from "next";
import { Novel, Chapter } from "../../types/Novel";
import { JSDOM } from "jsdom";

const API_Novel = async (req: NextApiRequest, res: NextApiResponse) => {
  const novelId = req.query.id;

  try {
    const novelResponse = await fetch(`https://boxnovel.com/novel/${novelId}-boxnovel/`);
    const novelDocument = new JSDOM(await novelResponse.text()).window.document;

    var status: "On Going" | "Completed" | "Dropped" | "Hiatus" = "On Going";
    var last_update = 0;
    var title = "";
    var cover = "";
    var author = "";
    var genres: string[] = [];

    // DO THE SCRAPING SHIT
    const novelElements = novelDocument.querySelectorAll("div.page-item-detail.text");
    novelElements.forEach(async (element) => {
      const as = element.querySelectorAll("a");
      const titleElement = as[1];
      const imageElement = as[0].querySelector("img");

      title = titleElement.textContent?.trim() || "";
      cover = imageElement.getAttribute("data-src") || "";

      const authorElements = novelDocument.querySelector("div.author-content a")?.textContent?.trim() || "";

      author = authorElements
      // TALK TO TRISTAN ABOUT MULTIPLE AUTHORS
      // const authors: string[] = [];
      //   authorElements.forEach((authorElement) => {
      //   authors.push(authorElement.textContent?.trim() || "");
      // });

      const genreElements = novelDocument.querySelectorAll("div.genres-content a");
      genreElements.forEach((genreElement) => {
        genres.push(genreElement.textContent?.trim() || "");
      });

      const rating = parseFloat(novelDocument.querySelector("span.score.font-meta.total_votes")?.textContent || "0");

      const chaptersResponse = await fetch(`https://boxnovel.com/novel/${novelId}/ajax/chapters/`);
      const chaptersDocument = new JSDOM(await chaptersResponse.text()).window.document;

      var chapters: Chapter[] = [];
      var links = chaptersDocument.querySelectorAll("a");
      links.forEach((link) => {
        let chapterTitle = link.textContent || "";
        let chapterId = link.href.split("/").slice(-1).pop() || "";
        chapters.push({ title: chapterTitle, id: chapterId });
      });

    

      const novel: Novel = {
        title: title,
        cover: cover,
        id: novelId.toString() + "-novel",
        chapter_count: chapters.length,
        author: author,
        genres: genres,
        rating: rating,
        status: status,
        chapters: chapters,
      };

      res.status(200).json(novel);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while extracting chapter data." });
  }
};

export default API_Novel;
