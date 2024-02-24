import { Image, Pagination } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";
import SearchBar from "../components/SearchBar";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [showImages, setShowImages] = useState(false);

  const fetchSearchedNovels = async (keyword, pageNumber) => {
    const response = await fetch(
      `/api/search?keyword=${keyword}&pageNumber=${pageNumber}`
    );
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading } = useQuery(
    ["search", searchValue, activePage],
    () => fetchSearchedNovels(searchValue, activePage),
    {
      enabled: !!searchValue,
    }
  );

  const novels = data?.novels || [];
  const totalPages = data?.nextPageNumber || 1;

  const handleSearch = () => {
    if (searchValue.length < 3) return;
    setActivePage(1);
    setShowImages(true);
  };

  const handlePageChange = (newPage) => {
    setActivePage(newPage);
  };

  return (
    <>
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />
      <div className="panel space-y-5">
        <div>
          {novels.map((novel, index) => {
            const novelName = novel.link.split("/").pop();
            return (
              <div key={index}>
                <Link
                  href={`/novel/${novelName}`}
                  className="flex items-center"
                >
                  {showImages && (
                    <>
                      <Image
                        className="m-2 w-fit rounded-md border border-neutral-800"
                        width={200}
                        height={89}
                        src={novel.img}
                        radius="md"
                      />
                      <span className="text-xl">{novel.title}</span>
                    </>
                  )}
                  {!showImages && (
                    <span
                      className={
                        "p-2 rounded-md grow " +
                        (index % 2 == 0 ? "bg-neutral-900" : "")
                      }
                    >
                      {novel.title}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
        {showImages && (
          <Pagination
            value={activePage}
            onChange={handlePageChange}
            total={totalPages}
          />
        )}
      </div>
    </>
  );
};

export default Search;
