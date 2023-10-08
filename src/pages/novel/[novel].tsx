import RelativeTime from "@yaireo/relative-time";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiSolidFile } from "react-icons/bi";
import { useQuery } from "react-query";
import ChapterList from "../../components/ChapterList";
import ErrorScreen from "../../components/ErrorScreen";
import LoadingScreen from "../../components/LoadingScreen";
import NovelPanel from "../../components/NovelPanel";
import { Chapter } from "../../types/Novel";

export default function NovelPage() {
  const router = useRouter();
  const novelName = router.query.novel?.toString();

  const { data: novel, isLoading } = GetNovelData(novelName);
  if (isLoading || !novel) return <LoadingScreen />;
  if (novel.error)
    return <ErrorScreen title="API Error">Novel not found</ErrorScreen>;
  sessionStorage.setItem(novel.id, JSON.stringify(novel));

  return (
    <>
      <NovelPanel novel={novel} />
      <LatestChapter chapter={novel.chapters[novel.chapters.length - 1]} />
      <ChapterList chapters={novel.chapters} />
    </>
  );
}

export const GetNovelData = (novelId: string) => {
  let cleanedNovelId;
  if (novelId != undefined) {
    cleanedNovelId = novelId.substring(0, novelId.lastIndexOf("-novel"));
  }

  return useQuery({
    queryKey: ["novel", cleanedNovelId],
    queryFn: async () => {
      const response = await fetch(`/api/novel?id=${cleanedNovelId}`);
      const data = await response.json();
      return data;
    },
    enabled: !!novelId,
    refetchOnWindowFocus: false,
  });
};

interface LatestChapterProps {
  chapter: Chapter;
}

const LatestChapter = ({ chapter }: LatestChapterProps) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-between panel">
      <span className="flex items-center shrink-0 text-zinc-400">
        <BiSolidFile className="me-2" />
        Lastest Chapter
      </span>
      <Link href={location.href + "/" + chapter.id} title={chapter.title}>
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
