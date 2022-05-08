import { useEffect, useState } from "react";
import { Modal, Form, Input, Space, Button, Table, Tooltip } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

import { IModule, getDefaultModuleItem, calcAvg } from "../stores";

interface Props {
  itemIndex: number;
  item: IModule;
  onChange: (values: IModule) => void;
}

function ModuleItem(props: Props) {
  const { itemIndex, item, onChange: onChangeProp } = props;
  const itemAvg = calcAvg(item);
  console.log("itemAvg", itemAvg);
  const [form] = Form.useForm();
  const [avgVisible, setAvgVisible] = useState(false);

  const onChange = () => {
    const values = form.getFieldsValue();
    console.log("onChange", values);

    onChangeProp?.(values);
  };

  useEffect(() => {
    form.setFieldsValue({
      project: item.project,
      date: item.date,
      list: item.list,
    });
  }, []);

  return (
    <div>
      <Form form={form} size="small" onChange={onChange}>
        <Form.Item label="项目" name="project">
          <Input />
        </Form.Item>
        <Form.Item label="时间" name="date">
          <Input />
        </Form.Item>
        <Space>
          <Tooltip
            color="#fff"
            placement="bottom"
            key={String(itemIndex)}
            overlayInnerStyle={{ width: "380px" }}
            title={
              <Table
                columns={[
                  {
                    title: "名称",
                    width: "60px",
                    dataIndex: "name",
                  },
                  {
                    title: "浓度值",
                    width: "150px",
                    dataIndex: "density",
                  },
                  {
                    title: "发光值",
                    width: "150px",
                    dataIndex: "luminosity",
                  },
                ]}
                dataSource={itemAvg}
                pagination={false}
              />
            }
          >
            <Button
              type="primary"
              onClick={() => {
                setAvgVisible(true);
              }}
            >
              AVG
            </Button>
          </Tooltip>
        </Space>
        <Form.List name="list">
          {(fields, { add, remove }) => (
            <>
              <Table
                columns={[
                  {
                    title: "名称",
                    dataIndex: "name",
                    render: (text, record, index) => {
                      return (
                        <Form.Item label="" name={[fields[index].name, "name"]}>
                          <Input />
                        </Form.Item>
                      );
                    },
                  },
                  {
                    title: "浓度值",
                    dataIndex: "density",
                    render: (text, record, index) => {
                      return (
                        <Form.Item
                          label=""
                          name={[fields[index].name, "density"]}
                        >
                          <Input />
                        </Form.Item>
                      );
                    },
                  },
                  {
                    title: "发光值",
                    dataIndex: "luminosity",
                    render: (text, record, index) => {
                      return (
                        <Form.Item
                          label=""
                          name={[fields[index].name, "luminosity"]}
                        >
                          <Input />
                        </Form.Item>
                      );
                    },
                  },
                  {
                    title: "",
                    key: "operations",
                    width: "80px",
                    render: (text, record, index) => {
                      return (
                        <>
                          <Button
                            type="text"
                            icon={<PlusCircleOutlined />}
                            onClick={() => {
                              add(getDefaultModuleItem(), index + 1);
                              onChange();
                            }}
                          />
                          <Button
                            type="text"
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              remove(fields[index].name);
                              onChange();
                            }}
                          />
                        </>
                      );
                    },
                  },
                ]}
                dataSource={fields}
                pagination={false}
              />
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
}

export default ModuleItem;
