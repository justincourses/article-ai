import { NextRequest, NextResponse } from 'next/server';
import { articlePrompts } from '@/constants/prompts';
import { DEFAULT_MODELS } from '@/constants/writer/models';
import { myProvider } from '@/lib/ai/models';
import { systemPrompt } from '@/constants/prompts';

/**
 * This is a unit test endpoint to verify that article data is correctly passed to the model API.
 * It intercepts the prompt construction process and returns the constructed prompt without actually calling the model.
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const {
      id,
      time,
      topic,
      style,
      coreIdeas,
      outline,
      requirements,
      messages,
      length = "medium",
      styleType = "casual",
      wordCount,
    } = await request.json();

    // Determine length based on wordCount if provided
    let contentLength = length;
    if (wordCount) {
      // If wordCount is "mini", use mini length
      if (wordCount === "mini") {
        contentLength = "mini";
      } else {
        // Otherwise try to parse as number
        const count = parseInt(wordCount);
        if (count <= 300) {
          contentLength = "mini";
        } else if (count <= 800) {
          contentLength = "short";
        } else if (count <= 1500) {
          contentLength = "medium";
        } else {
          contentLength = "long";
        }
      }
    }

    // Extract requirements from the message content if not provided directly
    let extractedRequirements = requirements;
    if (!extractedRequirements && messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const content = lastMessage.content;

      // Check if the content contains requirements
      if (content.includes('with requirements:')) {
        extractedRequirements = content.split('with requirements:')[1].trim();
      }
    }

    // Generate the prompt using the prompt utility
    const prompt = articlePrompts.getArticlePrompt({
      time,
      topic,
      style,
      coreIdeas,
      outline,
      requirements: extractedRequirements,
      length: contentLength,
      styleType,
    });

    // Create a message with the prompt
    const promptMessages = [
      {
        id,
        role: "user",
        content: prompt,
      },
    ];

    // Use the article model from constants
    const modelToUse = DEFAULT_MODELS.ARTICLE;

    // Get the system prompt
    const system = systemPrompt({ selectedChatModel: modelToUse });

    // Return the constructed data without actually calling the model
    return NextResponse.json({
      success: true,
      testResults: {
        inputData: {
          id,
          time,
          topic,
          style,
          coreIdeas,
          outline,
          requirements: extractedRequirements,
          messages,
          length: contentLength,
          styleType,
          wordCount,
        },
        constructedData: {
          model: modelToUse,
          system,
          messages: promptMessages,
          maxTokens: 16000,
        },
        prompt: prompt,
        lengthAnalysis: {
          originalLength: length,
          wordCountProvided: wordCount ? true : false,
          wordCountValue: wordCount,
          finalLength: contentLength,
          lengthRequirements: articlePrompts.articleLengthRequirements[contentLength as 'mini' | 'short' | 'medium' | 'long'],
        }
      }
    });
  } catch (error) {
    console.error('Error in article test endpoint:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    }, { status: 500 });
  }
}
