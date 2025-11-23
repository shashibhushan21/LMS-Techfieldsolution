import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NotificationsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/notifications');
  }, [router]);

  return null;
}
