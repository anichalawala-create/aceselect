import { mockClientProfile, mockTeamMembers } from "@/data/clients";
import { ClientProfile, TeamMember } from "@/types/portal";

export interface IClientService {
  getClientProfile(): Promise<ClientProfile>;
  updateClientProfile(data: Partial<ClientProfile>): Promise<ClientProfile>;
  getTeamMembers(): Promise<TeamMember[]>;
  login(email: string, password: string): Promise<{ success: boolean; user?: ClientProfile; error?: string }>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
}

class ClientServiceImpl implements IClientService {
  private profile: ClientProfile = { ...mockClientProfile };

  async getClientProfile(): Promise<ClientProfile> {
    // Simulated async network delay for CRM API compatibility
    return new Promise((resolve) => setTimeout(() => resolve({ ...this.profile }), 60));
  }

  async updateClientProfile(data: Partial<ClientProfile>): Promise<ClientProfile> {
    this.profile = { ...this.profile, ...data };
    return new Promise((resolve) => setTimeout(() => resolve({ ...this.profile }), 100));
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...mockTeamMembers]), 80));
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: ClientProfile; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email.trim().toLowerCase() === "client@demo.com" && password === "password123") {
          if (typeof window !== "undefined") {
            localStorage.setItem("ace_client_auth", "true");
            localStorage.setItem("ace_client_email", email);
          }
          resolve({ success: true, user: this.profile });
        } else {
          resolve({ success: false, error: "Invalid credentials. Use demo: client@demo.com / password123" });
        }
      }, 150);
    });
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ace_client_auth");
      localStorage.removeItem("ace_client_email");
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("ace_client_auth") === "true";
  }
}

export const clientService: IClientService = new ClientServiceImpl();
