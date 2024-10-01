// NOTE: при написании pet project, я вполне допускаю комментарии и in English, and/or in Russian language
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import store from './model/RootStore'
// import Launcher from './components/Launcher.tsx';
import mockups from './mockups/index.ts';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext } from './Contexts.ts';

// import { StrictMode } from 'react' // чего только не придумают; twice is better than 17 times?

// import rawData from './data-default.csv' with { type: "text" }; 
// TODO: было бы полезно разобраться, почему не пашет // NOTE: такие TODO остаются TODO

store.launchStore.setElementsCSV(mockups.elements.v1);
store.launchStore.start();

createRoot(document.getElementById('root')!).render(
  <>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </>
)
