import { NextApiRequest, NextApiResponse } from "next";
import API_boxnovel_com_Chapter from "./scrapers/boxnovel.com/chapter";

const sourceMap = {
  "boxnovel.com": API_boxnovel_com_Chapter,
};

const API_Novel = async (req: NextApiRequest, res: NextApiResponse) => {
  const source = req.query["source"];
  if (source == null || !((source as string) in sourceMap)) {
    res.status(404).json({
      success: false,
      error: "Source not found",
    });
    return;
  }

  await sourceMap[source as string](req, res);
};

export const createIdFromTitle = (title: string) => {
  // Makes all letters lowercase
  // Removes any special characters
  // Replaces spaces with dashes

  // "Example, The Novel 2" -> "example-the-novel-2";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/[\s]/g, "-");
};

export default API_Novel;
