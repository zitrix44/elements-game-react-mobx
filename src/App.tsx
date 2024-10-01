import { StoreContext } from './Contexts'
import { RootStore } from './model/RootStore'
import Launcher from './components/Launcher'
import Game from './Game'
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';


const App = observer(() => {
  const rootStore = useContext<RootStore>(StoreContext);
  return (
      rootStore.launchStore.active ? <Launcher /> : <Game />
  )
});

export default App;
