import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Unsplash API endpoint
const UNSPLASH_API_URL = "https://api.unsplash.com";

export async function GET(request: Request) {
  try {
    // Get the search query from URL params
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "10";

    // Authenticate user (basic auth check, but available to all users)
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!query) {
      return new Response("Missing query parameter", { status: 400 });
    }

    // Get Unsplash API key from environment variables
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.error("Missing Unsplash API key");
      return new Response("Server configuration error", { status: 500 });
    }

    // Call Unsplash API to search for photos
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unsplash API error:", errorText);
      return new Response(`Error from Unsplash API: ${response.status}`, { status: response.status });
    }

    const data = await response.json();

    // 添加调试日志
    console.log('Unsplash API response structure:', Object.keys(data));
    console.log('Results array exists:', !!data.results);
    console.log('Results is array:', Array.isArray(data.results));
    console.log('Results length:', data.results?.length);

    if (!data.results || !Array.isArray(data.results)) {
      console.error('Unexpected API response format:', data);
      return new Response("Unexpected API response format", { status: 500 });
    }

    // Transform the response to include only the data we need
    const photos = data.results.map((photo: any) => {
      // 添加调试日志
      if (!photo) {
        console.error('Null or undefined photo in results');
        return null;
      }

      try {
        return {
          id: photo.id,
          url: photo.urls.regular,
          thumb: photo.urls.thumb,
          download: photo.links.download_location, // Required for tracking downloads
          width: photo.width,
          height: photo.height,
          color: photo.color,
          description: photo.description || photo.alt_description || "",
          user: {
            name: photo.user.name,
            username: photo.user.username,
            link: photo.user.links.html,
          },
        };
      } catch (err) {
        console.error('Error processing photo:', err, 'Photo data:', photo);
        return null;
      }
    }).filter(Boolean); // 过滤掉 null 值

    return NextResponse.json({
      success: true,
      photos,
      total: data.total,
      total_pages: data.total_pages,
    });
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return new Response(
      JSON.stringify({
        error: "Error fetching images",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Endpoint to track downloads (required by Unsplash API guidelines)
export async function POST(request: Request) {
  try {
    const { downloadLocation } = await request.json();

    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!downloadLocation) {
      return new Response("Missing downloadLocation parameter", { status: 400 });
    }

    // Get Unsplash API key from environment variables
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.error("Missing Unsplash API key");
      return new Response("Server configuration error", { status: 500 });
    }

    // Trigger download tracking
    const response = await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unsplash download tracking error:", errorText);
      return new Response(`Error from Unsplash API: ${response.status}`, { status: response.status });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error tracking download:", error);
    return new Response(
      JSON.stringify({
        error: "Error tracking download",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
