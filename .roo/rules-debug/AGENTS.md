# Project Debug Rules (Non-Obvious Only)
- API errors are caught in the `generateImage` function in `src/ImageGenerator.js`. The full `axios` error object is logged to the console, which can be inspected for detailed response information.
- The `loading` state is managed by a `finally` block, ensuring it is always reset to `false` after an API call, even if the call fails.