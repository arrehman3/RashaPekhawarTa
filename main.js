import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from 'markdown-it';

import './style.css';

// 🔥 https://g.co/ai/idxGetGeminiKey 🔥
let API_KEY = import.meta.env.VITE_GEMINI_KEY

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');
let message = document.querySelector('.message');

message.style.display = 'none';

form.onsubmit = async (ev) => {
  ev.preventDefault();

  message.style.display = 'block'
  output.innerHTML = `
    <div class="has-text-centered">
      <div class="skeleton-block"></div>
      <div class="skeleton-block"></div>
      <div class="skeleton-block" style="width: 70%;"></div>
      <p style="margin-top: 20px; color: #7f8c8d; font-style: italic;">
        <i class="fas fa-spinner fa-spin"></i> Creating your personalized itinerary...
      </p>
    </div>
  `; // Clear previous output and show loading

  // Add loading animation to form
  form.classList.add('form-submitting');

  try {
    // Create the prompt text
    const promptText = `You are a knowledgeable travel guide specializing in Peshawar. 
    When a visitor asks you about their upcoming trip using the 
    variable "${promptInput.value}", provide a comprehensive response. 
    Include detailed daily itineraries, top dining spots, and must-see attractions. 
    Ensure you account for travel logistics, such as travel times and 
    operational hours of venues. Incorporate the BRT (Bus Rapid Transit) system into the travel plan. 
    Recommend specific BRT stops and bus routes that the visitor should take to reach their destinations efficiently. 
    Offer clear guidance on which bus to board and the exact stops to get on and off.`;

    // Initialize the Gemini API with the latest version
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Using the newer, faster model
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Generate content stream
    const result = await model.generateContentStream(promptText);

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      buffer.push(chunkText);
      output.innerHTML = md.render(buffer.join(''));
    }

    // Remove loading animation
    form.classList.remove('form-submitting');

  } catch (e) {
    console.error('Error:', e);
    form.classList.remove('form-submitting');
    output.innerHTML = `
      <div class="error-message">
        <div class="has-text-centered">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #e74c3c; margin-bottom: 10px;"></i>
          <h4 class="title is-4" style="color: #c0392b;">Oops! Something went wrong</h4>
          <p style="color: #c0392b;">${e.message || e}</p>
          <p style="margin-top: 15px; font-size: 0.9rem; color: #7f8c8d;">
            Please try again in a few moments or check your internet connection.
          </p>
        </div>
      </div>
    `;
  }
};

// You can delete this once you've filled out an API key