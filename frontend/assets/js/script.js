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
