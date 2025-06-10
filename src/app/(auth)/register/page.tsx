"use client";
import { useState } from "react";
import {
  User,
  Store,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
type UserType = "user" | "business" | null;

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export default function RegistrationPage() {
  const [userType, setUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const router = useRouter();

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);

    if(type == "user"){
      router.push("/signup/user")
    } else if (type == "business") {
      router.push("/business/create")
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", { userType, ...formData });
      alert(`Registration successful for ${userType}: ${formData.name}`);

      setUserType(null);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 md:py-20 px-4 shadow sm:rounded-lg sm:px-10 md:flex gap-4">
          <button
            onClick={() => handleUserTypeSelect("user")}
            className="w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 cursor-pointer mb-8 md:mb-0"
          >
            <div className="mb-3 p-3 bg-indigo-100 rounded-full">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <span className="text-lg font-medium text-gray-800">
              Regular User
            </span>
            <span className="text-sm text-gray-500 mt-1">
              For individual accounts
            </span>
          </button>

          <button
            onClick={() => handleUserTypeSelect("business")}
            className="w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer"
          >
            <div className="mb-3 p-3 bg-green-100 rounded-full">
              <Store className="w-8 h-8 text-green-600" />
            </div>
            <span className="text-lg font-medium text-gray-800">
              Business
            </span>
            <span className="text-sm text-gray-500 mt-1">
              For Business Vendor and Service Providers
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
