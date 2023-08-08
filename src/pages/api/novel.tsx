import { NextApiRequest, NextApiResponse } from "next";
import { executablePath } from "puppeteer";
import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import { Chapter, Novel } from "../../types/Novel";

puppeteer.use(pluginStealth());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const novelName = req.query.name;
    console.log(req.query);

    const browser = await puppeteer.launch({
        executablePath: executablePath(),
        headless: "new",
    });

    try {
        const page = await browser.newPage();

        const novelUrl = `https://novelusb.com/novel-book/${novelName}-novel#tab-chapters-title`;
        await page.goto(novelUrl);

        await page.waitForSelector("#list-chapter a");

        if ((await page.$$("#list-chapter a")).length == 30) await page.waitForTimeout(1500);

        const info = await page.$$eval("meta", (metas) => {
            var info = {};

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
                } else if (meta.getAttribute("itemprop") == "image") info["cover"] = content;
            });

            if (info["status"] == "OnGoing") info["status"] = "On Going";

            return info;
        });

        const rating = await page.$eval("span[itemprop='ratingValue']", (span) => {
            return Math.round(parseFloat(span.textContent) * 5) / 10;
        });

        var chapters: Chapter[] = await page.$$eval("#list-chapter a", (a) => {
            var chapters = [];

            a.forEach((a) => {
                let title = a.getAttribute("title") || "";
                let url = a.getAttribute("href").split("/").slice(-1) || "";
                chapters.push({ title, url, timestamp: 0 });
            });
            return chapters;
        });

        chapters[chapters.length - 1].timestamp = info["last_update"];

        const novel: Novel = {
            title: info["title"],
            cover: info["cover"],
            url: `https://novelusb.com/novel-book/${novelName}-novel`,
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
        res.status(500).json({ error: "An error occurred while extracting chapter data." });
    }

    await browser.close();
};
