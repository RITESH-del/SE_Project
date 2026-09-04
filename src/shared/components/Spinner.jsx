import { Flex, Loader } from "@mantine/core";

export default function Spinner() {
  return (
    <Flex
      justify="center"
      align="center"
      h="100vh"
    >
      <Loader color="gray" />
    </Flex>
  );
}