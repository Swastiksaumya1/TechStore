import React from 'react';

const SkeletonLoader = ({ count = 1, height = "h-48", className = "" }) => {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div 
          key={index} 
          className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg ${height} ${className}`}
        ></div>
      ))}
    </>
  );
};

export default SkeletonLoader;
