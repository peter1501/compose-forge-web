export interface Component {
  id: string;
  name: string;
  description: string;
  code: string;
  previewCode?: string;
  tags: string[];
  category: string;
  authorId: string;
  downloads: number;
  likes: number;
  version: string;
  dependencies: string[];
  material3Compliant: boolean;
  accessibility: AccessibilityInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessibilityInfo {
  score: number;
  issues: string[];
  wcagLevel: 'A' | 'AA' | 'AAA' | 'None';
}

export interface ComponentPreview {
  componentId: string;
  previewUrl: string;
  screenshots: string[];
  lastGeneratedAt: Date;
}

export interface ComponentMetrics {
  componentId: string;
  weeklyDownloads: number;
  monthlyDownloads: number;
  totalDownloads: number;
  averageRating: number;
  totalRatings: number;
}