import './globals.css'

export const metadata = {
  title: 'Graham\'s Treasure Hunt',
  description: 'A fun birthday treasure hunt game',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}