import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class SentimentService:
    def __init__(self):
        print("Initializing FinBERT on Mac Silicon...")
        # Check for M4 chip acceleration (MPS)
        self.device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
        
        # Load the Financial BERT model (ProsusAI/finbert)
        model_name = "ProsusAI/finbert"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        
        # Move the model to the GPU/Neural Engine
        self.model.to(self.device)
        print(f"FinBERT loaded successfully on {self.device}")

    def analyze(self, text: str):
        # 1. Prepare input
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        # 2. Run Inference
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        # 3. Process probabilities
        probs = F.softmax(outputs.logits, dim=-1)
        labels = ["positive", "negative", "neutral"]
        scores = probs.cpu().numpy()[0]
        
        # Get top result
        ranking = sorted(zip(labels, scores), key=lambda x: x[1], reverse=True)
        return {
            "sentiment": ranking[0][0],
            "confidence": float(ranking[0][1]),
            "breakdown": {
                "positive": float(scores[0]),
                "negative": float(scores[1]),
                "neutral": float(scores[2])
            }
        }

# Create a singleton instance
sentiment_analyzer = SentimentService()
