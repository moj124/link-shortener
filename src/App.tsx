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
  Wrap,
  WrapItem,
  InputLeftAddon,
  Container,
  Collapse,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { validateURL } from "./utils/validateURL";
import { validateAddon } from "./utils/validateAddon";
import { ShortLinkView } from "./components/ShortLinkView";
import { URLPost } from "./components/URLPost";

export interface URLrecord {
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

  const drawer_variant = useBreakpointValue({
    base: "full",
    sm: "full",
    md: "full",
    lg: "md",
  });

  const container_variant = useBreakpointValue({
    base: "initial",
    sm: "initial",
    md: "60ch",
    lg: "60ch",
  });

  useEffect(() => {
    const loadURLs = async () => {
      const res = await fetch(`${process.env.REACT_APP_API}/urls`);
      const result = await res.json();
      setURLs(result.data);
    };
    loadURLs();
  }, [URLsubmitted]);

  const url_posts = myURLs.map((element, index) => (
    <URLPost
      key={index}
      id={index}
      new_link={element.new_link}
      base_link={element.base_link}
      setURLs={(urls: URLrecord[]) => setURLs(urls)}
    />
  ));

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
    <Container marginBottom={10} maxWidth={container_variant}>
      <form onSubmit={handleSubmit(onSubmissionHandler)}>
        <VStack height="100vh" alignItems="None" paddingTop={10} spacing={10}>
          <Heading size="2xl" color="white">
            LINK SHORTS
          </Heading>
          <Flex
            direction="column"
            background="white"
            className="container"
            p={10}
            rounded={6}
          >
            <FormControl isInvalid={errors.url} isRequired>
              <FormLabel htmlFor="url">URL</FormLabel>
              <Box>
                <Input
                  id="url"
                  value={originalURL}
                  aria-invalid={errors.url ? "true" : "false"}
                  {...register("url", {
                    validate: (value) =>
                      validateURL(value) || "Please enter a valid URL",
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
                          validateAddon(value) || "Please enter a valid alias",
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
                  mb={4}
                  size="lg"
                  colorScheme="blue"
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
              <Wrap display="flex" justifyContent="flex-start" marginTop="15px">
                <WrapItem>
                  <Button
                    mb={4}
                    size="lg"
                    colorScheme="blue"
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
                </WrapItem>
                <WrapItem>
                  <Button
                    mb={4}
                    size="lg"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    onClick={onOpen}
                  >
                    My URLs
                  </Button>
                </WrapItem>
              </Wrap>
            </Collapse>
          </Flex>
        </VStack>
      </form>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size={drawer_variant}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>List Of URLs</DrawerHeader>

          <DrawerBody>
            <VStack align="none">{url_posts}</VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} size="lg" onClick={onClose}>
              Exit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
}

export default App;
