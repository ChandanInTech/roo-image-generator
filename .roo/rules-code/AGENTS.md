# Project Coding Rules (Non-Obvious Only)
- All core application logic is centralized in `src/ImageGenerator.js`. There are no separate utility files or custom hooks.
- When processing API responses from OpenRouter, the image URL is located at the specific path: `response.data.choices[0].message.images[0].image_url.url`.