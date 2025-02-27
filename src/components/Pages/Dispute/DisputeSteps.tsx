
interface DisputeStepsProps {
  status: string;
}



export default function DisputeSteps({ status }: DisputeStepsProps) {

  const steps = status.toLowerCase() === 'rejected' ? [
    'issued',
    'accepted',
    'raised',
    'rejected'
  ] : [
    'Issued',
    'Accepted',
    'Raised',
    'Resolved',
  ];


  let statusIndex = steps.findIndex(step => step.toLowerCase() === status.toLowerCase());
  if (status.toLowerCase() === 'rejected') {
    statusIndex = steps.findIndex(step => step.toLowerCase() === 'rejected');
  }
  if (status.toLowerCase() === 'resolved') {
    statusIndex = steps.findIndex(step => step.toLowerCase() === 'resolved');
  }

  return (
    <ul className="steps">
      {steps.map((step, index) => (
        <li key={step} className={`step ${index <= statusIndex ? 'step-primary' : ''} ${step.toLowerCase() === 'rejected' && status.toLowerCase() === 'rejected' ? 'step-error' : ''}`}>
          {step}
        </li>
      ))}
    </ul>
  );
}