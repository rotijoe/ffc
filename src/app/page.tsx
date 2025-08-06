import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { HeroSection } from '@/components/hero_section'

export default function Home() {
  return (
    <main className='min-h-screen bg-background p-8'>
      <div className='max-w-4xl mx-auto'>
        <HeroSection />

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>Next.js 15</CardTitle>
              <CardDescription>
                The React framework for production with App Router
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Built with the latest Next.js features including Server
                Components and the App Router.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ShadCN UI</CardTitle>
              <CardDescription>
                Beautiful and accessible components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Copy and paste components built with Radix UI and Tailwind CSS.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tailwind CSS</CardTitle>
              <CardDescription>Utility-first CSS framework</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Rapidly build modern websites with utility classes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
