import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show back button on home page or user dashboard home
    if (location.pathname === '/' || location.pathname === '/user') {
        return null;
    }

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className="fixed top-20 left-4 z-50 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 flex items-center gap-2 hover:shadow-xl"
            aria-label="Go back to previous page"
        >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
        </button>
    );
};

export default BackButton;
