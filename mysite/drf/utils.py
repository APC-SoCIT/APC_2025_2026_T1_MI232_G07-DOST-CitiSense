import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import ollama
import json

tokenizer = AutoTokenizer.from_pretrained("dost-asti/RoBERTa-tl-sentiment-analysis")
model = AutoModelForSequenceClassification.from_pretrained("dost-asti/RoBERTa-tl-sentiment-analysis")

def analyze_sentiment(text):

    # When there is no text, just return an empty field.
    # "   " comments are still counted as text.
    if not text or not text.strip():
        return None
    
    # Remove whitespaces and new lines
    clean_text = text.strip()

    # Tokenize the text
    inputs = tokenizer(clean_text, return_tensors="pt", truncation=True, max_length=512)

    # Covert the inputs to logits
    output = model(**inputs)

    # Put the logits to a softmax function to determine the probabilities for each sentiment
    # dim=1 means turn each row of logits into probabilities that sum to 1
    probabilities = torch.softmax(output.logits, dim=-1)
    
    # Get the highest probability   
    # .item() converts the tensor (e.g., tensor[42]) to a number so it will become 42
    predicted_sentiment = torch.argmax(probabilities, dim=-1).item()
    
    # Map the highest probability to a sentiment
    sentiment_map = {0: "Negative", 1: "Positive", 2: "Neutral"}

    return sentiment_map[predicted_sentiment]

def summarize_text(text):
    model="llama3.2:1b"
    prompt = (
        f"Summarize the following text in 1-2 sentences. "
        f"Only output the summary text, do NOT add 'Here is a summary' or extra words.\n\n"
        f"Text: \"{text}\""
    )
    response = ollama.generate(model=model, prompt=prompt, options={"temperature": 0.1,})
    return response.response

def generate_themes(text):
    """
    Generate top 6 meaningful themes from text, with percentages.
    """
    model = "llama3.2:1b" 

    prompt = f"""Analyze the following feedback, and extract exactly 6 key themes (no more and no less).

RULES:
1. Output EXACTLY 6 themes
2. Percentages MUST sum to 100 EXACTLY!
3. Percentages are NUMBERS not strings (use 20, not "20%")
4. Each theme is 2-4 words
5. Output ONLY valid minified JSON.
6. Always close all brackets.
7. JSON must be directly parsable by Python's json.loads().

Furthermore, a theme should be:
- A concept or topic (2-4 words)
- Based on semantic meaning, not word frequency
- Representative of multiple pieces of feedback

Examples: "Product Quality Issues", "Customer Service Experience", "Pricing Feedback"

Return ONLY this JSON structure:
{{
  "themeCount": [
    {{"top": "Theme Name", "percentage": number}},
    {{"top": "Theme Name", "percentage": number}},
    {{"top": "Theme Name", "percentage": number}},
    {{"top": "Theme Name", "percentage": number}},
    {{"top": "Theme Name", "percentage": number}},
    {{"top": "Theme Name", "percentage": number}}
  ]
}}

Feedback:
{text}"""

    response = ollama.generate(
        model=model,
        prompt=prompt,
        options={
            "temperature": 0.2,
            "top_p": 0.9,
            "num_predict": 400
        }
    )
    
    result = response.response.strip()
    try:
        return json.loads(result)
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        print(f"Raw response: {result}")
        return None
