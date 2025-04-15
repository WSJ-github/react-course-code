import './App.css';
import Space from './Space';
import { ConfigProvider } from './Space/ConfigProvider';
import Test, {TestInner} from './Test'

export default function App() {
  return <div>
    <ConfigProvider space={{ size: 20 }}>
      <Space direction="horizontal">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
      <Space direction="vertical">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </Space>
    </ConfigProvider>
    <Test>
      <TestInner>
        <div>TestInner-content</div>
      </TestInner>
    </Test>
  </div>
}