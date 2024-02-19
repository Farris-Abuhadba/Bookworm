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
import { Chapter, Novel } from "../types/Novel";
import ChapterControls from "./ChapterControls";
import ChapterSettings, { SettingsGroup, setSetting } from "./ChapterSettings";

interface Props {
  novel: Novel;
  chapter: Chapter;
  settings: SettingsGroup[];

  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

const ChapterSidebar = ({
  novel,
  chapter,
  settings,
  isOpen,
  setOpen,
}: Props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [inLibrary, setInLibrary] = useState<boolean>(isInLibrary(novel.id));
  // const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      var h = document.documentElement,
        b = document.body,
        st = "scrollTop",
        sh = "scrollHeight";
      setScrollProgress((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
            <Image w={70} h={101} radius="sm" src={novel.image} />
            <Link
              href={`/novel/${novel.id}`}
              title={novel.title}
              className="text-lg font-bold line-clamp-3 hover:underline"
            >
              {novel.title}
            </Link>
          </div>

          <SideButton
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

          <ChapterControls
            novelId={novel.id}
            chapters={novel.chapters}
            current={chapter}
          />
          <Progress
            value={scrollProgress * 100}
            transitionDuration={100}
            striped
            animated={scrollProgress >= 1}
          />
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
  onClick?: (event: any) => void;
}

const SideButton = ({ Icon, children, onClick }: SideButtonProps) => {
  return (
    <Button
      variant="default"
      justify="space-between"
      className="font-normal text-secondary-400"
      fullWidth
      leftSection={<Icon size={24} />}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ChapterSidebar;
