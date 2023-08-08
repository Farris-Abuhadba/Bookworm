import { Burger, Container, Group, Header, createStyles, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
    },

    links: {
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("xs")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
    },
}));

const links = [
    {
        link: "/",
        label: "Home",
    },
    {
        link: "/search",
        label: "Search",
    },
    {
        link: "/settings",
        label: "Settings",
    },
];

export function Navbar() {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const { classes, cx } = useStyles();

    const handleLinkClick = (link) => {
        setActive(link);
    };
    const items = links.map((link) => (
        <Link
            key={link.label}
            href={link.link}
            className={cx(classes.link, {
                [classes.linkActive]: active === link.link,
            })}
            onClick={() => handleLinkClick(link.link)}
        >
            {link.label}
        </Link>
    ));

    return (
        <Header height={60}>
            <Container className={classes.header}>
                <Link href="/" className="flex">
                    <BookwormSvg />
                    <h1>Bookworm</h1>
                </Link>

                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
            </Container>
        </Header>
    );
}

const BookwormSvg = () => {
    return (
        <svg
            className="mt-2 me-3"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="33"
            fill="none"
            viewBox="0 0 24 33"
        >
            <path fill="#312E38" d="M0 1h21a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H0V1Z" />
            <path fill="#47405C" d="M0 1h4v32H0z" />
            <circle cx="18.5" cy="10.5" r="1.5" fill="#FFD9E0" />
            <path fill="url(#a)" d="M17 1a.1.1 0 0 1 .1-.1h2.8a.1.1 0 0 1 .1.1v9.5h-3V1Z" />
            <path fill="#FFB0C1" d="M17 2h3v1h-3V2Z" />
            <path
                fill="#EF9EB0"
                d="M17 2v-.05h-.05V2H17Zm3 0h.05v-.05H20V2Zm0 1v.05h.05V3H20Zm-3 0h-.05v.05H17V3Zm0-.95h3v-.1h-3v.1ZM19.95 2v1h.1V2h-.1Zm.05.95h-3v.1h3v-.1ZM17.05 3V2h-.1v1h.1Z"
            />
            <path stroke="#FFB0C1" stroke-width=".1" d="M17 10h3" />
            <path stroke="#FA9EB2" stroke-width=".1" d="M17 8h3" />
            <path stroke="#F28CA2" stroke-width=".1" d="M17 6h3" />
            <path stroke="#E87D94" stroke-width=".1" d="M17 4h3" />
            <defs>
                <linearGradient
                    id="a"
                    x1="18.5"
                    x2="18.5"
                    y1=".9"
                    y2="10.5"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#F4B9CB" />
                    <stop offset="1" stop-color="#FFD9E0" />
                </linearGradient>
            </defs>
        </svg>
    );
};
