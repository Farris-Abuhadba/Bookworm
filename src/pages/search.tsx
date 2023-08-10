import React, { useState, useEffect } from "react";
import { Pagination, TextInput } from "@mantine/core";
import { useRouter } from "next/router";

const Search = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [novels, setNovels] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    const showImagesFromQuery = router.query.showImages === "true";
    setShowImages(showImagesFromQuery);
  }, [router.query.showImages]);

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
    router.push({ pathname: router.pathname, query: { showImages: "true" } });
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

  const navigateToNovelPage = (name) => {
    const novelPageLink = `/novel/${name.replace(/\s/g, "-")}`;
    router.push(novelPageLink);
  };

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
      {novels.map((novel, index) => (
        <div key={index} onClick={() => navigateToNovelPage(novel.title)}>
          {showImages && (
            <div>
              <img src={novel.img} alt={novel.title} />
              <div>{novel.title}</div>
            </div>
          )}
          {!showImages && <div>{novel.title}</div>}
        </div>
      ))}
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
