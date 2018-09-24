import { FilenamePipe } from './filename.pipe';

describe('Pipe: Filename', () => {
  let pipe: FilenamePipe;

  beforeEach(() => {
    pipe = new FilenamePipe();
  });

  it('providing no changes on simple filename', () => {
    expect(pipe.transform('file.pdf')).toEqual('file.pdf');
  });

  it('providing filename on Windows route', () => {
    expect(pipe.transform('C:\\Folder\\file.pdf')).toEqual('file.pdf');
  });

  it('providing filename on Linux route', () => {
    expect(pipe.transform('/home/Folder/file.pdf')).toEqual('file.pdf');
  });
});
