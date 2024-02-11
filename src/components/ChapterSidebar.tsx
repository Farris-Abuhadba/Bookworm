import {
  ActionIcon,
  Button,
  ColorInput,
  Divider,
  Image,
  NumberInput,
  Progress,
  Select,
} from "@mantine/core";
import {
  BiBookAdd,
  BiBookmark,
  BiBookmarkAlt,
  BiBookmarkPlus,
  BiChat,
  BiFolderPlus,
  BiFont,
  BiFontColor,
  BiFontFamily,
  BiFontSize,
  BiImage,
  BiImageAlt,
  BiSidebar,
  BiSolidBookAdd,
  BiSolidBookAlt,
  BiSolidBookmark,
  BiSolidBookmarkMinus,
  BiSolidBookmarkStar,
  BiSolidFolderMinus,
  BiX,
} from "react-icons/bi";
import { Chapter, Novel } from "../types/Novel";
import ChapterControls from "./ChapterControls";
import ChapterSettings, { Setting, SettingsGroup } from "./ChapterSettings";
import { ReactNode, useEffect, useState } from "react";
import { addToLibrary, isInLibrary, removeFromLibrary } from "../pages/library";
import Link from "next/link";

interface Props {
  novel: Novel;
  chapter: Chapter;
  settingsGroups: SettingsGroup[];

  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

const ChapterSidebar = ({
  novel,
  chapter,
  settingsGroups,
  isOpen,
  setOpen,
}: Props) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [inLibrary, setInLibrary] = useState<boolean>(isInLibrary(novel.id));
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showFont, setShowFont] = useState<boolean>(false);

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
          "sticky overflow-x-hidden top-0 transition-all z-10 " + // positioning
          "flex flex-col w-80 max-w-80 h-screen p-4 " + // size
          "bg-primary-600 border-l-2 border-primary-400 " + // color
          (isOpen ? "mr-0" : "-mr-80")
        }
      >
        <div className="space-y-2">
          <ActionIcon
            onClick={() => {
              setOpen(false);
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
              className="text-lg font-bold line-clamp-3 hover:text-accent-300 fade"
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
          <SideButton
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
          </SideButton>

          <Divider my="lg" color="transparent" />

          <div
            className={
              "bg-primary-700 border-primary-400 rounded " +
              (showFont ? "border-x border-b" : "")
            }
          >
            <Button
              variant="default"
              justify="space-between"
              className="font-normal text-secondary-400"
              fullWidth
              rightSection={<BiFont size={24} />}
              onClick={() => {
                setShowFont(!showFont);
              }}
            >
              Font
            </Button>

            <div className={"p-2 space-y-1 " + (showFont ? "" : "hidden")}>
              <Select
                label="Font Family"
                data={["Arial", "Calibri", "Times New Roman", "Roboto"]}
              />
              <NumberInput label="Font Size" />
              <ColorInput label="Font Color" />
            </div>
          </div>

          <Button
            variant="default"
            justify="space-between"
            className="font-normal text-secondary-400"
            fullWidth
            rightSection={<BiImageAlt size={24} />}
          >
            Background
            {/* Color, Opacity, Image{Picture(Genre/Random/Off),Blur,Brightness} */}
          </Button>

          <ChapterSettings groups={settingsGroups} />
        </div>

        {!isOpen && (
          <ActionIcon
            className="top-2 right-2 fixed"
            onClick={() => {
              setOpen(true);
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
