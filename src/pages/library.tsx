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
    <div className="panel space-y-2">
      <Title
        className="mb-4 -m-4 p-4 sm:rounded-t-md bg-lavender-900 text-lavender-50 outline outline-1 outline-lavender-600"
        size="38px"
      >
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

  let lastRead = "";
  try {
    lastRead = JSON.parse(localStorage.getItem("lastReadChapters"))[novelId];
  } catch {}

  let progress = 0;
  novel.chapters.forEach((chapter: Chapter, index: number) => {
    if (chapter.id == lastRead) {
      progress = index + 1;
    }
  });

  return (
    <>
      {index != 0 && <Divider size="sm" className="border-zinc-700" />}
      <div className="flex items-center justify-between overflow-clip">
        <Link
          href={"/novel/" + novel.id}
          className="flex items-center space-x-2 group rounded-md p-2 transparent-button-hover hover:bg-zinc-500/25 grow"
        >
          <span>{index + 1}</span>
          <div className="w-[64px] h-[80px]">
            <Image
              className="rounded-md fade border border-zinc-700 group-hover:border-lavender-600"
              radius={6}
              width={64}
              height={80}
              src={novel.image}
              alt=""
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
          <Button
            className="fade-custom transition-colors bg-lavender-600 hover:bg-lavender-700"
            onClick={() => {
              location.href = "/novel/" + novelId + "/" + lastRead;
            }}
          >
            Read
          </Button>
          <Menu>
            <Menu.Target>
              <div className="p-2 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600">
                <BiDotsVerticalRounded size={18} />
              </div>
            </Menu.Target>
            <Menu.Dropdown className="bg-zinc-800 border-zinc-600">
              <Menu.Item
                color="red"
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
        color="#7770bb"
        className="bg-zinc-700"
      />
      <span>{progress}</span>
      <span className="right-0 absolute">{maxProgress}</span>
    </div>
  );
};

const RemovedNovelRow = ({ novel, index, removeRow }) => {
  return (
    <>
      {index != 0 && <Divider size="sm" className="border-zinc-700" />}
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
          <div className="animate-pulse rounded-md bg-zinc-700 h-[80px] w-[64px]" />
          <div className="animate-pulse flex-1">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-4 bg-zinc-700 rounded col-span-2"></div>
                <div className="h-4 bg-zinc-700 rounded col-span-1"></div>
              </div>
              <div className="h-4 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="mx-5 hidden md:block relative space-y-1">
            <div className="w-[250px] h-2 bg-zinc-700 rounded-full" />
            <div className="w-6 h-3 rounded bg-zinc-700" />
            <div className="w-10 h-3 rounded bg-zinc-700 right-0 bottom-0 absolute" />
          </div>
          <Button className="bg-zinc-700 text-transparent rounded-md hover:bg-zinc-700 pointer-events-none">
            Read
          </Button>
          <div className="w-[34px] h-[34px] bg-zinc-700 rounded-md" />
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
