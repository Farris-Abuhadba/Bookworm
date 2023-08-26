import { Image, NumberInput, Popover, Slider, Stack } from "@mantine/core";
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

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ["chapter", novel, currentChapter],
    queryFn: () =>
      fetch(`/api/chapter?novelId=${novel}&chapterId=${currentChapter}`).then(
        (response) => response.json()
      ),
    enabled: router.isReady,
  });

  if (!router.isReady || isLoading)
    return <LoadingScreen backUrl={"/novel/" + novel} />;

  localStorage.setItem(`lastReadChapter_${novel}`, currentChapter);

  const novelData = JSON.parse(localStorage.getItem(novel.toString()));
  if (!novelData) location.href = "/novel/" + novel;

  return (
    <div className="sm:w-4/5 mx-auto sm:my-5 space-y-1 sm:space-y-2">
      <ChapterHeader
        novel={novelData}
        chapter={chapterData}
        setFontSize={setFontSize}
        setPadding={setPadding}
      />

      <div className="bg-neutral-950 sm:rounded-md p-4 px-7">
        {chapterData.content.map((text, index) => {
          return (
            <p key={index} className={`${padding} ${fontSize}`}>
              {text}
            </p>
          );
        })}
      </div>

      <ChapterControls novel={novelData} chapter={chapterData} />
    </div>
  );
}

interface ChapterHeaderProps {
  novel: Novel;
  chapter: Chapter;
  setFontSize;
  setPadding;
}

const ChapterHeader = ({
  novel,
  chapter,
  setFontSize,
  setPadding,
}: ChapterHeaderProps) => {
  return (
    <div className="bg-neutral-950 sm:rounded-md sm:p-4 sm:px-7 flex justify-between items-center">
      <div className="flex">
        <Image
          className="hidden sm:block my-2 rounded-md border border-neutral-800"
          alt={novel.title}
          src={novel.cover}
          height={100}
          width={75}
          radius="md"
          withPlaceholder
        />
        <div className="m-5">
          <a
            className="text-2xl sm:text-4xl font-bold hover:text-sky-600 hover:underline"
            href={"/novel/" + novel.id}
          >
            {novel.title}
          </a>
          <p className="text-xl">{chapter.title}</p>
        </div>
      </div>

      <Popover>
        <Popover.Target>
          <div className="hidden sm:block hover:bg-neutral-800 p-1 rounded-md transition ease-in-out duration-300">
            <BiCog title="Settings" size={25} />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <ChapterSettings setFontSize={setFontSize} setPadding={setPadding} />
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

interface ChapterControlsProps {
  novel: Novel;
  chapter: Chapter;
}

const ChapterControls = ({ novel, chapter }: ChapterControlsProps) => {
  var currentChapterIndex;
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
    <div className="bg-neutral-950 sm:rounded-md p-4 px-7 flex justify-between items-center">
      <Link
        href={`/novel/${novel.id}/${prevChapter}`}
        className={
          "hover:bg-neutral-800 p-1 rounded-md transition ease-in-out duration-300 " +
          (currentChapterIndex - 1 < 0 && "invisible")
        }
      >
        <BiLeftArrowAlt title="Previous Chapter" size={24} />
      </Link>

      <Link
        href={`/novel/${novel.id}`}
        className="hover:bg-neutral-800 p-1 rounded-md transition ease-in-out duration-300"
      >
        <BiListUl title="Chapter List" size={24} />
      </Link>

      <Link
        href={`/novel/${novel.id}/${nextChapter}`}
        className={
          "hover:bg-neutral-800 p-1 rounded-md transition ease-in-out duration-300 " +
          (currentChapterIndex - 1 < 0 && "invisible")
        }
      >
        <BiRightArrowAlt title="Next Chapter" size={24} />
      </Link>
    </div>
  );
};

const ChapterSettings = ({ setFontSize, setPadding }) => {
  var savedFontSize = parseInt(localStorage.getItem("settings_fontSize"));
  if (Number.isNaN(savedFontSize)) savedFontSize = 2;

  var savedPadding = parseInt(localStorage.getItem("settings_padding"));
  if (Number.isNaN(savedPadding)) savedPadding = 4;

  return (
    <Stack className="items-end" spacing="xl">
      <div className="flex items-center">
        <span>Font Size</span>
        <Slider
          className="mx-2"
          w={300}
          max={fontSizes.length - 1}
          defaultValue={savedFontSize}
          label={null}
          marks={fontSizes}
          onChange={(value) => {
            localStorage.setItem("settings_fontSize", value.toString());
            setFontSize(fontSizes[value].tailwind);
          }}
        />
      </div>
      <div className="flex items-center mb-3">
        <span>Paragraph Spacing</span>
        <NumberInput
          className="mx-2"
          w={300}
          defaultValue={savedPadding}
          min={0}
          max={12}
          placeholder="Default: 4"
          onChange={(value) => {
            localStorage.setItem("settings_padding", value.toString());
            setPadding(`my-${value}`);
          }}
        />
      </div>
    </Stack>
  );
};

const getSetting = (key: string, ready: boolean, defaultValue) => {
  let storedValue;

  if (ready) storedValue = parseInt(localStorage.getItem("settings_" + key));

  if (storedValue == undefined || Number.isNaN(storedValue))
    storedValue = defaultValue;

  return storedValue;
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
