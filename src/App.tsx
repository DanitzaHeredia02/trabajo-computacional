import "./App.css";
import React from "react";

const Matrix = ({
  matrix,
  paintDiagonal = false,
}: {
  matrix: boolean[][];
  paintDiagonal?: boolean;
}) => {
  return (
    <div className="booleanMatrix">
      {matrix.map((row, i) => (
        <div className="row" key={i}>
          {row.map((value, j) => (
            <div
              className="cell"
              key={j}
              style={{
                backgroundColor: paintDiagonal && i === j ? "red" : undefined,
              }}
            >
              {value ? 1 : 0}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [n, setN] = React.useState(0);
  const [submitedN, setSubmitedN] = React.useState(0);
  const [booleanMatrix, setBooleanMatrix] = React.useState<boolean[][]>([]);
  const [caminos, setCaminos] = React.useState<boolean[][]>([]);
  const [sortedRows, setSortedRows] = React.useState<boolean[][]>([]);
  const [sortedColumns, setSortedColumns] = React.useState<boolean[][]>([]);

  const generateBooleanMatrix = (n: number): void => {
    const matrix: boolean[][] = [];
    for (let i = 0; i < n; i++) {
      matrix.push([]);
      for (let j = 0; j < n; j++) {
        matrix[i].push(Math.random() < 0.3);
      }
    }
    setBooleanMatrix(matrix);
    calculateCaminos(matrix);
  };
  const calculateCaminos = (matrix: boolean[][]): void => {
    const rows = matrix.length;
    const caminos = matrix.map((row) => row.map((value) => value));
    const procedimiento: boolean[][][] = [];
    for (let i = 0; i < rows; i++) {
      caminos[i][i] = true;
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < rows; j++) {
        if (i === j || caminos[i][j] === false) {
          continue;
        } else {
          let regresar = false;
          for (let k = 0; k < rows; k++) {
            if (caminos[j][k] && caminos[i][k] === false) {
              caminos[i][k] = true;
              if (k < j) {
                regresar = true;
              }
            }
          }
          if (regresar) {
            j = -1;
          }
        }
      }
      procedimiento.push(caminos.map((row) => row.map((value) => value)));
    }
    setCaminos(caminos);
    sortRows(caminos);
  };

  const sortRows = (matrix: boolean[][]): void => {
    const counter: {
      [key: number]: {
        ones: number;
        firstOne: number;
      };
    } = {};
    const rows = matrix.length;
    for (let i = 0; i < rows; i++) {
      let ones = 0;
      let firstOne = -1;
      for (let j = 0; j < rows; j++) {
        if (matrix[i][j]) {
          ones++;
          if (firstOne === -1) {
            firstOne = j;
          }
        }
      }
      counter[i] = { ones, firstOne };
    }
    // sort rows by ones, then by firstOne
    const sortedRows = Object.keys(counter)
      .map((key) => parseInt(key))
      .sort((a, b) => {
        if (counter[a].ones === counter[b].ones) {
          return counter[b].firstOne - counter[a].firstOne;
        } else {
          return counter[b].ones - counter[a].ones;
        }
      });
    const sortedMatrix = sortedRows.map((row) => matrix[row]);
    setSortedRows(sortedMatrix);
    sortColumns(sortedMatrix);
  };
  const sortColumns = (matrix: boolean[][]): void => {
    // sort columns by ones, then by firstOne
    const counter: {
      [key: number]: {
        ones: number;
        firstOne: number;
      };
    } = {};
    const columns = matrix.length;
    for (let i = 0; i < columns; i++) {
      let ones = 0;
      let firstOne = -1;
      for (let j = 0; j < columns; j++) {
        if (matrix[j][i]) {
          ones++;
          if (firstOne === -1) {
            firstOne = j;
          }
        }
      }
      counter[i] = { ones, firstOne };
    }
    const sortedColumns = Object.keys(counter)
      .map((key) => parseInt(key))
      .sort((a, b) => {
        if (counter[a].ones === counter[b].ones) {
          return counter[b].firstOne - counter[a].firstOne;
        } else {
          return counter[b].ones - counter[a].ones;
        }
      });
    const sortedMatrix = matrix.map((row) =>
      sortedColumns.map((column) => row[column])
    );
    setSortedColumns(sortedMatrix);
  };
  return (
    <main className="main">
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          generateBooleanMatrix(n);
          setSubmitedN(n);
        }}
      >
        <h2>Generar Matriz</h2>
        <div>
          <label htmlFor="n">Numero de nodos</label>
          <input
            type="number"
            name="n"
            id="n"
            value={n}
            min={5}
            max={15}
            onChange={(e) => setN(parseInt(e.target.value))}
          />
        </div>
        <button type="submit">Generar</button>
      </form>
      {
        <div className="graficos">
          <div className="matrizAdyacencia">
            <h2>
              Matriz de Adyacencia {submitedN} x {submitedN}
            </h2>
            <div>
              {booleanMatrix.length > 0 && <Matrix matrix={booleanMatrix} />}
            </div>
          </div>
          <div className="matrizCaminos">
            <div>
              <h2>Matriz de Caminos</h2>
            </div>
            <div>{caminos.length > 0 && <Matrix matrix={caminos} />}</div>
          </div>
          <div className="sortedRows">
            <div>
              <h2>Sorted Rows</h2>
            </div>
            <div>{sortedRows.length > 0 && <Matrix matrix={sortedRows} />}</div>
          </div>
          <div className="sortedColumns">
            <div>
              <h2>Sorted Columns</h2>
            </div>
            <div>
              {sortedColumns.length > 0 && (
                <Matrix matrix={sortedColumns} paintDiagonal />
              )}
            </div>
          </div>
        </div>
      }
    </main>
  );
}

export default App;
