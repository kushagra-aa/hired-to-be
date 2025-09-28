import { useTheme } from "@/client/app/ThemeProvider";
import GoogleSigninButton from "@/client/components/GoogleSigninButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/shadcn/components/ui/card";

export default function LoginPage() {
  const theme = useTheme();

  return (
    <main className="min-h-[100vh] py-20 flex flex-col items-center justify-start gap-16">
      <h1 className="text-4xl">
        <span className="no_underline">🔑</span>
        <span className="underline underline-offset-8 decoration-primary">
          Login
        </span>
      </h1>
      <div className="flex-1 h-full w-full flex items-center justify-center">
        {/* Card */}
        <Card className="w-[70%] md:w-[65%] lg:w-[50%] xl:w-[40%] py-10 min-h-[50vh] items-center justify-start gap-0">
          <CardHeader className="w-full flex flex-col items-center gap-4">
            <CardTitle className="w-max">Login || Signup</CardTitle>
            <CardDescription className="w-max">
              Use Google Login
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full h-full flex-1 flex items-center justify-center">
            <GoogleSigninButton theme={theme.theme} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
