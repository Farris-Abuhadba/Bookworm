import { Button, Pagination, TextInput } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NovelList() {
  const [searchValue, setSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [novels, setNovels] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSearchedNovels = async (keyword, pageNumber) => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `/api/search?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      const data = await response.json();
      setNovels(data.novelLinks);
      setTotalPages(data.nextPageNumber);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching novel data:", error);
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    setActivePage(1);
    fetchSearchedNovels(searchValue, 1);
  };

  const handlePageChange = (newPage) => {
    setActivePage(newPage);
    fetchSearchedNovels(searchValue, newPage);
  };

  useEffect(() => {
    fetchSearchedNovels(searchValue, activePage);
  }, [searchValue, activePage]);

  return (
    <div>
      <TextInput
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
      />
      <Button onClick={handleSearch} disabled={isSearching || !searchValue}>
        Search
      </Button>
      {isSearching ? (
        <div>Loading....</div>
      ) : novels.length === 0 ? (
        <div>No results found.</div>
      ) : (
        <div>
          {novels.map((novel, index) => {
            const novelName = novel.split("/").pop();
            return (
              <div key={index}>
                <Link href={`/novel/${novelName}`}>{novelName}</Link>
              </div>
            );
          })}
        </div>
      )}
      <Pagination
        value={activePage}
        onChange={handlePageChange}
        total={totalPages}
      />
    </div>
  );
}
