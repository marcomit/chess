export const navbarItem = [
  {
    title: "Home",
    href: "/home",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Friends",
    href: "/friends",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Games",
    href: "/games",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Settings",
    href: "/settings",
    description:
      "For sighted users to preview content available behind a link.",
  }
];

export type NavbarItem = typeof navbarItem[number]