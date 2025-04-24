import { loadEnvFile } from "process";
import { getScheduleForGroup } from ".";

async function main() {
  loadEnvFile('./.env.local');
  const schedule = await getScheduleForGroup('00000b59-0000-0000-0000-000000000000');
  console.log(JSON.stringify(schedule));
}

void main();