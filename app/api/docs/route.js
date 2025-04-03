import { swaggerSpec, swaggerUi } from '@/lib/swagger';
import { NextResponse } from 'next/server';

export async function GET(req) {
  // Serve the Swagger JSON specification for Swagger UI
  if (req.url.includes('/swagger.json')) {
    return NextResponse.json(swaggerSpec);
  }

  // Otherwise, return the Swagger UI HTML
  const html = swaggerUi.generateHTML(swaggerSpec);
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' }, // Set content type for Swagger UI
  });
}
