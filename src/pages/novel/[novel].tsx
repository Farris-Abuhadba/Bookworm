import React from "react";
import RelativeTime from "@yaireo/relative-time";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiSolidFile } from "react-icons/bi";
import { useQuery } from "react-query";
import ChapterList from "../../components/ChapterList";
import ErrorScreen from "../../components/ErrorScreen";
import LoadingScreen from "../../components/LoadingScreen";
import NovelPanel from "../../components/NovelPanel";
import { Chapter, Novel } from "../../types/Novel";

const NovelPage = () => {
  const router = useRouter();
  const novelName = router.query.novel?.toString();

  const { data: novel, isLoading, error } = useQuery(["novel", novelName], async () => {
    const response = await fetch(`/api/novel?id=${novelName}`);
    const data = await response.json();
    return data;
  }, {
    enabled: !!novelName,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingScreen />;
  if (error || !novel) return <ErrorScreen title="API Error">Novel not found</ErrorScreen>;

  return (
    <>
      <NovelPanel novel={novel} />
      <LatestChapter chapter={novel.chapters[novel.chapters.length - 1]} />
      <ChapterList chapters={novel.chapters} />
    </>
  );
};

interface LatestChapterProps {
  chapter: Chapter;
}

const LatestChapter: React.FC<LatestChapterProps> = ({ chapter }) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-between panel">
      <span className="flex items-center shrink-0 text-zinc-400">
        <BiSolidFile className="me-2" />
        Lastest Chapter
      </span>
      <Link href={`${location.href}/${chapter.id}`} title={chapter.title}>
        <span className="line-clamp-1 sm:text-center hover:text-lavender-600 fade">
          {chapter.title}
        </span>
      </Link>
      <span className="text-zinc-500 shrink-0">
        {new RelativeTime().from(new Date(chapter.timestamp))}
      </span>
    </div>
  );
};

export default NovelPage;
