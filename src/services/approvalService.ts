import { mockApprovals } from "@/data/approvals";
import { ApprovalItem, ApprovalStatus } from "@/types/portal";

export interface IApprovalService {
  getApprovals(): Promise<ApprovalItem[]>;
  getApprovalById(id: string): Promise<ApprovalItem | null>;
  approveItem(id: string, comment?: string): Promise<ApprovalItem>;
  requestChanges(id: string, notes: string): Promise<ApprovalItem>;
  getPendingCount(): Promise<number>;
}

class ApprovalServiceImpl implements IApprovalService {
  private approvals: ApprovalItem[] = [...mockApprovals];

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ace_mock_approvals");
        if (stored) {
          this.approvals = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Failed to load stored approvals", e);
      }
    }
  }

  private saveState() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ace_mock_approvals", JSON.stringify(this.approvals));
      } catch (e) {
        console.error("Failed to save approvals", e);
      }
    }
  }

  async getApprovals(): Promise<ApprovalItem[]> {
    this.loadState();
    return new Promise((resolve) => setTimeout(() => resolve([...this.approvals]), 70));
  }

  async getApprovalById(id: string): Promise<ApprovalItem | null> {
    this.loadState();
    const item = this.approvals.find((a) => a.id === id);
    return new Promise((resolve) => setTimeout(() => resolve(item ? { ...item } : null), 60));
  }

  async approveItem(id: string, comment?: string): Promise<ApprovalItem> {
    this.loadState();
    const index = this.approvals.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Approval not found");

    const updated: ApprovalItem = {
      ...this.approvals[index],
      status: "APPROVED" as ApprovalStatus,
      comments: [
        ...(this.approvals[index].comments || []),
        {
          author: "Rohit Sharma",
          role: "Client Reviewer",
          date: "Just now",
          message: comment || "Approved by client for execution.",
        },
      ],
    };

    this.approvals[index] = updated;
    this.saveState();
    return new Promise((resolve) => setTimeout(() => resolve({ ...updated }), 100));
  }

  async requestChanges(id: string, notes: string): Promise<ApprovalItem> {
    this.loadState();
    const index = this.approvals.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Approval not found");

    const updated: ApprovalItem = {
      ...this.approvals[index],
      status: "CHANGES_REQUESTED" as ApprovalStatus,
      comments: [
        ...(this.approvals[index].comments || []),
        {
          author: "Rohit Sharma",
          role: "Client Reviewer",
          date: "Just now",
          message: notes,
        },
      ],
    };

    this.approvals[index] = updated;
    this.saveState();
    return new Promise((resolve) => setTimeout(() => resolve({ ...updated }), 100));
  }

  async getPendingCount(): Promise<number> {
    this.loadState();
    return this.approvals.filter((a) => a.status === "PENDING").length;
  }
}

export const approvalService: IApprovalService = new ApprovalServiceImpl();
