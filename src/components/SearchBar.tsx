import { Button, TextInput } from "@mantine/core";

interface SearchBarProps {
  inputValue: string;
  setInputValue(newValue: string): void;
  handleSearch(): void;
}

const SearchBar = ({
  inputValue,
  setInputValue,
  handleSearch,
}: SearchBarProps) => {
  return (
    <div className="flex space-x-2">
      <TextInput
        onKeyDown={(event) => {
          if (event.key === "Enter") handleSearch();
        }}
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        placeholder="Search for novels"
        variant="unstyled"
        className="grow rounded ps-1 focus-within:border-accent-600 border border-transparent bg-primary-700"
      />

      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBar;
