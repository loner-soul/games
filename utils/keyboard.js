class Enumify {
	static enumKeys = [];
	static enumValues = [];
	static closeEnum() {
		const enumKeys = [];
		const enumValues = [];
		for (const [key, value] of Object.entries(this)) {
			enumKeys.push(key);
			enumValues.push(value);
		}
		this.enumKeys = enumKeys;
		this.enumValues = enumValues;
	}
}

class Color extends Enumify {
	static red = new Color();
	static orange = new Color();
	static _ = this.closeEnum();
}

class Color2 {
	static a = 1;
	static b = 2;
	c = 3;
}



let o = new Color2()

console.log("cxxx: ", Color2.c)
console.log("cxxxx2: ", o.c)


for (const [key, value] of Object.entries(o)) {
	console.log("color2: " + key + value)
}
console.log("o2: ",  Object.entries(Color2))

console.log(Color.enumKeys);
console.log("xxxxx")
