[![Next JS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-%23FFCA28.svg?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)](https://axios-http.com/)

# Vérité AI Frontend

Frontend application for **Vérité AI**, a modern deepfake detection platform supporting image, video, and audio analysis with Explainable AI visualizations and AI-generated forensic explanations.

## Related Repositories

- Backend: [Vérité AI Backend](https://github.com/your-username/verite-ai-backend)
- Hugging Face Collection: [Explainable Deepfake Detection](https://huggingface.co/collections/Redgerd/explainable-deepfake-detection)

## Features

- Image, video, and audio upload interface
- Real-time detection status updates
- Interactive Grad-CAM visualizations
- AI-generated forensic explanations
- Detection history dashboard
- Authentication and protected routes
- PDF forensic report downloads
- Responsive modern UI

## Core Pages

### Authentication
- Login and signup
- Firebase authentication
- Protected routes

### Detection Dashboard
- Upload media files
- Track inference progress
- View prediction confidence

### Explainability Viewer
- Grad-CAM overlays
- Forgery localization masks
- Attention visualizations

### Reports
- Download forensic analysis reports
- View historical detections

## System Workflow

```mermaid
flowchart LR

    A[User Uploads Media] --> B[Frontend - Next.js]
    
    B --> C[FastAPI Backend API]

    C --> D1[Image Detection Pipeline]
    C --> D2[Video Detection Pipeline]
    C --> D3[Audio Detection Pipeline]

    D1 --> E[Deep Learning Models]
    D2 --> E
    D3 --> E

    E --> F[Explainable AI Engine]

    F --> G1[Grad-CAM Heatmaps]
    F --> G2[Forgery Localization]
    F --> G3[Temporal Audio Attribution]

    G1 --> H[LLM Explanation Engine]
    G2 --> H
    G3 --> H

    H --> I[Forensic Report Generation]

    I --> J[Frontend Dashboard]

    J --> K1[Prediction Results]
    J --> K2[Confidence Scores]
    J --> K3[AI Explanations]
    J --> K4[Downloadable PDF Reports]
```

## Running Locally

### Clone Repository

```bash
git clone https://github.com/hba777/X-DetectRT-Frontend.git
cd X-DetectRT-Frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

## Research & Thesis

This project was developed as a Final Year Project at National University of Sciences and Technology under the title:

**“Vérité AI: A Deepfake Detection Website with Explainable AI”**

The project was awarded a **Gold Star** in recognition of its technical innovation, research contribution, and practical implementation in the field of AI-driven media forensics.
