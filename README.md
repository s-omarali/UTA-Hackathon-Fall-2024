# This will be our team's repo for HACKUTA 2024.

## Project: Fake News Detection Web App  
For this Hackathon, we decided to create a fake news detection app to be able to take a user input of an article and determine whether it is real or fake/satire news based of sentiment analysis. Our hope for this project was not to use an LLM that would fact check, but rather a model that can detect true or fake news based off of the sentiment/style of text.  

## Why we Decided on This Project  
With the prevelance of fake news and misinformation on social media platforms like Twitter, we wanted to be able to combat that in hopes of preventing false information on the internet.    

## Our Future Scope  
In the future, we want to be able to improve the UI drastrically to be more appealing yet simple to users, along with being able to return a better output of why this news appears to be real or fake. We can implement this by returning the confidence rate, using an LLM API instead of our trained model, and by referring the user to where this misinformation might be coming from.  

We also want to implement a Database to store user queries. With this, we can improve user experience and also analyze these queries to further improve this project!  

## Our Stack  
For this project, we used React as our Frontend along with Python for the backend using FastAPI. The model we used for this Sentiment Analysis task was a pretrained Google BERT model. To fine tune this model, we used a Kaggle dataset for True and Fake news. After some data pre-processing and slight feature engineering, the model training loss was brought down to 0.06 and an evaluation loss of 0.01.  

## How to Use the Web App for Now  
1. After cloning the repo, please cd into the fake-news-app. In this directory, run `npm install` followed by `npm start`. This will start the frontend server on localhost:3000.    
2. In a seperate terminal, cd into the backend directory. In this directory, run `uvicorn main:app --reload`. This will start the backend server on localhost:8000.    
3. You are now set to use the app!  
