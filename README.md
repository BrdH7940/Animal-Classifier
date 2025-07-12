# Image Classification Website

A web application that classifies uploaded images into three categories: **Dog**, **Cat**, or **Other**. The application uses a Flask backend with a pre-trained MobileNetV2 model and features a responsive frontend.

## Features

- 🖼️ **Image Upload**: Drag & drop or click to upload images
- 🤖 **AI Classification**: Uses pre-trained MobileNetV2 for accurate predictions
- 📊 **Confidence Scores**: Shows prediction confidence with visual indicators
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Processing**: Fast image classification with detailed analysis
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Project Structure

```
ai-pet-classifier/
├── backend/
│   ├── ai_service/
│   │   ├── __init__.py         # Application Factory (create_app)
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── classification.py # Blueprint for endpoint /classify
│   │   ├── services/
│   │   │   └── classification_service.py # Main logic
│   │   └── utils/
│   │       └── image_processor.py
│   ├── models/
│   │   └── model_loader.py       # Install and load model
│   ├── .flaskenv
│   ├── config.py
│   └── run.py                      # Server initialization
│
├── frontend/
│   ├── index.html
│   └── assets/
│       ├── css/
│       │   └── style.css
│       └── js/
│           ├── main.js
│           └── api.js
│
├── docs/
│   └── sequence_diagram.JPG
│
├── .gitignore
└── README.md
```
