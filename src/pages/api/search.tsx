import { NextApiRequest, NextApiResponse } from "next";
import API_boxnovel_com_Search from "./scrapers/boxnovel.com/search";

const API_Search = async (req: NextApiRequest, res: NextApiResponse) => {
  return await API_boxnovel_com_Search(req, res);
};

export default API_Search;
