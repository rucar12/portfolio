# Portfolio

Personal portfolio website with dynamic content managed through Strapi CMS.

## About

This is a personal portfolio site that displays work experience, technologies, and skills. Content is managed through Strapi CMS, allowing updates without code changes.

The site consists of several sections:

- Welcome section with brief description and profile photo
- Work experience with details about previous positions
- Technologies with years of experience
- PDF resume download functionality

## Tech Stack

- **Next.js 14** with App Router and static generation
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Strapi CMS** as headless CMS for content management
- **jsPDF** for PDF CV export

## Architecture

The project uses Next.js App Router. Data is fetched from Strapi at build time or through ISR (Incremental Static Regeneration). Content updates via webhook revalidation when changes are made in Strapi.

Components are organized into UI elements and page sections. Theme (light/dark) is managed through ThemeProvider with support for system preferences.
