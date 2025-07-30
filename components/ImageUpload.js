'use client';

import { useState, useRef } from 'react';

const ImageUpload = ({ onImageSelect, currentImage }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!currentImage ? (
        <div
          className={`border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragOver 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Upload Your Image</h3>
          <p className="text-gray-500 mb-4">
            Drag and drop an image here, or click to browse
          </p>
          <p className="text-sm text-gray-400">
            Supports JPG, PNG, GIF formats
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <img 
              src={currentImage} 
              alt="Selected puzzle image" 
              className="w-32 h-32 object-cover rounded-lg border-4 border-purple-300 mx-auto"
            />
          </div>
          <button
            onClick={handleClick}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors"
          >
            📸 Choose Different Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;