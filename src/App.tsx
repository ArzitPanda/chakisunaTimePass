import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Input,
  TextField,
} from "@mui/material";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ClearIcon from "@mui/icons-material/Clear";
import AlertDialog from "./component/AlertDialog";








function App() {
  const [tile, setTile] = useState<number>(0);
  const [populate, setPopulate] = useState<number>(3);
  const mat = new Array<number[]>(3).fill(new Array<number>(3).fill(0));
  const [matrix, setMatrix] = useState<number[][]>(mat);
  const [winnerCheck, setWinnerCheck] = useState<boolean>(false);
  const [pIndex, setPidx] = useState<number>(0);
  const [cIndex, setCidx] = useState<number>(0);
  const [initial, setInitial] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [turn, setTurn] = useState<boolean>(false);


  const [message, setMessage] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  //false means X is 1;
  //true means o is 2;

  const changeTurn = () => {
    setTurn(!turn);
  };

  const gameReset = (): void => {
    setCidx(0);
    setPidx(0);
    setInitial(true);
    setCount(0);
    const mat = Array.from({ length: populate }, () => Array(populate).fill(0));
    setMatrix(mat);
  };

  const modifyTile = (pIdx: number, cIdx: number, e: any) => {
    setPidx(pIdx);
    setCidx(cIdx);
    setCount(count + 1);

    // e.persist();
    if (matrix && matrix[pIdx] && matrix[pIdx][cIdx] === 0) {
      const newMatrix = matrix.map((row, rowIndex) =>
        rowIndex === pIdx
          ? row.map((value, colIndex) =>
              colIndex === cIdx ? (turn ? 2 : 1) : value
            )
          : row
      );

      setMatrix(newMatrix);
      // winnerCheckfunc();
      // changeTurn();
      // console.log(matrix);
    }
  };

  const handleTileSet = (e: any) => {
    e.preventDefault();
    if (tile > 12) {
      alert("please enter value less than 13");
      setTile(0);
      return;
    }

    setPopulate(tile);

    // changeTurn();

    // console.log(matrix);
    setTile(0);
  };

  const winnerCheckfunc = () => {
    if (initial) {
      setInitial(false);
      return;
    }

    if (isCorner(pIndex, cIndex)) {
      let digRes = isDiagonalAllSame(pIndex, cIndex);
      if (digRes && matrix && matrix[pIndex] && matrix[pIndex][cIndex] !== 0) {
        console.log("winner");
        setOpenModal(true);
        setMessage(`${turn ? "O" : "X"} is winner `);

        let a = localStorage.getItem(turn ? "O" : "X");
        if (a) {
          let value = parseInt(a);
          localStorage.setItem(turn ? "O" : "X", (value + 1).toString());
        } else {
          localStorage.setItem(turn ? "O" : "X", "1");
        }

        setTimeout(() => {
          setOpenModal(false);
        }, 2000);
        gameReset();
        return;
      }
    }

    if (
      (isColumnAllSame(cIndex) || isRowAllSame(pIndex)) &&
      matrix &&
      matrix[pIndex] &&
      matrix[pIndex][cIndex] !== 0
    ) {
      console.log("winner");
      setOpenModal(true);
      setMessage(`${turn ? "O" : "X"} is winner `);
      let a = localStorage.getItem(turn ? "O" : "X");
      if (a) {
        let value = parseInt(a);
        localStorage.setItem(turn ? "O" : "X", (value + 1).toString());
      } else {
        localStorage.setItem(turn ? "O" : "X", "1");
      }

      setTimeout(() => {
        setOpenModal(false);
      }, 2000);
      gameReset();
      return;
    }

    console.log(count);
    if (count === populate * populate) {
      setOpenModal(true);
      setMessage(`match tied`);
      let a = localStorage.getItem("T");
      if (a) {
        let value = parseInt(a);
        localStorage.setItem("T", (value + 1).toString());
      } else {
        localStorage.setItem("T", "1");
      }
      setTimeout(() => {
        setOpenModal(false);
      }, 2000);
      gameReset();
      return;
    }

    changeTurn();
  };

  const isCorner = (pIdx: number, cIdx: number): boolean => {
    const isCorner = pIdx === cIdx || pIdx + cIdx === matrix[0].length - 1;
    if (isCorner) {
      return true;
    }
    return false;
  };

  const isDiagonalAllSame = (pIdx: number, cIdx: number): boolean => {
    if (
      !matrix ||
      pIdx < 0 ||
      pIdx >= matrix.length ||
      cIdx < 0 ||
      cIdx >= matrix[0].length
    ) {
      return false;
    }

    // Check if the position is in a corner
    const isCorner = pIdx === cIdx || pIdx + cIdx === matrix[0].length - 1;
    console.log(isCorner);
    if (!isCorner) {
      return false;
    }

    const topLeftValue = turn ? 2 : 1;
    // const topRightValue = matrix[0][matrix[0].length - 1];

    // Check diagonal from top-left to bottom-right
    if (pIdx === cIdx) {
      console.log(pIdx, cIdx);
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][i] !== topLeftValue) {
          return false;
        }
      }

      return true;
    } else {
      console.log(pIdx + cIdx);
      if (pIdx + cIdx === matrix[0].length - 1) {
        console.log("Check diagonal from");
        for (let i = 0; i < matrix.length; i++) {
          console.log(matrix.length - 1 - i, i);
          if (matrix[matrix.length - 1 - i][i] !== topLeftValue) {
            return false;
          }
        }

        return true;
      }

      return false;
    }

    // Check diagonal from top-right to bottom-left
  };
  const [RowsCount, SetRowsCount] = useState<number>(0);
  const [ColumnCount, SetColumnCount] = useState<number>(0);

  const isRowAllSame = (rowIndex: number): boolean => {
    if (!matrix || rowIndex < 0 || rowIndex >= matrix.length) {
      return false;
    }

    const row = matrix[rowIndex];
    const firstValue = turn ? 2 : 1;
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== firstValue) {
        return false;
      }
    }

    return true;
  };

  const isColumnAllSame = (colIndex: number): boolean => {
    if (!matrix || colIndex < 0 || colIndex >= matrix[0]?.length) {
      return false;
    }

    const firstValue = turn ? 2 : 1;

    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i][colIndex] !== firstValue) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const mat = Array.from({ length: populate }, () => Array(populate).fill(0));
    setMatrix(mat);
  }, [populate]);

  useEffect(() => {
    console.log(matrix);
    winnerCheckfunc();
  }, [matrix]);

  return (
    <div className="App">
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100vh",
          flexDirection: "column",
          rowGap: 12,
          paddingY: 20,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            alignItems: "center",
            columnGap: { md: 2 },
            rowGap: { sm: 4, md: 2, xs: 2 },
          }}
        >
          <TextField
            placeholder="enter title"
            variant="filled"
            // value={tile}
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value);
              setTile(isNaN(parsedValue) ? 0 : parsedValue);
            }}
          />
          <Button
            onClick={(e) => {
              handleTileSet(e);
            }}
            variant="outlined"
            type="button"
            color="primary"
            title="enter"
          >
            go
          </Button>
        </Box>

        <Grid container spacing={1} rowSpacing={1} xs={12} sx={{}}>
          {matrix?.map((parentele, Pidx) => {
            return (
              <Grid
                xs={12}
                rowGap={1}
                sx={{
                  display: "flex",
                  columnGap: 1,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {matrix[Pidx]?.map((childele, Cidx) => {
                  return (
                    <div
                      key={`${Pidx}-${Cidx}`}
                      className="smallBox"
                      style={{
                        backgroundColor:
                          childele === 0
                            ? `gray`
                            : childele === 1
                            ? `#005cbf`
                            : `#ff6f31`,
                      }}
                      onClick={(e) => modifyTile(Pidx, Cidx, e)}
                    >
                        {/* <div className="horizontal-line"></div> */}
                      {matrix[Pidx][Cidx] === 2 ? (
                        <PanoramaFishEyeIcon
                          htmlColor="white"
                          sx={{ width: "90%", height: "90%" }}
                        />
                      ) : matrix[Pidx][Cidx] === 1 ? (
                        <ClearIcon
                          htmlColor="white"
                          sx={{ width: "90%", height: "90%" }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column",
              position: "relative"
            }}
          >
         

            <PanoramaFishEyeIcon
              htmlColor="#005cbf"
              sx={{ width: "90px", height: "90px" }}
            />{" "}
            {localStorage.getItem("O") || 0}{" "}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <ClearIcon
              htmlColor="#ff6f31"
              sx={{ width: "90px", height: "90px" }}
            />{" "}
            {localStorage.getItem("X") || 0}{" "}
          </div>
        </div>
      </Container>
      <AlertDialog message={message} open={openModal} />
    </div>
  );
}

export default App;
