export interface Library {
  id: string;
  name: string;
  description: string;
  authorId: string;
  components: string[]; // Component IDs
  tags: string[];
  isPublic: boolean;
  stars: number;
  version: string;
  dependencies: LibraryDependency[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LibraryDependency {
  name: string;
  version: string;
  type: 'required' | 'peer' | 'optional';
}

export interface LibraryStats {
  libraryId: string;
  totalComponents: number;
  totalDownloads: number;
  weeklyDownloads: number;
  monthlyDownloads: number;
  averageRating: number;
}