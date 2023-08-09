import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export default async (req, res) => {
  const { keyword, pageNumber } = req.query;

  puppeteer.use(StealthPlugin());

  try {
    const browser = await puppeteer.launch({ headless: true });
    const browserPage = await browser.newPage();

    const url = `https://novelusb.com/search?keyword=${keyword}&page=${pageNumber}`;
    await browserPage.goto(url);

    // Wait until the page is fully loaded
    await browserPage.waitForSelector("h3.novel-title > a");

    const novelLinks = await browserPage.evaluate(() => {
      const links = [];
      const searchedNovels = document.querySelectorAll("h3.novel-title > a");
      searchedNovels.forEach((title) => {
        const href = title.getAttribute("href");
        if (href) {
          links.push(href);
        }
      });
      return links;
    });

    const nextPageNumber = await browserPage.evaluate(() => {
      const lastLink = document.querySelector(".last > a");
      let nextPage = 1;
      if (lastLink) {
        const lastHref = lastLink.getAttribute("href");
        const queries = lastHref?.split("&");
        queries?.forEach((query) => {
          if (query.includes("page")) {
            nextPage = parseInt(query.split("=")[1]);
          }
        });
      }
      return nextPage;
    });

    await browser.close();
    res.status(200).json({ novelLinks, nextPageNumber });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for novel data." });
  }
};
