import React from 'react';

interface ReviewCardProps {
  userName: string;
  rating: number;
  date: string;
  content: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ userName, rating, date, content }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center mb-2">
        <div className="font-semibold text-gray-800">{userName}</div>
        <div className="ml-auto text-yellow-500">
          {'⭐'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2">{date}</div>
      <p className="text-gray-700">{content}</p>
    </div>
  );
}; 