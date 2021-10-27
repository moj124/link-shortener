import { Box, Heading, Link, Text, Button, HStack } from "@chakra-ui/react";
import { URLrecord } from "../App";

interface URLPostProps {
  id: number;
  new_link: string;
  base_link: string;
  setURLs(urls: URLrecord[]): void;
}
export function URLPost({
  id,
  new_link,
  base_link,
  setURLs,
}: URLPostProps): JSX.Element {
  const handleDeleteRecord = async () => {
    await fetch(`${process.env.REACT_APP_API}/${new_link}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([new_link]),
    });
    const res = await fetch(`${process.env.REACT_APP_API}/urls`);
    const result = await res.json();
    setURLs(result.data);
  };

  return (
    <Box p={5} key={id} shadow="md" borderWidth="1px">
      <HStack justifyContent="space-between">
        <Heading fontSize="xl">
          <Link
            target="_blank"
            color="teal.500"
            href={`${process.env.REACT_APP_API}/${new_link}`}
          >
            {new_link}
          </Link>
        </Heading>
        <HStack justifyContent="flex-end" alignItems="none" spacing={1}>
          <Button
            mb={4}
            colorScheme="teal"
            marginInlineEnd={0}
            onClick={() => {
              window.open(`${process.env.REACT_APP_API}/${new_link}`);
            }}
            marginEnd={3}
          >
            Visit URL
          </Button>
          <Button mb={4} colorScheme="red" onClick={handleDeleteRecord}>
            {" "}
            Delete
          </Button>
        </HStack>
      </HStack>
      <Text mt={4}>{base_link}</Text>
    </Box>
  );
}
