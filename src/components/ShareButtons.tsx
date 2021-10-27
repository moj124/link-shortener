import { VStack, Box } from "@chakra-ui/react";
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
import QRCode from "qrcode.react";

interface ShareProps {
  url: string;
}

export function ShareButtons({ url }: ShareProps): JSX.Element {
  return (
    <Box flex-direction="row" display="flex">
      <QRCode value={`${process.env.REACT_APP_API}/${url}`} size={200} />
      <VStack paddingLeft={3} alignItems="none">
        <FacebookShareButton
          url={`${process.env.REACT_APP_API}/${url}`}
          quote="Click Here"
          className="custom-share-button"
        >
          <FacebookIcon size={35} className="custom-share-icon" />
          <p>Facebook</p>
        </FacebookShareButton>
        <TwitterShareButton
          url={`${process.env.REACT_APP_API}/${url}`}
          className="custom-share-button"
        >
          <TwitterIcon size={35} className="custom-share-icon" />
          <p>Twitter</p>
        </TwitterShareButton>
        <WhatsappShareButton
          url={`${process.env.REACT_APP_API}/${url}`}
          className="custom-share-button"
        >
          <WhatsappIcon size={35} className="custom-share-icon" />
          <p>Whatsapp</p>
        </WhatsappShareButton>
        <LinkedinShareButton
          url={`${process.env.REACT_APP_API}/${url}`}
          className="custom-share-button"
        >
          <LinkedinIcon size={35} className="custom-share-icon" />
          <p>Linkedin</p>
        </LinkedinShareButton>
        <EmailShareButton
          url={`${process.env.REACT_APP_API}/${url}`}
          className="custom-share-button"
        >
          <EmailIcon size={35} className="custom-share-icon" />
          <p>Email</p>
        </EmailShareButton>
      </VStack>
    </Box>
  );
}
