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
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { useState } from "react";
import { validateURL } from "./utils/validateURL";
import { validateAddon } from "./utils/validateAddon";
import { ShortLinkView } from "./components/ShortLinkView";

function App(): JSX.Element {
  const [URLsubmitted, setURLsubmitted] = useState(false);
  const [originalURL, setURLoriginal] = useState("");
  const [newURL, setURLnew] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const handleMyURLs = async () => {
    return;
  };

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
                  onClick={() => handleMyURLs}
                >
                  My URLs
                </Button>
              </Box>
            </Collapse>
          </Flex>
        </VStack>
      </form>
    </Container>
  );
}

export default App;
