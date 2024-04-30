'use client'
import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const IMG_SIZE = 200;

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(imageFile));
  };

  const classifyImage = async () => {
    const imageElement = document.createElement('img');
    imageElement.src = selectedImage;
    await tf.ready();
    const model = await tf.loadGraphModel('http://127.0.0.1:8080/model.json');
    // const model = await tf.loadGraphModel('https://raw.githubusercontent.com/nrosto/classification/main/frontend/model/model_2_classes/model.json');

    const inputTensor = await tf.browser.fromPixels(imageElement, 3)
      .resizeNearestNeighbor([IMG_SIZE, IMG_SIZE])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();
    
    console.log(inputTensor)

    const result = await model.predict(inputTensor);
    const predictions = result.dataSync();
    
    const probabilityClass1 = predictions[0];
    const probabilityClass2 = predictions[1];

    setPrediction({ class1: probabilityClass1, class2: probabilityClass2 });
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
        <button onClick={classifyImage}>Классифицировать</button>
        {prediction && (
            <div className='Prediction'>
                <h2>Результат классификации:</h2>
                <p>Надмолекулярная структура: {prediction.class1}</p>
                <p>Поверхность трения: {prediction.class2}</p>
            </div>
        )}
      </div>
    </div>
  );
}