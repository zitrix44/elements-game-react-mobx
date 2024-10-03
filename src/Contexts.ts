import {createContext,useContext} from "react"
import store, { RootStore } from './model/RootStore'

const StoreContext = createContext<RootStore>(store);

export { StoreContext, RootStore, useContext };