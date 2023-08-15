const Suspense = ({ children, loading, fallback: Fallback = () => null }) => {
  if (loading) return <Fallback />;
  return children;
}

export default Suspense;