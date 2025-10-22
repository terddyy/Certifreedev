/**
 * Page Header Component
 * Displays the main title and description for the Certifications page
 */

export const PageHeader = () => {
  return (
    <div className="mb-12 text-center relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ffd60a]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003566]/20 rounded-full blur-3xl"></div>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
        Discover Your Next{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc300] to-[#ffd60a]">
          Free Certification
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        Explore a vast library of high-quality IT and business
        certifications, meticulously curated to help you elevate your skills
        and career.
      </p>
    </div>
  );
};
