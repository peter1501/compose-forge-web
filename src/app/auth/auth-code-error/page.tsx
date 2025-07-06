import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-center">
            There was an error confirming your authentication code.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-slate-600 mb-6">
            This could happen if the confirmation link has expired or has already been used.
            Please try signing in again or request a new confirmation email.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full">
                Back to Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="w-full">
                Sign Up Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}