
class Button {
    constructor(texts) {
        this.fontSize = 30;
        this.fontFamily = 'Calibre';
        this.fontFill = 'break';
        this.rectFill = 'green'
        this.texts = texts; // 文本内容缓存
        this.showIndex = 0; // 显示索引

        this.group = new Konva.Group()

        this.rect = new Konva.Rect({
            fill: this.rectFill,
            cornerRadius: 30
        });
        this.group.add(this.rect)

        this._text =  new Konva.Text({
            text: this.texts[this.showIndex],
            verticalAlign: 'middle',
            align: 'center',
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            fill: this.fontFill,
        })
        this.group.add(this._text)
        this.group.on("click", this._onclick())
    }

    // 绑定点击函数
    onclick(callback) {
        this.callback = callback
        return this
    }

    _onclick() {
        return (evt)=>{
            console.log('click button')
            let opt = {
                current: this.showIndex,
                length: this.texts.length,
                next: (this.showIndex + 1) % this.texts.length,
            }

            if (this.callback){
                this.callback(opt);
            }
            this._text.text(this.texts[opt.next])
            this.showIndex = opt.next;
            if (this.layer) {
                this.layer.draw()
            }
        }
    }

    addTo(layer) {
        this.layer = layer
        this.layer.add(this.group)
        return this
    }

    setXY(x,y) {
        this.group.x(x)
        this.group.y(y)
        return this
    }

    setFontSize(size) {
        this._text.fontSize(size)
        return this
    }

    setHW(height,width) {
        this.rect.height(height);
        this.rect.width(width);
        this._text.height(height);
        this._text.width(width);
        return this
    }

    click() {
        this.group.fire('click')
    }
}
