import React, { memo } from 'react';
import { FaCopy, FaCheckCircle } from 'react-icons/fa';

interface MenuItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  component: React.ReactNode;
  linkPath: string;
}

const MenuItemCard: React.FC<MenuItemProps> = ({
  label,
  description,
  badge,
  component,
  linkPath,
}) => {
  const handleCopyLink = () => {
    const fullUrl = window.location.origin + linkPath;
    navigator.clipboard.writeText(fullUrl);
    alert('Link copiado!');
  };

  return (
    <div>
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-blue-500 text-xl" />
            <div>
              <h3 className="font-bold text-blue-900">{label}</h3>
              <p className="text-sm text-blue-800">{description}</p>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
          >
            <FaCopy /> Copiar Link
          </button>
        </div>
      </div>
      {component}
    </div>
  );
};

export default memo(MenuItemCard);
