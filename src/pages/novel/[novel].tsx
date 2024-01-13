import RelativeTime from "@yaireo/relative-time";
import { BackgroundImage, Image, Tabs } from "@mantine/core";
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
      <div className="-z-20 fixed top-0 left-0 w-screen h-[480px] overflow-hidden">
        <Image
          className="saturate-100x opacity-25 blur-md"
          h={480}
          src={novel.image}
        />
      </div>
      <div className="sticky -top-1 h-0 mt-[400px] -z-10">
        <div className="bg-primary-600 h-[484px] border-t border-accent-600/95" />
      </div>
      <div className="panel flex flex-col space-y-8 -mt-[400px]">
        <NovelPanel novel={novel} />

        <Tabs defaultValue="description">
          <Tabs.List>
            <Tabs.Tab value="description">Description</Tabs.Tab>
            <Tabs.Tab value="chapters">Chapters</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description">
            <p
              className={
                "p-4 bg-primary-500 rounded-b" +
                (novel.description ? "" : " italic text-secondary-600")
              }
            >
              {novel.description || "No description"}
            </p>
          </Tabs.Panel>

          <Tabs.Panel value="chapters">
            <div className="p-4 bg-primary-500 rounded-b space-y-8">
              <LatestChapter
                chapter={novel.chapters[novel.chapters.length - 1]}
              />
              <ChapterList chapters={novel.chapters} />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}

export const GetNovelData = (novelId: string) => {
  return useQuery({
    queryKey: ["novel", novelId],
    queryFn: async () => {
      const response = await fetch(`/api/novel1?id=${novelId}`);
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
  let releaseDate = new Date(chapter.timestamp * 1000);

  return (
    <div className="flex flex-wrap justify-between">
      <span className="flex items-center shrink-0 gap-x-2 text-secondary-500">
        <BiSolidFile />
        Lastest Chapter
      </span>
      <Link href={location.href + "/" + chapter.id} title={chapter.title}>
        <span className="line-clamp-1 hover:text-accent-300 fade">
          {chapter.title}
        </span>
      </Link>
      <span
        className="text-secondary-600 shrink-0"
        title={`${releaseDate.toLocaleDateString()} ${releaseDate.toLocaleTimeString()}`}
      >
        {new RelativeTime().from(releaseDate)}
      </span>
    </div>
  );
};
