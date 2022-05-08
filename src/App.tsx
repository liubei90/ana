import { useState } from "react";
import { Button, Space } from "antd";
import "antd/dist/antd.css";

import AddModuleModal from "./components/AddModuleModal";
import ModuleItem from "./components/ModuleItem";
import ModulesAvgModal from './components/ModulesAvgModal';
import { useModules, getDefaultModuleItem, IModule, IModuleItem } from "./stores";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const modules = useModules((state) => state.modules);
  const pushModules = useModules((state) => state.pushModules);
  const replaceModule = useModules((state) => state.replaceModule);
  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const onAddModuleModal = (values: any) => {
    console.log(values);
    setAddModuleModalVisible(false);

    const module: IModule = {
      project: values.project,
      date: values.date,
      list: [],
    };

    (values.nameList || []).forEach(
      ({ name, count }: { name: string; count: string }) => {
        Array(Number(count))
          .fill("1")
          .forEach(() => {
            module.list.push(getDefaultModuleItem({
              name,
            }));
          });
      }
    );

    pushModules([module]);
  };

  const onChange = (index: number, module: IModule) => {
    replaceModule(index, module);
  };

  const [moduleAvgModalVisible, setModuleAvgModalVisible] = useState(false);
  const onCalc = () => {
    setModuleAvgModalVisible(true);
  }

  return (
    <>
      <div className="App">
      <Space className="actions">
        <Button type="primary" onClick={() => setAddModuleModalVisible(true)}>
          新增
        </Button>
        <Button type="primary" onClick={onCalc}>
          均值
        </Button>
      </Space>
        <div className="modules">
          {modules.map((item, index) => (
            <ModuleItem item={item} itemIndex={index} onChange={(module) => { onChange(index, module) }} />
          ))}
        </div>
      </div>
      <AddModuleModal
        visible={addModuleModalVisible}
        onConfirm={onAddModuleModal}
        onCancel={() => {
          setAddModuleModalVisible(false);
        }}
      />
      <ModulesAvgModal visible={moduleAvgModalVisible} onCancel={() => { setModuleAvgModalVisible(false) }} />
    </>
  );
}

export default App;
