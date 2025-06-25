export const AnimatedDots = () => (
  <span className="inline-block" aria-label="Loading" role="status">
    <span className="inline-block animate-bounce" style={{ animationDelay: "0s" }}>.</span>
    <span className="inline-block animate-bounce" style={{ animationDelay: "0.15s" }}>.</span>
    <span className="inline-block animate-bounce" style={{ animationDelay: "0.3s" }}>.</span>
  </span>
);
