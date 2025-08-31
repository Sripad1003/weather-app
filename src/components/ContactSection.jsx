export default function ContactSection() {
  return (
    <section id="about" className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg max-w-4xl mx-auto px-6 py-12 my-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Contact</h2>
        <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300 mb-4">
            Questions or suggestions? We’d love to hear from you.
          </p>
          <ul className="mt-3 text-sm leading-6">
            <li>
              Email:{" "}
              <a className="text-primary underline" href="mailto:chiliverysripad@gmail.com">
                chiliverysripad@gmail.com
              </a>
            </li>
            <li>Feedback form: Scroll to the Feedback button in the bottom-right corner.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
