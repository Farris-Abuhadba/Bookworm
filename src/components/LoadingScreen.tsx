import { Loader } from "@mantine/core";
import { TiArrowBack } from "react-icons/ti";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen -mt-24 items-center justify-center">
      <Loader size="xl" className="stroke-lavender-600" />
    </div>
  );
};

export default LoadingScreen;
