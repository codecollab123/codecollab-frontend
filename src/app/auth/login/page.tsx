'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { UserCredential } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useState } from "react";

import { axiosInstance } from "@/lib/axiosinstance";
import { getUserData, loginGoogleUser, loginUser } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";
import { setUser } from "@/lib/userSlice";
import OtpLogin from "@/components/shared/otpDialog";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/public/user_email?user=${email}`);
      const phoneVerify = response.data.phoneVerify;

      if (phoneVerify) {
        const userCredential: UserCredential = await loginUser(email, password);
        const { user, claims } = await getUserData(userCredential);

        dispatch(
          setUser({
            ...user,
            type: claims.type,
          })
        );

        router.replace(`/dashboard`);
        toast({
          title: 'Login Successful',
          description: 'You have successfully logged in.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Phone Verification Required',
          description: 'Please verify your phone number to proceed.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential: UserCredential = await loginGoogleUser();
      const { user, claims } = await getUserData(userCredential);

      dispatch(setUser({ ...user, type: claims.type }));
      router.replace(`/dashboard`);
      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in with Google.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Login Failed',
        description: 'Something went wrong. Please try again.',
      });
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login with your Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
              <div className="relative text-center text-sm">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-sm">
          Don&apos;t have account?{' '}
        <Button  variant="outline" className="size-sm ml-2"asChild>
          <Link href="/auth/signup">Sign up</Link>
        </Button>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
