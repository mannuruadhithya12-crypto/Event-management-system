import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, GraduationCap, Building2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import type { UserRole } from '@/types';
import { mockColleges } from '@/data/mockData';

const steps = [
  { id: 1, name: 'Account Type' },
  { id: 2, name: 'Personal Info' },
  { id: 3, name: 'Account Details' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: '' as UserRole | '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    collegeId: '',
    department: '',
    year: '',
  });

  const handleNext = () => {
    if (currentStep === 1 && !formData.role) {
      toast.error('Please select your role');
      return;
    }
    if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName) {
        toast.error('Please fill in all fields');
        return;
      }
      if (formData.role === 'student' && (!formData.collegeId || !formData.year)) {
        toast.error('Please fill in all fields');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as UserRole,
        collegeId: formData.collegeId,
        department: formData.department,
        year: formData.year ? parseInt(formData.year) : undefined,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
  };

  const roles = [
    { value: 'student', label: 'Student', icon: GraduationCap, description: 'Participate in hackathons and events' },
    { value: 'faculty', label: 'Faculty', icon: Building2, description: 'Organize events and manage content' },
    { value: 'college_admin', label: 'College Admin', icon: CheckCircle, description: 'Manage college operations' },
  ];

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Other',
  ];

  const years = ['1', '2', '3', '4', '5'];

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--teal))]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">CollegeHub</span>
          </Link>

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Join thousands of students and faculty members
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${currentStep >= step.id
                        ? 'bg-[hsl(var(--navy))] text-white dark:bg-[hsl(var(--teal))]'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
                      }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${currentStep >= step.id
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500'
                      }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="mx-4 h-px w-8 bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                I am a...
              </p>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setFormData({ ...formData, role: role.value as UserRole })}
                    className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${formData.role === role.value
                        ? 'border-[hsl(var(--navy))] bg-[hsl(var(--navy))]/5 dark:border-[hsl(var(--teal))] dark:bg-[hsl(var(--teal))]/5'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                      }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${formData.role === role.value
                        ? 'bg-[hsl(var(--navy))] text-white dark:bg-[hsl(var(--teal))]'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}>
                      <role.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{role.label}</p>
                      <p className="text-sm text-slate-500">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={handleNext} className="btn-primary w-full">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {(formData.role === 'student' || formData.role === 'faculty') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      College
                    </label>
                    <Select
                      value={formData.collegeId}
                      onValueChange={(value) => setFormData({ ...formData, collegeId: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your college" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockColleges.map((college) => (
                          <SelectItem key={college.id} value={college.id}>
                            {college.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Department
                    </label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Year of Study
                  </label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={handleBack} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleNext} className="btn-primary flex-1">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Account Details */}
          {currentStep === 3 && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@college.edu"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[hsl(var(--navy))] focus:ring-[hsl(var(--navy))]"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[hsl(var(--navy))] hover:underline dark:text-[hsl(var(--teal))]">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[hsl(var(--navy))] hover:underline dark:text-[hsl(var(--teal))]">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="btn-primary flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[hsl(var(--navy))] hover:text-[hsl(var(--navy))]/80 dark:text-[hsl(var(--teal))]"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop"
            alt="Students collaborating"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--teal))]/80 to-[hsl(var(--navy))]/80" />

          <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold lg:text-4xl">
                Start Your Journey Today
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Join a community of innovators, creators, and leaders.
                Discover opportunities that will shape your future.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[hsl(var(--orange))]" />
                  <span>Access to 1000+ hackathons and events</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[hsl(var(--orange))]" />
                  <span>Connect with students from 500+ colleges</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[hsl(var(--orange))]" />
                  <span>Build your portfolio and earn certificates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
