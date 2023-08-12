import { NextApiRequest, NextApiResponse } from "next";
import { Novel } from "../../types/Novel";
import { JSDOM } from "jsdom";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const response = await fetch("https://novelusb.com/");
        const document = new JSDOM(await response.text()).window.document;
        const data: Novel[] = [];
        const novelElements = document.querySelectorAll("#index-novel-hot .item");
        novelElements.forEach((element) => {
            const titleElement = element.querySelector(".title h3");
            const imageElement = element.querySelector(".item-img");

            if (titleElement && imageElement) {
                const title = titleElement.textContent?.trim() || "";
                const id =
                    element.querySelector("a")?.getAttribute("href").split("/").slice(-1) || "";
                const cover = imageElement.getAttribute("src") || "";

                data.push({ title, id, cover });
            }
        });

        res.status(200).json(data);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An error occurred while extracting novel data." });
    }
};
