
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { User } from './types';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header 
        currentUser={currentUser}
        users={MOCK_USERS}
        onUserChange={(userId) => {
          const newUser = MOCK_USERS.find(u => u.id === parseInt(userId, 10));
          if (newUser) setCurrentUser(newUser);
        }}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard currentUser={currentUser} />
      </main>
    </div>
  );
};

export default App;
