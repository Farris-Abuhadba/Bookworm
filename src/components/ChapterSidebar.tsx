import { ActionIcon } from "@mantine/core";
import { BiSidebar, BiX } from "react-icons/bi";
import { Chapter, Novel } from "../types/Novel";
import ChapterControls from "./ChapterControls";

interface Props {
  novel: Novel;
  chapter: Chapter;

  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

const ChapterSidebar = ({ novel, chapter, isOpen, setOpen }: Props) => {
  return (
    <div>
      <div
        className={
          "sticky overflow-x-hidden top-0 transition-all z-10 " + // positioning
          "flex flex-col w-80 max-w-80 h-screen p-2 " + // size
          "bg-primary-600 border-l-2 border-primary-400 " + // color
          (isOpen ? "mr-0" : "-mr-80")
        }
      >
        <ActionIcon
          onClick={() => {
            setOpen(false);
          }}
          variant="default"
          size="lg"
        >
          <BiX size={24} />
        </ActionIcon>
        {novel.title}
        <ChapterControls
          novelId={novel.id}
          chapters={novel.chapters}
          current={chapter}
        />
        {!isOpen && (
          <ActionIcon
            className="top-2 right-2 fixed"
            onClick={() => {
              setOpen(true);
            }}
            variant="default"
            size="lg"
          >
            <BiSidebar size={24} />
          </ActionIcon>
        )}
      </div>
    </div>
  );
};

export default ChapterSidebar;
