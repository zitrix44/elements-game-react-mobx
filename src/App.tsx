import { StoreContext } from './Contexts';
import { RootStore } from './model/RootStore';
import Launcher from './components/Launcher';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import PageGame from './pages/PageGame';


const App = observer(() => {
  const rootStore = useContext<RootStore>(StoreContext);
  return (
      rootStore.launchStore.active ? <Launcher /> : <PageGame />
  )
});

export default App;
