import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Space,
  InputNumber,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SortOrder } from "antd/lib/table/interface";
import dayjs, { Dayjs } from "dayjs";

const { Title } = Typography;

// Определяем тип данных
interface DataType {
  key: number;
  name: string;
  date: string; // хранится как строка в формате YYYY-MM-DD
  value: number;
}

// Пропсы формы
interface FormValues {
  name: string;
  date: Dayjs;
  value: number;
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [form] = Form.useForm();

  // Форматирование даты
  const formatDate = (date: Dayjs): string => date.format("YYYY-MM-DD");
  const parseDate = (dateString: string): Dayjs => dayjs(dateString);

  // Открытие модального окна
  const showModal = (): void => {
    form.resetFields();
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  // Обработка отправки формы
  const handleOk = (): void => {
    form
      .validateFields()
      .then((values: FormValues) => {
        const formattedValues: DataType = {
          ...values,
          date: formatDate(values.date),
          key: editingRecord?.key || Date.now(),
        };
        if (editingRecord) {
          setData(
            data.map((item) =>
              item.key === editingRecord.key ? formattedValues : item
            )
          );
        } else {
          setData([...data, formattedValues]);
        }
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.log("Ошибка валидации:", errorInfo);
      });
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Удаление строки
  const deleteRow = (key: number): void => {
    setData(data.filter((item) => item.key !== key));
  };

  // Редактирование строки
  const editRow = (record: DataType): void => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: parseDate(record.date),
    });
    setIsModalOpen(true);
  };

  // Фильтрация данных
  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => dayjs(a.date).diff(dayjs(b.date)),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Число",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value - b.value,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Действия",
      dataIndex: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => editRow(record)}>Редактировать</Button>
          <Button danger onClick={() => deleteRow(record.key)}>
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <Title level={3}>Таблица данных</Title>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Поиск по таблице"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={showModal}>
          Добавить
        </Button>
      </div>

      <Table dataSource={filteredData} columns={columns} />

      <Modal
        title={editingRecord ? "Редактировать запись" : "Добавить запись"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item<FormValues>
            label="Имя"
            name="name"
            rules={[{ required: true, message: "Введите имя!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FormValues>
            label="Дата"
            name="date"
            rules={[{ required: true, message: "Выберите дату!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item<FormValues>
            label="Число"
            name="value"
            rules={[
              { required: true, message: "Введите число!" },
              {
                type: "number",
                min: 0,
                message: "Число должно быть больше или равно 0",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;
