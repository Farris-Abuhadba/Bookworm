import {
  ColorInput,
  ColorPicker,
  Image,
  Modal,
  NumberInput,
  Slider,
  Stack,
} from "@mantine/core";
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
import { PiX, PiXBold, PiXFill } from "react-icons/pi";

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
      <ChapterHeader
        novel={novelData}
        chapter={chapterData}
        setFontSize={setFontSize}
        setPadding={setPadding}
      />

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
  setFontSize;
  setPadding;
}

const ChapterHeader = ({
  novel,
  chapter,
  setFontSize,
  setPadding,
}: ChapterHeaderProps) => {
  const [opened, { open, close }] = useDisclosure(false);

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

      <Modal
        opened={opened}
        onClose={close}
        padding={0}
        radius={0}
        centered
        withCloseButton={false}
      >
        {/* <ChapterSettings setFontSize={setFontSize} setPadding={setPadding} /> */}
        <ChapterSettingsNew
          applySettings={() => {
            console.log("Applying Settings");
          }}
          closeModal={close}
        />
      </Modal>

      <div
        className="p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600"
        onClick={open}
      >
        <BiCog title="Settings" size={25} />
      </div>
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

const ChapterSettingsNew = ({ applySettings, closeModal }) => {
  return (
    <div className="panel sm:my-0 space-y-4">
      <div className="flex justify-between">
        <span className="font-bold">Chapter Settings</span>
        <div
          className="p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600"
          onClick={closeModal}
        >
          <PiXBold title="Close" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 justify-items-end items-center">
        <SettingInputNumber
          name="Font Size"
          value={10}
          defaultValue={2}
          min={8}
          max={72}
        />
        <SettingInputNumber name="Paragraph Spacing" value={0} />
        <SettingInputNumber name="Line Height" value={0} />

        <SettingInputColor name="Font Color" value="#FF0000" />
        <SettingInputColor name="Background Color" value="#FF0000" />
      </div>
    </div>
  );
};

const SettingInputNumber = ({
  name,
  value,
  defaultValue = value,
  min = 0,
  max = 100,
  getValue = null,
}) => {
  return (
    <>
      <span>{name}</span>
      <NumberInput
        value={value}
        min={min}
        max={max}
        placeholder={"Default: " + defaultValue}
      />
    </>
  );
};

const SettingInputColor = ({ name, value }) => {
  return (
    <>
      <span>{name}</span>
      <ColorInput value={value} />
    </>
  );
};

const ChapterSettings = ({ setFontSize, setPadding }) => {
  var savedFontSize = getSetting("fontSize", true, 2);
  var savedPadding = getSetting("padding", true, 4);

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
            setSetting("fontSize", value);
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
            setSetting("padding", value);
            setPadding(`my-${value}`);
          }}
        />
      </div>
    </Stack>
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
