# 🖼️ Image Classification Web Applications

This project is a web-based image classification application that leverages a Convolutional Neural Network (CNN) to classify images into **Dog**, **Cat**, or **Other** categories. The backend is built with Flask, serving a responsive frontend that allows users to upload images and view classification results in real-time.

## 📜 Table of Contents

-   [Features](#-features)
-   [Project Structure](#-project-structure)
-   [Getting Started](#-getting-started)
    -   [Prerequisites](#-prerequisites)
    -   [Installation](#-installation)
-   [Usage](#-usage)
-   [API Documentation](#-api-documentation)
-   [Technologies Used](#-technologies-used)

## ✨ Features

-   🖼️ **Image Upload**: Drag & drop or click to upload images for classification.
-   🤖 **AI Classification**: Utilizes a pre-trained MobileNetV2 model for accurate predictions.
-   📊 **Confidence Scores**: Displays prediction confidence scores with intuitive visual indicators.
-   📱 **Responsive Design**: Ensures a seamless user experience across desktop and mobile devices.
-   ⚡ **Real-time Processing**: Delivers fast image classification and detailed analysis.
-   🎨 **Modern UI**: Features a beautiful gradient design with smooth, engaging animations.

## 📁 Project Structure

The project is organized as follows:

```
CNN-From-Scratch/
├── backend/
│   ├── ai_service/
│   │   ├── __init__.py             # Application Factory (create_app)
│   │   ├── api/
│   │   │   └── classification.py   # API endpoints (/api/classify, /api/health)
│   │   ├── services/
│   │   │   └── classification_service.py # Core classification logic
│   │   └── utils/
│   │       └── image_processor.py  # Image preprocessing utilities
│   ├── models/
│   │   └── model_loader.py         # Loads the pre-trained model
│   ├── config.py                 # Flask configuration settings
│   └── run.py                    # Server initialization script
│
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css           # Styling for the application
│   │   └── js/
│   │       └── script.js           # Frontend logic for interactivity
│   └── index.html                  # Main HTML page for the UI
│
├── docs/
│   └── SequenceDiagram.JPG
│
├── .gitignore
├── README.md
└── requirements.txt
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### ✅ Prerequisites

-   [Python 3.8+](https://www.python.org/downloads/)
-   `pip` (Python package installer)

### ⚙️ Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/CNN-From-Scratch.git
    cd CNN-From-Scratch
    ```

2.  **Create a virtual environment (recommended):**

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the required dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

## Usage

To start the application, run the following command from the root directory:

```sh
python backend/run.py
```

Once the server is running, you will see the following output:

```
---
🚀 Your unified Image Classifier Application is running!

✅ To use the web application, please open your browser and go to:

   http://127.0.0.1:5000

---
```

Open your web browser and navigate to `http://127.0.0.1:5000` to use the application.

## API Documentation

The backend provides the following API endpoints:

### `POST /api/classify`

Classifies an uploaded image file.

-   **Request Body**: `multipart/form-data` with a single field `file` containing the image.
-   **Success Response (200)**:
    ```json
    {
        "class": "Dog",
        "confidence": "98.75%"
    }
    ```
-   **Error Responses**:
    -   `400 Bad Request`: If no file is provided or the file is invalid.
    -   `500 Internal Server Error`: If an error occurs during classification.

### `GET /api/health`

Checks the health of the application and confirms if the model is loaded.

-   **Success Response (200)**:
    ```json
    {
        "status": "healthy",
        "model_loaded": true
    }
    ```

## 🛠️ Technologies Used

-   **Backend**:
    -   [Flask](https://flask.palletsprojects.com/)
    -   [TensorFlow](https://www.tensorflow.org/)
    -   [Pillow](https://python-pillow.org/)
    -   [NumPy](https://numpy.org/)
-   **Frontend**:
    -   HTML
    -   CSS
    -   JavaScript
