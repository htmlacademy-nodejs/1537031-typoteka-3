'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const {
  ExitCode
} = require(`../../constants`);

const moment = require(`moment`);
const {getRandomDate} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const DATE_FORMAT = `YYYY-MM-DD hh:mm:ss`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateArticles = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    category: shuffle(categories).slice(1, 4),
    announce: shuffle(sentences).slice(1, 6).join(` `),
    fullText: shuffle(sentences).slice(1, 8).join(` `),
    createdDate: moment(getRandomDate()).format(DATE_FORMAT),
  }))
);


module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticle, titles, categories, sentences));

    const fs = require(`fs`).promises;
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
