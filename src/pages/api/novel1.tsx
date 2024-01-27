import { NextApiRequest, NextApiResponse } from "next";
import { Novel, Chapter } from "../../types/Novel";
import { JSDOM } from "jsdom";

const API_Novel = async (req: NextApiRequest, res: NextApiResponse) => {
  const novelId = req.query.id;

  try {
    const novelResponse = await fetch(
      `https://boxnovel.com/novel/${novelId}-boxnovel/`
    );
    const novelDocument = new JSDOM(await novelResponse.text()).window.document;

    var status: "On Going" | "Completed" | "Dropped" | "Hiatus" = "On Going";
    var last_update = 0;
    var title = "";
    var image = "";
    var author = "";
    var genres: string[] = [];
    var description = ""; 

    const titleElement = novelDocument.querySelector("div.post-title h1");
    const imageElement = novelDocument.querySelector("div.summary_image img");
    const descriptionElement = novelDocument.querySelector("#editdescription");

    title = titleElement.textContent?.trim() || "";
    image = imageElement.getAttribute("data-src") || "";
    description = descriptionElement.textContent || "";
    
    const authorElements = novelDocument.querySelectorAll(
      "div.author-content a"
    );
    const authors: string[] = [];
    authorElements.forEach((authorElement) => {
      authors.push(authorElement.textContent?.trim() || "");
    });
    author = authors.toString();

    const genreElements = novelDocument.querySelectorAll(
      "div.genres-content a"
    );
    genreElements.forEach((genreElement) => {
      genres.push(genreElement.textContent?.trim() || "");
    });

    const rating = parseFloat(
      novelDocument.querySelector("span.score.font-meta.total_votes")
        ?.textContent || "0"
    );

    const chaptersResponse = await fetch(
      `https://boxnovel.com/novel/${novelId}-boxnovel/ajax/chapters/`,
      { method: "post" }
    );
    const chaptersDocument = new JSDOM(await chaptersResponse.text()).window
      .document;

    var chapters: Chapter[] = [];
    var listItems = chaptersDocument.querySelectorAll("li.wp-manga-chapter");
    listItems.forEach((item: HTMLElement, index) => {
      let link = item.querySelector("a");
      let chapterTitle = link.textContent?.trim() || "";
      let chapterId = link.href.split("/").slice(-2)[0] || "";

      let timestamp = Math.floor(
        new Date(
          item.querySelector("span.chapter-release-date").textContent.trim()
        ).valueOf() / 1000 || Date.now() / 1000 - 86400
      );

      chapters.push({
        title: chapterTitle,
        id: chapterId,
        timestamp,
        index: listItems.length - index,
      });
    });

    const novel: Novel = {
      title: title,
      image: image,
      id: novelId.toString(),
      chapter_count: chapters.length,
      author: author,
      genres: genres,
      rating: rating,
      status: status,
      description: description,
      chapters: chapters.toReversed(),
    };

    res.status(200).json(novel);
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while extracting chapter data." });
  }
};

export default API_Novel;
