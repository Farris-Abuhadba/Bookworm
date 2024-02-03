import { NextApiRequest, NextApiResponse } from "next";
import { Novel } from "../../../../types/Novel";
import { JSDOM } from "jsdom";

const API_HotNovels = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(
      "https://boxnovel.com/novel/?m_orderby=views"
    );
    const document = new JSDOM(await response.text()).window.document;
    const data: Novel[] = [];
    const novelElements = document.querySelectorAll(
      "div.page-item-detail.text"
    );
    novelElements.forEach((element) => {
      const as = element.querySelectorAll("a");
      const titleElement = as[1];
      const imageElement = as[0].querySelector("img");

      if (titleElement && imageElement) {
        const title = titleElement.textContent?.trim() || "";
        const id = title.toLowerCase().replaceAll(" ", "-");
        const image = imageElement.getAttribute("data-src") || "";

        data.push({
            title, id, image,
            sourceIds: {}
        });
      }
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while extracting novel data." });
  }
};

export default API_HotNovels;
