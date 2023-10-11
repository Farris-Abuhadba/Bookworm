import { ColorInput, Modal, NumberInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { BiCog } from "react-icons/bi";
import { PiXBold } from "react-icons/pi";

interface Setting {
  id: string;
  name: string;
  type: "number" | "color";
}

interface NumberSetting extends Setting {
  value: number;
  setValue(newValue: number): void;
}

interface ChapterSettingsProps {
  properties: {
    fontSize: [number, any];
    padding: [number, any];
    lineHeight: [number, any];

    textColor: [string, any];
    backgroundColor: [string, any];
  };

  closeModal?: any;
}

const ChapterSettings = ({ properties }: ChapterSettingsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        padding={0}
        radius={0}
        centered
        withCloseButton={false}
      >
        <SettingsModal closeModal={close} />
      </Modal>

      <div
        className="p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600"
        onClick={open}
      >
        <BiCog title="Settings" size={25} />
      </div>
    </>
  );
};

const SettingsModal = ({ closeModal, properties }: ChapterSettingsProps) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  function updateValue(current, setValue, newValue) {
    if (current != newValue) {
      setValue(newValue);
      if (!unsavedChanges) setUnsavedChanges(true);
    }
  }

  return (
    <div className="panel sm:my-0 space-y-4">
      <div className="flex justify-between">
        <span className="font-bold">Chapter Settings</span>
        <div
          className="p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600"
          onClick={closeModal}
        >
          <PiXBold title="Close" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 justify-items-end items-center">
        <SettingInputNumber
          name="Font Size"
          value={10}
          defaultValue={2}
          min={8}
          max={72}
          OnChange={(value) => {
            updateValue(fontSize, setFontSize, value);
          }}
        />
        <SettingInputNumber
          name="Paragraph Spacing"
          value={0}
          OnChange={(value) => {
            updateValue(padding, setPadding, value);
          }}
        />
        <SettingInputNumber
          name="Line Height"
          value={0}
          OnChange={(value) => {
            updateValue(lineHeight, setLineHeight, value);
          }}
        />

        <SettingInputColor
          name="Text Color"
          value="#D4D4D9"
          onChangeEnd={(color: string) => {
            updateValue(textColor, setTextColor, color);
          }}
        />
        <SettingInputColor
          name="Background Color"
          value="#FF0000"
          onChangeEnd={(color: string) => {
            updateValue(backgroundColor, setBackgroundColor, color);
          }}
        />
      </div>
    </div>
  );
};

export default ChapterSettings;

const SettingInputNumber = ({
  name,
  value,
  defaultValue = value,
  min = 0,
  max = 100,
  OnChange,
}) => {
  return (
    <>
      <span>{name}</span>
      <NumberInput
        defaultValue={value}
        min={min}
        max={max}
        placeholder={defaultValue}
        onChange={OnChange}
      />
    </>
  );
};

const SettingInputColor = ({
  name,
  value,
  defaultValue = value,
  onChangeEnd,
}) => {
  return (
    <>
      <span>{name}</span>
      <ColorInput
        placeholder={defaultValue}
        defaultValue={value}
        onChangeEnd={onChangeEnd}
      />
    </>
  );
};
