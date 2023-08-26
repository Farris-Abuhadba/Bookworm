import { Alert } from "@mantine/core";
import { ReactNode } from "react";
import { BiError } from "react-icons/bi";

interface Props {
  title: string;
  children: ReactNode;
}

const ErrorScreen = ({ title, children }: Props) => {
  return (
    <div className="flex h-screen">
      <Alert
        icon={<BiError size={32} />}
        className="w-fit h-fit m-auto"
        title={title}
        color="red"
        variant="outline"
      >
        {children}
      </Alert>
    </div>
  );
};

export default ErrorScreen;
