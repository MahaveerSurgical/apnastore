// src/pages/PendingApproval.tsx
import { ClockIcon } from '@heroicons/react/24/outline';

export default function PendingApproval() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <ClockIcon className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-semibold text-primary-700 mb-2">
          Pending Approval
        </h1>
        <p className="text-gray-600">
          Thank you for signing up! Your account is currently under review by our
          admin team. You’ll receive full access once your registration is approved.
        </p>

        <div className="mt-6">
          <div className="animate-pulse h-2 w-32 bg-primary-400 mx-auto rounded"></div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          This usually takes less than 24 hours.  
          Please check back later or contact your admin if it takes longer.
        </p>
      </div>
    </div>
  );
}