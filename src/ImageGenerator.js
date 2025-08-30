import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl('');
    try {
      console.log('generateImage function called');
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'google/gemini-2.5-flash-image-preview:free',
          messages: [
            { role: 'user', content: 'Generate a weird image of a kangaroo' }
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

  return (
    <div>
      <button onClick={generateImage} disabled={loading}>
        Generate Image
      </button>
      {loading && <div>Loading...</div>}
      {imageUrl && !loading && <img src={imageUrl} alt="Generated" />}
    </div>
  );
};

export default ImageGenerator;