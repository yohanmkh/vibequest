// File system manager for dynamic file tree
import { FileNode, FileSystemState, GeneratedCode } from '../types/enhanced';

export class FileSystemManager {
  private state: FileSystemState = {
    files: [],
    selectedFile: null,
    openFiles: [],
  };

  /**
   * Initialize file system with project structure
   */
  initializeProject(_stack: string): FileSystemState {
    const baseStructure: FileNode[] = [
      {
        path: 'src',
        name: 'src',
        type: 'directory',
        children: [
          {
            path: 'src/components',
            name: 'components',
            type: 'directory',
            children: [],
          },
          {
            path: 'src/api',
            name: 'api',
            type: 'directory',
            children: [],
          },
          {
            path: 'src/types',
            name: 'types',
            type: 'directory',
            children: [],
          },
        ],
      },
      {
        path: 'public',
        name: 'public',
        type: 'directory',
        children: [],
      },
      {
        path: 'package.json',
        name: 'package.json',
        type: 'file',
        language: 'json',
        content: JSON.stringify({
          name: 'my-app',
          version: '1.0.0',
          scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
          },
        }, null, 2),
      },
    ];

    this.state.files = baseStructure;
    return this.state;
  }

  /**
   * Add a file to the file system
   */
  addFile(generatedCode: GeneratedCode): void {
    const pathParts = generatedCode.filePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const directoryPath = pathParts.slice(0, -1).join('/');

    const fileNode: FileNode = {
      path: generatedCode.filePath,
      name: fileName,
      type: 'file',
      content: generatedCode.content,
      language: generatedCode.language,
      status: 'new',
    };

    // Find or create directory structure
    let currentLevel = this.state.files;
    const dirParts = directoryPath.split('/').filter(Boolean);

    for (const dirPart of dirParts) {
      let dir = currentLevel.find(
        (node) => node.name === dirPart && node.type === 'directory'
      );

      if (!dir) {
        dir = {
          path: dirParts.slice(0, dirParts.indexOf(dirPart) + 1).join('/'),
          name: dirPart,
          type: 'directory',
          children: [],
        };
        currentLevel.push(dir);
      }

      currentLevel = dir.children || [];
    }

    // Add file to the appropriate directory
    const parentDir = this.findDirectory(directoryPath);
    if (parentDir) {
      if (!parentDir.children) {
        parentDir.children = [];
      }
      parentDir.children.push(fileNode);
    } else {
      // If directory doesn't exist, add to root
      this.state.files.push(fileNode);
    }

    // Mark as new file
    fileNode.status = 'new';
  }

  /**
   * Update file content
   */
  updateFile(filePath: string, content: string): void {
    const file = this.findFile(filePath);
    if (file) {
      file.content = content;
      file.status = file.status === 'new' ? 'new' : 'modified';
    }
  }

  /**
   * Get file content
   */
  getFileContent(filePath: string): string | null {
    const file = this.findFile(filePath);
    return file?.content || null;
  }

  /**
   * Open a file (add to openFiles)
   */
  openFile(filePath: string): void {
    if (!this.state.openFiles.includes(filePath)) {
      this.state.openFiles.push(filePath);
    }
    this.state.selectedFile = filePath;
  }

  /**
   * Close a file
   */
  closeFile(filePath: string): void {
    this.state.openFiles = this.state.openFiles.filter((path) => path !== filePath);
    if (this.state.selectedFile === filePath) {
      this.state.selectedFile = this.state.openFiles[this.state.openFiles.length - 1] || null;
    }
  }

  /**
   * Get current state
   */
  getState(): FileSystemState {
    return { ...this.state };
  }

  /**
   * Get all files as a flat list
   */
  getAllFiles(): FileNode[] {
    const files: FileNode[] = [];
    
    const traverse = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.type === 'file') {
          files.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(this.state.files);
    return files;
  }

  /**
   * Find a file by path
   */
  private findFile(filePath: string): FileNode | null {
    const allFiles = this.getAllFiles();
    return allFiles.find((file) => file.path === filePath) || null;
  }

  /**
   * Find a directory by path
   */
  private findDirectory(dirPath: string): FileNode | null {
    const parts = dirPath.split('/').filter(Boolean);
    let current: FileNode[] = this.state.files;

    for (const part of parts) {
      const node = current.find((n) => n.name === part && n.type === 'directory');
      if (!node) return null;
      current = node.children || [];
    }

    return current.length > 0 ? { path: dirPath, name: parts[parts.length - 1], type: 'directory', children: current } : null;
  }

  /**
   * Get file tree structure for rendering
   */
  getFileTree(): FileNode[] {
    return this.state.files;
  }

  /**
   * Mark files as committed (for git simulation)
   */
  markAsCommitted(filePaths: string[]): void {
    filePaths.forEach((path) => {
      const file = this.findFile(path);
      if (file) {
        file.status = 'unchanged';
      }
    });
  }
}

export const fileSystemManager = new FileSystemManager();

