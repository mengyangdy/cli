import {ChangelogOption} from "../types";
import {generateChangelog, generateTotalChangelog} from "../utils/changelog";

export async function genChangelog(options?: Partial<ChangelogOption>, total = false) {
  if (total) {
    await generateTotalChangelog(options);
  } else {
    await generateChangelog(options);
  }
}
