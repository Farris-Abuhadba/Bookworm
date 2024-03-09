import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";
import { Chapter } from "../../../../types/Novel";

const API_boxnovel_com_Chapter = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const novel: string = (req.query["novel"] || "") as string;
  const id: string = (req.query["id"] || "") as string;

  var results = await boxnovel_com_Chapter(novel, id);
  let status = results.status;
  delete results["status"];

  res.status(status).json(results);
};

const boxnovel_com_Chapter = async (novel: string, id: string) => {
  if (novel == undefined || novel == "") {
    return { status: 404, success: false, error: "Novel not found" };
  }

  if (id == undefined || id == "") {
    return { status: 404, success: false, error: "Chapter not found" };
  }

  try {
    const response = await fetch(`https://boxnovel.com/novel/${novel}/${id}`);
    const document = new JSDOM(await response.text()).window.document;

    const novelH1 = document.querySelector(
      "div.profile-manga div.post-title h1"
    );
    if (novelH1 != null) {
      return { status: 404, success: false, error: "Chapter not found" };
    }

    const titleElement = document.querySelector("h3");
    if (titleElement == null) {
      return { status: 404, success: false, error: "Novel not found" };
    }

    const title = titleElement.textContent || "";

    var content = [];
    var ps = document.querySelectorAll("div.text-left p");
    ps.forEach((p) => {
      if (p != null && p.textContent != "") {
        p.querySelectorAll("i").forEach((i) => (i.textContent = ""));
        p.textContent.split("\n").forEach((line) => {
          let text = line.trim();
          if (text != "") content.push(text);
        });
      }
    });

    const chapter: Chapter = {
      id,
      title,
      content,
    };

    return { status: 200, success: true, data: chapter };
  } catch (error) {
    console.error("An error occurred:", error);

    return {
      status: 500,
      success: false,
      error: "An error occurred while retreiving chapter data.",
    };
  }
};

export default API_boxnovel_com_Chapter;
