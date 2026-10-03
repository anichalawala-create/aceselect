import { mockProjects } from "@/data/projects";
import { Project, DashboardStats } from "@/types/portal";

export interface IProjectService {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  getActiveProjects(): Promise<Project[]>;
  getDashboardStats(): Promise<DashboardStats>;
}

class ProjectServiceImpl implements IProjectService {
  private projects: Project[] = [...mockProjects];

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.projects]), 80));
  }

  async getProjectById(id: string): Promise<Project | null> {
    const proj = this.projects.find((p) => p.id === id || p.slug === id);
    return new Promise((resolve) => setTimeout(() => resolve(proj ? { ...proj } : null), 70));
  }

  async getActiveProjects(): Promise<Project[]> {
    const active = this.projects.filter((p) => p.status !== "COMPLETED");
    return new Promise((resolve) => setTimeout(() => resolve([...active]), 60));
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          activeProjects: 6,
          activeSites: 389,
          pendingApprovals: 8,
          completedSites: 327,
          totalSites: 389,
          sitesBreakdown: {
            completed: 327,
            inProgress: 52,
            pending: 10,
            delayed: 0,
          },
        });
      }, 70);
    });
  }
}

export const projectService: IProjectService = new ProjectServiceImpl();
