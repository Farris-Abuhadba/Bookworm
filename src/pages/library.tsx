import { Button, Divider, Image, Menu, Progress, Title } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiTrashAlt } from "react-icons/bi";
import { Chapter } from "../types/Novel";
import { GetNovelData } from "./novel/[novel]";

const LibraryPage = () => {
  const [novelLibrary, setNovelLibrary] = useState([]);

  useEffect(() => {
    let novels = getLibrary();
    setNovelLibrary(novels);
  }, []);

  return (
    <div className="sm:container sm:my-5 mx-auto p-4 sm:rounded-md bg-neutral-800 space-y-2">
      <Title className="bg-neutral-950 -m-4 p-4 sm:rounded-t-md mb-2">
        Library
      </Title>
      {novelLibrary.map((novelId, index) => {
        return <NovelRow key={novelId} novelId={novelId} index={index} />;
      })}

      {novelLibrary.length == 0 &&
        "Your library is empty, add novels to see your progress and get notified when new chapters are released"}
    </div>
  );
};

export default LibraryPage;

const NovelRow = ({ novelId, index }) => {
  const [removed, removeRow] = useState(false);
  const { data: novel, isLoading } = GetNovelData(novelId);

  if (removed)
    return (
      <RemovedNovelRow novel={novel} index={index} removeRow={removeRow} />
    );
  if (isLoading || !novel) return <NovelRowSkeletonLoader index={index} />;

  let lastRead;
  try {
    lastRead = JSON.parse(localStorage.getItem("lastReadChapters"))[novelId];
  } catch {
    lastRead = "";
  }

  let progress = 0;
  novel.chapters.forEach((chapter: Chapter, index: number) => {
    if (chapter.id == lastRead) {
      progress = index + 1;
    }
  });

  return (
    <>
      {index != 0 && <Divider size="sm" />}
      <div className="flex items-center justify-between overflow-clip">
        <Link
          href={"/novel/" + novel.id}
          className="flex items-center space-x-2 group rounded p-2 hover:bg-neutral-700 fade grow"
        >
          <span>{index + 1}</span>
          <div className="w-[64px] h-[80px]">
            <Image
              className="rounded-md group-hover:border-neutral-500 border border-transparent fade"
              radius={6}
              width={64}
              height={80}
              src={novel.cover}
            />
          </div>
          <span className="line-clamp-3" title={novel.title}>
            {novel.title}
          </span>
        </Link>
        <div className="flex space-x-2 items-center">
          <NovelRowProgressBar
            progress={progress}
            maxProgress={novel.chapters.length}
          />
          <Button className="bg-sky-600">Read</Button>
          <Menu>
            <Menu.Target>
              <div className="rounded hover:bg-neutral-700 fade p-2">
                <BiDotsVerticalRounded size={18} />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                icon={<BiTrashAlt size={18} />}
                onClick={() => {
                  removeFromLibrary(novelId);
                  removeRow(true);
                }}
              >
                Remove from Library
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </>
  );
};

const NovelRowProgressBar = ({ progress, maxProgress }) => {
  return (
    <div className="mx-5 hidden md:block text-sm relative">
      <Progress
        title={progress + "/" + maxProgress}
        radius="xl"
        value={(progress / maxProgress) * 100}
        w={250}
        striped={progress >= maxProgress}
      />
      <span>{progress}</span>
      <span className="right-0 absolute">{maxProgress}</span>
    </div>
  );
};

const RemovedNovelRow = ({ novel, index, removeRow }) => {
  return (
    <>
      {index != 0 && <Divider size="sm" />}
      <div className="flex bg-red-500/5 p-2 rounded-md justify-between items-center">
        <div className="flex space-x-2 text-red-500 items-center">
          <span>{index + 1}</span>
          <span className="line-through line-clamp-3">{novel.title}</span>
        </div>
        <Button
          className="border border-red-500 text-red-500 hover:bg-red-500/10 mx-5"
          onClick={() => {
            addToLibrary(novel.id, index);
            removeRow(false);
          }}
        >
          Undo
        </Button>
      </div>
    </>
  );
};

const NovelRowSkeletonLoader = ({ index }) => {
  return (
    <>
      {index != 0 && <Divider size="sm" />}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-2 p-2 grow">
          <span>{index + 1}</span>
          <div className="animate-pulse rounded-md bg-neutral-700 h-[80px] w-[64px]" />
          <div className="animate-pulse flex-1">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-4 bg-neutral-700 rounded col-span-2"></div>
                <div className="h-4 bg-neutral-700 rounded col-span-1"></div>
              </div>
              <div className="h-4 bg-neutral-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="mx-5 hidden md:block relative space-y-1">
            <div className="w-[250px] h-2 bg-neutral-700 rounded-full" />
            <div className="w-6 h-3 rounded bg-neutral-700" />
            <div className="w-10 h-3 rounded bg-neutral-700 right-0 bottom-0 absolute" />
          </div>
          <Button className="bg-neutral-700 text-transparent rounded-md hover:bg-neutral-700 pointer-events-none">
            Read
          </Button>
          <div className="w-[34px] h-[34px] bg-neutral-700 rounded-md" />
        </div>
      </div>
    </>
  );
};

export const addToLibrary = (novelId: string, index?: number) => {
  let lib: [string] = getLibrary();

  if (lib.includes(novelId)) return;

  if (!index) lib.push(novelId);
  else lib.splice(index, 0, novelId);

  localStorage.setItem("novelLibrary", JSON.stringify(lib));
};

export const removeFromLibrary = (novelId: string) => {
  let lib: [string] = getLibrary();

  let index = lib.indexOf(novelId);
  if (index < 0) return;

  lib.splice(index, 1);

  localStorage.setItem("novelLibrary", JSON.stringify(lib));
};

export const isInLibrary = (novelId) => {
  return getLibrary().includes(novelId);
};

const getLibrary = () => {
  return JSON.parse(localStorage.getItem("novelLibrary")) || [];
};
