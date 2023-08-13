import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { Chapter, Novel } from "../../../types/Novel";
import { Button, Group, Image, Stack } from "@mantine/core";

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

  const novelData = JSON.parse(localStorage.getItem(novel.toString()));
  if (!novelData) location.href = "/novel/" + novel;

  return (
    <Stack className="w-4/5 mx-auto my-5" spacing="xs">
      <ChapterHeader novel={novelData} chapter={chapterData} />

      <div className="bg-neutral-950 rounded-md p-4 px-7">
        {chapterData.content.map((text, index) => {
          return (
            <p key={index} className="my-4">
              {text}
            </p>
          );
        })}
      </div>

      <ChapterControls novel={novelData} chapter={chapterData} />
    </Stack>
  );
}

interface ChapterHeaderProps {
  novel: Novel;
  chapter: Chapter;
}

const ChapterHeader = ({ novel, chapter }: ChapterHeaderProps) => {
  return (
    <Group className="bg-neutral-950 rounded-md p-4 px-7">
      <Image
        className="my-2 rounded-md border border-neutral-800"
        src={novel.cover}
        height={100}
        width={75}
        radius="md"
        withPlaceholder
      />
      <div>
        <a
          className="text-4xl font-bold hover:text-sky-600 hover:underline"
          href={"/novel/" + novel.id}
        >
          {novel.title}
        </a>
        <br />
        <p className="text-xl">{chapter.title}</p>
      </div>
    </Group>
  );
};

interface ChapterControlsProps {
  novel: Novel;
  chapter: Chapter;
}

const ChapterControls = ({ novel, chapter }: ChapterControlsProps) => {
  var currentChapterIndex;
  novel.chapters.forEach((c, index) => {
    if (c.id == chapter.id) {
      currentChapterIndex = index;
    }
  });

  return (
    <div className="bg-neutral-950 rounded-md p-4 px-7 flex justify-between">
      <Button
        className="me-2 bg-sky-600"
        onClick={() => {
          location.href = `/novel/${novel.id}/${
            novel.chapters[currentChapterIndex - 1].id
          }`;
        }}
        disabled={currentChapterIndex - 1 < 0}
      >
        Prev
      </Button>

      <Button
        className="me-2 bg-sky-600"
        onClick={() => {
          location.href = `/novel/${novel.id}`;
        }}
      >
        Chapter List
      </Button>

      <Button
        className="me-2 bg-sky-600"
        onClick={() => {
          location.href = `/novel/${novel.id}/${
            novel.chapters[currentChapterIndex + 1].id
          }`;
        }}
        disabled={novel.chapters.length <= currentChapterIndex + 1}
      >
        Next
      </Button>
    </div>
  );
};
