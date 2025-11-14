import Head from 'next/head';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', bio: '', skills: [], linkedInProfile: '', githubProfile: ''
  });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: user.skills || [],
        linkedInProfile: user.linkedInProfile || '',
        githubProfile: user.githubProfile || '',
      });
    }
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      setForm((f) => ({ ...f, skills: value.split(',').map((s) => s.trim()).filter(Boolean) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile(form);
    if (res.success) toast.success('Profile updated'); else toast.error(res.message);
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await apiClient.put('/auth/change-password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success('Password changed');
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="container-custom py-16">
          <p>Please log in to access your profile.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar />
      <main className="bg-gray-50">
        <section className="py-16">
          <div className="container-custom grid lg:grid-cols-2 gap-8">
            <div>
              <SectionHeader title="Your Profile" subtitle="Manage your personal information" className="mb-6" />
              <Card>
                <CardContent>
                  <form onSubmit={submitProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="input" name="firstName" value={form.firstName} onChange={onChange} placeholder="First name" />
                    <input className="input" name="lastName" value={form.lastName} onChange={onChange} placeholder="Last name" />
                    <input className="input md:col-span-2" name="phone" value={form.phone} onChange={onChange} placeholder="Phone" />
                    <textarea className="input md:col-span-2" rows="4" name="bio" value={form.bio} onChange={onChange} placeholder="Bio" />
                    <input className="input md:col-span-2" name="skills" value={form.skills.join(', ')} onChange={onChange} placeholder="Skills (comma separated)" />
                    <input className="input md:col-span-2" name="linkedInProfile" value={form.linkedInProfile} onChange={onChange} placeholder="LinkedIn URL" />
                    <input className="input md:col-span-2" name="githubProfile" value={form.githubProfile} onChange={onChange} placeholder="GitHub URL" />
                    <div className="md:col-span-2">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <SectionHeader title="Change Password" subtitle="Update your password securely" className="mb-6" />
              <Card>
                <CardContent>
                  <form onSubmit={submitPassword} className="space-y-4">
                    <input className="input" type="password" placeholder="Current password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} />
                    <input className="input" type="password" placeholder="New password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} />
                    <input className="input" type="password" placeholder="Confirm new password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
                    <Button type="submit">Update Password</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
