import { SignPageLayout } from '@/components/SignPageLayout';
import { SignPageOtherChoice } from '@/components/SignPageOtherChoice';
import { SignUpForm } from '@/components/SignUpForm';

export default function SignInPage() {
  return (
    <SignPageLayout
      mainPosition="left"
      main={<SignUpForm />}
      other={
        <SignPageOtherChoice
          title="Вже маєте обліковий запис?"
          href="/signin"
          action="Увійти"
        />
      }
    />
  );
}
