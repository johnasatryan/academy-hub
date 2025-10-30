export interface Module {
  id?: string;
  title: string;
  duration: string;
  topics?: string[];
}

export interface Phase {
  id?: string;
  title: string;
  description?: string;
  modules?: Module[];
}

export interface Syllabus {
  id?: string;
  title: string;
  description?: string;
  instructor?: string;
  duration?: string;
  level?: string;
  category?: string;
  prerequisites?: string;
  resources?: string;
  tags?: string[];
  phases?: Phase[];
  createdAt?: string;
  updatedAt?: string;
}
