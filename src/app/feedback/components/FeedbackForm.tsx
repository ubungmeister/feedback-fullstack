'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

export const FeedbackForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedFeedback = localStorage.getItem('feedback');
    if (storedFeedback) {
      setFeedback(storedFeedback);
    }
  }, []);

  const onInputChange = (value: string) => {
    setFeedback(value);
    localStorage.setItem('feedback', value);
  };

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!session) {
      setShowPopUp(true);
      setLoading(false);
      return;
    }
    try {
      console.log('Submitting feedback:', feedback, rating);
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedback, rating }),
      });

      if (!response.ok) {
        toast.error('Check your feedback and rating');
        throw new Error('Something went wrong');
      }
      setFeedback('');
      setRating(0);
      localStorage.removeItem('feedback');
      toast.success('Feedback submitted successfully');
      router.push('/feedbacklist');
    } catch (error) {
      console.log('error', error);
    }
    setLoading(false);
  };

  return (
    <div className="w-[400px] mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Feedback</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <textarea
          placeholder="Leave your feedback here"
          rows={5}
          value={feedback}
          onChange={(e) => onInputChange(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              onClick={() => setRating(star)}
              key={star}
              color={star <= (rating ?? 0) ? 'yellow' : 'gray'}
            />
          ))}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>

      {showPopUp && (
        <div className="mt-4 bg-gray-200 p-4 rounded-md">
          <p>You need to be signed in to leave feedback</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/signin"
              className="text-blue-600   hover:text-blue-800 "
            >
              Sign in
            </Link>
            <button
              onClick={() => setShowPopUp(false)}
              className="text-red-600  hover:text-red-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
