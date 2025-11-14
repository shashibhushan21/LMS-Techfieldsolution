import Head from 'next/head';
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BRAND } from '@/config/brand';

export default function AdminSettings() {
  // Local editable placeholders (no persistence yet)
  const [branding, setBranding] = useState({
    name: BRAND.name,
    tagline: BRAND.tagline,
    primaryColor: '#2563eb',
    supportEmail: 'support@techfieldsolution.com'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (field, value) => setBranding(prev => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    try {
      // Placeholder: Implement POST /admin/settings when backend route exists.
      await new Promise(r => setTimeout(r, 600));
      setMessage('Settings saved locally (persistence not wired).');
    } catch (e) {
      setMessage('Failed to save settings.');
    } finally { setSaving(false); }
  };

  return (
    <>
      <Head><title>Admin Settings</title></Head>
      <AdminLayout>
        <SectionHeader title="Settings" subtitle="Manage platform configuration placeholders" />
        <div className="grid gap-6 mt-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Update public facing identity (placeholder)</CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Name</label>
                  <input value={branding.name} onChange={e => handleChange('name', e.target.value)} className="input w-full" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Tagline</label>
                  <input value={branding.tagline} onChange={e => handleChange('tagline', e.target.value)} className="input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Primary Color</label>
                  <input type="color" value={branding.primaryColor} onChange={e => handleChange('primaryColor', e.target.value)} className="h-10 w-20 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Support Email</label>
                  <input type="email" value={branding.supportEmail} onChange={e => handleChange('supportEmail', e.target.value)} className="input w-full" />
                </div>
                <div className="p-3 rounded-md bg-primary-50 text-xs text-primary-700 border border-primary-100">
                  These changes are not persisted yet. Wire an API endpoint to save & propagate brand config.
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
                <Button type="button" variant="outline" onClick={() => setBranding({
                  name: BRAND.name,
                  tagline: BRAND.tagline,
                  primaryColor: '#2563eb',
                  supportEmail: 'support@techfieldsolution.com'
                })}>Reset</Button>
              </CardFooter>
              {message && <p className="px-6 pb-4 text-xs text-neutral-600">{message}</p>}
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Runtime configuration info snapshot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-neutral-600">NEXT_PUBLIC_API_BASE</span><code className="text-neutral-800">{process.env.NEXT_PUBLIC_API_BASE || 'not set'}</code></div>
              <div className="flex justify-between"><span className="text-neutral-600">NEXT_PUBLIC_ENV</span><code className="text-neutral-800">{process.env.NEXT_PUBLIC_ENV || 'not set'}</code></div>
              <div className="flex justify-between"><span className="text-neutral-600">Admin Bootstrap</span><code className="text-neutral-800">{process.env.ADMIN_BOOTSTRAP === 'true' ? 'pending' : 'done'}</code></div>
              <div className="p-3 rounded-md bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                Edit sensitive variables directly in the server `.env` file. Provide a secure admin API to mutate environment-backed settings if needed.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Planned Enhancements</CardTitle>
              <CardDescription>Roadmap for settings module</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
                <li>Persist branding to backend; expose read-only public endpoint consumed at build/runtime.</li>
                <li>Add logo upload (S3/Cloudinary) with immediate preview & fallback asset.</li>
                <li>Toggle feature flags (announcements, metrics, maintenance mode).</li>
                <li>Audit log of setting changes with actor + timestamp.</li>
                <li>Role-based granular permissions for subsections (future non-admin staff).</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
}
