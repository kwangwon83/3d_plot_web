import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Plotly는 SSR 이슈가 있을 수 있으므로 동적 import로 클라이언트 사이드에서 로드합니다.
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
  // 좌표 데이터를 저장하는 상태. 초기 행 하나를 생성합니다.
  const [data, setData] = useState([{ x: '', y: '', z: '' }]);
  // Plot 버튼 클릭 시 생성되는 그래프 데이터 상태
  const [plotData, setPlotData] = useState(null);

  // 입력값이 바뀔 때 데이터를 업데이트하는 함수
  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  // 행 추가 기능: 사용자가 더 많은 좌표를 입력할 수 있도록 함
  const addRow = () => {
    setData([...data, { x: '', y: '', z: '' }]);
  };

  // Plot 버튼 클릭 시, 입력된 좌표를 숫자로 변환해 3D 그래프를 그리기 위한 데이터로 만듭니다.
  const handlePlot = () => {
    const x = [];
    const y = [];
    const z = [];
    data.forEach((row) => {
      if (row.x !== '' && row.y !== '' && row.z !== '') {
        x.push(Number(row.x));
        y.push(Number(row.y));
        z.push(Number(row.z));
      }
    });
    setPlotData({ x, y, z });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>3D 좌표 플로터</h1>
      {/* 좌표 입력 테이블 */}
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={row.x}
                  onChange={(e) => handleInputChange(index, 'x', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.y}
                  onChange={(e) => handleInputChange(index, 'y', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.z}
                  onChange={(e) => handleInputChange(index, 'z', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 행 추가 버튼 */}
      <button onClick={addRow}>행 추가</button>
      <br /><br />
      {/* Plot 버튼 */}
      <button onClick={handlePlot}>Plot</button>
      <div style={{ marginTop: '20px' }}>
        {/* Plot 버튼을 누른 후에만 그래프를 렌더링 */}
        {plotData && (
          <Plot
            data={[
              {
                x: plotData.x,
                y: plotData.y,
                z: plotData.z,
                mode: 'markers',
                type: 'scatter3d',
                marker: { size: 5 },
              },
            ]}
            layout={{ width: 700, height: 700, title: '3D 산점도' }}
          />
        )}
      </div>
    </div>
  );
}
