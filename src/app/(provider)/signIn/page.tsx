import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa"

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-white"
      style={{ backgroundImage: "url('/Background.png')" }}
    >
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/TextDigestLogo.svg" 
          alt="TextDigest.AI Logo" 
          className="w-[65%] mb-50 ml-50"
        />
      </div>
      
      {/* Sign In Card  */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-[45%] h-[55%] bg-primary2 border border-accent p-7 py-12 rounded-4xl shadow-[0_0_70px_rgba(0,0,0,0.7)]">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Sign In</CardTitle>
            <p className="text-sm text-accent">
              Enter your email or sign in with Google
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-secondary border-accent text-white py-6"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-secondary border-accent text-white py-6"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-white text-xl bg-primary-bright py-6"
              >
                Sign In
              </Button>
            </form>

            <div className="flex items-center my-5">
              <div className="flex-grow border-t border-accent"></div>
              <span className="mx-3 text-sm text-accent">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-accent"></div>
            </div>

            <Button
              variant="outline"
              className="w-full text-white text-xl bg-primary2 border-accent py-6"
            >
              <FaGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </div>
  )
}

