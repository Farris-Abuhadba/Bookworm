import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { Chapter } from "../../../types/Novel";

export default function ChapterContent() {
    const router = useRouter();
    const { name, chapter } = router.query;

    const [chapterData, setChapterData] = useState<Chapter>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/chapter?novel=${name}&chapter=${chapter}`)
            .then((response) => response.json())
            .then((data) => {
                setChapterData(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching novel data:", error);
                setIsLoading(false);
            });
    }, [name, chapter]);

    if (isLoading) return <LoadingScreen backUrl={"/novel/" + name} />;

    return (
        <div className="bg-neutral-950 w-3/5 m-5 mx-auto rounded-md p-4 px-7">
            <h1>{chapterData.title}</h1>
            <div>
                {chapterData.content.map((text) => {
                    return <p className="my-4">{text}</p>;
                })}
            </div>
        </div>
    );
}
