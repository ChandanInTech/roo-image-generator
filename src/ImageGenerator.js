import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      try {
        console.log('generateImage function called');
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'google/gemini-2.5-flash-image-preview:free',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: 'make the uploaded image funny art' },
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
        if (error.response) {
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
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={generateImage} disabled={loading}>
        Generate Image
      </button>
      {loading && <div className="loading-indicator"></div>}
      {imageUrl && !loading && <img src={imageUrl} alt="Generated" />}
    </div>
  );
};

export default ImageGenerator;