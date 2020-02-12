import {
  hover,
  px,
  py,
  rounded,
  themePrimaryBgColor,
  themeShadow,
  transition,
} from "./style"

export const button = [
  themePrimaryBgColor(3),
  hover(themePrimaryBgColor(2)),
  transition("background-color"),
  py(3),
  px(4),
  rounded,
  themeShadow,
]
