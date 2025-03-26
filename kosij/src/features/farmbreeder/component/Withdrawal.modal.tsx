import React from "react";
import { Modal, Input, Button, Form, message } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { createWithdrawalRequest } from "../api/wallet/create.api";

interface WithdrawalModalProps {
  visible: boolean;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: any) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  visible,
  onCancel,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      await createWithdrawalRequest({
        amount: Number(values.amount),
        bankName: values.bank,
        bankNumber: values.accountNumber,
        holderName: values.fullName,
      });
      message.success("Withdrawal request submitted successfully!");
      onCancel();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Failed to process withdrawal request.");
    }
  };
  return (
    <Modal
      title="Withdrawal Request"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <p style={{ color: "#6B7280" }}>
        Please fill in the details below to process your withdrawal
      </p>
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Account Number"
          name="accountNumber"
          rules={[{ required: true }]}
        >
          <Input placeholder="2458-7458-8521" />
        </Form.Item>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true }]}
        >
          <Input placeholder="John Anderson" />
        </Form.Item>
        <Form.Item label="Bank" name="bank" rules={[{ required: true }]}>
          <Input placeholder="Enter bank name" />
        </Form.Item>
        <Form.Item
          label="Amount to Withdraw"
          name="amount"
          // rules={[{ required: true, type: "number", min: 1 }]}
        >
          <Input prefix="₫" placeholder="0.00" type="number" />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
          >
            Submit Request
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default WithdrawalModal;
