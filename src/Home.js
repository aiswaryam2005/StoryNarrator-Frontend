import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoryContext } from './StoryContext';
import { jsPDF } from 'jspdf';
import './Home.css';

const Home = ({ user }) => {
    const [story, setStory] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHearingWithVisuals, setIsHearingWithVisuals] = useState(false);
    const [lineImagePairs, setLineImagePairs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { selectedStory, setSelectedStory } = useContext(StoryContext);
    const [savedStories, setSavedStories] = useState([]);
    const [currentLine, setCurrentLine] = useState(0);
    const [showSaveStoryModal, setShowSaveStoryModal] = useState(false);
    const [showPDFTitleModal, setShowPDFTitleModal] = useState(false);
    const [storyTitle, setStoryTitle] = useState('');
    const [pdfTitle, setPdfTitle] = useState('');
    const [pdfReady, setPdfReady] = useState(false);

    useEffect(() => {
        if (selectedStory) {
            setStory(selectedStory.content);
            setSelectedStory(null);
        }
    }, [selectedStory, setSelectedStory]);

    useEffect(() => {
        const fetchSavedStories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get-stories?email=${user.email}`);
                setSavedStories(response.data.stories);
            } catch (error) {
                console.error("Error fetching saved stories:", error);
            }
        };

        if (user && user.email) {
            fetchSavedStories();
        }
    }, [user]);

    const generateImagesForStory = async (storyText) => {
        setLoading(true);
        const lines = storyText.split('.');
        const pairs = [];

        for (const line of lines) {
            if (line.trim()) {
                try {
                    const response = await axios.post('http://localhost:5000/generate-image', { description: line });
                    pairs.push({ line: line.trim(), imageUrl: response.data.imageUrl || '' });
                } catch (error) {
                    console.error('Error generating image for line:', error);
                    pairs.push({ line: line.trim(), imageUrl: '' });
                }
            }
        }

        setLineImagePairs(pairs);
        setLoading(false);
        setPdfReady(true); // Show the PDF download button once images are generated
    };

    const playLine = async (lineIndex) => {
        const lines = story.split('.');
        if (lineIndex >= lines.length || !lines[lineIndex].trim()) {
            setIsPlaying(false);
            setCurrentLine(0);
            return;
        }

        const line = lines[lineIndex].trim();
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.onend = () => {
            setCurrentLine((prevLine) => prevLine + 1);
        };

        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (isPlaying && currentLine < story.split('.').length) {
            playLine(currentLine);
        }
    }, [isPlaying, currentLine]);

    const startNarration = async (withVisuals) => {
        if (!story) {
            alert("Please write a story before starting.");
            return;
        }

        if (withVisuals) {
            setIsHearingWithVisuals(true);
            await generateImagesForStory(story);
        } else {
            setIsHearingWithVisuals(false);
        }

        setIsPlaying(true);
        setCurrentLine(0);
    };

    const stopNarration = () => {
        setIsPlaying(false);
        setCurrentLine(0);
        speechSynthesis.cancel();
    };

    const handleButtonClick = (withVisuals) => {
        if (isPlaying) {
            stopNarration();
        } else {
            startNarration(withVisuals);
        }
    };

    const handleSaveStory = () => {
        if (!story.trim()) {
            alert("Please type the story content before saving.");
            return;
        }
        setShowSaveStoryModal(true);
    };

    const handleSaveStoryInModal = async () => {
        if (!storyTitle) {
            alert("Please provide a title for the story.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/save-story', {
                email: user.email,
                title: storyTitle,
                content: story,
            });
            alert(response.data.message || "Story saved successfully!");
            setSavedStories([...savedStories, { title: storyTitle, content: story }]);
            setStory('');
            setStoryTitle('');
            setShowSaveStoryModal(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to save story. Please try again.";
            alert(errorMessage);
        }
    };

    const downloadPDF = () => {
        setShowPDFTitleModal(true); // Show PDF title modal before generating PDF
    };

    const generatePDF = () => {
        if (!pdfTitle) {
            alert("Title is required to generate the PDF.");
            return;
        }

        const doc = new jsPDF();
        doc.setFont("Times", "normal");

        // Title in the center of the first page
        doc.setFontSize(30); // h6 font size approximation
        doc.text(pdfTitle, 105, 50, { align: 'center' });

        // Create a new page for the story content
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Story", 10, 20);
        doc.text(story, 10, 30, { maxWidth: 190 });

        // Visuals Section
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Visuals of the Story", 10, 20);
        lineImagePairs.forEach((pair, index) => {
            const yPos = 30 + index * 60;
            if (yPos + 50 > 280) doc.addPage();  // New page if content overflows

            doc.setFontSize(14);
            doc.text(pair.line, 10, yPos);

            if (pair.imageUrl) {
                doc.addImage(pair.imageUrl, 'JPEG', 10, yPos + 10, 50, 50);
            }
            // Leave space after image to avoid overlap
            doc.setFontSize(12);
            doc.text(" ", 10, yPos + 60);
        });

        doc.save(`${pdfTitle}.pdf`);
        setShowPDFTitleModal(false); // Close the PDF title modal after saving
    };

    return (
        <div className="home-container">
            <h2>Welcome {user?.username || ""}!</h2>
            <textarea
                className="text-box"
                placeholder="Type your story here..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
            ></textarea>
            <div className="button-container">
                <button type="button" className="btn btn-success" onClick={() => handleButtonClick(true)}>
                    {isPlaying && isHearingWithVisuals ? "Stop" : "Start Hearing with Visuals"}
                </button>
                <button type="button" className="btn btn-success" onClick={() => handleButtonClick(false)}>
                    {isPlaying && !isHearingWithVisuals ? "Stop" : "Start Hearing without Visuals"}
                </button>
                <button type="button" className="btn btn-success" onClick={handleSaveStory}>
                    Save Story
                </button>
            </div>

            {showSaveStoryModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Enter Story Title</h3>
                        <input
                            type="text"
                            placeholder="Story Title"
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button className="btn btn-success" onClick={handleSaveStoryInModal}>
                                Save Story
                            </button>
                            <button className="btn btn-danger" onClick={() => setShowSaveStoryModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPDFTitleModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Enter PDF Title</h3>
                        <input
                            type="text"
                            placeholder="PDF Title"
                            value={pdfTitle}
                            onChange={(e) => setPdfTitle(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button className="btn btn-success" onClick={generatePDF}>
                                Generate PDF
                            </button>
                            <button className="btn btn-danger" onClick={() => setShowPDFTitleModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isHearingWithVisuals && (
                <div id="visuals">
                    {loading ? (
                        <p>Generating images...</p>
                    ) : (
                        lineImagePairs.map((pair, index) => (
                            <div key={index}>
                                <p>{pair.line}</p>
                                {pair.imageUrl && (
                                    <img src={pair.imageUrl} alt={`Generated for line ${index}`} style={{ width: '100%', marginBottom: '20px' }} />
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {pdfReady && (
                <button type="button" className="btn btn-primary" onClick={downloadPDF}>
                    Download PDF
                </button>
            )}
        </div>
    );
};

export default Home;
