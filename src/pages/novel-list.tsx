import { Title } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import NovelCard from "../components/NovelCard";
import { Novel } from "../types/Novel";

export default function NovelList() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNovels();
  }, []);

  const getNovels = async () => {
    try {
      const response = await fetch("/api/hot-novels", {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();
      setNovels(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching novel data:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="sm:max-w-2/5 sm:w-3/5 sm:my-5 mx-auto p-4 rounded-md bg-neutral-800">
      <Title className="mb-4 -m-4 p-4 rounded-t-md bg-neutral-950" size="38px">
        Featured
      </Title>
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5">
        {novels.map((novel, index) => {
          const novelSlug = novel.id;
          return (
            <Link key={index} href={`/novel/${novelSlug}`}>
              <NovelCard title={novel.title} image={novel.cover} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
