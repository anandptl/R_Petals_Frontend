'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { refreshAccessToken, saveLoginData, startAuthRefreshScheduler } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState('/');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const otpRefs = useRef([]);

  // Extract redirect query parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      setRedirectPath(redirect);
    }
  }, []);

  // Restore authenticated session and route based on user role
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          const role = localStorage.getItem('role')?.toUpperCase();
          if (role === 'ADMIN') router.replace('/admin');
          else if (role === 'SHOPKEEPER') router.replace('/darkStore');
          else if (role === 'USER') router.replace(redirectPath || '/');
          else await refreshAccessToken({ force: true });
          return;
        }

        const newToken = await refreshAccessToken();
        if (!newToken) return;

        const role = localStorage.getItem('role')?.toUpperCase();
        if (role === 'ADMIN') router.replace('/admin');
        else if (role === 'SHOPKEEPER') router.replace('/darkStore');
        else if (role === 'USER') router.replace(redirectPath || '/');
      } catch (error) {
        console.error('SESSION RESTORE ERROR:', error);
      }
    };

    restoreSession();
  }, [router, redirectPath]);

  // Countdown timer for OTP resend action
  useEffect(() => {
    if (step !== 'otp') return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  // Send OTP request to backend
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send OTP');
      }

      setOtp(['', '', '', '', '', '']);
      setStep('otp');
      setTimer(30);
      setCanResend(false);
      setMessage(data?.message || 'OTP sent successfully.');

      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      console.error('SEND OTP ERROR:', error);
      setError(error.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle individual digit entry and auto-focus next field
  const handleOtpChange = (index, value) => {
    const numericValue = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (!numericValue) {
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    newOtp[index] = numericValue.charAt(numericValue.length - 1);
    setOtp(newOtp);

    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation between OTP inputs
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP and persist user session
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const enteredOtp = otp.join('');
    if (!/^\d{6}$/.test(enteredOtp)) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mobileNumber: phoneNumber,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid or expired OTP');
      }

      const loginData = data?.data;
      if (!loginData?.accessToken) {
        throw new Error('Access token not received from server.');
      }

      saveLoginData(loginData);
      startAuthRefreshScheduler();
      setMessage('Login successful.');

      const role = loginData.role?.toUpperCase();
      if (role === 'ADMIN') router.replace('/admin');
      else if (role === 'SHOPKEEPER') router.replace('/darkStore');
      else if (role === 'USER') router.replace(redirectPath || '/');
      else setError('Invalid user role received from server.');
    } catch (error) {
      console.error('VERIFY OTP ERROR:', error);
      setError(error.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification OTP code
  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to resend OTP');
      }

      setOtp(['', '', '', '', '', '']);
      setTimer(30);
      setCanResend(false);
      setMessage(data?.message || 'OTP resent successfully.');

      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      console.error('RESEND OTP ERROR:', error);
      setError(error.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Reset to phone input view
  const handleEditNumber = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setError('');
    setMessage('');
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-6xl mx-auto flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_60px_-15px_rgba(118,0,37,0.08)] min-h-[600px] sm:min-h-[700px]">
        {/* Left Side Hero Banner */}
        <div className="hidden md:block md:w-1/2 relative bg-surface-container-low overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" />
          <div className="h-full w-full relative group">
            <img
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              alt="A luxurious and minimalist bouquet of blooming flowers"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGhfjLi-iz_3pmMzkjf3bjPaX1EMrRWGSjN70p9MF4MWd8ipwuo-eW6sCNxJcXoNsmQgq3fWDE6hnijWDK2upGifFFdJ2pDusexN0V2cZlzTAEqL49MpJcUh9M6Ht74JbK2Z40pCzcu_Wb-QJgmI2l0HuUK0mfq5Tq2VUIKI07xhFT535lDLQMmRq-KGKBcEBKTpfj9RXau_UzT0zisQk6Q2-iqxSymEl-10eDM3yw3v8vKZxjF89Wgg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h2 className="font-headline-lg text-headline-lg mb-4 text-surface-container-lowest leading-tight">
                Curating beauty for life's finest moments.
              </h2>
              <p className="font-body-lg text-body-lg text-surface-container-low opacity-90">
                Every petal tells a story of elegance and affection.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Authentication Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Brand Logo */}
            <div className="mb-8 sm:mb-10 md:mb-12 flex justify-center md:justify-start">
              <img
                alt="R Petals Logo"
                className="h-16 sm:h-18 md:h-20 w-auto object-contain"
                src="/logo1.png"
              />
            </div>

            {/* Header Text */}
            <div className="mb-6 sm:mb-8 md:mb-10 text-center md:text-left">
              <h1 className="font-headline-md text-headline-md text-primary mb-2">
                Welcome to R Petals
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {step === 'phone'
                  ? 'Enter your mobile number to continue.'
                  : `Enter the 6-digit OTP sent to +91 ${phoneNumber}`}
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success Message Box */}
            {message && (
              <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* Step 1: Phone Number Input Form */}
            {step === 'phone' && (
              <form onSubmit={handleSendOtp} className="space-y-5 sm:space-y-6">
                <div>
                  <label
                    className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-2"
                    htmlFor="phoneNumber"
                  >
                    Mobile Number
                  </label>

                  <div className="flex items-center border border-outline-variant rounded-full px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-surface-container-low">
                    <span className="font-body-md text-on-surface-variant mr-3 font-medium">
                      +91
                    </span>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="Enter 10-digit mobile number"
                      required
                      className="w-full py-2 bg-transparent text-on-surface font-body-md focus:outline-none placeholder:text-secondary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={phoneNumber.length !== 10 || loading}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-label-lg text-label-lg rounded-full transition-all shadow-sm hover:shadow-md active:scale-[0.98] uppercase tracking-wider"
                >
                  {loading ? 'Sending OTP...' : 'Get OTP'}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification Form */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 sm:space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Enter Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={handleEditNumber}
                      disabled={loading}
                      className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer disabled:opacity-50"
                    >
                      Edit Number
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-2 sm:gap-3 my-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        className="w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border border-outline-variant rounded-xl bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="font-label-sm text-label-sm text-primary hover:underline font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  ) : (
                    <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70">
                      Resend OTP in{' '}
                      <span className="font-semibold text-on-surface">
                        {timer}s
                      </span>
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={otp.join('').length !== 6 || loading}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-label-lg text-label-lg rounded-full transition-all shadow-sm hover:shadow-md active:scale-[0.98] uppercase tracking-wider"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>
            )}

            {/* Footer Terms & Policy Links */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-outline-variant text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                By continuing, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Blurred Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[100px] bg-[#E1BEC0]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] rounded-full blur-[80px] bg-[#C8C6C2]" />
      </div>
    </div>
  );
}