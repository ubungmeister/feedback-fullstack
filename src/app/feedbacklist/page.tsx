'use client';
import React, { useState, useEffect } from 'react';
import { List } from './components/List';
import { Feedback } from './types';

const fetchData = async () => {
  const response = await fetch('/api/feedback');
  if (!response.ok) throw new Error('Failed to fetch feedbacks');
  return response.json();
};

export default function FeedbackList() {
  const [data, setData] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const updatedData = await fetchData();
      setData(updatedData);
    } catch (error) {
      console.error('Error refreshing feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) return <p>Loading feedbacks...</p>;

  return (
    <div>
      <List data={data} refreshData={refreshData} />
    </div>
  );
}
