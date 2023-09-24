import { Button, Divider, Image, Menu, Progress, Title } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiTrashAlt } from "react-icons/bi";
import { GetNovelData } from "./novel/[novel]";

const LibraryPage = () => {
  const [novelLibrary, setNovelLibrary] = useState([]);

  useEffect(() => {
    let novels = JSON.parse(localStorage.getItem("novelLibrary")) || [];
    setNovelLibrary(novels);
  }, []);

  return (
    <div className="sm:container sm:my-5 mx-auto p-4 sm:rounded-md bg-neutral-800 space-y-2">
      <Title className="bg-neutral-950 -m-4 p-4 sm:rounded-t-md mb-2">
        Library
      </Title>
      {novelLibrary.map((novelId, index) => {
        return <NovelRow novelId={novelId} index={index} />;
      })}
    </div>
  );
};

export default LibraryPage;

const NovelRow = ({ novelId, index }) => {
  const { data: novel, isLoading } = GetNovelData(novelId);

  if (isLoading || !novel) return <NovelRowSkeletonLoader index={index} />;

  return (
    <>
      {index != 0 && <Divider size="sm" />}
      <div className="flex items-center justify-between overflow-clip">
        <Link
          href={"/novel/" + novel.id}
          className="flex items-center space-x-2 group rounded-md p-2 hover:bg-neutral-700 fade"
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
            progress={Math.round(Math.random() * novel.chapters.length)}
            maxProgress={novel.chapters.length}
          />
          <Button className="bg-sky-600">Read</Button>
          <Menu position="left">
            <Menu.Target>
              <BiDotsVerticalRounded
                className="rounded-md hover:bg-neutral-700 fade"
                size={18}
              />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                icon={<BiTrashAlt size={18} />}
                onClick={() => {
                  let lib =
                    JSON.parse(localStorage.getItem("novelLibrary")) || [];
                  lib.pop(lib.indexOf(novelId));
                  localStorage.setItem("novelLibrary", JSON.stringify(lib));
                }}
              >
                Remove from Library
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {/* TODO: Removes incorrect novel */}
          {/* <BiTrashAlt
          className="hover:text-red-500 fade"
          title="Remove from Library"
          size={18}
          onClick={() => {
            let lib = JSON.parse(localStorage.getItem("novelLibrary")) || [];
            lib.pop(lib.indexOf(novelId));
            localStorage.setItem("novelLibrary", JSON.stringify(lib));
          }}
        /> */}
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

// TODO: Finish skeleton loader
const NovelRowSkeletonLoader = (index) => {
  return (
    <div className="border border-neutral-700 rounded-md p-4 w-full">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-neutral-700 h-[80px] w-[64px]"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-neutral-700 rounded my-auto"></div>
        </div>
      </div>
    </div>
  );
};
