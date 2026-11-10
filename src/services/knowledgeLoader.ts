import fs from 'fs';
import path from 'path';

interface KnowledgeBase {
  personality: string;
  info: string;
}

let cachedKnowledge: KnowledgeBase | null = null;

function resolveFilePath(filenames: string[]): string {
  const searchRoots = [
    process.cwd(),
    path.join(process.cwd(), '..'),
    path.dirname(process.cwd()),
  ];

  for (const root of searchRoots) {
    for (const filename of filenames) {
      const candidate = path.join(root, filename);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  throw new Error(`Knowledge file not found. Looked for [${filenames.join(', ')}] in [${searchRoots.join(', ')}]`);
}

export function loadKnowledge(): KnowledgeBase {
  if (cachedKnowledge) {
    return cachedKnowledge;
  }

  try {
    const personalityPath = resolveFilePath(['personality.md']);
    const infoPath = resolveFilePath(['info.md', 'about.md', 'info/about.md']);

    const personality = fs.readFileSync(personalityPath, 'utf-8').trim();
    const info = fs.readFileSync(infoPath, 'utf-8').trim();

    if (!personality) {
      throw new Error('personality.md is empty');
    }
    if (!info) {
      throw new Error('info.md / about.md is empty');
    }

    cachedKnowledge = { personality, info };
    return cachedKnowledge;
  } catch (error) {
    console.error('[KnowledgeLoader] Failed to load knowledge files:', error);
    throw error;
  }
}
