import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const limit = parseInt(searchParams.get('limit') || '20');

    let results;

    if (query) {
      // Full-text search
      results = await sql`
        SELECT id, category, subcategory, title, content, tags, source
        FROM "FiveStarKnowledge"
        WHERE
          title ILIKE ${'%' + query + '%'}
          OR category ILIKE ${'%' + query + '%'}
          OR content::text ILIKE ${'%' + query + '%'}
        ORDER BY
          CASE WHEN title ILIKE ${'%' + query + '%'} THEN 1 ELSE 2 END,
          category
        LIMIT ${limit}
      `;
    } else if (category) {
      // Filter by category
      results = await sql`
        SELECT id, category, subcategory, title, content, tags, source
        FROM "FiveStarKnowledge"
        WHERE category = ${category}
        ORDER BY subcategory, title
        LIMIT ${limit}
      `;
    } else if (tags) {
      // Filter by tags
      const tagArray = tags.split(',');
      results = await sql`
        SELECT id, category, subcategory, title, content, tags, source
        FROM "FiveStarKnowledge"
        WHERE tags && ${tagArray}
        ORDER BY category, title
        LIMIT ${limit}
      `;
    } else {
      // Return all categories summary
      results = await sql`
        SELECT id, category, subcategory, title, content, tags, source
        FROM "FiveStarKnowledge"
        ORDER BY category, subcategory, title
        LIMIT ${limit}
      `;
    }

    return NextResponse.json({
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Knowledge search error:', error);
    return NextResponse.json({ error: 'Failed to search knowledge base' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, category, subcategory, title, content, tags, source, source_url } = body;

    await sql`
      INSERT INTO "FiveStarKnowledge" (id, category, subcategory, title, content, tags, source, source_url)
      VALUES (${id}, ${category}, ${subcategory}, ${title}, ${JSON.stringify(content)}, ${tags}, ${source}, ${source_url})
      ON CONFLICT (id) DO UPDATE SET
        category = EXCLUDED.category,
        subcategory = EXCLUDED.subcategory,
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        tags = EXCLUDED.tags,
        source = EXCLUDED.source,
        source_url = EXCLUDED.source_url,
        "updatedAt" = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Knowledge insert error:', error);
    return NextResponse.json({ error: 'Failed to insert knowledge' }, { status: 500 });
  }
}
