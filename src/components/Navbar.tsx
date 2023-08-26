import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  BiCookie,
  BiGridAlt,
  BiHomeAlt2,
  BiSearchAlt2,
  BiSolidGridAlt,
} from "react-icons/bi";

interface Props {
  children: ReactNode;
}

export default function Navbar({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <TopMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="flex">
        <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div
          className={"w-full " + (menuOpen && "sm:h-auto h-0 overflow-clip")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const TopMenu = ({ menuOpen, setMenuOpen }) => {
  return (
    <div className="p-2 bg-neutral-950 z-50">
      <div className="flex items-center text-lg">
        <OpenMenuButton
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          className="sm:invisible"
        />
        <Logo className="-my-10 mx-3" />
        {/* <TextInput
          className="collapse sm:visible ms-auto me-2"
          size="xs"
          placeholder="Search"
        />
        <BiUser
          size={24}
          className="rounded-full align-right me-2 z-50 sm:z-auto"
        /> */}
      </div>
    </div>
  );
};

const SideMenu = ({ menuOpen, setMenuOpen }) => {
  const buttons = [
    { text: "Home", icon: <BiHomeAlt2 size={24} />, link: "/" },
    { text: "Search", icon: <BiSearchAlt2 size={24} />, link: "/search" },
    // { text: "Settings", icon: <BiCog size={24} />, link: "/settings" },
  ];

  return (
    <div
      className={
        (!menuOpen && "collapse") +
        " sm:visible fixed top-0 bg-neutral-950 z-40 p-2 space-y-3 h-screen w-full sm:w-fit"
      }
    >
      <div className="flex items-center">
        <OpenMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        {menuOpen && <Logo className="-my-10 mx-3" />}
      </div>

      {buttons.map((btn) => {
        return (
          <MenuButton
            key={btn.text}
            text={btn.text}
            icon={btn.icon}
            link={btn.link}
            showText={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        );
      })}

      <div
        className="flex items-center hover:bg-neutral-800 p-1 rounded-md transition ease-in-out duration-300 text-red-400"
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          setMenuOpen(false);
        }}
        title="Clear Storage"
      >
        <BiCookie size={24} />
        {menuOpen && (
          <span className="mx-1 -my-1 font-semibold text-lg align-middle">
            Clear Storage
          </span>
        )}
      </div>
    </div>
  );
};

const OpenMenuButton = ({ menuOpen, setMenuOpen, className = "" }) => {
  return (
    <div
      className={
        "p-1 hover:bg-neutral-800 rounded-md w-fit h-fit transition ease-in-out duration-300 " +
        className
      }
    >
      {(menuOpen && (
        <BiSolidGridAlt size={24} onClick={() => setMenuOpen(false)} />
      )) || <BiGridAlt size={24} onClick={() => setMenuOpen(true)} />}
    </div>
  );
};

const MenuButton = ({ text, icon, link, showText, setMenuOpen }) => {
  return (
    <Link
      href={link}
      onClick={() => {
        setMenuOpen(false);
      }}
      title={text}
      className="flex items-center hover:bg-neutral-800 p-1 rounded-md transition ease-in-out duration-300"
    >
      {icon}
      {showText && (
        <span className="mx-1 -my-1 font-semibold text-lg align-middle">
          {text}
        </span>
      )}
    </Link>
  );
};

const Logo = ({ className = "" }) => {
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
