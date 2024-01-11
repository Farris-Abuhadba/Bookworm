import { Inter } from "next/font/google";
import NovelShowcase from "../components/NovelShowcase";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <NovelShowcase />;
}
