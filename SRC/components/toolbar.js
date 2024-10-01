import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const CoordinatesDisplay = styled.div`
  padding-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  font-family: monospace;
`;

const Toolbar = ({ undo, redo, finishLine, history, currentLine }) => {
  return (
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
  );
};

export default Toolbar;
