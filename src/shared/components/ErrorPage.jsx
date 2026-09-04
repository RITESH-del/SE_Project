import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Container className="min-h-screen flex items-center justify-center py-20">
      <SimpleGrid
        spacing={{ base: 40, sm: 80 }}
        cols={{ base: 1, sm: 2 }}
        className="items-center w-full"
      >
        {/* Mobile Image */}
        <Image
          src="https://ui.mantine.dev/_next/static/media/image.71460e26.svg"
          alt="Page not found"
          className="block md:hidden"
        />

        <div>
          <Title className="mb-4 text-[32px] sm:text-[34px] font-medium font-[Outfit]">
            Something is not right...
          </Title>

          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error, contact support.
          </Text>

          <Button
            variant="outline"
            size="md"
            mt="xl"
            className="w-full sm:w-auto"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>

        {/* Desktop Image */}
        {/* <Image
          src="https://ui.mantine.dev/_next/static/media/image.71460e26.svg"
          alt="Page not found"
          className="hidden md:block"
        /> */}
      </SimpleGrid>
    </Container>
  );
}