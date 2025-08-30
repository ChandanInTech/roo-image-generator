import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [style, setStyle] = useState('Weird (Default)');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const generateImage = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);
    setImageUrl('');
    setErrorMessage('');

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      try {
        console.log('generateImage function called');
        const prompt = style === 'Weird (Default)' ? 'make the uploaded image funny art' : `${style} style funny art`;
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'google/gemini-2.5-flash-image-preview:free',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image}`
                    }
                  }
                ]
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_KEY}`
            }
          }
        );
        console.log('OpenRouter API response:', response);
        const imageUrl = response.data.choices[0].message.images[0].image_url.url;
        setImageUrl(imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
        if (error.response && error.response.data && error.response.data.choices && error.response.data.choices[0].finish_reason === 'content_filter') {
          setErrorMessage('Oops! The kangaroo was too weird for filters! Try again for more kangaroo chaos.');
        } else if (error.response) {
          console.error('Error response:', error.response);
        }
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setLoading(false);
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '0px', marginTop: '0px' }}>
        <h1 style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif', color: 'purple', marginTop: '0px' }}>
          Behold! The Weird Kangaroo Generator!
        </h1>
        <div style={{ marginTop: '-20px' }}>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={{
              fontFamily: 'Comic Sans MS, cursive, sans-serif',
              fontSize: '18px',
              backgroundColor: '#90EE90',
              color: '#8B0000',
              padding: '10px',
              border: '3px dashed #FF69B4',
              borderRadius: '15px',
              margin: '10px',
              boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
          >
            <option value="Funny (Default)">🎈 Funny (Default)</option>
            <option value="Cartoon Funky">🎭 Cartoon Funky</option>
            <option value="Neon Glow">💡 Neon Glow</option>
            <option value="Vintage Retro">📸 Vintage Retro</option>
            <option value="Minimalist">🖼️ Minimalist</option>
            <option value="Add A Mustache">🧔 Add A Mustache</option>
          </select>
          <input
            type="file"
            onChange={handleImageChange}
            style={{
              fontFamily: 'Comic Sans MS, cursive, sans-serif',
              fontSize: '16px',
              backgroundColor: '#FFFFE0',
              color: '#8B008B',
              padding: '8px',
              border: '3px solid #FFD700',
              borderRadius: '10px',
              margin: '10px',
              cursor: 'pointer'
            }}
          />
          <button
            onClick={generateImage}
            disabled={loading}
            style={{
              fontSize: '30px',
              fontFamily: 'Comic Sans MS, cursive, sans-serif',
              backgroundColor: '#FFD700',
              color: 'black',
              padding: '20px 40px',
              border: '4px dotted magenta',
              borderRadius: '40px',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              textShadow: '2px 2px 5px rgba(255,255,255,0.5)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🎉 Create 🐾
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', overflow: 'hidden' }}>
        {loading && (
          <div className="loading-container">
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className="bubble"></div>
            ))}
          </div>
        )}
        {!imageUrl && !loading && !errorMessage && <p>Awaiting the majestic weirdness...</p>}
        {errorMessage && !loading && (
          <p style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif', color: 'purple' }}>
            {errorMessage}
          </p>
        )}
        {imageUrl && !loading && <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
      </div>
    </div>
  );
};

export default ImageGenerator;