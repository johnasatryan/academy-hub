import { Search } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SyllabusCard from '@/components/SyllabusCard';
import { useEffect, useState } from 'react';
import syllabusApi from '@/api/syllabusApi';
import { Syllabus } from '@/api/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Syllabuses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await syllabusApi.getAll();
        setSyllabuses(data);
      } catch (error) {
        console.error('Error fetching syllabuses:', error);
      }
    };
    fetchData();
  }, []);

  const filteredSyllabuses = syllabuses.filter((syllabus) => {
    const matchesSearch =
      syllabus.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      filterLevel === 'all' || syllabus.level.toLowerCase() === filterLevel;
    const matchesCategory =
      filterCategory === 'all' ||
      syllabus.category.toLowerCase() === filterCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className='min-h-screen bg-gradient-subtle'>
      <Navigation />

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8 animate-fade-in'>
          <h1 className='text-4xl font-bold mb-2'>Syllabuses Library</h1>
          <p className='text-muted-foreground text-lg'>
            Browse and manage all course syllabuses
          </p>
        </div>

        <div className='mb-8 space-y-4 animate-slide-up'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by title or instructor...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className='w-full md:w-[180px]'>
                <SelectValue placeholder='Filter by level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Levels</SelectItem>
                <SelectItem value='beginner'>Beginner</SelectItem>
                <SelectItem value='intermediate'>Intermediate</SelectItem>
                <SelectItem value='advanced'>Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className='w-full md:w-[180px]'>
                <SelectValue placeholder='Filter by category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='academy2_0'>Academy 2.0</SelectItem>
                <SelectItem value='engineering'>Engineering</SelectItem>
                <SelectItem value='design'>Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className='text-sm text-muted-foreground'>
            Showing {filteredSyllabuses.length} of {syllabuses.length}{' '}
            syllabuses
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredSyllabuses.map((syllabus) => (
            <SyllabusCard
              key={syllabus.id}
              id={syllabus.id!}
              title={syllabus.title}
              description={syllabus.description}
              instructor={syllabus.instructor}
              duration={syllabus.duration}
              level={syllabus.level}
              category={syllabus.category}
              prerequisites={syllabus.prerequisites}
              resources={syllabus.resources}
              tags={syllabus.tags}
              phases={syllabus.phases}
            />
          ))}
        </div>

        {filteredSyllabuses.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-muted-foreground text-lg'>
              No syllabuses found matching your criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Syllabuses;
