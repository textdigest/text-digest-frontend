import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaGoogle } from 'react-icons/fa';

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
                        <form className='space-y-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='you@example.com'
                                    className='bg-secondary border-accent py-6 text-white'
                                />
                            </div>

                            <div className='grid gap-2'>
                                <Label htmlFor='password'>Password</Label>
                                <Input
                                    id='password'
                                    type='password'
                                    className='bg-secondary border-accent py-6 text-white'
                                />
                            </div>

                            <Button
                                type='submit'
                                className='bg-primary-bright w-full py-6 text-xl text-white'
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className='my-5 flex items-center'>
                            <div className='border-accent flex-grow border-t'></div>
                            <span className='text-accent mx-3 text-sm'>OR CONTINUE WITH</span>
                            <div className='border-accent flex-grow border-t'></div>
                        </div>

                        <Button
                            variant='outline'
                            className='bg-primary2 border-accent w-full py-6 text-xl text-white'
                        >
                            <FaGoogle className='mr-2 h-5 w-5' />
                            Google
                        </Button>
                    </CardContent>
                    <CardFooter />
                </Card>
            </div>
        </div>
    );
}
