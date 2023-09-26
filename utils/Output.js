import chalk from "chalk";

export const OutputFetch = (type, group, query, api) => {
  let output = [];
  switch (type) {
    case "GET":
      output.push(chalk.bold.bgGreenBright(" " + type + " "));
      break;
    case "POST":
      output.push(chalk.bold.bgBlueBright(" " + type + " "));
      break;
    case "PATCH":
      output.push(chalk.bold.bgYellowBright(" " + type + " "));
      break;
    case "DELETE":
      output.push(chalk.bold.bgRedBright(" " + type + " "));
      break;
    default:
      output.push(chalk.bold.magenta.bgWhiteBright(" " + type + " "));
      break;
  }
  if (group) {
    output.push(chalk.bold.cyanBright.bgGray(" " + group + " "));
  }
  output.push(chalk.bold.bgBlack.redBright(" > "));
  let splitQuery = [];
  query.forEach((param) => splitQuery.push(param));
  output.push(
    chalk.bold.black.bgWhiteBright(" " + splitQuery.join(", ") + " ")
  );
  if (api) {
    output.push(chalk.bold.greenBright.bgBlack(" " + api + " "));
  }
  return output.join("");
};
