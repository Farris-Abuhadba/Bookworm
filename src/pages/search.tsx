import React, { useState, useEffect } from "react";
import { Pagination, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import Link from "next/link";

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
    <div>
      <TextInput
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        placeholder="Search for novels"
      />
      <button onClick={handleSearch} disabled={!searchValue}>
        Search
      </button>
      <div>
        {novels.map((novel, index) => {
          const novelName = novel.link.split("/").pop();
          return (
            <div key={index}>
              <Link href={`/novel/${novelName}`}>
                {showImages && (
                  <div>
                    <img src={novel.img} alt={novel.title} />
                    <div>{novel.title}</div>
                  </div>
                )}
                {!showImages && <div>{novel.title}</div>}
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
