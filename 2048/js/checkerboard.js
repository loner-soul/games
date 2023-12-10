class Board {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
  // 初始化矩阵 board[row][col]
  initBoard() {
    this.board = new Array(this.row);
    for (var i = 0; i < this.row; i++) {
      this.board[i] = new Array(this.col);
      for (var j = 0; j < this.col; j++) {
        this.board[i][j] = 0;
      }
    }
  }
  // 开始游戏
  start() {
    this.score = 0; // 分数
    // 填充最初数据
  }
  // 随机生成一个模块
  newNext() {
    return 2;
  }
  //
}

// Test
let board = new Board(4, 5);
console.log(board.board);
