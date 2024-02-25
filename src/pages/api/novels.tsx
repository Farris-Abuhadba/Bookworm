import { NextApiRequest, NextApiResponse } from "next";
import { boxnovel_com_Search } from "./scrapers/boxnovel.com/search";

const API_Novels = async (req: NextApiRequest, res: NextApiResponse) => {
  var novels = {
    popular: "views",
    trending: "trending",
    latest: "latest",
    new: "new-manga",
  };

  var results;
  var success = true;

  for (let category in novels) {
    results = await boxnovel_com_Search("", novels[category]);
    success = success && results.success;
    novels[category] = results.data;
  }

  if (success) {
    res.status(200).json({ success, data: novels });
  } else {
    res.status(500).json({
      success,
      error: "Could not retrieve all categories",
      data: novels,
    });
  }
};

export default API_Novels;
