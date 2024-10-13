import { StoreContext } from './Contexts';
import { RootStore } from './model/RootStore';
import Launcher from './components/Launcher';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import PageGame from './pages/PageGame';
import CardShapesDefine from './components/ThemeSettings/CardShapesDefine';
import ColorSchemesDefine from './components/ThemeSettings/ColorSchemesDefine';


const App = observer(() => {
  const rootStore = useContext<RootStore>(StoreContext);
  return (
    <>
      <div>
        <CardShapesDefine />
        <ColorSchemesDefine />
      </div>
      { rootStore.launchStore.active ? <Launcher key="Launcher" /> : <PageGame key="PageGame" /> }
    </>
  )
});

export default App;
