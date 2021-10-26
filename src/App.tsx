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
  VStack,
  Box,
  useClipboard,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { useState } from "react";
import { validateURL } from "./utils/validateURL";
import QRCode from "qrcode.react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

function App(): JSX.Element {
  const [URLsubmitted, setURLsubmitted] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
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
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmissionHandler)}>
        <Flex
          width={{ base: "75%", sm: "75%", md: "110%" }}
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
              {/* use  to announce the error message */}
              <FormErrorMessage>
                {errors.url && errors.url.message}
              </FormErrorMessage>
            </Box>
          </FormControl>
          <FormControl isInvalid={errors.addon}>
            <VStack marginTop="15px" display="flex-start">
              <FormLabel htmlFor="addon">Customise Link</FormLabel>
              <InputGroup>
                <InputLeftAddon>{process.env.REACT_APP_API}/</InputLeftAddon>
                <Input
                  id="addon"
                  placeholder="alias"
                  value={newURL}
                  onChange={(e) => {
                    setURLnew(e.target.value);
                    setURLsubmitted(false);
                  }}
                />
              </InputGroup>
            </VStack>
          </FormControl>
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
                    autoFocus
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
                  onClick={() => setShowQRCode(!showQRCode)}
                >
                  Share
                </Button>
              </Box>
              {showQRCode && (
                <Box flex-direction="row" display="flex">
                  <QRCode
                    value={`${process.env.REACT_APP_API}/${newURL}`}
                    size={200}
                  />
                  <VStack paddingLeft={3} alignItems="none">
                    <FacebookShareButton
                      url={`${process.env.REACT_APP_API}/${newURL}`}
                      quote="Click Here"
                      className="custom-share-button"
                    >
                      <FacebookIcon size={35} className="custom-share-icon" />
                      <p>Facebook</p>
                    </FacebookShareButton>
                    <TwitterShareButton
                      url={`${process.env.REACT_APP_API}/${newURL}`}
                      className="custom-share-button"
                    >
                      <TwitterIcon size={35} className="custom-share-icon" />
                      <p>Twitter</p>
                    </TwitterShareButton>
                    <WhatsappShareButton
                      url={`${process.env.REACT_APP_API}/${newURL}`}
                      className="custom-share-button"
                    >
                      <WhatsappIcon size={35} className="custom-share-icon" />
                      <p>Whatsapp</p>
                    </WhatsappShareButton>
                    <LinkedinShareButton
                      url={`${process.env.REACT_APP_API}/${newURL}`}
                      className="custom-share-button"
                    >
                      <LinkedinIcon size={35} className="custom-share-icon" />
                      <p>Linkedin</p>
                    </LinkedinShareButton>
                    <EmailShareButton
                      url={`${process.env.REACT_APP_API}/${newURL}`}
                      className="custom-share-button"
                    >
                      <EmailIcon size={35} className="custom-share-icon" />
                      <p>Email</p>
                    </EmailShareButton>
                  </VStack>
                </Box>
              )}
            </>
          )}
        </Flex>
      </form>
    </Flex>
  );
}

export default App;
