export default function AboutSection() {
  return (
    <section id="about" className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg max-w-4xl mx-auto px-6 py-12 my-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">About Weather Now</h2>
        <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300 mb-4">
            Weather Now helps you quickly check live conditions, a concise AI summary, and a 3-day outlook for any city.
          </p>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300">
            Use Favorites to jump to saved cities, and the Details view for deeper insights like humidity, UV, wind, and more.
          </p>
        </div>
        {/* <div className="text-center">
          <div className="w-32 h-32 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Stay informed with accurate weather data</p>
        </div> */}
      </div>
    </section>
  )
}
