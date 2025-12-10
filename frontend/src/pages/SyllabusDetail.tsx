import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

import syllabusApi from '@/api/syllabusApi';
import { Syllabus } from '@/api/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SyllabusDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);

  const [openPhase, setOpenPhase] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<Record<number, number | null>>(
    {},
  );

  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const togglePhase = (index: number) => {
    const closing = openPhase === index;
    setOpenPhase(closing ? null : index);

    if (!closing) {
      setTimeout(() => {
        phaseRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 250);
    }
  };

  const toggleModule = (phaseIndex: number, moduleIndex: number) => {
    setOpenModule((prev) => ({
      ...prev,
      [phaseIndex]: prev[phaseIndex] === moduleIndex ? null : moduleIndex,
    }));
  };

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const data = await syllabusApi.getById(id);
        setSyllabus(data);
      } catch {
        toast.error('Failed to load syllabus');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await syllabusApi.remove(id);
      toast.success('Syllabus deleted');
      navigate('/syllabuses');
    } catch {
      toast.error('Delete failed');
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

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading syllabus...</p>
      </div>
    );

  if (!syllabus)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-destructive'>Syllabus not found</p>
      </div>
    );

  const totalModules =
    syllabus.phases?.reduce((acc, p) => acc + (p.modules?.length ?? 0), 0) ?? 0;

  const totalDuration =
    syllabus.phases?.reduce((acc, p) => acc + (p.duration ?? 0), 0) ?? 0;

  const instructorList = syllabus.phases
    ?.map((p) => p.instructor)
    .filter(Boolean);

  const mainInstructor = !instructorList?.length
    ? 'N/A'
    : instructorList.length === 1
    ? instructorList[0]
    : 'Multiple Instructors';

  return (
    <div className='min-h-screen bg-gradient-subtle'>
      <Navigation />

      <main className='container mx-auto px-4 py-8 max-w-6xl'>
        <Button variant='ghost' onClick={() => navigate(-1)} className='mb-6'>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button>

        <div className='space-y-6'>
          {/* HEADER */}
          <Card>
            <div className='h-3 bg-gradient-primary' />
            <CardHeader>
              <div className='flex flex-col md:flex-row justify-between gap-4'>
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
                    className='text-destructive'
                    onClick={handleDelete}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* INFO CARDS */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 p-2 rounded-lg'>
                    <Users className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      Instructor(s)
                    </p>
                    <p className='font-semibold'>{mainInstructor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <div className='bg-secondary/10 p-2 rounded-lg'>
                    <Clock className='h-5 w-5 text-secondary' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Duration</p>
                    <p className='font-semibold'>{totalDuration} months</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <div className='bg-accent/10 p-2 rounded-lg'>
                    <BookOpen className='h-5 w-5 text-accent' />
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Content</p>
                    <p className='font-semibold'>
                      {syllabus.phases?.length ?? 0} phases • {totalModules}{' '}
                      modules
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PHASES + MODULES */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <GraduationCap className='h-5 w-5 text-primary' />
                    Course Structure
                  </CardTitle>
                </CardHeader>

                <CardContent className='space-y-6'>
                  {syllabus.phases?.map((phase, phaseIndex) => (
                    <div
                      key={phaseIndex}
                      ref={(el) => (phaseRefs.current[phaseIndex] = el)}
                    >
                      {/* PHASE HEADER */}
                      <div
                        onClick={() => togglePhase(phaseIndex)}
                        className={cn(
                          'p-4 bg-gradient-primary rounded-lg cursor-pointer text-primary-foreground flex justify-between',
                        )}
                      >
                        <div>
                          <h3 className='font-bold text-xl'>
                            Phase {phaseIndex + 1}: {phase.title}
                          </h3>

                          <p className='text-sm opacity-90'>
                            <strong>Instructor:</strong> {phase.instructor}
                          </p>

                          <p className='text-sm opacity-90'>
                            <strong>Duration:</strong> {phase.duration} months
                          </p>

                          {phase.prerequisites && (
                            <p className='text-sm opacity-90'>
                              <strong>Prerequisites:</strong>{' '}
                              {phase.prerequisites}
                            </p>
                          )}
                        </div>

                        <span
                          className={cn(
                            'text-2xl transition-transform',
                            openPhase === phaseIndex && 'rotate-180',
                          )}
                        >
                          ⌄
                        </span>
                      </div>

                      {/* PHASE COLLAPSE */}
                      <div
                        className={cn(
                          'ml-4 overflow-hidden grid transition-all duration-300',
                          openPhase === phaseIndex
                            ? 'grid-rows-[1fr] opacity-100 mt-3'
                            : 'grid-rows-[0fr] opacity-0',
                        )}
                      >
                        <div className='space-y-3 overflow-hidden'>
                          {phase.modules?.map((module, moduleIndex) => (
                            <div key={moduleIndex} className='space-y-2'>
                              {/* MODULE HEADER */}
                              <div
                                className='p-4 border rounded-lg cursor-pointer hover:bg-muted/50 flex justify-between'
                                onClick={() =>
                                  toggleModule(phaseIndex, moduleIndex)
                                }
                              >
                                <h4
                                  className={cn(
                                    'font-semibold transition-all',
                                    openModule[phaseIndex] === moduleIndex
                                      ? 'break-words'
                                      : 'truncate max-w-[75%]',
                                  )}
                                >
                                  {moduleIndex + 1}. {module.title}
                                </h4>

                                {module.duration && (
                                  <Badge variant='secondary'>
                                    {module.duration}
                                  </Badge>
                                )}
                              </div>

                              {/* MODULE COLLAPSE */}
                              <div
                                className={cn(
                                  'ml-4 border-l pl-4 text-sm text-muted-foreground overflow-hidden grid transition-all duration-300',
                                  openModule[phaseIndex] === moduleIndex
                                    ? 'grid-rows-[1fr] opacity-100 mt-3'
                                    : 'grid-rows-[0fr] opacity-0',
                                )}
                              >
                                <div className='overflow-hidden'>
                                  {module.topics?.length ? (
                                    <ul className='list-disc ml-4 space-y-1'>
                                      {module.topics.map((topic, idx) => (
                                        <li key={idx}>{topic}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p>No topics listed.</p>
                                  )}

                                  {module.tasks?.length ? (
                                    <div className='mt-3'>
                                      <p className='font-semibold mb-1'>
                                        Tasks:
                                      </p>
                                      <ul className='list-disc ml-4 space-y-1'>
                                        {module.tasks.map((task, idx) => (
                                          <li key={idx}>{task}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {phaseIndex < (syllabus.phases?.length ?? 0) - 1 && (
                        <Separator className='my-4' />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* SIDEBAR */}
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  {syllabus.resources ? (
                    <a
                      href={syllabus.resources}
                      target='_blank'
                      className='text-primary underline'
                    >
                      📘 Open Resources
                    </a>
                  ) : (
                    <p className='text-muted-foreground'>No resources added.</p>
                  )}
                </CardContent>
              </Card>

              {syllabus.tags?.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {syllabus.tags.map((tag, i) => (
                        <Badge key={i} variant='outline'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SyllabusDetail;
