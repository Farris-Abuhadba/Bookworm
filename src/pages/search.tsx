import { Button, Image, Pagination, TextInput } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";

const Search = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [novels, setNovels] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showImages, setShowImages] = useState(false);

  const fetchSearchedNovels = async (keyword, pageNumber) => {
    try {
      const response = await fetch(
        `/api/search?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      const data = await response.json();
      setNovels(data.novels);
      setTotalPages(data.nextPageNumber);
    } catch (error) {
      console.error("Error fetching novel data:", error);
    }
  };

  const handleSearch = () => {
    setActivePage(1);
    setShowImages(true);
    fetchSearchedNovels(searchValue, 1);
  };

  const handlePageChange = (newPage) => {
    setActivePage(newPage);
    fetchSearchedNovels(searchValue, newPage);
  };

  useEffect(() => {
    if (!searchValue) {
      setNovels([]);
    } else {
      fetchSearchedNovels(searchValue, activePage);
    }
  }, [searchValue, activePage]);

  return (
    <div className="max-w-2/5 w-3/5 m-5 mx-auto p-4 rounded-md bg-neutral-950 space-y-5">
      <div className="flex space-x-4 items-center">
        <BiSearchAlt2 className="text-neutral-500" size={24} />

        <TextInput
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
          placeholder="Search for novels"
          className="grow"
        />

        <Button
          className="bg-[#1971c2] hover:bg-[#1864ab]"
          onClick={handleSearch}
          disabled={!searchValue}
        >
          Search
        </Button>
      </div>
      <div>
        {novels.map((novel, index) => {
          const novelName = novel.link.split("/").pop();
          return (
            <div key={index}>
              <Link href={`/novel/${novelName}`} className="flex items-center">
                {showImages && (
                  <>
                    <Image
                      className="m-2 w-fit rounded-md border border-neutral-800"
                      width={200}
                      height={89}
                      src={novel.img}
                      radius="md"
                      withPlaceholder
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
  );
};

export default Search;
