import { Image } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiLeftArrowAlt, BiListUl, BiRightArrowAlt } from "react-icons/bi";
import { useQuery } from "react-query";
import {
  ChapterSettings,
  Setting,
  getSetting,
} from "../../../components/ChapterSettings";
import ErrorScreen from "../../../components/ErrorScreen";
import LoadingScreen from "../../../components/LoadingScreen";
import { Chapter, Novel } from "../../../types/Novel";

export default function ChapterContent() {
  const router = useRouter();
  const { novel, chapter } = router.query;
  const currentChapter = Array.isArray(chapter) ? chapter[0] : chapter;

  const properties = {
    fontSize: {
      name: "Font Size",
      type: "number",
      defaultValue: 16,
      state: useState(16),
      min: 8,
      max: 72,
    },

    lineHeight: {
      name: "Line Height",
      type: "number",
      defaultValue: 1.5,
      state: useState(1.5),
      min: 1,
      max: 5,
      precision: 1,
      step: 0.5,
    },

    paragraphSpacing: {
      name: "Paragraph Spacing",
      type: "number",
      defaultValue: 32,
      state: useState(32),
      min: 0,
      max: 100,
    },

    textColor: {
      name: "Text Color",
      type: "color",
      defaultValue: "#D4D4D8",
      state: useState("#D4D4D8"),
    },

    backgroundColor: {
      name: "Background Color",
      type: "color",
      defaultValue: "#27272A",
      state: useState("#27272A"),
    },
  };

  const fontSize = properties.fontSize.state[0];
  const lineHeight = properties.lineHeight.state[0];
  const paragraphSpacing = properties.paragraphSpacing.state[0];
  const textColor = properties.textColor.state[0];
  const backgroundColor = properties.backgroundColor.state[0];

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ["chapter", novel, currentChapter],
    queryFn: () =>
      fetch(`/api/chapter?novelId=${novel}&chapterId=${currentChapter}`).then(
        (response) => response.json()
      ),
    enabled: router.isReady,
  });

  useEffect(() => {
    Object.keys(properties).forEach((key) => {
      let saved = getSetting(key);
      if (saved != undefined) {
        properties[key].state[1](saved);
      }
    });
  }, []);

  if (!router.isReady || isLoading) return <LoadingScreen />;

  var lastReadChapters = JSON.parse(localStorage.getItem("lastReadChapters"));
  if (lastReadChapters == undefined) lastReadChapters = {};
  lastReadChapters[novel.toString()] = currentChapter;
  localStorage.setItem("lastReadChapters", JSON.stringify(lastReadChapters));

  const novelData = JSON.parse(sessionStorage.getItem(novel.toString()));
  if (!novelData) location.href = "/novel/" + novel;

  if (chapterData.error != undefined)
    return <ErrorScreen title="API Error">{chapterData.error}</ErrorScreen>;

  return (
    <>
      <ChapterHeader
        novel={novelData}
        chapter={chapterData}
        settings={Object.keys(properties).map((key) => {
          let property: Setting = properties[key];
          property.id = key;

          return property;
        })}
      />

      <div className="panel" style={{ backgroundColor }}>
        {chapterData.content.map((text, index) => {
          return (
            <p
              key={index}
              style={{
                margin:
                  index == 0 ? "0px" : paragraphSpacing + "px 0px 0px 0px",
                fontSize: fontSize + "px",
                lineHeight: lineHeight,
                color: textColor,
              }}
            >
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
  settings: Setting[];
}

const ChapterHeader = ({ novel, chapter, settings }: ChapterHeaderProps) => {
  return (
    <div className="panel flex justify-between items-center text-xl">
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

      <ChapterSettings properties={settings} />
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
