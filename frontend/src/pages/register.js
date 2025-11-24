import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { validatePassword } from '@/utils/validation';
import { FormInput, FormSelect, Button } from '@/components/ui';
import { useFormValidation } from '@/hooks/useCommon';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const validation = (values) => {
    const errors = {};
    if (!values.name?.trim()) errors.name = 'Name is required';
    if (!values.email?.trim()) errors.email = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    if (values.password && values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const {
    values: formData,
    errors,
    handleChange,
    validate
  } = useFormValidation(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'intern',
    },
    validation
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await registerUser(userData);

    if (result.success) {
      toast.success('Registration successful!');
      router.push('/dashboard');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const roleOptions = [
    { value: 'intern', label: 'Intern' },
    { value: 'mentor', label: 'Mentor' }
  ];

  return (
    <>
      <Head>
        <title>Register - TechFieldSolution LMS</title>
      </Head>

      <div className="min-h-screen flex-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-4xl font-heading font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link href="/" className="font-medium text-primary-600 hover:text-primary-500">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={FiUser}
                placeholder="John Doe"
                required
              />

              <FormInput
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={FiMail}
                placeholder="you@example.com"
                required
              />

              <FormInput
                label="Phone Number (Optional)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                icon={FiPhone}
                placeholder="+1 (555) 123-4567"
              />

              <div>
                <FormInput
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={FiLock}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={FiLock}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>

              <FormSelect
                label="I want to register as"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
