import { useEffect, useState } from "react";
import { Modal, Form, Input, Space, Button, Table } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import ExcelJS from "exceljs";

import downloadFile from "../downloadFile";
import {
  useModules,
  getDefaultModuleItem,
  calcAvg,
  IModule,
  IModuleItem,
} from "../stores";

interface Props {
  visible: boolean;
  onCancel?: () => void;
}

function ModulesAvgModal(props: Props) {
  const { visible, onCancel: onCancelProp } = props;
  const modules = useModules((state) => state.modules);
  const [avgs, setAvgs] = useState<any[][]>([]);
  const [reversalAvgs, setReversalAvgs] = useState<any[][]>([]);

  const [loading, setLoading] = useState(false);
  const onOk = async () => {
    setLoading(true);

    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("均值计算");
    
        sheet.addRows(reversalAvgs);
    
        const buffer = await workbook.xlsx.writeBuffer();
        const filtName = `均值计算_${String(Math.random()).slice(2)}.xlsx`;
    
        downloadFile(buffer, filtName);
        onCancelProp?.();
    } finally {
        setLoading(false);
    }
  };
  const onCancel = () => {
    onCancelProp?.();
  };

  function reversalList(list: any[][]) {
    const x = list.length;
    const y = (list[0] || []).length;

    if (!x || !y) return [];

    const res: any[][] = Array(y)
      .fill("")
      .map((item) => {
        return Array(x).fill("");
      });

    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        res[j][i] = list[i][j];
      }
    }

    return res;
  }

  useEffect(() => {
    if (visible) {
      const names = new Set<string>();

      modules.forEach(({ list }) => {
        list.forEach((item) => {
          names.add(item.name);
        });
      });

      const nameList = Array.from(names);

      const res = [["项目", "时间", "名称", ...nameList]];
      modules.forEach((module) => {
        const { project, date, list } = module;
        const moduleAvgs = calcAvg(module);
        const moduleAvgMap: { [key: string]: IModuleItem } = {};

        moduleAvgs.forEach((avg) => {
          moduleAvgMap[avg.name] = avg;
        });

        // 浓度值平均值
        const densityItem: any = [project, date, "浓度值平均值"];

        nameList.forEach((name) => {
          densityItem.push(
            (moduleAvgMap[name] && moduleAvgMap[name].density) || "0"
          );
        });
        res.push(densityItem);

        // 发光值平均值
        const luminosityItem: any[] = [project, date, "发光值平均值"];

        nameList.forEach((name) => {
          luminosityItem.push(
            (moduleAvgMap[name] && moduleAvgMap[name].luminosity) || "0"
          );
        });
        res.push(luminosityItem);
      });

      setAvgs(res);
      setReversalAvgs(reversalList(res));
      console.log(res, reversalList(res));
    }
  }, [visible]);

  const getDataSources = () => {
    const [_, ...rows] = reversalAvgs;
    return rows;
  };

  const getColumns = () => {
    const header = reversalAvgs[0] || [];
    const datasource = getDataSources();

    return header.map((h, index) => ({
      [index === 0 ? "fixed" : ""]: "left",
      title: h,
      key: index,
      ellipsis: { showTitle: true },
      render: (text: any, record: any, rowIndex: number) => {
        return datasource[rowIndex][index];
      },
    }));
  };

  return (
    <Modal
      title="模块均值"
      width={800}
      visible={visible}
      cancelText="取消"
      okText="导出"
      confirmLoading={loading}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Table
        columns={getColumns()}
        dataSource={getDataSources()}
        pagination={false}
        scroll={{ x: true }}
      />
    </Modal>
  );
}

export default ModulesAvgModal;
