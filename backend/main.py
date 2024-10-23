from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for all origins
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the fine-tuned model and tokenizer
model_path = './fake_news_model'
tokenizer = DistilBertTokenizer.from_pretrained(model_path)
model = DistilBertForSequenceClassification.from_pretrained(model_path)

class TextInput(BaseModel):
    text: str

@app.post("/classify/")
async def classify_text(input: TextInput):
    try:
        # Tokenize the input text
        inputs = tokenizer(input.text, return_tensors="pt", truncation=True, padding=True, max_length=512)

        # Make predictions
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Get the predicted class
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1)
        predicted_class = torch.argmax(probabilities, dim=1).item()

        # Log the raw outputs for debugging
        print(f"Logits: {logits}")
        print(f"Probabilities: {probabilities}")
        print(f"Predicted class: {predicted_class}")

        # Map the predicted class to a label
        is_fake = predicted_class == 1  # Assuming class 1 is 'fake' and class 0 is 'real'
        return {"is_fake": is_fake}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)