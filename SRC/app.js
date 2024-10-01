import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const FieldContainer = styled.div`
  flex: 3;
  background-color: #f0f0f0;
`;

const MenuContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CoordinatesDisplay = styled.div`
  padding-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  font-family: monospace;
`;

const Button = styled.button`
  margin: 5px 0;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const App = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  const [history, setHistory] = useState([]);
  const stageRef = useRef(null);

  // Обработчик кликов на поле
  const handleClick = (e) => {
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setCurrentLine([...currentLine, point.x, point.y]);
  };

  // Завершение линии (по клику правой кнопкой)
  const finishLine = () => {
    if (currentLine.length >= 4) {
      setLines([...lines, currentLine]);
      setHistory([...history, [...currentLine]]);
    }
    setCurrentLine([]);
  };

  // Отмена последнего хода
  const undo = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const removedLine = newHistory.pop();
      setLines(lines.filter(line => line !== removedLine));
      setHistory(newHistory);
    }
  };

  // Возврат хода
  const redo = () => {
    if (currentLine.length > 0) {
      setLines([...lines, currentLine]);
      setCurrentLine([]);
    }
  };

  return (
    <AppContainer>
      <FieldContainer>
        <Stage
          width={window.innerWidth * 0.75}
          height={window.innerHeight}
          onClick={handleClick}
          ref={stageRef}
          onContextMenu={(e) => {
            e.evt.preventDefault();
            finishLine();
          }}
        >
          <Layer>
            {/* Сетка */}
            <Text text="Рисуем по координатам" x={10} y={10} />
            {/* Линии */}
            {lines.map((line, i) => (
              <Line key={i} points={line} stroke="black" strokeWidth={2} />
            ))}
            {/* Текущая линия */}
            {currentLine.length > 0 && (
              <Line points={currentLine} stroke="red" strokeWidth={2} />
            )}
          </Layer>
        </Stage>
      </FieldContainer>

      <MenuContainer>
        <div>
          <h3>Меню</h3>
          <Button onClick={undo} disabled={history.length === 0}>
            Отменить
          </Button>
          <Button onClick={redo} disabled={currentLine.length === 0}>
            Вернуть
          </Button>
          <Button onClick={finishLine} disabled={currentLine.length < 4}>
            Завершить линию
          </Button>
        </div>

        <CoordinatesDisplay>
          <h4>Координаты:</h4>
          <p>{JSON.stringify(history)}</p>
        </CoordinatesDisplay>
      </MenuContainer>
    </AppContainer>
  );
};

export default App;
