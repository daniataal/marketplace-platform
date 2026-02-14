import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import PendingExportsList from "@/components/admin/PendingExportsList";

export default async function ExportsPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    // Fetch all pending exports with related data
    const pendingExports = await prisma.pendingExport.findMany({
        where: {
            status: "PENDING"
        },
        include: {
            deal: {
                select: {
                    company: true,
                    commodity: true,
                    type: true,
                    purity: true
                }
            },
            purchase: {
                select: {
                    id: true,
                    quantity: true,
                    totalPrice: true,
                    createdAt: true,
                    buyer: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Get counts for status badges
    const statusCounts = await prisma.pendingExport.groupBy({
        by: ['status'],
        _count: true
    });

    const pendingCount = statusCounts.find(s => s.status === 'PENDING')?._count || 0;
    const approvedCount = statusCounts.find(s => s.status === 'APPROVED')?._count || 0;
    const rejectedCount = statusCounts.find(s => s.status === 'REJECTED')?._count || 0;
    const exportedCount = statusCounts.find(s => s.status === 'EXPORTED')?._count || 0;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Crowdfunding Exports</h1>
                <p className="text-muted-foreground mt-1">
                    Review and approve purchase exports before they go live on the crowdfunding platform
                </p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Review</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{pendingCount}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Exported</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{exportedCount}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Approved</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{approvedCount}</p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Rejected</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{rejectedCount}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Pending Exports List */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Pending Exports</h2>
                {pendingExports.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No pending exports to review</p>
                        <p className="text-sm text-muted-foreground mt-1">New purchase exports will appear here for admin review</p>
                    </div>
                ) : (
                    <PendingExportsList exports={pendingExports} />
                )}
            </div>
        </div>
    );
}
