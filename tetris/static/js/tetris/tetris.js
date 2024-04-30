// https://lively-capsule-421578.postman.co/workspace/e887b11b-65d6-4498-b375-7b31da9c8807/collection/18274963-a442cad1-2109-4eb2-bd77-a776537aeed0

const RUNNING = 1
const STOP = 2
const PAUSE = 3

class Tetris {
    constructor(divID, uploader) {
        this.unit = 30;         // 格子大小
        this.row = 20           // 格子行数 20
        this.col = 10           // 格子列数 10

        this.width = this.unit * this.col;  // 格子区宽度
        this.height = this.unit * this.row; // 整体高度
        this.menuWidth = 200                // 菜单宽度

        this.nextGroupOpt = {
            x: this.menuWidth / 2 - this.unit * 2,
            y: this.unit + 30,
        }

        this.uploader = uploader;  // 上传分数的方法

        // 可重置属性初始化
        this.reset();

        // 舞台
        this.stage = new Konva.Stage({
            container: divID,
            width: this.width + this.menuWidth,
            height: this.height,
        });

        // 背景画布
        this.backLayer = new Konva.Layer();
        this.stage.add(this.backLayer);

        // 主画布
        this.mainLayer = new Konva.Layer();

        this.stage.add(this.mainLayer);

        window.addEventListener("keydown", this.keydown());
        this.mainLayer.on("click", this.click());

        // 结束面板
        this.boardLayer = new Konva.Layer({visible:false});
        this.stage.add(this.boardLayer);

        this.drawBackground() // 背景

        this.drawMenu() // 菜单

        this.drawShowBoard(); // 显示面板

        this.backLayer.draw();
        this.mainLayer.draw();
        this.boardLayer.draw();
    }

    reset() {
        this.status = STOP;                 // 游戏状态
        this.historyBlocks = []             // 历史模块
        this.refresh = 1000;                 // 刷新率
        this.score = 0; // 分数
    }

    // 绘制下一个菜单
    drawNextMenu() {
        let group = new Konva.Group({
            x: this.width,
            // height: this.unit * 5,
            // width: this.menuWidth,
        })
        this.mainLayer.add(group)

        group.add(new Konva.Rect({
            height: this.unit * 5,
            width: this.menuWidth,
        }))
        group.add(new Konva.Text({
            y: 10,
            text: "下一个: ",
            fontSize: 22,
            fontFamily: 'Calibre',
            fill: 'green',
        }))

        this.nextGroup = group
        this.newBlock();
    }

    // 绘制分数
    drawScore() {
        let group = new Konva.Group({
            x: this.width,
            y: this.unit * 5,
            // height: this.unit * 5,
            // width: this.menuWidth,
        })
        this.mainLayer.add(group)

        group.add(new Konva.Rect({
            height: this.unit * 5,
            width: this.menuWidth,
        }))
        group.add(new Konva.Text({
            text: "分数: ",
            fontSize: 22,
            fontFamily: 'Calibre',
            fill: 'green',
        }))
        this.scoreText = new Konva.Text({
            y: 40,
            x: 30,
            text: "0",
            fontSize: 28,
            fontFamily: 'Calibre',
            fill: 'red',
        })
        group.add(this.scoreText)
    }

    // 绘制速度
    drawSpeed() {
        let group = new Konva.Group({
            x: this.width,
            y: this.unit * 10,
        })
        this.mainLayer.add(group)

        group.add(new Konva.Rect({
            height: this.unit * 5,
            width: this.menuWidth,
        }))
        group.add(new Konva.Text({
            text: "速度: ",
            fontSize: 22,
            fontFamily: 'Calibre',
            fill: 'green',
        }))
        this.speedText = new Konva.Text({
            y: 40,
            x: 30,
            text: "1000",
            fontSize: 28,
            fontFamily: 'Calibre',
            fill: 'red',
        })
        group.add(this.speedText)
    }

    // 绘制开始按钮
    drawStartButton() {
        this.actionButton = new Button(['开始', '暂停'])
        let buttonWidth = 120
        let buttonHeight = 60
        let x = this.width + this.menuWidth / 2 - buttonWidth / 2
        let y = this.height - buttonHeight - 40
        this.actionButton.setHW(buttonHeight, buttonWidth).setXY(x, y).addTo(this.mainLayer).onclick((opt) => {
            if (opt.current === 0) {
                this.start();
            } else {
                this.pause();
            }
        })
    }

    // 绘制作者信息
    drawAuthor() {
        this.mainLayer.add(new Konva.Text({
            x: this.col * this.unit + this.menuWidth - 70,
            y: this.row * this.unit - 20,
            text: "作者:宁次",
            fontSize: 15,
            fontFamily: 'Calibre',
            fill: 'green',
        }))
    }

    // 绘制菜单部分
    drawMenu() {
        this.drawNextMenu();
        this.drawScore();
        this.drawSpeed();
        this.drawStartButton();
        this.drawAuthor();
    }

    // 绘制统计面板
    drawShowBoard() {
        let background = new Konva.Rect({
            height: this.height,
            width: this.width + this.menuWidth,
            fill: 'break',
        });
        this.boardLayer.add(background)
        this.boardLayer.on('click', ()=>{
            console.log("click  boardLayer")
        })

        // background.cache();
        // background.filters([Konva.Filters.Blur,Konva.Filters.RGBA]);
        // // background.blue(50);
        // background.alpha(1);
        let height = 200;
        let width = 300;
        let textHeight = 50;
        let group = new Konva.Group({
            x: this.width / 2 - 50,
            y: this.height / 2 - 100,
        })
        this.boardLayer.add(group)
        group.add(new Konva.Rect({
            height: height,
            width: width,
            fill: '#464741',
            // stroke: 'red',
            // strokeWidth: 4,
        }))
        group.add(new Konva.Text({
            text: "Game Over !",
            height: textHeight,
            width: width,
            verticalAlign: 'middle',
            align: 'center',
            fontSize: 30,
            fontFamily: 'Calibre',
            fill: 'yellow',
        }))

        group.add(new Konva.Text({
            text: "历史最高分: ",
            y: textHeight,
            padding: 10,
            width: width / 2,
            height: textHeight,
            align: 'center',
            fontSize: 18,
            fontFamily: 'Calibre',
            fill: 'green',
        }))

        let historyScore = new Konva.Text({
            text: "0",
            y: textHeight,
            padding: 10,
            x: width / 2,
            width: width / 2,
            height:textHeight,
            align: 'center',
            fontSize: 20,
            fontFamily: 'Calibre',
            fill: 'red',
        })
        group.add(historyScore)


        group.add(new Konva.Text({
            text: "本局得分: ",
            y: textHeight * 2,
            padding: 10,
            width: width / 2,
            height: textHeight,
            align: 'center',
            fontSize: 18,
            fontFamily: 'Calibre',
            fill: 'green',
        }))

        let currentScore = new Konva.Text({
            text: "0",
            y: textHeight * 2,
            padding: 10,
            x: width / 2,
            width: width / 2,
            height:textHeight,
            align: 'center',
            fontSize: 20,
            fontFamily: 'Calibre',
            fill: 'red',
        })
        group.add(currentScore)

        let button = new Button(['再来一局'])
        let buttonHeight = textHeight
        let buttonWidth = 100
        button.setXY(width/2-buttonWidth/2, height-buttonHeight-8).setHW(buttonHeight, buttonWidth).setFontSize(18).addTo(group).onclick(()=>{
            this.start();
        })


        this._showboard = {
            historyScore: historyScore,
            currentScore: currentScore,
            background:   background,
        }
    }

    // 绘制背景
    drawBackground() {
        // 背景颜色
        this.backLayer.add(new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width + this.menuWidth,
            height: this.height,
            fill: '#272822',
        }))

        for (let i = 1; i <= this.row; i++) {
            let x1 = 0, x2 = this.width
            let y = i * this.unit
            this.backLayer.add(new Konva.Line({
                points: [x1, y, x2, y],
                stroke: '#464741',
                strokeWidth: 3,
            }))
        }

        for (let i = 1; i <= this.col; i++) {
            let y1 = 0, y2 = this.height;
            let x = i * this.unit
            this.backLayer.add(new Konva.Line({
                points: [x, y1, x, y2],
                stroke: '#464741',
                strokeWidth: 3,
            }))
        }

    }

    // 新增块
    newBlock() {
        let type = random(0, 6);
        // let status = random(0, 4);
        this.nextBlock = new Block(this.unit, type, 0, this.nextGroup)
        this.nextBlock.x = this.nextGroupOpt.x
        this.nextBlock.y = this.nextGroupOpt.y
    }

    // 切换当前块
    newCurBlock() {
        this.curBlock = this.nextBlock
        this.curBlock.moveTo(this.mainLayer)
        this.curBlock.x = Math.floor(this.col / 2 - 1) * this.unit
        this.curBlock.y = 0
        this.newBlock();
    }

    // 增加分数
    addScore(score) {
        this.score += score;
        this.scoreText.text(this.score);

        // 刷新速度
        let speed = Math.floor(this.score / 30)
        if (speed > 0) {
            this.refresh = 1000 - speed * 200;
            this.speedText.text(String(this.refresh));
        }
    }

    // 回滚操作
    keydown_rollback(code) {
        switch (code) {
            case Direction.UP:
                this.curBlock.unDistortion()
                break;
            case Direction.DOWN:
                this.curBlock.move(Direction.UP)
                break;
            case Direction.LEFT:
                this.curBlock.move(Direction.RIGHT)
                break
            case Direction.RIGHT:
                this.curBlock.move(Direction.LEFT)
                break
        }
    }

    // 键盘控制
    keydown() {
        return (e) => {
            // 空格按键-控制开关
            if (e.keyCode === 32) {
                this.actionButton.click();
                this.mainLayer.draw()
                return;
            }

            // 非方向键
            if (e.keyCode > 40 || e.keyCode < 37) {
                return;
            }

            // 判断游戏是否进行中
            if (this.status !== RUNNING) {
                return;
            }


            if (e.keyCode === Direction.UP) {
                this.curBlock.distortion()
            } else {
                this.curBlock.move(e.keyCode)
            }

            if (
                this.curBlock.collide(this.historyBlocks) ||  // 碰到历史块
                this.curBlock.getRightX() > this.width ||    // 超出右边界界
                this.curBlock.getLeftX() < 0 || // 超出左边界
                this.curBlock.getDownY() > this.height // 超出下边界
            ) {
                this.keydown_rollback(e.keyCode)
            }
            this.mainLayer.draw();
        };
    }

    // 点击控制 （debug)
    click() {
        return (e) => {
            // console.log("h: ", this.curBlock.height);
            // console.log("w: ", this.curBlock.width);
            // console.log("x: ", this.curBlock.x);
            // console.log("y: ", this.curBlock.y);
            // console.log("xxx: ", this.historyBlocks);
            // this.curBlock.print();
            // this.curBlock.fillDown(270);
            // this.curBlock.print();
            // this.blockLayer.draw();
            // console.log(this.curBlock.x, this.curBlock.y)
            console.log("click main")
            // console.log("e", e)
        }
    }

    // 移除满行
    remove() {
        // 按行标记每一个方块
        let cache = {}
        this.historyBlocks.forEach((block) => {
            for (let i = 0; i < block.blocks.length; i++) {
                let y = block.y + block.blocks[i].y()
                let x = block.x + block.blocks[i].x()
                if (!cache[y]) {
                    cache[y] = {}
                }
                cache[y][x] = true
            }
        })


        // 筛选删除的行
        let delCache = []
        for (const y in cache) {
            let isDelete = true
            for (let x = 0; x < this.col; x++) {
                if (!cache[y][x * this.unit]) {
                    isDelete = false
                    break;
                }
            }
            if (isDelete) {
                delCache.push(Number(y))
            }
        }


        if (delCache.length > 0) {
            this.addScore(delCache.length ** 2)
            delCache.sort(function (a, b) {
                return b - a
            }); // 降序
            // 删除行上的每个元素
            this.historyBlocks.forEach(block => {
                block.removeY(delCache);
            })

            this.mainLayer.draw();

            // 向下移动
            let fixY = 0; // 已经下降的高度
            for (let i = 0; i < delCache.length; i++) {
                let delY = delCache[i] + (fixY * this.unit)
                this.historyBlocks.forEach(block => {
                    block.fillDown(delY);
                })
                fixY++
            }

            // 清理历史记录
            this.cleanHistory();
        }

    }

    // 下一步
    next() {
        this.historyBlocks.push(this.curBlock)
        this.remove(); // 满足消除条件
        this.newCurBlock();
        if (this.curBlock.collide(this.historyBlocks)) {
            this.curBlock.move(Direction.UP)
            this.stop();
        }
    }

    // 清理历史模块
    cleanHistory() {
        this.historyBlocks = this.historyBlocks.filter((block) => {
            return block.blocks.length > 0
        })
    }

    // 运行主逻辑
    __run() {
        if (this.status === RUNNING) {
            this.curBlock.move(Direction.DOWN) // 向下移动
            console.log(this.curBlock.y, this.curBlock.height, this.height)
            if (
                this.curBlock.collide(this.historyBlocks) ||  // 和其他模块相撞
                (this.curBlock.getDownY() > this.height) // 超出下边界
            ) {
                this.curBlock.move(Direction.UP);
                this.next();
            }
            this.mainLayer.draw();
            setTimeout(() => {
                this.__run();
            }, this.refresh)
        }
    }

    run() {
        setTimeout(() => {
            this.__run();
        }, this.refresh)
    }

    // 开始
    start() {
        this.boardLayer.visible(false);
        if (this.status === STOP) {
            this.restart();
        } else if (this.status === PAUSE) {
            this.status = RUNNING
            this.run();
        }
    }

    pause() {
        this.status = PAUSE;
    }

    restart() {
        if (this.historyBlocks) {
            this.historyBlocks.forEach((block)=>{
                block.destroy();
            })
        }
        if (this.curBlock) {
            this.curBlock.destroy();
        }
        this.reset()
        this.newCurBlock();
        this.status = RUNNING;
        this.run();
    }

    stop() {
        this.actionButton.click();
        this.status = STOP
        // 显示面板
        let history = Store.maxScore
        this._showboard.historyScore.text(String(history))
        this._showboard.currentScore.text(String(this.score))
        this.boardLayer.visible(true);
        this.mainLayer.blurRadius(50);
        this.boardLayer.draw();
        this.uploader(this.score) // 上传分数
    }
}

function random(begin, end) {
    return Math.floor(Math.random() * (end - begin + 1) + begin);
}
