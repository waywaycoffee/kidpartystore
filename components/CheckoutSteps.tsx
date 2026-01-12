/**
 * Checkout Steps Indicator Component
 */

'use client';

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Shipping', labelEn: 'Shipping' },
  { number: 2, label: 'Shipping Method', labelEn: 'Shipping Method' },
  { number: 3, label: 'Payment', labelEn: 'Payment' },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <span
                className={`mt-2 text-sm ${
                  currentStep >= step.number
                    ? 'text-primary-600 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {step.labelEn}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

