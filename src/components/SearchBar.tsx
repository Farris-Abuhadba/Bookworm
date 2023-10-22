import { TextInput } from "@mantine/core";
import { BiSearchAlt2 } from "react-icons/bi";

interface SearchBarProps {
  searchValue: string;
  setSearchValue(newValue: string): void;
  handleSearch(): void;
}

const SearchBar = ({
  searchValue,
  setSearchValue,
  handleSearch,
}: SearchBarProps) => {
  return (
    <div className="bg-zinc-800 border border-zinc-600 sm:rounded-md flex items-center">
      <TextInput
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleSearch();
        }}
        placeholder="Search for novels"
        variant="unstyled"
        className="grow ps-1"
      />

      <div
        title="Search"
        className={
          "w-[36px] h-[36px] flex justify-center items-center sm:rounded-e-md border-s border-zinc-600 fade" +
          (searchValue.length > 2
            ? " text-zinc-400 hover:text-lavender-600 transparent-button-hover cursor-pointer"
            : " text-zinc-600")
        }
        onClick={handleSearch}
      >
        <BiSearchAlt2 size={24} />
      </div>
    </div>
  );
};

export default SearchBar;
