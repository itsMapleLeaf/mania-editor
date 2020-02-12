import {
  hover,
  mb,
  px,
  py,
  rounded,
  themePrimaryBgColor,
  themePrimaryTextColor,
  themeShadow,
  transition,
} from "./style"

export const button = [
  themePrimaryBgColor(3),
  hover(themePrimaryBgColor(2)),
  themePrimaryTextColor,
  transition("background-color"),
  py(3),
  px(4),
  mb(4),
  rounded,
  themeShadow,
]
