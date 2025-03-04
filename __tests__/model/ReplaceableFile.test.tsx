import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
import useReplaceableFile, {
  REPLACEMENT_FILE_EXTENSION,
} from '../../app/model/ReplaceableFile';

const data = 'data';
const name = 'foo.csv';
const parentFolder = 'fake-folder';
const parentFolderPath = `${Dirs.DocumentDir}/${parentFolder}`;
const fullPath = (fileName: string) => `${parentFolderPath}/${fileName}`;

describe('useReplaceableFile', () => {
  beforeEach(() => {
    ((FileSystem as any).filesystem).clear();
  });

  it('filePath should not be set if parentFolder did not exist', async () => {
    const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.filePath).toBeUndefined();
  });

  it('filePath should not be set if no files exist in parentFolder', async () => {
    await FileSystem.mkdir(parentFolderPath);
    const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.filePath).toBeUndefined();
  });

  it('filePath should not be set if only replacement files exists in parentFolder', async () => {
    const replacementFileName = `foo.${REPLACEMENT_FILE_EXTENSION}`;
    await Promise.all([
      FileSystem.mkdir(parentFolderPath),
      FileSystem.writeFile(fullPath(replacementFileName), ''),
    ]);
    const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.filePath).toBeUndefined();
  });

  it('filePath should be set if non-replacement file exists in parentFolder', async () => {
    const filePath = fullPath(name);
    await Promise.all([
      FileSystem.mkdir(parentFolderPath),
      FileSystem.writeFile(filePath, ''),
    ]);
    const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.filePath).toBe(filePath);
  });

  it('filePath should be set from lexicographically last non-replacement file that exists in parentFolder', async () => {
    const expectedPath = fullPath('b.csv');
    await Promise.all([
      FileSystem.mkdir(parentFolderPath),
      FileSystem.writeFile(fullPath('a.csv'), ''),
      FileSystem.writeFile(expectedPath, ''),
      FileSystem.writeFile(fullPath(`c.${REPLACEMENT_FILE_EXTENSION}`), ''),
    ]);
    const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.filePath).toBe(expectedPath);
  });

  it('all other files should be removed on mount', async () => {
    const expectedPath = fullPath('b.csv');
    await Promise.all([
      FileSystem.mkdir(parentFolderPath),
      FileSystem.writeFile(fullPath('a.csv'), ''),
      FileSystem.writeFile(expectedPath, ''),
      FileSystem.writeFile(fullPath(`c.${REPLACEMENT_FILE_EXTENSION}`), ''),
    ]);
    const initialFileNames = await FileSystem.ls(parentFolderPath);
    expect(initialFileNames.length).toBe(3);

    const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
    await waitFor(() => expect(result.current.ready).toBe(true));
    const fileNames = await FileSystem.ls(parentFolderPath);
    expect(fileNames.length).toBe(1);
    expect(result.current.filePath).toBe(expectedPath);
  });

  describe('createReplacement', () => {
    async function setupCreateReplacement() {
      const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
      await waitFor(() => expect(result.current.ready).toBe(true));
      await act(() => result.current.createReplacement({ name }));
      return result;
    }

    it('should create a file with the given name suffixed with REPLACEMENT_FILE_SUFFIX', async () => {
      await setupCreateReplacement();
      const fileNames = await FileSystem.ls(parentFolderPath);
      expect(fileNames.length).toBe(1);
      expect(fileNames[0]).toBe(`${name}.${REPLACEMENT_FILE_EXTENSION}`);
    });

    it('should create an empty file', async () => {
      await setupCreateReplacement();
      const fileNames = await FileSystem.ls(parentFolderPath);
      expect(fileNames.length).toBe(1);
      const contents = await FileSystem.readFile(fullPath(fileNames[0]));
      expect(contents).toBe('');
    });

    it('should not update filePath', async () => {
      const result = await setupCreateReplacement();
      expect(result.current.filePath).toBeUndefined();
    });
  });

  describe('appendToReplacement', () => {
    async function setupAppendToReplacement() {
      const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
      await waitFor(() => expect(result.current.ready).toBe(true));
      return result;
    }

    it("should throw if createReplacement hasn't been called", async () => {
      const result = await setupAppendToReplacement();
      expect(act(() => result.current.appendToReplacement({ data })))
        .rejects.toBeTruthy();
    });

    it('should append data to the replacement file', async () => {
      const result = await setupAppendToReplacement();
      await act(() => result.current.createReplacement({ name }));
      await act(() => result.current.appendToReplacement({ data }));
      await act(() => result.current.appendToReplacement({ data }));
      const fileNames = await FileSystem.ls(parentFolderPath);
      expect(fileNames.length).toBe(1);
      const contents = await FileSystem.readFile(fullPath(fileNames[0]));
      expect(contents).toBe(data + data);
    });

    it('should not update filePath', async () => {
      const result = await setupAppendToReplacement();
      await act(() => result.current.createReplacement({ name }));
      await act(() => result.current.appendToReplacement({ data }));
      expect(result.current.filePath).toBeUndefined();
    });
  });

  describe('commitReplacement', () => {
    async function setupCommitReplacement() {
      const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
      await waitFor(() => expect(result.current.ready).toBe(true));
      await act(() => result.current.createReplacement({ name }));
      return result;
    }

    it("should throw if createReplacement hasn't been called", async () => {
      const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
      await waitFor(() => expect(result.current.ready).toBe(true));
      expect(act(() => result.current.commitReplacement()))
        .rejects.toBeTruthy();
    });

    it('should not modify the file contents', async () => {
      const result = await setupCommitReplacement();
      await act(() => result.current.appendToReplacement({ data }));
      await act(() => result.current.commitReplacement());
      const fileNames = await FileSystem.ls(parentFolderPath);
      expect(fileNames.length).toBe(1);
      const contents = await FileSystem.readFile(fullPath(fileNames[0]));
      expect(contents).toBe(data);
    });

    it('should update the filePath', async () => {
      const result = await setupCommitReplacement();
      expect(result.current.filePath).toBeUndefined();
      await act(() => result.current.commitReplacement());
      expect(result.current.filePath?.endsWith(name)).toBe(true);
    });

    it('should remove the previous file', async () => {
      const initialPath = fullPath(name);
      await Promise.all([
        FileSystem.mkdir(parentFolderPath),
        FileSystem.writeFile(initialPath, ''),
      ]);
      const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
      await waitFor(() => expect(result.current.ready).toBe(true));
      expect(result.current.filePath).toEqual(initialPath);

      const newName = 'newName';
      await act(() => result.current.createReplacement({ name: newName }));
      await act(() => result.current.commitReplacement());
      const fileNames = await FileSystem.ls(parentFolderPath);
      expect(fileNames.length).toBe(1);
      expect(fileNames[0]).toBe(newName);
    });

    it('should throw on attempt to append after committing', async () => {
      const result = await setupCommitReplacement();
      await act(() => result.current.commitReplacement());
      expect(act(() => result.current.appendToReplacement({ data })))
        .rejects.toBeTruthy();
    });

    describe('on commit errors', () => {
      async function setupCommitReplacementWithErrors({
        initialFileData, initialFilePath,
      }: { initialFileData: string, initialFilePath: string }) {
        await Promise.all([
          FileSystem.mkdir(parentFolderPath),
          FileSystem.writeFile(initialFilePath, initialFileData),
        ]);
        const { result } = renderHook(() => useReplaceableFile({ parentFolder }));
        await waitFor(() => expect(result.current.ready).toBe(true));
        expect(result.current.filePath).toEqual(initialFilePath);

        const newName = 'newName';
        await act(() => result.current.createReplacement({ name: newName }));
        FileSystem.mv = jest.fn()
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce('test error');
        expect(act(() => result.current.commitReplacement()))
          .rejects.toBeTruthy();
        return result;
      }

      it('should not update filePath if there is an issue committing', async () => {
        const initialFilePath = fullPath(name);
        const initialFileData = 'data';
        const result = await setupCommitReplacementWithErrors({
          initialFileData, initialFilePath,
        });
        expect(result.current.filePath).toBe(initialFilePath);
      });

      it('should not modify the previous file if there is an issue committing', async () => {
        const initialFilePath = fullPath(name);
        const initialFileData = 'data';
        await setupCommitReplacementWithErrors({
          initialFileData, initialFilePath,
        });
        const contents = await FileSystem.readFile(initialFilePath);
        expect(contents).toBe(initialFileData);
      });
    });
  });
});
