import { useEffect, useRef, useState } from 'react';
import { Dirs, FileSystem, Util } from 'react-native-file-access';

export const REPLACEMENT_FILE_EXTENSION = 'replacement';

type Props = {
  parentFolder: string;
};

export default function useReplaceableFile({
  parentFolder: parentFolderName,
}: Props) {
  const [fileName, setFileName] = useState<string>();
  const [ready, setReady] = useState(false);
  const replacementFileNameRef = useRef<string>();

  const parentFolder = `${Dirs.DocumentDir}/${parentFolderName}`;
  const fullPath = (name: string) => `${parentFolder}/${name}`;

  async function onMount() {
    // Create parentFolder if needed
    const [parentFolderExists, parentFolderIsDirectory] = await Promise.all([
      FileSystem.exists(parentFolder),
      FileSystem.isDir(parentFolder),
    ]);

    if (!parentFolderExists) {
      await FileSystem.mkdir(parentFolder);
    } else if (parentFolderIsDirectory) {
      // Check the parent folder for non-replacement files. If more than one
      // exists, use the lexicographically last, which is likely to be the
      // newest if the filename contains a timestamp
      const fileNames = await FileSystem.ls(parentFolder);
      const nonReplacementFileName = fileNames.sort().reverse()
        .find((name) => (Util.extname(name) !== REPLACEMENT_FILE_EXTENSION));

      if (nonReplacementFileName) {
        setFileName(nonReplacementFileName);
      }

      // Remove any other files in the parent folder
      const unlinkOtherFilePathPromises = fileNames
        .filter((name) => (name !== nonReplacementFileName))
        .map(fullPath)
        .map(FileSystem.unlink);
      await Promise.all(unlinkOtherFilePathPromises);
    } else {
      throw new Error('Expected parentFolder to be a directory');
    }

    setReady(true);
  }

  useEffect(() => { onMount().catch(console.error); }, []);

  async function createReplacement({ name }: { name: string }) {
    const replacementFileName = `${name}.${REPLACEMENT_FILE_EXTENSION}`;
    await FileSystem.writeFile(fullPath(replacementFileName), '');
    replacementFileNameRef.current = replacementFileName;
  }

  async function appendToReplacement({ data }: { data: string }) {
    const replacementFileName = replacementFileNameRef.current;
    if (!replacementFileName) {
      throw new Error('Must create replacement file before appending to it');
    }

    await FileSystem.appendFile(fullPath(replacementFileName), data);
  }

  async function commitReplacement() {
    const replacementFileName = replacementFileNameRef.current;
    if (!replacementFileName) {
      throw new Error('Must create replacement file before committing it');
    }

    let backupFileName: string | undefined;
    if (fileName) {
      backupFileName = `${fileName}.backup`;
      await FileSystem.mv(fullPath(fileName), fullPath(backupFileName));
    }

    const suffix = `.${REPLACEMENT_FILE_EXTENSION}`;
    const newFileName = replacementFileName.replace(suffix, '');
    try {
      await FileSystem.mv(fullPath(replacementFileName), fullPath(newFileName));
      setFileName(newFileName);
      replacementFileNameRef.current = undefined;
    } catch (e) {
      if (fileName && backupFileName) {
        await FileSystem.mv(fullPath(backupFileName), fullPath(fileName));
      }

      throw e;
    }

    if (backupFileName) {
      await FileSystem.unlink(fullPath(backupFileName));
    }
  }

  const filePath = fileName ? fullPath(fileName) : undefined;
  return {
    appendToReplacement, commitReplacement, createReplacement, filePath, ready,
  };
}
