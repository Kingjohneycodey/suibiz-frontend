"use client";
import UserSignup from './user-profile-com';
import { useUserStore } from '../../../../../stores/userStore';
import { useRouter } from 'next/navigation';

export default function BusinessProfile() {

  const { user } = useUserStore();

  const router = useRouter()
  if(user?.role == "user"){
    router.push("/user")
  } else if(user?.role == "business"){
    router.push("/business")
  }

  return (
      <UserSignup />
  );
}