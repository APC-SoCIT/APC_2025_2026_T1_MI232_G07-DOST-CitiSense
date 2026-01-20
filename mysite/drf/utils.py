import numpy as np
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification


tokenizer = AutoTokenizer.from_pretrained("dost-asti/RoBERTa-tl-sentiment-analysis")
model = AutoModelForSequenceClassification.from_pretrained("dost-asti/RoBERTa-tl-sentiment-analysis")

def analyze_sentiment(text):

    # Tokenize the text
    inputs = tokenizer(text, return_tensors="pt")

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