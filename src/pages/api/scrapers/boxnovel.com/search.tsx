import { NextApiRequest, NextApiResponse } from "next";
import { Chapter, Novel } from "../../../../types/Novel";
import { JSDOM } from "jsdom";

const API_boxnovel_com_Search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const query: string = (req.query["q"] || "") as string;
  const sort: string = (req.query["sort"] || "") as string;

  var results = await boxnovel_com_Search(query, sort);
  let status = results.status;
  delete results["status"];

  res.status(status).json(results);
};

export const boxnovel_com_Search = async (query: string, sort: string) => {
  try {
    const response = await fetch(
      `https://boxnovel.com/?s=${query}&post_type=wp-manga&m_orderby=${sort}`
    );
    const document = new JSDOM(await response.text()).window.document;
    const data: Novel[] = [];
    const novelElements = document.querySelectorAll(
      "div.row.c-tabs-item__content"
    );

    novelElements.forEach((element) => {
      const a = element.querySelector("a");

      let href = a.getAttribute("href").split("/");
      if (href.slice(-1) == "") href.pop();
      const sourceId = href.pop();
      const title = a.getAttribute("title").trim() || "";
      const image = a.querySelector("img").getAttribute("data-src") || "";

      const content = element.querySelector(".tab-summary .post-content");

      const author = Array.from(
        content.querySelectorAll(".mg_author .summary-content a")
      )
        .map((a: HTMLElement) => a.textContent)
        .join(", ");
      const genres = Array.from(
        content.querySelectorAll(".mg_genres .summary-content a")
      ).map((a: HTMLElement) => a.textContent);
      let statusRaw =
        content
          .querySelector(".mg_status .summary-content")
          .textContent?.replace(/[\s]/g, "")
          .toLowerCase() || "";
      const status =
        statusRaw == "canceled"
          ? "Dropped"
          : statusRaw == "onhold"
          ? "Hiatus"
          : statusRaw == "ongoing"
          ? "On Going"
          : "Completed";

      const meta = element.querySelector(".tab-meta");

      const latestTitle =
        meta.querySelector("span.chapter a")?.textContent || "";
      const timestamp =
        new Date(
          meta.querySelector("div.post-on span").textContent + " UTC"
        ).getTime() || 0;

      data.push({
        id: title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/[\s]/g, "-"), // "Example, The Novel 2" -> "example-the-novel-2"
        title,
        image,
        sourceIds: { "boxnovel.com": sourceId },
        author,
        genres,
        status,
        chapters: [{ id: "", title: latestTitle, timestamp }],
      });
    });

    return { status: 200, success: true, data };
  } catch (error) {
    console.error("An error occurred:", error);

    return {
      status: 500,
      success: false,
      error: "An error occurred while retreiving novel data.",
    };
  }
};

export default API_boxnovel_com_Search;
