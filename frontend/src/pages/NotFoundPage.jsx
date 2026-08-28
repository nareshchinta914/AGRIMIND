import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home, Bot } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-agri-100 text-agri-700 flex items-center justify-center mx-auto shadow-lg">
          <Sprout className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display">404</h1>
          <h2 className="text-xl font-bold text-slate-800 font-display">Field Not Found</h2>
          <p className="text-sm text-slate-500">
            The agricultural page or tool you are looking for might have been moved or does not exist.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/ai-assistant">
            <Button variant="outline" size="md" icon={Bot}>
              Ask Kisan AI
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
