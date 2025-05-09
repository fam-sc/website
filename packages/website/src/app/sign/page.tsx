import { Metadata } from 'next';

import  { SignComponent }  from './sign-component';


export const metadata: Metadata = {
  title: 'Увійти',
};

export  function SignPage() {
  return <SignComponent />;
}
