from services.user_service.app import create_app

app = create_app()

if __name__ == "__main__":
    # Note: Running on port 5001 to avoid conflict with prediction_service
    app.run(host="0.0.0.0", port=5001, debug=True)
