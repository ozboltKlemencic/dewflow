export async function GET() {
  return new Response("Hello, World! 👋");
}

export async function POST(request: Request) {
  const { name } = await request.json();

  return new Response(`Hello, ${name}! 👋`);
}
