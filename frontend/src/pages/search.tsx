import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { TextInput, Button, Pagination } from "@mantine/core";

export default function NovelList() {
  const [value, setValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const {
    data: searchedNovels,
    isLoading,
    refetch,
  } = useQuery(
    ["search-novels", value, activePage],
    async () => {
      setIsSearching(true);
      const response = await axios.get(
        `http://localhost:8000/search?keyword=${value}&page=${activePage}`
      );
      setIsSearching(false);
      setTotalPages(response.data[1]);
      return response.data[0];
    },
    { enabled: false }
  );

  useEffect(() => {
    refetch();
  }, [value, activePage]);

  return (
    <div>
      <TextInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Button onClick={() => refetch()} disabled={isLoading || isSearching}>
        Search
      </Button>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <div>
          {searchedNovels &&
            searchedNovels.map((novel, index) => {
              novel = novel.split("/").pop();
              return (
                <div key={index}>
                  <Link href={`/novel/${novel}`}>{novel}</Link>
                </div>
              );
            })}
        </div>
      )}
      <Pagination
        value={activePage}
        onChange={setActivePage}
        total={totalPages}
      />
    </div>
  );
}
