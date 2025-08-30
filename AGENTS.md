# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Overview
This is a standard Create React App project. The core logic for image generation is located in `src/ImageGenerator.js`.

## Critical Project-Specific Information

### API Key
- The application requires an OpenRouter API key to be set as the `REACT_APP_OPENROUTER_KEY` environment variable in a `.env` file at the project root.

### API Interaction
- The API request to OpenRouter is hardcoded to generate an image of a "weird kangaroo."
- The image URL is extracted from a deeply nested path in the API response: `response.data.choices[0].message.images[0].image_url.url`. Be mindful of this structure when handling responses.