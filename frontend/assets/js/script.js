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

    if (file.size > 10 * 1024 * 1024) {
        showError("File size exceeds 10MB limit");
        return;
    }

    if (!file.type.startsWith("image/")) {
        showError("Please select an image file");
        return;
    }

    hideError(); // Hide any previous error
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

    hideError(); // Hide any previous error
    showLoading(); // Show loading indicator

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
    } finally {
        hideLoading(); // Turn off loading indicator after the request is done
    }
}

function showResults(data) {
    const { final_result, predictions } = data;

    const predictionElement = document.getElementById("prediction");
    predictionElement.textContent = final_result.label;
    predictionElement.className = `prediction ${final_result.label.toLowerCase()}`;

    const confidenceFill = document.getElementById("confidenceFill");
    confidenceFill.style.width = `${final_result.probability * 100}%`;
    confidenceFill.className = `confidence-fill ${final_result.label.toLowerCase()}`;

    document.getElementById("confidence").textContent = `Confidence: ${(
        final_result.probability * 100
    ).toFixed(1)}%`;

    const detailsList = document.getElementById("detailsList");
    detailsList.innerHTML = ""; // Delete all previous items
    predictions.forEach((pred) => {
        const item = document.createElement("div");
        item.className = "detail-item";
        item.innerHTML = `
            <span>${pred.label}</span>
            <span>${(pred.probability * 100).toFixed(1)}%</span>
        `;
        detailsList.appendChild(item);
    });

    document.getElementById("resultsContainer").style.display = "block";
    document.getElementById("resetBtn").style.display = "inline-block";
}

/// Reset the classifier
function resetClassifier() {
    selectedFile = null;
    document.getElementById("previewContainer").style.display = "none";
    document.getElementById("fileInput").value = "";

    document.getElementById("resultsContainer").style.display = "none";
    document.getElementById("resetBtn").style.display = "none";
    hideError();
}

/// Enhance UI/UX
function showLoading() {
    document.getElementById("loading").style.display = "flex";
    document.getElementById("classifyBtn").disabled = true; // Avoid spam
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("classifyBtn").disabled = false;
}

function showError(message) {
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function hideError() {
    const errorElement = document.getElementById("error");
    errorElement.textContent = "";
    errorElement.style.display = "none";
}

/// Validation & Drag, Drop
const uploadArea = document.getElementById("uploadArea");

//? Drag file over the upload area
uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault(); // Prevent default behavior (e.g., opening the file in the browser)
    uploadArea.classList.add("dragover");
});

//? Drag file leave the upload area
uploadArea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
});

//? Drop file on the upload area
uploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadArea.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});
