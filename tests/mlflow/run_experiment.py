import mlflow
import tensorflow as tf
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# --- Keras Callback for MLflow Logging ---
class MLflowLogger(tf.keras.callbacks.Callback):
    """Keras callback to log metrics for each epoch."""
    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        mlflow.log_metric('epoch_loss', logs.get('loss'), step=epoch)
        mlflow.log_metric('epoch_accuracy', logs.get('accuracy'), step=epoch)
        mlflow.log_metric('epoch_val_loss', logs.get('val_loss'), step=epoch)
        mlflow.log_metric('epoch_val_accuracy', logs.get('val_accuracy'), step=epoch)

def plot_confusion_matrix(y_true, y_pred, class_names):
    """Generates and saves a confusion matrix plot."""
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    
    # Ensure the directory exists
    if not os.path.exists("artifacts"):
        os.makedirs("artifacts")
        
    path = os.path.join("artifacts", "confusion_matrix.png")
    plt.savefig(path)
    plt.close()
    return path

def main():
    # --- 1. Load and Preprocess Data ---
    print("Fetching and preparing MNIST dataset...")
    mnist = fetch_openml('mnist_784', version=1, cache=True, as_frame=False)
    X, y = mnist["data"], mnist["target"].astype(np.uint8)

    # Normalize pixel values to be between 0 and 1
    X = X / 255.0
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Reshape data for the neural network
    X_train = X_train.reshape(-1, 28, 28)
    X_test = X_test.reshape(-1, 28, 28)
    
    class_names = np.unique(y).astype(str)
    print("Dataset ready.")

    # --- 2. Define Hyperparameters and Model ---
    params = {
        'epochs': 10,
        'batch_size': 64,
        'learning_rate': 0.001
    }
    
    model = tf.keras.models.Sequential([
        tf.keras.layers.Flatten(input_shape=(28, 28)),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(10, activation='softmax')
    ])
    
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=params['learning_rate']),
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    # --- 3. MLflow Experiment Tracking ---
    mlflow.set_experiment("Advanced MNIST Classification (Neural Network)")

    with mlflow.start_run() as run:
        print(f"Starting MLflow Run: {run.info.run_name}")
        mlflow.log_params(params)

        print("Training model...")
        model.fit(X_train, y_train, 
                  validation_split=0.2,
                  epochs=params['epochs'], 
                  batch_size=params['batch_size'],
                  callbacks=[MLflowLogger()],
                  verbose=2)
        print("Model training completed.")
        
        # --- 4. Log Artifacts ---
        # Log the final model
        mlflow.keras.log_model(model, artifact_path="model")

        # Generate predictions for evaluation
        y_pred_probs = model.predict(X_test)
        y_pred = np.argmax(y_pred_probs, axis=1)

        # Generate and log the confusion matrix
        print("Generating and logging confusion matrix...")
        cm_path = plot_confusion_matrix(y_test, y_pred, class_names)
        mlflow.log_artifact(cm_path, "plots")
        
    print("\n--- MLflow Run Completed ---")
    print("To see your run, navigate to the project root and run 'mlflow ui'")

if __name__ == '__main__':
    main()
