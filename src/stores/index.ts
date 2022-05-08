import Item from "antd/lib/list/Item";
import create from "zustand";

export interface IModuleItem {
  name: string;
  density: string; // 浓度
  luminosity: string; // 发光度
}

export interface IModule {
  project: string;
  date: string;
  list: IModuleItem[];
}

interface ModuleState {
  modules: IModule[];
  setModules: (v: IModule[]) => void;
  pushModules: (v: IModule[]) => void;
  replaceModule: (index: number, v: IModule) => void;
}

export function getDefaultModuleItem({ name = '', density = '', luminosity = '' } = {}): IModuleItem {
    return {
        name,
        density,
        luminosity,
    }
}

export function calcAvg(module: IModule): IModuleItem[] {
    const { list } = module;
    const names = Array.from(new Set(list.map((item) => item.name).filter(Boolean)));
    const res: IModuleItem[] = [];

    names.forEach((name) => {
        const items = list.filter((item) => item.name === name);
        const densityAvg = items.reduce((sum, item) => (sum + (Number(item.density) || 0)), 0) / items.length;
        const luminosityAvg =items.reduce((sum, item) => (sum + (Number(item.luminosity) || 0)), 0) / items.length;

        res.push(getDefaultModuleItem({
            name,
            density: String(densityAvg),
            luminosity: String(luminosityAvg),
        }))
    });

    return res;
}

const useModules = create<ModuleState>((set) => ({
  modules: [],
  setModules: (modules: IModule[]) => set({ modules: modules || [] }),
  pushModules: (modules: IModule[]) =>
    set((state) => ({ modules: [...(state.modules || []), ...modules] })),
  replaceModule: (index: number, module: IModule) =>
    set((state) => {
      const oldModules = state.modules || [];
      oldModules[index] = module;
      return { modules: [...oldModules] };
    }),
}));

export { useModules };
