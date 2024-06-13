import React, { lazy, Suspense, startTransition } from 'react';

// Lazy-loaded components
const App = lazy(() => import('./App'));



const LazyLoader = () => {
 return (
   <Suspense fallback={<div>Loading...</div>}>
     <button onClick={() => {/* Your state-setting or other logic */}}>
       Render Lazy Component
     </button>
     <App />
   </Suspense>
 );
};

export default LazyLoader;