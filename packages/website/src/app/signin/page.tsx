import { SignInForm } from '@/components/SignInForm';
import { SignPageLayout } from '@/components/SignPageLayout';
import { SignPageOtherChoice } from '@/components/SignPageOtherChoice';

export default function SignInPage() {
  return (
    <SignPageLayout
      mainPosition="right"
      main={<SignInForm />}
      other={
        <SignPageOtherChoice
          title="Ще не з нами?"
          href="/signup"
          action="Зареєструватися"
        />
      }
    />
  );
}
