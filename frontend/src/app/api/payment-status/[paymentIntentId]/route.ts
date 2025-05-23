import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { paymentIntentId: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment-status/${params.paymentIntentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error checking payment status' },
      { status: 500 }
    );
  }
} 