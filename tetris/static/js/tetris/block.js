// https://tetris.huijiwiki.com/wiki/%E5%9B%9B%E8%BF%9E%E6%96%B9%E5%9D%97
let baseBlockData = [
    {
        name: 'Orange Ricky',
        // fill: '#FFA500',
        fill: 'orange',
        points: [
            [[2, 0], [0, 1], [1, 1], [2, 1]],
            [[0, 0], [0, 1], [0, 2], [1, 2]],
            [[0, 0], [1, 0], [2, 0], [0, 1]],
            [[0, 0], [1, 0], [1, 1], [1, 2]],
        ],
    },
    {
        name: 'Blue Ricky',
        // fill: '#0000FF',
        fill: 'blue',
        points: [
            [[0, 0], [0, 1], [1, 1], [2, 1]],
            [[0, 0], [1, 0], [0, 1], [0, 2]],
            [[0, 0], [1, 0], [2, 0], [2, 1]],
            [[1, 0], [1, 1], [1, 2], [0, 2]],
        ]
    },
    {
        name: 'Cleveland Z',
        // fill: '#EF2129',
        fill: 'red',
        points: [
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[1, 0], [0, 1], [1, 1], [0, 2]],
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[1, 0], [0, 1], [1, 1], [0, 2]],
        ]
    },
    {
        name: 'Rhode Island Z',
        // fill: '#019b00',
        fill: 'green',
        points: [
            [[1, 0], [2, 0], [0, 1], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
            [[1, 0], [2, 0], [0, 1], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
        ]
    },
    {
        name: 'Hero',
        // fill: '#32c7ef',
        fill: 'LightSkyBlue',
        points: [
            [[0, 0], [1, 0], [2, 0], [3, 0]],
            [[0, 0], [0, 1], [0, 2], [0, 3]],
            [[0, 0], [1, 0], [2, 0], [3, 0]],
            [[0, 0], [0, 1], [0, 2], [0, 3]],
        ]
    },
    {
        name: 'Teewee',
        // fill: '#ad4d9c',
        fill: '#9400D3',
        points: [
            [[1, 0], [0, 1], [1, 1], [2, 1]],
            [[0, 0], [0, 1], [1, 1], [0, 2]],
            [[0, 0], [1, 0], [2, 0], [1, 1]],
            [[1, 0], [0, 1], [1, 1], [1, 2]],
        ]
    },
    {
        name: 'Smashboy',
        // fill: '#f7d304',
        fill: 'yellow',
        points: [
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]],
        ]
    }
]


let Direction = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
}


class Block {
    constructor(unit, type, status, layer) {
        this.unit = unit;
        this.layer = layer
        this.reset(type, status)
    }

    reset(type, status) {
        if (this.group) {
            this.group.destroy();
        }
        this.status = status % 4;
        this.data = baseBlockData[type]
        this.blocks = []
        this.__maxX = 0;
        this.__maxY = 0;

        this.group = new Konva.Group()
        this.data.points[this.status].forEach((ele) => {
            let block = new Konva.Rect({
                x: 0,
                y: 0,
                width: this.unit,
                height: this.unit,
                name: this.data.name,
                fill: this.data.fill,
                stroke: '#464741',
                strokeWidth: 4,
            });
            block.x(ele[0] * this.unit)
            block.y(ele[1] * this.unit)

            this.__maxX = ele[0] > this.__maxX ? ele[0] : this.__maxX;
            this.__maxY = ele[1] > this.__maxY ? ele[1] : this.__maxY;

            this.blocks.push(block)
            this.group.add(block)
        })
        this.layer.add(this.group)
    }

    __change() {
        this.__maxX = 0;
        this.__maxY = 0;
        this.data.points[this.status].forEach((ele, index) => {
            this.blocks[index].x(ele[0] * this.unit)
            this.blocks[index].y(ele[1] * this.unit)
            this.__maxX = ele[0] > this.__maxX ? ele[0] : this.__maxX;
            this.__maxY = ele[1] > this.__maxY ? ele[1] : this.__maxY;
        })
    }

    // 变形
    distortion() {
        this.status = (this.status + 1) % 4
        this.__change()
        this.__fixHeroDistortion()

    }

    __fixHeroDistortion() {
        if (this.data.name !== 'Hero') {
            return;
        }
        if (this.status === 0 || this.status === 2) {
            this.group.x(this.group.x() - this.unit);
        } else {
            this.group.x(this.group.x() + this.unit);
        }
    }

    // 回退变形
    unDistortion() {
        this.status = (this.status + 3) % 4
        this.__change()
        this.__fixHeroDistortion()
    }

    get x() {
        return this.group.x();
    }

    set x(value) {
        this.group.x(value);
    }

    get y() {
        return this.group.y();
    }

    set y(value) {
        this.group.y(value);
    }

    get height() {
        return (this.__maxY + 1) * this.unit
    }

    get width() {
        return (this.__maxX + 1) * this.unit
    }

    // 获取右侧边界坐标
    getRightX() {
        return this.x + this.width
    }

    // 获取左侧边界坐标
    getLeftX() {
        return this.x
    }

    // 获取下边界坐标
    getDownY() {
        return this.y + this.height
    }

    // 碰撞检测
    collide(blocks) {
        for (let i = 0; i < this.blocks.length; i++) {
            let x1 = this.group.x() + this.blocks[i].x()
            let y1 = this.group.y() + this.blocks[i].y()

            for (let m = 0; m < blocks.length; m++) {
                for (let n = 0; n < blocks[m].blocks.length; n++) {
                    let x2 = blocks[m].x + blocks[m].blocks[n].x()
                    let y2 = blocks[m].y + blocks[m].blocks[n].y()
                    if ((x1 === x2) && (y1 === y2)) {
                        return true
                    }
                }
            }
        }
        return false
    }

    // 移动图形
    move(direct) {
        switch (direct) {
            case Direction.DOWN:
                this.group.y(this.group.y() + this.unit);
                break;
            case Direction.UP:
                this.group.y(this.group.y() - this.unit);
                break;
            case Direction.LEFT:
                this.group.x(this.group.x() - this.unit)
                break
            case Direction.RIGHT:
                this.group.x(this.group.x() + this.unit)
                break
            default:
                return false
        }
        return true
    }

    // 移除指定行的方块
    removeY(arrY) {
        let objY = {}
        arrY.forEach(y => {
            objY[y] = true
        })

        let gY = this.group.y()
        let newBlocks = []
        this.blocks.forEach(block => {
            let y = gY + block.y()
            if (objY[y]) {
                block.destroy()
                console.log("删除block: ", (this.group.x() + block.x()), y)
            } else {
                newBlocks.push(block)
            }
        })
        this.blocks = newBlocks
    }

    // 小于y的模块均下降一个单位
    fillDown(fromY) {
        let gY = this.group.y()
        this.blocks.forEach((block) => {
            let y = gY + block.y();
            if (y < fromY) {
                block.y(block.y() + this.unit)
            }
        })
    }

    print() {
        let gY = this.group.y();
        let gX = this.group.x();
        // console.log("group x,y: ", gX,gY);
        this.blocks.forEach((block, index) => {
            let y = gY + block.y();
            let x = gX + block.x();
            console.log(index, x, y)
        })
    }

    moveTo(layer) {
        this.layer = layer;
        this.group.moveTo(layer);
    }

    destroy() {
        this.group.destroy();
    }
}
