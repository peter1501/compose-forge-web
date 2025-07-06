export interface ComponentDTO {
  id: string;
  name: string;
  description: string;
  code: string;
  previewUrl?: string;
  screenshots?: string[];
  tags: string[];
  category: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  stats: {
    downloads: number;
    likes: number;
    rating: number;
    totalRatings: number;
  };
  material3Compliant: boolean;
  accessibilityScore: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentSearchResultDTO {
  components: ComponentDTO[];
  totalCount: number;
  hasMore: boolean;
}

export interface ComponentPreviewRequestDTO {
  componentId: string;
  theme?: 'light' | 'dark';
  width?: number;
  height?: number;
}

export interface ComponentGenerationRequestDTO {
  description: string;
  category?: string;
  material3Required?: boolean;
  includeAccessibility?: boolean;
  targetWcagLevel?: 'A' | 'AA' | 'AAA';
}