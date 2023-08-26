import RelativeTime from "@yaireo/relative-time";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiSolidFile } from "react-icons/bi";
import { useQuery } from "react-query";
import ChapterList from "../../components/ChapterList";
import LoadingScreen from "../../components/LoadingScreen";
import NovelPanel from "../../components/NovelPanel";
import { Chapter } from "../../types/Novel";

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
  sessionStorage.setItem(novel.id, JSON.stringify(novel));

  return (
    <div className="sm:w-4/5 mx-auto sm:my-5 space-y-1 sm:space-y-2">
      <NovelPanel novel={novel} />
      <LatestChapter chapter={novel.chapters[novel.chapters.length - 1]} />
      <ChapterList chapters={novel.chapters} />
    </div>
  );
}

interface LatestChapterProps {
  chapter: Chapter;
}

const LatestChapter = ({ chapter }: LatestChapterProps) => {
  return (
    <div className="p-4 flex flex-wrap sm:flex-nowrap justify-between sm:space-x-2 bg-stone-950 sm:rounded-md">
      <span className="flex flex-none items-center me-2 sm:me-0">
        <BiSolidFile className="me-2" />
        Lastest Chapter
      </span>
      <Link href={location.href + "/" + chapter.id}>
        <span className="truncate sm:text-center grow text-neutral-400 hover:text-neutral-200">
          {chapter.title}
        </span>
      </Link>
      <span className="text-neutral-400/50">
        {new RelativeTime().from(new Date(chapter.timestamp))}
      </span>
    </div>
  );
};
