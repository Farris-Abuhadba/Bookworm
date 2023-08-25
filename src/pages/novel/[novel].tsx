import { Stack } from "@mantine/core";
import RelativeTime from "@yaireo/relative-time";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TiDocument } from "react-icons/ti";
import ChapterList from "../../components/ChapterList";
import LoadingScreen from "../../components/LoadingScreen";
import NovelPanel from "../../components/NovelPanel";
import { Chapter, Novel } from "../../types/Novel";
import { useQuery } from "react-query";

export default function NovelPage() {
  const router = useRouter();
  const novelName = router.query.novel?.toString();
  const cleanedNovelName = novelName?.substring(
    0,
    novelName.lastIndexOf("-novel")
  );

  const { data: novel, isLoading } = useQuery({
    queryKey: ["novel", cleanedNovelName],
    queryFn: async () => {
      const response = await fetch(`/api/novel?id=${cleanedNovelName}`);
      const data = await response.json();
      return data;
    },
    enabled: !!cleanedNovelName,
  });

  if (isLoading || !novel) return <LoadingScreen backUrl="/" />;

  return (
    <Stack className="w-4/5 mx-auto my-5" spacing="xs">
      <NovelPanel novel={novel} />
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
        <a
          className="underline text-neutral-400 hover:text-neutral-200"
          href={chapter.id}
        >
          {chapter.title}
        </a>
      </span>
      <span className="text-neutral-400/50">
        {new RelativeTime().from(new Date(chapter.timestamp))}
      </span>
    </div>
  );
};
