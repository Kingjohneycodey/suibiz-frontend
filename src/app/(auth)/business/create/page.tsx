"use client";
import BusinessProfilePage from './business-profile-com';
import { useUserStore } from '../../../../../stores/userStore';
import { useRouter } from 'next/navigation';

export default function BusinessProfile() {

  const { user } = useUserStore();

  const router = useRouter()
  if(user?.role == "business"){
    router.push("/business")
  }

  return (
      <BusinessProfilePage />
  );
}