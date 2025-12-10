export interface Module {
  id?: string;
  title: string;
  duration?: string;
  topics?: string[];
  tasks?: string[];
}

export interface Phase {
  id?: string;
  title: string;
  description?: string;
  instructor?: string;
  duration?: number;
  prerequisites?: string;

  modules?: Module[];
}

export interface Syllabus {
  id?: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  resources?: string;
  tags?: string[];
  tasks?: string[];
  phases?: Phase[];
  createdAt?: string;
  updatedAt?: string;
}
