import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  goToStep: (step: number) => void;
}

export default function Stepper({ steps, currentStep, goToStep }: StepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? 'flex-1' : '',
              'relative'
            )}
          >
            {step.status === 'complete' ? (
              <button
                type="button"
                onClick={() => goToStep(step.id)}
                className="group flex flex-col items-center w-full"
              >
                <span className="flex items-center h-9">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-2 text-sm font-medium text-gray-900">
                  {step.name}
                </span>
              </button>
            ) : step.status === 'current' ? (
              <div
                className="flex flex-col items-center"
                aria-current="step"
              >
                <span className="flex items-center h-9">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </span>
                </span>
                <span className="mt-2 text-sm font-medium text-primary">
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="group flex flex-col items-center">
                <span className="flex items-center h-9">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                  </span>
                </span>
                <span className="mt-2 text-sm font-medium text-gray-500">
                  {step.name}
                </span>
              </div>
            )}

            {stepIdx !== steps.length - 1 ? (
              <div
                className={`absolute top-4 left-1/2 -ml-px mt-0.5 h-full w-0.5 ${
                  step.status === 'complete' ? 'bg-primary' : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
