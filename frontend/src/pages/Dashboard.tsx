import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import syllabusApi from '@/api/syllabusApi';
import { Syllabus } from '@/api/types';
import { toast } from 'sonner';

const Dashboard = () => {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const data = await syllabusApi.getAll();
        setSyllabuses(data);
      } catch (error) {
        console.error('Error fetching syllabuses:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchSyllabuses();
  }, []);

  // Derived stats
  const totalSyllabuses = syllabuses.length;
  const activeCourses = syllabuses.filter(
    (s) => s.level?.toLowerCase() !== 'archived',
  ).length;
  const totalStudents = 606;

  const stats = [
    {
      title: 'Total Syllabuses',
      value: totalSyllabuses.toString(),
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Courses',
      value: activeCourses.toString(),
      icon: TrendingUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Total Students',
      value: totalStudents.toString(),
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  // Sort by most recent
  const recentSyllabuses = [...syllabuses]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || '').getTime() -
        new Date(a.updatedAt || '').getTime(),
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-subtle'>
      <Navigation />

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8 animate-fade-in'>
          <h1 className='text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent'>
            Welcome to Picsart Academy
          </h1>
          <p className='text-muted-foreground text-lg'>
            Manage your syllabuses and track course progress
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className='hover:shadow-lg transition-shadow'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-3xl font-bold'>{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent syllabuses & quick actions */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card className='animate-fade-in'>
            <CardHeader>
              <CardTitle>Recent Syllabuses</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {recentSyllabuses.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  No syllabuses found yet. Create one to get started!
                </p>
              ) : (
                recentSyllabuses.map((syllabus) => (
                  <Link
                    key={syllabus.id}
                    to={`/syllabus/${syllabus.id}`}
                    className='block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors'
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold mb-1'>{syllabus.title}</h3>
                        <p className='text-sm text-muted-foreground'>
                          by {syllabus.instructor || 'Unknown'}
                        </p>
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {syllabus.updatedAt
                          ? new Date(syllabus.updatedAt).toLocaleDateString()
                          : '—'}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className='animate-fade-in bg-gradient-primary text-primary-foreground'>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Link to='/add-syllabus'>
                <Button
                  variant='secondary'
                  className='w-full justify-start'
                  size='lg'
                  mb='sm'
                >
                  <Plus className='mr-2 h-5 w-5' />
                  Create New Syllabus
                </Button>
              </Link>
              <Link to='/syllabuses'>
                <Button
                  variant='secondary'
                  className='w-full justify-start'
                  size='lg'
                >
                  <BookOpen className='mr-2 h-5 w-5' />
                  View All Syllabuses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
