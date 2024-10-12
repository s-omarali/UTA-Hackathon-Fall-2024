from fastapi import FastAPI, HTTPException #the backend were using for 
from pydantic import BaseModel # used to ensure data types (like in c: we need to make sure certain data is int,str,etc)
import joblib #going to use this to save and load our trained AI model
import os #accessing operating system, used for accessing folders for paths and things

app = FastAPI()

# Load your pre-trained model
#model = joblib.load('')

class NewsArticle(BaseModel):  # defining the news aricle model which will be the user input data
    title: str
    content: str

@app.post("/verify/")  # Our API endpoint  # /verify is a POST endpoint 
async def verify_news(article: NewsArticle): # accepting NewsArticle object 
    
     #prediction = model.predict([article.content])   #
     return {"is_fake": False, "message": "Model not done yet" }   # here will be the json response from the AI model if the news is fake. 0 for fake 1 for real

if __name__ == "__main__":   #check if script is run directly
    import uvicorn # the server for FastAPI
    uvicorn.run(app, host="0.0.0.0", port=8000)  #runs the app on all available IP addresses which is why we use 0.0.0.0.