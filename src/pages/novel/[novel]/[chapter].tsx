import { ColorInput, Image, NumberInput, Select, Slider } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiArea, BiFont, BiImageAlt } from "react-icons/bi";
import { useQuery } from "react-query";
import ChapterControls from "../../../components/ChapterControls";
import { SettingsGroup, getSetting } from "../../../components/ChapterSettings";
import ChapterSidebar from "../../../components/ChapterSidebar";
import ErrorScreen from "../../../components/ErrorScreen";
import LoadingScreen from "../../../components/LoadingScreen";
import { Novel } from "../../../types/Novel";


export default function ChapterContent() {
  const router = useRouter();
  const { novel, chapter } = router.query;
  const currentChapter = Array.isArray(chapter) ? chapter[0] : chapter;

  const settings: SettingsGroup[] = [
    {
      name: "Font",
      Icon: BiFont,
      settings: [
        {
          name: "Font Family",
          InputType: Select,
          properties: {
            defaultValue: "Nunito Sans",
            data: [
              "Arial",
              "Calibri",
              "Nunito Sans",
              "Poppins",
              "Times New Roman",
            ],
          },
          state: useState("Nunito Sans"),
        },
        {
          name: "Font Size",
          InputType: NumberInput,
          properties: {
            defaultValue: 18,
            min: 8,
            max: 72,
          },
          state: useState(18),
        },
        {
          name: "Font Color",
          InputType: ColorInput,
          properties: { defaultValue: "#CED4DA" },
          state: useState("#CED4DA"),
        },
      ],
    },
    {
      name: "Background",
      Icon: BiImageAlt,
      settings: [
        {
          name: "Background Color",
          InputType: ColorInput,
          properties: { defaultValue: "#25262B" },
          state: useState("#25262B"),
        },
        {
          name: "Background Opacity",
          InputType: Slider,
          properties: {
            defaultValue: 100,
            step: 5,
          },
          state: useState(100),
        },
        {
          name: "Background Blur",
          InputType: Slider,
          properties: {
            defaultValue: 5,
            max: 10,
          },
          state: useState(5),
        },
        {
          name: "Background Image",
          InputType: Select,
          properties: {
            defaultValue: "Match Genre",
            data: [
              { group: "", items: ["Off", "Random", "Match Genre"] },
              {
                group: "Custom Selection",
                items: [
                  "Action",
                  "Adventure",
                  "Cultivation",
                  "Demons",
                  "Fantasy",
                  "Horror",
                  "Martial Arts",
                  "Sci-fi",
                ],
              },
            ],
            allowDeselect: false,
          },
          state: useState("Match Genre"),
        },
        {
          name: "Image Brightness",
          InputType: Slider,
          properties: {
            defaultValue: 50,
            step: 5,
          },
          state: useState(50),
        },
        {
          name: "Image Blur",
          InputType: Slider,
          properties: {
            defaultValue: 0,
            max: 10,
          },
          state: useState(0),
        },
      ],
    },
    {
      name: "Spacing",
      Icon: BiArea,
      settings: [
        {
          name: "Line Height",
          InputType: NumberInput,
          properties: {
            defaultValue: 1.5,
            min: 1,
            max: 5,
            decimalScale: 1,
            fixedDecimalScale: true,
            step: 0.5,
          },
          state: useState(1.5),
        },
        {
          name: "Paragraph Spacing",
          InputType: NumberInput,
          properties: {
            defaultValue: 32,
            min: 0,
            max: 100,
          },
          state: useState(32),
        },
      ],
    },
  ];

  const fontFamily: string = settings[0].settings[0].state[0];
  const fontSize: number = settings[0].settings[1].state[0];
  const textColor: string = settings[0].settings[2].state[0];
  let bgOpacity = Math.floor(
    (settings[1].settings[1].state[0] / 100) * 255
  ).toString(16);
  if (bgOpacity.length < 2) bgOpacity = "0" + bgOpacity;
  const backgroundColor = settings[1].settings[0].state[0] + bgOpacity;
  const borderColor = "#373A40" + bgOpacity;
  const bgBlur = settings[1].settings[2].state[0];
  const bgImage = settings[1].settings[3].state[0];
  const bgImageBrightness = settings[1].settings[4].state[0];
  const bgImageBlur = settings[1].settings[5].state[0];
  const lineHeight = settings[2].settings[0].state[0];
  const paragraphSpacing = settings[2].settings[1].state[0];

  const [activeBgImage, setActiveBgImage] = useState<string>("Off");

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { data: chapterData, isLoading } = useQuery({
    queryKey: ["chapter", novel, currentChapter],
    queryFn: () =>
      fetch(
        `/api/boxNovelChapter?novelId=${novel}&chapterId=${currentChapter}`
      ).then((response) => response.json()),
    enabled: router.isReady,
  });
  const { data: novelData, isLoading: isNovelLoading } = GetNovelData(
    novel as string
  );

  useEffect(() => {
    settings.forEach((group) => {
      group.settings.forEach((setting) => {
        let saved = getSetting(setting.name.toLowerCase().replaceAll(" ", "_"));

        if (saved != undefined) {
          setting.state[1](saved);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (bgImage == null || bgImage == "Off") return;

    var bgImageChoices = settings[1].settings[3].properties.data[1]["items"];
    let newImage = "";

    if (bgImage == "Random") {
      newImage =
        bgImageChoices[Math.floor(Math.random() * bgImageChoices.length)];
    } else if (bgImage == "Match Genre") {
      if (novelData == null) return;
      var intersection = [...novelData.genres].filter((x) =>
        bgImageChoices.includes(x)
      );

      newImage = intersection[Math.floor(Math.random() * intersection.length)];
    } else {
      newImage = bgImage;
    }

    setActiveBgImage(newImage.replaceAll(" ", "_"));
  }, [bgImage, isNovelLoading]);

  if (!router.isReady || isLoading || isNovelLoading) return <LoadingScreen />;

  var lastReadChapters = JSON.parse(localStorage.getItem("lastReadChapters"));
  if (lastReadChapters == undefined) lastReadChapters = {};
  lastReadChapters[novel.toString()] = currentChapter;
  localStorage.setItem("lastReadChapters", JSON.stringify(lastReadChapters));

  if (chapterData.error != undefined)
    return <ErrorScreen title="API Error">{chapterData.error}</ErrorScreen>;

  return (
    <>
      {bgImage != "Off" && (
        <div
          className="fixed top-0 w-screen h-screen -z-20 hidden sm:block"
          style={{
            backgroundImage: `url(/images/backgrounds/${activeBgImage}.png)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            filter: `brightness(${bgImageBrightness}%) blur(${bgImageBlur}px)`,
          }}
        />
      )}

      <div
        className="grid w-full h-full m-0 p-0 overflow-x-clip"
        style={{ gridTemplateColumns: "auto min-content min-content" }}
      >
        <div
          className="flex flex-col panel space-y-10 sm:border-x-2 border-primary-400 px-4 py-2 sm:px-14 sm:py-8"
          style={{
            backgroundColor,
            borderColor,
            backdropFilter: `blur(${bgBlur}px)`,
          }}
        >
          <div className="flex justify-between items-center text-xl">
            <div className="flex min-w-[50%]">
              <Image
                className="hidden sm:block h-[100px] w-[75px] shrink-0 rounded"
                alt={novelData.title}
                src={novelData.image}
                height={100}
                width={75}
                radius="md"
              />
              <div className="sm:mx-5 flex flex-col space-y-2 justify-center w-full">
                <Link
                  className="text-2xl sm:text-3xl font-bold line-clamp-2 sm:line-clamp-1 hover:underline"
                  href={"/novel/" + novelData.id}
                  title={novelData.title}
                  style={{ color: textColor }}
                >
                  {novelData.title}
                </Link>
                <ChapterControls
                  novelId={novelData.id}
                  chapters={novelData.chapters}
                  current={chapterData}
                />
              </div>
            </div>
          </div>

          <div>
            {chapterData.content.map((text, index) => {
              return (
                <p
                  key={index}
                  style={{
                    margin:
                      index == 0 ? "0px" : paragraphSpacing + "px 0px 0px 0px",
                    fontFamily,
                    fontSize: fontSize + "px",
                    lineHeight,
                    color: textColor,
                  }}
                >
                  {text}
                </p>
              );
            })}
          </div>

          <ChapterControls
            className="self-center w-full md:w-3/4 lg:w-1/2"
            novelId={novelData.id}
            chapters={novelData.chapters}
            current={chapterData}
          />
        </div>

        <ChapterSidebar
          novel={novelData}
          chapter={chapterData}
          settings={settings}
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
        />
      </div>
    </>
  );
}
