import { notFound } from "next/navigation";

export default function AgreementPage() {
    // This page is deprecated as Agreements are now linked to Purchases.
    // Users should view agreements from their Orders page.
    return notFound();
}
