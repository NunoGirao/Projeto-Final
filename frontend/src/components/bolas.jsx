import React, { useState, useEffect } from 'react';

const ImageBalls = ({ balls }) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [clickedIndex, setClickedIndex] = useState(-1);

  const handleMouseEnter = (index) => {
    if (clickedIndex === -1) { // Only allow hover if no ball is clicked
      setHoverIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (clickedIndex === -1) { // Keep hover state if a ball is clicked
      setHoverIndex(-1);
    }
  };

  const handleClick = (index) => {
    setClickedIndex(clickedIndex === index ? -1 : index);
  };

  // Setup the listener for clicks outside the balls
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.ball')) {
        setClickedIndex(-1);
        setHoverIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full h-96 mx-auto bg-white">
        {balls.map((ball, index) => (
          <div
            key={index}
            className="ball absolute rounded-full bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: `url(${ball.url})`,
              width: hoverIndex === index || clickedIndex === index ? `${ball.size * 1.2}px` : `${ball.size}px`,
              height: hoverIndex === index || clickedIndex === index ? `${ball.size * 1.2}px` : `${ball.size}px`,
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.3s ease-in-out',
              overflow: 'hidden'
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            {clickedIndex === index && (
              <div
                className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center text-white p-3"
                style={{
                  transition: 'opacity 0.3s ease-in-out',
                  opacity: clickedIndex === index ? 1 : 0
                }}
              >
                <h2>{ball.title}</h2>
                <p>{ball.description}</p>
                <div>
                <button className="bg-green-500 text-white p-2 m-1 rounded" onClick={() => alert('Compra efetuada!')}>Comprar</button>
                <button className="bg-orange-500 text-white p-2 m-1 rounded" onClick={() => alert('Mais informações aqui!')}>Mais Info</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageBalls;
