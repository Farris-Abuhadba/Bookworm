import RelativeTime from "@yaireo/relative-time";
import { BackgroundImage, Image } from "@mantine/core";
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
      <div className="-z-10 fixed top-0 left-0 w-screen h-[480px] overflow-hidden">
        <Image
          className="saturate-50 opacity-25 blur-md"
          h={480}
          src={novel.image}
          fallbackSrc="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a"
        />
      </div>
      <div className="sticky top-0 h-0 mt-[400px] -z-10">
        <div className="bg-primary-600 h-[480px]" />
      </div>
      <div className="panel space-y-8 -mt-[400px]">
        <NovelPanel novel={novel} />
        <LatestChapter chapter={novel.chapters[novel.chapters.length - 1]} />
        <ChapterList chapters={novel.chapters} />
      </div>
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
