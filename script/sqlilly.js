//Basic english:
//Find all Cars that have Virginia as State, 2001 as Year, and blue as Color
//As language:
//S -> ABCD
//A -> Find [all|each distinct|the amount of|the amount of each]
//B -> [Table name|Column name]
//C -> that have
//D -> [F, E|F]
//E -> [F, E|and F]
//F -> [Value] as [Column name]

//Better english:
//User inputted?
//Find all cars that are in Virginia, are from 2001, and are colored blue
//S -> ABCD
//A -> Find [all|each distinct|the amount of|the amount of each]
//B -> [Table name|Column name]
//C -> that
//D -> [F, E|F]
//E -> [F, E|and F]
//F -> are [Column describer] [Value]
//[Value] as [Column name]

//table{n}.column{n}

var tables = ["Cars", "Register"]


const states = ["Virginia", "Kentucky", "Oregon", "Mars"];
const times = ["", "after ", "before "]

window.alasql //Initialize AlaSQL

//SIGCSE 2025, sep/oct conference

//Cars(VIN, color, price)
//Register(VIN, state, date)

const colors = ['red', 'blue', 'silver', 'yellow'];


alasql("CREATE TABLE Cars (VIN INT, color STRING, price INT, brand STRING)");
alasql("CREATE TABLE Register (VIN INT, state STRING, date INT)");

let table_data = alasql("SHOW TABLES");
let table_info = [];
for (table in table_data) {
    let name = table_data[table]["tableid"];
    //alert(car_table_name);
    let columns = alasql("SHOW COLUMNS FROM " + name);

    let si = [];
    let datatype = []

    for (c in columns) {
        si.push(columns[c]["columnid"]); //dbtypeid
        datatype.push(columns[c]["dbtypeid"]);
    }
    table_info[table] = [name, si, datatype];
}

for (let i = 0; i < 5000; i++) {
    alasql("INSERT INTO Cars VALUES (?, ?, ?, \'brand\')",
        [i, colors[Math.floor(Math.random() * colors.length)], Math.floor(Math.random() * 2000) + 5000])
    alasql("INSERT INTO Register VALUES (?, ?, ?)",
        [i, states[Math.floor(Math.random() * states.length)], Math.floor(Math.random() * 100) + 1990])
}

const results = alasql("SELECT * a FROM Cars");
var s = "";

for (let i = 0; i < 5; i++) {
    let r = results[i];
    s += (r["VIN"] + " " + r["color"] + " " + r["price"] + "\n");
}
//document.getElementById('ans').textContent = s;

var correct = "";
var output = "";

var compare = alasql.compile('SELECT VALUE ? == ?');

const selectRandom = function (a) {
    return Math.floor(Math.random() * a.length);
}
const showSchema = function (s) {
    s.style.filter = 'opacity(1)';
    s.style.pointerEvents = 'all';
}
const hideSchema = function (s) {
    s.style.filter = 'opacity(0)';
    s.style.pointerEvents = 'none';
}

