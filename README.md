# Text Digest Backend

Frontend for Text Digest API, deployed on AWS Amplify.

## Core Dependencies

- **Nextjs 15.5**
- **Tailwind 4.0**
- **Shadcn UI**

## Prerequisites

Install the following:

- **Node.js**
- **npm**

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

The front end will be available at `http://localhost:3000`

## Project Structure

```
root/
├── tests/
├── src/
│   │
│   ├── app/                        # Next.js app router pages and layouts
│   │   └── [page]
│   │
│   ├── hooks/                      # Custom React hooks + internal context providers for state management
│   │
│   ├── components/
│   │    ├── ui/                    # Shadcn installed UI components
│   │    ├── custom/                # Non-shadcn custom & resuable components
│   │    └── providers/             # External (installed) context providers
│   │
│   ├── lib/                        # Resuable logic
│   │
│   └── config/                     # Configuration files and constants


```
