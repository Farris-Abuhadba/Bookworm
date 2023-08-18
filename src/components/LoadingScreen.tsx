import { Loader } from "@mantine/core";
import { TiArrowBack } from "react-icons/ti";

interface Props {
  backUrl?: string;
}

const LoadingScreen = ({ backUrl }: Props) => {
  return (
    <div className="flex h-screen">
      {backUrl != null && (
        <TiArrowBack
          className="absolute m-2 cursor-pointer hover:text-sky-600"
          size={32}
          onClick={() => {
            location.href = backUrl;
          }}
        />
      )}
      <Loader className="m-auto" size="xl" />
    </div>
  );
};

export default LoadingScreen;
