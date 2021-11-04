import {
  InputGroup,
  Input,
  InputRightElement,
  Box,
  Button,
  Collapse,
  FormLabel,
  useClipboard,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ShareButtons } from "./ShareButtons";

interface ShortLinkViewProps {
  url: string;
  isURLSubmitted: boolean;
  showQRCode: boolean;
  setShowQRCode(bool: boolean): void;
  setURLnew(url: string): void;
}

export function ShortLinkView({
  url,
  isURLSubmitted,
  showQRCode,
  setShowQRCode,
  setURLnew,
}: ShortLinkViewProps): JSX.Element {
  const { hasCopied, onCopy } = useClipboard(
    process.env.REACT_APP_API + "/" + url
  );
  return (
    <>
      <Box marginTop="15px">
        <FormLabel fontSize="1rem">
          <i className="fas fa-magic"></i>
          <span className="icon-text">Short Link</span>
        </FormLabel>
        <InputGroup>
          <Input
            size="lg"
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
              overflow="hidden"
              size="sm"
              variant="outline"
              onClick={onCopy}
            >
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
      <Wrap display="flex" justifyContent="flex-start" alignItems="none">
        <WrapItem>
          <Button
            overflow="hidden"
            isDisabled={!isURLSubmitted}
            mb={4}
            colorScheme="blue"
            bg="blue.400"
            onClick={(event) => {
              window.open(`${process.env.REACT_APP_API}/${url}`);
            }}
            marginEnd={3}
            onMouseEnter={() => setShowQRCode(false)}
          >
            Visit URL
          </Button>
        </WrapItem>
        <WrapItem>
          <Button
            overflow="hidden"
            isDisabled={!isURLSubmitted}
            mb={4}
            colorScheme="blue"
            bg="blue.400"
            onClick={() => setShowQRCode(!showQRCode)}
            onMouseEnter={() => setShowQRCode(true)}
          >
            Share
          </Button>
        </WrapItem>
      </Wrap>
      <Collapse in={showQRCode} animateOpacity>
        <ShareButtons url={url} />
      </Collapse>
    </>
  );
}
