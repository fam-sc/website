import { Metadata } from 'next';

import { PrivacyPolicyComponent } from './privacy-policy';

export const metadata: Metadata = {
  title: 'Політика конфіденційності',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyComponent />;
}
