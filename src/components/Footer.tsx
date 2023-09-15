import { Footer } from "@mantine/core";
import Link from "next/link";
import {
  BiEnvelope,
  BiLogoDiscordAlt,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoReddit,
  BiLogoTiktok,
  BiLogoTwitter,
} from "react-icons/bi";
import { IconType } from "react-icons/lib";
import { Logo } from "./Navbar";

// TODO: Phone support

const OurFooter = () => {
  const message = "Welcome to Degenerate Heaven";

  const socials = [
    { name: "Twitter", icon: BiLogoTwitter, link: "https://www.twitter.com" },
    {
      name: "Facebook",
      icon: BiLogoFacebook,
      link: "https://www.facebook.com",
    },
    { name: "Reddit", icon: BiLogoReddit, link: "https://www.reddit.com" },
    {
      name: "Instagram",
      icon: BiLogoInstagram,
      link: "https://www.instagram.com",
    },
    {
      name: "Tiktok",
      icon: BiLogoTiktok,
      link: "https://www.tiktok.com",
    },
    {
      name: "Discord",
      icon: BiLogoDiscordAlt,
      link: "https://www.discord.com",
    },
    {
      name: "Email",
      icon: BiEnvelope,
      link: "mailto:contact@bookworm.com",
    },
  ];

  return (
    <Footer height={1}>
      <div className="ms-[56px] me-2 my-2 flex relative items-center">
        <Logo className="absolute left-2" />
        <span className="text-center w-full">{message}</span>
        <div className="flex space-x-1 absolute right-2">
          {socials.map((social, index) => {
            return (
              <SocialLink
                key={index}
                Name={social.name}
                Icon={social.icon}
                Url={social.link}
              />
            );
          })}
        </div>
      </div>
    </Footer>
  );
};

export default OurFooter;

interface SocialLinkProps {
  Name: string;
  Icon: IconType;
  Url: string;
}

const SocialLink = ({ Name, Icon, Url }: SocialLinkProps) => {
  return (
    <Link
      title={Name}
      href={Url}
      className="rounded-full p-1 border border-neutral-700 hover:border-neutral-400 hover:bg-neutral-700 fade"
    >
      <Icon size={24} />
    </Link>
  );
};
