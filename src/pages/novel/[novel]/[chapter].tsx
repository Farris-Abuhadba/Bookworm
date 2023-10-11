import { Image, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  BiCog,
  BiLeftArrowAlt,
  BiListUl,
  BiRightArrowAlt,
} from "react-icons/bi";
import { useQuery } from "react-query";
import LoadingScreen from "../../../components/LoadingScreen";
import { Chapter, Novel } from "../../../types/Novel";
import ChapterSettings from "../../../components/ChapterSettings";

export default function ChapterContent() {
  const router = useRouter();
  const { novel, chapter } = router.query;
  const currentChapter = Array.isArray(chapter) ? chapter[0] : chapter;

  const [fontSize, setFontSize] = useState<string>(
    fontSizes[getSetting("fontSize", router.isReady, 2)].tailwind
  );

  const [padding, setPadding] = useState<string>(
    "my-" + getSetting("padding", router.isReady, 4)
  );

  const [backgroundColor, setBackgroundColor] = useState("#0F0F0F");

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ["chapter", novel, currentChapter],
    queryFn: () =>
      fetch(`/api/chapter?novelId=${novel}&chapterId=${currentChapter}`).then(
        (response) => response.json()
      ),
    enabled: router.isReady,
  });

  if (!router.isReady || isLoading) return <LoadingScreen />;

  var lastReadChapters = JSON.parse(localStorage.getItem("lastReadChapters"));
  if (lastReadChapters == undefined) lastReadChapters = {};
  lastReadChapters[novel.toString()] = currentChapter;
  localStorage.setItem("lastReadChapters", JSON.stringify(lastReadChapters));

  const novelData = JSON.parse(sessionStorage.getItem(novel.toString()));
  if (!novelData) location.href = "/novel/" + novel;

  // if (chapterData.error != undefined)
  //   return <ErrorScreen title="API Error">{chapterData.error}</ErrorScreen>;

  chapterData.title = "Chapter 1";
  chapterData.id = "test";
  chapterData.content = [
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
    "pack careful also honor five primitive obtain nervous adjective crowd rule instant tide offer appropriate phrase balloon congress mice news birds onto made nametest",
  ];

  return (
    <>
      <ChapterHeader novel={novelData} chapter={chapterData} />

      <div className="panel" style={{ backgroundColor }}>
        {chapterData.content.map((text, index) => {
          return (
            <p key={index} className={`${padding} ${fontSize}`}>
              {text}
            </p>
          );
        })}
      </div>

      <ChapterControls novel={novelData} chapter={chapterData} />
    </>
  );
}

interface ChapterHeaderProps {
  novel: Novel;
  chapter: Chapter;
}

const ChapterHeader = ({ novel, chapter }: ChapterHeaderProps) => {
  return (
    <div className="panel flex justify-between items-center">
      <div className="flex">
        <Image
          className="hidden sm:block h-[100px] w-[75px] shrink-0 rounded-md border border-zinc-700"
          alt={novel.title}
          src={novel.cover}
          height={100}
          width={75}
          radius="md"
          withPlaceholder
        />
        <div className="m-5">
          <a
            className="text-2xl sm:leading-[2.75rem] sm:text-4xl font-bold line-clamp-1 hover:text-lavender-600 fade"
            href={"/novel/" + novel.id}
            title={novel.title}
          >
            {novel.title}
          </a>
          <p className="text-xl line-clamp-1" title={chapter.title}>
            {chapter.title}
          </p>
        </div>
      </div>

      <ChapterSettings />
    </div>
  );
};

interface ChapterControlsProps {
  novel: Novel;
  chapter: Chapter;
}

const ChapterControls = ({ novel, chapter }: ChapterControlsProps) => {
  var currentChapterIndex = 0;
  novel.chapters.forEach((c, index) => {
    if (c.id == chapter.id) {
      currentChapterIndex = index;
    }
  });

  const prevChapter =
    currentChapterIndex - 1 >= 0 && novel.chapters[currentChapterIndex - 1].id;
  const nextChapter =
    currentChapterIndex + 1 < novel.chapters.length &&
    novel.chapters[currentChapterIndex + 1].id;

  return (
    <div className="panel flex justify-between items-center">
      <Link
        href={`/novel/${novel.id}/${prevChapter}`}
        className={
          "p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600 " +
          (currentChapterIndex - 1 < 0 && "invisible")
        }
      >
        <BiLeftArrowAlt title="Previous Chapter" size={24} />
      </Link>

      <Link
        href={`/novel/${novel.id}`}
        className="p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600"
      >
        <BiListUl title="Chapter List" size={24} />
      </Link>

      <Link
        href={`/novel/${novel.id}/${nextChapter}`}
        className={
          "p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600 " +
          (currentChapterIndex + 1 >= novel.chapters.length && "invisible")
        }
      >
        <BiRightArrowAlt title="Next Chapter" size={24} />
      </Link>
    </div>
  );
};

const getSetting = (key: string, ready: boolean, defaultValue: any) => {
  let storedValue;

  if (ready) {
    var settings = JSON.parse(localStorage.getItem("settings"));
    if (settings == undefined) return defaultValue;

    storedValue = settings[key];
  }

  if (storedValue == undefined || Number.isNaN(storedValue))
    return defaultValue;

  return storedValue;
};

const setSetting = (key: string, value: any) => {
  var settings = JSON.parse(localStorage.getItem("settings"));
  if (settings == undefined) settings = {};

  settings[key] = value;
  localStorage.setItem("settings", JSON.stringify(settings));
};

const fontSizes = [
  { value: 0, label: 12, tailwind: "text-xs" },
  { value: 1, label: 14, tailwind: "text-sm" },
  { value: 2, label: 16, tailwind: "text-base" },
  { value: 3, label: 18, tailwind: "text-lg" },
  { value: 4, label: 20, tailwind: "text-xl" },
  { value: 5, label: 24, tailwind: "text-2xl" },
  { value: 6, label: 34, tailwind: "text-3xl" },
  { value: 7, label: 36, tailwind: "text-4xl" },
  { value: 8, label: 48, tailwind: "text-5xl" },
];

// === Tailwind Triggers ===
// my-1
// my-2
// my-3
// my-4
// my-5
// my-6
// my-7
// my-8
// my-9
// my-10
// my-11
// my-12
