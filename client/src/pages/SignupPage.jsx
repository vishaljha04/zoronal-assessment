import { Link } from 'react-router-dom';

const SignupPage = () => {
  return (
    <div className="pt-16 text-center">
      <div className="text-2xl font-semibold text-text-h">Sign Up</div>
      <div className="mt-2 text-sm text-text">Auth is not implemented yet.</div>
      <Link to="/" className="mt-6 inline-block text-accent">
        ← Back to Home
      </Link>
    </div>
  );
};

export default SignupPage;

