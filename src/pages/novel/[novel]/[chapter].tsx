import { Image } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import ChapterControls from "../../../components/ChapterControls";
import {
  ChapterSettings,
  Setting,
  SettingsGroup,
  getSetting,
} from "../../../components/ChapterSettings";
import ChapterSidebar from "../../../components/ChapterSidebar";
import ErrorScreen from "../../../components/ErrorScreen";
import LoadingScreen from "../../../components/LoadingScreen";
import { Chapter, Novel } from "../../../types/Novel";
import { BiFont } from "react-icons/bi";

export default function ChapterContent() {
  const router = useRouter();
  const { novel, chapter } = router.query;
  const currentChapter = Array.isArray(chapter) ? chapter[0] : chapter;

  const propertyGroups = [
    {
      name: "Font",
      Icon: BiFont,
      settings: [
        {
          name: "Font Family",
          type: "select",
          defaultValue: "Calibri",
          options: ["Arial", "Calibri", "Times New Roman"],
          state: useState("Calibri"),
        },
        {
          name: "Font Size",
          type: "number",
          defaultValue: 18,
          state: useState(18),
          min: 8,
          max: 72,
        },
        {
          name: "Font Color",
          type: "color",
          defaultValue: "#CED4DA",
          state: useState("#CED4DA"),
        },
      ],
    },
  ];

  const properties = {
    fontSize: {
      name: "Font Size",
      type: "number",
      defaultValue: 18,
      state: useState(18),
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
      defaultValue: "#25262B",
      state: useState("#25262B"),
    },
  };

  const fontSize = properties.fontSize.state[0];
  const lineHeight = properties.lineHeight.state[0];
  const paragraphSpacing = properties.paragraphSpacing.state[0];
  const textColor = properties.textColor.state[0];
  const backgroundColor = properties.backgroundColor.state[0];

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ["chapter", novel, currentChapter],
    queryFn: () =>
      fetch(
        `/api/boxNovelChapter?novelId=${novel}&chapterId=${currentChapter}`
      ).then((response) => response.json()),
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

  const novelData: Novel = JSON.parse(sessionStorage.getItem(novel.toString()));
  if (!novelData) location.href = "/novel/" + novel;

  if (chapterData.error != undefined)
    return <ErrorScreen title="API Error">{chapterData.error}</ErrorScreen>;

  return (
    <>
      <div
        className="fixed top-0 w-screen h-screen -z-20 brightness-[50%]"
        style={{
          backgroundImage:
            "url(https://papers.co/wallpaper/papers.co-vv24-map-curves-dark-pattern-background-bw-33-iphone6-wallpaper.jpg)",
          // backgroundImage: "url(https://source.unsplash.com/random/1920x1080)",
          backgroundAttachment: "repeat",
        }}
      />

      <div
        className="grid w-full h-full m-0 p-0 overflow-x-clip"
        style={{ gridTemplateColumns: "auto min-content min-content" }}
      >
        <div
          className="flex flex-col panel space-y-10 border-x-2 border-primary-400"
          style={{ backgroundColor }}
        >
          {true && <ChapterHeader novel={novelData} chapter={chapterData} />}

          <div>
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

          <ChapterControls
            className="self-center"
            novelId={novelData.id}
            chapters={novelData.chapters}
            current={chapterData}
          />
        </div>

        <ChapterSidebar
          novel={novelData}
          chapter={chapterData}
          settingsGroups={propertyGroups as SettingsGroup[]}
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
        />
      </div>
    </>
  );
}

interface ChapterHeaderProps {
  novel: Novel;
  chapter: Chapter;
}

const ChapterHeader = ({ novel, chapter }: ChapterHeaderProps) => {
  return (
    <div className="flex justify-between items-center text-xl">
      <div className="flex">
        <Image
          className="hidden sm:block h-[100px] w-[75px] shrink-0 rounded"
          alt={novel.title}
          src={novel.image}
          height={100}
          width={75}
          radius="md"
        />
        <div className="m-5">
          <a
            className="text-2xl sm:leading-[2.75rem] sm:text-4xl font-bold line-clamp-1 hover:text-accent-300 fade"
            href={"/novel/" + novel.id}
            title={novel.title}
          >
            {novel.title}
          </a>
          <ChapterControls
            novelId={novel.id}
            chapters={novel.chapters}
            current={chapter}
          />
        </div>
      </div>
    </div>
  );
};
