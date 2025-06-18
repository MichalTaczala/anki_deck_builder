'use client';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

const shareUrl = 'https://memohill.com';
const title = 'Check out MemoHill - Anki Cards Generator for Language Learning!';

export default function SocialShare() {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '2rem 0' }}>
      <FacebookShareButton url={shareUrl}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} title={title}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <WhatsappShareButton url={shareUrl} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  );
} 