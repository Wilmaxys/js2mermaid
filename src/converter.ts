import { logger } from './utils/logger';
import fs from 'fs';
import path from 'path';

interface Node {
  name: string;
  dependsOn?: this[];
}

const tasks: Node[] = [
  { name: 'task1' },
  {
    name: 'task2',
    dependsOn: [{ name: 'task2' }, { name: 'task3' }]
  },
  {
    name: 'task6',
    dependsOn: [{ name: 'task2' }, { name: 'task3' }]
  },
  {
    name: 'task19',
    dependsOn: [{ name: 'task2' }, { name: 'task3' }]
  },
  { name: 'task3', dependsOn: [{ name: 'task2' }] },
  { name: 'task4', dependsOn: [{ name: 'task4' }, { name: 'task5' }] },
  { name: 'task5', dependsOn: [{ name: 'task2' }] }
];

/**
 * Parse link between nodes
 * @param nodes Nodes with their dependencies
 * @returns A list of link between nodes
 */
const parseLinks = (nodes: Node[]): [string, string][] => {
  logger.info('Parse link between nodes');
  return nodes
    .map((task: Node) => {
      const links: [string, string][] = [
        ...(task?.dependsOn?.map((dependance: Node): [string, string] => [
          task.name,
          dependance.name
        ]) || [])
      ];
      return links;
    })
    .flat(1);
};

/**
 * Build mermaid code
 * @param links Links between nodes
 * @returns mermaid code
 */
const buildMarkDown = (links: [string, string][]): string => {
  logger.info('Build nodes');
  return `\`\`\`mermaid\ngraph TD;\n\t${links
    .map(
      (dependency: [string, string]) => dependency[0] + '-->' + dependency[1]
    )
    .join('\n\t')}\n\`\`\``;
};

/**
 * Write a mardown file
 * @param content content to create in file
 */
const writeFile = async (filePath: string, content: string) => {
  const dir: string = path.parse(filePath).dir;
  logger.info('Create a markdown file');
  !fs.existsSync(dir) && (await fs.promises.mkdir(dir, { recursive: true }));
  await fs.promises.writeFile(filePath, content);
};

(async () => {
  await writeFile('./dist/convert.md', buildMarkDown(parseLinks(tasks)));
})();
