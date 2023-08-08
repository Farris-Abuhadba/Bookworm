import { Loader, Stack } from "@mantine/core";
import RelativeTime from "@yaireo/relative-time";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TiArrowBack, TiDocument } from "react-icons/ti";
import ChapterList from "../../components/ChapterList";
import BookPanel from "../../components/NovelPanel";
import { Chapter, Novel } from "../../types/Novel";
import LoadingScreen from "../../components/LoadingScreen";

export default function NovelPage() {
    const router = useRouter();
    const novelName = router.query.name?.toString();
    const cleanedNovelName = novelName?.substring(0, novelName.lastIndexOf("-novel"));

    const [novel, setNovel] = useState<Novel | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (cleanedNovelName) {
            fetch(`/api/novel?name=${cleanedNovelName}`)
                .then((response) => response.json())
                .then((data) => {
                    setNovel(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching novel data:", error);
                    setIsLoading(false);
                });
        }
    }, [cleanedNovelName]);

    if (isLoading) return <LoadingScreen backUrl="/" />;

    return (
        <Stack className="max-w-3/5 container mx-auto mt-5" spacing="xs">
            <BookPanel novel={novel} />
            <LatestChapter chapter={novel.chapters[novel.chapters.length - 1]} />
            <ChapterList chapters={novel.chapters} />
        </Stack>
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
