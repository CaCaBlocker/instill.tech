import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { AnnouncementBar } from "@/components/ui";
import { useAnnouncementBarCtx } from "@/contexts/AnnouncementBarContext";
import { CrossIcon, Logo } from "@instill-ai/design-system";
import GetEarlyAccessButton from "../GetEarlyAccessButton";
import cn from "clsx";
import Image from "next/future/image";

import NewsletterArchiveLink from "./NewsletterArchiveLink";
import BlogLink from "./BlogLink";
import GithubTextLink from "./GithubTextLink";
import AboutPageLink from "./AboutPageLink";
import CareerPageLink from "./CareerPageLink";
import Link from "next/link";
import DocsPageLink from "./DocsPageLink";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { enableAnnouncementBar } = useAnnouncementBarCtx();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setOpen(false);
  }, [router]);

  const navbarLinkGroup = (
    <>
      <AboutPageLink />
      <DocsPageLink />
      <BlogLink />
      <CareerPageLink hiring={true} />
      <NewsletterArchiveLink />
      <GithubTextLink />
      <GetEarlyAccessButton />
    </>
  );

  return (
    <div
      id="navbar-test"
      className="flex w-full flex-col bg-instillGrey95 lg:sticky lg:top-0 lg:z-50"
    >
      {enableAnnouncementBar && (
        <AnnouncementBar>
          <p className="text-instillGrey95">
            Got five minutes? Participate our Data + Vision AI survey
            2022.&nbsp;
            <a
              className="mr-1.5 underline"
              target="_blank"
              rel="noreferrer noopener"
              href="https://dkuwzh3w0h3.typeform.com/to/wQcfIXal?utm_source=product_website&utm_medium=banner&utm_campaign=survey2022"
            >
              Learn more
            </a>
          </p>
        </AnnouncementBar>
      )}
      <div className="mx-auto flex w-full max-w-[1440px]">
        <div className="hidden w-full content-center p-2 lg:flex lg:flex-row">
          <Link href="/">
            <a className="flex my-auto mr-auto">
              <Logo type="ColourLogomarkWhiteType" width={159} />
            </a>
          </Link>

          <div className="flex flex-row justify-end gap-x-[60px] lg:ml-auto">
            {navbarLinkGroup}
          </div>
        </div>
        <div
          className={cn(
            "flex h-full w-full flex-col lg:hidden",
            open ? "fixed top-0 left-0 z-50 bg-instillGrey95" : ""
          )}
        >
          <div className="flex w-full flex-row p-4 lg:mb-[60px]">
            <Link href="/">
              <a className="flex">
                <Logo type="ColourLogomarkWhiteType" width={159} />
              </a>
            </Link>
            <button
              className="flex ml-auto w-[30px] h-[30px] rounded-[3px] hover:bg-instillGrey30 hover:bg-opacity-10"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <CrossIcon
                  width="w-6"
                  height="h-6"
                  color="fill-instillGrey05"
                  position="m-auto"
                />
              ) : (
                <Image
                  src="/images/menu.svg"
                  alt="Navbar menu icon"
                  width={30}
                  height={30}
                  sizes="30px"
                />
              )}
            </button>
          </div>
          <div className="relative w-full">
            {open && (
              <div className="absolute top-0 left-0 flex w-full flex-col gap-y-[50px] bg-instillGrey95 py-[50px] px-4">
                {navbarLinkGroup}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
