# UI/UX Design - Project 3rd party libraries.

### Vite

- Used as the build tool and development server for this React application. Vite is chosen because it provides:
- Faster development experience: Its blazing-fast Hot Module Replacement (HMR) ensures changes are reflected instantly in the browser.
- Improved build performance: It uses modern JavaScript and ES module-based bundling, making the build process much faster than traditional tools like Webpack.
Simple setup: Vite’s configuration is straightforward, reducing the time spent on tool configuration.

### react-router-dom
Used to handle and manage the application's routing. This library provides a robust and flexible solution for building single-page applications (SPAs), enabling dynamic navigation and URL management. It simplifies route management, including nested routes, route parameters, and query strings, making it ideal for complex navigation scenarios.

### react-hook-form
A library for managing forms in React applications. It minimizes re-renders and improves performance while maintaining simplicity. With features like validation and error handling, it provides a developer-friendly API that reduces boilerplate code when working with forms.

### @hookform/resolvers
A companion library to react-hook-form, used to integrate form validation libraries like yup into react-hook-form. It provides a seamless way to handle schema-based validation for form inputs, reducing manual validation logic.

### yup
A schema validation library used for defining and validating object shapes. Paired with react-hook-form and @hookform/resolvers, it enables robust validation of user input with minimal effort, ensuring the integrity of form data before submission.

### axios
A promise-based HTTP client for making API requests. It is used to handle communication with the server, enabling data fetching and posting for operations such as getting Pokémon data, updating user information, or performing searches. Its clean API and ability to handle interceptors make it a reliable choice for HTTP requests.