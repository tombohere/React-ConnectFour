import React, { useState, useEffect } from "react";
import "./styles.css";

const App = () => (
  <div className="App">
    <Board />
  </div>
);

const Board = () => {
  const [game, setGame] = useState(makeBoard());

  useEffect(() => {
    // fit game to fill viewport
    function handleResize() {
      let game = document.getElementById("board").style;
      let info = document.getElementById("board-info").style;
      let [top] = document.getElementsByClassName("top-circle");
      let msgs = document.getElementsByClassName("board-message");
      let units = window.innerWidth > window.innerHeight ? "vh" : "vw";
      info.fontSize = "10" + units;
      game.height = game.width = "96" + units;
      game.fontSize = "10.34" + units;
      top.style.fontSize = "6" + units;
      top.style.lineHeight = "10" + units;
      for (let msg of msgs) msg.style.fontSize = "20" + units;
    }
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  function makeBoard() {
    let board = new Array(7);
    for (let i = 0; i < board.length; i++) {
      board[i] = [];
      for (let j = 0; j < 6; j++) {
        board[i].push(0);
      }
    }
    return {
      board,
      gameStarted: false,
      playerSelected: false,
      player1: true,
      count: 0,
      gameOver: false,
      playerWin: 0
    };
  }

  const startGame = () => {
    setGame({ ...game, gameStarted: true });
  };

  const restartGame = () => {
    let temp = makeBoard();
    temp.gameStarted = true;
    setGame(temp);
  };

  const checkWin = () => {
    let b = game.board;
    let t;
    for (let i = 0; i < 4; i++) {
      for (let j = 5; j >= 0; j--) {
        t = b[i][j] + b[i + 1][j] + b[i + 2][j] + b[i + 3][j];
        if (t === 4 || t === 20) return true;
      }
    }
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 7; i++) {
        t = b[i][j] + b[i][j + 1] + b[i][j + 2] + b[i][j + 3];
        if (t === 4 || t === 20) return true;
      }
    }
    for (let j = 5; j > 1; j--) {
      for (let i = 0; i < 4; i++) {
        t = b[i][j] + b[i + 1][j - 1] + b[i + 2][j - 2] + b[i + 3][j - 3];
        if (t === 4 || t === 20) return true;
        t = b[6 - i][j] + b[5 - i][j - 1] + b[4 - i][j - 2] + b[3 - i][j - 3];
        if (t === 4 || t === 20) return true;
      }
    }
    return false;
  };

  const colClick = n => {
    if (game.gameStarted && !game.gameOver) {
      let temp = { ...game };
      for (let i = temp.board[n].length - 1; i >= 0; i--) {
        if (temp.board[n][i] === 0) {
          temp.board[n][i] = temp.player1 ? 1 : 5;
          temp.count++;
          if (checkWin()) {
            temp.gameOver = true;
            temp.playerWin = temp.player1 ? 1 : 2;
          } else {
            if (temp.count === 42) {
              temp.gameOver = true;
            }
            temp.player1 = !temp.player1;
          }
          setGame(temp);
          break;
        }
      }
      checkWin();
    }
  };

  const playerColor = n => {
    if (n === 1) return " player1Color";
    if (n === 5) return " player2Color";
    return "";
  };

  const circleClass = () => {
    if (game.player1) {
      return " player1Color";
    } else {
      return " player2Color";
    }
  };

  return (
    <>
      <div id="board">
        <div className="board-container">
          <div />
          <div className="board-title-area">
            <div />
            <div className="board-position">
              <div className={"board-circle top-circle" + circleClass()}>
                GO
              </div>
            </div>
            <div id="board-info">CONNECT 4</div>
          </div>
          <div className="board-game-area">
            <div />
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <div className="board-column" key={i} onClick={() => colClick(i)}>
                <div className="board-column-container">
                  {[0, 1, 2, 3, 4, 5].map(j => (
                    <div className="board-position" key={j}>
                      <div
                        className={
                          "board-circle" + playerColor(game.board[i][j])
                        }
                      >
                        {""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div />
          </div>
        </div>
      </div>
      {!game.gameStarted ? (
        <div className="board-message-container" onClick={startGame}>
          <div className="board-message">START</div>
        </div>
      ) : (
        ""
      )}
      {game.gameOver ? (
        <div className="board-message-container" onClick={restartGame}>
          <div className="board-message">
            {game.player1
              ? game.playerWin === 0
                ? "NOBODY"
                : "RED"
              : game.playerWin === 0
              ? "NOBODY"
              : "YELLOW"}
            <br />
            WINS
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default App;
