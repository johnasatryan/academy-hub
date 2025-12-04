import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  Edit,
  Trash2,
  GraduationCap,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import syllabusApi from '@/api/syllabusApi';
import { Syllabus } from '@/api/types';

const SyllabusDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [openPhase, setOpenPhase] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<Record<number, number | null>>(
    {},
  );

  const togglePhase = (index: number) => {
    setOpenPhase(openPhase === index ? null : index);
  };

  const toggleModule = (phaseIndex: number, moduleIndex: number) => {
    setOpenModule((prev) => ({
      ...prev,
      [phaseIndex]: prev[phaseIndex] === moduleIndex ? null : moduleIndex,
    }));
  };

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        if (!id) return;
        const data = await syllabusApi.getById(id);
        setSyllabus(data);
      } catch (error) {
        console.error('Error fetching syllabus:', error);
        toast.error('Failed to load syllabus');
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await syllabusApi.remove(id);
      toast.success('Syllabus deleted successfully');
      navigate('/syllabuses');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete syllabus');
    }
  };

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

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading syllabus...</p>
      </div>
    );
  }

  if (!syllabus) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-destructive'>Syllabus not found</p>
      </div>
    );
  }

  const totalModules =
    syllabus.phases?.reduce(
      (acc, phase) => acc + (phase.modules?.length || 0),
      0,
    ) ?? 0;

  return (
    <div className='min-h-screen bg-gradient-subtle'>
      <Navigation />

      <main className='container mx-auto px-4 py-8 max-w-6xl'>
        <Button
          variant='ghost'
          onClick={() => navigate(-1)}
          className='mb-6 animate-fade-in'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>

        <div className='space-y-6'>
          <Card className='animate-fade-in overflow-hidden'>
            <div className='h-3 bg-gradient-primary' />
            <CardHeader>
              <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex gap-2 mb-3'>
                    {syllabus.level && (
                      <Badge className={getLevelColor(syllabus.level)}>
                        {syllabus.level}
                      </Badge>
                    )}
                    {syllabus.category && (
                      <Badge variant='outline'>{syllabus.category}</Badge>
                    )}
                  </div>
                  <h1 className='text-4xl font-bold mb-3'>{syllabus.title}</h1>
                  <p className='text-muted-foreground text-lg'>
                    {syllabus.description}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline' size='icon'>
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handleDelete}
                    className='text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Info Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up'>
            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='bg-primary/10 p-2 rounded-lg'>
                    <Users className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Instructor</p>
                    <p className='font-semibold'>
                      {syllabus.instructor || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='bg-secondary/10 p-2 rounded-lg'>
                    <Clock className='h-5 w-5 text-secondary' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Duration</p>
                    <p className='font-semibold'>
                      {syllabus.duration || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='bg-accent/10 p-2 rounded-lg'>
                    <BookOpen className='h-5 w-5 text-accent' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Content</p>
                    <p className='font-semibold'>
                      {syllabus.phases?.length || 0} phases • {totalModules}{' '}
                      modules
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <Card className='animate-fade-in'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <GraduationCap className='h-5 w-5 text-primary' />
                    Course Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {syllabus.phases?.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className='space-y-4'>
                      <div
                        onClick={() => togglePhase(phaseIndex)}
                        className='p-4 bg-gradient-primary rounded-lg text-primary-foreground cursor-pointer flex items-center justify-between'
                      >
                        <div>
                          <h3 className='font-bold text-xl mb-1'>
                            Phase {phaseIndex + 1}: {phase.title}
                          </h3>
                          <p className='text-sm opacity-90'>
                            {phase.description}
                          </p>
                        </div>

                        <span
                          className={`ml-4 text-primary-foreground/80 text-2xl transition-transform duration-300 ${
                            openPhase === phaseIndex ? 'rotate-180' : ''
                          }`}
                        >
                          ⌄
                        </span>
                      </div>

                      {/* COLLAPSIBLE MODULE LIST */}
                      <div
                        className={`ml-4 space-y-3 transition-all duration-300 overflow-hidden ${
                          openPhase === phaseIndex
                            ? 'max-h-[2000px] opacity-100 mt-3'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        {phase.modules?.map((module, moduleIndex) => (
                          <div key={moduleIndex} className='space-y-2'>
                            {/* CLICKABLE MODULE HEADER */}
                            <div
                              onClick={() =>
                                toggleModule(phaseIndex, moduleIndex)
                              }
                              className='p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between'
                            >
                              <h4 className='font-semibold'>
                                {moduleIndex + 1}. {module.title}
                              </h4>
                              <Badge variant='secondary'>
                                {module.duration}
                              </Badge>
                            </div>

                            {/* MODULE DETAILS COLLAPSE */}
                            <div
                              className={`ml-4 border-l pl-4 text-sm text-muted-foreground transition-all duration-300 overflow-hidden ${
                                openModule[phaseIndex] === moduleIndex
                                  ? 'max-h-[2000px] opacity-100 mt-3'
                                  : 'max-h-0 opacity-0'
                              }`}
                            >
                              {module.topics && module.topics.length > 0 && (
                                <ul className='list-disc ml-4 space-y-1'>
                                  {module.topics.map((topic, i) => (
                                    <li key={i}>{topic}</li>
                                  ))}
                                </ul>
                              )}
                              {/* 
                              TBD next year
                              {module.resources && (
                                <div className='mt-3'>
                                  <p className='font-semibold mb-1'>
                                    Resources:
                                  </p>
                                  <p>{module.resources}</p>
                                </div>
                              )} */}

                              {module.tasks && (
                                <div className='mt-3'>
                                  <p className='font-semibold mb-1'>Tasks:</p>
                                  <p>{module.tasks}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {phaseIndex < (syllabus.phases?.length ?? 0) - 1 && (
                        <Separator className='my-4' />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              <Card className='animate-fade-in'>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    {syllabus.prerequisites || 'N/A'}
                  </p>
                </CardContent>
              </Card>

              <Card className='animate-fade-in'>
                <CardHeader>
                  <CardTitle>Course Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    {syllabus.resources ? (
                      <a
                        href={syllabus.resources}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary underline hover:text-primary/80'
                      >
                        📘 Link to Course Resources
                      </a>
                    ) : (
                      <p className='text-muted-foreground'>N/A</p>
                    )}{' '}
                  </p>
                </CardContent>
              </Card>

              {syllabus.tags && syllabus.tags.length > 0 && (
                <Card className='animate-fade-in'>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {syllabus.tags.map((tag, index) => (
                        <Badge key={index} variant='outline'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SyllabusDetail;
