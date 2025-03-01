import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, PieChart, DollarSign, Bell, PlusCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          <div className="hidden md:flex md:space-x-8">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/add-expense"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Expense
            </NavLink>
            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              View Expenses
            </NavLink>
            <NavLink
              to="/distribution"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              <PieChart className="h-4 w-4 mr-2" />
              Analytics
            </NavLink>
            <NavLink
              to="/budget"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              Budget Settings
            </NavLink>
            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </NavLink>
          </div>

          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/add-expense"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Add Expense
          </NavLink>
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            View Expenses
          </NavLink>
          <NavLink
            to="/distribution"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Analytics
          </NavLink>
          <NavLink
            to="/budget"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Budget Settings
          </NavLink>
          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Alerts
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
          >
            <div className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}