from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import torch

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
]

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
    # Tokenize the input text
    inputs = tokenizer(input.text, return_tensors="pt", truncation=True, padding=True, max_length=512)

    # Make predictions
    model.eval()  # Set the model to evaluation mode
    with torch.no_grad():
        outputs = model(**inputs)

    # Get the predicted label
    predictions = torch.argmax(outputs.logits, dim=-1)
    label = predictions.item()

    # Interpret the results
    result = "True News" if label == 0 else "Fake News"
    return {"result": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)