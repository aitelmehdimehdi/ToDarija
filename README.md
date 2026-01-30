# ToDarija

This project is a Chrome Extension (Manifest V3) that allows users to translate any selected text in Google Chrome into Moroccan Arabic (Darija) instantly. The user does not need to specify the source language — the extension automatically handles translation from any language (English, French, Chinese, etc.) into Darija using AI-powered translation.

The extension sends the selected text to a Java RESTful Web Service backend, which integrates with AI APIs through OpenRouter, using models such as DeepSeek (and OpenAI-compatible endpoints) to generate accurate Darija translations. The result is then displayed directly inside the extension interface, providing a fast and user-friendly translation experience.

Technologies used: Java, REST Web Services (API), Chrome Extension (Manifest V3), AI API Integration (OpenRouter / OpenAI-compatible), DeepSeek.
