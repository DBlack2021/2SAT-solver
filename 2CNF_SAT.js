let variableList = [
  // "x1",
  // "!x2",
  // "x2",
  // "x3",
  // "!x1",
  // "x3",
  // "!x2",
  // "!x3"
]

function createState(variables) {
  let state = {};
  let filteredVars = [...new Set(variables.filter(variable => variable.indexOf("!") === -1))]
  for(variable of filteredVars) {
    state[variable] = true;
  }
  return state;
}

function chunk(array, size) {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunked_arr[chunked_arr.length - 1];
    if (!last || last.length === size) {
      chunked_arr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunked_arr;
}

const getClauses = (s) => {
  let clauses = [];
  for(clauseVars of chunked_variables) {
    if(clauseVars[0].indexOf("!") !== -1 && clauseVars[1].indexOf("!") !== -1) {
      clauses.push(!!(!s[clauseVars[0].replace("!", "")] || !s[clauseVars[1].replace("!", "")]))
    } else if(clauseVars[0].indexOf("!") !== -1) {
      clauses.push(!!(!s[clauseVars[0].replace("!", "")] || s[clauseVars[1]]))
    } else if(clauseVars[1].indexOf("!") !== -1) {
      clauses.push(!!(s[clauseVars[0]] || !s[clauseVars[1].replace("!", "")]))
    } else {
      clauses.push(!!(s[clauseVars[0]] || s[clauseVars[1]]))
    }
  }
  return clauses;
}

let chunked_variables = [];
let state = {};

function findSat() {
  try {
    if(getClauses(state).every(clause => !!clause)) {
      console.log(state);
      document.querySelector(".solution").innerHTML = `A solution is:\n${solutionToString(state)}`;
    } else {
      flipClauses(getClauses(state));
      findSat(getClauses(state));
    }
  } catch (error) {
    console.log("Your boolean statement is most likely unsatisfiable, or too complex for this program!")
  }
}

function flipClauses(clauses) {
  for(clause of clauses) {
    if(!clause) {
      //pick random variable
      let randomIndex = (2 * clauses.indexOf(clause)) + Math.round(Math.random());

      //filter out the ! so we get the pure variable and not its negation
      let filteredVar = variableList[randomIndex].replace("!", "");

      //flip it
      state[filteredVar] = !state[filteredVar]
    }
  }
}

function solutionToString(solution) {
  let string = "";
  for(const [key, value] of Object.entries(solution)) {
    string += `${key}: ${value}\n`
  }
  return string;
}

document.querySelector(".submit").addEventListener("click", function() {
  variableList = document.querySelector(".input").value.replace(" ", "").split(","), 2;
  chunked_variables = chunk(variableList, 2);
  state = createState(variableList);

  findSat();
});