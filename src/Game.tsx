import { StoreContext } from './Contexts';
import store, { RootStore } from './model/RootStore';
import { PageDebug } from './pages';


function Game() {
  return (
    <StoreContext.Provider value={store}>
        <PageDebug />
    </StoreContext.Provider>
  )
}

export default Game;
