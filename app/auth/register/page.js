'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Please check your email for verification code.');
        router.push(`/auth/verify-otp?email=${encodeURIComponent(values.email)}`);
      } else {
        const errorMessage = data.error || 'Registration failed';
        toast.error(errorMessage);
        if (data.error?.includes('email')) {
          setFieldError('email', errorMessage);
        } else {
          setFieldError('email', errorMessage);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setFieldError('email', 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/gallery/2.jpeg"
          alt="RebelByGrace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_0.9)]">
              Join Us
            </h1>
            <p className="text-xl [text-shadow:_1px_1px_4px_rgb(0_0_0_/_0.9)]">
              Create your account and start your journey with RebelByGrace
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-md w-full space-y-8">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Join RebelByGrace today</p>
          </div>

          <div>
            <h2 className="hidden lg:block text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-[#4a2c23] hover:text-[#5a3c33]">
                Sign in here
              </Link>
            </p>
          </div>

          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              agreeToTerms: false,
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First name *
                      </label>
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors ${
                          errors.firstName && touched.firstName
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="First name"
                      />
                      <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last name *
                      </label>
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors ${
                          errors.lastName && touched.lastName
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="Last name"
                      />
                      <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address *
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone number (optional)
                    </label>
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors ${
                        errors.phone && touched.phone
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors ${
                        errors.password && touched.password
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Create a password"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm password *
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div className="flex items-start">
                  <Field
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 mt-1 text-[#4a2c23] focus:ring-[#4a2c23] border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#4a2c23] hover:text-[#5a3c33]">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#4a2c23] hover:text-[#5a3c33]">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <ErrorMessage name="agreeToTerms" component="div" className="text-sm text-red-600" />

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4a2c23] hover:bg-[#5a3c33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a2c23] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Creating account...' : 'Create account'}
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
