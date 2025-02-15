import Link from "next/link";
import cn from "clsx";
import { PinIcon, ToolboxIcon } from "@instill-ai/design-system";

export type CareerPositionListItemProps = {
  /** Position full name */
  name: string;

  /** Position detail page's link */
  link: string;

  /** Position location */
  location: string;

  /** Position work type */
  workType: string;

  /** <Tailwind config> - position */
  styleName?: string;
};

export const CareerPositionListItem = ({
  name,
  location,
  workType,
  styleName,
  link,
}: CareerPositionListItemProps) => {
  return (
    <Link href={link} scroll={true}>
      <a
        className={cn(
          "flex flex-col bg-white hover:shadow-instill-solid-5 xl:grid xl:grid-cols-2 xl:px-10 xl:py-5 xl:hover:shadow-instill-solid-10",
          styleName
        )}
      >
        <div className="flex flex-col p-4 xl:p-0">
          <h3 className="text-instillGrey95 text-instill-h3-medium">{name}</h3>
        </div>
        <div className="grid w-full grid-cols-2 gap-x-4 p-4 xl:gap-x-0 xl:p-0">
          <div className="m-auto flex flex-row gap-x-2.5">
            <PinIcon
              width="w-6"
              height="h-6"
              color="fill-instillGrey70"
              position="my-auto"
            />
            <p className="instill-text-body text-instillGrey70">{location}</p>
          </div>
          <div className="m-auto flex flex-row gap-x-2.5">
            <ToolboxIcon
              width="w-5"
              height="h-5"
              color="fill-instillGrey70"
              position="my-auto"
            />
            <p className="instill-text-body text-instillGrey70">{workType}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};
