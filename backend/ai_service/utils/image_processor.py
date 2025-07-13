from PIL import Image
import numpy as np
import tensorflow as tf

def preprocess_image(image: Image.Image):
    if image.model != "RGB":
        image = image.convert("RGB")

    image = image.resize((224, 224))
    image_array = tf.keras.preprocessing.image.img_to_array(image)
    image_array = np.expand_dims(image_array, axis = 0)
    return tf.keras.applications.mobilenet_v2.preprocess_input(image_array)

def allowed_file(filename: str, allowed_extensions: set):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions