# Weather App

A modern, responsive Weather App built with TypeScript and JavaScript that provides real-time weather information for any location worldwide. The app features a clean user interface, dynamic weather icons, and reliable data fetching from a weather API.

## Features

- 🌦️ **Current Weather:** View up-to-date weather conditions for any city.
- 🔍 **Search Functionality:** Search by city name or use geolocation for local weather.
- 📈 **Detailed Metrics:** Get temperature, humidity, wind speed, and weather description.
- 🎨 **Responsive Design:** Looks great on any device, mobile or desktop.
- 🌙 **Dark/Light Mode:** Switch between themes for better readability.
- ⚡ **Fast & Smooth:** Optimized for quick loading and seamless user experience.

## Tech Stack

- **TypeScript** (main logic and components)
- **JavaScript** (UI interactions)
- **CSS** (styling and responsiveness)
- **HTML** (markup structure)
- **[Weather API](https://openweathermap.org/api)** (or your API of choice)
- **[Gemini API](https://ai.google.dev/gemini-api/docs/quickstart)** (for AI-powered features, if used)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sripad1003/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API Keys**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api).
   - If the app uses Gemini AI features, get your Gemini API key from [Gemini API](https://ai.google.dev/gemini-api/docs/quickstart).
   - Create a `.env` file in the root directory and add:
     ```
     WEATHER_API_KEY=your_openweathermap_api_key_here
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - **Note:** Both keys must be present in your `.env` file for full functionality.

4. **Run the app locally**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
/src
  /components
  /styles
  /utils
  App.tsx
  index.tsx
/public
  index.html
.env.example
README.md
```

## Customization

- Change the default location or units in the settings section of the code.
- Style the components by editing files in `/src/styles`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by [Sripad1003](https://github.com/Sripad1003)
