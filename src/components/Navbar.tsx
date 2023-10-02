import { Divider, Image } from "@mantine/core";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import {
  BiGridAlt,
  BiHomeAlt2,
  BiSearchAlt2,
  BiSolidGridAlt,
} from "react-icons/bi";
import { PiBooks, PiPushPin, PiPushPinFill } from "react-icons/pi";
import { Novel } from "../types/Novel";

interface Props {
  children: ReactNode;
}

export default function Navbar({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pinned, setPinned] = useState<boolean>(false);

  return (
    <>
      <div className="flex bg-neutral-950">
        <OpenMenuButton
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          className={
            "z-50 m-2 absolute top-0" + (menuOpen || pinned ? " sm:fixed" : "")
          }
        />
        <TopMenu className="ms-12" menuOpen={menuOpen} />
      </div>

      <div className="flex">
        <SideMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          pinned={pinned}
          setPinned={setPinned}
        />
        <div
          className={
            "w-full " +
            (menuOpen ? "sm:h-auto h-0 overflow-clip " : "") +
            (pinned ? "sm:ms-12 " : "")
          }
        >
          {children}
        </div>
      </div>
    </>
  );
}

const TopMenu = ({ menuOpen, className }) => {
  return (
    <div className={"p-2 h-12 flex items-center text-lg " + className}>
      <Logo className={"-my-10 z-40" + (menuOpen ? " fixed" : "")} />
    </div>
  );
};

const SideMenu = ({ menuOpen, setMenuOpen, pinned, setPinned }) => {
  const buttons = [
    { text: "Home", icon: BiHomeAlt2, link: "/" },
    { text: "Search", icon: BiSearchAlt2, link: "/search" },
    { text: "Library", icon: PiBooks, link: "/library" },
  ];

  const [recentNovels, setRecentNovels] = useState<Novel[]>([]);

  useEffect(() => {
    let novels = [];
    for (let i = 0; i < 3; i++) {
      let key = sessionStorage.key(i);
      if (key == undefined) break;

      novels.push(JSON.parse(sessionStorage.getItem(key)));
    }

    let settings = JSON.parse(localStorage.getItem("settings")) || {};
    if (settings.pinMenu != undefined && settings.pinMenu != pinned) {
      setPinned(settings.pinMenu);
    }

    console.log(novels);
    setRecentNovels(novels);
  }, [setRecentNovels]);

  return (
    <div
      className={
        "sm:visible fixed top-0 z-30 bg-neutral-950 p-2 h-screen w-full sm:w-fit sm:max-w-[300px] flex flex-col justify-between" +
        (!menuOpen ? " collapse" : " overflow-y-auto min-w-[200px]") +
        (!pinned && !menuOpen ? " sm:collapse" : "")
      }
    >
      <div className="space-y-2 pt-10">
        {buttons.map((btn) => {
          return (
            <MenuButton
              key={btn.text}
              text={btn.text}
              Icon={btn.icon}
              link={btn.link}
              showText={menuOpen}
              setMenuOpen={setMenuOpen}
            />
          );
        })}
        {menuOpen && recentNovels.length > 0 && (
          <>
            <Divider />

            {recentNovels.map((novel) => {
              return (
                <NovelButton
                  key={novel.id}
                  id={novel.id}
                  title={novel.title}
                  image={novel.cover}
                  setMenuOpen={setMenuOpen}
                />
              );
            })}
          </>
        )}
      </div>

      <div
        onClick={() => {
          let settings = JSON.parse(localStorage.getItem("settings")) || {};
          settings.pinMenu = !pinned;
          localStorage.setItem("settings", JSON.stringify(settings));

          setPinned(!pinned);
        }}
        title={(pinned ? "Unpin" : "Pin") + " Sidebar"}
        className={
          "items-center w-fit hover:bg-neutral-800 text-neutral-600 p-1 rounded-md fade hidden sm:flex" +
          (menuOpen || pinned ? "" : " collapse")
        }
      >
        {(pinned && <PiPushPinFill size={24} />) || <PiPushPin size={24} />}
      </div>
    </div>
  );
};

const OpenMenuButton = ({ menuOpen, setMenuOpen, className = "" }) => {
  return (
    <div
      className={
        "p-1 hover:bg-neutral-800 rounded-md w-fit h-fit fade " + className
      }
    >
      {(menuOpen && (
        <BiSolidGridAlt size={24} onClick={() => setMenuOpen(false)} />
      )) || <BiGridAlt size={24} onClick={() => setMenuOpen(true)} />}
    </div>
  );
};

const MenuButton = ({ text, Icon, link, showText, setMenuOpen }) => {
  return (
    <Link
      href={link}
      onClick={() => {
        setMenuOpen(false);
      }}
      title={text}
      className="flex items-center hover:bg-neutral-800 p-1 rounded-md fade"
    >
      <Icon size={24} />
      {showText && (
        <span className="mx-1 -my-1 font-semibold text-lg align-middle">
          {text}
        </span>
      )}
    </Link>
  );
};

const NovelButton = ({ image, title, id, setMenuOpen }) => {
  if (id == undefined) return;

  return (
    <Link
      href={"/novel/" + id}
      onClick={() => {
        setMenuOpen(false);
      }}
      title={title}
      className="flex items-center hover:bg-neutral-800 p-1 rounded-md fade space-x-2"
    >
      <Image
        className="border border-neutral-800 rounded-md"
        radius={6}
        width={34}
        height={49}
        src={image}
      />
      <span className="line-clamp-2 h-full shrink max-w-[70%] sm:max-w-[150px]">
        {title}
      </span>
    </Link>
  );
};

export const Logo = ({ className = "" }) => {
  return (
    <Link href="/" className={"flex items-center text-lg " + className}>
      <BookwormSvg />
      Bookworm
    </Link>
  );
};

const BookwormSvg = () => {
  return (
    <svg
      className="me-2 my-1"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="33"
      fill="none"
      viewBox="0 0 24 33"
    >
      <path fill="#312E38" d="M0 1h21a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H0V1Z" />
      <path fill="#47405C" d="M0 1h4v32H0z" />
      <circle cx="18.5" cy="10.5" r="1.5" fill="#FFD9E0" />
      <path
        fill="url(#a)"
        d="M17 1a.1.1 0 0 1 .1-.1h2.8a.1.1 0 0 1 .1.1v9.5h-3V1Z"
      />
      <path fill="#FFB0C1" d="M17 2h3v1h-3V2Z" />
      <path
        fill="#EF9EB0"
        d="M17 2v-.05h-.05V2H17Zm3 0h.05v-.05H20V2Zm0 1v.05h.05V3H20Zm-3 0h-.05v.05H17V3Zm0-.95h3v-.1h-3v.1ZM19.95 2v1h.1V2h-.1Zm.05.95h-3v.1h3v-.1ZM17.05 3V2h-.1v1h.1Z"
      />
      <path stroke="#FFB0C1" strokeWidth=".1" d="M17 10h3" />
      <path stroke="#FA9EB2" strokeWidth=".1" d="M17 8h3" />
      <path stroke="#F28CA2" strokeWidth=".1" d="M17 6h3" />
      <path stroke="#E87D94" strokeWidth=".1" d="M17 4h3" />
      <defs>
        <linearGradient
          id="a"
          x1="18.5"
          x2="18.5"
          y1=".9"
          y2="10.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4B9CB" />
          <stop offset="1" stopColor="#FFD9E0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
