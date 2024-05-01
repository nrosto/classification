'use client'

import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [model1, setModel1] = useState(null);
  const [model2, setModel2] = useState(null);
  const IMG_SIZE = 200;

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel1 = await tf.loadGraphModel('http://127.0.0.1:8080/model_2_classes/model.json');
        const loadedModel2 = await tf.loadGraphModel('http://127.0.0.1:8080/model_4_classes/model.json');
        // const loadmodel1 = await tf.loadGraphModel('https://raw.githubusercontent.com/nrosto/classification/main/frontend/model/model_2_classes/model.json');
        // const loadmodel2 = await tf.loadGraphModel('https://raw.githubusercontent.com/nrosto/classification/main/frontend/model/model_4_classes/model.json');
        setModel1(loadedModel1);
        setModel2(loadedModel2);
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    }
    loadModel();
  }, []);

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(imageFile));
  };

  const classifyImage = async (numClasses) => {
    if ((numClasses === 2 && !model1) || (numClasses === 4 && !model2)) {
      console.error('Model not loaded');
      return;
    }

    const imageElement = document.createElement('img');
    imageElement.src = selectedImage;

    const inputTensor = await tf.browser.fromPixels(imageElement, 3)
      .resizeNearestNeighbor([IMG_SIZE, IMG_SIZE])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();

      let result;
      if (numClasses === 2) {
        result = await model1.predict(inputTensor);
      } else {
        result = await model2.predict(inputTensor);
      }
    const predictions = result.dataSync();
    
    const formattedPredictions = predictions.map(probability => probability.toFixed(2));
    setPrediction(formattedPredictions);
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
        <button onClick={() => classifyImage(2)}>Классифицировать на 2 вида</button>
        <button onClick={() => classifyImage(4)}>Классифицировать на 4 вида</button>
        {prediction && (
          <div className='Prediction'>
            <h2>Результат классификации:</h2>
            {prediction.length === 2 &&
            (
              <div>
                <p>Надмолекулярная структура: {prediction[0]}</p>
                <p>Поверхность трения: {prediction[1]}</p>
              </div>
            )
            }
            {prediction.length === 4 && 
            (
              <div>
                <p>ПТФЭ Надмолекулярная: {prediction[0]}</p>
                <p>СВМПЭ Поверхности: {prediction[1]}</p>
                <p>ПТФЭ Поверхности: {prediction[2]}</p>
                <p>СВМПЭ Надмолекулярная: {prediction[3]}</p>
              </div>
            )
            }
          </div>
        )}
      </div>
    </div>
  );
}