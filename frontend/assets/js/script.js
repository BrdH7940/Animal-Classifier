let selectedFile = null;

// Retrieve important DOM elements
const fileInput = document.getElementById("fileInput");
const classifyBtn = document.getElementById("classifyBtn");

/// Handle "Choose Image" button click
fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0]; // Take the first file from input e.target.files (Array)

    handleFileSelect(file);
});

function handleFileSelect(file) {
    if (!file) return;

    selectedFile = file;

    const reader = new FileReader(); // Browser API to read the file
    reader.onload = function (e) {
        // Automatically called when the file is loaded
        const imagePreview = document.getElementById("imagePreview");
        imagePreview.src = e.target.result; // e.target.result is the image data (base64 string)
        document.getElementById("previewContainer").style.display = "block"; // Display the preview container
    };

    reader.readAsDataURL(file); // Read the file as a data URL
}

/// Handle "Classify Image" button click
async function classifyImage() {
    if (!selectedFile) return;

    //? Preprocess the image for sending to the backend
    const formData = new FormData();
    formData.append("file", selectedFile);

    //? Send the image to the backend
    try {
        const response = await fetch("http://127.0.0.1:5000/classify", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            showResults(result);
        } else {
            alert(result.error || "Classification failed");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

function showResults(result) {
    const resultsContainer = document.getElementById("resultsContainer");
    const predictionElement = document.getElementById("prediction");

    predictionElement.textContent = result.prediction;
    resultsContainer.style.display = "block";
}
