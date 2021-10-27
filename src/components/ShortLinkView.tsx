import {
  InputGroup,
  Input,
  InputRightElement,
  Box,
  Button,
  Collapse,
  FormLabel,
  useClipboard,
} from "@chakra-ui/react";
import { ShareButtons } from "./ShareButtons";
import { useState } from "react";

interface ShortLinkViewProps {
  url: string;
  isURLSubmitted: boolean;
  setURLnew(url: string): void;
}

export function ShortLinkView({
  url,
  isURLSubmitted,
  setURLnew,
}: ShortLinkViewProps): JSX.Element {
  const [showQRCode, setShowQRCode] = useState(false);
  const { hasCopied, onCopy } = useClipboard(
    process.env.REACT_APP_API + "/" + url
  );
  return (
    <>
      <Box marginTop="15px">
        <FormLabel>Shortened Link</FormLabel>
        <InputGroup>
          <Input
            value={process.env.REACT_APP_API + "/" + url}
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
              bg="teal.400"
            >
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box display="flex" justifyContent="flex-start" alignItems="none">
        <Button
          isDisabled={!isURLSubmitted}
          mb={4}
          colorScheme="teal"
          bg="teal.400"
          onClick={(event) => {
            window.open(`${process.env.REACT_APP_API}/${url}`);
          }}
          marginEnd={3}
        >
          Visit URL
        </Button>
        <Button
          isDisabled={!isURLSubmitted}
          mb={4}
          colorScheme="teal"
          bg="teal.400"
          onClick={() => setShowQRCode(!showQRCode)}
        >
          Share
        </Button>
      </Box>
      <Collapse in={showQRCode} animateOpacity>
        <ShareButtons url={url} />
      </Collapse>
    </>
  );
}
