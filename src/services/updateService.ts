import { mockUpdates } from "@/data/updates";
import { ProjectUpdate } from "@/types/portal";

export interface IUpdateService {
  getRecentUpdates(limit?: number): Promise<ProjectUpdate[]>;
  getAllUpdates(): Promise<ProjectUpdate[]>;
  getUpdatesByProject(projectId: string): Promise<ProjectUpdate[]>;
}

class UpdateServiceImpl implements IUpdateService {
  private updates: ProjectUpdate[] = [...mockUpdates];

  async getRecentUpdates(limit = 5): Promise<ProjectUpdate[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.updates.slice(0, limit)), 60));
  }

  async getAllUpdates(): Promise<ProjectUpdate[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.updates]), 70));
  }

  async getUpdatesByProject(projectId: string): Promise<ProjectUpdate[]> {
    const list = this.updates.filter((u) => u.projectId === projectId);
    return new Promise((resolve) => setTimeout(() => resolve([...list]), 60));
  }
}

export const updateService: IUpdateService = new UpdateServiceImpl();
