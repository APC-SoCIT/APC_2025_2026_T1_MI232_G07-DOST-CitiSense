import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import ollama
import time

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


