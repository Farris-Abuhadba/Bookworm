import { NextApiRequest, NextApiResponse } from "next";
import { Novel, Chapter } from "../../../../types/Novel";
import { JSDOM } from "jsdom";
import { createIdFromTitle } from "../../novel";
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const API_boxnovel_com_Novel = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id: string = (req.query["id"] || "") as string;

  var results = await boxnovel_com_Novel(id);
  let status = results.status;
  delete results["status"];

  // Temp store chapters to add it back in when sending to user
  const chapters = results.data.chapters;

  // Remove chapters from the novel object before sending it to DB
  const novelDataForDB = {...results.data};
  delete novelDataForDB.chapters;

// Check if novel exists in DB
  const {data: existingNovel, error} = await supabase
    .from('novels')
    .select('*')
    .eq('id', novelDataForDB.id)
    .maybeSingle();

  if (error){
    console.error('Error checking novel: ', error);
    res.status(500).json({success: false, error: 'DB error'});
    return;
  }

  if (existingNovel) {
    // Novel exists, fetch the full novel data from DB
    const { data: existingNovelData, error: fetchError } = await supabase
      .from('novels')
      .select('*') // Select all fields of the novel
      .eq('id', novelDataForDB.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching full novel data:', fetchError);
      res.status(500).json({ success: false, error: 'Database error' });
      return;
    }

    const novelData = existingNovelData as Novel;

    // Update chapter count and add chapters
    novelData.chapter_count = novelDataForDB.chapter_count;
    novelData.chapters = chapters;

    // Return the updated novel data including the chapters
    res.status(200).json({ success: true, data: novelData });

  } else {
      // Novel does not exist, insert new
      const { data: insertedNovel, error: insertError } = await supabase
        .from('novels')
        .insert([novelDataForDB]);

      if (insertError) {
        console.error('Error inserting novel:', insertError);
        res.status(500).json({ success: false, error: 'Database error' });
        return;
    }

    console.log('Novel inserted:', novelDataForDB.id);
    res.status(status).json(results);
 }
};

const boxnovel_com_Novel = async (novelId: string) => {
  if (novelId == "")
    return { status: 404, success: false, error: "Novel not found" };

  try {
    const novelResponse = await fetch(`https://boxnovel.com/novel/${novelId}/`);
    const novelDocument = new JSDOM(await novelResponse.text()).window.document;

    var status: "On Going" | "Completed" | "Dropped" | "Hiatus" = "On Going";
    var title = "";
    var image = "";
    var author = "";
    var genres: string[] = [];
    var description = "";

    const titleElement = novelDocument.querySelector("div.post-title h1");
    if (titleElement == null)
      return { status: 404, success: false, error: "Novel not found" };

    const imageElement = novelDocument.querySelector("div.summary_image img");
    const descriptionElements = novelDocument.querySelectorAll(
      "div.description-summary p"
    );

    title = titleElement.textContent?.trim() || "";
    image = imageElement.getAttribute("data-src") || "";
    for (let i = 0; i < descriptionElements.length; i++) {
      let line = descriptionElements[i].textContent;
      if (line.includes("BOXNOVEL") || line.includes("__________")) break;
      description += line + "\n\n";
    }
    description = description.trim();

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
      `https://boxnovel.com/novel/${novelId}/ajax/chapters/`,
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
      title,
      image,
      id: createIdFromTitle(title),
      chapter_count: chapters.length,
      author,
      genres,
      rating,
      status,
      description,
      chapters: chapters.toReversed(),
      sourceIds: { "boxnove.com": novelId },
    };

    return { status: 200, success: true, data: novel };
  } catch (error) {
    console.error("An error occurred:", error);

    return {
      status: 500,
      success: false,
      error: "An error occurred while retreiving novel data.",
    };
  }
};

export default API_boxnovel_com_Novel;;
