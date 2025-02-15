import { FC, ReactElement } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { join } from "path";
import glob from "fast-glob";

import { useRouter } from "next/router";
import { readFile } from "fs/promises";
import remarkFrontmatter from "remark-frontmatter";
import { remark } from "remark";
import { HorizontalLine, LastEditedInfo, PageHead } from "@/components/ui";
import { DocsLayout, RightSidebar, RightSidebarProps } from "@/components/docs";
import { docsConfig } from "../../../content.config";
import { remarkGetHeaders } from "@/lib/markdown/remark-get-headers.mjs";
import { SidebarItem } from "@/types/docs";
import { ArticleNavigationButton } from "@/components/docs";
import { getCommitMeta } from "@/lib/github";
import { Nullable } from "@/types/instill";
import { serializeMdxRemote } from "@/lib/markdown";
import { CommitMeta } from "@/lib/github/type";

type DocsPageProps = {
  mdxSource: MDXRemoteSerializeResult;
  nextArticle: Nullable<SidebarItem>;
  prevArticle: Nullable<SidebarItem>;
  headers: RightSidebarProps["headers"];
  commitMeta: Nullable<CommitMeta>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const docsDir = join(process.cwd(), "docs");
  const docsPaths = glob.sync("**/*.mdx", { cwd: docsDir });

  return {
    paths: docsPaths.map((path) => ({
      params: {
        path: path.replace(".mdx", "").split("/"),
      },
    })),

    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DocsPageProps> = async ({
  params,
}) => {
  if (!params || !params.path) {
    return {
      notFound: true,
    };
  }

  let fullPath: string;
  let relativePath: string;

  if (Array.isArray(params.path)) {
    fullPath = join(process.cwd(), "docs", ...params.path);
    relativePath = join(...params.path);
  } else {
    fullPath = join(process.cwd(), "docs", params.path);
    relativePath = join(params.path);
  }

  const source = fs.readFileSync(fullPath + ".mdx", "utf8");

  // Prepare the codeHike theme

  const theme = JSON.parse(
    await readFile(
      join(process.cwd(), "src", "styles", "rose-pine-moon.json"),
      {
        encoding: "utf-8",
      }
    )
  );

  // Serialize the mdx file for client

  const mdxSource = await serializeMdxRemote(source, true, theme);

  // Get prev and next link from sidebar config

  const sidebarLinks: SidebarItem[] = docsConfig.sidebar.leftSidebar.sections
    .map((e) => e.items)
    .flat();

  const currentPageIndex = sidebarLinks.findIndex(
    (e) => e.link === "/docs/" + relativePath
  );

  const nextArticle =
    currentPageIndex + 1 >= sidebarLinks.length
      ? null
      : sidebarLinks[currentPageIndex + 1];

  const prevArticle =
    currentPageIndex - 1 < 0 ? null : sidebarLinks[currentPageIndex - 1];

  // Access GitHub API to retrieve the info of Committer

  let commitMeta: Nullable<CommitMeta> = null;

  try {
    commitMeta = await getCommitMeta({
      org: "instill-ai",
      repo: "instill.tech",
      path: "docs/" + relativePath + ".mdx",
    });
  } catch (err) {
    console.log(err);
  }

  // We use remark to get the headers

  const headers = [] as RightSidebarProps["headers"];

  await remark()
    .use(remarkFrontmatter)
    .use(remarkGetHeaders, { headers })
    .process(source);

  return {
    props: {
      mdxSource,
      nextArticle,
      prevArticle,
      headers,
      commitMeta,
    },
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

const DocsPage: FC<DocsPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ mdxSource, nextArticle, prevArticle, commitMeta, headers }) => {
  const router = useRouter();

  return (
    <>
      <PageHead
        pageTitle={
          mdxSource.frontmatter
            ? `${mdxSource.frontmatter.title} | Documentation`
            : "Documentation"
        }
        pageDescription={
          mdxSource.frontmatter ? mdxSource.frontmatter.description : ""
        }
        pageType="docs"
        additionMeta={
          <>
            <meta name="docsearch:language" content="en" />
            <meta name="docsearch:version" content="3.0.0" />
          </>
        }
        currentArticleMeta={null}
        commitMeta={null}
      />
      <div className="grid grid-cols-8">
        <div className="col-span-8 px-6 xl:col-span-6 xl:px-8 max:px-16">
          <h1 className="mb-10 font-sans text-5xl font-semibold text-black dark:text-instillGrey15">
            {mdxSource.frontmatter
              ? mdxSource.frontmatter.title
              : "Documentation"}
          </h1>
          <article
            id="content"
            className="DocSearch-content prose mb-20 max-w-none dark:prose-white dark:bg-instillGrey90"
          >
            <MDXRemote {...mdxSource} />
          </article>
          {commitMeta ? (
            <LastEditedInfo marginBottom="mb-8" meta={commitMeta} />
          ) : null}
          <HorizontalLine
            marginBottom="mb-8"
            bgColor="bg-instillGrey20 dark:bg-instillGrey30"
          />
          <div className="grid grid-flow-row grid-cols-2 gap-x-5">
            {prevArticle ? (
              <ArticleNavigationButton
                type="prev"
                link={prevArticle.link}
                text={prevArticle.text}
              />
            ) : (
              <div />
            )}
            {nextArticle ? (
              <ArticleNavigationButton
                type="next"
                link={nextArticle.link}
                text={nextArticle.text}
              />
            ) : (
              <div />
            )}
          </div>
        </div>

        <aside className="hidden xl:col-span-2 xl:block">
          <RightSidebar
            githubEditUrl={
              "https://github.com/instill-ai/instill.tech/edit/main" +
              router.asPath +
              ".mdx"
            }
            headers={headers}
          />
        </aside>
      </div>
    </>
  );
};

DocsPage.getLayout = (page) => {
  return <DocsLayout>{page}</DocsLayout>;
};

export default DocsPage;
