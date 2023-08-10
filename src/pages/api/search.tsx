import fetch from "node-fetch";
import { parse } from "node-html-parser";

export default async (req, res) => {
  const { keyword, pageNumber } = req.query;

  try {
    const url = `https://novelusb.com/search?keyword=${keyword}&page=${pageNumber}`;
    const response = await fetch(url);
    const html = await response.text();

    const root = parse(html);

    const novelItems = root.querySelectorAll(
      ".col-novel-main .list-novel .row"
    );
    const novels = novelItems.map((item) => {
      const titleElement = item.querySelector(".novel-title > a");
      const imgElement = item.querySelector(".cover");
      return {
        title: titleElement?.text,
        img: imgElement?.getAttribute("src"),
        link: titleElement?.getAttribute("href"),
      };
    });

    const lastLink = root.querySelector(".last > a");
    let nextPageNumber = 1;
    if (lastLink) {
      const lastHref = lastLink.getAttribute("href");
      const queries = lastHref?.split("&");
      queries?.forEach((query) => {
        if (query.includes("page")) {
          nextPageNumber = parseInt(query.split("=")[1]);
        }
      });
    }

    res.status(200).json({ novels, nextPageNumber });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for novel data." });
  }
};
