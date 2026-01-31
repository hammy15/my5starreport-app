import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const categories = await sql`
      SELECT
        category,
        COUNT(*) as article_count,
        array_agg(DISTINCT subcategory) FILTER (WHERE subcategory IS NOT NULL) as subcategories
      FROM "FiveStarKnowledge"
      GROUP BY category
      ORDER BY category
    `;

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
