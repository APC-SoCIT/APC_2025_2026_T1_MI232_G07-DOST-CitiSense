import { faker } from "@faker-js/faker";
import fs from "fs";

type Row = {
  id: number;
  name: string;
  service: string;
  gender: string;
  feedback: string;
  sentiment: string;
};

const services = [
  "Hybrid Seminar",
  "Material Requests",
  "Online Library",
  "Library Tour",
];
const genders = ["M", "F"];
const sentiments = ["Positive", "Neutral", "Negative"];

const randomItem = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function generateData(count: number): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    service: randomItem(services),
    gender: randomItem(genders),
    feedback: faker.lorem.sentence(),
    sentiment: randomItem(sentiments),
  }));
}

const data = generateData(1000);

fs.writeFileSync(
  "./src/mockData.ts",
  `export const mockData1 = ${JSON.stringify(data, null, 2)} as const;`
);
