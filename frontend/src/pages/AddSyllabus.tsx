import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import syllabusApi from '@/api/syllabusApi';

interface Module {
  id: string;
  title: string;
  duration: string;
}

interface Phase {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

const AddSyllabus = () => {
  const navigate = useNavigate();

  // ---------------------- //
  // Basic Information State
  // ---------------------- //
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [resources, setResources] = useState('');
  const [tags, setTags] = useState('');

  // ---------------------- //
  // Phase and Module State
  // ---------------------- //
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: '1',
      title: '',
      description: '',
      modules: [{ id: '1', title: '', duration: '' }],
    },
  ]);

  // ---------------------- //
  // Phase and Module Logic
  // ---------------------- //
  const addPhase = () => {
    setPhases([
      ...phases,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        modules: [
          { id: Date.now().toString() + '-1', title: '', duration: '' },
        ],
      },
    ]);
  };

  const removePhase = (id: string) => {
    if (phases.length > 1) {
      setPhases(phases.filter((phase) => phase.id !== id));
    }
  };

  const updatePhase = (
    id: string,
    field: keyof Omit<Phase, 'modules'>,
    value: string,
  ) => {
    setPhases(
      phases.map((phase) =>
        phase.id === id ? { ...phase, [field]: value } : phase,
      ),
    );
  };

  const addModule = (phaseId: string) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              modules: [
                ...phase.modules,
                { id: Date.now().toString(), title: '', duration: '' },
              ],
            }
          : phase,
      ),
    );
  };

  const removeModule = (phaseId: string, moduleId: string) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              modules: phase.modules.filter((module) => module.id !== moduleId),
            }
          : phase,
      ),
    );
  };

  const updateModule = (
    phaseId: string,
    moduleId: string,
    field: keyof Module,
    value: string,
  ) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              modules: phase.modules.map((module) =>
                module.id === moduleId ? { ...module, [field]: value } : module,
              ),
            }
          : phase,
      ),
    );
  };

  // ---------------------- //
  // Handle Form Submit
  // ---------------------- //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        title,
        description,
        instructor,
        duration,
        level,
        category,
        prerequisites,
        resources,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        phases: phases.map((p) => ({
          title: p.title,
          description: p.description,
          modules: p.modules.map((m) => ({
            title: m.title,
            duration: m.duration,
          })),
        })),
      };

      await syllabusApi.create(data);
      toast.success('✅ Syllabus created successfully!');
      navigate('/syllabuses');
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to create syllabus');
    }
  };

  // ---------------------- //
  // Render
  // ---------------------- //
  return (
    <div className='min-h-screen bg-gradient-subtle'>
      <Navigation />

      <main className='container mx-auto px-4 py-8 max-w-4xl'>
        <Button
          variant='ghost'
          onClick={() => navigate(-1)}
          className='mb-6 animate-fade-in'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>

        <div className='mb-6 animate-fade-in'>
          <h1 className='text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent'>
            Create New Syllabus
          </h1>
          <p className='text-muted-foreground text-lg'>
            Add a new course syllabus to your academy
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6 animate-slide-up'>
          {/* ---------------------- Basic Info ---------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the fundamental details about the course
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Course Title *</Label>
                <Input
                  id='title'
                  placeholder='e.g., Advanced Photo Editing'
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description *</Label>
                <Textarea
                  id='description'
                  placeholder='Provide a comprehensive description of the course...'
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='instructor'>Instructor *</Label>
                  <Input
                    id='instructor'
                    placeholder='Instructor name'
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='duration'>Duration *</Label>
                  <Input
                    id='duration'
                    placeholder='e.g., 12 weeks'
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='level'>Level *</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger id='level'>
                      <SelectValue placeholder='Select level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='beginner'>Beginner</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
                      <SelectItem value='advanced'>Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id='category'>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='academy2_0'>Academy 2.0</SelectItem>
                      <SelectItem value='engineering'>Engineering</SelectItem>
                      <SelectItem value='design'>Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---------------------- Phases ---------------------- */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Course Phases & Modules</CardTitle>
                  <CardDescription>
                    Organize your course into phases, each containing multiple
                    modules
                  </CardDescription>
                </div>
                <Button type='button' onClick={addPhase} size='sm'>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Phase
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {phases.map((phase, phaseIndex) => (
                <div
                  key={phase.id}
                  className='p-6 border-2 border-primary/20 rounded-lg bg-card space-y-4'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1 space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor={`phase-title-${phase.id}`}>
                          Phase {phaseIndex + 1} Title *
                        </Label>
                        <Input
                          id={`phase-title-${phase.id}`}
                          placeholder='e.g., Foundation Phase'
                          value={phase.title}
                          onChange={(e) =>
                            updatePhase(phase.id, 'title', e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`phase-description-${phase.id}`}>
                          Phase Description
                        </Label>
                        <Textarea
                          id={`phase-description-${phase.id}`}
                          placeholder='Describe what students will learn in this phase...'
                          value={phase.description}
                          onChange={(e) =>
                            updatePhase(phase.id, 'description', e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                    {phases.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removePhase(phase.id)}
                        className='text-destructive hover:text-destructive hover:bg-destructive/10'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-base'>
                        Modules in Phase {phaseIndex + 1}
                      </Label>
                      <Button
                        type='button'
                        onClick={() => addModule(phase.id)}
                        size='sm'
                        variant='outline'
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        Add Module
                      </Button>
                    </div>

                    {phase.modules.map((module, moduleIndex) => (
                      <div
                        key={module.id}
                        className='flex gap-4 items-start p-4 border border-border rounded-lg bg-muted/30'
                      >
                        <div className='flex-1 space-y-4'>
                          <div className='space-y-2'>
                            <Label
                              htmlFor={`module-title-${phase.id}-${module.id}`}
                            >
                              Module {moduleIndex + 1} Title *
                            </Label>
                            <Input
                              id={`module-title-${phase.id}-${module.id}`}
                              placeholder='e.g., Introduction to Layers'
                              value={module.title}
                              onChange={(e) =>
                                updateModule(
                                  phase.id,
                                  module.id,
                                  'title',
                                  e.target.value,
                                )
                              }
                              required
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label
                              htmlFor={`module-duration-${phase.id}-${module.id}`}
                            >
                              Duration *
                            </Label>
                            <Input
                              id={`module-duration-${phase.id}-${module.id}`}
                              placeholder='e.g., 2 hours'
                              value={module.duration}
                              onChange={(e) =>
                                updateModule(
                                  phase.id,
                                  module.id,
                                  'duration',
                                  e.target.value,
                                )
                              }
                              required
                            />
                          </div>
                        </div>
                        {phase.modules.length > 1 && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => removeModule(phase.id, module.id)}
                            className='text-destructive hover:text-destructive hover:bg-destructive/10'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ---------------------- Additional Info ---------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Optional details to enhance the syllabus
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='prerequisites'>Prerequisites</Label>
                <Textarea
                  id='prerequisites'
                  placeholder='List any prerequisites for this course...'
                  rows={3}
                  value={prerequisites}
                  onChange={(e) => setPrerequisites(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='resources'>Course Resources</Label>
                <Textarea
                  id='resources'
                  placeholder='List materials and resources students will need...'
                  rows={3}
                  value={resources}
                  onChange={(e) => setResources(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='tags'>Tags</Label>
                <Input
                  id='tags'
                  placeholder='e.g., photoshop, editing, professional (comma-separated)'
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* ---------------------- Actions ---------------------- */}
          <div className='flex gap-4 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type='submit' className='min-w-[150px]'>
              Create Syllabus
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddSyllabus;
