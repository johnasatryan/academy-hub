import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Module, Phase } from '@/api/types';

interface SyllabusCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  prerequisites?: string;
  resources?: string;
  tags?: string[];
  category: string;
  phases?: Phase[];
  modules?: Module[];
}

const SyllabusCard = ({
  id,
  title,
  description,
  instructor,
  duration,
  level,
  category,
  phases,
  modules,
}: SyllabusCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Link to={`/syllabus/${id}`} className='block group'>
      <Card className='group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-border overflow-hidden'>
        <div className='h-2 bg-gradient-primary' />

        <CardHeader>
          <div className='flex items-start justify-between gap-2 mb-2'>
            <Badge className={getLevelColor(level)}>{level}</Badge>
            <Badge variant='outline'>{category}</Badge>
          </div>
          <CardTitle className='text-xl group-hover:text-primary transition-colors'>
            {title}
          </CardTitle>
          <CardDescription className='line-clamp-2'>
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-3'>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <Users className='h-4 w-4' />
              <span>{instructor}</span>
            </div>
          </div>

          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <Clock className='h-4 w-4' />
              <span>{duration}</span>
            </div>
            <div className='flex items-center gap-1'>
              <BookOpen className='h-4 w-4' />
              <span>
                {phases?.length} phases • {modules?.length} modules
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Link to={`/syllabus/${id}`} className='w-full'>
            <Button className='w-full group/btn'>
              View Details
              <ArrowRight className='ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default SyllabusCard;
