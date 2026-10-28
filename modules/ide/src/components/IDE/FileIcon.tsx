import type { SupportedFiles } from "#service/IDE/type";
import {
  IconBraces,
  IconBrandReact,
  IconBrandTypescript,
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFileTypeCss,
  IconFileTypeHtml,
  IconFileTypeJs,
  IconFileTypeTxt,
  IconMarkdown,
  type IconProps,
} from "@tabler/icons-react";
import { getItemFileType } from "#service/IDE";

type FileIconProps = {
  file: string;
};

const IconsMapping: Record<
  SupportedFiles,
  React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
> = {
  tsx: IconBrandReact,
  ts: IconBrandTypescript,
  txt: IconFileTypeTxt,
  css: IconFileTypeCss,
  js: IconFileTypeJs,
  html: IconFileTypeHtml,
  json: IconBraces,
  md: IconMarkdown,
};

export default function FileIcon({ file }: FileIconProps) {
  const fileType = getItemFileType(file);
  const Icon = fileType ? (IconsMapping[fileType] ?? IconFile) : IconFile;

  return <Icon size={16} />;
}
