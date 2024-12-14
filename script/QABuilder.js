const select = "Find ";
const selection_types = ["all distinct ", "the amount of distinct ", "the amount of each distinct "]; //"the average ", "the minimum ", "the maximum "
const selection_types_alt = ["the average ", "the minimum ", "the maximum "];
var select_conditions = [];//["car colors", "car VINs", "car brands", ...];
var selection_datatypes = [];
//Table name, Column Name
const which = " that are ";
var which_conditions = [];//["registered in ", "from "]

const a_select = "SELECT ";
const a_select_modifiers = ["distinct ", "COUNT(distinct ", "distinct "];
const a_select_alt_modifiers = ["avg(", "min(", "max("];
var a_select_conditions = [];//["Cars.color", "Cars.VIN", "Cars.brand", ...];

//table{n}.column{n}

var a_from = "";// " FROM Cars NATURAL JOIN Register";

//from table1 natural join table2

const a_where = " WHERE ";

var a_which_conditions = [];//["Register.state ", "Register.date "];

//table{n}.column{m}
const a_which_modifiers = ["= ", "> ", "< "];
const a_group = " GROUP BY ";

var a_group_conditions = [];//["Cars.color", "Cars.VIN", "Cars.brand"];

var new_q, new_a;
var selection_type_index;
var select_condition_index;
var group_condition_index;

const createAutomataData = function () {
    select_conditions = [];
    a_select_conditions = [];
    selection_datatypes = [];

    for (i in table_info) {
        let table = table_info[i];
        for (j in table[1]) {
            select_conditions.push(table[0] + " " + table[1][j]);
            a_select_conditions.push(table[0] + "." + table[1][j]);
            selection_datatypes.push(table[2][j]);
        }
    }

    a_from = " FROM Cars NATURAL JOIN Register";

    which_conditions = ["registered in ", "from "];
    a_which_conditions = ["Register.state ", "Register.date "];
}

const createSelectSection = function () {
    selection_type_index = selectRandom(selection_types);
    //let select2 = ["car colors", "car VINs", "car brands", "cars", "blue cars", "red cars"];
    //let a_select2 = ["Cars.color", "Cars.VIN", "Cars.brand", "*"];

    select_condition_index = selectRandom(select_conditions);
    let isNum = selection_datatypes[select_condition_index] == "INT";
    let isAggregate = isNum && (Math.random() < 0.5); //Uses avg, min, max instead of *, count, * count
    let isGrouped = select_conditions.length > 1 && isAggregate && (Math.random() < 0.5); //Groups by some column, then uses avg, min, max
    group_condition_index = -1;
    while (isGrouped) {
        group_condition_index = selectRandom(select_conditions);
        if (group_condition_index != select_condition_index) break;
    }
    if (!isAggregate && selection_type_index == 2) group_condition_index = select_condition_index

    new_q = select + (isAggregate ? selection_types_alt[selection_type_index] : selection_types[selection_type_index]);
    new_a = a_select + "";
    new_q += select_conditions[select_condition_index];

    if (isGrouped) {
        new_a += a_select_conditions[group_condition_index] + ", "
    }

    new_a += (isAggregate ? a_select_alt_modifiers[selection_type_index] : a_select_modifiers[selection_type_index]);
    new_a += a_select_conditions[select_condition_index] + (isAggregate ? ")" : (selection_type_index == 2 ? ", COUNT(*)" : selection_type_index == 1 ? ")" : ""));

    new_a += a_from;

    if (isGrouped) {
        new_q += " of each " + select_conditions[group_condition_index];
    }
}

const addCondition = function (where, previous_column) {
    let column = selectRandom(which_conditions);
    if (column == previous_column || column == group_condition_index || column == select_condition_index) {
        return [where, column];
    }
    if (previous_column != -1) {
        new_q += " and "
    }
    new_q += which + which_conditions[column];
    where += (where == "" ? a_where : " AND ") + a_which_conditions[column];
    switch (column) {
        case 0:
            let s = states[selectRandom(states)];
            new_q += s;
            where += "= \'" + s + "\'";
            break;
        case 1:
            let t = selectRandom(times);
            let time = (2000 + Math.floor(Math.random() * 20));
            new_q += times[t] + time;
            where += a_which_modifiers[t] + time;
            break;
    }
    return [where, column];
}

const createWhereConditions = function () {
    let where = "";//v < 4 ? "" : " WHERE Cars.color = " + (v == 4 ? "\'blue\'" : "\'red\'");

    let previous_column = -1;
    for (let i = 0; i < 2; i++) {
        if (Math.random() > 0.15) {
            [where, previous_column] = addCondition(where, previous_column);
        }
    }
    new_a += where;
}

const createGroupByCondition = function () {
    if (group_condition_index != -1) {
        new_a += a_group;
        new_a += a_select_conditions[group_condition_index];
    }
}

const createHavingCondition = function () {
    if (group_condition_index != -1) {
        new_a += " HAVING "
        new_a += a_select_alt_modifiers[selection_type_index] + a_select_conditions[select_condition_index] + ") > 0"
        new_q += ", having " + selection_types_alt[selection_type_index] + " be at least 0"
    }
}

const question_types = ["select", "create", "insert", "delete"];
var question_type = 0;

const createQuestion = function () {
    createAutomataData();
    createSelectSection();
    createWhereConditions();
    createGroupByCondition();
    createHavingCondition();

    new_q += ".";
    new_a += ";";

    hideSchema(schema);

    correct = alasql(new_a);

    document.getElementById('qst').textContent = new_q;
    document.getElementById('ans').value = "" + new_a;
}


const addSegment = function (nodes, index) {
    node = nodes[index];
    let text = "";
    if (node instanceof String) {
        text = node;
    }
    else if (node instanceof Array) {
        text = node[0];
        
    }
}


const q_b = ["all", "the amount", ["the amount", q_d]];
const a_b = ["", "count", ""]
const q_c = ["average", "minimum", "maximum"];
const a_c = ["avg", "min", "max"]
const q_d = []

const q_e = []
const q_f = []
const q_h = []

const createQuestionNew = function () {
    //Automata Q -> "Find" (B|"the" C)(E|)(F|)(H|)
    //Automata A -> "select" (B|C) "from tables" (E|)(D|)(F|)(H|)
    let q = [["Find"], [q_b, ["the ", q_c]], [q_e, null], [q_f, null], [q_h, null]];
    let qi = []
    for (let i = 0; i < q.length; i++) {
        ind = selectRandom(q[i]);
        qi.push(ind);
    }
}