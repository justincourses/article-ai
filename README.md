# Article Render

## Introduction

This project is a modern article rendering application with robust authentication powered by Clerk. It allows users to create, view, and manage articles with a clean, responsive interface. The application is built with Next.js App Router for optimal performance and SEO benefits.

Clerk is a developer-first authentication and user management solution. It provides pre-built React components and hooks for sign-in, sign-up, user profile, and organization management. Clerk is designed to be easy to use and customize, and can be dropped into any React or Next.js application.

This application demonstrates features of Clerk such as:

- Fully functional auth flow with sign-in, sign-up, and protected content
- Customized Clerk components with Tailwind CSS
- Hooks for accessing user data and authentication state
- Organizations for multi-tenant applications
- Image optimization with Next.js Image component

## Features

- **Authentication**: Secure user authentication with Clerk
- **Article Management**: Create, edit, and delete articles
- **Responsive Design**: Works on all device sizes
- **Image Optimization**: Efficient image loading and caching
- **SEO Friendly**: Built with Next.js App Router for optimal SEO

## Demo

A hosted demo of this application is available at [https://article-render.vercel.app](https://article-render.vercel.app)

## Deploy

Easily deploy the application to Vercel with the button below. You will need to set the required environment variables in the Vercel dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Farticle-render&env=CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY&envDescription=Your%20Clerk%20application%20keys%2C%20accessible%20from%20dashboard.clerk.com.&envLink=https%3A%2F%2Fgithub.com%2Fyourusername%2Farticle-render%23running-the-application&demo-url=https%3A%2F%2Farticle-render.vercel.app%2F)

## Running the application

```bash
git clone https://github.com/yourusername/article-render
cd article-render
npm install
```

To run the application locally, you need to:

1. Sign up for a Clerk account at [https://clerk.com](https://clerk.com).
2. Go to the [Clerk dashboard](https://dashboard.clerk.com) and create an application.
3. Set the required Clerk environment variables as shown in [the example `.env` file](./.env.example).
4. Go to "Organization Settings" in your sidebar and enable Organizations if needed.
5. `npm install` the required dependencies.
6. `npm run dev` to launch the development server.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Learn more

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Found an issue or have feedback?

If you have found an issue with this repo or have feedback, please open an issue on the [GitHub repository](https://github.com/yourusername/article-render/issues).

If it's a quick fix, such as a misspelled word or a broken link, feel free to create a [pull request](https://github.com/yourusername/article-render/pulls) with the solution. :rocket:

## Connect with us

You can discuss ideas, ask questions, and meet others from the community in our [Discord](https://discord.gg/yourdiscord).

If you prefer, you can also find support through our [Twitter](https://twitter.com/yourusername), or you can [email](mailto:your.email@example.com) us!
