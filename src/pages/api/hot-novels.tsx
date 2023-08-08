import { NextApiRequest, NextApiResponse } from "next";
import { executablePath } from "puppeteer";
import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import { Novel } from "../../types/Novel";

puppeteer.use(pluginStealth());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const browser = await puppeteer.launch({
            executablePath: executablePath(),
            headless: "new",
        });
        const page = await browser.newPage();

        await page.goto("https://novelusb.com/");

        await page.waitForSelector("#index-novel-hot");

        const novelData: Novel[] = await page.evaluate(() => {
            const data: Novel[] = [];
            const novelElements = document.querySelectorAll("#index-novel-hot .item");

            novelElements.forEach((element) => {
                const titleElement = element.querySelector(".title h3");
                const imageElement = element.querySelector(".item-img");

                if (titleElement && imageElement) {
                    const title = titleElement.textContent?.trim() || "";
                    const url = element.querySelector("a")?.getAttribute("href") || "";
                    const cover = imageElement.getAttribute("src") || "";

                    data.push({ title, url, cover });
                }
            });

            return data;
        });

        await browser.close();

        res.status(200).json(novelData);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An error occurred while extracting novel data." });
    }
};
