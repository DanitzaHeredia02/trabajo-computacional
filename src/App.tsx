import "./App.css";
import React from "react";

const Matrix = ({ matrix }: { matrix: boolean[][] }) => {
  return (
    <div className="booleanMatrix">
      {matrix.map((row, i) => (
        <div className="row" key={i}>
          {row.map((value, j) => (
            <div className="cell" key={j}>
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
  const generateBooleanMatrix = (n: number): void => {
    const matrix: boolean[][] = [];
    for (let i = 0; i < n; i++) {
      matrix.push([]);
      for (let j = 0; j < n; j++) {
        matrix[i].push(Math.random() < 0.5);
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
        </div>
      }
    </main>
  );
}

export default App;
