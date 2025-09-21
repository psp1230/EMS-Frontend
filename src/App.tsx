import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouterProvider from '@/RouterWaiter';
import routes from '@/router';
import onRouteBefore from '@/router/onRouteBefore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

function App() {
  const queryClient = new QueryClient();
  const AppContent = (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider routes={routes} onRouteBefore={onRouteBefore} />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );

  return AppContent
}

export default App;
