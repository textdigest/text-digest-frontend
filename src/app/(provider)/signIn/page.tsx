import { SignInForm } from '@/components/custom/auth-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
    return (
        <div
            className='flex min-h-screen w-[100%] bg-white bg-cover bg-center'
            style={{ backgroundImage: "url('/Background.png')" }}
        >
            <div className='flex flex-1 items-center justify-center'>
                <img
                    src='/TextDigestLogo.svg'
                    alt='TextDigest.AI Logo'
                    className='mb-50 ml-50 w-[65%]'
                />
            </div>

            {/* Sign In Card  */}
            <div className='flex flex-1 items-center justify-center'>
                <Card className='bg-primary2 border-accent h-[55%] w-[45%] rounded-4xl border p-7 py-12 shadow-[0_0_70px_rgba(0,0,0,0.7)]'>
                    <CardHeader>
                        <CardTitle className='text-3xl font-semibold'>Sign In</CardTitle>
                        <p className='text-accent text-sm'>
                            Enter your email or sign in with Google
                        </p>
                    </CardHeader>
                    <CardContent>
                        <SignInForm />
                    </CardContent>
                    <CardFooter />
                </Card>
            </div>
        </div>
    );
}
