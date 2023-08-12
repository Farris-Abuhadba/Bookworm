import { useEffect, useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { Chapter } from "../../../types/Novel";
import { useRouter } from "next/router";

export default function ChapterContent() {
    const router = useRouter();
    const { novel, chapter } = router.query;
    const currentChapter = Array.isArray(chapter) ? chapter[0] : chapter;

    if (novel == undefined || currentChapter == undefined)
        return <LoadingScreen backUrl={"/novel/" + novel} />;

    const [chapterData, setChapterData] = useState<Chapter>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem(`lastReadChapter_${novel}`, currentChapter);
        console.log(`lastReadChapter_${novel}`, currentChapter);

        fetch(`/api/chapter?novelId=${novel}&chapterId=${currentChapter}`)
            .then((response) => response.json())
            .then((data) => {
                setChapterData(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching chapter data:", error);
                setIsLoading(false);
            });
    }, [novel, currentChapter]);

    if (isLoading) return <LoadingScreen backUrl={"/novel/" + novel} />;

    const parts = currentChapter.split("-");
    const nextChapter = parts[0] + "-" + (parseInt(parts[1], 10) + 1);

    return (
        <div className="bg-neutral-950 w-3/5 m-5 mx-auto rounded-md p-4 px-7">
            <h1>{chapterData.title}</h1>
            <div>
                {chapterData.content.map((text) => {
                    return <p className="my-4">{text}</p>;
                })}
            </div>
            <a className="text-blue-500 hover:underline" href={`/novel/${novel}/${nextChapter}`}>
                Next Chapter
            </a>
        </div>
    );
}
