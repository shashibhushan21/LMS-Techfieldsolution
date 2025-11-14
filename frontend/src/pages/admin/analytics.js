import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/utils/apiClient';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function Sparkline({ points = [], stroke = '#2563eb' }) {
  if (!points.length) return <div className="h-8" />;
  const w = 120;
  const h = 32;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const d = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={d} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      // Attempt primary endpoint; fallback to alternate if needed.
      let res;
      try {
        res = await apiClient.get('/analytics/dashboard/admin');
      } catch (e) {
        res = await apiClient.get('/analytics/admin-dashboard');
      }
      setData(res.data.data || res.data);
    } catch (e) {
      console.error('Analytics fetch failed', e);
      setError('Failed to load analytics');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Derive KPI set with safe fallbacks.
  const kpis = [
    { label: 'Total Users', value: data?.usersTotal ?? '—', series: data?.usersSeries || [5,6,7,10,9,11] },
    { label: 'Active Internships', value: data?.internshipsActive ?? '—', series: data?.internshipsSeries || [3,4,3,5,6,5] },
    { label: 'Enrollments', value: data?.enrollmentsTotal ?? '—', series: data?.enrollmentsSeries || [2,3,4,4,5,7] },
    { label: 'Announcements', value: data?.announcementsTotal ?? '—', series: data?.announcementsSeries || [1,1,2,3,2,4] },
  ];

  return (
    <>
      <Head><title>Admin Analytics</title></Head>
      <AdminLayout>
        <SectionHeader title="Analytics" subtitle="Platform performance overview" />
        <div className="flex justify-end mt-2 mb-4 gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</Button>
        </div>
        {error && (
          <div className="p-4 mb-4 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">{error}</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map(k => (
            <Card key={k.label} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600">{k.label}</CardTitle>
                <CardDescription className="text-3xl font-semibold tracking-tight text-neutral-900">{k.value}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Sparkline points={k.series} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Users Growth</CardTitle>
              <CardDescription>Monthly new user registrations (placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <Sparkline points={(data?.usersMonthly) || [2,4,6,8,6,9,11,10]} stroke="#16a34a" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Internship Engagement</CardTitle>
              <CardDescription>Applications trend (placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <Sparkline points={(data?.applicationsSeries) || [1,3,2,5,7,6,8,9]} stroke="#db2777" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Notes</CardTitle>
              <CardDescription>Next steps for analytics build-out</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm list-disc pl-5 space-y-2 text-neutral-700">
                <li>Replace placeholder series with backend-provided arrays.</li>
                <li>Add date range selector (last 7d, 30d, custom).</li>
                <li>Incorporate a lightweight chart lib (e.g. `chart.js` or `recharts`).</li>
                <li>Provide export (CSV) for key datasets.</li>
                <li>Drill-down views for per-internship engagement metrics.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
}
