/** @param {NS} ns */
export async function main(ns) {
	let name = ns.args[0];
	let server = ns.args[1]
	let contract = ns.codingcontract.getContractType(name, server)
	let solved = {
        "Find Largest Prime Factor": (data) => primeFactor(data),
        //"Subarray with Maximum Sum": (data) => subset(data),
        //"Spiralize Matrix": (data) => spiral(data),
        //"Merge Overlapping Intervals": (data) => overlap(data),
        //"Generate IP Addresses": (data) => IPs(data),
        "Minimum Path Sum in a Triangle": (data) => triangleMap(data),
        //"Shortest Path in a Grid": (data) => shortcut(data),
        //"Sanitize Parentheses in Expression": (data) => sanitize(data),
        "Find All Valid Math Expressions": (data) => allValidExpressions(data),
        //"Proper 2-Coloring of a Graph": (data) => paint(data),
		//"HammingCodes: Integer to Encoded Binary": (data) => Hamming(data),
		//"HammingCodes: Encoded Binary to Integer": (data) => unHamming(data),
		"Compression I: RLE Compression": (data) => compressI(data),
		//"Compression II: LZ Decompression": (data) => compressII(data),
		//"Compression III: LZ Compression": (data) => compressIII(data),
        "Encryption I: Caesar Cipher": (data) => encryptI(data),
		"Encryption II: Vigenère Cipher": (data) => encryptII(data),
		"Total Ways to Sum": (data) => generator(data),
		"Total Ways to Sum II": (data) => sums(data),
		"Unique Paths in a Grid I": (data) => mapPathI(data),
		//"Unique Paths in a Grid II": (data) => mapPathII(data),
		//"Algorithmic Stock Trader I": (data) => stockI(data),
		//"Algorithmic Stock Trader II": (data) => stockII(data),
		//"Algorithmic Stock Trader III": (data) => stockIII(data),
		//"Algorithmic Stock Trader IV": (data) => stockIV(data),
		"Array Jumping Game": (data) => arrayJump(data),
		//"Array Jumping Game II": (data) => minJump(data),
	}
	if (contract in solved) {
		let data = ns.codingcontract.getData(name, server)
		ns.tprint(solved[contract](data), " ", contract, " ", server)
		ns.tprint(ns.codingcontract.attempt(solved[contract](data), name, server))
	}
	else {
		ns.tprint(server)
		ns.tprint(contract)
	}
}
function unHamming(data){
	let solution = 0
	for (let i = 0; i < data.length; i++){
		if (data[i] == 1){
			solution ^= i
		}
	}
	data = [...data].map(parseInt)
	data[solution] ^= 1
	solution = ""
	for (let i = 1; i < data.length; i++){
		if (Number.isInteger(Math.log2(i))){
			continue
		}
		solution += data[i].toString()
	}
	return parseInt(solution, 2).toString()
}
function compressI(data) {
	let solution = ""
	for (let i = 0, extra; i < data.length; i += extra) {
		for (extra = 1; extra + i < data.length && data[i] == data[i + extra]; extra++) {
			continue
		}
		if (extra > 9) {
			solution += "9" + data[i]
			solution += `${extra - 9}` + data[i]
		}
		else
			solution += `${extra}` + data[i]

	}
	return solution
}

function stockII(data) {
	let sales = []
	let stock = 0
	for (let day = 0; day < data.length; day = stock + 1) {
		let sale = []
		for (let sign = 1; sign > -2; sign -= 2) {
			while (sign * data[stock] > sign * data[stock + 1]) {
				stock++
			}
			sale.push(data[stock])
		}
		sale.push(sale[1] - sale[0])
		sales.push(sale)
	}
	let total = 0
	for (let i of sales.map((a) => a[2])) {
		total += i
	}
	return total
}

function stockI(data) {
	let sales = []
	let stock = 0
	for (let day = 0; day < data.length; day = stock + 1) {
		let sale = []
		for (let sign = 1; sign > -2; sign -= 2) {
			while (sign * data[stock] > sign * data[stock + 1]) {
				stock++
			}
			sale.push(data[stock])
		}
		sale.push(sale[1] - sale[0])
		sales.push(sale)
	}
	for (let batch = 1; batch < sales.length; batch++)
			while (sales[batch - 1][0] < sales[batch][0]) 
				sales.splice(batch, 2, [sales[batch][0], Math.max(sales[batch][1], sales[batch + 1][1]), Math.max(sales[batch][1], sales[batch + 1][1]) - sales[batch][0]])
			
	return Math.max(...sales.map((a) => a[2]))
}

function overlap(data) {
	data.sort((a, b) => a[0] - b[0])
	for (let i = 0; data[i] != null; i++) {
		if (data.length >= 1)
			while (data[i][1] >= data[i + 1][0]) {
				data.splice(i, 2, [Math.min(data[i][0], data[i + 1][0]), Math.max(data[i][1], data[i + 1][1])])
				if (data.length == 1)
					break
			}
	}
	return data
}

function sums(data) {
	const coefficient = Array(data[0] + 1).fill(0)
	coefficient[0] = 1

	for (let term of data[1]) {
		for (let subgoal = 0; subgoal + term <= data[0]; ++subgoal) {
			coefficient[subgoal + term] += coefficient[subgoal];
		}
	}

	return coefficient[data[0]];
}

function generator(data) {
	const coefficient = Array(data + 1).fill(0)
	coefficient[0] = 1

	for (let term = 1; term < data; term++) {
		for (let subgoal = 0; subgoal + term <= data[0]; subgoal++) {
			coefficient[subgoal + term] += coefficient[subgoal];
		}
	}

	return coefficient[data];
}

function triangleMap(data) {
	for (let floor = data.length - 1; floor > 0; floor--) {
		for (let i = 0; i < data[floor].length - 1; i++) {
			data[floor - 1][i] += Math.min(data[floor][i], data[floor][i + 1])
		}
	}
	return data[0][0]
}

function mapPathI(data) {
	let total = data[0] + data[1] - 2
	function factorial(x) {
		let fact = 1;
		for (let i = 1; i <= x; i++) {
			fact *= i;
		}
		return fact
	}
	return factorial(total) / (factorial(total - data[0] + 1) * factorial(data[0] - 1))
}

function minJump(data) {
	let jumps = 0
	let jump = { "position": 0, "value": data[0], "limit": data[0] }
	while (jump["value"] > 0) {
		let best = { "position": 0, "value": 0, "limit": 0 }
		for (let steps = jump["position"] + 1; steps <= jump["limit"]; steps++) {
			if (data[steps] + steps > best["limit"]) {
				best = { "position": steps, "value": data[steps], "limit": steps + data[steps] }

			}
		}
		jump = best
		jumps++
		if (jump["limit"] >= data.length) return jumps + 1
	}
	return 0
}

function arrayJump(data) {
	let jump = { "position": 0, "value": data[0], "limit": 0 + data[0] }
	while (jump["value"] > 0) {
		let best = { "position": 0, "value": 0, "limit": 0 }
		for (let steps = jump["position"] + 1; steps < jump["limit"]; steps++) {
			if (data[steps] + steps > best["limit"]) {
				best = { "position": steps, "value": data[steps], "limit": steps + data[steps] }
			}
		}
		jump = best
		if (jump["limit"] >= data.length) return 1
	}
	return 0
}

function primeFactor(data) {
	let i = 2;
	while (i <= data) {
		if (data % i == 0) {
			data /= i;
		}
		else {
			i++;
		}

	}
	return i
}

function encryptII(data) {
	let key = data[1].repeat(20)
	let encryption = ""
	for (let letter in data[0]) {
		encryption += String.fromCharCode((data[0].charCodeAt(letter) + key.charCodeAt(letter) - 130) % 26 + 65)
	}
	return encryption
}

function encryptI(data) {
	let encryption = ""
	for (let letter in data[0]) {
		let shift = (data[0].charCodeAt(letter) - data[1] - 39) % 26
		if (shift < 0) {
			encryption += " "
			continue
		}
		encryption += String.fromCharCode(shift + 65)
	}
	return encryption
}


function allValidExpressions(data) {
	let number = data[0]
	let spaces = number.length - 1
	let target = data[1]
	let operators = {
		"0": "",
		"1": "+",
		"2": "-",
		"3": "*"
	}
	let solutions = []
	for (let i = 0; i < 4 ** spaces; i++) {
		let test = ""
		i = i.toString(4)
		i = "0".repeat(spaces - i.length) + i
		for (let k = 0; k < spaces; k++) {
			test += number[k] + operators[i[k]]
		}
		test += number[number.length - 1]
		try { if (eval(test) == target) solutions.push(test) } catch { }
		i = parseInt(i, 4)
	}
	return solutions
}