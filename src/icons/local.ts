import eflowcodeLogo from "@/assets/icons/eflowcode.png";
import ddsLogo from "@/assets/icons/dds.png";
import lionccLogo from "@/assets/icons/lioncc.png";
import pipellmLogo from "@/assets/icons/pipellm.png";
import shengsuanyunLogo from "@/assets/icons/shengsuanyun.svg";

const localIcons: Record<string, string> = {
  dds: ddsLogo,
  eflowcode: eflowcodeLogo,
  lioncc: lionccLogo,
  pipellm: pipellmLogo,
  shengsuanyun: shengsuanyunLogo,
};

export const localIconList = Object.keys(localIcons);

export function hasLocalIcon(name: string): boolean {
  return name.toLowerCase() in localIcons;
}

export function getLocalIconUrl(name: string): string {
  return localIcons[name.toLowerCase()] || "";
}
