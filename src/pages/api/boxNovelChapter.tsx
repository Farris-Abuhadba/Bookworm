import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";
import { Chapter } from "../../types/Novel";

const BOXNOVEL_API_Chapter = async (req: NextApiRequest, res: NextApiResponse) => {
  const { novelId, chapterId } = req.query;

  console.log(req.query);

  if (novelId == undefined || chapterId == undefined) {
    res.status(404).json({ error: "Novel or chapter cannot be undefined" });
    return;
  }


  try {
    const tempTitle: string = `${chapterId}`
    const parts: string[] = tempTitle.split('-')
    const result: string = parts.slice(0,2).join('-')
    const cleanChapterID = result;

    const response = await fetch(
      `https://boxnovel.com/novel/${novelId}-boxnovel/${cleanChapterID}`
    );
    const document = new JSDOM(await response.text()).window.document;
    const title = chapterId.toString();
    
    // var watermark: String = document.querySelector(
    //   ".comments > script:nth-child(2)"
    // ).textContent;
    // watermark = watermark.substring(
    //   watermark.indexOf('replace("') + 9,
    //   watermark.indexOf('", "")')
    // );

    var content = [];
    var ps = document.querySelectorAll("div.text-left p");
    ps.forEach((p) => {
      if (p && p.textContent != "")
        content.push(p.textContent);
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

export default BOXNOVEL_API_Chapter;
