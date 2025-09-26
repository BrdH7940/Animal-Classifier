import { useState, useRef } from "react";

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (!file) return;
        resetClassifier(false); // Keep preview if a new file is selected

        // Basic validation
        if (file.size > 16 * 1024 * 1024) {
            setError("File size exceeds 16MB limit");
            return;
        }
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        setError(null);
        setSelectedFile(file);

        // Create a preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleChooseImageClick = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const classifyImage = async () => {
        if (!selectedFile) return;

        setError(null);
        setIsLoading(true);
        setResults(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/classify", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data);
            } else {
                setError(data.error || "Classification failed");
            }
        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetClassifier = (fullReset = true) => {
        if (fullReset) {
            setSelectedFile(null);
            setPreviewUrl(null);
            fileInputRef.current.value = "";
        }
        setResults(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="container">
            <h1>🐕🐱 Image Classifier</h1>
            <p className="subtitle">
                Upload an image to classify it as Dog, Cat, or Other
            </p>

            <div
                className={`upload-area ${isDragging ? "dragover" : ""}`}
                id="uploadArea"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                    Click to upload or drag and drop
                </div>
                <div className="upload-subtext">PNG, JPG, GIF up to 16MB</div>
            </div>

            <input
                type="file"
                id="fileInput"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {!previewUrl && (
                <button className="btn" onClick={handleChooseImageClick}>
                    Choose Image
                </button>
            )}

            <div
                className="preview-container"
                id="previewContainer"
                style={{ display: previewUrl ? "block" : "none" }}
            >
                <img
                    id="imagePreview"
                    className="image-preview"
                    alt="Preview"
                    src={previewUrl}
                />
                <br />
                <button
                    className="btn"
                    id="classifyBtn"
                    onClick={classifyImage}
                    disabled={isLoading}
                >
                    {isLoading ? "Classifying..." : "Classify Image"}
                </button>
            </div>

            {isLoading && (
                <div
                    className="loading"
                    id="loading"
                    style={{ display: "flex" }}
                >
                    <div className="spinner"></div>
                    <span>Analyzing image...</span>
                </div>
            )}

            {error && (
                <div className="error" id="error" style={{ display: "block" }}>
                    {error}
                </div>
            )}

            {results && (
                <div
                    className="results-container"
                    id="resultsContainer"
                    style={{ display: "block" }}
                >
                    <div className="result-card">
                        <div
                            className={`prediction ${results.final_result.label.toLowerCase()}`}
                            id="prediction"
                        >
                            {results.final_result.label}
                        </div>
                        <div className="confidence" id="confidence">
                            Confidence:{" "}
                            {(results.final_result.probability * 100).toFixed(
                                1
                            )}
                            %
                        </div>
                        <div className="confidence-bar">
                            <div
                                className={`confidence-fill ${results.final_result.label.toLowerCase()}`}
                                id="confidenceFill"
                                style={{
                                    width: `${
                                        results.final_result.probability * 100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="details" id="details">
                        <h4>Detailed Analysis:</h4>
                        <div id="detailsList">
                            {results.predictions.map((pred) => (
                                <div key={pred.label} className="detail-item">
                                    <span>{pred.label}</span>
                                    <span>
                                        {(pred.probability * 100).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {results && (
                <button
                    className="btn"
                    id="resetBtn"
                    onClick={() => resetClassifier()}
                    style={{ display: "inline-block" }}
                >
                    Classify Another Image
                </button>
            )}
        </div>
    );
}

export default App;
