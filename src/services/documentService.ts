import { mockDocuments } from "@/data/documents";
import { DocumentItem } from "@/types/portal";

export interface IDocumentService {
  getDocuments(): Promise<DocumentItem[]>;
  getDocumentsByCategory(category: string): Promise<DocumentItem[]>;
  getDocumentsByProject(projectId: string): Promise<DocumentItem[]>;
}

class DocumentServiceImpl implements IDocumentService {
  private documents: DocumentItem[] = [...mockDocuments];

  async getDocuments(): Promise<DocumentItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.documents]), 70));
  }

  async getDocumentsByCategory(category: string): Promise<DocumentItem[]> {
    if (!category || category === "All") {
      return new Promise((resolve) => setTimeout(() => resolve([...this.documents]), 60));
    }
    const filtered = this.documents.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    return new Promise((resolve) => setTimeout(() => resolve([...filtered]), 60));
  }

  async getDocumentsByProject(projectId: string): Promise<DocumentItem[]> {
    const list = this.documents.filter((d) => d.projectId === projectId);
    return new Promise((resolve) => setTimeout(() => resolve([...list]), 60));
  }
}

export const documentService: IDocumentService = new DocumentServiceImpl();
