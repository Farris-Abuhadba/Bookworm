import { Image, Loader, Pill } from "@mantine/core";
import RelativeTime from "@yaireo/relative-time";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import ErrorScreen from "../components/ErrorScreen";
import SearchBar from "../components/SearchBar";
import { Novel } from "../types/Novel";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data, isError, isLoading } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${searchValue}`);
      const data = await response.json();
      return data;
    },
    enabled: !!searchValue,
  });

  const novels: Novel[] = data?.data || [];

  useEffect(() => {
    if (novels == undefined) return;

    var savedIds: { [id: string]: { [source: string]: string } } | null =
      JSON.parse(localStorage.getItem("novels"));
    if (savedIds == null) savedIds = {};

    novels.forEach((novel) => {
      if (savedIds[novel.id] == null) savedIds[novel.id] = {};
      Object.assign(savedIds[novel.id], novel.sourceIds);
    });

    localStorage.setItem("novels", JSON.stringify(savedIds));
  }, [novels]);

  if (isError) {
    return <ErrorScreen title="API Error">{data.error}</ErrorScreen>;
  }

  const handleSearch = () => {
    setSearchValue(inputValue);
  };

  const statusColors = {
    "On Going": "text-green-400 border-green-400",
    Completed: "text-blue-400 border-blue-400",
    Hiatus: "text-yellow-400 border-yellow-400",
    Dropped: "text-red-400 border-red-400",
  };

  return (
    <div className="panel p-2 sm:p-0 gap-2 flex flex-col">
      <p className="text-xl font-bold">Search</p>
      <SearchBar
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
      />
      {isLoading && <Loader className="self-center" />}
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
        {!isLoading &&
          novels.map((novel, index) => {
            let lastestChapter = novel.chapters[0];

            return (
              <Link
                key={index}
                href={`/novel/${novel.id}`}
                className="flex rounded p-2 bg-primary-500 hover:bg-primary-400 fade space-x-2 group"
              >
                <Image
                  className="h-[176px] w-[124px] shrink-0 rounded"
                  alt={novel.title}
                  src={novel.image}
                  height={176}
                  width={124}
                  radius="md"
                />
                <div className="flex flex-col justify-between space-y-1">
                  <div>
                    <p className="font-bold text-lg group-hover:underline line-clamp-2">
                      {novel.title}
                    </p>
                    <p className="line-clamp-1">
                      By <span className="text-accent-300">{novel.author}</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {novel.genres.map((genre) => {
                        return <Pill key={genre}>{genre}</Pill>;
                      })}
                      <Pill className={"border " + statusColors[novel.status]}>
                        {novel.status}
                      </Pill>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm w-fit pe-2 rounded flex items-center bg-primary-400 space-x-2 border border-primary-500">
                    <p className="p-[6px] rounded-s bg-primary-700 font-semibold">
                      {lastestChapter.title}
                    </p>
                    <p className="text-secondary-500">
                      {new RelativeTime().from(
                        new Date(lastestChapter.timestamp)
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Search;
