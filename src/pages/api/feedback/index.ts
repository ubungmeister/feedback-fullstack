/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Zod schema for validation
const feedbackSchema = z.object({
  feedback: z.string().min(1, 'Feedback cannot be empty'),
  rating: z.number().int().min(1).max(5).optional(),
});

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Incoming request:', req.method);

    // Only check session for protected methods
    let session = null;
    if (['POST', 'PUT', 'DELETE'].includes(req.method!)) {
      session = await getServerSession(req, res, authOptions);
      console.log('Session in API:', session);
      if (!session) {
        console.log('Unauthorized request - session is null');
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }

    switch (req.method) {
      case 'GET':
        return await handleGetAll(req, res);
      case 'POST':
        return await handlePost(req, res, session);
      case 'PUT':
        return await handleUpdate(req, res, session);
      case 'DELETE':
        return await handleDelete(req, res, session);
      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Handler Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) => {
  try {
    const parsedData = feedbackSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors });
    }

    const { feedback, rating } = parsedData.data;

    const createdFeedback = await prisma.feedback.create({
      data: {
        comment: feedback,
        rating: rating ?? null, // If rating is not provided, set to null
        userId: session.user.id,
      },
    });

    return res.status(201).json(createdFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const handleGetAll = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('there? ');
  try {
    console.log('here eee');
    const feedback = await prisma.feedback.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(feedback);
  } catch (error) {
    console.error('GET Error:', error);
    return res.status(500).json({ content: 'Internal Server Error' });
  }
};

const handleUpdate = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) => {
  try {
    const { feedback, rating, id } = req.body;

    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: id as string },
    });

    if (!existingFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    console.log('existingFeedback', existingFeedback, session);
    if (existingFeedback.userId !== session.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot delete someone else's feedback" });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id: id as string },
      data: {
        comment: feedback,
        rating: rating ?? null, // If rating is not provided, set to null
      },
    });

    return res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const handleDelete = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) => {
  try {
    const { id } = req.body;
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: id as string },
    });
    console.log('existingFeedback', existingFeedback, session);

    if (!existingFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (existingFeedback.userId !== session.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot delete someone else's feedback" });
    }

    await prisma.feedback.delete({
      where: { id: id as string },
    });

    return res.status(200).json({ message: 'Feedback deleted' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
