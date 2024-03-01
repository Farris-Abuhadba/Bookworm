import { ActionIcon, Button, Divider, Image, Progress } from "@mantine/core";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import {
  BiFolderPlus,
  BiSidebar,
  BiSolidFolderMinus,
  BiX,
} from "react-icons/bi";
import { addToLibrary, isInLibrary, removeFromLibrary } from "../pages/library";
import { ChapterControlsSkeletonLoader } from "../pages/novel/[novel]/[chapter]";
import { Chapter, Novel } from "../types/Novel";
import ChapterControls from "./ChapterControls";
import ChapterSettings, { SettingsGroup, setSetting } from "./ChapterSettings";

interface Props {
  novel: Novel;
  chapter: Chapter;
  chapterProgress: number;
  settings: SettingsGroup[];

  isNovelLoading: boolean;
  isChapterLoading: boolean;

  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

const ChapterSidebar = ({
  novel,
  chapter,
  chapterProgress,
  settings,
  isNovelLoading,
  isChapterLoading,
  isOpen,
  setOpen,
}: Props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [inLibrary, setInLibrary] = useState<boolean>(false);
  // const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    if (isNovelLoading || isChapterLoading) return;
    setInLibrary(isInLibrary(novel.id));
  });

  useEffect(() => {
    if (isNovelLoading) return;
    setScrollProgress(chapterProgress);
    const lines = document.querySelectorAll<HTMLElement>("#content p");

    const handleScroll = () => {
      let i = lines.length - 1;
      for (; i >= 0; i--) {
        if (
          lines[i].getBoundingClientRect().top + lines[i].offsetHeight <=
          window.visualViewport.height
        )
          break;
      }

      if (i > -1) {
        let lastReadChapters = JSON.parse(
          localStorage.getItem("lastReadChapters")
        );
        lastReadChapters[novel.id]["progress"] = i;
        localStorage.setItem(
          "lastReadChapters",
          JSON.stringify(lastReadChapters)
        );

        setScrollProgress(++i);
      }
    };

    if (lines[chapterProgress] != null) {
      lines[chapterProgress].scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }

    window.addEventListener("scrollend", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scrollend", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [chapter, chapterProgress, isNovelLoading]);

  return (
    <div>
      <div
        className={
          "fixed md:sticky overflow-x-hidden top-0 right-0 transition-all z-50 " + // positioning
          "flex flex-col w-80 max-w-80 h-screen p-4 " + // size
          "bg-primary-600 border-l-2 border-primary-400 " + // color
          (isOpen ? "mr-0" : "-mr-80")
        }
      >
        <div className="space-y-2">
          <ActionIcon
            onClick={() => {
              setOpen(false);
              setSetting("sidebar_open", false);
            }}
            variant="default"
            size="lg"
            title="Close Sidebar"
          >
            <BiX size={24} />
          </ActionIcon>

          <div className="flex items-center space-x-2">
            {(isNovelLoading && <NovelHeaderSkeletonLoader />) || (
              <>
                <Image
                  w={70}
                  h={101}
                  radius="sm"
                  src={novel.image}
                  alt={novel.title}
                />
                <Link
                  href={`/novel/${novel.id}`}
                  title={novel.title}
                  className="text-lg font-bold line-clamp-3 hover:underline"
                >
                  {novel.title}
                </Link>
              </>
            )}
          </div>

          <SideButton
            disabled={isNovelLoading}
            Icon={inLibrary ? BiSolidFolderMinus : BiFolderPlus}
            onClick={() => {
              if (inLibrary) removeFromLibrary(novel.id);
              else addToLibrary(novel.id);

              setInLibrary(isInLibrary(novel.id));
            }}
          >
            {inLibrary ? "Remove from Library" : "Add to Library"}
          </SideButton>

          <Divider my="lg" color="transparent" />

          {((isChapterLoading || isNovelLoading) && (
            <>
              <ChapterControlsSkeletonLoader />
              <Progress value={0} />
            </>
          )) || (
            <>
              <ChapterControls
                novelId={novel.id}
                chapters={novel.chapters}
                current={chapter}
              />
              <Progress
                value={(scrollProgress / chapter.content.length) * 100}
                transitionDuration={500}
                striped
                animated={scrollProgress >= chapter.content.length}
              />
            </>
          )}
          {/* <SideButton
            Icon={isBookmarked ? BiSolidBookmarkMinus : BiBookmarkPlus}
            onClick={() => {
              alert("Not yet implemented");
            }}
          >
            {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          </SideButton>
          <SideButton
            Icon={BiChat}
            onClick={() => {
              alert("Not yet implemented");
            }}
          >
            Comments
          </SideButton> */}

          <Divider my="lg" color="transparent" />

          <ChapterSettings groups={settings} />
        </div>

        {!isOpen && (
          <ActionIcon
            className="top-2 right-2 fixed"
            onClick={() => {
              setOpen(true);
              setSetting("sidebar_open", true);
            }}
            variant="default"
            size="lg"
            title="Open Sidebar"
          >
            <BiSidebar size={24} />
          </ActionIcon>
        )}
      </div>
    </div>
  );
};

interface SideButtonProps {
  Icon: any;
  children: ReactNode;
  rightIcon?: boolean;
  disabled?: boolean;
  onClick?: (event: any) => void;
}

const SideButton = ({
  Icon,
  children,
  onClick,
  disabled = false,
}: SideButtonProps) => {
  return (
    <Button
      variant="default"
      justify="space-between"
      className="font-normal text-secondary-400"
      fullWidth
      disabled={disabled}
      leftSection={<Icon size={24} />}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ChapterSidebar;

const NovelHeaderSkeletonLoader = () => {
  return (
    <>
      <div className="w-[70px] h-[101px] shrink-0 rounded bg-secondary-400/25 animate-pulse" />
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full h-6 rounded bg-secondary-400/25 animate-pulse" />
        <div className="w-3/4 h-6 rounded bg-secondary-400/25 animate-pulse" />
      </div>
    </>
  );
};
