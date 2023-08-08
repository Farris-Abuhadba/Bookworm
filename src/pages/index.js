import { Inter } from "next/font/google";
import NovelList from "./novel-list.tsx";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return <NovelList />;
}
