const Background = () => {
  return (
    <div className="absolute inset-0 -z-10 w-full h-screen overflow-hidden"> {/* Use h-screen to cover full height */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Background;

   