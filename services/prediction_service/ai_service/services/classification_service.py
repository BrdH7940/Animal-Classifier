from PIL import Image
import io
import tensorflow as tf
from ..utils.image_processor import preprocess_image

def get_prediction(model, image_bytes: bytes):
    """
    Input model and image bytes, return the predicted class
    """

    if model is None:
        raise ValueError("Model is not loaded")
    
    image = Image.open(io.BytesIO(image_bytes))
    processed_image = preprocess_image(image)

    predictions = model.predict(processed_image)
    decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top = 5)[0]

    dog_classes = ['beagle', 'golden_retriever', 'labrador_retriever', 'german_shepherd', 'bulldog', 'poodle', 'husky', 'chihuahua', 'border_collie', 'retriever', 'terrier', 'spaniel', 'hound', 'setter', 'pointer', 'mastiff', 'sheepdog']
    cat_classes = ['tabby', 'tiger_cat', 'persian_cat', 'siamese_cat', 'egyptian_cat']
    
    dog_confidence = 0.0
    cat_confidence = 0.0

    for _, class_name, confidence in decoded_predictions:
        class_lower = class_name.lower()
        if any(dog_term in class_lower or 'dog' in class_lower for dog_term in dog_classes):
            dog_confidence = max(dog_confidence, confidence)
        if any(cat_term in class_lower or 'cat' in class_lower for cat_term in cat_classes):
            cat_confidence = max(cat_confidence, confidence)

    # Reformat the predictions to be serializable into JSON
    serializable_details = [{"label": str(name), "probability": float(conf)} for id, name, conf in decoded_predictions]

    if dog_confidence > cat_confidence and dog_confidence > 0.1:
        final_result = {"label": "dog", "probability": float(dog_confidence)}
        return {"final_result": final_result, "predictions": serializable_details}
    elif cat_confidence > 0.1:
        final_result = {"label": "cat", "probability": float(cat_confidence)}
        return {"final_result": final_result, "predictions": serializable_details}
    else:
        top_prediction = decoded_predictions[0]
        final_result = {"label": "other", "probability": float(top_prediction[2])}
        return {"final_result": final_result, "predictions": serializable_details}