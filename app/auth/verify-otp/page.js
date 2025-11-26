'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/auth-context';

const otpSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .required('Verification code is required')
    .length(6, 'Verification code must be 6 digits')
    .matches(/^\d+$/, 'Verification code must contain only numbers'),
});

function VerifyOtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  const [email, setEmail] = useState('');
  const [resendingCode, setResendingCode] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    try {
      const result = await verifyEmail(email, values.verificationCode);

      if (result.success) {
        toast.success('Email verified successfully!');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error(result.error || 'Verification failed');
        setFieldError('verificationCode', result.error || 'Invalid verification code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      setFieldError('verificationCode', 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setResendingCode(true);
    try {
      const result = await resendVerification(email);

      if (result.success) {
        toast.success('Verification code resent successfully!');
      } else {
        toast.error(result.error || 'Failed to resend verification code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setResendingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/gallery/3.jpeg"
          alt="RebelByGrace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4 [text-shadow:_2px_2px_8px_rgb(0_0_0_/_0.9)]">
              Verify Your Email
            </h1>
            <p className="text-xl [text-shadow:_1px_1px_4px_rgb(0_0_0_/_0.9)]">
              We&apos;ve sent a verification code to your email
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Verify OTP Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Verify Email</h2>
            <p className="mt-2 text-gray-600">Enter your verification code</p>
          </div>

          <div>
            <h2 className="hidden lg:block text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600">
              We have sent a 6-digit verification code to{' '}
              <strong className="text-gray-900">{email || 'your email'}</strong>
            </p>
          </div>

          <Formik
            initialValues={{
              verificationCode: '',
            }}
            validationSchema={otpSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <Field
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    maxLength={6}
                    className={`w-full px-4 py-4 border rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent transition-colors text-center text-2xl tracking-widest ${
                      errors.verificationCode && touched.verificationCode
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    placeholder="000000"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFieldValue('verificationCode', value);
                    }}
                    value={values.verificationCode}
                  />
                  <ErrorMessage name="verificationCode" component="div" className="mt-1 text-sm text-red-600 text-center" />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || values.verificationCode.length !== 6}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4a2c23] hover:bg-[#5a3c33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a2c23] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Email'}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn&apos;t receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendingCode}
                      className="font-medium text-[#4a2c23] hover:text-[#5a3c33] disabled:opacity-50"
                    >
                      {resendingCode ? 'Resending...' : 'Resend Code'}
                    </button>
                  </p>
                </div>

                <div className="text-center">
                  <Link
                    href="/auth/register"
                    className="text-sm font-medium text-[#4a2c23] hover:text-[#5a3c33]"
                  >
                    Back to Registration
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23]"></div>
      </div>
    }>
      <VerifyOtpInner />
    </Suspense>
  );
}
