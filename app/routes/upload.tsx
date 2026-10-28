import { Container } from "@mantine/core";
import { FileUpload } from "~/components/Upload";

export default function FileUploadPage() {
  return (
    <Container size="lg" py="md">
      <FileUpload />
    </Container>
  );
}
