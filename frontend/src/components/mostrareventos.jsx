import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';

const MostrarEventos = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleItems = 5;  // Adjust this depending on the number of items you want visible at a time

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < items.length - visibleItems ? prev + 1 : prev));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    };

    return (
        <div className="relative overflow-hidden mt-10 w-4/5 mx-auto">
            <div className="text-2xl text-white font-bold mb-3 flex items-center justify-between">
                <button className='flex justify-between bg-red-600' style={{width:'1200px'}}>
                    <div className=' ml-2'>TEATRO & ARTE</div>
                    <div className='mr-2 hover:underline'>Ver Mais</div>
                </button>
                <div className="flex items-center"> {/* Container for arrows */}
                    <button onClick={handlePrev} className="bg-red-600 text-white mr-4 ml-2" style={{height:'32px'}}>
                        <BsChevronCompactLeft className="text-3xl" />
                    </button>
                    {currentIndex < items.length && (
                        <button onClick={handleNext} className="bg-red-600 text-white mr-2" style={{height:'32px'}}>
                            <BsChevronCompactRight className="text-3xl" />
                        </button>
                    )}
                </div>
                <div className='bg-red-600 ' style={{width:'100px', height:'32px'}}>

                </div>
            </div>
            
            <div className="flex overflow-hidden relative" style={{ width: '100%' }}>
                <div className="flex transition-transform duration-300" 
                         style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}>
                    {items.map((item, index) => (
                        <div key={index} className="min-w-[20%] p-1">
                            <div className="shadow-lg  overflow-hidden">
                                <img src={item.url} alt={item.title} className="w-full h-auto object-cover" />
                                <p className="text-sm p-2 text-center">{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MostrarEventos;
