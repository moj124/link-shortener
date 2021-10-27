import {
  Flex,
  Heading,
  Input,
  FormLabel,
  Button,
  FormControl,
  FormErrorMessage,
  InputGroup,
  VStack,
  Box,
  InputLeftAddon,
  Container,
  Collapse,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
  Link,
  Text
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { validateURL } from "./utils/validateURL";
import { validateAddon } from "./utils/validateAddon";
import { ShortLinkView } from "./components/ShortLinkView";

interface URLrecord {
  base_link: string;
  new_link: string;
}

function App(): JSX.Element {
  const [URLsubmitted, setURLsubmitted] = useState(false);
  const [originalURL, setURLoriginal] = useState("");
  const [newURL, setURLnew] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [myURLs, setURLs] = useState<URLrecord[]>([]);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() =>{
    const loadURLs = async () => {
      const res = await fetch(`${process.env.REACT_APP_API}/urls`);
      const result = await res.json();
      setURLs(result.data);
    };
    loadURLs();
  },[URLsubmitted]);

  const url_posts = myURLs.map((element,index) => <Box p={5} key={index} shadow="md" borderWidth="1px">
  <Heading fontSize="xl"><Link color="teal.500" href={`${process.env.REACT_APP_API}/${element.new_link}`}>{element.new_link}</Link></Heading>
  <Text mt={4}>{element.base_link}</Text>
</Box>)

  const onSubmissionHandler = async () => {
    let link;

    if (newURL.length === 0) {
      link = nanoid(10);
      setURLnew(link);
    } else {
      link = newURL;
    }

    setURLsubmitted(true);
    await fetch(`${process.env.REACT_APP_API}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link, originalURL }),
    });
  };

  return (
    <Container centerContent>
      <HStack>
      <form onSubmit={handleSubmit(onSubmissionHandler)}>
        <VStack
          height="100vh"
          alignItems="center"
          justifyContent="center"
          spacing={10}
        >
          <Flex
            width={{ base: "75%", sm: "75%", md: "130%" }}
            direction="column"
            background="white"
            p={12}
            rounded={6}
          >
            <Heading mb={6}>Link Shortener</Heading>
            <FormControl isInvalid={errors.url} isRequired>
              <FormLabel htmlFor="url">URL</FormLabel>
              <Box>
                <Input
                  id="url"
                  value={originalURL}
                  aria-invalid={errors.url ? "true" : "false"}
                  {...register("url", {
                    validate: (value) =>
                      validateURL(value) || "please enter a valid URL",
                  })}
                  onChange={(e) => {
                    setURLoriginal(e.target.value);
                    setURLsubmitted(false);
                  }}
                  autoFocus
                />
                <FormErrorMessage>
                  {errors.url && errors.url.message}
                </FormErrorMessage>
              </Box>
            </FormControl>
            <Collapse in={!URLsubmitted}>
              <FormControl isInvalid={errors.addon}>
                <VStack marginTop="15px" display="flex-start">
                  <FormLabel htmlFor="addon">Customise Link</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      {process.env.REACT_APP_API}/
                    </InputLeftAddon>
                    <Input
                      id="addon"
                      placeholder="alias"
                      value={newURL}
                      aria-invalid={errors.addon ? "true" : "false"}
                      {...register("addon", {
                        validate: (value) =>
                          validateAddon(value) || "please enter a valid alias",
                      })}
                      onChange={(e) => {
                        setURLnew(e.target.value);
                        setURLsubmitted(false);
                      }}
                    />
                  </InputGroup>
                  <FormErrorMessage paddingLeft={180}>
                    {errors.addon && errors.addon.message}
                  </FormErrorMessage>
                </VStack>
              </FormControl>
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="15px"
              >
                <Button
                  isDisabled={URLsubmitted}
                  mb={4}
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Shorten
                </Button>
              </Box>
            </Collapse>
            <Collapse in={URLsubmitted} animateOpacity>
              <ShortLinkView
                url={newURL}
                isURLSubmitted={URLsubmitted}
                setURLnew={(url: string) => {
                  setURLnew(url);
                }}
              />
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="15px"
              >
                <Button
                  mb={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={() => {
                    reset({ url: "" });
                    reset({ addon: "" });
                    setURLsubmitted(false);
                  }}
                  marginEnd={3}
                >
                  Shorten another
                </Button>
                <Button
                  mb={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  onClick={onOpen}
                >
                  My URLs
                </Button>
              </Box>
            </Collapse>
          </Flex>
        </VStack>
      </form>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size ="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>List Of URLs</DrawerHeader>

          <DrawerBody>
            <VStack align= "none">
              {url_posts}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} size="lg" onClick={onClose}>
              Exit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>     
      </HStack>
    </Container>
  );
}

export default App;
