import { NextApiRequest, NextApiResponse } from "next";
import puppeteer, { executablePath } from "puppeteer";
import { Chapter } from "../../types/Novel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const novelId = req.query.novel;
    const chapterId = req.query.chapter;
    console.log(req.query);

    if (novelId == undefined || chapterId == undefined) {
        res.status(404).json({ error: "Novel or chapter cannot be undefined" });
        return;
    }

    const browser = await puppeteer.launch({
        executablePath: executablePath(),
        headless: "new",
    });

    try {
        const page = await browser.newPage();

        const chapterUrl = `https://novelusb.com/novel-book/${novelId}/${chapterId}`;
        await page.goto(chapterUrl);

        await page.waitForSelector("#chr-content p");

        const title = await page.$eval("a.chr-title", (a) => {
            return a.textContent;
        });

        const content = await page.$$eval("#chr-content p", (ps) => {
            var content = [];

            ps.forEach((p) => {
                content.push(p.textContent);
            });

            return content;
        });

        const chapter: Chapter = {
            title,
            url: chapterUrl,
            content,
        };

        res.status(200).json(chapter);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An error occurred while extracting chapter data." });
    }

    await browser.close();
};
