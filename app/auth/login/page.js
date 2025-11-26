'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/auth-context';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const result = await login(values.email, values.password);

      if (result.success) {
        toast.success('Login successful!');
        router.push('/');
      } else {
        if (result.requiresVerification) {
          toast.warning('Please verify your email first');
          setTimeout(() => {
            router.push(`/auth/verify-otp?email=${encodeURIComponent(values.email)}`);
          }, 2000);
        } else {
          toast.error(result.error || 'Login failed');
          setFieldError('password', result.error || 'Invalid credentials');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setFieldError('password', 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/gallery/1.jpeg"
          alt="RebelByGrace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_0.9)]">
              Welcome Back
            </h1>
            <p className="text-xl [text-shadow:_1px_1px_4px_rgb(0_0_0_/_0.9)]">
              Sign in to continue your journey with RebelByGrace
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <div>
            <h2 className="hidden lg:block text-3xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-medium text-[#4a2c23] hover:text-[#5a3c33]">
                Create one here
              </Link>
            </p>
          </div>

          <Formik
            initialValues={{
              email: '',
              password: '',
              rememberMe: false,
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors ${
                        errors.email && touched.email
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors ${
                        errors.password && touched.password
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Field
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-[#4a2c23] focus:ring-[#4a2c23] border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/auth/forgot-password"
                      className="font-medium text-[#4a2c23] hover:text-[#5a3c33]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4a2c23] hover:bg-[#5a3c33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a2c23] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
