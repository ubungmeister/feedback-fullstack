'use client';
import { Feedback } from '../types';
import { Item } from './Item';
import Link from 'next/link';
type ListProps = {
  data: Feedback[];
  refreshData: () => void;
};

export const List = ({ data, refreshData }: ListProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-xl font-semibold mb-2">Reviews:</h1>

      <div className="w-full max-w-sm md:max-w-lg h-[400px] overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-1">
        {data.map((feedback) => (
          <Item
            key={feedback.id}
            feedback={feedback}
            refreshData={refreshData}
          />
        ))}
      </div>

      <div className="w-full max-w-sm md:max-w-lg mt-4 flex justify-end">
        <button className="text-white bg-blue-500 rounded  ">
          <Link className="auth-button" href={`/feedback`}>
            Add your feedback
          </Link>
        </button>
      </div>
    </div>
  );
};
