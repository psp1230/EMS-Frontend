import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle login logic here
    // For example, navigate to the dashboard after successful login
    navigate("/home")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
              <form className="flex flex-col justify-center p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-2xl font-bold">貨櫃系統</div>
                    <p className="text-balance text-muted-foreground">輸入帳號密碼以此登入</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">帳號</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">密碼</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" onClick={handleSubmit}>
                    Login
                  </Button>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
