import { Table as AntdTable } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { CommonComponentProps } from '../../interface';

const Table = ({ url, children }: CommonComponentProps) => {

  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    if (url) {
      setLoading(true);

      const { data } = await axios.get(url);
      setData(data);

      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = useMemo(() => {
    return React.Children.map(children, (item: any) => {
        if (item?.props?.type === 'date') {
            return {
                // item.props对应传入的子component内部传入的属性
                title: item.props?.title, // 表头
                dataIndex: item.props?.dataIndex, // dataIndex对应dataSource中当前字段的属性名
                render: (value: any) => value ? dayjs(value).format('YYYY-MM-DD') : null, // 自定义字段渲染函数
            }
        } else {
            return {
                title: item.props?.title,
                dataIndex: item.props?.dataIndex,
            }
        }
    })
  }, [children]);

  return (
    <AntdTable
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      loading={loading}
    />
  );
}

export default Table;
