import { Loader, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import RelativeTime from "@yaireo/relative-time";
import axios from "axios";
import { useRouter } from "next/router";
import { TiArrowBack, TiDocument } from "react-icons/ti";
import BookPanel from "../../components/BookPanel";
import ChapterList from "../../components/ChapterList";

export interface Book {
    title: string;
    author: string;
    cover: string;

    chapter_count: number;
    views: number;
    rating: number;
    status: "Completed" | "On Going" | "Dropped" | "Hiatus";

    genres: string[];

    chapters: Chapter[];
}

export interface Chapter {
    title: string;
    url: string;
    timestamp: number;
}

export default function LightNovels() {
    const router = useRouter();
    const novelName = router.query.name?.toString();
    if (!novelName) return <h1>Error</h1>;
    const cleanedNovelName = novelName.substring(0, novelName.lastIndexOf("-novel"));

    const { data: response, isLoading } = useQuery(
        ["novel-chapters"],
        async () => {
            return axios.get(`http://localhost:8000/light-novel/${cleanedNovelName}`);
        },
        { enabled: Boolean(router.isReady), refetchOnWindowFocus: false }
    );

    return (
        <>
            {isLoading ? (
                <div className="flex h-screen">
                    <TiArrowBack
                        className="absolute m-2 cursor-pointer hover:text-sky-600"
                        size={32}
                        onClick={() => {
                            location.href = "/novel-list";
                        }}
                    />
                    <Loader className="m-auto" size="xl" />
                </div>
            ) : (
                <Stack className="max-w-2/5 w-3/5 min-w-fit container mx-auto mt-5" spacing="xs">
                    <BookPanel book={response.data} />
                    <LatestChapter
                        chapter={response.data.chapters[response.data.chapters.length - 1]}
                    />
                    <ChapterList chapters={response.data.chapters} />
                </Stack>
            )}
        </>
    );
}

interface LatestChapterProps {
    chapter: Chapter;
}

const LatestChapter = ({ chapter }: LatestChapterProps) => {
    return (
        <div className="p-4 flex justify-between bg-stone-950 rounded-md">
            <span className="flex flex-none items-center">
                <TiDocument className="me-2" />
                Lastest Chapter
            </span>
            <span>
                <a className="underline text-neutral-400 hover:text-neutral-200" href={chapter.url}>
                    {chapter.title}
                </a>
            </span>
            <span className="text-neutral-400/50">
                {new RelativeTime().from(new Date(chapter.timestamp))}
            </span>
        </div>
    );
};
