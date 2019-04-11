import {createContext, useContext, useEffect, useState} from "react";
import {GlobalContext} from "./context";
import {GlobalAPI, IntegrationStatus} from "./models";

export const Global = createContext<GlobalAPI>(GlobalContext);
