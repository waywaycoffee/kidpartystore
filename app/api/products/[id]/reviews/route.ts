/**
 * Product Reviews API
 * GET: Get reviews for a product
 * POST: Submit a new review
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

async function getReviews(): Promise<Review[]> {
  try {
    await ensureDataDir();
    await fs.access(REVIEWS_FILE);
    const data = await fs.readFile(REVIEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveReviews(reviews: Review[]) {
  await ensureDataDir();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await getReviews();
    const productReviews = reviews.filter(
      (review) => review.productId === params.id && review.status === 'approved'
    );

    // Calculate average rating
    const averageRating =
      productReviews.length > 0
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
          productReviews.length
        : 0;

    // Rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: productReviews.filter((r) => r.rating === rating).length,
    }));

    return NextResponse.json({
      reviews: productReviews.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: productReviews.length,
      ratingDistribution,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userName, userEmail, rating, title, comment, images, verifiedPurchase } = body;

    // Validation
    if (!userName || !userEmail || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const reviews = await getReviews();

    // Check if user already reviewed this product
    const existingReview = reviews.find(
      (r) => r.productId === params.id && r.userEmail === userEmail
    );

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create new review
    const newReview: Review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      productId: params.id,
      userName,
      userEmail,
      rating: parseInt(rating),
      title: title || '',
      comment,
      images: images || [],
      verifiedPurchase: verifiedPurchase || false,
      helpful: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending', // Require admin approval
    };

    reviews.push(newReview);
    await saveReviews(reviews);

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Review submitted successfully. It will be published after approval.',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

