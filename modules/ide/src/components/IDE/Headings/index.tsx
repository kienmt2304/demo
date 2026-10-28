import { Box, Flex } from "@mantine/core";
import MenuBar from "./Menubar";
import IDELayout from "./IDELayout";

export default function Headings() {
  return (
    <Flex
      h={"32px"}
      align="center"
      justify={"space-between"}
      style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
      px={8}
      gap={8}
    >
      <MenuBar />
      <Box id="#ide-search"></Box>
      <IDELayout />
    </Flex>
  );
}
