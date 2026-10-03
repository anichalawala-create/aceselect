import { mockSites } from "@/data/sites";
import { Site } from "@/types/portal";

export interface ISiteService {
  getSites(): Promise<Site[]>;
  getSiteById(id: string): Promise<Site | null>;
  getSitesByProject(projectId: string): Promise<Site[]>;
  filterSites(params: {
    search?: string;
    city?: string;
    status?: string;
    projectId?: string;
  }): Promise<Site[]>;
}

class SiteServiceImpl implements ISiteService {
  private sites: Site[] = [...mockSites];

  async getSites(): Promise<Site[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...this.sites]), 80));
  }

  async getSiteById(id: string): Promise<Site | null> {
    const site = this.sites.find((s) => s.id === id || s.code.toLowerCase() === id.toLowerCase());
    return new Promise((resolve) => setTimeout(() => resolve(site ? { ...site } : null), 70));
  }

  async getSitesByProject(projectId: string): Promise<Site[]> {
    const projectSites = this.sites.filter((s) => s.projectId === projectId);
    return new Promise((resolve) => setTimeout(() => resolve([...projectSites]), 60));
  }

  async filterSites(params: {
    search?: string;
    city?: string;
    status?: string;
    projectId?: string;
  }): Promise<Site[]> {
    let result = [...this.sites];

    if (params.projectId && params.projectId !== "all") {
      result = result.filter((s) => s.projectId === params.projectId);
    }

    if (params.city && params.city !== "all") {
      result = result.filter((s) => s.city.toLowerCase() === params.city?.toLowerCase());
    }

    if (params.status && params.status !== "all") {
      result = result.filter((s) => s.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params.search && params.search.trim() !== "") {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.assignedTeam.toLowerCase().includes(q) ||
          s.projectName.toLowerCase().includes(q)
      );
    }

    return new Promise((resolve) => setTimeout(() => resolve(result), 80));
  }
}

export const siteService: ISiteService = new SiteServiceImpl();
