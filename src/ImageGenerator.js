import React, { useState } from "react";//ok
import axios from "axios";
import "./ImageGenerator.css";

const ImageGenerator = () => {
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerateImage = async () => {
        if (!description.trim()) {
            alert("Please enter a description.");
            return;
        }

        setLoading(true);
        setImageUrl(""); // Clear previous image

        try {
            const response = await axios.post("http://localhost:5000/generate-image", { description });
            setImageUrl(response.data.imageUrl);
        } catch (error) {
            console.error("Error generating image:", error);
            alert("Failed to generate image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadImage = async () => {
        if (!imageUrl) return;
    
        try {
            // Fetch the image data as a Blob
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            
            // Create a URL for the Blob and download it
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "generated-image.jpg";
            document.body.appendChild(link);
            link.click();
            
            // Clean up the blob URL after the download
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading image:", error);
            alert("Failed to download image. Please try again.");
        }
    };
    

    return (
        <div className="image-generator-container">
            <h2>Image Generator</h2>
            <textarea
                className="text-box"
                placeholder="Enter a description to generate an image..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button className="btn btn-success" onClick={handleGenerateImage} disabled={loading}>
                {loading ? "Generating..." : "Generate Image"}
            </button>
            {loading && <p>Generating image...</p>}
            {imageUrl && (
                <div className="image-display">
                    <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%", marginTop: "10px" }} />
                    <button className="btn btn-success" onClick={handleDownloadImage}>
                        Download Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;
