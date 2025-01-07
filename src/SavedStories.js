import React, { useEffect, useState, useContext } from 'react';//ok
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoryContext } from './StoryContext';
import './SavedStories.css';

const SavedStories = ({ user }) => {
    const [stories, setStories] = useState([]);
    const { setSelectedStory } = useContext(StoryContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get-stories?email=${user.email}`);
                setStories(response.data.stories);
            } catch (error) {
                console.error("Error fetching stories:", error);
            }
        };

        if (user && user.email) {
            fetchStories();
        }
    }, [user]);

    const handleStoryClick = (story) => {
        setSelectedStory(story);
        navigate('/');
    };

    const handleDeleteStory = async (story) => {
        try {
            await axios.delete('http://localhost:5000/delete-story', {
                data: { email: user.email, title: story.title, content: story.content }
            });
            setStories(stories.filter((s) => s.title !== story.title || s.content !== story.content));
            alert("Story deleted successfully!");
        } catch (error) {
            console.error("Error deleting story:", error);
            alert("Failed to delete story. Please try again.");
        }
    };

    return (
        <div className="saved-stories-container">
            <h2>{user.username}'s Saved Stories</h2>
            {stories.length === 0 ? (
                <p>No stories saved yet.</p>
            ) : (
                stories.map((story, index) => (
                    <div key={index} className="story-card">
                        <p onClick={() => handleStoryClick(story)} style={{ cursor: 'pointer' }}>
                            {story.title}
                        </p>
                        <button onClick={() => handleDeleteStory(story)} className="delete-button">
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default SavedStories;
