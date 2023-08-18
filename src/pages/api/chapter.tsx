import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";
import { Chapter } from "../../types/Novel";

const API_Chapter = async (req: NextApiRequest, res: NextApiResponse) => {
  const { novelId, chapterId } = req.query;
  console.log(req.query);

  if (novelId == undefined || chapterId == undefined) {
    res.status(404).json({ error: "Novel or chapter cannot be undefined" });
    return;
  }

  try {
    const response = await fetch(
      `https://novelusb.com/novel-book/${novelId}/${chapterId}`
    );
    const document = new JSDOM(await response.text()).window.document;

    var title = document.querySelector("a.chr-title").textContent;

    var content = [];
    var ps = document.querySelectorAll("#chr-content p");
    ps.forEach((p) => {
      if (p && p.textContent != "") content.push(p.textContent);
    });

    const chapter: Chapter = {
      title,
      id: chapterId.toString(),
      content,
    };

    res.status(200).json(chapter);
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while extracting chapter data." });
  }
};

export default API_Chapter;
