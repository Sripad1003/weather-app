export default function AppFooter() {
  return (
    <footer className="mt-12 border-t py-6 text-center text-xs text-muted-foreground">
      <nav className="mb-2 flex items-center justify-center gap-4">
        <a className="hover:underline" href="#about">
          About
        </a>
        <a className="hover:underline" href="#contact">
          Contact
        </a>
        <a className="hover:underline" href="#top">
          Back to top
        </a>
      </nav>
      <p>&copy; {new Date().getFullYear()} Weather Now</p>
    </footer>
  )
}
