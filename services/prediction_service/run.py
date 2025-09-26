from services.prediction_service.ai_service import create_app

app = create_app()

if __name__ == "__main__":
    print("---")
    print("🚀 Your unified Image Classifier Application is running!")
    print("\n✅ To use the web application, please open your browser and go to:\n")
    print("   http://127.0.0.1:5000\n")
    print("---")
    app.run(host = '0.0.0.0', port = 5000, debug = True)