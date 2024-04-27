'use client'
import { useState } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(imageFile));
  };

  return (
    <div className="container">
      <div className="imageColumn">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {selectedImage && (
          <div className='Image'>
            <h2>Выбранное изображение:</h2>
            <img src={selectedImage} alt="Selected" />
          </div>
        )}
      </div>
      <div className="textColumn">
        <h2>Проверка</h2>
        <p>Привет мир!</p>
      </div>
    </div>
  );
} 