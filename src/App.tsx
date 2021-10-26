import {
  Flex,
  Heading,
  Input,
  FormLabel,
  Button,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Box,
  useClipboard,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { useState } from "react";
import { validateURL } from "./utils/validateURL";

function App(): JSX.Element {
  const [URLsubmitted, setURLsubmitted] = useState(false);
  const [originalURL, setURLoriginal] = useState("");
  const [newURL, setURLnew] = useState("");
  const { hasCopied, onCopy } = useClipboard(
    process.env.REACT_APP_API + "/" + newURL
  );
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmissionHandler = async () => {
    const link = nanoid(10);
    setURLnew(link);
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
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmissionHandler)}>
        <FormControl isInvalid={errors.url}>
          <Flex
            width="100vh"
            direction="column"
            background="white"
            p={12}
            rounded={6}
          >
            <Heading mb={6}>Link Shortener</Heading>
            <FormLabel htmlFor="url">URL</FormLabel>
            <Box>
              <Input
                id="url"
                value = {originalURL}
                aria-invalid={errors.url ? "true" : "false"}
                {...register("url", {
                  validate: (value) =>
                    validateURL(value) || "please enter a valid URL",
                })}
                onChange={(e) => {
                  setURLoriginal(e.target.value);
                  setURLsubmitted(false);
                }}
              />
              {/* use  to announce the error message */}
              <FormErrorMessage>
                {errors.url && errors.url.message}
              </FormErrorMessage>
            </Box>
            <Box display="flex" justifyContent="space-between" marginTop="15px">
              <Button
                isDisabled={URLsubmitted}
                mb={4}
                colorScheme="teal"
                type="submit"
                isLoading={isSubmitting}
              >
                {" "}
                Shorten{" "}
              </Button>
            </Box>

            {/* use aria-invalid to indicate field contain error */}
            {URLsubmitted && (
              <>
                <Box>
                  <FormLabel>Shortened Link</FormLabel>
                  <InputGroup>
                    <Input
                      value={process.env.REACT_APP_API + "/" + newURL}
                      onChange={(e) => setURLnew(e.target.value)}
                      variant="outline"
                      mb={3}
                      type="text"
                      readOnly={true}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={onCopy}
                        colorScheme="teal"
                      >
                        {hasCopied ? "Copied" : "Copy"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Box>
                <Box display="flex" justifyContent="flex-start">
                  <Button
                    isDisabled={!URLsubmitted}
                    mb={4}
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    onClick={(event) => {
                      window.location.href = `${process.env.REACT_APP_API}/${newURL}`;
                    }}
                    marginEnd={3}
                  >
                    Visit URL
                  </Button>
                  <Button
                    isDisabled={!URLsubmitted}
                    mb={4}
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    onClick={() => {
                      reset({ url: "" });
                      setURLsubmitted(false);
                    }}
                    marginEnd={3}
                  >
                    Shorten another
                  </Button>
                  <Button
                    isDisabled={!URLsubmitted}
                    mb={4}
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    onClick={() => {
                      reset({ url: "" });
                      setURLsubmitted(false);
                    }}
                  >
                    QRcode
                  </Button>
                </Box>
              </>
            )}
          </Flex>
        </FormControl>
      </form>
    </Flex>
  );
}

export default App;
