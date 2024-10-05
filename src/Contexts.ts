import {createContext,useContext} from "react"
import store, { RootStore } from './model/RootStore'

const StoreContext = createContext<RootStore>(store);

export { StoreContext, RootStore, useContext };

const useRootStore = () => {
  const store = useContext(StoreContext);
  // TODO: заменить [store] на store
  return [store];
};

export default useRootStore;