import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate image using OpenAI
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    // Get the base64 image data
    if (!response.data?.[0]?.b64_json) {
      throw new Error("No image data received from OpenAI");
    }
    const imageData = response.data[0].b64_json;

    // Return the base64 image data
    return NextResponse.json({
      success: true,
      imageData,
    });

  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
} 