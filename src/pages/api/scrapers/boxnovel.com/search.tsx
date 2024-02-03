import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";

const API_Search = async (req: NextApiRequest, res: NextApiResponse) => {
  const { keyword, pageNumber } = req.query;

  try {
    const url = `https://novelusb.com/search?keyword=${keyword}&page=${pageNumber}`;
    const response = await fetch(url);
    const document = new JSDOM(await response.text()).window.document;

    const novelItems = document.querySelectorAll(
      ".col-novel-main .list-novel .row"
    ) as NodeListOf<Element>;

    const novels = Array.from(novelItems).map((item) => {
      const titleElement = item.querySelector(".novel-title > a");
      const imgElement = item.querySelector(".cover");
      return {
        title: titleElement?.textContent,
        img: imgElement?.getAttribute("src"),
        link: titleElement?.getAttribute("href"),
      };
    });

    const lastLink = document.querySelector(".last > a");
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

export default API_Search;
