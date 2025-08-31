export default function ContactSection() {
  return (
    <section id="contact" className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold mb-3">Contact</h2>
      <p className="text-sm leading-6 text-muted-foreground">Questions or suggestions? We’d love to hear from you.</p>
      <ul className="mt-3 text-sm leading-6">
        <li>
          Email:{" "}
          <a className="text-primary underline" href="mailto:chiliverysripad@gmail.com">
            chiliverysripad@gmail.com
          </a>
        </li>
        <li>Feedback form: Scroll to the Feedback button in the bottom-right corner.</li>
      </ul>
    </section>
  )
}
