import { Image } from "@mantine/core";
import Link from "next/link";
import { Novel } from "../types/Novel";

interface Props {
  title: string;
  novels: Novel[];
}

const NovelList = ({ title, novels }: Props) => {
  return (
    <div className="grid grid-rows-4 grid-flow-col gap-4">
      {title}
      {novels.map((novel) => {
        return (
          <Link
            className="flex bg-primary-500 overflow-clip rounded"
            href={"/novel/" + novel.id}
          >
            <Image w={56} h={80} src={novel.image} />
            <div className="w-full p-2 flex flex-col justify-between">
              <span className="line-clamp-2">{novel.title}</span>
              <div className="flex justify-between">
                <span>Chaper 1</span> <span>23 minutes ago</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default NovelList;
