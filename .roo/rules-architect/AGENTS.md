# Project Architecture Rules (Non-Obvious Only)
- The application is designed with a simple, self-contained component architecture. The `ImageGenerator` component manages its own state and does not rely on props from parent components.
- There is no shared state management (like Redux or Context API) implemented.