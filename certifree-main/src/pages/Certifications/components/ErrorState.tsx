/**
 * Error State Component
 */

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000814] text-red-500">
      <p>Error: {error}</p>
    </div>
  );
};
