import { useEffect, useState } from "react";
import { Modal, Form, Input, Space, Button } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';


interface Props {
  visible: boolean;
  onConfirm?: (values: any) => void;
  onCancel?: () => void;
}

function AddModuleModal(props: Props) {
  const { visible, onConfirm, onCancel: onCancelProp } = props;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    onConfirm?.(values);
  };

  const onOk = () => {
    form.submit();
  };
  const onCancel = () => {
    onCancelProp?.();
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        project: '',
        date: '',
        nameList: [
          { name: '', count: 1 }
        ],
      });
    }
  }, [visible]);

  return (
    <Modal title="新增模块" visible={visible} onOk={onOk} onCancel={onCancel}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item label="项目" name="project">
          <Input />
        </Form.Item>
        <Form.Item label="时间" name="date">
          <Input />
        </Form.Item>
        <Form.List name="nameList">
          {(fields, { add, remove }) => (<>
            {fields.map(({ key, name, ...restField }, index) => (<Space>
              <Form.Item label="名称" name={[name, 'name']}>
                <Input />
              </Form.Item>
              <Form.Item label="数量" name={[name, 'count']}>
                <Input />
              </Form.Item>
              <Button icon={<PlusCircleOutlined />} onClick={() => { add() }} />
              { index !== 0 && <Button  icon={<MinusCircleOutlined />} onClick={() => { remove(name) }} /> }
            </Space>))}
          </>)}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default AddModuleModal;
