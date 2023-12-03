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
            <p className="p-4 bg-primary-500 rounded-b">
              The human Race is at war with the Vicious Dalki and when they
              needed help more than ever, THEY started to come forward. Humans
              who had hidden in the shadows for hundreds of years, people with
              abilities. Some chose to share their knowledge to the rest of the
              world in hopes of winning the war, while others kept their
              abilities to themselves. Quinn had lost everything to the war, his
              home, his family and the only thing he had inherited was a crummy
              old book that he couldn't even open. But when the book had finally
              opened, Quinn was granted a system and his whole life was turned
              around. He completed quest after quest and became more powerful,
              until one day the system gave him a quest he wasn't sure he could
              complete. "It is time to feed!" "You must drink human blood within
              24 hours" "Your HP will continue to decrease until the task has
              been completed"
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
    <div className="flex flex-wrap sm:flex-nowrap justify-between">
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
