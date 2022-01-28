import { FC, ReactElement, HTMLAttributes } from "react";
import * as classNames from "classnames";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant: "text" | "contained" | "outlined" | "icon" | "link";
  styleName?: string;
  color:
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "white"
    | "lightWhite"
    | "transparant";
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  itemDirection?: "horizontal" | "vertical";
}

export const ButtonBase: FC<Props> = ({
  children,
  variant,
  styleName,
  color,
  startIcon,
  endIcon,
  onClick,
  itemDirection,
  ...props
}) => {
  let buttonStyle: string;
  let buttonColor: string;

  switch (variant) {
    case "contained": {
      buttonStyle = "px-[17px] py-2.5 hover:bg-opacity-90";
      break;
    }
    case "outlined": {
      buttonStyle = "px-[17px] py-2.5 flex border border-instillBlue30";
      break;
    }
    case "text": {
      buttonStyle = "hover:text-instillBlue70";
      break;
    }
    case "icon": {
      buttonStyle = "";
    }
  }

  switch (color) {
    case "primary": {
      buttonColor = "bg-instillBlue30 text-instillGray05 hover:bg-[#1393F2]";
      break;
    }
    case "white": {
      buttonColor = "text-instillBlue30";
      break;
    }
    case "lightWhite": {
      buttonColor = "text-instillBlue30";
      break;
    }
    case "secondary": {
    }
    case "transparant": {
      buttonColor = "text-instillBlue30";
    }
  }

  return (
    <button
      className={classNames.default(
        "flex rounded-[3px] justify-center",
        buttonStyle,
        buttonColor,
        styleName,
        itemDirection === "horizontal" ? "flex-row" : "flex-col"
      )}
      onClick={onClick}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};
