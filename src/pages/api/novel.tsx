import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";
import { Novel } from "../../types/Novel";

const API_Novel = async (req: NextApiRequest, res: NextApiResponse) => {
  const novelId = req.query.id;

  try {
    const novelResponse = await fetch(
      `https://novelusb.com/novel-book/${novelId}-novel`
    );
    const novelDocument = new JSDOM(await novelResponse.text()).window.document;

    var info = {};
    var metas = novelDocument.querySelectorAll("meta");
    metas.forEach((meta) => {
      let property = meta.getAttribute("property");
      let content = meta.getAttribute("content");

      if (property?.startsWith("og:novel:")) {
        if (property.endsWith("novel_name")) info["title"] = content;
        else if (property.endsWith("author")) info["author"] = content;
        else if (property.endsWith("status")) info["status"] = content;
        else if (property.endsWith("genre"))
          info["genres"] = content
            .toLowerCase()
            .split(",")
            .map((x) => {
              return x.charAt(0).toUpperCase() + x.slice(1);
            });
        else if (property.endsWith("update_time"))
          info["last_update"] = new Date(content).getTime();
      } else if (meta.getAttribute("itemprop") == "image")
        info["image"] = content;
    });

    if (info["status"] == "OnGoing") info["status"] = "On Going";

    var rating =
      Math.round(
        parseFloat(
          novelDocument.querySelector("span[itemprop='ratingValue']")
            .textContent
        ) * 5
      ) / 10;

    const chaptersResponse = await fetch(
      `https://novelusb.com/ajax/chapter-archive?novelId=${novelId}`
    );
    const chaptersDocument = new JSDOM(await chaptersResponse.text()).window
      .document;

    var chapters = [];
    var links = chaptersDocument.querySelectorAll("a");
    links.forEach((link) => {
      let title = link.textContent;
      let id = link.href.split("/").slice(-1);
      chapters.push({ title, id });
    });

    chapters[chapters.length - 1].timestamp = info["last_update"];

    const novel: Novel = {
      title: info["title"],
      image: info["image"],
      id: novelId.toString() + "-novel",
      chapter_count: chapters.length,
      author: info["author"],
      genres: info["genres"],
      rating,
      status: info["status"],
      chapters,
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
