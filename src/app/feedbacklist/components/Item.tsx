'use client';
import { useState, useEffect } from 'react';
import { Feedback } from '../types';
import { useSession } from 'next-auth/react';
import { FaStar } from 'react-icons/fa';

type ItemProps = {
  feedback: Feedback;
  refreshData: () => void;
};

export const Item = ({ feedback, refreshData }: ItemProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const isOwner = user?.email === feedback.user.email;

  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(feedback.comment);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setRating(feedback.rating || 0);
    setComment(feedback.comment);
  }, [feedback]);

  const handleUpdate = async () => {
    const response = await fetch('/api/feedback', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: comment, id: feedback.id, rating }),
    });

    if (response.ok) {
      setIsEditing(false);
      refreshData();
    }
  };

  const handleDelete = async () => {
    const response = await fetch('/api/feedback', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: feedback.id }),
    });

    if (response.ok) {
      refreshData();
    }
  };

  return (
    <div className="border border-gray-400 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <p className="font-semibold">{feedback.user.name}</p>
        {isOwner && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-blue-500">
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <textarea
          className="w-full border p-2 rounded-md"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      ) : (
        <p className="mt-2 break-words w-full overflow-hidden">
          {feedback.comment}
        </p>
      )}

      {/* {feedback.rating && (
        // <p className="text-sm text-gray-600">Rating: {feedback.rating}</p>
      )} */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            onClick={() => setRating(star)}
            key={star}
            color={star <= rating ? 'yellow' : 'gray'}
          />
        ))}
      </div>

      {isEditing && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Submit
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
