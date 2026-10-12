"use client";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src="/assets/hulumart-logo.avif"
            alt="Hulumart loading"
            className="w-40 h-auto object-contain animate-pulse"
          />
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
