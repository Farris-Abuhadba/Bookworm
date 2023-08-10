import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { Chapter } from "../../../types/Novel";

export default function ChapterContent() {
  const router = useRouter();
  const { novel, chapter } = router.query;

  if (novel == undefined || chapter == undefined)
    return <LoadingScreen backUrl={"/novel/" + novel} />;

  const [chapterData, setChapterData] = useState<Chapter>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/chapter?novelId=${novel}&chapterId=${chapter}`)
      .then((response) => response.json())
      .then((data) => {
        setChapterData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching novel data:", error);
        setIsLoading(false);
      });
  }, [novel, chapter]);

  if (isLoading) return <LoadingScreen backUrl={"/novel/" + novel} />;

  const parts = (chapter as string).split("-");
  const nextChapter = parts[0] + "-" + (parseInt(parts[1], 10) + 1);

  return (
    <div className="bg-neutral-950 w-3/5 m-5 mx-auto rounded-md p-4 px-7">
      <h1>{chapterData.title}</h1>
      <div>
        {chapterData.content.map((text) => {
          return <p className="my-4">{text}</p>;
        })}
      </div>
      <a
        className="text-blue-500 hover:underline"
        href={`/novel/${novel}/${nextChapter}`}
      >
        Next Chapter
      </a>
    </div>
  );
}
